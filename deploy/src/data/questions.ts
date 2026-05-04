export interface Question {
  id: number;
  subject: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

export const QUESTION_SUBJECTS: string[] = [
  "Pharmacology",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Anatomy",
  "Microbiology",
  "Medicine",
  "Surgery",
  "OBG",
  "Paediatrics",
  "ENT/Ophthalmology",
  "PSM",
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    subject: "Pharmacology",
    stem: "Drug of choice for absence seizures is:",
    options: ["Phenytoin", "Ethosuximide", "Carbamazepine", "Valproate"],
    answer: 1,
    explanation: "Ethosuximide is DOC for pure absence seizures; blocks T-type Ca²⁺ channels in thalamus. Valproate is used when absence coexists with other seizure types.",
  },
];
