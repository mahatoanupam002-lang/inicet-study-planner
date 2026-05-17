import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

interface RefItem {
  title: string;
  value: string;
  note?: string;
}

interface RefSection {
  heading: string;
  items: RefItem[];
}

interface SubjectData {
  label: string;
  sections: RefSection[];
}

const DATA: Record<string, SubjectData> = {
  lab: {
    label: "Lab Normal Values",
    sections: [
      {
        heading: "Haematology",
        items: [
          { title: "Hb — Male", value: "13–17 g/dL" },
          { title: "Hb — Female", value: "12–15 g/dL" },
          { title: "Hb — Newborn", value: "16.5 g/dL (14–20)" },
          { title: "MCV", value: "80–100 fL" },
          { title: "MCH", value: "27–33 pg" },
          { title: "MCHC", value: "32–36 g/dL" },
          { title: "WBC total", value: "4 000–11 000 /μL" },
          { title: "Neutrophils", value: "40–70 %", note: "Absolute >1800/μL = normal" },
          { title: "Lymphocytes", value: "20–40 %" },
          { title: "Eosinophils", value: "1–6 %" },
          { title: "Platelets", value: "1.5–4 lakh /μL" },
          { title: "PT (INR)", value: "11–13 sec (INR 0.9–1.2)" },
          { title: "aPTT", value: "25–40 sec" },
          { title: "Bleeding time (Ivy)", value: "2–9 min" },
          { title: "ESR — Male (Westergren)", value: "< 15 mm/hr" },
          { title: "ESR — Female", value: "< 20 mm/hr" },
          { title: "Reticulocyte count", value: "0.5–1.5 %" },
          { title: "PCV/Haematocrit", value: "Male 40–50%, Female 36–46%" },
        ],
      },
      {
        heading: "Biochemistry (serum)",
        items: [
          { title: "Glucose (fasting)", value: "70–110 mg/dL" },
          { title: "Glucose (2-hr PP)", value: "< 140 mg/dL" },
          { title: "HbA1c (normal)", value: "< 5.7 %" },
          { title: "HbA1c (DM diagnosis)", value: "≥ 6.5 %" },
          { title: "Urea", value: "15–45 mg/dL" },
          { title: "Creatinine — Male", value: "0.7–1.2 mg/dL" },
          { title: "Creatinine — Female", value: "0.5–1.1 mg/dL" },
          { title: "Uric acid — Male", value: "3.5–7.2 mg/dL" },
          { title: "Uric acid — Female", value: "2.6–6.0 mg/dL" },
          { title: "Sodium", value: "136–145 mEq/L" },
          { title: "Potassium", value: "3.5–5.0 mEq/L" },
          { title: "Calcium (total)", value: "8.5–10.5 mg/dL (2.1–2.6 mmol/L)" },
          { title: "Phosphate", value: "2.5–4.5 mg/dL" },
          { title: "Magnesium", value: "1.5–2.5 mg/dL" },
          { title: "Total protein", value: "6–8 g/dL" },
          { title: "Albumin", value: "3.5–5.5 g/dL" },
          { title: "Total bilirubin", value: "< 1.0 mg/dL" },
          { title: "Direct bilirubin", value: "< 0.3 mg/dL" },
          { title: "ALT (SGPT)", value: "7–56 U/L" },
          { title: "AST (SGOT)", value: "10–40 U/L" },
          { title: "ALP", value: "40–150 U/L" },
          { title: "GGT", value: "Male 11–50, Female 7–32 U/L" },
          { title: "Amylase", value: "28–100 U/L" },
          { title: "Lipase", value: "< 160 U/L" },
          { title: "TSH", value: "0.5–4.5 mU/L" },
          { title: "T4 (free)", value: "0.9–2.3 ng/dL" },
          { title: "T3 (free)", value: "2.3–4.2 pg/mL" },
          { title: "Cholesterol (total)", value: "< 200 mg/dL" },
          { title: "LDL", value: "< 100 mg/dL (optimal)" },
          { title: "HDL — Male", value: "> 40 mg/dL" },
          { title: "HDL — Female", value: "> 50 mg/dL" },
          { title: "Triglycerides", value: "< 150 mg/dL" },
          { title: "Ferritin — Male", value: "12–300 ng/mL" },
          { title: "Ferritin — Female", value: "12–150 ng/mL" },
          { title: "Iron (serum)", value: "60–170 μg/dL" },
          { title: "TIBC", value: "240–450 μg/dL" },
          { title: "CRP", value: "< 1 mg/L (high sensitivity)" },
        ],
      },
      {
        heading: "Urine",
        items: [
          { title: "24-hr urine protein", value: "< 150 mg" },
          { title: "Microalbuminuria", value: "30–300 mg/day", note: "Early DM nephropathy" },
          { title: "Urine creatinine clearance", value: "90–140 mL/min" },
          { title: "Urine specific gravity", value: "1.003–1.030" },
          { title: "Urine pH", value: "4.5–8.0" },
          { title: "VMA (vanillylmandelic acid)", value: "< 6 mg/day", note: "Phaeochromocytoma screen" },
        ],
      },
      {
        heading: "CSF",
        items: [
          { title: "Opening pressure", value: "70–180 mm H₂O" },
          { title: "Protein", value: "15–45 mg/dL" },
          { title: "Glucose", value: "45–75 mg/dL (≈ 60% serum glucose)" },
          { title: "Cells", value: "0–5 lymphocytes/μL" },
        ],
      },
      {
        heading: "ABG (arterial)",
        items: [
          { title: "pH", value: "7.35–7.45" },
          { title: "PaO₂", value: "75–100 mmHg" },
          { title: "PaCO₂", value: "35–45 mmHg" },
          { title: "HCO₃⁻ (serum)", value: "22–26 mEq/L" },
          { title: "Base excess", value: "−2 to +2" },
          { title: "SaO₂", value: "> 95 %" },
        ],
      },
    ],
  },
  clinical: {
    label: "Clinical Criteria",
    sections: [
      {
        heading: "Cardiovascular",
        items: [
          { title: "Jones criteria — Major (JONES)", value: "J=Joints (migratory polyarthritis), O=Carditis, N=Nodules (subcutaneous), E=Erythema marginatum, S=Sydenham's chorea", note: "2 major OR 1 major + 2 minor = ARF" },
          { title: "Jones criteria — Minor", value: "Fever, ↑ESR/CRP, prolonged PR, previous ARF" },
          { title: "Duke criteria — Major", value: "Positive blood cultures (2), Echocardiographic evidence (vegetation/abscess)", note: "2 major / 1 major+3 minor / 5 minor = definite IE" },
          { title: "Duke criteria — Minor", value: "Predisposing condition, Fever >38°C, Vascular phenomena, Immunological phenomena, Microbiological (equivocal)" },
          { title: "NYHA Class I", value: "No symptoms at ordinary activity" },
          { title: "NYHA Class II", value: "Slight limitation; comfortable at rest" },
          { title: "NYHA Class III", value: "Marked limitation; comfortable only at rest" },
          { title: "NYHA Class IV", value: "Symptoms at rest" },
          { title: "Hypertension (JNC-8)", value: "Stage 1: 130–139/80–89 mmHg, Stage 2: ≥140/90 mmHg" },
          { title: "HTN emergency vs urgency", value: "Emergency: BP↑ + end-organ damage; Urgency: no organ damage" },
        ],
      },
      {
        heading: "Nephrology",
        items: [
          { title: "CKD staging (eGFR)", value: "G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 <15 mL/min/1.73m²" },
          { title: "AKI KDIGO (Creatinine)", value: "Stage 1: ×1.5–1.9 baseline or +0.3 mg/dL; Stage 2: ×2–2.9; Stage 3: ×3 or >4 mg/dL or RRT" },
          { title: "Nephrotic syndrome", value: "Proteinuria >3.5g/day, Hypoalbuminaemia, Oedema, Hyperlipidaemia" },
          { title: "Nephritic syndrome", value: "Haematuria, Hypertension, Oliguria, Mild proteinuria, ↑creatinine" },
        ],
      },
      {
        heading: "Pulmonology",
        items: [
          { title: "ARDS (Berlin 2012)", value: "Onset ≤1 wk, bilateral infiltrates, not cardiac/fluid; PaO₂/FiO₂: Mild 200–300, Moderate 100–200, Severe <100" },
          { title: "Obstructive (spirometry)", value: "FEV₁/FVC < 0.70; FVC normal or reduced" },
          { title: "Restrictive (spirometry)", value: "FEV₁/FVC ≥ 0.70; FVC reduced; TLC reduced" },
          { title: "COPD severity (GOLD)", value: "GOLD 1: FEV₁ ≥80%, GOLD 2: 50–79%, GOLD 3: 30–49%, GOLD 4: <30%" },
          { title: "Hypoxia criteria", value: "PaO₂ <60 mmHg or SaO₂ <90% on room air" },
        ],
      },
      {
        heading: "Gastroenterology",
        items: [
          { title: "Child-Pugh score variables", value: "Bilirubin, Albumin, PT, Ascites, Encephalopathy; A=5–6, B=7–9, C=10–15" },
          { title: "Rome IV — IBS", value: "Recurrent abdominal pain ≥1 day/wk, ≥3 months, associated with defecation or stool change" },
          { title: "Ranson criteria (pancreatitis) — on admission", value: "Age >55, WBC >16k, Glucose >200, LDH >350, AST >250" },
          { title: "Ranson criteria — at 48 hr", value: "Haematocrit drop >10%, BUN rise >5, Ca <8, PaO₂ <60, Base deficit >4, Fluid >6L" },
        ],
      },
      {
        heading: "Endocrinology",
        items: [
          { title: "DM diagnosis (any 1 of):", value: "FPG ≥126, 2-hr OGTT ≥200, HbA1c ≥6.5%, Random glucose ≥200 + symptoms" },
          { title: "Pre-diabetes", value: "IFG: FPG 100–125 mg/dL; IGT: 2-hr 140–199; HbA1c 5.7–6.4%" },
          { title: "DKA", value: "Glucose >250, pH <7.3, HCO₃ <18, Anion gap >12, Ketonuria/ketonaemia" },
          { title: "HHS (HONK)", value: "Glucose >600, Osmolality >320, No/mild ketosis, pH normal" },
          { title: "Cushing — 1st line screening", value: "24-hr UFC or Late-night salivary cortisol or 1-mg dexamethasone suppression test" },
          { title: "Hypothyroidism diagnosis", value: "TSH ↑ + fT4 ↓ = overt; TSH ↑ + fT4 normal = subclinical" },
        ],
      },
      {
        heading: "Obstetrics",
        items: [
          { title: "Pre-eclampsia", value: "BP ≥140/90 after 20 weeks + proteinuria ≥300mg/24hr" },
          { title: "Severe features", value: "BP ≥160/110, Creatinine >1.1, Platelets <100k, LFT 2×normal, Pulmonary oedema, Visual disturbance" },
          { title: "GDM (IADPSG)", value: "FPG ≥92, 1-hr ≥180, 2-hr ≥153 mg/dL (75g OGTT)" },
          { title: "APGAR score", value: "Activity, Pulse, Grimace, Appearance, Respiration; 0–2 each; 7–10 normal" },
        ],
      },
      {
        heading: "Paediatrics",
        items: [
          { title: "WHO SAM criteria (any 1)", value: "MUAC <115mm, WFH <−3 SD, Bilateral pitting oedema" },
          { title: "Dehydration % — mild", value: "< 5 % body weight loss" },
          { title: "Dehydration % — moderate", value: "5–10 %" },
          { title: "Dehydration % — severe", value: "> 10 %" },
          { title: "Normal BP formula child", value: "Systolic = 90 + (2 × age in years)" },
          { title: "Kawasaki diagnostic (fever ≥5d + 4 of 5)", value: "Conjunctival injection, Lip/mouth changes, Rash, Lymphadenopathy, Hand/foot changes" },
        ],
      },
    ],
  },
  numbers: {
    label: "Important Numbers",
    sections: [
      {
        heading: "Surgery — Timing",
        items: [
          { title: "Emergency appendectomy", value: "Within 6 hours of diagnosis ideally (< 24 hr)" },
          { title: "Hartmann's reversal", value: "3–6 months after colostomy" },
          { title: "Bowel sounds — paralytic ileus return", value: "48–72 hours post-op (small bowel first)" },
          { title: "DVT prophylaxis (LMWH) — start", value: "12 hr post-surgery OR pre-op" },
          { title: "Min Hb for elective surgery", value: "10 g/dL", note: "Emergency: can be lower with transfusion" },
          { title: "Bladder capacity (adult)", value: "400–500 mL; first urge at 150–200 mL" },
          { title: "Nasogastric tube tip position", value: "10 cm beyond GEJ (in stomach)" },
        ],
      },
      {
        heading: "Obstetrics — Timing & Thresholds",
        items: [
          { title: "Normal term", value: "37–42 weeks" },
          { title: "Preterm", value: "< 37 weeks; Very preterm < 32 wks; Extremely < 28 wks" },
          { title: "Viability", value: "≥ 22 weeks or birth weight ≥ 500 g (India)" },
          { title: "Post-maturity", value: "≥ 42 weeks" },
          { title: "PPH definition", value: "Blood loss > 500 mL vaginal, > 1000 mL LSCS" },
          { title: "Pre-eclampsia onset", value: "≥ 20 weeks gestation" },
          { title: "Fetal heart rate (normal)", value: "110–160 bpm" },
          { title: "Bishop score for induction", value: "≥ 6 = favourable cervix" },
          { title: "Active phase labour", value: "Dilatation ≥ 1 cm/hr (WHO 2018: ≥ 6 cm start of active)" },
          { title: "2nd stage — primigravida max", value: "2 hours (3 hrs with epidural)" },
          { title: "Cord clamping (early vs delayed)", value: "Delayed ≥ 1 min recommended (WHO)" },
        ],
      },
      {
        heading: "Pharmacology — Key Levels",
        items: [
          { title: "Digoxin therapeutic", value: "0.5–2 ng/mL; toxic > 2 ng/mL" },
          { title: "Lithium therapeutic", value: "0.8–1.2 mEq/L; toxic > 1.5" },
          { title: "Phenytoin therapeutic", value: "10–20 μg/mL" },
          { title: "Carbamazepine therapeutic", value: "4–12 μg/mL" },
          { title: "Valproate therapeutic", value: "50–100 μg/mL" },
          { title: "Aminoglycoside (gentamicin) peak", value: "5–10 μg/mL; trough < 2 μg/mL" },
          { title: "Vancomycin AUC/MIC target", value: "400–600 (current recommendation)" },
          { title: "Warfarin INR — DVT/PE", value: "2–3" },
          { title: "Warfarin INR — mechanical heart valve", value: "2.5–3.5" },
          { title: "Heparin aPTT target", value: "1.5–2.5× control" },
        ],
      },
      {
        heading: "Important Cutoffs / Thresholds",
        items: [
          { title: "Microalbuminuria", value: "30–299 mg/g creatinine (or mg/day)" },
          { title: "Significant proteinuria", value: "≥ 300 mg/day" },
          { title: "Nephrotic range proteinuria", value: "≥ 3.5 g/day" },
          { title: "GFR — start dialysis", value: "eGFR < 15 mL/min (or symptomatic < 10)" },
          { title: "Hyperkalaemia — ECG changes", value: "> 5.5 mEq/L (peaked T); dangerous > 6.5" },
          { title: "Hypocalcaemia — tetany", value: "< 7.5 mg/dL (corrected)" },
          { title: "Anaemia WHO (adult male)", value: "Hb < 13 g/dL" },
          { title: "Severe anaemia (WHO)", value: "Hb < 8 g/dL" },
          { title: "Panic Hb — transfuse", value: "< 7 g/dL (< 8 in cardiac patients)" },
          { title: "Platelet transfusion — threshold", value: "< 10k spontaneous; < 50k for procedure; < 100k for surgery" },
          { title: "O₂ saturation — start supplemental O₂", value: "SpO₂ ≤ 93 % (≤ 90% in COPD)" },
        ],
      },
      {
        heading: "Microbiology — Incubation Periods",
        items: [
          { title: "Cholera", value: "Hours–5 days (usually 1–3 days)" },
          { title: "Typhoid", value: "7–21 days (usually 10–14)" },
          { title: "Rabies", value: "20–90 days (range 5 days–years)" },
          { title: "Hepatitis A", value: "15–50 days" },
          { title: "Hepatitis B", value: "45–180 days" },
          { title: "Hepatitis E", value: "15–60 days (avg 40 days)" },
          { title: "Dengue", value: "3–14 days" },
          { title: "Malaria (P. vivax)", value: "12–17 days (can be months with hypnozoites)" },
          { title: "Malaria (P. falciparum)", value: "9–14 days" },
          { title: "COVID-19", value: "2–14 days (avg 5–6 days)" },
          { title: "Influenza", value: "1–4 days" },
          { title: "Mumps", value: "12–25 days" },
          { title: "Measles", value: "8–12 days (to rash)" },
          { title: "Varicella", value: "10–21 days" },
          { title: "Tetanus", value: "3–21 days (avg 8–10 days)" },
        ],
      },
      {
        heading: "PSM — Screening & Programme Numbers",
        items: [
          { title: "NMR target (India)", value: "< 20 per 1000 LB (SDG: < 12)" },
          { title: "IMR target (India)", value: "< 25 per 1000 LB" },
          { title: "MMR (India 2022)", value: "≈ 97 per 1,00,000 LB (target < 70)" },
          { title: "TFR target (NHM)", value: "2.1 (replacement level)" },
          { title: "Immunisation coverage target (UIP)", value: "≥ 90 % full immunisation" },
          { title: "Iodine deficiency — goitre prevalence", value: "≥ 5% = public health problem" },
          { title: "Vitamin A deficiency — corneal ulcer", value: "X3 (xerophthalmia staging)" },
          { title: "Sensitivity + Specificity ideal", value: "Both 100%; compromise depends on disease consequences" },
          { title: "NPV best when", value: "Disease prevalence LOW", note: "Specificity drives NPV" },
          { title: "PPV best when", value: "Disease prevalence HIGH", note: "Sensitivity drives PPV" },
        ],
      },
    ],
  },
  imaging: {
    label: "Classic Imaging Signs",
    sections: [
      {
        heading: "Chest X-ray",
        items: [
          { title: "Kerley B lines", value: "Horizontal lines at lung bases = interstitial pulmonary oedema (LVEDP ↑)" },
          { title: "Golden S sign", value: "Right upper lobe collapse + hilar mass = central lung cancer" },
          { title: "Sail sign", value: "Thymic shadow in child = normal variant; not cardiomegaly" },
          { title: "Boot-shaped heart", value: "Tetralogy of Fallot — apex upturned, concave pulmonary segment" },
          { title: "Egg-shaped heart", value: "TGA (Transposition of Great Arteries)" },
          { title: "Figure-of-3 sign", value: "Coarctation of aorta on plain film" },
          { title: "Hampton's hump", value: "Pulmonary infarct — wedge-shaped opacity at pleural base" },
          { title: "Westermark sign", value: "Oligaemia distal to PE — radio-lucent zone" },
          { title: "Air bronchogram", value: "Air-filled bronchi within consolidation = lobar pneumonia" },
          { title: "Mediastinal shift — towards effusion", value: "Suggests collapse + effusion combined" },
          { title: "Mediastinal shift — away from effusion", value: "Large pleural effusion" },
        ],
      },
      {
        heading: "Abdomen X-ray / CT",
        items: [
          { title: "String of beads sign", value: "Small bowel obstruction — trapped air between folds" },
          { title: "Stepladder pattern", value: "Multiple air-fluid levels, small bowel obstruction" },
          { title: "Football sign", value: "Massive pneumoperitoneum on supine film" },
          { title: "Rigler sign", value: "Both sides of bowel wall visible = pneumoperitoneum" },
          { title: "Double bubble sign", value: "Duodenal atresia (antenatal or neonatal)" },
          { title: "Triple bubble sign", value: "Jejunal atresia" },
          { title: "Pseudokidney sign (USS)", value: "Intussusception" },
          { title: "Target lesion (USS)", value: "Intussusception (cross-section)" },
          { title: "Crescent in fat sign", value: "Intussusception on CT" },
          { title: "Staghorn calculus", value: "Struvite stone filling renal pelvis + calyces" },
        ],
      },
      {
        heading: "Brain / Spine",
        items: [
          { title: "Hyperdense MCA sign", value: "CT — acute thrombus in middle cerebral artery" },
          { title: "Lenticular (lens-shaped) hyperdensity", value: "Extradural haematoma — does NOT cross suture" },
          { title: "Crescent-shaped hypodensity", value: "Subdural haematoma — crosses sutures" },
          { title: "Rim enhancement", value: "Brain abscess on contrast CT" },
          { title: "Sunburst / hair-on-end skull", value: "Sickle cell / thalassaemia" },
          { title: "Beaten copper skull", value: "Raised ICP (craniosynostosis)" },
          { title: "Bamboo spine", value: "Ankylosing spondylitis" },
          { title: "Rugger jersey spine", value: "Renal osteodystrophy (hyperparathyroidism)" },
          { title: "Codman's triangle", value: "Osteosarcoma periosteal reaction" },
          { title: "Onion peel periosteum", value: "Ewing's sarcoma" },
        ],
      },
    ],
  },
  pharmacology: {
    label: "Pharmacology Quick Ref",
    sections: [
      {
        heading: "Drug of Choice — Classic Pairs",
        items: [
          { title: "Absence seizures", value: "Ethosuximide (pure); Valproate (mixed with other types)" },
          { title: "Status epilepticus — 1st line", value: "IV Lorazepam (or Diazepam); 2nd: Phenytoin/Fosphenytoin; 3rd: Propofol/Thiopentone" },
          { title: "Trigeminal neuralgia", value: "Carbamazepine" },
          { title: "Myasthenia gravis", value: "Pyridostigmine (Rx); Neostigmine (diagnosis/intraop)" },
          { title: "Tension headache", value: "Aspirin + Caffeine or Paracetamol" },
          { title: "Migraine — acute", value: "Sumatriptan (5-HT₁B/₁D agonist)" },
          { title: "Migraine — prophylaxis", value: "Propranolol (1st line); Topiramate; Amitriptyline" },
          { title: "Mania — acute", value: "Lithium OR Haloperidol; Valproate if lithium CI" },
          { title: "Depression — 1st line", value: "SSRI (Fluoxetine, Sertraline)" },
          { title: "OCD", value: "Fluoxetine / Fluvoxamine (highest efficacy SSRIs)" },
          { title: "Panic disorder", value: "Paroxetine (SSRI); Alprazolam short-term" },
          { title: "Schizophrenia — positive Sx", value: "Haloperidol; Clozapine for refractory" },
          { title: "Clozapine monitoring", value: "Weekly WBC (risk agranulocytosis)" },
          { title: "Parkinson's — DOC", value: "Levodopa + Carbidopa (most effective)" },
          { title: "Parkinson's — young patient", value: "Dopamine agonists (Ropinirole) first" },
          { title: "Alzheimer's — mild-moderate", value: "Donepezil (AChE inhibitor)" },
          { title: "Alzheimer's — moderate-severe", value: "Memantine (NMDA antagonist) or add to Donepezil" },
        ],
      },
      {
        heading: "DOC in Pregnancy / Special Groups",
        items: [
          { title: "Malaria in pregnancy (1st trim)", value: "Quinine + Clindamycin" },
          { title: "Malaria in pregnancy (2nd/3rd trim)", value: "Artemisinin-based (ACT) — safe" },
          { title: "Hypertension in pregnancy — DOC", value: "Methyldopa (safest, most data)" },
          { title: "HTN pregnancy — acute severe", value: "IV Hydralazine or IV Labetalol or Oral Nifedipine" },
          { title: "Epilepsy in pregnancy — safest AED", value: "Lamotrigine (lowest teratogenicity); avoid Valproate" },
          { title: "Hypothyroidism in pregnancy", value: "Levothyroxine (same drug, adjust dose)" },
          { title: "Hyperthyroidism in pregnancy (1st trim)", value: "PTU (preferred in 1st trimester)" },
          { title: "Hyperthyroidism in pregnancy (2nd/3rd)", value: "Carbimazole / Methimazole" },
          { title: "UTI in pregnancy", value: "Nitrofurantoin (avoid near term), Amoxicillin, Cephalexin" },
          { title: "TB in pregnancy", value: "HRZE regimen; Streptomycin CONTRAINDICATED (ototoxic fetus)" },
          { title: "Asthma in pregnancy", value: "Inhaled salbutamol + Budesonide (category B)" },
          { title: "Type 2 DM in pregnancy", value: "Insulin (oral agents stopped)", note: "Metformin debated but generally switched to insulin" },
          { title: "Depression in pregnancy", value: "Sertraline (best data in pregnancy among SSRIs)" },
          { title: "Nausea / vomiting in pregnancy", value: "Vitamin B₆ (Pyridoxine) ± Doxylamine (1st line)" },
          { title: "GERD in pregnancy", value: "Antacids (Ca/Mg based); Ranitidine; PPI if needed" },
        ],
      },
      {
        heading: "Mechanism Pearls",
        items: [
          { title: "Metformin mechanism", value: "Activates AMPK → ↓hepatic gluconeogenesis, ↑peripheral glucose uptake; does NOT cause hypoglycaemia alone" },
          { title: "SGLT-2 inhibitors", value: "Block renal glucose reabsorption → glucosuria; cardioprotective (empagliflozin, dapagliflozin)" },
          { title: "GLP-1 analogues", value: "Mimic incretin → ↑insulin, ↓glucagon, ↓gastric emptying, weight loss (Liraglutide, Semaglutide)" },
          { title: "Statins", value: "HMG-CoA reductase inhibitors → ↓LDL; SE: myopathy, ↑LFT" },
          { title: "ACE inhibitors SE", value: "Dry cough (bradykinin), Hyperkalaemia, Angioedema (CI in future pregnancy)" },
          { title: "ARBs vs ACEi", value: "ARBs — no cough, less angioedema; same mechanism (AT₁ blockade)" },
          { title: "Beta-blockers classification", value: "β1 selective: Metoprolol, Atenolol, Bisoprolol; Non-selective: Propranolol, Carvedilol (α+β)" },
          { title: "Warfarin mechanism", value: "Inhibits Vit K epoxide reductase → ↓Factors II, VII, IX, X, Protein C & S" },
          { title: "Heparin mechanism", value: "Activates antithrombin III → ↓Thrombin (IIa) and Xa; reversal: Protamine" },
          { title: "Aminoglycosides", value: "Bind 30S ribosome → bactericidal (concentration-dependent); nephrotoxic, ototoxic" },
          { title: "Fluoroquinolones", value: "Inhibit DNA gyrase (topoisomerase II) and topoisomerase IV; avoid in children (cartilage)" },
          { title: "Macrolides", value: "Bind 50S → bacteriostatic; Azithromycin: azalide, longer t½ (5 days), atypical pneumonia" },
        ],
      },
    ],
  },
};

export function HighYieldReference() {
  const [activeSection, setActiveSection] = useState<string>("lab");
  const [search, setSearch] = useState("");
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set());

  const toggleHeading = (key: string) =>
    setExpandedHeadings(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const filtered = useMemo(() => {
    if (!search.trim()) return DATA[activeSection].sections;
    const q = search.toLowerCase();
    return DATA[activeSection].sections
      .map(sec => ({
        ...sec,
        items: sec.items.filter(
          i => i.title.toLowerCase().includes(q) || i.value.toLowerCase().includes(q) || (i.note ?? "").toLowerCase().includes(q)
        ),
      }))
      .filter(sec => sec.items.length > 0);
  }, [activeSection, search]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">
          High-Yield Reference
        </h2>
        <p className="text-xs text-muted-foreground font-mono">
          Verified facts from Harrison's, Robbins, KDT, Park's PSM — exam-focused
        </p>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(DATA).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setActiveSection(key); setSearch(""); setExpandedHeadings(new Set()); }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                activeSection === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${DATA[activeSection].label}…`}
            className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono text-center py-12">No results for "{search}"</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(sec => {
            const key = `${activeSection}__${sec.heading}`;
            const open = expandedHeadings.has(key) || !!search.trim();
            return (
              <div key={sec.heading} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleHeading(key)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                    {sec.heading}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{sec.items.length} items</span>
                    {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                </button>
                {open && (
                  <div className="divide-y divide-border">
                    {sec.items.map((item, i) => (
                      <div key={i} className="px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 hover:bg-muted/10">
                        <span className="text-xs font-mono text-muted-foreground sm:w-56 shrink-0">{item.title}</span>
                        <div className="flex-1">
                          <span className="text-xs font-mono font-semibold text-foreground">{item.value}</span>
                          {item.note && (
                            <span className="block text-[10px] font-mono text-amber-400 mt-0.5">{item.note}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
