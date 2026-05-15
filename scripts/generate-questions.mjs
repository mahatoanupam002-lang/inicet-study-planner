/**
 * Daily INI-CET / NEET PG question generator.
 *
 * Generates ~520 high-yield questions via Groq (free tier, Llama 3.3 70B) and
 * writes them to deploy/public/daily-questions.json — Vercel serves this as a
 * static asset.
 *
 * Required env var:
 *   GROQ_API_KEY   (free at console.groq.com — no billing required)
 *
 * Optional env var:
 *   BATCH_DATE_OFFSET   number of days to subtract from today (for bulk-seed)
 */

import Groq from "groq-sdk";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir  = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dir, "..", "deploy", "public", "daily-questions.json");
const NOTES_DIR = join(__dir, "..", "notes");

// ─── Load student notes as source material ────────────────────────────────────

function loadNotes() {
  if (!existsSync(NOTES_DIR)) return "";
  const files = readdirSync(NOTES_DIR).filter(f => f.endsWith(".md")).sort();
  return files.map(f => readFileSync(join(NOTES_DIR, f), "utf8")).join("\n\n---\n\n");
}

const STUDENT_NOTES = loadNotes();
const HAS_NOTES = STUDENT_NOTES.trim().length > 0;
if (HAS_NOTES) console.log(`  Loaded ${STUDENT_NOTES.length} chars of student notes as source material\n`);

// ─── Config ───────────────────────────────────────────────────────────────────

const BATCH_SIZE = 40; // per subject call (~520 total across 13 subjects)

const SUBJECTS = [
  {
    name: "Medicine",
    topics: "Cardiology, Nephrology, Neurology, Endocrinology, Gastroenterology, Pulmonology, Rheumatology",
  },
  {
    name: "Surgery",
    topics: "Hernias, Appendicitis, Bowel obstruction, Hepatobiliary, Breast & Thyroid, Orthopedics, Urology, Vascular",
  },
  {
    name: "Pathology",
    topics: "Cell injury, Inflammation, Healing, Neoplasia, Hematology, Systemic pathology, Immunopathology",
  },
  {
    name: "Pharmacology",
    topics: "ANS, CNS drugs, Cardiovascular drugs, Antibiotics, Endocrine pharmacology, Chemotherapy, Pharmacokinetics",
  },
  {
    name: "OBG",
    topics: "Normal labor, Antepartum hemorrhage, Preeclampsia, High-risk pregnancy, PCOS, Fibroids, Ovarian tumors, Contraception",
  },
  {
    name: "Paediatrics",
    topics: "Neonatology, Growth & development milestones, Nutrition, Pediatric infections, Vaccines, Congenital heart diseases",
  },
  {
    name: "PSM/Community Medicine",
    topics: "Epidemiology, Biostatistics, National health programs, Nutrition, Environmental health, Screening tests",
  },
  {
    name: "Microbiology",
    topics: "Bacteriology, Virology, Mycology, Parasitology, Immunology, Clinical diagnostic methods",
  },
  {
    name: "Forensic Medicine",
    topics: "Thanatology, Medico-legal aspects, Wounds, Toxicology, Sexual offences, Age estimation",
  },
  {
    name: "Anatomy",
    topics: "Upper & lower limb, Thorax & abdomen, Head & neck, Neuroanatomy, Embryology, Histology",
  },
  {
    name: "Physiology",
    topics: "Cardiovascular, Renal, Respiratory, Neurophysiology, Endocrine, GIT physiology",
  },
  {
    name: "Biochemistry",
    topics: "Carbohydrate metabolism, Lipid metabolism, Protein & amino acids, Vitamins & minerals, Molecular biology, Enzymes",
  },
  {
    name: "ENT/Ophthalmology",
    topics: "Ear diseases, Nose & sinuses, Throat & larynx, Cornea & glaucoma, Retina, Neuro-ophthalmology",
  },
];

// ─── Groq client ─────────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(subject) {
  const textCount  = BATCH_SIZE - 5;
  const imageCount = 5;

  const notesBlock = HAS_NOTES ? `
## STUDENT'S NOTES (Primary Source — prioritise testing these exact facts)
${STUDENT_NOTES}

---
Use the student's notes above as your PRIMARY source. At least 60% of questions must directly test facts, tables, mnemonics, or concepts from these notes. The remaining questions can cover other high-yield topics for the subject.
` : "";

  return `You are a senior medical educator creating a rank-1 INI-CET / NEET PG question bank.

Generate exactly ${BATCH_SIZE} MCQs for: **${subject.name}**
Cover these topics proportionally: ${subject.topics}
${notesBlock}
${textCount} of the questions should be standard text-based MCQs.
${imageCount} of the questions should be IMAGE-BASED clinical scenario questions where a student would be shown an ECG, X-ray, histology slide, ophthalmoscopy image, or clinical photograph. For these, describe the key finding in the question stem. Mark these with "is_image_based": true and set "image_type" to one of: "ECG", "X-ray", "CT", "MRI", "histology", "fundoscopy", "clinical_photo", "ultrasound".

Each question must:
• Mirror the exact NEET PG / INI-CET / AIIMS PG pattern (2019–2024 papers)
• Have ONE correct answer and THREE plausible distractors
• Include a thorough explanation (mention WHY correct, and WHY each wrong option fails)
• Include a concise mnemonic where one exists (null otherwise)
• State the key testable concept in one sentence
• Label difficulty: easy=pure recall, medium=application, hard=multi-step reasoning
• Provide an approximate exam source like "INI-CET Nov 2023" or "AIIMS May 2022"

Return ONLY a valid JSON array — no markdown, no code fences, no commentary:
[{
  "topic": "string",
  "question": "string",
  "options": ["string","string","string","string"],
  "correct_answer": 0,
  "explanation": "string",
  "mnemonic": "string or null",
  "key_concept": "string",
  "difficulty": "easy|medium|hard",
  "exam_hint": "string",
  "is_image_based": false,
  "image_type": null
}]`;
}

// ─── Per-subject generation ───────────────────────────────────────────────────

async function generateForSubject(subject, batchDate) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: buildPrompt(subject) }],
    temperature: 0.7,
    max_tokens: 8192,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // Strip markdown code fences if model wraps with them
  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const match    = stripped.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");

  const parsed = JSON.parse(match[0]);

  return parsed
    .filter(q =>
      typeof q.question === "string" &&
      Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correct_answer === "number"
    )
    .map(q => ({
      id:             randomUUID(),
      subject:        subject.name,
      topic:          q.topic            ?? subject.name,
      question:       q.question,
      options:        q.options,
      correct_answer: Math.min(3, Math.max(0, Math.round(q.correct_answer))),
      explanation:    q.explanation      ?? "",
      mnemonic:       q.mnemonic         ?? null,
      key_concept:    q.key_concept      ?? null,
      difficulty:     ["easy","medium","hard"].includes(q.difficulty) ? q.difficulty : "medium",
      exam_hint:      q.exam_hint        ?? null,
      is_image_based: q.is_image_based   === true,
      image_type:     q.image_type       ?? null,
      batch_date:     batchDate,
    }));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const offsetDays = parseInt(process.env.BATCH_DATE_OFFSET ?? "0");
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const today = d.toISOString().slice(0, 10);
  console.log(`\nINI-CET Daily Question Generator (Groq/Llama) — batch ${today}${offsetDays > 0 ? ` (offset -${offsetDays}d)` : ""}\n`);

  // ── Generate fresh questions ──────────────────────────────────────────────
  let newQuestions = [];
  for (const subject of SUBJECTS) {
    process.stdout.write(`  ${subject.name.padEnd(30)} ... `);
    try {
      const qs = await generateForSubject(subject, today);
      newQuestions.push(...qs);
      const imgCount = qs.filter(q => q.is_image_based).length;
      console.log(`OK ${qs.length} (${imgCount} image-based)`);
    } catch (err) {
      console.log(`FAIL ${err.message}`);
    }
    // Groq free tier: 30 RPM — 2s gap is enough
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`\n  Generated: ${newQuestions.length} questions`);

  // ── Load existing questions and accumulate ────────────────────────────────
  let existing = [];
  if (existsSync(OUTPUT)) {
    try {
      const file = JSON.parse(readFileSync(OUTPUT, "utf8"));
      existing   = file.questions ?? [];
    } catch { /* ignore corrupt file */ }
  }

  const merged  = [...newQuestions, ...existing];
  const batches = [...new Set(merged.map(q => q.batch_date))].sort();

  // ── Write output ──────────────────────────────────────────────────────────
  const output = {
    lastUpdated:  today,
    totalCount:   merged.length,
    todayCount:   newQuestions.length,
    totalDays:    batches.length,
    questions:    merged,
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${merged.length} questions to deploy/public/daily-questions.json\n`);

  if (newQuestions.length < 100) {
    console.error("Fewer than 100 questions generated — treating as failure.");
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
