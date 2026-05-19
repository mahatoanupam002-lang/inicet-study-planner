export type { NeetPGQuestion } from "./neetPG2026Questions_part1";
export { NEET_PG_2026_QUESTIONS as QUESTIONS_PART1 } from "./neetPG2026Questions_part1";
export { NEET_PG_2026_QUESTIONS_PART2 as QUESTIONS_PART2 } from "./neetPG2026Questions_part2";
export { NEET_PG_2026_QUESTIONS_PART3 as QUESTIONS_PART3 } from "./neetPG2026Questions_part3";

import { NEET_PG_2026_QUESTIONS } from "./neetPG2026Questions_part1";
import { NEET_PG_2026_QUESTIONS_PART2 } from "./neetPG2026Questions_part2";
import { NEET_PG_2026_QUESTIONS_PART3 } from "./neetPG2026Questions_part3";

export const ALL_NEET_PG_2026_QUESTIONS = [
  ...NEET_PG_2026_QUESTIONS,
  ...NEET_PG_2026_QUESTIONS_PART2,
  ...NEET_PG_2026_QUESTIONS_PART3,
];

export const NEET_PG_2026_META = {
  totalQuestions: 200,
  totalMarks: 800,
  durationMinutes: 210,
  markingScheme: { correct: 4, wrong: -1 },
  examDate: "2026-08-30",
  conductingBody: "NBEMS",
  subjects: [
    "Anatomy", "Physiology", "Biochemistry", "Pathology",
    "Pharmacology", "Microbiology", "Forensic Medicine", "PSM",
    "Medicine", "Dermatology", "Psychiatry", "Surgery",
    "Orthopedics", "Radiology", "Anesthesia", "OBG",
    "Pediatrics", "ENT", "Ophthalmology",
  ],
  difficultyDistribution: { easy: 50, moderate: 120, difficult: 30 },
  clinicalVignettePercent: 70,
};
