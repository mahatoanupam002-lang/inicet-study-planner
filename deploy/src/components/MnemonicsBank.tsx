import { useState, useMemo } from "react";
import { Brain, Search, Copy, CheckCheck } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Mnemonic {
  id: number;
  acronym: string;
  title: string;
  expansion: string[];
  subject: string;
  clinicalNote: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const MNEMONICS: Mnemonic[] = [
  // ── Medicine ─────────────────────────────────────────────────────────────
  {
    id: 1, acronym: "MUDPILES", title: "High Anion Gap Metabolic Acidosis causes",
    expansion: ["Methanol", "Uraemia", "DKA (Diabetic Ketoacidosis)", "Paraldehyde", "Isoniazid/Iron", "Lactic acidosis", "Ethylene glycol", "Salicylates"],
    subject: "Medicine",
    clinicalNote: "Anion gap = Na − (Cl + HCO₃). Normal 8–12. HAGMA >12. Check lactate, ketones, osmol gap, salicylate level.",
  },
  {
    id: 2, acronym: "AEIOU TIPS", title: "Causes of Altered Consciousness / Coma",
    expansion: ["Alcohol", "Epilepsy/Electrolytes", "Insulin (hypoglycaemia)", "Opiates/Oxygen", "Uraemia", "Trauma/Temperature", "Infection", "Psychogenic/Poisons", "Stroke/Structural"],
    subject: "Medicine",
    clinicalNote: "Always check glucose first in any altered consciousness — cheapest and most treatable cause.",
  },
  {
    id: 3, acronym: "SIADH", title: "SIADH causes mnemonic: SIADH itself",
    expansion: ["S - CNS disorders (Stroke, SAH, Meningitis)", "I - Infections (TB, PCP)", "A - Aldo not involved (euvolaemic)", "D - Drugs (SSRIs, carbamazepine, vincristine, chlorpropamide)", "H - Hypothyroidism / Hypothalamic disorders / HHH (Hypotension → SIADH stimulus)"],
    subject: "Medicine",
    clinicalNote: "SIADH: hyponatraemia + low serum osmolality + inappropriately concentrated urine + euvolaemia. Also caused by ectopic ADH from small cell lung cancer.",
  },
  {
    id: 4, acronym: "DIGFAST", title: "Symptoms of Mania (DSM-5)",
    expansion: ["Distractibility", "Impulsivity / Indiscretion", "Grandiosity", "Flight of ideas", "Activity increased / Agitation", "Sleep decreased", "Talkativeness (pressured speech)"],
    subject: "Medicine",
    clinicalNote: "Mania diagnosis: ≥3 symptoms (≥4 if mood only irritable) lasting ≥1 week with marked impairment. Bipolar I = full manic episodes. Bipolar II = hypomania + major depression.",
  },
  {
    id: 5, acronym: "CHOP", title: "Lymphoma chemotherapy regimen",
    expansion: ["Cyclophosphamide", "Hydroxydaunorubicin (Doxorubicin)", "Oncovin (Vincristine)", "Prednisolone"],
    subject: "Medicine",
    clinicalNote: "R-CHOP (+ Rituximab) is standard first-line for DLBCL (Diffuse Large B-cell Lymphoma). Rituximab targets CD20. Doxorubicin is cardiotoxic — monitor LVEF.",
  },
  {
    id: 6, acronym: "CAGE", title: "Alcohol dependence screening",
    expansion: ["Cut down — ever felt need to cut down?", "Annoyed — people annoyed by your drinking?", "Guilty — ever felt guilty about drinking?", "Eye opener — ever needed a drink first thing in morning?"],
    subject: "Medicine",
    clinicalNote: "≥2 positive answers = significant; ≥3 = probable dependence. AUDIT-C is a more comprehensive tool. Alcohol withdrawal: CIWA scale, lorazepam/chlordiazepoxide.",
  },
  {
    id: 7, acronym: "JONES (Major)", title: "Major Jones Criteria for Rheumatic Fever",
    expansion: ["J - Joints (Polyarthritis — most common)", "O - ♥ Carditis (Pericarditis/myocarditis/endocarditis)", "N - Nodules (Subcutaneous — painless)", "E - Erythema marginatum", "S - Sydenham's chorea"],
    subject: "Medicine",
    clinicalNote: "Diagnosis = 2 major OR 1 major + 2 minor criteria + evidence of preceding GAS infection (ASO titre / throat swab). Penicillin prophylaxis to prevent recurrence.",
  },
  {
    id: 8, acronym: "VITAMIN C", title: "Differential diagnosis framework",
    expansion: ["Vascular", "Infective/Inflammatory", "Traumatic/Toxic", "Autoimmune/Allergic", "Metabolic", "Iatrogenic/Idiopathic", "Neoplastic", "Congenital/Chromosomal"],
    subject: "Medicine",
    clinicalNote: "Universal mnemonic to generate a systematic differential diagnosis for any clinical problem. Use in history-taking and exam vivas.",
  },
  {
    id: 9, acronym: "SCALP", title: "Wilson-Jungner criteria for screening",
    expansion: ["Severe problem (important health issue)", "Characteristic natural history (recognisable latent stage)", "Acceptable treatment available", "Latent period recognisable (sensitive/specific test exists)", "Programme feasible (facilities, cost-effective)"],
    subject: "PSM/Community Medicine",
    clinicalNote: "Screening ≠ diagnosis. Screening detects pre-clinical disease. Sensitivity important for screening (don't miss disease). Specificity important to reduce false positives.",
  },
  {
    id: 10, acronym: "TORCH", title: "Congenital (TORCH) infections",
    expansion: ["Toxoplasma", "Others: Syphilis, Hepatitis B, HIV, Varicella, Parvovirus B19", "Rubella", "Cytomegalovirus (CMV) — most common congenital viral infection", "Herpes simplex virus (HSV)"],
    subject: "Microbiology",
    clinicalNote: "TORCH shared features: IUGR, hepatosplenomegaly, thrombocytopenia, microcephaly. Rubella: blueberry muffin rash, cataracts, cardiac defects (PDA). CMV: periventricular calcifications. Toxoplasma: diffuse calcifications. HSV: encephalitis.",
  },

  // ── Surgery ───────────────────────────────────────────────────────────────
  {
    id: 11, acronym: "4Ts PPH", title: "Causes of Postpartum Haemorrhage",
    expansion: ["Tone — uterine atony (80%)", "Tissue — retained placenta/membranes", "Trauma — cervical/vaginal/perineal lacerations", "Thrombin — coagulopathy (DIC, pre-existing)"],
    subject: "OBG",
    clinicalNote: "Tone (atony) = most common. First-line: uterine massage + oxytocin 10 IU IV/IM. Then: misoprostol, ergometrine, carboprost (PGF2α), tranexamic acid. Surgical: B-Lynch suture, uterine artery ligation, hysterectomy.",
  },
  {
    id: 12, acronym: "MANTRELS", title: "Alvarado Score for Appendicitis",
    expansion: ["Migration of pain to RIF (+1)", "Anorexia (+1)", "Nausea/vomiting (+1)", "Tenderness in RIF (+2)", "Rebound tenderness (+1)", "Elevated temperature (+1)", "Leucocytosis (+2)", "Shift to left (neutrophilia) (+1)"],
    subject: "Surgery",
    clinicalNote: "Maximum score = 10. Score 7-10: likely appendicitis → surgery. Score 5-6: equivocal → CT scan. Score ≤4: unlikely appendicitis. CT sensitivity 94%, specificity 95%. US preferred in children/pregnant women.",
  },
  {
    id: 13, acronym: "NAVI", title: "Contents of Femoral Triangle (lateral to medial)",
    expansion: ["Nerve (femoral nerve)", "Artery (femoral artery)", "Vein (femoral vein)", "Inguinal lymph nodes"],
    subject: "Anatomy",
    clinicalNote: "Femoral triangle: inguinal ligament (superior), sartorius (lateral), adductor longus (medial). Femoral hernia: through femoral canal (medial to femoral vein). More common in women. High strangulation risk due to rigid canal walls.",
  },
  {
    id: 14, acronym: "6Ps", title: "Features of Acute Limb Ischaemia",
    expansion: ["Pain", "Pallor", "Pulselessness", "Paraesthesia", "Paralysis (late — indicates irreversibility)", "Perishing cold (Poikilothermia)"],
    subject: "Surgery",
    clinicalNote: "Rutherford classification: I = viable (no deficit); IIa = marginally threatened (loss of sensation only); IIb = immediately threatened (paralysis + sensory loss); III = irreversible (paralysis + rigid muscles + staining). Emergency revascularisation if viable limb.",
  },
  {
    id: 15, acronym: "ABCDE BURNS", title: "Burn Management (ATLS approach)",
    expansion: ["Airway — intubate early if facial burns/inhalation injury", "Breathing — 100% O₂ for inhalation injury/CO poisoning", "Circulation — IV access, Parkland formula", "Disability — analgesia, anti-tetanus", "Exposure — remove clothing, estimate TBSA (Rule of 9s)", "Burns depth — superficial, partial, full thickness"],
    subject: "Surgery",
    clinicalNote: "Parkland formula: 4 mL × kg × TBSA% Ringer's lactate. Half in first 8h (from time of burn), half in next 16h. Burns >15% TBSA in adults or >10% in children need IV resuscitation.",
  },
  {
    id: 16, acronym: "WHIPPLE", title: "Pancreatoduodenectomy (Whipple's) removes",
    expansion: ["W - pancreatic Head", "H - (Hartmann's) pouch (duodenal C-loop = all of duodenum)", "I - Inferior part of stomach (distal 30-40%)", "P - Pancreatic duct (Wirsung)", "P - Portal vein area (dissected but usually preserved)", "L - Lymph nodes (peripancreatic)", "E - End with hepaticojejunostomy, pancreaticojejunostomy, gastrojejunostomy"],
    subject: "Surgery",
    clinicalNote: "Indications: head of pancreas carcinoma, periampullary tumours (ampullary, bile duct, duodenal), chronic pancreatitis. Pylorus-preserving Whipple (PPPD) is a modification with better GI function.",
  },

  // ── OBG ──────────────────────────────────────────────────────────────────
  {
    id: 17, acronym: "EDFIEE", title: "Cardinal Movements of Labour",
    expansion: ["Engagement", "Descent", "Flexion", "Internal rotation (to OA position)", "Extension (delivery of head)", "External rotation (restitution) + Expulsion"],
    subject: "OBG",
    clinicalNote: "At the pelvic outlet the baby's head extends (not flexes) as the suboccipital region pivots under the pubic arch. External rotation (restitution) aligns the head with the fetal shoulders.",
  },
  {
    id: 18, acronym: "BISHOP SCORE", title: "Bishop Score Components for Cervical Assessment",
    expansion: ["Dilation (0-3+)", "Effacement (%)", "Station (-3 to +3)", "Consistency (firm/medium/soft)", "Position (posterior/mid/anterior)"],
    subject: "OBG",
    clinicalNote: "Total max score = 13. Score ≥8 = favourable cervix (induction likely to succeed). Score <6 = unfavourable → cervical ripening needed (prostaglandins, Foley catheter). Score used to predict successful vaginal delivery after induction.",
  },
  {
    id: 19, acronym: "HELLP", title: "HELLP Syndrome",
    expansion: ["Haemolysis", "Elevated Liver enzymes", "Low Platelets"],
    subject: "OBG",
    clinicalNote: "Severe variant of pre-eclampsia. Features: RUQ/epigastric pain, nausea, malaise + lab abnormalities. Platelet count <100,000/μL. LDH >600, AST >70 IU/L. Management: delivery is definitive treatment. MgSO4 for seizure prophylaxis. Steroids (dexamethasone) for platelets <100,000.",
  },
  {
    id: 20, acronym: "RCOG PCOD", title: "Rotterdam Criteria for PCOS (2 of 3)",
    expansion: ["R - Reproductive irregularity (oligo-/anovulation)", "C - Clinical/biochemical hyperandrogenism", "O - Ovarian morphology: ≥12 follicles 2-9mm or volume >10mL", "G - (other causes excluded)"],
    subject: "OBG",
    clinicalNote: "PCOS is the most common endocrine disorder in women of reproductive age (6-10%). Complications: infertility (anovulation), insulin resistance, T2DM, cardiovascular risk, endometrial hyperplasia. Management: lifestyle + metformin + OCP (for cycles) + letrozole/clomiphene (ovulation induction).",
  },

  // ── Pharmacology ─────────────────────────────────────────────────────────
  {
    id: 21, acronym: "SLUDGE", title: "Organophosphate/Muscarinic Poisoning Features",
    expansion: ["Salivation", "Lacrimation", "Urination", "Defecation", "GI distress (cramps, diarrhoea)", "Emesis"],
    subject: "Pharmacology",
    clinicalNote: "Organophosphate = irreversible AChE inhibition. DUMBELS (Diarrhoea, Urination, Miosis, Bradycardia/Bronchoconstriction, Emesis, Lacrimation, Salivation) is an alternative. Treatment: atropine (blocks muscarinic) + pralidoxime (reactivates AChE). PLUS: mild CNS (SLUDGE on steroids).",
  },
  {
    id: 22, acronym: "DOC EPILEPSY", title: "Drug of Choice per Seizure Type",
    expansion: ["Focal (partial): Carbamazepine/Levetiracetam", "Generalised tonic-clonic (GTCS): Valproate", "Absence: Ethosuximide (pure) / Valproate (if mixed)", "Juvenile myoclonic epilepsy: Valproate", "Infantile spasms (West): ACTH / Vigabatrin", "Neonatal: Phenobarbitone", "Status epilepticus: Lorazepam IV (first line)"],
    subject: "Pharmacology",
    clinicalNote: "Valproate: most broad-spectrum antiepileptic. Teratogenic (neural tube defects) — avoid in women of childbearing age if possible. Carbamazepine contraindicated in absence epilepsy (worsens). Lamotrigine safe in pregnancy.",
  },
  {
    id: 23, acronym: "ACE HEART", title: "Compelling Indications for Antihypertensives",
    expansion: ["A - ACE inhibitors/ARBs: Heart failure, CKD, Diabetes with proteinuria, post-MI (if ACE-intolerant → ARB)", "C - Calcium channel blockers (amlodipine): Angina, elderly isolated systolic HTN, black patients", "E - (not to use ACE in bilateral RAS)", "H - Heart failure: ACE/ARB + beta-blocker + spironolactone + SGLT2i (quadruple therapy)", "E - Emergency: labetalol IV, nicardipine IV", "A - Alpha-blockers: BPH + HTN", "R - Resistant HTN: add spironolactone", "T - Thiazides: 1st line in uncomplicated, black patients, elderly"],
    subject: "Pharmacology",
    clinicalNote: "JNC 8/AHA 2017: Target BP <130/80 for most. Beta-blockers no longer preferred first-line for uncomplicated HTN but compelling for: post-MI, heart failure, angina, atrial fibrillation rate control.",
  },
  {
    id: 24, acronym: "STOP WARFARIN", title: "Drug interactions increasing warfarin effect (bleeding risk)",
    expansion: ["Sulfonamides", "Tetracycline, ciprofloxacin (gut flora killed → less vitamin K absorption)", "OCP (some increase), Omeprazole", "Phenylbutazone", "Warfarin × Amiodarone (massive increase!)", "Aspirin/NSAIDs + Alcohol", "Rifampicin DECREASES (CYP inducer — opposite effect)", "Fibrates (clofibrate, gemfibrozil)", "INH (isoniazid)", "Neomycin, Norfloxacin"],
    subject: "Pharmacology",
    clinicalNote: "Amiodarone is the most potent warfarin potentiator (CYP2C9 inhibition). Rifampicin, carbamazepine, phenytoin, St John's wort DECREASE warfarin effect (CYP inducers). Monitor INR closely with any drug change.",
  },
  {
    id: 25, acronym: "ABCDE TERATOGENS", title: "High-yield teratogens in pregnancy",
    expansion: ["A - ACE inhibitors/ARBs (renal dysplasia, oligohydramnios — 2nd/3rd trimester)", "B - Barbiturates, Benzodiazepines (cleft palate, sedation)", "C - Carbamazepine (spina bifida), Carbimazole (aplasia cutis)", "D - Diethylstilboestrol (vaginal clear cell carcinoma in daughters), Danazol", "E - Etretinate (retinoids — severe teratogens, NTD, cardiac)"],
    subject: "Pharmacology",
    clinicalNote: "Thalidomide = phocomelia. Methotrexate = folic acid antagonist → NTD, multiple anomalies. Warfarin = warfarin embryopathy (stippled epiphyses, facial hypoplasia) — use heparin in pregnancy. Valproate = neural tube defects (spina bifida). Lithium = Ebstein's anomaly.",
  },
  {
    id: 26, acronym: "PHARM NMS", title: "NMS (Neuroleptic Malignant Syndrome) vs Serotonin Syndrome",
    expansion: ["P - Presentation: NMS = LEAD pipe rigidity; SS = clonus/hyperreflexia/myoclonus (key difference!)", "H - Hyperthermia both", "A - Autonomic instability both", "R - Rigidity: NMS = 'cogwheel' / lead-pipe; SS = tremor/clonus", "M - Mental status change both"],
    subject: "Pharmacology",
    clinicalNote: "NMS: caused by D2 antagonists (antipsychotics, metoclopramide). Onset: days-weeks. CK very elevated. Treat: dantrolene + bromocriptine. SS: caused by excess serotonin (SSRI+MAOI, SSRI+tramadol). Onset: hours. Treat: cyproheptadine. Hunter criteria (not Sternbach) are more specific.",
  },

  // ── Pathology ─────────────────────────────────────────────────────────────
  {
    id: 27, acronym: "SOAP", title: "Special Stains in Pathology",
    expansion: ["S - Sudan black / Silver (GMS): Fungi", "O - Oil red O: Lipid (frozen sections only)", "A - Alcian blue: Mucins (acid)", "P - PAS (Periodic Acid Schiff): Glycogen, fungi, mucin (neutral); basement membrane"],
    subject: "Pathology",
    clinicalNote: "ZN stain: Mycobacteria (red on blue). India ink: Cryptococcus capsule. Congo red + polarised light: amyloid (apple-green birefringence). Prussian blue (Perl's): haemosiderin/iron. Von Kossa: calcium. Masson's trichrome: collagen (green/blue).",
  },
  {
    id: 28, acronym: "CAT SCRATCH", title: "Granuloma-forming diseases",
    expansion: ["Cat scratch disease (Bartonella)", "Aspergilosis/Actinomycosis", "Tuberculosis / Talc", "Sarcoidosis (non-caseating)", "Crohn's disease", "Rheumatoid nodules", "Atypical mycobacteria", "Treponema (syphilis)", "Churg-Strauss / Cryptococcus", "Histoplasmosis / Hyperimmune"],
    subject: "Pathology",
    clinicalNote: "Caseating granulomas: TB, atypical mycobacteria, Histoplasma, Coccidioides. Non-caseating: sarcoidosis, Crohn's, berylliosis. Giant cells in granuloma: Langhans (TB — nuclei at periphery), foreign-body (random nuclear position).",
  },
  {
    id: 29, acronym: "MI CLOCK", title: "Myocardial Infarction Histological Timeline",
    expansion: ["Minutes (0-2h): no change on LM; wavy fibres on EM", "1-4h: coagulative necrosis begins, eosinophilic change", "12-24h: neutrophil infiltration (PMNs)", "2-4 days: macrophage/monocyte infiltration", "7-10 days: granulation tissue (fibroblasts + capillaries)", "2-8 weeks: fibrous scarring", ">2 months: dense fibrous scar (collagen)"],
    subject: "Pathology",
    clinicalNote: "CK-MB peaks 24h, returns to normal 72h. Troponin peaks 24-48h, stays elevated 7-14 days (most specific, used for late diagnosis). LDH peaks 72h, stays 10-14 days. First change visible on LM: neutrophil infiltration at 12-24h.",
  },
  {
    id: 30, acronym: "APUD", title: "APUD Cell tumours (Neuroendocrine tumours)",
    expansion: ["A - Amine content (high)", "P - Precursor Uptake", "U - Uptake of amino acid precursors", "D - Decarboxylation (of precursor)"],
    subject: "Pathology",
    clinicalNote: "APUD cells (concept by Pearse): carcinoids, insulinoma, gastrinoma, VIPoma, glucagonoma, phaeochromocytoma, medullary thyroid carcinoma (calcitonin), Merkel cell tumour. Chromogranin A is the best general neuroendocrine marker. NSE and synaptophysin also used.",
  },

  // ── PSM / Community Medicine ──────────────────────────────────────────────
  {
    id: 31, acronym: "SPEC", title: "Incubation Period mnemonics — Short vs Long",
    expansion: ["S - Short (1-3 days): Staph food poisoning (<6h), Cholera (1-3d), Typhoid (7-21d)", "P - Prolonged: Rabies weeks-months, HIV weeks-months (window)", "E - Enteric group: Typhoid 7-21d, Hepatitis A 15-50d", "C - Children: Measles 10-12d, Chickenpox 14-21d, Mumps 14-21d"],
    subject: "PSM/Community Medicine",
    clinicalNote: "Key incubation periods for NEET PG: Cholera 1-3d; Typhoid 7-21d; Hepatitis A 15-50d; Hepatitis B 45-160d; Hepatitis E 15-60d; Rabies 10d-7yr (usually 3-8 weeks); Measles 10-14d; Chickenpox 14-21d.",
  },
  {
    id: 32, acronym: "DANDY", title: "Epidemic Curve Interpretation",
    expansion: ["D - Distribution (point source vs propagated)", "A - Attack rate calculation (exposed vs unexposed)", "N - Number of cases (epidemic threshold)", "D - Duration of exposure (incubation period determines)", "Y - Yield (secondary attack rate for person-to-person spread)"],
    subject: "PSM/Community Medicine",
    clinicalNote: "Point source epidemic: sharp peak, bell-shaped curve, cases within one incubation period. Propagated (person-to-person): multiple peaks, successive peaks separated by one incubation period, curve flattens slowly.",
  },
  {
    id: 33, acronym: "MMRI", title: "Key India Health Statistics (NFHS-5 / SRS 2020-21)",
    expansion: ["M - MMR: 97 per 100,000 live births (SRS 2018-20)", "M - IMR: 35 per 1,000 live births (SRS 2020-21)", "R - Rate TFR: 2.0 (NFHS-5, 2019-21)", "I - Infant U5MR: 41.9 per 1,000 live births (NFHS-5)"],
    subject: "PSM/Community Medicine",
    clinicalNote: "Also remember: NMR (neonatal mortality rate) = 28.2 (SRS 2020). Best IMR state = Kerala (6). Worst = Madhya Pradesh (41). India needs to achieve SDG targets: MMR <70, U5MR <25 by 2030.",
  },
  {
    id: 34, acronym: "SENS SPEC PPV NPV", title: "2×2 Table Formulas",
    expansion: ["Sensitivity = TP/(TP+FN) — don't miss disease", "Specificity = TN/(TN+FP) — don't over-diagnose", "PPV = TP/(TP+FP) — if positive, probability of true disease", "NPV = TN/(TN+FN) — if negative, probability of truly disease-free"],
    subject: "PSM/Community Medicine",
    clinicalNote: "Sensitivity ↑ → fewer false negatives (good for ruling OUT — SnNout). Specificity ↑ → fewer false positives (good for ruling IN — SpPin). PPV increases with prevalence. NPV decreases with prevalence. LR+ = sensitivity/(1-specificity); LR- = (1-sensitivity)/specificity.",
  },

  // ── Microbiology ─────────────────────────────────────────────────────────
  {
    id: 35, acronym: "HANTAVIRUS", title: "Rodent-borne viral haemorrhagic fevers",
    expansion: ["H - Hantavirus (Hantaan, Seoul) — rodent reservoir", "A - Arenavirus (Lassa fever — Africa, Machupo — Bolivia)", "N - Nipah (fruit bats; pigs as amplifying host)", "T - (not tick-borne here)", "A - Andes virus (Hantavirus)", "V - Very high CFR (Ebola — filovirus, fruit bats)", "I - Isolation and barrier precautions critical", "R - Ribavirin effective for some (Hantavirus, Lassa)", "U - Unknown reservoir still (Ebola historically)", "S - Strict PPE required"],
    subject: "Microbiology",
    clinicalNote: "VHF (viral haemorrhagic fever) = notifiable diseases. Transmission: contact with infected body fluids (Ebola, Lassa), rodent contact (Hantavirus), tick bites (CCHF — Crimean-Congo). PPE critical for healthcare workers.",
  },
  {
    id: 36, acronym: "STOOL CULTURE BUGS", title: "Organisms causing diarrhoea by mechanism",
    expansion: ["Secretory (watery, no blood): Cholera (El Tor), ETEC, Rotavirus, Giardia, Cryptosporidium", "Invasive (bloody dysentery): Shigella, EIEC, Campylobacter, Entamoeba histolytica, Salmonella"],
    subject: "Microbiology",
    clinicalNote: "Dysentery = blood + mucus in stool. Non-dysenteric watery diarrhoea → ORS is key. Bacillary dysentery (Shigella): ciprofloxacin/azithromycin. Amoebic dysentery: metronidazole. Secretory diarrhoea: large volume, persists with fasting (unlike osmotic diarrhoea which stops with fasting).",
  },
  {
    id: 37, acronym: "HBV SEROLOGY", title: "Hepatitis B Serology Interpretation",
    expansion: ["HBsAg + Anti-HBc IgM → Acute infection", "HBsAg + Anti-HBc IgG → Chronic infection (carrier)", "Anti-HBs + Anti-HBc IgG → Past infection (immune)", "Anti-HBs alone → Vaccinated (no anti-HBc)", "HBsAg negative, HBV DNA detectable → Occult HBV"],
    subject: "Microbiology",
    clinicalNote: "HBeAg = marker of active replication + infectivity. Anti-HBe = seroconversion (reduced infectivity). Window period: HBsAg cleared, anti-HBs not yet detected — only anti-HBc IgM positive. HBV vaccination: 3 doses at 0, 1, 6 months.",
  },
  {
    id: 38, acronym: "HIV CD4 OI", title: "HIV: CD4 count thresholds for OIs",
    expansion: ["CD4 <500: Oral candidiasis, hairy leukoplakia", "CD4 <200: PCP (Pneumocystis), toxoplasmosis risk begins", "CD4 <100: Cryptococcal meningitis, Microsporidium", "CD4 <50: CMV retinitis, MAC (Mycobacterium avium complex), CNS lymphoma"],
    subject: "Microbiology",
    clinicalNote: "Prophylaxis: CD4 <200 → cotrimoxazole (PCP + toxo); CD4 <50 → azithromycin (MAC). Start ART at any CD4 count. IRIS (immune reconstitution inflammatory syndrome) can occur when starting ART.",
  },

  // ── Biochemistry ─────────────────────────────────────────────────────────
  {
    id: 39, acronym: "GLEAM", title: "Lysosomal Storage Diseases",
    expansion: ["G - Gaucher's (glucocerebrosidase deficiency — glucocerebroside)", "L - (NPC — Niemann-Pick C — not lysosomal enzyme defect)", "E - (Fabry) Alpha-galactosidase A → globotriaosylceramide", "A - (NP A/B) Sphingomyelinase → sphingomyelin", "M - (MPS) Mucopolysaccharidoses (Hurler = iduronate sulfatase, Hunter = iduronate sulfatase 2)"],
    subject: "Biochemistry",
    clinicalNote: "Cherry-red spot: Tay-Sachs + Niemann-Pick A + some others. Bone marrow macrophages: Gaucher ('crinkled paper') + Niemann-Pick (foam cells). Enzyme replacement therapy available for: Gaucher (imiglucerase), Fabry (agalsidase), Pompe (alglucosidase).",
  },
  {
    id: 40, acronym: "TIPSS", title: "Enzyme deficiencies in major IEM",
    expansion: ["T - Tay-Sachs: Hexosaminidase A", "I - (Isovaleric acidaemia) Isovaleryl-CoA dehydrogenase", "P - PKU: Phenylalanine hydroxylase", "S - Sanfilippo: Heparan sulfate sulfamidase (MPS IIIA)", "S - Sphingomyelinase deficiency: Niemann-Pick A/B"],
    subject: "Biochemistry",
    clinicalNote: "Newborn screening (Guthrie/MS-MS) can detect: PKU, galactosaemia, hypothyroidism, G6PD, sickle cell, MSUD (maple syrup urine disease). Universal newborn screening helps prevent intellectual disability by early dietary intervention.",
  },
  {
    id: 41, acronym: "PCSK9 STATINS", title: "Cholesterol-lowering drug mechanisms",
    expansion: ["P - PCSK9 inhibitors (alirocumab, evolocumab): block LDL receptor degradation", "C - Cholestyramine/colestipol: bind bile acids in gut", "S - Statins: inhibit HMG-CoA reductase (rate-limiting step)", "K - (cholesterol absorption) Ezetimibe: blocks NPC1L1", "9 - Niacin: reduces VLDL production (also raises HDL)", "S - (fibrates) Fibrates: activate PPARα → reduced TG"],
    subject: "Biochemistry",
    clinicalNote: "PCSK9 inhibitors are most potent LDL reducers (50-60% reduction on top of statins). Statins can reduce LDL by 30-50%. Rosuvastatin = most potent statin. HMG-CoA reductase also the target of red yeast rice (traditional Chinese medicine).",
  },

  // ── Paediatrics ───────────────────────────────────────────────────────────
  {
    id: 42, acronym: "APGAR", title: "Neonatal Assessment at 1 and 5 minutes",
    expansion: ["A - Appearance (skin colour): 0 = blue/pale, 1 = acrocyanosis, 2 = pink all over", "P - Pulse (heart rate): 0 = absent, 1 = <100/min, 2 = ≥100/min", "G - Grimace (reflex irritability): 0 = none, 1 = grimace, 2 = cough/sneeze", "A - Activity (muscle tone): 0 = limp, 1 = some flexion, 2 = active flexion", "R - Respiration: 0 = absent, 1 = weak cry, 2 = vigorous cry"],
    subject: "Paediatrics",
    clinicalNote: "Assessed at 1 minute and 5 minutes. Score 7-10 = normal; 4-6 = moderate depression (stimulate, O2); 0-3 = severe depression (resuscitate). Score of 6 at 5 min → repeat every 5 min until 20 min. Predictor of neonatal adaptation (1 min) and neurological outcome (5 min).",
  },
  {
    id: 43, acronym: "MILESTONES 123", title: "Key developmental milestones by months",
    expansion: ["2 months: Social smile", "3-4 months: Head steady (in supported sitting)", "4-5 months: Rolls over; reaches for objects", "6 months: Sits unsupported; transfers objects", "9 months: Pincer grasp; pulls to stand", "12 months: Walks independently; 2-3 words + 'mama/dada'", "18 months: 10-20 words; walks steadily; tower of 2 cubes", "24 months: 50+ words, 2-word phrases; runs; tower of 6 cubes"],
    subject: "Paediatrics",
    clinicalNote: "Red flags (developmental delay): no social smile by 3m, no babble by 12m, no single words by 16m, no 2-word phrases by 24m, loss of previously acquired skills (regression).",
  },
  {
    id: 44, acronym: "SAFE STRATEGY", title: "WHO SAFE Strategy for Trachoma Control",
    expansion: ["S - Surgery (tarsal rotation for trichiasis)", "A - Antibiotics (azithromycin mass drug administration for active trachoma)", "F - Facial cleanliness", "E - Environmental improvement (water, sanitation)"],
    subject: "ENT/Ophthalmology",
    clinicalNote: "Trachoma = leading infectious cause of blindness (Chlamydia trachomatis, serotypes A-C). FISTO grading: TF (follicular), TI (intense), TS (scarring), TT (trichiasis), CO (corneal opacity). TF+TI = active trachoma. Azithromycin 1g stat OR tetracycline eye ointment BID × 6 weeks.",
  },
  {
    id: 45, acronym: "RESP RATE", title: "Normal respiratory rates by age",
    expansion: ["Newborn: 30-60 breaths/min", "1-12 months: 30-60 breaths/min (same)", "1-5 years: 20-40 breaths/min", "6-12 years: 15-30 breaths/min", "Adults: 12-20 breaths/min"],
    subject: "Paediatrics",
    clinicalNote: "WHO definition of fast breathing (pneumonia risk assessment): ≥60 in <2 months; ≥50 in 2-12 months; ≥40 in 1-5 years. Pneumonia diagnosis in children under IMNCI: fast breathing OR chest indrawing. Severe: general danger sign + severe chest indrawing or stridor.",
  },
  {
    id: 46, acronym: "CVID ABC", title: "Primary Immunodeficiency types",
    expansion: ["C - Combined (B + T cell): SCID (RAG1/2, ADA deficiency, γc chain deficiency)", "V - Variable immunodeficiency: CVID (low IgG, IgA, IgM — most common symptomatic PID in adults)", "I - IgA deficiency (most common PID overall)", "D - DiGeorge syndrome (22q11.2 deletion — absent thymus, absent T cells, hypocalcaemia)", "A - Agammaglobulinaemia (Bruton's XLA — absent B cells, absent all Ig)", "B - B cell deficiencies: recurrent encapsulated organism infections", "C - Complement deficiency: C3 → recurrent pyogenic; C5-C8 → Neisseria infections"],
    subject: "Microbiology",
    clinicalNote: "PID should be suspected: recurrent infections with unusual organisms, failure to thrive, family history. XLA (Bruton's): X-linked, BTK mutation, absent B cells, absent all Ig, presents ~6 months (maternal Ab wane). Treatment: IVIG replacement.",
  },
  {
    id: 47, acronym: "CREST", title: "CREST Syndrome (Limited Systemic Sclerosis)",
    expansion: ["C - Calcinosis (calcium deposits in skin)", "R - Raynaud's phenomenon (often first symptom)", "E - Oesophageal dysmotility", "S - Sclerodactyly (thickened finger skin)", "T - Telangiectasia"],
    subject: "Medicine",
    clinicalNote: "CREST = Limited cutaneous scleroderma (lcSSc). Anti-centromere antibody (ACA) is specific for lcSSc (~70%). ACA associated with lower risk of pulmonary fibrosis but risk of pulmonary arterial hypertension. Diffuse SSc: anti-topoisomerase I (anti-Scl-70); early skin thickening.",
  },
  {
    id: 48, acronym: "ROME CRITERIA IBS", title: "Rome IV criteria for IBS",
    expansion: ["R - Recurrent abdominal pain ≥1 day/week for 3 months (average)", "O - Onset ≥6 months ago", "M - Modified (improved/worsened) by bowel habit", "E - Edge (associated with change in stool frequency or form)"],
    subject: "Medicine",
    clinicalNote: "IBS types: IBS-C (constipation predominant), IBS-D (diarrhoea), IBS-M (mixed). Alarm features (red flags): >50 years new onset, weight loss, rectal bleeding, positive family history of IBD/colorectal cancer → requires investigation. Treatment: dietary (low FODMAP), antispasmodics, antidepressants.",
  },
  {
    id: 49, acronym: "FRACTURES NERVES", title: "Fracture and associated nerve injury",
    expansion: ["Midshaft humerus: Radial nerve → wrist drop", "Supracondylar humerus (child): Anterior interosseous nerve (median nerve branch) → unable to make 'OK' sign", "Medial epicondyle: Ulnar nerve → claw hand (ring + little fingers)", "Neck of fibula: Common peroneal nerve → foot drop", "Anterior shoulder dislocation: Axillary nerve → deltoid paralysis + sensory loss regimental badge area", "Scaphoid fracture: Recurrent (motor) branch of median nerve"],
    subject: "Anatomy",
    clinicalNote: "Key for NEET PG: radial nerve = most commonly injured nerve in upper limb fractures. Common peroneal = most vulnerable nerve in lower limb (exposed at fibula neck). Axillary nerve = most common in shoulder dislocation.",
  },
  {
    id: 50, acronym: "DERMATOLOGY ABCs", title: "Primary skin lesions classification",
    expansion: ["A - Abscess (pus collection), Atrophy", "B - Bulla (blister >5mm), Burrow (scabies)", "C - Cyst, Comedone", "D - Dermographism (urticaria factitia)", "E - Erosion (loss of epidermis), Excoriation", "F - Fissure (linear split through dermis)", "G - Gangrene, Guttate (drop-like)", "M - Macule (<1cm flat), Maculopapule", "N - Nodule (>0.5cm, deep)", "P - Papule (<0.5cm elevated), Plaque (>2cm elevated flat-topped), Pustule", "U - Ulcer, Urtica (wheal)", "V - Vesicle (<5mm blister)"],
    subject: "ENT/Ophthalmology",
    clinicalNote: "Key exam question: a plaque is a large, raised, flat-topped lesion >1cm (often confluence of papules). Psoriasis = erythematous plaques with silvery scales (Auspitz sign: pinpoint bleeding on scale removal). Lichen planus = 6 Ps: Pruritic, Planar, Polygonal, Purple, Papules, Plaques.",
  },
  {
    id: 51, acronym: "ABCDE MELANOMA", title: "Melanoma ABCDE criteria",
    expansion: ["A - Asymmetry", "B - Border (irregular, ragged)", "C - Colour variation (multiple colours)", "D - Diameter >6mm", "E - Evolution (change over time) — most important!"],
    subject: "ENT/Ophthalmology",
    clinicalNote: "Melanoma = most dangerous skin cancer. BRAF V600E mutation in ~50% → vemurafenib/dabrafenib targeted therapy. Staging: Breslow thickness (depth in mm) most important prognostic factor. Clark levels (I-V) based on anatomical layers. PD-L1 inhibitors (pembrolizumab, nivolumab) for metastatic melanoma.",
  },
  {
    id: 52, acronym: "FAT SOLUBLE ADEK", title: "Fat-soluble vitamins and deficiency",
    expansion: ["A - Vitamin A (retinol): Night blindness → Bitot's spots → Keratomalacia", "D - Vitamin D (cholecalciferol): Rickets (children), Osteomalacia (adults)", "E - Vitamin E (tocopherol): Haemolytic anaemia in neonates, ataxia, neuropathy", "K - Vitamin K (phylloquinone): Bleeding (↑PT, ↑INR), haemorrhagic disease of newborn"],
    subject: "Biochemistry",
    clinicalNote: "Vitamin K: synthesised by gut bacteria; deficient in neonates (no gut flora) and fat malabsorption. All fat-soluble vitamins can accumulate (toxicity possible). Vitamin D: both sun-derived and dietary; 7-dehydrocholesterol → D3 (skin) → 25-OH-D3 (liver) → 1,25-(OH)₂D3 (active, kidney via 1α-hydroxylase).",
  },
  {
    id: 53, acronym: "GOLD COPD", title: "GOLD COPD Staging by FEV1",
    expansion: ["GOLD 1 (Mild): FEV1 ≥80% predicted", "GOLD 2 (Moderate): FEV1 50-79%", "GOLD 3 (Severe): FEV1 30-49%", "GOLD 4 (Very severe): FEV1 <30%"],
    subject: "Medicine",
    clinicalNote: "GOLD 2023: staging based on post-bronchodilator FEV1/FVC <0.70 + FEV1. Group A (low risk, low symptoms): SABA/SAMA. Group B (low risk, more symptoms): LABA or LAMA. Group E (high risk/high symptoms): LABA+LAMA (± ICS if eosinophil ≥300 or ≥2 exacerbations). Triple therapy (LABA+LAMA+ICS) reduces exacerbations and mortality.",
  },
  {
    id: 54, acronym: "SIADH TREATMENT", title: "SIADH treatment ladder",
    expansion: ["1st: Fluid restriction (key — restrict to <1L/day)", "2nd: Salt tablets + loop diuretics (furosemide to cause dilute urine)", "3rd: Demeclocycline (causes nephrogenic DI — blocks ADH action in collecting duct)", "4th: Vaptans (tolvaptan — V2 receptor antagonist; conivaptan IV)"],
    subject: "Medicine",
    clinicalNote: "Correct Na no faster than 10-12 mEq/L per 24 hours (avoid osmotic demyelination syndrome/central pontine myelinolysis). Hypertonic saline (3%) only if severe symptomatic hyponatraemia (seizures). Chronic hyponatraemia correction is more dangerous than acute.",
  },
  {
    id: 55, acronym: "5Fs GALLSTONES", title: "Risk factors for cholelithiasis",
    expansion: ["Fat (obesity)", "Fertile (multiparity — oestrogen increases bile cholesterol, progesterone reduces motility)", "Forty (age >40 years)", "Female (female sex — 2-3× higher risk)", "Fair (Caucasian/Native American ethnicity)"],
    subject: "Surgery",
    clinicalNote: "80% of gallstones in Western countries = cholesterol stones. 20% = pigment stones (haemolysis = black; bile duct infection = brown). Risk factors also: Crohn's disease (ileal malabsorption of bile acids), rapid weight loss, diabetes. Gallstones: 90% asymptomatic. Surgery (cholecystectomy) only for symptomatic stones or complications.",
  },
  {
    id: 56, acronym: "ERCP COMPLICATIONS", title: "Post-ERCP complication mnemonic",
    expansion: ["P - Pancreatitis (most common, 3-5%)", "A - Aspiration", "N - Normal complications (bleeding, infection)", "C - Cholangitis (biliary sepsis)", "R - Retroperitoneal perforation", "E - EAP (early acute pancreatitis)", "A - Allergy to contrast", "S - Stone impaction"],
    subject: "Surgery",
    clinicalNote: "ERCP = Endoscopic Retrograde Cholangiopancreatography. Indications: choledocholithiasis, biliary strictures, PSC, bile duct injuries. Post-ERCP pancreatitis reduced by: rectal indomethacin (prophylactic), pancreatic duct stenting, using low-osmolality contrast.",
  },
  {
    id: 57, acronym: "JVP WAVES", title: "JVP waveform components",
    expansion: ["'a' wave: Atrial contraction (presystolic)", "'c' wave: Tricuspid valve bulging / closure", "'x' descent: Atrial relaxation (fall)", "'v' wave: Venous filling (passive, tricuspid closed)", "'y' descent: Tricuspid valve opens (ventricular filling begins)"],
    subject: "Physiology",
    clinicalNote: "'a' wave absent in AF (no atrial contraction). Cannon 'a' waves: complete heart block, ventricular tachycardia (RV contracts against closed TV). Giant 'a' wave (tall, dominant): tricuspid stenosis, pulmonary stenosis. 'v' wave prominent in tricuspid regurgitation. 'y' descent sharp in constrictive pericarditis (Friedreich's sign).",
  },
  {
    id: 58, acronym: "NIEMANN PICK", title: "Niemann-Pick Subtypes",
    expansion: ["Type A: Sphingomyelinase deficient, infantile, neuropathic, FATAL <3 yrs", "Type B: Sphingomyelinase deficient, adult, non-neuropathic, hepatosplenomegaly", "Type C: NPC1/NPC2 mutation (intracellular cholesterol trafficking), neuropathic, vertical supranuclear gaze palsy"],
    subject: "Biochemistry",
    clinicalNote: "Cherry-red spot in Type A (not Type B or C usually). Foam cells in liver/spleen/bone marrow. Type C is diagnosed by filipin staining (cholesterol accumulation in lysosomes). Treatment: miglustat (Type C) — substrate reduction therapy. No enzyme replacement for NPC.",
  },
  {
    id: 59, acronym: "ACE INHIBITOR SE", title: "ACE inhibitor side effects",
    expansion: ["A - Angioedema (life-threatening, switch to ARB)", "C - Cough (bradykinin accumulation — 10-15%, switch to ARB)", "E - Elevation of creatinine (especially bilateral RAS — check after 1 week)", "I - Increase in potassium (hyperkalaemia)", "N - Not in pregnancy (teratogenic — renal agenesis)", "H - Hypotension (first dose effect, especially with diuretics)", "I - Impairment of renal function (acute kidney injury if dehydrated)"],
    subject: "Pharmacology",
    clinicalNote: "ACE inhibitors slow progression of diabetic nephropathy and HFrEF independent of BP lowering. Contraindicated: bilateral renal artery stenosis, pregnancy, hyperkalaemia (K⁺ >5.5). Serum creatinine rise <30% acceptable after starting ACE inhibitor.",
  },
  {
    id: 60, acronym: "WHIM SCORE", title: "Wells Score for DVT",
    expansion: ["Active cancer (+1)", "Paralysis/paresis/plaster (+1)", "Bedridden >3 days or major surgery <12 weeks (+1)", "Tenderness along deep venous system (+1)", "Entire leg swollen (+1)", "Calf >3cm swelling vs other side (+1)", "Pitting oedema confined to symptomatic leg (+1)", "Collateral superficial veins (+1)", "Alternative diagnosis at least as likely (-2)"],
    subject: "Medicine",
    clinicalNote: "Score ≥2 = high probability DVT → proceed to compression ultrasound directly. Score <2 = low probability → D-dimer first (if negative, DVT excluded). D-dimer: high sensitivity, low specificity (positive in many conditions). Compression US: 94% sensitivity for proximal DVT.",
  },
  {
    id: 61, acronym: "PHARM RENAL DOSE", title: "Drugs requiring dose adjustment in renal failure",
    expansion: ["A - Aminoglycosides (accumulate → ototoxicity/nephrotoxicity)", "D - Digoxin (half-life extended → toxicity)", "J - LMWH/unfractionated heparin (use UFH in severe CKD, LMWH accumulates)", "U - Uranium-like → Metformin (lactic acidosis risk, stop if eGFR <30)", "S - Sulphonylureas (especially glibenclamide → prolonged hypoglycaemia)", "T - Tetracyclines (avoid — worsen azotaemia)"],
    subject: "Pharmacology",
    clinicalNote: "Drugs safe in renal failure (hepatic metabolism/biliary excretion): rifampicin, isoniazid (adjust if severe), pyrazinamide (use with caution), ethambutol (reduce dose). NSAIDs: avoid in CKD (reduce GFR via PGI2 inhibition). Warfarin: use with caution (increased sensitivity).",
  },
  {
    id: 62, acronym: "CURB-65", title: "CAP Severity Score (CURB-65)",
    expansion: ["C - Confusion (new onset, MMSE ≤8)", "U - Urea >7 mmol/L (BUN >19 mg/dL)", "R - Respiratory rate ≥30/min", "B - Blood pressure: systolic <90 or diastolic ≤60 mmHg", "65 - Age ≥65 years"],
    subject: "Medicine",
    clinicalNote: "Score 0-1: low severity → home. Score 2: moderate → hospitalise. Score 3-5: severe → ICU consideration. PSI (Pneumonia Severity Index) is more complex but more accurate. Streptococcus pneumoniae most common cause CAP. Start antibiotics within 4 hours of diagnosis.",
  },
  {
    id: 63, acronym: "GINA ASTHMA STEPS", title: "GINA Asthma Treatment Steps",
    expansion: ["Step 1: PRN low-dose ICS-formoterol (preferred) or SABA", "Step 2: Low-dose ICS + PRN SABA or ICS-formoterol PRN", "Step 3: Low-dose ICS-LABA + PRN SABA", "Step 4: Medium-dose ICS-LABA + PRN SABA", "Step 5: High-dose ICS-LABA + consider tiotropium/anti-IgE/anti-IL5/anti-TSLP"],
    subject: "Medicine",
    clinicalNote: "GINA 2023: preferred reliever is ICS-formoterol (not plain SABA) for all steps ≥1 in adults (reduces exacerbation risk even in mild asthma). LABA never given without ICS (risk of fatal asthma). Severe acute asthma: salbutamol nebulisation + ipratropium + systemic steroids + O2 + MgSO4 IV.",
  },
];

const SUBJECTS = [
  "All",
  "Medicine", "Surgery", "OBG", "Paediatrics",
  "PSM/Community Medicine", "Pharmacology", "Pathology",
  "Microbiology", "Biochemistry", "Anatomy",
  "Physiology", "ENT/Ophthalmology", "Forensic Medicine",
] as const;

const SUBJECT_COLORS: Record<string, string> = {
  "Medicine":             "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Surgery":              "bg-red-500/15 text-red-400 border-red-500/30",
  "OBG":                  "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Paediatrics":          "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "PSM/Community Medicine":"bg-green-500/15 text-green-400 border-green-500/30",
  "Pharmacology":         "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Pathology":            "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Microbiology":         "bg-teal-500/15 text-teal-400 border-teal-500/30",
  "Biochemistry":         "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Anatomy":              "bg-lime-500/15 text-lime-400 border-lime-500/30",
  "Physiology":           "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "ENT/Ophthalmology":    "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  "Forensic Medicine":    "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

// ─── Component ─────────────────────────────────────────────────────────────
export function MnemonicsBank() {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MNEMONICS.filter(m => {
      const subjectMatch = activeSubject === "All" || m.subject === activeSubject;
      if (!subjectMatch) return false;
      if (!q) return true;
      return (
        m.acronym.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.expansion.some(e => e.toLowerCase().includes(q)) ||
        m.clinicalNote.toLowerCase().includes(q)
      );
    });
  }, [query, activeSubject]);

  const handleCopy = (m: Mnemonic) => {
    const text = `${m.acronym} — ${m.title}\n${m.expansion.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n\nClinical Note: ${m.clinicalNote}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1800);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-2.5">
        <div className="bg-violet-500/20 p-1.5 rounded-lg shrink-0">
          <Brain className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-mono font-bold text-foreground">Mnemonics Bank</p>
          <p className="text-[10px] font-mono text-muted-foreground">
            {MNEMONICS.length} mnemonics · {filtered.length} shown
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search mnemonics, subjects, keywords…"
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Subject filter pills */}
      <div className="flex gap-2 flex-wrap">
        {SUBJECTS.map(subj => (
          <button
            key={subj}
            onClick={() => setActiveSubject(subj)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
              activeSubject === subj
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          No mnemonics match your search.
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(m => {
          const subjectColor = SUBJECT_COLORS[m.subject] ?? "bg-muted/30 text-muted-foreground border-border";
          const isCopied = copiedId === m.id;
          return (
            <div
              key={m.id}
              className="bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/30 transition-colors"
            >
              {/* Card header */}
              <div className="px-4 pt-4 pb-3 border-b border-border/50 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono font-extrabold text-lg text-primary leading-tight tracking-wide">
                    {m.acronym}
                  </p>
                  <p className="text-xs font-mono text-foreground/70 mt-0.5 leading-snug">{m.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${subjectColor}`}>
                    {m.subject}
                  </span>
                  <button
                    onClick={() => handleCopy(m)}
                    title="Copy mnemonic"
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {isCopied
                      ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      : <Copy className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </div>

              {/* Expansion */}
              <div className="px-4 py-3 space-y-1 flex-1">
                {m.expansion.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-mono">
                    <span className="text-primary font-bold shrink-0 w-4">
                      {item.includes(" — ") || item.includes(": ") ? item.split(/[ —:]/)[0] : String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-foreground/80 leading-relaxed">
                      {item.includes(" — ") ? item.split(" — ").slice(1).join(" — ") :
                       item.includes(": ") ? item.split(": ").slice(1).join(": ") : item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Clinical note */}
              <div className="px-4 pb-4">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-mono text-foreground/60 leading-relaxed">
                    <span className="text-amber-400 font-semibold">Tip: </span>
                    {m.clinicalNote}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
