/**
 * Daily INI-CET / NEET PG question generator.
 *
 * Generates ~500 high-yield questions via Claude Haiku and writes them to
 * deploy/public/daily-questions.json — Vercel serves this as a static asset.
 *
 * Required env var:
 *   ANTHROPIC_API_KEY
 *
 * That's it — no database, no extra secrets.
 */

import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir  = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dir, "..", "deploy", "public", "daily-questions.json");

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

// ─── Anthropic client ─────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(subject) {
  return `You are a senior medical educator creating a rank-1 INI-CET / NEET PG question bank.

Generate exactly ${BATCH_SIZE} MCQs for: **${subject.name}**
Cover these topics proportionally: ${subject.topics}

Each question must:
• Mirror the exact NEET PG / INI-CET / AIIMS PG pattern (2019–2024 papers)
• Have ONE correct answer and THREE plausible distractors
• Include a thorough explanation (mention WHY correct, and WHY each wrong option fails)
• Include a concise mnemonic where one exists (null otherwise)
• State the key testable concept in one sentence
• Label difficulty: easy=pure recall, medium=application, hard=multi-step reasoning
• Provide an approximate exam source like "INI-CET Nov 2023" or "AIIMS May 2022"

Return ONLY a valid JSON array — no markdown, no commentary:
[{
  "topic": "string",
  "question": "string",
  "options": ["string","string","string","string"],
  "correct_answer": 0,
  "explanation": "string",
  "mnemonic": "string or null",
  "key_concept": "string",
  "difficulty": "easy|medium|hard",
  "exam_hint": "string"
}]`;
}

async function generateForSubject(subject) {
  const msg = await anthropic.messages.create({
    model:      "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    messages:   [{ role: "user", content: buildPrompt(subject) }],
  });

  const raw   = msg.content[0]?.type === "text" ? msg.content[0].text : "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");

  const today  = new Date().toISOString().slice(0, 10);
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
      topic:          q.topic         ?? subject.name,
      question:       q.question,
      options:        q.options,
      correct_answer: Math.min(3, Math.max(0, Math.round(q.correct_answer))),
      explanation:    q.explanation   ?? "",
      mnemonic:       q.mnemonic      ?? null,
      key_concept:    q.key_concept   ?? null,
      difficulty:     ["easy","medium","hard"].includes(q.difficulty) ? q.difficulty : "medium",
      exam_hint:      q.exam_hint     ?? null,
      batch_date:     today,
    }));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // BATCH_DATE_OFFSET lets the bulk-seed workflow simulate historical batches
  // e.g. offset=3 means "generate as if this were 3 days ago"
  const offsetDays = parseInt(process.env.BATCH_DATE_OFFSET ?? "0");
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const today = d.toISOString().slice(0, 10);
  console.log(`\n🚀 INI-CET Daily Question Generator — batch ${today}${offsetDays > 0 ? ` (offset -${offsetDays}d)` : ""}\n`);

  // ── Generate fresh questions ──────────────────────────────────────────────
  let newQuestions = [];
  for (const subject of SUBJECTS) {
    process.stdout.write(`  ${subject.name.padEnd(30)} … `);
    try {
      const qs = await generateForSubject(subject);
      newQuestions.push(...qs);
      console.log(`✅ ${qs.length}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log(`\n  Generated: ${newQuestions.length} questions`);

  // ── Load existing questions and append (questions stack up over time) ────────
  let existing = [];
  if (existsSync(OUTPUT)) {
    try {
      const file = JSON.parse(readFileSync(OUTPUT, "utf8"));
      existing   = file.questions ?? [];
    } catch { /* ignore corrupt file */ }
  }

  // Keep all previous questions — new ones prepended so today's batch shows first
  const merged = [...newQuestions, ...existing];

  // Count unique batches so we can show "Day N" in the UI
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
  console.log(`\n✅ Wrote ${merged.length} questions to deploy/public/daily-questions.json\n`);

  if (newQuestions.length < 100) {
    console.error("Fewer than 100 questions generated — treating as failure.");
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
