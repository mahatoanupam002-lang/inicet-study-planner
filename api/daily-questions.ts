// Root-level Vercel serverless function — zero npm deps, pure fetch

// SUPABASE_URL is safe to hardcode (public project URL).
// SUPABASE_KEY should be set in Vercel environment variables.
// The anon/publishable key is intentionally public (Supabase security comes from RLS).
const SUPABASE_URL = process.env.SUPABASE_URL || "https://fkqazoltrxmwlareblpi.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// ── Typed interfaces for API responses ──────────────────────────────────────

interface DailyQuestion {
  id: number;
  subject: string;
  topic: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  prediction?: { confidence: string; rationale: string; topic_frequency: string };
}

interface DailyQuestionsPayload {
  date: string;
  theme: string;
  questions: DailyQuestion[];
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

interface GroqResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface AnthropicResponse {
  content?: Array<{ text?: string }>;
}

// ── Supabase REST helpers ────────────────────────────────────────────────────

async function sbRead(date: string): Promise<DailyQuestionsPayload | null> {
  if (!SUPABASE_KEY) return null;
  const res = await fetch(
    // encodeURIComponent prevents any query-param injection via the date value
    `${SUPABASE_URL}/rest/v1/daily_questions?date=eq.${encodeURIComponent(date)}&select=*&limit=1`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as DailyQuestionsPayload[];
  return rows.length > 0 ? rows[0] : null;
}

async function sbWrite(date: string, data: DailyQuestionsPayload): Promise<void> {
  if (!SUPABASE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/daily_questions`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({ date, ...data }),
  });
}

// ── Subject rotation ────────────────────────────────────────────────────────

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
  try { return JSON.parse(text); }
  catch {
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned);
  }
}

// ── AI providers ─────────────────────────────────────────────────────────────

async function withGemini(date: string, apiKey: string): Promise<DailyQuestionsPayload> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildPrompt(date) }] }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 4096, temperature: 0.4 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json() as GeminiResponse;
  return parseJSON(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "") as DailyQuestionsPayload;
}

async function withGroq(date: string, apiKey: string): Promise<DailyQuestionsPayload> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: buildPrompt(date) }],
      response_format: { type: "json_object" },
      max_tokens: 4096,
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json() as GroqResponse;
  return parseJSON(data.choices?.[0]?.message?.content ?? "") as DailyQuestionsPayload;
}

async function withAnthropic(date: string, apiKey: string): Promise<DailyQuestionsPayload> {
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
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json() as AnthropicResponse;
  return parseJSON(data.content?.[0]?.text ?? "") as DailyQuestionsPayload;
}

// ── Generate + store ─────────────────────────────────────────────────────────

async function generateAndStore(date: string): Promise<DailyQuestionsPayload> {
  const geminiKey    = process.env.GEMINI_API_KEY;
  const groqKey      = process.env.GROQ_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!geminiKey && !groqKey && !anthropicKey) {
    throw new Error(
      "No AI provider key set. Add GEMINI_API_KEY (free) or GROQ_API_KEY (free) to Vercel environment variables."
    );
  }

  let parsed: DailyQuestionsPayload | undefined;
  const errors: string[] = [];

  if (geminiKey)    { try { parsed = await withGemini(date, geminiKey); }    catch (e) { errors.push(`Gemini: ${e}`); } }
  if (!parsed && groqKey)      { try { parsed = await withGroq(date, groqKey); }       catch (e) { errors.push(`Groq: ${e}`); } }
  if (!parsed && anthropicKey) { try { parsed = await withAnthropic(date, anthropicKey); } catch (e) { errors.push(`Anthropic: ${e}`); } }

  if (!parsed) throw new Error(`All providers failed: ${errors.join(" | ")}`);

  await sbWrite(date, parsed);
  return parsed;
}

// ── Minimal request/response types (avoids importing @vercel/node at root level) ──

interface Req {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}
interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

// ── Handler ──────────────────────────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req: Req, res: Res) {
  if (req.method !== "GET") { res.status(405).end(); return; }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");

  const rawDate = (req.query?.date as string | undefined) || new Date().toISOString().slice(0, 10);

  // Reject dates that don't match YYYY-MM-DD to prevent injection via URL params
  if (!DATE_RE.test(rawDate)) {
    res.status(400).json({ error: "Invalid date format. Expected YYYY-MM-DD." });
    return;
  }
  const date = rawDate;

  const cached = await sbRead(date);
  if (cached) { res.json(cached); return; }

  try {
    const generated = await generateAndStore(date);
    res.json(generated);
  } catch (err: unknown) {
    res.status(503).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
