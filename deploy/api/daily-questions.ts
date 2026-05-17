import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://fkqazoltrxmwlareblpi.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_r_YTJolEVNR9vQR7oTVENA_7ZADmY3o";

function getSubjectRotation(date: string): string[] {
  const day = new Date(date).getDate();
  const rotations = [
    ["Pharmacology", "Medicine", "Pathology", "OBG", "PSM"],
    ["Pharmacology", "Surgery", "Microbiology", "Paediatrics", "Physiology"],
    ["Pharmacology", "Medicine", "Biochemistry", "OBG", "Forensic"],
    ["Pharmacology", "Surgery", "Pathology", "ENT/Ophth/Derm", "PSM"],
    ["Pharmacology", "Medicine", "Microbiology", "Paediatrics", "Anatomy"],
    ["Pharmacology", "Pathology", "Surgery", "OBG", "Physiology"],
  ];
  return rotations[day % rotations.length];
}

const SYSTEM_PROMPT = `You are a NEET PG question generator for Indian postgraduate medical examinations (November 2026 exam).
Generate clinically accurate single-best-answer MCQs in the style of actual NEET PG papers.
Respond ONLY with valid JSON — no markdown, no explanation outside the JSON.`;

function buildPrompt(date: string): string {
  const subjects = getSubjectRotation(date);
  const dayOfYear = Math.floor((new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) / 86400000);

  return `Generate 10 NEET PG MCQs for date ${date} (day ${dayOfYear} of the year).

Subject distribution for today: ${subjects.join(", ")} — 2 questions each.

For each question include a "prediction" field explaining why this topic is high-yield for Nov 2026 NEET PG based on frequency in 2022/2023/2024/2025 papers.

Return a JSON object with this exact structure:
{
  "date": "${date}",
  "theme": "one-line theme summarising today's focus",
  "questions": [
    {
      "id": 1,
      "subject": "Pharmacology",
      "topic": "Antiepileptics",
      "stem": "A 7-year-old girl presents with...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 1,
      "explanation": "Concise explanation ≤80 words. State the correct answer, mechanism/rationale, and one exam trap.",
      "prediction": {
        "confidence": "high",
        "rationale": "DOC for absence seizures appeared in NEET PG 2022 Q31 and INICET 2023 — recurs every 2 years",
        "topic_frequency": "6/8 recent papers"
      }
    }
  ]
}

Rules:
- "answer" is 0-indexed (0=A, 1=B, 2=C, 3=D)
- Options must be plausible — include the most common wrong answer as a distractor
- Clinical vignette style for Medicine/Surgery/OBG questions; direct concept for Pharmacology/Physiology
- Emphasise DOC, DOC in pregnancy, first-line, classic presentation, numerical values
- Prediction confidence: "high" = appeared ≥3 times in last 4 years, "medium" = 1-2 times, "low" = trend-based
- All facts must be correct as per Harrison's, Robbins, KDT Pharmacology, Park's PSM (Indian standard)`;
}

async function generateAndStore(date: string): Promise<object> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set — add it to Vercel environment variables");

  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildPrompt(date) }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  let parsed: object;
  try {
    parsed = JSON.parse(text);
  } catch {
    // strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    parsed = JSON.parse(cleaned);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  await supabase.from("daily_questions").upsert(
    { date, ...(parsed as Record<string, unknown>) },
    { onConflict: "date", ignoreDuplicates: true }
  );

  return parsed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");

  const date = (req.query.date as string | undefined) || new Date().toISOString().slice(0, 10);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("date", date)
    .single();

  if (!error && data) return res.json(data);

  try {
    const generated = await generateAndStore(date);
    return res.json(generated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(503).json({ error: msg });
  }
}
