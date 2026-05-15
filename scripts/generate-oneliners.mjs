/**
 * Daily INI-CET / NEET PG one-liner generator.
 *
 * Generates 20 high-yield one-liners per subject (13 subjects = 260/day) via
 * Groq (free tier, Llama 3.3 70B) and writes them to deploy/public/oneliners.json.
 * New batches are prepended so the most recent always appears first.
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

const __dir   = dirname(fileURLToPath(import.meta.url));
const OUTPUT  = join(__dir, "..", "deploy", "public", "oneliners.json");
const NOTES_DIR = join(__dir, "..", "notes");

function loadNotes() {
  if (!existsSync(NOTES_DIR)) return "";
  const files = readdirSync(NOTES_DIR).filter(f => f.endsWith(".md")).sort();
  return files.map(f => readFileSync(join(NOTES_DIR, f), "utf8")).join("\n\n---\n\n");
}
const STUDENT_NOTES = loadNotes();
const HAS_NOTES = STUDENT_NOTES.trim().length > 0;

// ─── Config ───────────────────────────────────────────────────────────────────

const PER_SUBJECT = 20;

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

const VALID_CATEGORIES = ["DOC", "mechanism", "side-effect", "value", "classification"];

// ─── Groq client ─────────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(subject) {
  const notesBlock = HAS_NOTES ? `
## STUDENT'S NOTES (Primary Source)
${STUDENT_NOTES}

Prioritise creating one-liners that directly summarise or reinforce the facts, tables, and mnemonics above.
---
` : "";

  return `You are a senior medical educator creating high-yield one-liners for INI-CET / NEET PG exam revision.

Generate exactly ${PER_SUBJECT} one-liner facts for: **${subject.name}**
Cover these topics proportionally: ${subject.topics}
${notesBlock}
Each one-liner must be a terse, memorable exam fact — the kind that appears frequently in MCQ stems or answer keys.

Categories to use:
- DOC        = drug of choice / investigation of choice / treatment of choice
- mechanism  = how a drug/process works
- side-effect = classic or distinguishing adverse effect
- value      = a specific numeric/lab/threshold value to remember
- classification = how something is staged, graded, or classified

Return ONLY a valid JSON array — no markdown, no code fences, no commentary:
[{
  "subject": "${subject.name}",
  "topic": "string (specific sub-topic)",
  "fact": "string (the one-liner itself, concise and direct)",
  "mnemonic": "string or null",
  "category": "DOC|mechanism|side-effect|value|classification"
}]`;
}

// ─── Per-subject generation ───────────────────────────────────────────────────

async function generateForSubject(subject, batchDate) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: buildPrompt(subject) }],
    temperature: 0.6,
    max_tokens: 4096,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  const stripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const match    = stripped.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");

  const parsed = JSON.parse(match[0]);

  return parsed
    .filter(item =>
      typeof item.fact === "string" && item.fact.trim().length > 0
    )
    .map(item => ({
      id:         randomUUID(),
      subject:    subject.name,
      topic:      typeof item.topic === "string" ? item.topic.trim() : subject.name,
      fact:       item.fact.trim(),
      mnemonic:   typeof item.mnemonic === "string" ? item.mnemonic.trim() : null,
      category:   VALID_CATEGORIES.includes(item.category) ? item.category : "DOC",
      batch_date: batchDate,
    }));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const offsetDays = parseInt(process.env.BATCH_DATE_OFFSET ?? "0");
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const today = d.toISOString().slice(0, 10);
  console.log(`\nINI-CET One-Liner Generator (Groq/Llama) — batch ${today}${offsetDays > 0 ? ` (offset -${offsetDays}d)` : ""}\n`);

  // ── Generate fresh one-liners ─────────────────────────────────────────────
  let newOneliners = [];
  for (const subject of SUBJECTS) {
    process.stdout.write(`  ${subject.name.padEnd(30)} ... `);
    try {
      const items = await generateForSubject(subject, today);
      newOneliners.push(...items);
      console.log(`OK ${items.length}`);
    } catch (err) {
      console.log(`FAIL ${err.message}`);
    }
    // Groq free tier: 30 RPM — 2s gap is enough
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log(`\n  Generated: ${newOneliners.length} one-liners`);

  // ── Load existing one-liners and accumulate ───────────────────────────────
  let existing = [];
  if (existsSync(OUTPUT)) {
    try {
      const file = JSON.parse(readFileSync(OUTPUT, "utf8"));
      existing   = file.oneliners ?? [];
    } catch { /* ignore corrupt file */ }
  }

  const merged  = [...newOneliners, ...existing];
  const batches = [...new Set(merged.map(o => o.batch_date))].sort();

  // ── Write output ──────────────────────────────────────────────────────────
  const output = {
    lastUpdated: today,
    totalCount:  merged.length,
    todayCount:  newOneliners.length,
    totalDays:   batches.length,
    oneliners:   merged,
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${merged.length} one-liners to deploy/public/oneliners.json\n`);

  if (newOneliners.length < 100) {
    console.error("Fewer than 100 one-liners generated — treating as failure.");
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
