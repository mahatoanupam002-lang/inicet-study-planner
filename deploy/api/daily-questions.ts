import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

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
  const dayOfYear = Math.floor(
    (new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) / 86400000
  );

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
      "stem": "A 7-year-old girl presents with brief staring spells multiple times daily...",
      "options": ["Phenytoin", "Ethosuximide", "Carbamazepine", "Valproate"],
      "answer": 1,
      "explanation": "Ethosuximide is DOC for pure absence seizures; blocks T-type Ca²⁺ channels in thalamus. Trap: valproate if absence + other seizure types coexist.",
      "prediction": {
        "confidence": "high",
        "rationale": "DOC for absence seizures appeared in NEET PG 2022 and INICET 2023 — recurs every 2 years",
        "topic_frequency": "6/8 recent papers"
      }
    }
  ]
}

Rules:
- "answer" is 0-indexed (0=A, 1=B, 2=C, 3=D)
- Options must be plausible — include the most common wrong answer as a distractor
- Clinical vignette style for Medicine/Surgery/OBG; direct concept for Pharmacology/Physiology
- Emphasise DOC, DOC in pregnancy, first-line, classic presentation, numerical values
- Prediction confidence: "high" = appeared ≥3 times in last 4 years, "medium" = 1-2 times, "low" = trend-based
- All facts correct per Harrison's, Robbins, KDT Pharmacology, Park's PSM (Indian standard)`;
}

function parseJSON(text: string): object {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned);
  }
}

// ── Provider: Google Gemini (free via AI Studio) ───────────────────────────────
async function generateWithGemini(date: string, apiKey: string): Promise<object> {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: buildPrompt(date) }] }],
    generationConfig: { responseMimeType: "application/json", maxOutputTokens: 4096, temperature: 0.4 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return parseJSON(text);
}

// ── Provider: Groq (free, Llama 3.3 70B) ─────────────────────────────────────
async function generateWithGroq(date: string, apiKey: string): Promise<object> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(date) },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  return parseJSON(text);
}

// ── Provider: Anthropic (fallback, paid) ──────────────────────────────────────
async function generateWithAnthropic(date: string, apiKey: string): Promise<object> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(date) }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json() as { content: { type: string; text: string }[] };
  const text = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  return parseJSON(text);
}

// ── Generation with provider fallback ─────────────────────────────────────────
async function generateAndStore(date: string): Promise<object> {
  const geminiKey    = process.env.GEMINI_API_KEY;
  const groqKey      = process.env.GROQ_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !groqKey && !anthropicKey) {
    throw new Error(
      "No AI provider key set. Add GEMINI_API_KEY (free) or GROQ_API_KEY (free) to Vercel environment variables."
    );
  }

  let parsed: object | undefined;
  const errors: string[] = [];

  if (geminiKey) {
    try { parsed = await generateWithGemini(date, geminiKey); } catch (e) { errors.push(`Gemini: ${e}`); }
  }
  if (!parsed && groqKey) {
    try { parsed = await generateWithGroq(date, groqKey); } catch (e) { errors.push(`Groq: ${e}`); }
  }
  if (!parsed && anthropicKey) {
    try { parsed = await generateWithAnthropic(date, anthropicKey); } catch (e) { errors.push(`Anthropic: ${e}`); }
  }

  if (!parsed) throw new Error(`All providers failed: ${errors.join(" | ")}`);

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
