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
  "PSM/Community Medicine",
  "Forensic Medicine",
];

export const QUESTIONS: Question[] = [
  // ─── PHARMACOLOGY (18) ───────────────────────────────────────────────────
  {
    id: 1,
    subject: "Pharmacology",
    stem: "Drug of choice for absence seizures is:",
    options: ["Phenytoin", "Ethosuximide", "Carbamazepine", "Valproate"],
    answer: 1,
    explanation:
      "Ethosuximide is DOC for pure absence seizures; blocks T-type Ca²⁺ channels in thalamus. Valproate is used when absence coexists with other seizure types.",
  },
  {
    id: 2,
    subject: "Pharmacology",
    stem: "Which antiarrhythmic drug belongs to Vaughan Williams class IC?",
    options: ["Lidocaine", "Flecainide", "Amiodarone", "Sotalol"],
    answer: 1,
    explanation:
      "Class IC drugs (Flecainide, Propafenone) markedly slow conduction with minimal effect on repolarisation. Lidocaine is IB; Amiodarone is III; Sotalol is III (also beta-blocker).",
  },
  {
    id: 3,
    subject: "Pharmacology",
    stem: "Mechanism of action of metformin is:",
    options: [
      "Stimulation of pancreatic beta cells",
      "Activation of AMPK via inhibition of complex I of mitochondria",
      "Inhibition of alpha-glucosidase",
      "Blockade of SGLT-2 in proximal tubule",
    ],
    answer: 1,
    explanation:
      "Metformin inhibits mitochondrial complex I → reduces ATP/AMP ratio → activates AMPK → decreases hepatic gluconeogenesis. It does not stimulate insulin secretion.",
  },
  {
    id: 4,
    subject: "Pharmacology",
    stem: "Drug of choice for Pneumocystis jirovecii pneumonia (PCP) prophylaxis in HIV is:",
    options: [
      "Pentamidine",
      "Trimethoprim-sulfamethoxazole",
      "Atovaquone",
      "Dapsone",
    ],
    answer: 1,
    explanation:
      "TMP-SMX (co-trimoxazole) is DOC for both treatment and prophylaxis of PCP; started when CD4 count falls below 200 cells/µL.",
  },
  {
    id: 5,
    subject: "Pharmacology",
    stem: "Which aminoglycoside is used in the treatment of multidrug-resistant tuberculosis?",
    options: ["Gentamicin", "Tobramycin", "Amikacin", "Netilmicin"],
    answer: 2,
    explanation:
      "Amikacin (and streptomycin) are aminoglycosides used in MDR-TB regimens; amikacin resists more aminoglycoside-modifying enzymes than other members of the class.",
  },
  {
    id: 6,
    subject: "Pharmacology",
    stem: "The antidote for organophosphate poisoning that reactivates acetylcholinesterase is:",
    options: ["Atropine", "Pralidoxime (2-PAM)", "Physostigmine", "Neostigmine"],
    answer: 1,
    explanation:
      "Pralidoxime reactivates phosphorylated AChE if given before aging occurs. Atropine blocks muscarinic effects but does not reactivate the enzyme.",
  },
  {
    id: 7,
    subject: "Pharmacology",
    stem: "Which beta-blocker has intrinsic sympathomimetic activity (ISA)?",
    options: ["Metoprolol", "Atenolol", "Pindolol", "Propranolol"],
    answer: 2,
    explanation:
      "Pindolol (and acebutolol, oxprenolol) possess ISA, acting as partial agonists at beta receptors. This property reduces bradycardia and lipid effects at rest.",
  },
  {
    id: 8,
    subject: "Pharmacology",
    stem: "Drug of choice for Helicobacter pylori eradication in combination with a PPI is:",
    options: [
      "Amoxicillin + Metronidazole",
      "Clarithromycin + Amoxicillin",
      "Tetracycline + Ciprofloxacin",
      "Azithromycin + Tinidazole",
    ],
    answer: 1,
    explanation:
      "Standard triple therapy: PPI + Clarithromycin + Amoxicillin for 14 days. Clarithromycin-based regimens achieve >90% eradication in susceptible strains.",
  },
  {
    id: 9,
    subject: "Pharmacology",
    stem: "Mechanism of action of statins is:",
    options: [
      "Inhibition of lipoprotein lipase",
      "Activation of LDL receptors directly",
      "Inhibition of HMG-CoA reductase",
      "Inhibition of PCSK9",
    ],
    answer: 2,
    explanation:
      "Statins competitively inhibit HMG-CoA reductase (rate-limiting step in cholesterol synthesis), upregulating hepatic LDL receptors and reducing plasma LDL.",
  },
  {
    id: 10,
    subject: "Pharmacology",
    stem: "Which drug is the DOC for status epilepticus in adults?",
    options: [
      "Phenytoin IV",
      "Diazepam IV followed by phenytoin",
      "Lorazepam IV",
      "Phenobarbitone IV",
    ],
    answer: 2,
    explanation:
      "Lorazepam IV is the first-line agent for status epilepticus due to its longer duration of CNS action compared to diazepam. Phenytoin is used as second-line.",
  },
  {
    id: 11,
    subject: "Pharmacology",
    stem: "Which drug acts by inhibiting the Na⁺/K⁺/2Cl⁻ cotransporter (NKCC2) in the thick ascending limb of Henle?",
    options: ["Hydrochlorothiazide", "Furosemide", "Spironolactone", "Acetazolamide"],
    answer: 1,
    explanation:
      "Loop diuretics (furosemide, ethacrynic acid) block NKCC2 in the thick ascending limb, producing profound natriuresis. Thiazides block NCC in the distal tubule.",
  },
  {
    id: 12,
    subject: "Pharmacology",
    stem: "Reverse transcriptase inhibitor used in HIV that does NOT require phosphorylation to be active is:",
    options: ["Zidovudine", "Tenofovir", "Nevirapine", "Lamivudine"],
    answer: 2,
    explanation:
      "Non-nucleoside RTIs (NNRTIs) like Nevirapine bind directly to reverse transcriptase without intracellular phosphorylation, unlike NRTIs which are prodrugs requiring activation.",
  },
  {
    id: 13,
    subject: "Pharmacology",
    stem: "The DOC for prophylaxis of migraine is:",
    options: ["Sumatriptan", "Ergotamine", "Propranolol", "Paracetamol"],
    answer: 2,
    explanation:
      "Propranolol (beta-blocker) and topiramate are first-line prophylactic agents for migraine. Sumatriptan and ergotamine are abortive, not preventive, treatments.",
  },
  {
    id: 14,
    subject: "Pharmacology",
    stem: "Which drug is a selective serotonin-norepinephrine reuptake inhibitor (SNRI) used in diabetic neuropathy?",
    options: ["Amitriptyline", "Duloxetine", "Fluoxetine", "Mirtazapine"],
    answer: 1,
    explanation:
      "Duloxetine is an SNRI approved for diabetic peripheral neuropathic pain; it inhibits both serotonin and norepinephrine reuptake, modulating pain pathways.",
  },
  {
    id: 15,
    subject: "Pharmacology",
    stem: "Warfarin acts by inhibiting:",
    options: [
      "Thrombin directly",
      "Vitamin K epoxide reductase (VKORC1)",
      "Factor Xa directly",
      "Platelet glycoprotein IIb/IIIa",
    ],
    answer: 1,
    explanation:
      "Warfarin inhibits VKORC1, preventing recycling of vitamin K, thereby blocking gamma-carboxylation of factors II, VII, IX, X and proteins C and S.",
  },
  {
    id: 16,
    subject: "Pharmacology",
    stem: "Drug of choice for Clostridium difficile colitis (mild-moderate) is:",
    options: ["Metronidazole oral", "Vancomycin IV", "Fidaxomicin oral", "Vancomycin oral"],
    answer: 3,
    explanation:
      "Current guidelines recommend oral vancomycin (or fidaxomicin) as first-line for C. difficile infection; oral vancomycin is not absorbed and acts locally in the colon.",
  },
  {
    id: 17,
    subject: "Pharmacology",
    stem: "Which immunosuppressant inhibits calcineurin, thereby blocking IL-2 transcription?",
    options: ["Azathioprine", "Mycophenolate mofetil", "Cyclosporine", "Sirolimus"],
    answer: 2,
    explanation:
      "Cyclosporine (and tacrolimus) bind to cyclophilin (FK-binding protein for tacrolimus), inhibiting calcineurin → block NFAT dephosphorylation → reduce IL-2 production.",
  },
  {
    id: 18,
    subject: "Pharmacology",
    stem: "The 'cheese reaction' with MAO inhibitors is caused by excess:",
    options: ["Dopamine", "Tyramine", "Histamine", "Serotonin"],
    answer: 1,
    explanation:
      "MAO normally metabolises dietary tyramine in the gut. With MAO inhibition, tyramine accumulates, causing massive catecholamine release and hypertensive crisis.",
  },

  // ─── PHYSIOLOGY (12) ─────────────────────────────────────────────────────
  {
    id: 19,
    subject: "Physiology",
    stem: "The normal resting membrane potential of a cardiac ventricular myocyte is approximately:",
    options: ["-55 mV", "-70 mV", "-90 mV", "-110 mV"],
    answer: 2,
    explanation:
      "Ventricular myocytes have a resting membrane potential of approximately -90 mV, maintained mainly by the inward-rectifier K⁺ current (IK1).",
  },
  {
    id: 20,
    subject: "Physiology",
    stem: "Erythropoietin is primarily produced by which cells?",
    options: [
      "Hepatocytes",
      "Peritubular interstitial cells of the renal cortex",
      "Juxtaglomerular cells",
      "Bone marrow stromal cells",
    ],
    answer: 1,
    explanation:
      "~90% of EPO is produced by peritubular interstitial fibroblasts in the renal cortex in response to hypoxia via HIF-2α. The liver produces the remaining 10%.",
  },
  {
    id: 21,
    subject: "Physiology",
    stem: "The Hering-Breuer reflex is mediated by:",
    options: [
      "Central chemoreceptors in the medulla",
      "Slowly-adapting pulmonary stretch receptors via the vagus nerve",
      "Peripheral chemoreceptors in the carotid body",
      "J-receptors (juxtacapillary receptors)",
    ],
    answer: 1,
    explanation:
      "Slowly-adapting pulmonary stretch receptors (SARs) signal via the vagus nerve to terminate inspiration when the lung is sufficiently inflated — the Hering-Breuer reflex.",
  },
  {
    id: 22,
    subject: "Physiology",
    stem: "Which segment of the nephron is impermeable to water even in the presence of ADH?",
    options: [
      "Proximal convoluted tubule",
      "Descending limb of loop of Henle",
      "Thick ascending limb of loop of Henle",
      "Collecting duct",
    ],
    answer: 2,
    explanation:
      "The thick ascending limb (diluting segment) lacks aquaporins and is always water-impermeable, actively reabsorbing NaCl to create medullary hypertonicity.",
  },
  {
    id: 23,
    subject: "Physiology",
    stem: "Oxygen-haemoglobin dissociation curve is shifted to the RIGHT by:",
    options: [
      "Decreased temperature",
      "Decreased PCO₂",
      "Increased 2,3-DPG",
      "Increased pH",
    ],
    answer: 2,
    explanation:
      "Increased 2,3-DPG (also increased CO₂, decreased pH, increased temperature) shifts the curve right, decreasing Hb-O₂ affinity and promoting O₂ release to tissues.",
  },
  {
    id: 24,
    subject: "Physiology",
    stem: "The Frank-Starling mechanism states that:",
    options: [
      "Heart rate increases linearly with venous return",
      "Stroke volume increases with increased end-diastolic volume",
      "Contractility decreases with increased afterload",
      "Cardiac output is independent of preload",
    ],
    answer: 1,
    explanation:
      "Frank-Starling law: increased end-diastolic volume (preload) stretches sarcomeres to optimal overlap, increasing cross-bridge formation and thus stroke volume.",
  },
  {
    id: 25,
    subject: "Physiology",
    stem: "Which hormone triggers translocation of GLUT-4 vesicles to the plasma membrane in muscle and adipose tissue?",
    options: ["Glucagon", "Cortisol", "Insulin", "GLP-1"],
    answer: 2,
    explanation:
      "In the absorptive phase, insulin triggers translocation of GLUT-4 vesicles to the plasma membrane in muscle and adipose tissue, enabling glucose uptake independent of glucose concentration.",
  },
  {
    id: 26,
    subject: "Physiology",
    stem: "Dead space ventilation is best measured by:",
    options: [
      "Spirometry",
      "Bohr's equation using CO₂",
      "Peak flow meter",
      "Body plethysmography",
    ],
    answer: 1,
    explanation:
      "Bohr's equation (VD/VT = [PaCO₂ - PECO₂]/PaCO₂) calculates physiological dead space from arterial and mixed expired CO₂ tensions.",
  },
  {
    id: 27,
    subject: "Physiology",
    stem: "Aldosterone acts primarily on which segment of the nephron?",
    options: [
      "Proximal convoluted tubule",
      "Thick ascending limb",
      "Distal convoluted tubule and collecting duct",
      "Thin descending limb",
    ],
    answer: 2,
    explanation:
      "Aldosterone binds the mineralocorticoid receptor in the principal cells of the DT and collecting duct, upregulating ENaC and Na⁺/K⁺-ATPase to retain Na⁺ and excrete K⁺.",
  },
  {
    id: 28,
    subject: "Physiology",
    stem: "During the absolute refractory period of a nerve action potential, a second stimulus:",
    options: [
      "Produces a normal action potential",
      "Produces a subthreshold action potential",
      "Cannot generate an action potential regardless of stimulus strength",
      "Produces a larger-than-normal action potential",
    ],
    answer: 2,
    explanation:
      "During the absolute refractory period, all fast Na⁺ channels are inactivated; no stimulus, however strong, can generate a second action potential.",
  },
  {
    id: 29,
    subject: "Physiology",
    stem: "The P50 of normal adult haemoglobin (HbA) is approximately:",
    options: ["16 mmHg", "26 mmHg", "36 mmHg", "46 mmHg"],
    answer: 1,
    explanation:
      "P50 (PO₂ at 50% Hb saturation) for HbA is ~26 mmHg at pH 7.4, 37 °C. Fetal HbF has a lower P50 (~20 mmHg), favouring O₂ transfer from mother to fetus.",
  },
  {
    id: 30,
    subject: "Physiology",
    stem: "The Cushing reflex (response to raised intracranial pressure) consists of:",
    options: [
      "Tachycardia, hypotension, and irregular breathing",
      "Hypertension, bradycardia, and irregular breathing",
      "Tachycardia, hypertension, and deep breathing",
      "Hypotension, bradycardia, and apnoea",
    ],
    answer: 1,
    explanation:
      "Cushing's triad: hypertension (to maintain cerebral perfusion), reflex bradycardia (baroreceptor response), and irregular (Cheyne-Stokes) respirations — a sign of impending herniation.",
  },

  // ─── BIOCHEMISTRY (10) ────────────────────────────────────────────────────
  {
    id: 31,
    subject: "Biochemistry",
    stem: "Deficiency of glucose-6-phosphate dehydrogenase (G6PD) leads to haemolysis because:",
    options: [
      "The glycolytic pathway is blocked",
      "NADPH production is reduced, impairing glutathione reduction",
      "Heme synthesis is impaired",
      "ATP production in red cells falls below critical levels",
    ],
    answer: 1,
    explanation:
      "G6PD generates NADPH via the pentose phosphate pathway. NADPH is essential for regenerating reduced glutathione (GSH) that protects RBCs from oxidative damage.",
  },
  {
    id: 32,
    subject: "Biochemistry",
    stem: "Which enzyme is deficient in Gaucher's disease?",
    options: [
      "Sphingomyelinase",
      "Hexosaminidase A",
      "Glucocerebrosidase (acid beta-glucosidase)",
      "Alpha-L-iduronidase",
    ],
    answer: 2,
    explanation:
      "Gaucher's disease: deficiency of glucocerebrosidase → accumulation of glucocerebroside in macrophages. Classic 'crinkled tissue paper' cytoplasm on histology.",
  },
  {
    id: 33,
    subject: "Biochemistry",
    stem: "Homocystinuria due to cystathionine beta-synthase deficiency is treated with:",
    options: [
      "Vitamin B12 supplementation",
      "High-dose pyridoxine (Vitamin B6)",
      "Biotin supplementation",
      "Thiamine supplementation",
    ],
    answer: 1,
    explanation:
      "About 50% of CBS-deficient patients respond to high-dose pyridoxine (B6), which is a cofactor for cystathionine beta-synthase, reducing plasma homocysteine levels.",
  },
  {
    id: 34,
    subject: "Biochemistry",
    stem: "Rate-limiting enzyme of cholesterol synthesis is:",
    options: [
      "Squalene synthase",
      "HMG-CoA reductase",
      "Mevalonate kinase",
      "Lanosterol synthase",
    ],
    answer: 1,
    explanation:
      "HMG-CoA reductase (3-hydroxy-3-methylglutaryl-CoA reductase) is the rate-limiting, regulated step converting HMG-CoA to mevalonate; target of statins.",
  },
  {
    id: 35,
    subject: "Biochemistry",
    stem: "Lesch-Nyhan syndrome is caused by deficiency of:",
    options: [
      "Adenosine deaminase",
      "Hypoxanthine-guanine phosphoribosyltransferase (HGPRT)",
      "Xanthine oxidase",
      "Purine nucleoside phosphorylase",
    ],
    answer: 1,
    explanation:
      "HGPRT deficiency (X-linked) causes purine salvage pathway failure → uric acid overproduction → gout, self-mutilation, choreoathetosis, and intellectual disability.",
  },
  {
    id: 36,
    subject: "Biochemistry",
    stem: "Which vitamin is a cofactor for pyruvate dehydrogenase complex?",
    options: [
      "Vitamin B12",
      "Vitamin B1 (Thiamine/TPP)",
      "Vitamin B3 (Niacin)",
      "Vitamin B7 (Biotin)",
    ],
    answer: 1,
    explanation:
      "Pyruvate dehydrogenase requires TPP (B1), lipoic acid, CoA (B5), FAD (B2), and NAD⁺ (B3). Thiamine is the classic deficiency causing PDH dysfunction in alcoholics.",
  },
  {
    id: 37,
    subject: "Biochemistry",
    stem: "The enzyme deficient in phenylketonuria (PKU) is:",
    options: [
      "Tyrosinase",
      "Phenylalanine hydroxylase",
      "Homogentisate oxidase",
      "Fumarylacetoacetate hydrolase",
    ],
    answer: 1,
    explanation:
      "PKU: deficiency of phenylalanine hydroxylase (or its cofactor BH4) → phenylalanine accumulates → intellectual disability, seizures, musty odour, fair skin.",
  },
  {
    id: 38,
    subject: "Biochemistry",
    stem: "Biotin is a cofactor for which of the following enzymes?",
    options: [
      "Pyruvate dehydrogenase",
      "Pyruvate carboxylase",
      "Alpha-ketoglutarate dehydrogenase",
      "Transketolase",
    ],
    answer: 1,
    explanation:
      "Biotin is the cofactor for carboxylase enzymes: pyruvate carboxylase, acetyl-CoA carboxylase, propionyl-CoA carboxylase, and methylcrotonyl-CoA carboxylase.",
  },
  {
    id: 39,
    subject: "Biochemistry",
    stem: "Which lipoprotein has the highest triglyceride content?",
    options: ["LDL", "HDL", "Chylomicrons", "IDL"],
    answer: 2,
    explanation:
      "Chylomicrons (synthesised in intestinal enterocytes) transport dietary triglycerides from the gut to peripheral tissues and are >85% triglyceride by weight.",
  },
  {
    id: 40,
    subject: "Biochemistry",
    stem: "In McArdle's disease (glycogen storage disease type V), the deficient enzyme is:",
    options: [
      "Glucose-6-phosphatase",
      "Lysosomal alpha-1,4-glucosidase (acid maltase)",
      "Muscle glycogen phosphorylase",
      "Debranching enzyme",
    ],
    answer: 2,
    explanation:
      "McArdle's: muscle glycogen phosphorylase deficiency → inability to mobilise glycogen in muscle → exercise-induced cramps, myoglobinuria, no rise in venous lactate with exercise.",
  },

  // ─── PATHOLOGY (12) ──────────────────────────────────────────────────────
  {
    id: 41,
    subject: "Pathology",
    stem: "Reed-Sternberg cells are characteristic of:",
    options: [
      "Non-Hodgkin lymphoma",
      "Hodgkin's lymphoma",
      "Multiple myeloma",
      "Burkitt's lymphoma",
    ],
    answer: 1,
    explanation:
      "Reed-Sternberg cells — large binucleate/multinucleate cells with 'owl-eye' nucleoli — are pathognomonic of Hodgkin lymphoma, expressing CD15 and CD30.",
  },
  {
    id: 42,
    subject: "Pathology",
    stem: "The most common type of Hodgkin's lymphoma is:",
    options: [
      "Nodular sclerosis",
      "Mixed cellularity",
      "Lymphocyte predominant",
      "Lymphocyte depleted",
    ],
    answer: 0,
    explanation:
      "Nodular sclerosis HL (~70% of cases) is the most common subtype, characterised by collagen bands and lacunar RS cell variants; predominates in young women.",
  },
  {
    id: 43,
    subject: "Pathology",
    stem: "Virchow's triad for thrombosis includes all EXCEPT:",
    options: [
      "Endothelial injury",
      "Stasis of blood flow",
      "Hypercoagulability",
      "Increased fibrinolysis",
    ],
    answer: 3,
    explanation:
      "Virchow's triad: endothelial injury, abnormal blood flow (stasis/turbulence), and hypercoagulability. Increased fibrinolysis is actually protective against thrombosis.",
  },
  {
    id: 44,
    subject: "Pathology",
    stem: "Which type of necrosis is characteristic of tuberculosis?",
    options: [
      "Liquefactive necrosis",
      "Coagulative necrosis",
      "Caseous necrosis",
      "Fat necrosis",
    ],
    answer: 2,
    explanation:
      "Caseous necrosis (cheese-like, amorphous, eosinophilic debris) is the hallmark of TB granulomas; it represents a combination of coagulative and liquefactive necrosis.",
  },
  {
    id: 45,
    subject: "Pathology",
    stem: "The most common tumor marker elevated in hepatocellular carcinoma is:",
    options: [
      "CEA",
      "CA-125",
      "Alpha-fetoprotein (AFP)",
      "CA 19-9",
    ],
    answer: 2,
    explanation:
      "AFP is the primary tumour marker for HCC; levels >400 ng/mL in a patient with cirrhosis are diagnostic. AFP is also elevated in yolk sac (endodermal sinus) tumours.",
  },
  {
    id: 46,
    subject: "Pathology",
    stem: "Lewy bodies (alpha-synuclein inclusions) are seen in:",
    options: [
      "Alzheimer's disease",
      "Parkinson's disease",
      "Huntington's disease",
      "Multiple sclerosis",
    ],
    answer: 1,
    explanation:
      "Lewy bodies are intracytoplasmic eosinophilic inclusions composed of aggregated alpha-synuclein; found in dopaminergic neurons of the substantia nigra in Parkinson's disease.",
  },
  {
    id: 47,
    subject: "Pathology",
    stem: "Which mutation is the most common in colorectal carcinoma?",
    options: ["BRCA1", "APC gene mutation", "RET proto-oncogene", "VHL gene"],
    answer: 1,
    explanation:
      "APC (adenomatous polyposis coli) mutation is the earliest and most common event in sporadic colorectal carcinoma (~80%), initiating the adenoma-to-carcinoma sequence.",
  },
  {
    id: 48,
    subject: "Pathology",
    stem: "Amyloid in Alzheimer's disease is composed of:",
    options: [
      "Tau protein",
      "Beta-2 microglobulin",
      "Amyloid beta (Aβ) peptide",
      "Transthyretin",
    ],
    answer: 2,
    explanation:
      "Senile plaques in AD consist of extracellular Aβ peptide (from APP cleavage by beta- and gamma-secretases). Neurofibrillary tangles contain hyperphosphorylated tau.",
  },
  {
    id: 49,
    subject: "Pathology",
    stem: "The tumor marker CA-125 is most useful for monitoring:",
    options: [
      "Breast carcinoma",
      "Hepatocellular carcinoma",
      "Ovarian serous carcinoma",
      "Prostate carcinoma",
    ],
    answer: 2,
    explanation:
      "CA-125 is elevated in ~80% of advanced ovarian serous carcinomas; it is used primarily for monitoring treatment response and detecting recurrence, not as a screening test.",
  },
  {
    id: 50,
    subject: "Pathology",
    stem: "Mallory-Denk bodies (Mallory's hyaline) are found in:",
    options: [
      "Viral hepatitis",
      "Alcoholic hepatitis",
      "Primary biliary cholangitis",
      "Autoimmune hepatitis",
    ],
    answer: 1,
    explanation:
      "Mallory-Denk bodies — eosinophilic cytoplasmic inclusions of aggregated cytokeratin 8/18 — are characteristic of (but not exclusive to) alcoholic hepatitis.",
  },
  {
    id: 51,
    subject: "Pathology",
    stem: "Philadelphia chromosome t(9;22) results in the fusion gene:",
    options: ["PML-RARA", "BCR-ABL1", "EWS-FLI1", "SYT-SSX"],
    answer: 1,
    explanation:
      "t(9;22) creates the BCR-ABL1 fusion gene encoding a constitutively active tyrosine kinase; found in >95% of CML and ~25% of adult ALL. Targeted by imatinib.",
  },
  {
    id: 52,
    subject: "Pathology",
    stem: "Psammoma bodies are seen in all of the following EXCEPT:",
    options: [
      "Papillary thyroid carcinoma",
      "Serous ovarian carcinoma",
      "Meningioma",
      "Follicular thyroid carcinoma",
    ],
    answer: 3,
    explanation:
      "Psammoma bodies (concentric calcified laminations) are NOT a feature of follicular thyroid carcinoma. They are characteristic of papillary thyroid carcinoma, meningioma, and serous ovarian carcinoma.",
  },

  // ─── ANATOMY (10) ────────────────────────────────────────────────────────
  {
    id: 53,
    subject: "Anatomy",
    stem: "Injury to the radial nerve in the spiral groove of the humerus causes:",
    options: [
      "Wrist drop and loss of finger extension",
      "Claw hand",
      "Ape thumb deformity",
      "Erb's palsy pattern",
    ],
    answer: 0,
    explanation:
      "Radial nerve palsy at the spiral groove causes wrist drop (loss of wrist extensors), finger drop (loss of extensor digitorum), but spares elbow extension and brachioradialis.",
  },
  {
    id: 54,
    subject: "Anatomy",
    stem: "The artery of Adamkiewicz (arteria radicularis magna) most commonly arises from:",
    options: [
      "T1-T4 segmental arteries",
      "T9-L2 segmental arteries (usually left side)",
      "Lumbar arteries L3-L5",
      "Internal iliac artery",
    ],
    answer: 1,
    explanation:
      "The artery of Adamkiewicz is the dominant anterior radicular artery supplying the thoracolumbar spinal cord; arises from a left intercostal/lumbar artery at T9-L2.",
  },
  {
    id: 55,
    subject: "Anatomy",
    stem: "The boundaries of the femoral triangle are:",
    options: [
      "Inguinal ligament (superior), sartorius (medial), adductor longus (lateral)",
      "Inguinal ligament (superior), sartorius (lateral), adductor longus (medial)",
      "Poupart's ligament (inferior), rectus femoris (medial), iliopsoas (lateral)",
      "Inguinal ligament (superior), rectus femoris (lateral), adductor magnus (medial)",
    ],
    answer: 1,
    explanation:
      "Femoral triangle: inguinal ligament (superior), medial border of sartorius (lateral), medial border of adductor longus (medial). Contents (lateral to medial): femoral Nerve, Artery, Vein, Inguinal canal (NAVI).",
  },
  {
    id: 56,
    subject: "Anatomy",
    stem: "The facial nerve (CN VII) exits the skull through:",
    options: [
      "Foramen ovale",
      "Jugular foramen",
      "Stylomastoid foramen",
      "Foramen spinosum",
    ],
    answer: 2,
    explanation:
      "CN VII exits the skull through the stylomastoid foramen. It then passes through the parotid gland before dividing into temporal, zygomatic, buccal, marginal mandibular, and cervical branches.",
  },
  {
    id: 57,
    subject: "Anatomy",
    stem: "The nerve most commonly injured in anterior dislocation of the shoulder is:",
    options: [
      "Radial nerve",
      "Median nerve",
      "Axillary nerve",
      "Musculocutaneous nerve",
    ],
    answer: 2,
    explanation:
      "The axillary nerve (C5,C6) winds around the surgical neck of the humerus and is the most commonly injured nerve in shoulder dislocation and proximal humerus fractures.",
  },
  {
    id: 58,
    subject: "Anatomy",
    stem: "The 'unhappy triad' (O'Donoghue's triad) of the knee involves injury to:",
    options: [
      "ACL, PCL, and medial meniscus",
      "ACL, MCL, and medial meniscus",
      "ACL, LCL, and lateral meniscus",
      "PCL, MCL, and lateral meniscus",
    ],
    answer: 1,
    explanation:
      "The unhappy triad (valgus stress with knee in flexion, common in football): ACL + MCL + medial meniscus tears. The MCL and medial meniscus are interconnected.",
  },
  {
    id: 59,
    subject: "Anatomy",
    stem: "Horner's syndrome consists of all of the following EXCEPT:",
    options: [
      "Ptosis",
      "Miosis",
      "Anhidrosis of ipsilateral face",
      "Exophthalmos",
    ],
    answer: 3,
    explanation:
      "Horner's syndrome (sympathetic chain lesion): ptosis (superior tarsal/Müller's muscle paralysis), miosis, anhidrosis, and enophthalmos — NOT exophthalmos (which is a Graves' sign).",
  },
  {
    id: 60,
    subject: "Anatomy",
    stem: "McBurney's point is located at:",
    options: [
      "Midpoint of inguinal ligament",
      "Junction of medial 2/3 and lateral 1/3 of a line from umbilicus to ASIS",
      "Junction of medial 1/3 and lateral 2/3 of a line from umbilicus to ASIS",
      "2 cm below the umbilicus in the midline",
    ],
    answer: 2,
    explanation:
      "McBurney's point: 1/3 from the anterior superior iliac spine (lateral 1/3) on a line from ASIS to umbilicus. Maximum tenderness at this point is classic for acute appendicitis.",
  },
  {
    id: 61,
    subject: "Anatomy",
    stem: "The phrenic nerve arises from:",
    options: ["C2, C3, C4", "C3, C4, C5", "C4, C5, C6", "C5, C6, C7"],
    answer: 1,
    explanation:
      "Phrenic nerve originates from C3, C4, C5 (C3,4,5 keep the diaphragm alive). It is the sole motor supply to the diaphragm and provides sensory supply to its central tendon.",
  },
  {
    id: 62,
    subject: "Anatomy",
    stem: "The ductus arteriosus connects:",
    options: [
      "Aorta to the pulmonary veins",
      "Pulmonary artery to the descending aorta",
      "Right atrium to the left atrium",
      "Pulmonary artery to the ascending aorta",
    ],
    answer: 1,
    explanation:
      "The ductus arteriosus connects the main pulmonary artery (or left pulmonary artery) to the descending aorta, bypassing the lungs in fetal circulation. Closes at birth with prostaglandin fall.",
  },

  // ─── MICROBIOLOGY (10) ───────────────────────────────────────────────────
  {
    id: 63,
    subject: "Microbiology",
    stem: "The Weil-Felix reaction uses Proteus antigens to diagnose:",
    options: ["Typhoid fever", "Rickettsial infections", "Brucellosis", "Leptospirosis"],
    answer: 1,
    explanation:
      "Weil-Felix test: rickettsiae share cross-reactive antigens with Proteus OX-19, OX-2, and OX-K. It is a non-specific but historically useful agglutination test for rickettsioses.",
  },
  {
    id: 64,
    subject: "Microbiology",
    stem: "The causative organism of gas gangrene is:",
    options: [
      "Clostridium tetani",
      "Clostridium perfringens",
      "Bacteroides fragilis",
      "Clostridium botulinum",
    ],
    answer: 1,
    explanation:
      "C. perfringens (type A) causes gas gangrene (clostridial myonecrosis) via alpha-toxin (lecithinase/phospholipase C), producing gas in tissues and systemic toxicity.",
  },
  {
    id: 65,
    subject: "Microbiology",
    stem: "Hepatitis B virus can replicate to titres as high as 10⁹-10¹¹ copies/mL. Its surface antigen (HBsAg) persists for more than 6 months in which state?",
    options: [
      "Acute resolved infection",
      "Chronic HBV infection (carrier state)",
      "Occult HBV infection",
      "Window period",
    ],
    answer: 1,
    explanation:
      "Persistence of HBsAg for >6 months defines chronic HBV infection (carrier state). Occult HBV has detectable HBV DNA but negative HBsAg. HBsAg clears within 6 months in acute resolved infection.",
  },
  {
    id: 66,
    subject: "Microbiology",
    stem: "The definitive host of Taenia solium is:",
    options: ["Pig", "Cattle", "Human", "Dog"],
    answer: 2,
    explanation:
      "Humans are the definitive (final) host for adult Taenia solium (pork tapeworm). Pigs serve as intermediate hosts harbouring cysticerci. Humans can also be accidental intermediate hosts (cysticercosis).",
  },
  {
    id: 67,
    subject: "Microbiology",
    stem: "The test used to differentiate Staphylococcus aureus from coagulase-negative staphylococci is:",
    options: ["Catalase test", "Oxidase test", "Coagulase test", "Novobiocin sensitivity"],
    answer: 2,
    explanation:
      "Coagulase test (clot formation in rabbit plasma) is the key test: S. aureus is coagulase-positive; S. epidermidis and S. saprophyticus are coagulase-negative.",
  },
  {
    id: 68,
    subject: "Microbiology",
    stem: "VDRL test is a non-specific screening test for syphilis that detects antibodies to:",
    options: [
      "Treponema pallidum outer membrane proteins",
      "Cardiolipin-lecithin-cholesterol antigen",
      "Treponema pallidum haemagglutination antigen",
      "FTA-ABS antigen",
    ],
    answer: 1,
    explanation:
      "VDRL/RPR detect reagin antibodies against cardiolipin (a mitochondrial membrane phospholipid released during tissue destruction); non-treponemal, used for screening and monitoring treatment.",
  },
  {
    id: 69,
    subject: "Microbiology",
    stem: "Negri bodies (eosinophilic intracytoplasmic inclusions) are found in neurons in:",
    options: ["Poliomyelitis", "Herpes encephalitis", "Rabies", "Japanese encephalitis"],
    answer: 2,
    explanation:
      "Negri bodies are pathognomonic of rabies; they are aggregates of viral nucleocapsid protein found in Purkinje cells of the cerebellum and pyramidal cells of the hippocampus.",
  },
  {
    id: 70,
    subject: "Microbiology",
    stem: "MacConkey agar differentiates bacteria based on their ability to:",
    options: [
      "Produce hydrogen sulfide",
      "Ferment lactose",
      "Produce urease",
      "Produce coagulase",
    ],
    answer: 1,
    explanation:
      "MacConkey agar contains lactose and neutral red indicator; lactose fermenters produce acid, turning colonies pink-red. E. coli: pink (lactose +); Salmonella/Shigella: colourless (lactose -).",
  },
  {
    id: 71,
    subject: "Microbiology",
    stem: "Which hepatitis virus is transmitted by the faeco-oral route and causes fulminant hepatitis in pregnancy?",
    options: ["Hepatitis A", "Hepatitis B", "Hepatitis C", "Hepatitis E"],
    answer: 3,
    explanation:
      "Hepatitis E (HEV) is faeco-orally transmitted and causes fulminant hepatic failure with mortality up to 20-25% in pregnant women, especially in the third trimester.",
  },
  {
    id: 72,
    subject: "Microbiology",
    stem: "The vaccine-preventable disease caused by Haemophilus influenzae type b (Hib) is most commonly:",
    options: [
      "Otitis media",
      "Epiglottitis and meningitis in children",
      "Pneumonia in adults",
      "Septic arthritis in elderly",
    ],
    answer: 1,
    explanation:
      "Before Hib vaccination, H. influenzae type b was the leading cause of bacterial meningitis and epiglottitis in children under 5. The Hib vaccine has dramatically reduced incidence.",
  },

  // ─── MEDICINE (15) ───────────────────────────────────────────────────────
  {
    id: 73,
    subject: "Medicine",
    stem: "The classic triad of Wernicke's encephalopathy is:",
    options: [
      "Confusion, peripheral neuropathy, and ataxia",
      "Ophthalmoplegia, ataxia, and confusion",
      "Seizures, ophthalmoplegia, and amnesia",
      "Memory loss, confabulation, and personality change",
    ],
    answer: 1,
    explanation:
      "Wernicke's encephalopathy (thiamine deficiency): triad of ophthalmoplegia (typically lateral gaze palsy/nystagmus), truncal ataxia, and global confusion. Korsakoff psychosis follows if untreated.",
  },
  {
    id: 74,
    subject: "Medicine",
    stem: "The most sensitive indicator of early diabetic nephropathy is:",
    options: [
      "Elevated serum creatinine",
      "Microalbuminuria (30-300 mg/day)",
      "Proteinuria >3.5 g/day",
      "Reduced GFR",
    ],
    answer: 1,
    explanation:
      "Microalbuminuria (albuminuria 30-300 mg/24h or ACR 30-300 mg/g) is the earliest detectable marker of diabetic nephropathy; reversal is possible at this stage with ACE inhibitors.",
  },
  {
    id: 75,
    subject: "Medicine",
    stem: "The Wells score is used to assess the pre-test probability of:",
    options: [
      "Acute MI",
      "Deep vein thrombosis",
      "Pulmonary embolism",
      "Both DVT and PE",
    ],
    answer: 3,
    explanation:
      "The Wells scoring system has validated versions for both DVT and PE probability. It stratifies patients into low, moderate, and high pre-test probability to guide D-dimer testing and imaging.",
  },
  {
    id: 76,
    subject: "Medicine",
    stem: "The best initial test to diagnose Addison's disease (primary adrenal insufficiency) is:",
    options: [
      "Random serum cortisol",
      "ACTH (Synacthen) stimulation test",
      "24-hour urinary free cortisol",
      "Dexamethasone suppression test",
    ],
    answer: 1,
    explanation:
      "The short ACTH (Synacthen) stimulation test is the gold standard for diagnosing primary adrenal insufficiency; serum cortisol <550 nmol/L at 30 min post-stimulation is diagnostic.",
  },
  {
    id: 77,
    subject: "Medicine",
    stem: "Target INR for a patient with a mechanical mitral valve replacement is:",
    options: ["1.5-2.0", "2.0-3.0", "2.5-3.5", "3.0-4.0"],
    answer: 2,
    explanation:
      "Mechanical mitral valves require INR 2.5-3.5 due to higher thromboembolism risk compared to aortic valves. Mechanical aortic valves in low-risk patients may target INR 2.0-3.0.",
  },
  {
    id: 78,
    subject: "Medicine",
    stem: "The most common cause of community-acquired pneumonia in adults is:",
    options: [
      "Haemophilus influenzae",
      "Streptococcus pneumoniae",
      "Mycoplasma pneumoniae",
      "Klebsiella pneumoniae",
    ],
    answer: 1,
    explanation:
      "Streptococcus pneumoniae is the most common cause of CAP across all age groups. Mycoplasma predominates in young adults; Klebsiella is associated with alcoholics.",
  },
  {
    id: 79,
    subject: "Medicine",
    stem: "In hypertensive emergency, the blood pressure should be reduced by no more than what percentage in the first hour?",
    options: ["10%", "25%", "40%", "50%"],
    answer: 1,
    explanation:
      "In hypertensive emergency, MAP should be reduced by no more than 25% in the first hour to avoid precipitating ischaemia. Over 24-48 hours, gradual normalisation is targeted.",
  },
  {
    id: 80,
    subject: "Medicine",
    stem: "Anti-dsDNA antibodies are most specific for:",
    options: [
      "Rheumatoid arthritis",
      "Systemic lupus erythematosus",
      "Sjögren's syndrome",
      "Systemic sclerosis",
    ],
    answer: 1,
    explanation:
      "Anti-double-stranded DNA (anti-dsDNA) antibodies are highly specific (~99%) for SLE and correlate with disease activity, especially lupus nephritis. ANA is sensitive but not specific.",
  },
  {
    id: 81,
    subject: "Medicine",
    stem: "The CURB-65 score is used to assess severity of:",
    options: [
      "COPD exacerbations",
      "Community-acquired pneumonia",
      "Acute pancreatitis",
      "Heart failure",
    ],
    answer: 1,
    explanation:
      "CURB-65 (Confusion, Urea>7, RR≥30, BP<90/60, age≥65) scores 0-5 for CAP severity: score 0-1 → home treatment; score ≥3 → ICU consideration.",
  },
  {
    id: 82,
    subject: "Medicine",
    stem: "The most common cause of nephrotic syndrome in non-diabetic adults is:",
    options: [
      "Minimal change disease",
      "IgA nephropathy",
      "Membranous nephropathy",
      "Focal segmental glomerulosclerosis",
    ],
    answer: 2,
    explanation:
      "Membranous nephropathy is the most common cause of nephrotic syndrome in non-diabetic adults; associated with PLA2R antibodies in the idiopathic form (~70%).",
  },
  {
    id: 83,
    subject: "Medicine",
    stem: "Charcot's triad of ascending cholangitis consists of:",
    options: [
      "Fever, RUQ pain, and jaundice",
      "Fever, jaundice, and altered consciousness",
      "RUQ pain, jaundice, and nausea",
      "Fever, RUQ pain, and hypotension",
    ],
    answer: 0,
    explanation:
      "Charcot's triad: RUQ pain + fever/rigors + jaundice (due to biliary obstruction and infection). Reynolds' pentad adds hypotension and altered consciousness, indicating septic shock.",
  },
  {
    id: 84,
    subject: "Medicine",
    stem: "In type 2 Diabetes Mellitus, which drug is associated with the highest risk of hypoglycaemia?",
    options: ["Metformin", "Sitagliptin", "Glibenclamide", "Empagliflozin"],
    answer: 2,
    explanation:
      "Sulphonylureas (e.g., glibenclamide/glyburide) stimulate insulin secretion regardless of glucose levels, causing hypoglycaemia — particularly with missed meals or renal impairment.",
  },
  {
    id: 85,
    subject: "Medicine",
    stem: "Gottron's papules (violaceous plaques over knuckles) are pathognomonic of:",
    options: [
      "Systemic lupus erythematosus",
      "Dermatomyositis",
      "Psoriatic arthritis",
      "Mixed connective tissue disease",
    ],
    answer: 1,
    explanation:
      "Gottron's papules (over MCP/PIP joints) and Gottron's sign (erythema over elbows/knees) are pathognomonic of dermatomyositis. Heliotrope rash and mechanic's hands are also characteristic.",
  },
  {
    id: 86,
    subject: "Medicine",
    stem: "The initial treatment of choice for acute attack of gout is:",
    options: [
      "Allopurinol",
      "Colchicine or NSAIDs",
      "Probenecid",
      "Febuxostat",
    ],
    answer: 1,
    explanation:
      "Acute gout is treated with anti-inflammatory agents: NSAIDs (indomethacin), colchicine, or corticosteroids. Urate-lowering therapy (allopurinol) is NOT started during an acute attack.",
  },
  {
    id: 87,
    subject: "Medicine",
    stem: "The Glasgow Coma Scale score in a patient who opens eyes to pain, gives incomprehensible sounds, and withdraws to pain is:",
    options: ["7", "8", "9", "10"],
    answer: 1,
    explanation:
      "GCS: Eye opening to pain = 2; Verbal incomprehensible sounds = 2; Motor withdrawal from pain = 4. Total = 2 + 2 + 4 = 8 (intubation threshold).",
  },

  // ─── SURGERY (10) ────────────────────────────────────────────────────────
  {
    id: 88,
    subject: "Surgery",
    stem: "The most common site of peptic ulcer perforation is:",
    options: [
      "Posterior wall of the duodenum",
      "Anterior wall of the first part of duodenum",
      "Lesser curvature of the stomach",
      "Greater curvature of the stomach",
    ],
    answer: 1,
    explanation:
      "Duodenal ulcer perforation typically occurs on the anterior wall of D1, spilling acid into the peritoneal cavity (peritonitis). Posterior wall ulcers more commonly erode into the gastroduodenal artery (haemorrhage).",
  },
  {
    id: 89,
    subject: "Surgery",
    stem: "Cullen's sign (periumbilical bruising) is seen in:",
    options: [
      "Acute appendicitis",
      "Ruptured aortic aneurysm",
      "Acute pancreatitis with retroperitoneal haemorrhage",
      "Ruptured ectopic pregnancy",
    ],
    answer: 2,
    explanation:
      "Cullen's sign (periumbilical bruising) and Grey Turner's sign (flank bruising) indicate retroperitoneal haemorrhage, classically seen in severe acute haemorrhagic pancreatitis.",
  },
  {
    id: 90,
    subject: "Surgery",
    stem: "The most common type of abdominal aortic aneurysm is:",
    options: [
      "Suprarenal",
      "Juxtarenal",
      "Infrarenal",
      "Thoracoabdominal",
    ],
    answer: 2,
    explanation:
      "~95% of AAAs are infrarenal (below the renal arteries), developing at an area of relative haemodynamic stress and reduced vasa vasorum. Elective repair is considered when diameter >5.5 cm.",
  },
  {
    id: 91,
    subject: "Surgery",
    stem: "The gold standard investigation for diagnosis of acute appendicitis in adults is:",
    options: [
      "Plain X-ray of abdomen",
      "Ultrasound abdomen",
      "CT scan of abdomen and pelvis with contrast",
      "MRI abdomen",
    ],
    answer: 2,
    explanation:
      "CT abdomen/pelvis (with IV contrast) has sensitivity ~94% and specificity ~95% for acute appendicitis and is the gold standard in adults. Ultrasound is preferred in children and pregnant women.",
  },
  {
    id: 92,
    subject: "Surgery",
    stem: "Courvoisier's law states that a palpable, non-tender gallbladder with jaundice is most likely due to:",
    options: [
      "Acute cholecystitis",
      "Gallstone obstruction of common bile duct",
      "Carcinoma of the head of the pancreas",
      "Primary sclerosing cholangitis",
    ],
    answer: 2,
    explanation:
      "Courvoisier's sign: painless obstructive jaundice + palpable gallbladder suggests malignant (not stone) obstruction, most commonly carcinoma of the pancreatic head, as a chronically inflamed gallbladder cannot distend.",
  },
  {
    id: 93,
    subject: "Surgery",
    stem: "In Fournier's gangrene, the tissue affected is:",
    options: [
      "Fascia of the anterior abdominal wall",
      "Perineal and scrotal fasciae",
      "Retroperitoneal fascia",
      "Fasciae of the lower limb",
    ],
    answer: 1,
    explanation:
      "Fournier's gangrene is a necrotising fasciitis of the perineum and genitalia (scrotum/vulva), caused by synergistic polymicrobial infection. It is a surgical emergency requiring urgent debridement.",
  },
  {
    id: 94,
    subject: "Surgery",
    stem: "The modified Duke criteria are used to diagnose:",
    options: [
      "Acute pancreatitis severity",
      "Infective endocarditis",
      "Septic shock",
      "Acute limb ischaemia",
    ],
    answer: 1,
    explanation:
      "Modified Duke criteria classify IE as definite, possible, or rejected based on major (positive blood cultures, echocardiographic findings) and minor criteria.",
  },
  {
    id: 95,
    subject: "Surgery",
    stem: "Hartmann's procedure involves:",
    options: [
      "Resection of the sigmoid colon with primary anastomosis",
      "Resection of the sigmoid colon with end colostomy and closure of the rectal stump",
      "Abdominoperineal resection with permanent colostomy",
      "Right hemicolectomy with ileotransverse anastomosis",
    ],
    answer: 1,
    explanation:
      "Hartmann's procedure: sigmoid/upper rectal resection + end sigmoid colostomy + closure of the rectal stump (no anastomosis). Used for emergencies (perforated diverticulitis, obstructing cancer) when primary anastomosis is unsafe.",
  },
  {
    id: 96,
    subject: "Surgery",
    stem: "Ranson's criteria are used to assess severity of:",
    options: [
      "Acute cholecystitis",
      "Acute pancreatitis",
      "Peptic ulcer disease",
      "Mesenteric ischaemia",
    ],
    answer: 1,
    explanation:
      "Ranson's criteria (5 on admission + 6 at 48 h) predict acute pancreatitis severity and mortality. Score ≥3 indicates severe pancreatitis; each additional criterion increases mortality significantly.",
  },
  {
    id: 97,
    subject: "Surgery",
    stem: "Mirizzi syndrome is caused by:",
    options: [
      "Gallstone impacted in the cystic duct compressing the common hepatic duct",
      "Choledocholithiasis causing common bile duct obstruction",
      "Stricture of the common bile duct following cholecystectomy",
      "Carcinoma of the cystic duct",
    ],
    answer: 0,
    explanation:
      "Mirizzi syndrome: a large stone impacted in the cystic duct or Hartmann's pouch externally compresses the common hepatic duct, causing obstructive jaundice without a stone in the CBD.",
  },

  // ─── OBG (10) ────────────────────────────────────────────────────────────
  {
    id: 98,
    subject: "OBG",
    stem: "The most common cause of postpartum haemorrhage is:",
    options: [
      "Retained placenta",
      "Uterine atony",
      "Cervical lacerations",
      "Coagulation disorders",
    ],
    answer: 1,
    explanation:
      "Uterine atony accounts for ~80% of PPH cases. The '4 Ts' mnemonic: Tone (atony), Tissue (retained), Trauma (lacerations), Thrombin (coagulopathy). Oxytocin is first-line management.",
  },
  {
    id: 99,
    subject: "OBG",
    stem: "The BISHOP score is used for:",
    options: [
      "Assessing fetal wellbeing",
      "Predicting successful induction of labour",
      "Diagnosing placenta praevia",
      "Grading perineal tears",
    ],
    answer: 1,
    explanation:
      "Bishop score assesses cervical favourability (dilation, effacement, consistency, position, fetal station) to predict success of induction of labour. Score ≥8 is favourable.",
  },
  {
    id: 100,
    subject: "OBG",
    stem: "The antihypertensive drug of choice for acute severe hypertension during pregnancy is:",
    options: [
      "Amlodipine",
      "ACE inhibitor",
      "Hydralazine or Labetalol IV",
      "Sodium nitroprusside",
    ],
    answer: 2,
    explanation:
      "Hydralazine IV and labetalol IV are first-line for acute severe hypertension in pregnancy. ACE inhibitors and ARBs are contraindicated (teratogenic). Sodium nitroprusside can cause fetal cyanide toxicity.",
  },
  {
    id: 101,
    subject: "OBG",
    stem: "The gold standard for diagnosis of endometriosis is:",
    options: [
      "Transvaginal ultrasound",
      "MRI pelvis",
      "Serum CA-125",
      "Laparoscopy with biopsy",
    ],
    answer: 3,
    explanation:
      "Laparoscopy with direct visualisation and histological biopsy is the gold standard for diagnosing endometriosis, allowing simultaneous treatment (ablation/excision of lesions).",
  },
  {
    id: 102,
    subject: "OBG",
    stem: "The most common site of ectopic pregnancy is:",
    options: [
      "Interstitial (cornual) part of fallopian tube",
      "Isthmus of fallopian tube",
      "Ampulla of fallopian tube",
      "Ovary",
    ],
    answer: 2,
    explanation:
      "~70% of ectopic pregnancies implant in the ampullary portion of the fallopian tube. Cornual (interstitial) ectopics are rarer but more dangerous due to higher vascularity and later rupture.",
  },
  {
    id: 103,
    subject: "OBG",
    stem: "HELLP syndrome stands for:",
    options: [
      "Haemolysis, Elevated Liver enzymes, Low Platelets",
      "Hypertension, Elevated Liver enzymes, Low Protein",
      "Haemolysis, Elevated LDH, Low Potassium",
      "Hypertension, Elevated Liver function, Low Progesterone",
    ],
    answer: 0,
    explanation:
      "HELLP (Haemolysis, Elevated Liver enzymes, Low Platelets) is a severe form of pre-eclampsia; presents with RUQ pain, nausea, and thrombocytopenia. Delivery is definitive treatment.",
  },
  {
    id: 104,
    subject: "OBG",
    stem: "Sheehan's syndrome results from:",
    options: [
      "Autoimmune destruction of the pituitary",
      "Pituitary infarction following postpartum haemorrhage",
      "Granulomatous infiltration of the hypothalamus",
      "Pituitary adenoma during pregnancy",
    ],
    answer: 1,
    explanation:
      "Sheehan's syndrome: pituitary ischaemia/infarction following severe postpartum haemorrhage and hypotension → hypopituitarism. Failure to lactate and amenorrhoea are early features.",
  },
  {
    id: 105,
    subject: "OBG",
    stem: "The DOC for medical management of unruptured ectopic pregnancy is:",
    options: ["Mifepristone", "Misoprostol", "Methotrexate", "Actinomycin D"],
    answer: 2,
    explanation:
      "Methotrexate (folate antagonist) is the DOC for unruptured ectopic pregnancy when criteria are met (haemodynamically stable, β-hCG <5000 mIU/mL, no fetal cardiac activity, tube <3.5 cm).",
  },
  {
    id: 106,
    subject: "OBG",
    stem: "Which investigation is most useful to differentiate complete from incomplete abortion?",
    options: [
      "Serum beta-hCG titres",
      "Transvaginal ultrasound",
      "Urine pregnancy test",
      "Serum progesterone",
    ],
    answer: 1,
    explanation:
      "Transvaginal ultrasound identifies retained products of conception (RPOC) — endometrial thickness >15 mm with heterogeneous contents — distinguishing incomplete from complete abortion.",
  },
  {
    id: 107,
    subject: "OBG",
    stem: "Cardinal movements of labour in the correct sequence are:",
    options: [
      "Engagement → Descent → Flexion → Internal rotation → Extension → External rotation → Expulsion",
      "Engagement → Flexion → Descent → Internal rotation → Extension → External rotation → Expulsion",
      "Descent → Engagement → Flexion → Internal rotation → Extension → External rotation → Expulsion",
      "Engagement → Descent → Internal rotation → Flexion → Extension → External rotation → Expulsion",
    ],
    answer: 0,
    explanation:
      "The 7 cardinal movements: Engagement, Descent, Flexion, Internal rotation (to OA position), Extension (delivery of head), External rotation (restitution), Expulsion (delivery of shoulders and body).",
  },

  // ─── PAEDIATRICS (8) ─────────────────────────────────────────────────────
  {
    id: 108,
    subject: "Paediatrics",
    stem: "The most common cause of neonatal jaundice in the first 24 hours of life is:",
    options: [
      "Physiological jaundice",
      "Breast milk jaundice",
      "Haemolytic disease of the newborn (Rh incompatibility)",
      "Biliary atresia",
    ],
    answer: 2,
    explanation:
      "Jaundice within 24 hours of birth is always pathological; the most common cause is haemolytic disease of the newborn (Rh or ABO incompatibility). Physiological jaundice appears on day 2-3.",
  },
  {
    id: 109,
    subject: "Paediatrics",
    stem: "The Apgar score is recorded at:",
    options: [
      "1 and 3 minutes",
      "1 and 5 minutes",
      "2 and 5 minutes",
      "5 and 10 minutes",
    ],
    answer: 1,
    explanation:
      "Apgar score (Appearance, Pulse, Grimace, Activity, Respiration) is assessed at 1 minute and 5 minutes of life. If the 5-minute score is <7, it is repeated every 5 minutes up to 20 minutes.",
  },
  {
    id: 110,
    subject: "Paediatrics",
    stem: "The most common cause of acute diarrhoea in children under 5 years worldwide is:",
    options: [
      "Enterotoxigenic E. coli",
      "Shigella",
      "Rotavirus",
      "Campylobacter jejuni",
    ],
    answer: 2,
    explanation:
      "Rotavirus is the leading cause of acute severe diarrhoea in children <5 years globally, causing ~200,000 deaths annually before widespread vaccination.",
  },
  {
    id: 111,
    subject: "Paediatrics",
    stem: "A 2-year-old presents with stridor, barking cough, and hoarseness worsening at night. AP neck X-ray shows a 'steeple sign'. The most likely diagnosis is:",
    options: [
      "Acute epiglottitis",
      "Croup (laryngotracheobronchitis)",
      "Foreign body aspiration",
      "Bacterial tracheitis",
    ],
    answer: 1,
    explanation:
      "Croup (viral LTB, usually parainfluenza virus) causes the steeple/pencil sign on AP neck X-ray due to subglottic narrowing. Treatment: nebulised adrenaline + dexamethasone.",
  },
  {
    id: 112,
    subject: "Paediatrics",
    stem: "The DOC for Kawasaki disease to prevent coronary artery aneurysms is:",
    options: [
      "Aspirin alone",
      "IVIG + high-dose aspirin",
      "Corticosteroids + aspirin",
      "Infliximab + aspirin",
    ],
    answer: 1,
    explanation:
      "Kawasaki disease: intravenous immunoglobulin (2 g/kg single dose) + high-dose aspirin during the acute febrile phase reduces the risk of coronary artery aneurysms from ~25% to <5%.",
  },
  {
    id: 113,
    subject: "Paediatrics",
    stem: "Intussusception in infants classically presents with:",
    options: [
      "Watery diarrhoea and fever",
      "Bilious vomiting, bloody 'redcurrant jelly' stools, and colicky abdominal pain",
      "Constipation from birth and distended abdomen",
      "Explosive watery stools and periumbilical pain",
    ],
    answer: 1,
    explanation:
      "Intussusception (peak 6-18 months) classic triad: colicky abdominal pain, bilious vomiting, and redcurrant jelly stools (blood + mucus). Sausage-shaped RUQ mass may be palpable.",
  },
  {
    id: 114,
    subject: "Paediatrics",
    stem: "Which congenital heart defect is NOT associated with cyanosis (acyanotic)?",
    options: [
      "Tetralogy of Fallot",
      "Transposition of great arteries",
      "Ventricular septal defect",
      "Tricuspid atresia",
    ],
    answer: 2,
    explanation:
      "VSD causes a left-to-right shunt (acyanotic); it only causes cyanosis if pulmonary hypertension reverses the shunt (Eisenmenger syndrome). ToF, TGA, and tricuspid atresia are cyanotic defects.",
  },
  {
    id: 115,
    subject: "Paediatrics",
    stem: "The primary doses of OPV in India's Universal Immunisation Programme are given at:",
    options: [
      "2, 4, and 6 months",
      "6 weeks, 10 weeks, and 14 weeks",
      "Birth, 6 weeks, and 6 months",
      "2, 4, and 12 months",
    ],
    answer: 1,
    explanation:
      "India's UIP schedule for OPV: primary doses at 6, 10, and 14 weeks (along with DPT) plus a zero dose at birth. Pulse polio campaigns supplement routine immunisation.",
  },

  // ─── ENT/OPHTHALMOLOGY (5) ───────────────────────────────────────────────
  {
    id: 116,
    subject: "ENT/Ophthalmology",
    stem: "The most common cause of conductive hearing loss in children is:",
    options: [
      "Otosclerosis",
      "Chronic suppurative otitis media",
      "Otitis media with effusion (glue ear)",
      "Wax impaction",
    ],
    answer: 2,
    explanation:
      "Otitis media with effusion (glue ear) is the most common cause of conductive hearing loss in children; persistent middle ear fluid dampens ossicular chain vibration.",
  },
  {
    id: 117,
    subject: "ENT/Ophthalmology",
    stem: "Rinne's test result in sensorineural hearing loss is:",
    options: [
      "Rinne negative (BC > AC)",
      "Rinne positive (AC > BC)",
      "Equal air and bone conduction",
      "Rinne negative only for high frequencies",
    ],
    answer: 1,
    explanation:
      "Rinne positive (AC > BC): seen in both normal hearing AND sensorineural hearing loss (cochlear/neural damage reduces both but AC remains better). Rinne negative (BC > AC) indicates conductive hearing loss.",
  },
  {
    id: 118,
    subject: "ENT/Ophthalmology",
    stem: "Hutchinson's pupil (dilated, fixed, unreactive) on one side following head injury indicates:",
    options: [
      "Pontine haemorrhage",
      "Uncal herniation compressing ipsilateral CN III",
      "Traumatic mydriasis of the opposite eye",
      "Direct optic nerve injury",
    ],
    answer: 1,
    explanation:
      "Uncal (temporal lobe) herniation compresses CN III against the posterior communicating artery or tentorium → loss of parasympathetic constriction → ipsilateral fixed dilated pupil (Hutchinson's pupil).",
  },
  {
    id: 119,
    subject: "ENT/Ophthalmology",
    stem: "The most common cause of sudden painless loss of vision in an elderly patient with atrial fibrillation is:",
    options: [
      "Acute angle-closure glaucoma",
      "Retinal detachment",
      "Central retinal artery occlusion",
      "Vitreous haemorrhage",
    ],
    answer: 2,
    explanation:
      "CRAO in a patient with AF suggests cardioembolic cause (atrial thrombus). Fundoscopy shows cherry-red spot at fovea with pale retina. Emergency: lower IOP, ocular massage, paracentesis.",
  },
  {
    id: 120,
    subject: "ENT/Ophthalmology",
    stem: "The triad of hereditary haemorrhagic telangiectasia (Osler-Weber-Rendu disease) includes:",
    options: [
      "Epistaxis, telangiectasias, and visceral AVMs",
      "Epistaxis, deafness, and retinal hamartomas",
      "Anaemia, splenomegaly, and epistaxis",
      "Haemoptysis, haematuria, and epistaxis",
    ],
    answer: 0,
    explanation:
      "HHT (Osler-Weber-Rendu): autosomal dominant disorder with recurrent epistaxis, mucocutaneous telangiectasias, and visceral AVMs (pulmonary, hepatic, cerebral). ENG/ALK1 gene mutations.",
  },

  // ─── PSM / COMMUNITY MEDICINE (5) ───────────────────────────────────────
  {
    id: 121,
    subject: "PSM/Community Medicine",
    stem: "The 'epidemiological triad' consists of:",
    options: [
      "Host, Agent, and Vector",
      "Host, Agent, and Environment",
      "Incidence, Prevalence, and Mortality",
      "Primary, Secondary, and Tertiary prevention",
    ],
    answer: 1,
    explanation:
      "The epidemiological triad (Gordian knot of disease causation): Host (susceptibility), Agent (biological/chemical/physical), and Environment (physical/biological/social). Disease occurs when they intersect unfavourably.",
  },
  {
    id: 122,
    subject: "PSM/Community Medicine",
    stem: "The herd immunity threshold for measles (R₀ ~15) requires approximately what proportion of the population to be immune?",
    options: ["50%", "75%", "93%", "99%"],
    answer: 2,
    explanation:
      "Herd immunity threshold = 1 – (1/R₀). For measles R₀ = 12-18, the threshold is ~92-95%. This is why >93% coverage is required to prevent measles outbreaks.",
  },
  {
    id: 123,
    subject: "PSM/Community Medicine",
    stem: "The Expanded Programme on Immunisation (EPI) was launched by WHO in:",
    options: ["1964", "1974", "1984", "1994"],
    answer: 1,
    explanation:
      "WHO launched EPI in 1974, building on the success of the smallpox eradication programme. India launched its EPI in 1978, later expanded to the Universal Immunisation Programme (UIP) in 1985.",
  },
  {
    id: 124,
    subject: "PSM/Community Medicine",
    stem: "Sensitivity of a diagnostic test is defined as:",
    options: [
      "True negatives / (True negatives + False positives)",
      "True positives / (True positives + False negatives)",
      "True positives / (True positives + False positives)",
      "True negatives / (True negatives + False negatives)",
    ],
    answer: 1,
    explanation:
      "Sensitivity = TP / (TP + FN) — ability to correctly identify those WITH the disease (true positive rate). Specificity = TN / (TN + FP) — ability to correctly identify those WITHOUT disease.",
  },
  {
    id: 125,
    subject: "PSM/Community Medicine",
    stem: "The Global Burden of Disease measure that combines years of life lost (YLL) and years lived with disability (YLD) is:",
    options: ["QALY", "DALY", "NNT", "PAR%"],
    answer: 1,
    explanation:
      "DALY (Disability-Adjusted Life Year) = YLL + YLD. One DALY = one year of healthy life lost. It is the standard metric used by WHO/World Bank for global disease burden comparisons.",
  },

  // ─── PHARMACOLOGY EXTENDED (127–140) ─────────────────────────────────────
  {
    id: 127,
    subject: "Pharmacology",
    stem: "Drug of choice for status epilepticus (first-line) in the emergency setting is:",
    options: ["Phenytoin IV", "Lorazepam IV", "Valproate IV", "Phenobarbitone IV"],
    answer: 1,
    explanation:
      "Lorazepam IV (0.1 mg/kg) is first-line for status epilepticus — longer duration of CNS action than diazepam. If IV access is unavailable, midazolam IM or diazepam PR. Phenytoin IV is second-line.",
  },
  {
    id: 128,
    subject: "Pharmacology",
    stem: "Which drug is the drug of choice for organophosphate poisoning?",
    options: ["Pralidoxime alone", "Atropine alone", "Atropine + Pralidoxime", "Physostigmine"],
    answer: 2,
    explanation:
      "Atropine blocks muscarinic effects (SLUDGE); pralidoxime (PAM) reactivates acetylcholinesterase if given within 24 hours (before 'ageing'). Both are required. Atropine is titrated to dry secretions.",
  },
  {
    id: 129,
    subject: "Pharmacology",
    stem: "Absolute contraindication to metformin use is:",
    options: ["Obesity", "eGFR < 30 mL/min/1.73m²", "Age > 65 years", "Hepatic steatosis"],
    answer: 1,
    explanation:
      "Metformin is contraindicated when eGFR < 30 (risk of lactic acidosis). It can be used cautiously if eGFR 30–45 with dose reduction. Contraindicated also in IV contrast procedures and surgery.",
  },
  {
    id: 130,
    subject: "Pharmacology",
    stem: "The mechanism of action of heparin is:",
    options: [
      "Direct thrombin inhibitor",
      "Inhibits vitamin K-dependent clotting factors",
      "Potentiates antithrombin III to inhibit thrombin and factor Xa",
      "Inhibits platelet aggregation",
    ],
    answer: 2,
    explanation:
      "Heparin binds antithrombin III (AT-III) → conformational change → accelerates AT-III inhibition of thrombin (factor IIa) and factor Xa by ~1000-fold. Low molecular weight heparins primarily inhibit Xa.",
  },
  {
    id: 131,
    subject: "Pharmacology",
    stem: "Which antifungal works by inhibiting beta-1,3-glucan synthase?",
    options: ["Fluconazole", "Amphotericin B", "Caspofungin", "Terbinafine"],
    answer: 2,
    explanation:
      "Echinocandins (caspofungin, micafungin, anidulafungin) inhibit beta-1,3-glucan synthase → disrupts fungal cell wall synthesis. Active against Candida and Aspergillus. Not active against Cryptococcus.",
  },
  {
    id: 132,
    subject: "Pharmacology",
    stem: "Serotonin syndrome is caused by which combination?",
    options: [
      "SSRI + MAO-A inhibitor",
      "Dopamine agonist + antipsychotic",
      "Beta blocker + calcium channel blocker",
      "ACE inhibitor + ARB",
    ],
    answer: 0,
    explanation:
      "Serotonin syndrome = excess serotonergic activity. Classic triad: hyperthermia + neuromuscular abnormality + autonomic instability. Caused by SSRI+MAOI, SSRI+tramadol, SSRI+linezolid, SSRI+fentanyl, etc.",
  },
  {
    id: 133,
    subject: "Pharmacology",
    stem: "The drug of choice for Pseudomonas aeruginosa infections is:",
    options: ["Amoxicillin-clavulanate", "Piperacillin-tazobactam", "Amoxicillin", "Cefazolin"],
    answer: 1,
    explanation:
      "Piperacillin-tazobactam (pip-tazo) has excellent anti-pseudomonal activity. Alternatives include cefepime, meropenem, imipenem, ciprofloxacin, or aztreonam. Pseudomonas is intrinsically resistant to many penicillins.",
  },
  {
    id: 134,
    subject: "Pharmacology",
    stem: "Neuroleptic malignant syndrome (NMS) is most commonly caused by:",
    options: ["Benzodiazepines", "Antipsychotics (D2 antagonists)", "SSRIs", "Opioids"],
    answer: 1,
    explanation:
      "NMS: hyperthermia + lead-pipe rigidity + altered consciousness + autonomic instability + elevated CK. Caused by D2 receptor blockade (typical > atypical antipsychotics, also metoclopramide). Treat with dantrolene + bromocriptine.",
  },
  {
    id: 135,
    subject: "Pharmacology",
    stem: "Which drug is an irreversible COX inhibitor?",
    options: ["Ibuprofen", "Diclofenac", "Aspirin", "Celecoxib"],
    answer: 2,
    explanation:
      "Aspirin irreversibly acetylates COX-1 and COX-2. This permanently inhibits platelet thromboxane A2 synthesis for the platelet's lifetime (~10 days). All other NSAIDs are reversible, competitive inhibitors.",
  },
  {
    id: 136,
    subject: "Pharmacology",
    stem: "Drug of choice for Helicobacter pylori eradication (first-line triple therapy) in India is:",
    options: [
      "Amoxicillin + clarithromycin + omeprazole",
      "Tetracycline + metronidazole + bismuth",
      "Metronidazole + tinidazole + rabeprazole",
      "Cefixime + azithromycin + pantoprazole",
    ],
    answer: 0,
    explanation:
      "Standard triple therapy: PPI + amoxicillin + clarithromycin × 14 days. Quadruple therapy (PPI + bismuth + metronidazole + tetracycline) is used where clarithromycin resistance >15%. India uses clarithromycin-based first.",
  },
  {
    id: 137,
    subject: "Pharmacology",
    stem: "Which diuretic is the drug of choice for acute pulmonary edema?",
    options: ["Hydrochlorothiazide", "Spironolactone", "Furosemide", "Acetazolamide"],
    answer: 2,
    explanation:
      "Furosemide IV in acute pulmonary oedema: immediate venodilation (within minutes, before diuresis begins), then diuresis. Loop diuretics also reduce preload acutely. Dose: 40–80 mg IV stat.",
  },
  {
    id: 138,
    subject: "Pharmacology",
    stem: "The antidote for paracetamol (acetaminophen) overdose is:",
    options: ["Flumazenil", "Naloxone", "N-acetylcysteine", "Fomepizole"],
    answer: 2,
    explanation:
      "N-acetylcysteine (NAC) replenishes glutathione stores → prevents NAPQI accumulation → prevents hepatotoxicity. Most effective within 8–10 hours of ingestion. IV protocol: 3-bag regimen over 21 hours.",
  },
  {
    id: 139,
    subject: "Pharmacology",
    stem: "Which drug prolongs QT interval and is associated with Torsades de Pointes?",
    options: ["Lidocaine", "Metoprolol", "Amiodarone", "Verapamil"],
    answer: 2,
    explanation:
      "Amiodarone (class III) blocks K⁺ channels → prolongs QT. Despite this, Torsades is paradoxically rare with amiodarone (< other class III drugs like sotalol, dofetilide) because it also blocks ICa and INa.",
  },
  {
    id: 140,
    subject: "Pharmacology",
    stem: "Trastuzumab (Herceptin) targets which receptor?",
    options: ["EGFR (HER1)", "HER2/neu (ErbB2)", "VEGFR", "BCR-ABL"],
    answer: 1,
    explanation:
      "Trastuzumab is a monoclonal antibody against HER2/neu (ErbB2). Used in HER2-positive breast and gastric cancers. Cardiotoxicity (cardiomyopathy) is a key side effect — differs from anthracycline toxicity (irreversible vs reversible).",
  },

  // ─── MEDICINE EXTENDED (141–155) ─────────────────────────────────────────
  {
    id: 141,
    subject: "Medicine",
    stem: "The most common cause of community-acquired pneumonia (CAP) in adults is:",
    options: ["Haemophilus influenzae", "Streptococcus pneumoniae", "Mycoplasma pneumoniae", "Klebsiella pneumoniae"],
    answer: 1,
    explanation:
      "Streptococcus pneumoniae is the commonest cause of CAP in all age groups. Mycoplasma ('atypical') is commonest in young adults. Klebsiella is associated with alcoholics and diabetics ('currant-jelly sputum').",
  },
  {
    id: 142,
    subject: "Medicine",
    stem: "CURB-65 score of ≥3 in community-acquired pneumonia indicates:",
    options: ["Home treatment", "Outpatient antibiotics only", "Hospital admission", "ICU admission mandatory"],
    answer: 2,
    explanation:
      "CURB-65: Confusion, Urea >7mmol/L, RR ≥30, BP systolic <90 or diastolic ≤60, Age ≥65. Score 0–1: home, 2: hospitalise, ≥3: hospital (consider ICU if 4–5). CURB-65 ≥3 = severe CAP.",
  },
  {
    id: 143,
    subject: "Medicine",
    stem: "Which autoantibody is most specific for Systemic Lupus Erythematosus (SLE)?",
    options: ["Anti-dsDNA", "ANA", "Anti-Ro (SSA)", "Anti-CCP"],
    answer: 0,
    explanation:
      "Anti-dsDNA and anti-Sm are most specific for SLE. ANA is sensitive (~99%) but not specific. Anti-Ro/La seen in Sjögren's and neonatal lupus. Anti-CCP is specific for rheumatoid arthritis.",
  },
  {
    id: 144,
    subject: "Medicine",
    stem: "The classical triad of Wernicke's encephalopathy is:",
    options: [
      "Confusion + ataxia + ophthalmoplegia",
      "Fever + neck stiffness + photophobia",
      "Tremor + rigidity + bradykinesia",
      "Diplopia + dysphagia + dysarthria",
    ],
    answer: 0,
    explanation:
      "Wernicke's encephalopathy (thiamine deficiency): confusion + ataxia + ophthalmoplegia (lateral gaze palsy/nystagmus). Treat with IV thiamine BEFORE glucose. Korsakoff's psychosis (confabulation) follows if untreated.",
  },
  {
    id: 145,
    subject: "Medicine",
    stem: "Gold standard investigation for diagnosis of pulmonary embolism is:",
    options: ["D-dimer", "CT pulmonary angiography (CTPA)", "V/Q scan", "Pulmonary angiography"],
    answer: 1,
    explanation:
      "CTPA is the current gold standard — high sensitivity/specificity, widely available. Classic pulmonary angiography (invasive) was the old gold standard. V/Q scan used if CTPA contraindicated (CKD, contrast allergy, pregnancy).",
  },
  {
    id: 146,
    subject: "Medicine",
    stem: "Child-Pugh class C cirrhosis indicates a 1-year survival of approximately:",
    options: ["90%", "80%", "45%", "25%"],
    answer: 2,
    explanation:
      "Child-Pugh scoring: Class A (5–6) = 100% 1-yr survival, Class B (7–9) = 80%, Class C (10–15) = 45%. MELD score (creatinine, bilirubin, INR) is now preferred for transplant listing (more objective).",
  },
  {
    id: 147,
    subject: "Medicine",
    stem: "First-line treatment for giant cell arteritis (temporal arteritis) to prevent blindness is:",
    options: ["NSAIDs", "Methotrexate", "High-dose prednisolone", "Hydroxychloroquine"],
    answer: 2,
    explanation:
      "High-dose corticosteroids (prednisolone 40–60 mg/day) must be started immediately on clinical suspicion — BEFORE biopsy results — to prevent irreversible blindness. Temporal artery biopsy confirms diagnosis.",
  },
  {
    id: 148,
    subject: "Medicine",
    stem: "The hallmark ECG finding of hyperkalaemia is:",
    options: ["Prolonged PR interval", "Peaked T waves", "Delta waves", "Osborn (J) waves"],
    answer: 1,
    explanation:
      "Progressive ECG changes in hyperkalaemia: peaked T waves (earliest) → PR prolongation → wide QRS → sine wave pattern → VF. Osborn waves = hypothermia. Delta waves = WPW. Treat K⁺ >6.5 or any ECG change urgently.",
  },
  {
    id: 149,
    subject: "Medicine",
    stem: "Diabetes insipidus (central) is treated with:",
    options: ["Furosemide", "Desmopressin (DDAVP)", "Vasopressin IV only", "Hydrochlorothiazide"],
    answer: 1,
    explanation:
      "Central DI (ADH deficiency) → desmopressin (synthetic ADH analogue, intranasal or oral). Nephrogenic DI (ADH resistance) → low-sodium diet + hydrochlorothiazide + NSAIDs. Lithium-induced = nephrogenic DI.",
  },
  {
    id: 150,
    subject: "Medicine",
    stem: "Anti-GBM (anti-glomerular basement membrane) disease (Goodpasture syndrome) characteristically presents with:",
    options: [
      "Proteinuria + haematuria alone",
      "Pulmonary haemorrhage + rapidly progressive glomerulonephritis",
      "Nephrotic syndrome + oedema",
      "Haematuria + deafness",
    ],
    answer: 1,
    explanation:
      "Goodpasture syndrome: anti-GBM antibodies → pulmonary haemorrhage + RPGN. IF shows linear IgG deposits along GBM (pathognomonic). Anti-GBM + ANCA double-positive has worse prognosis. Treat with plasma exchange + immunosuppression.",
  },
  {
    id: 151,
    subject: "Medicine",
    stem: "The most common type of renal calculus in India is:",
    options: ["Uric acid stones", "Calcium oxalate stones", "Struvite (triple phosphate) stones", "Cystine stones"],
    answer: 1,
    explanation:
      "Calcium oxalate stones are the most common (80%) worldwide and in India. Risk factors: hypercalciuria, hyperoxaluria, hypocitraturia. Uric acid stones: radiolucent on X-ray, seen in gout/hyperuricosuria. Struvite: 'staghorn', associated with urease-producing bacteria.",
  },
  {
    id: 152,
    subject: "Medicine",
    stem: "Which clinical feature best distinguishes Type 1 DM from Type 2 DM at presentation?",
    options: [
      "Age > 40 years",
      "Obesity",
      "Diabetic ketoacidosis at onset",
      "Family history of diabetes",
    ],
    answer: 2,
    explanation:
      "DKA at presentation is the hallmark of Type 1 DM (absolute insulin deficiency → lipolysis → ketogenesis). Type 2 DM presents with HHS (hyperosmolar hyperglycaemic state) or is found incidentally. C-peptide and antibodies (anti-GAD, anti-IA2) confirm Type 1.",
  },
  {
    id: 153,
    subject: "Medicine",
    stem: "Erythema nodosum is most commonly associated with which condition in India?",
    options: ["Crohn's disease", "Sarcoidosis", "Tuberculosis", "Streptococcal infection"],
    answer: 2,
    explanation:
      "In India, the most common cause of erythema nodosum is tuberculosis (due to high TB prevalence). Globally, streptococcal infection and sarcoidosis are common. EN = tender, erythematous nodules on shins (panniculitis).",
  },
  {
    id: 154,
    subject: "Medicine",
    stem: "Trousseau's sign (migrating thrombophlebitis) is classically associated with:",
    options: ["SLE", "Pancreatic adenocarcinoma", "Liver cirrhosis", "Renal cell carcinoma"],
    answer: 1,
    explanation:
      "Trousseau's sign of malignancy = migratory thrombophlebitis — classically associated with pancreatic cancer (Trousseau himself died of it). Also seen in other GI adenocarcinomas. Hypercoagulability via mucin-mediated platelet activation.",
  },
  {
    id: 155,
    subject: "Medicine",
    stem: "Chvostek's sign (facial muscle twitch on tapping facial nerve) indicates:",
    options: ["Hyperkalaemia", "Hypomagnesaemia", "Hypocalcaemia", "Hypernatraemia"],
    answer: 2,
    explanation:
      "Chvostek's sign = tap facial nerve anterior to ear → facial muscle twitch → indicates hypocalcaemia (neuromuscular irritability). Trousseau's sign (carpal spasm with BP cuff) is more specific for hypocalcaemia. Treat with IV calcium gluconate if symptomatic.",
  },

  // ─── SURGERY EXTENDED (156–168) ──────────────────────────────────────────
  {
    id: 156,
    subject: "Surgery",
    stem: "Most common type of thyroid carcinoma is:",
    options: ["Follicular", "Papillary", "Medullary", "Anaplastic"],
    answer: 1,
    explanation:
      "Papillary thyroid carcinoma (PTC) is the most common (80%). Best prognosis. RET/PTC rearrangement. Psammoma bodies on histology. Medullary = calcitonin-secreting, associated with MEN2. Anaplastic = worst prognosis, rapidly fatal.",
  },
  {
    id: 157,
    subject: "Surgery",
    stem: "The Alvarado score is used to assess the likelihood of:",
    options: ["Appendicitis", "Cholelithiasis", "Diverticulitis", "Pancreatitis"],
    answer: 0,
    explanation:
      "Alvarado score (MANTRELS): Migration of pain to RIF, Anorexia, Nausea, Tenderness in RIF, Rebound tenderness, Elevated temperature, Leucocytosis, Shift to left. Score ≥7 = high likelihood appendicitis → surgery.",
  },
  {
    id: 158,
    subject: "Surgery",
    stem: "The most common cause of small bowel obstruction in adults in developed countries is:",
    options: ["Hernia", "Adhesions", "Tumours", "Volvulus"],
    answer: 1,
    explanation:
      "Adhesions (post-surgical) are the most common cause of SBO in adults (~60%). In developing countries (and in virgin abdomen), hernia is the commonest cause. Management: conservative (NGT, IV fluids) vs surgery based on signs of strangulation.",
  },
  {
    id: 159,
    subject: "Surgery",
    stem: "Courvoisier's law states that in obstructive jaundice:",
    options: [
      "Palpable gallbladder = stone in CBD",
      "Palpable gallbladder with jaundice is unlikely due to stone",
      "Jaundice without palpable gallbladder = malignancy",
      "Gallbladder carcinoma causes jaundice always",
    ],
    answer: 1,
    explanation:
      "Courvoisier's law: jaundice + palpable (non-tender) gallbladder is unlikely to be due to stone (chronic stone disease causes fibrosis/shrinkage). More likely = periampullary carcinoma, pancreatic head cancer, cholangiocarcinoma.",
  },
  {
    id: 160,
    subject: "Surgery",
    stem: "Duke's B colorectal carcinoma means:",
    options: [
      "Tumour confined to mucosa",
      "Tumour through muscularis propria, no lymph node involvement",
      "Lymph node involvement",
      "Distant metastases",
    ],
    answer: 1,
    explanation:
      "Duke's staging: A = confined to bowel wall; B = through bowel wall, nodes negative; C = lymph node positive; D = distant metastases (added later). Now replaced by TNM staging in practice but Duke's remains an exam favourite.",
  },
  {
    id: 161,
    subject: "Surgery",
    stem: "Sentinel lymph node biopsy (SLNB) is a technique used in which cancer to avoid unnecessary axillary dissection?",
    options: ["Thyroid cancer", "Breast cancer", "Colon cancer", "Prostate cancer"],
    answer: 1,
    explanation:
      "SLNB in breast cancer: inject blue dye/radiotracer near tumour → identify first draining (sentinel) lymph node → biopsy. If SLN negative, full axillary clearance avoided → less morbidity (lymphoedema, shoulder dysfunction).",
  },
  {
    id: 162,
    subject: "Surgery",
    stem: "The Parkland formula for fluid resuscitation in burns uses:",
    options: [
      "2 mL × weight (kg) × TBSA% (normal saline)",
      "4 mL × weight (kg) × TBSA% (Ringer's lactate)",
      "4 mL × weight (kg) × TBSA% (colloid)",
      "1 mL × weight (kg) × TBSA% (albumin)",
    ],
    answer: 1,
    explanation:
      "Parkland formula: 4 mL × kg × TBSA% burned using Ringer's lactate. Half given in first 8 hours from time of burn; remaining half over next 16 hours. Applies to burns >15% TBSA. Fluid starts from TIME OF BURN, not arrival.",
  },
  {
    id: 163,
    subject: "Surgery",
    stem: "Trendelenburg test is used to assess:",
    options: ["Femoral artery competence", "Saphenofemoral junction incompetence (varicose veins)", "Hip joint stability", "Inguinal hernia"],
    answer: 1,
    explanation:
      "Trendelenburg test for varicose veins: elevate leg → apply tourniquet → stand up. If veins fill immediately after releasing tourniquet = saphenofemoral junction incompetence. Modified test also assesses perforator incompetence.",
  },
  {
    id: 164,
    subject: "Surgery",
    stem: "Most common site of carcinoid tumour in the GI tract is:",
    options: ["Stomach", "Duodenum", "Appendix", "Sigmoid colon"],
    answer: 2,
    explanation:
      "Appendix is the most common site of GI carcinoid (incidental finding on appendicectomy). However, ileal carcinoids are most likely to cause carcinoid syndrome (5-HT, bradykinin). Carcinoid syndrome = flushing + diarrhoea + bronchospasm + right heart lesions.",
  },
  {
    id: 165,
    subject: "Surgery",
    stem: "Meckel's diverticulum follows the rule of 2s. Which of the following is part of the rule?",
    options: [
      "2 cm long, 2 feet from ileocaecal valve, affects 2% of population",
      "2 inches long, 20 cm from ileocaecal valve, affects 20% of population",
      "2 cm, 2 m from ileocaecal valve, 2% of population",
      "2 types of ectopic mucosa, 2% incidence, presents at 20 years",
    ],
    answer: 0,
    explanation:
      "Meckel's rule of 2s: 2% of population, 2 inches (5 cm) long, 2 feet (60 cm) from ileocaecal valve, 2 types of ectopic mucosa (gastric most common → peptic ulcer/bleed, pancreatic), presents in first 2 years of life.",
  },
  {
    id: 166,
    subject: "Surgery",
    stem: "The Glasgow Coma Scale (GCS) score for a patient who opens eyes to pain, makes incomprehensible sounds, and localises pain is:",
    options: ["7", "9", "11", "13"],
    answer: 1,
    explanation:
      "GCS: Eyes (E): 1 none, 2 to pain, 3 to voice, 4 spontaneous. Verbal (V): 1 none, 2 sounds, 3 words, 4 confused, 5 oriented. Motor (M): 1 none, 2 extension, 3 flexion, 4 withdrawal, 5 localises, 6 obeys. E2+V2+M5 = 9.",
  },
  {
    id: 167,
    subject: "Surgery",
    stem: "Port site metastasis in laparoscopic surgery for colorectal cancer is associated with:",
    options: ["Large port size", "High CO₂ pressure pneumoperitoneum", "Inadequate specimen bagging", "All of the above"],
    answer: 3,
    explanation:
      "Port site metastasis risk reduced by: specimen retrieval in bags, wound irrigation, avoiding high pneumoperitoneum pressures that aerosolise tumour cells, and using appropriate port sizes. Incidence is ~1% in experienced hands.",
  },
  {
    id: 168,
    subject: "Surgery",
    stem: "First-line treatment for spontaneous bacterial peritonitis (SBP) is:",
    options: ["Ampicillin + gentamicin", "Cefotaxime IV", "Metronidazole", "Oral ciprofloxacin only"],
    answer: 1,
    explanation:
      "SBP (infection of ascitic fluid, usually E.coli/Klebsiella/Streptococcus) → cefotaxime IV (or ceftriaxone) is first-line. Albumin infusion given concurrently (1.5 g/kg day 1, 1 g/kg day 3) reduces hepatorenal syndrome risk. Prophylaxis: norfloxacin.",
  },

  // ─── PATHOLOGY EXTENDED (169–180) ────────────────────────────────────────
  {
    id: 169,
    subject: "Pathology",
    stem: "Which tumour marker is elevated in hepatocellular carcinoma (HCC)?",
    options: ["CEA", "CA 19-9", "Alpha-fetoprotein (AFP)", "CA 125"],
    answer: 2,
    explanation:
      "AFP is the primary marker for HCC (sensitivity ~60%, specificity ~90% for AFP > 400 ng/mL). Also elevated in yolk sac tumours, hepatoblastoma, and physiologically in pregnancy. CEA = colon cancer; CA 19-9 = pancreatic/biliary; CA 125 = ovarian.",
  },
  {
    id: 170,
    subject: "Pathology",
    stem: "Reed-Sternberg cells are the hallmark of:",
    options: ["Non-Hodgkin lymphoma", "Hodgkin lymphoma", "Burkitt lymphoma", "Mycosis fungoides"],
    answer: 1,
    explanation:
      "Reed-Sternberg cells (owl-eye nucleoli, binucleated/multinucleated large cells) are the diagnostic hallmark of Hodgkin lymphoma. RS cells are CD15+, CD30+ (most subtypes). In nodular lymphocyte-predominant HL (NLPHL), 'popcorn cells' are seen instead.",
  },
  {
    id: 171,
    subject: "Pathology",
    stem: "The histological type of carcinoma breast most commonly associated with Paget's disease of the nipple is:",
    options: ["Lobular carcinoma in situ", "Invasive lobular carcinoma", "Ductal carcinoma in situ (DCIS)", "Mucinous carcinoma"],
    answer: 2,
    explanation:
      "Paget's disease of the nipple = DCIS (ductal carcinoma in situ) or invasive ductal carcinoma with intraepidermal spread of malignant cells to the nipple-areola. Looks like eczema of nipple. Paget cells are large with pale cytoplasm, HER2+.",
  },
  {
    id: 172,
    subject: "Pathology",
    stem: "The oncogene mutated in Burkitt lymphoma is:",
    options: ["BCL-2", "c-MYC", "BCR-ABL", "RET"],
    answer: 1,
    explanation:
      "Burkitt lymphoma: c-MYC translocation t(8;14) — most common; less common: t(2;8) or t(8;22). Starry sky pattern on H&E. EBV-associated (endemic form). BCL-2 = follicular lymphoma t(14;18). BCR-ABL = CML t(9;22).",
  },
  {
    id: 173,
    subject: "Pathology",
    stem: "Coagulative necrosis is seen in all of the following EXCEPT:",
    options: ["Myocardial infarction", "Renal infarction", "Brain infarction", "Splenic infarction"],
    answer: 2,
    explanation:
      "Brain infarction causes liquefactive necrosis (due to high lipid content and activated proteases). All other solid organ infarcts (heart, kidney, spleen) cause coagulative necrosis — cell outlines preserved, eosinophilic, ghost cells.",
  },
  {
    id: 174,
    subject: "Pathology",
    stem: "Gaucher's disease is caused by a deficiency of:",
    options: ["Sphingomyelinase", "Glucocerebrosidase (beta-glucosidase)", "Hexosaminidase A", "Alpha-galactosidase A"],
    answer: 1,
    explanation:
      "Gaucher's disease: glucocerebrosidase deficiency → glucocerebroside accumulation in macrophages. 'Crinkled paper' or 'wrinkled tissue paper' macrophages in bone marrow. Type 1 (non-neuropathic) most common. Treat with enzyme replacement (imiglucerase).",
  },
  {
    id: 175,
    subject: "Pathology",
    stem: "Dystrophic calcification occurs in:",
    options: [
      "Normal tissue with elevated serum calcium",
      "Dead or dying tissue with normal serum calcium",
      "Normal tissue with elevated serum phosphate",
      "Viable tissue with hypercalcaemia",
    ],
    answer: 1,
    explanation:
      "Dystrophic calcification: calcium deposits in dead/necrotic/abnormal tissue (serum calcium NORMAL). Examples: atherosclerotic plaques, TB caseous necrosis, tumour calcification. Metastatic calcification = calcification in normal tissue due to hypercalcaemia.",
  },
  {
    id: 176,
    subject: "Pathology",
    stem: "The Philadelphia chromosome (t9;22) results in which fusion gene?",
    options: ["PML-RARA", "BCL2-IGH", "BCR-ABL1", "EWS-FLI1"],
    answer: 2,
    explanation:
      "t(9;22) Philadelphia chromosome → BCR-ABL1 fusion → constitutively active tyrosine kinase → uncontrolled proliferation. Present in >95% CML, 25-30% adult ALL. Imatinib (Gleevec) specifically inhibits BCR-ABL → revolutionary targeted therapy.",
  },
  {
    id: 177,
    subject: "Pathology",
    stem: "Psammoma bodies are characteristically seen in all EXCEPT:",
    options: ["Papillary thyroid carcinoma", "Serous papillary ovarian carcinoma", "Meningioma", "Follicular thyroid carcinoma"],
    answer: 3,
    explanation:
      "Psammoma bodies (laminated calcified concentric rings) are seen in: papillary thyroid carcinoma, serous papillary ovarian carcinoma, meningioma, papillary RCC. NOT seen in follicular thyroid carcinoma (psammoma bodies suggest papillary pattern).",
  },
  {
    id: 178,
    subject: "Pathology",
    stem: "Hyperplasia differs from hypertrophy in that hyperplasia involves:",
    options: ["Increase in cell size", "Increase in cell number", "Decrease in cell size", "Cell death"],
    answer: 1,
    explanation:
      "Hypertrophy = increase in cell SIZE (same cell number). Hyperplasia = increase in cell NUMBER (requires capacity for cell division). Cardiac muscle hypertrophy (post-MI), skeletal muscle hypertrophy (exercise). Endometrial hyperplasia (oestrogen excess). Both can coexist.",
  },
  {
    id: 179,
    subject: "Pathology",
    stem: "The pattern of necrosis seen in tuberculosis is:",
    options: ["Coagulative", "Liquefactive", "Caseous", "Fat necrosis"],
    answer: 2,
    explanation:
      "Caseous necrosis is the hallmark of tuberculosis — cheese-like, structureless, amorphous material on H&E. Differs from coagulative (structure preserved) and liquefactive (liquid pus). Also seen in some fungi (Histoplasma) and syphilitic gummas.",
  },
  {
    id: 180,
    subject: "Pathology",
    stem: "Li-Fraumeni syndrome is associated with germline mutations in:",
    options: ["BRCA1", "APC", "p53 (TP53)", "VHL"],
    answer: 2,
    explanation:
      "Li-Fraumeni syndrome: germline p53 (TP53) mutation → multiple cancers at young age (sarcomas, breast cancer, brain tumours, leukaemias, adrenal cortical carcinoma). Autosomal dominant. Risk of cancer by age 30: ~50%, by age 70: >90%.",
  },

  // ─── OBG EXTENDED (181–192) ──────────────────────────────────────────────
  {
    id: 181,
    subject: "OBG",
    stem: "The most common cause of postpartum haemorrhage (PPH) is:",
    options: ["Retained placenta", "Uterine atony", "Genital tract trauma", "Coagulopathy"],
    answer: 1,
    explanation:
      "Uterine atony accounts for 80% of PPH. The '4 Ts': Tone (atony 80%), Tissue (retained placenta), Trauma (lacerations), Thrombin (coagulopathy). First-line management: uterine massage + oxytocin 10 IU IM/IV.",
  },
  {
    id: 182,
    subject: "OBG",
    stem: "Pre-eclampsia is defined as hypertension (≥140/90) developing after __ weeks with proteinuria:",
    options: ["16 weeks", "20 weeks", "24 weeks", "28 weeks"],
    answer: 1,
    explanation:
      "Pre-eclampsia: new-onset hypertension (≥140/90 mmHg on 2 occasions ≥4 hours apart) after 20 weeks gestation with proteinuria (≥300 mg/24h or PCR ≥0.3) or end-organ involvement. Before 20 weeks = chronic hypertension.",
  },
  {
    id: 183,
    subject: "OBG",
    stem: "The drug of choice for prevention of eclamptic seizures is:",
    options: ["Phenytoin", "Diazepam", "Magnesium sulfate", "Phenobarbitone"],
    answer: 2,
    explanation:
      "Magnesium sulfate (MgSO₄) is the DOC for both treatment and prevention of eclamptic fits. Loading dose: 4g IV over 20 min; maintenance: 1g/hr. Monitor toxicity: loss of knee jerk reflex (first sign), respiratory depression (9-12 mEq/L), cardiac arrest (>12 mEq/L). Antidote: calcium gluconate.",
  },
  {
    id: 184,
    subject: "OBG",
    stem: "Cardinal movements of labour in the correct sequence are:",
    options: [
      "Engagement → flexion → descent → internal rotation → extension → external rotation → expulsion",
      "Descent → engagement → flexion → internal rotation → extension → expulsion",
      "Flexion → engagement → descent → external rotation → extension → expulsion",
      "Engagement → descent → flexion → external rotation → extension → expulsion",
    ],
    answer: 0,
    explanation:
      "Cardinal movements: Engagement → Descent → Flexion → Internal rotation → Extension → External rotation (restitution) → Expulsion. Mnemonic: 'Every Dog Finds It Extremely Easy' or 'EDFIEE'.",
  },
  {
    id: 185,
    subject: "OBG",
    stem: "FIGO staging of cervical carcinoma: tumour invading the parametrium but not reaching the pelvic wall is stage:",
    options: ["IB1", "IIA", "IIB", "IIIB"],
    answer: 2,
    explanation:
      "FIGO 2018 cervical cancer: Stage I = confined to cervix; IIA = upper 2/3 vagina; IIB = parametrial invasion (NOT pelvic wall); IIIA = lower 1/3 vagina; IIIB = pelvic wall or hydronephrosis; IVA = bladder/rectal mucosa; IVB = distant mets.",
  },
  {
    id: 186,
    subject: "OBG",
    stem: "The most common ectopic pregnancy site is:",
    options: ["Ovary", "Cornua", "Ampulla of fallopian tube", "Isthmus of fallopian tube"],
    answer: 2,
    explanation:
      "Ampulla of fallopian tube = 70% of ectopic pregnancies. Cornua/interstitial = most dangerous (ruptures at 8-16 weeks, massive haemorrhage). Ovarian and abdominal are rare. Risk factors: PID, previous tubal surgery, IUD failure.",
  },
  {
    id: 187,
    subject: "OBG",
    stem: "Duncan mechanism of placental separation differs from Schultz mechanism in that:",
    options: [
      "Central separation first in Duncan",
      "Maternal surface presents first in Duncan",
      "Fetal surface presents first in Duncan",
      "No bleeding in Duncan mechanism",
    ],
    answer: 1,
    explanation:
      "Schultz = central separation → fetal (shiny) surface presents first, bleeding is concealed then gushes. Duncan = peripheral/marginal separation → maternal (raw, rough) surface presents first, bleeding trickles throughout. Schultz more common (~80%).",
  },
  {
    id: 188,
    subject: "OBG",
    stem: "Asherman syndrome (intrauterine adhesions) is a complication of:",
    options: ["PCOD", "Endometriosis", "Aggressive curettage of uterus", "Uterine fibroid"],
    answer: 2,
    explanation:
      "Asherman syndrome: endometrial adhesions from aggressive curettage (post-abortion, post-partum) → amenorrhoea, infertility. Diagnosis: hysteroscopy (gold standard). Treatment: hysteroscopic adhesiolysis + oestrogen for endometrial regeneration.",
  },
  {
    id: 189,
    subject: "OBG",
    stem: "The most sensitive indicator of ovulation is:",
    options: [
      "Basal body temperature rise",
      "Serum progesterone on day 21",
      "LH surge detection",
      "Endometrial biopsy showing secretory phase",
    ],
    answer: 2,
    explanation:
      "LH surge precedes ovulation by 34–36 hours and is the earliest, most sensitive predictor. Basal body temperature rises AFTER ovulation (due to progesterone). Serum progesterone > 5 ng/mL on day 21 confirms ovulation retrospectively.",
  },
  {
    id: 190,
    subject: "OBG",
    stem: "Clue cells on vaginal wet mount are characteristic of:",
    options: ["Trichomonas vaginalis", "Candida albicans", "Bacterial vaginosis", "Gonorrhoea"],
    answer: 2,
    explanation:
      "Bacterial vaginosis (BV): clue cells (vaginal epithelial cells studded with bacteria, 'salt and pepper'), fishy amine odour, pH > 4.5, positive whiff test. Caused by Gardnerella vaginalis (not exclusively STI). Treat with metronidazole.",
  },
  {
    id: 191,
    subject: "OBG",
    stem: "Which investigation is most useful for assessing tubal patency in infertility?",
    options: ["Hysteroscopy", "Laparoscopy with chromopertubation", "Hysterosalpingography (HSG)", "Saline infusion sonography"],
    answer: 1,
    explanation:
      "Laparoscopy with chromopertubation (methylene blue through cervix while viewing tubes) is the gold standard for tubal assessment. HSG is a good first-line investigation (non-invasive, outpatient), but laparoscopy confirms and can simultaneously treat (adhesiolysis).",
  },
  {
    id: 192,
    subject: "OBG",
    stem: "The most common cause of female infertility worldwide is:",
    options: ["Tubal factor", "Ovulatory dysfunction", "Unexplained infertility", "Uterine factor"],
    answer: 0,
    explanation:
      "Tubal factor (PID-related damage, endometriosis, previous surgery) is the most common cause of female infertility globally (~40%). Ovulatory dysfunction (PCOD, hypothalamic amenorrhoea) is second. In developed nations, unexplained infertility is increasingly common.",
  },

  // ─── PAEDIATRICS EXTENDED (193–202) ──────────────────────────────────────
  {
    id: 193,
    subject: "Paediatrics",
    stem: "The drug of choice for childhood absence epilepsy (petit mal) is:",
    options: ["Carbamazepine", "Ethosuximide", "Phenobarbitone", "Vigabatrin"],
    answer: 1,
    explanation:
      "Ethosuximide is DOC for pure absence seizures in children. Valproate is used when absence coexists with other seizure types. Carbamazepine is contraindicated in absence epilepsy (can worsen). Vigabatrin → infantile spasms.",
  },
  {
    id: 194,
    subject: "Paediatrics",
    stem: "Normal birth weight is defined as:",
    options: ["> 2000 g", "1500–2000 g", "≥ 2500 g", "> 3000 g"],
    answer: 2,
    explanation:
      "Normal birth weight: ≥2500 g. Low birth weight (LBW): <2500 g. Very low birth weight (VLBW): <1500 g. Extremely low birth weight (ELBW): <1000 g. LBW includes preterm + SGA (small for gestational age).",
  },
  {
    id: 195,
    subject: "Paediatrics",
    stem: "Koplik's spots are pathognomonic of:",
    options: ["Rubella", "Varicella", "Measles", "Scarlet fever"],
    answer: 2,
    explanation:
      "Koplik's spots (white/grey papules on buccal mucosa opposite lower molars) appear 1–2 days before measles rash — pathognomonic. Measles rash: maculopapular, starts at hairline/behind ears, spreads downward (cephalocaudal). Complications: pneumonia, encephalitis, SSPE.",
  },
  {
    id: 196,
    subject: "Paediatrics",
    stem: "The commonest congenital heart disease in children is:",
    options: ["Atrial septal defect (ASD)", "Ventricular septal defect (VSD)", "Patent ductus arteriosus (PDA)", "Tetralogy of Fallot (ToF)"],
    answer: 1,
    explanation:
      "VSD is the most common CHD (30–35%). Most small VSDs close spontaneously. Large VSDs → Eisenmenger syndrome if untreated. ASD = second most common; PDA = third. Tetralogy of Fallot = most common cyanotic CHD.",
  },
  {
    id: 197,
    subject: "Paediatrics",
    stem: "The Apgar score is assessed at which time points after birth?",
    options: ["Immediately and at 5 minutes", "1 minute and 5 minutes", "2 minutes and 10 minutes", "At birth and at 10 minutes"],
    answer: 1,
    explanation:
      "APGAR score at 1 minute and 5 minutes. Parameters: Appearance (colour), Pulse (HR), Grimace (reflex irritability), Activity (muscle tone), Respiration. Score 7–10 = normal; 4–6 = moderate depression; 0–3 = severe depression → resuscitation.",
  },
  {
    id: 198,
    subject: "Paediatrics",
    stem: "Which vaccine is contraindicated in a child with HIV infection?",
    options: ["Inactivated polio vaccine (IPV)", "Hepatitis B vaccine", "BCG (in symptomatic HIV)", "Influenza vaccine (inactivated)"],
    answer: 2,
    explanation:
      "BCG is a live attenuated vaccine — contraindicated in symptomatic HIV (CD4 count low) due to risk of disseminated BCG disease. In asymptomatic HIV, BCG may be given in high-TB-burden countries (India gives BCG at birth before HIV diagnosis). IPV is safe in all HIV.",
  },
  {
    id: 199,
    subject: "Paediatrics",
    stem: "Kawasaki disease diagnostic criterion includes fever for at least how many days?",
    options: ["3 days", "5 days", "7 days", "10 days"],
    answer: 1,
    explanation:
      "Kawasaki disease (mucocutaneous lymph node syndrome): fever ≥5 days + 4 of 5: conjunctival injection, oral changes (strawberry tongue), rash, extremity changes (erythema/desquamation), cervical lymphadenopathy. Treat with IVIG + aspirin (rare exception where aspirin used in children).",
  },
  {
    id: 200,
    subject: "Paediatrics",
    stem: "Which investigation is the gold standard for diagnosis of cystic fibrosis?",
    options: ["Chest X-ray", "Sweat chloride test (>60 mmol/L)", "Sputum culture", "Serum IRT (immunoreactive trypsinogen)"],
    answer: 1,
    explanation:
      "Sweat chloride test (pilocarpine iontophoresis): >60 mmol/L diagnostic, 30–59 = borderline (repeat + CFTR mutation testing). CFTR mutation analysis also diagnostic. IRT used for newborn screening. CXR shows hyperinflation, bronchiectasis (not diagnostic).",
  },
  {
    id: 201,
    subject: "Paediatrics",
    stem: "The triple vaccine (DPT) is contraindicated in a child who had which reaction after previous dose?",
    options: ["Fever 38°C", "Redness at injection site", "Encephalopathy within 7 days", "Inconsolable crying for 3 hours"],
    answer: 2,
    explanation:
      "Encephalopathy within 7 days of DPT is an absolute contraindication to further doses. Relative contraindications: progressive neurological disorder, fever >40.5°C within 48h, inconsolable crying >3h, hypotonic-hyporesponsive episode. Fever <40.5°C, local reactions = not contraindications.",
  },
  {
    id: 202,
    subject: "Paediatrics",
    stem: "Physiological jaundice in a term newborn appears after how many hours of life?",
    options: ["<24 hours", "24–72 hours", "72–96 hours", ">7 days"],
    answer: 1,
    explanation:
      "Physiological neonatal jaundice appears after 24 hours (NEVER in first 24 hours — that's always pathological). Peaks at 3–5 days, resolves by 10–14 days in term infants (longer in preterm). Bilirubin <12 mg/dL (term) and <15 mg/dL (preterm) usually physiological.",
  },

  // ─── MICROBIOLOGY EXTENDED (203–212) ─────────────────────────────────────
  {
    id: 203,
    subject: "Microbiology",
    stem: "The Weil-Felix test is used for diagnosis of which disease?",
    options: ["Typhoid", "Rickettsial infections", "Leptospirosis", "Brucellosis"],
    answer: 1,
    explanation:
      "Weil-Felix test: agglutination of Proteus vulgaris OX-2, OX-19, OX-K strains by patient serum — tests for rickettsial infections. OX-19 + OX-2 positive = epidemic typhus, Rocky Mountain spotted fever. OX-K positive = scrub typhus (Orientia tsutsugamushi).",
  },
  {
    id: 204,
    subject: "Microbiology",
    stem: "Which hepatitis virus is transmitted by the faeco-oral route and does NOT cause chronic infection?",
    options: ["Hepatitis B", "Hepatitis C", "Hepatitis D", "Hepatitis E"],
    answer: 3,
    explanation:
      "Hepatitis E = faeco-oral, does NOT cause chronic hepatitis (like Hep A). However, HEV is DANGEROUS in pregnancy — mortality 20–30% in third trimester. Hepatitis B, C, D = parenteral/sexual; B, C, D can cause chronic hepatitis.",
  },
  {
    id: 205,
    subject: "Microbiology",
    stem: "The capsule of Cryptococcus neoformans is demonstrated by:",
    options: ["Gram stain", "ZN stain", "India ink preparation", "Giemsa stain"],
    answer: 2,
    explanation:
      "India ink preparation: negative staining shows C. neoformans with prominent polysaccharide capsule (clear halo around yeast cell) in CSF. India ink positive in ~70% HIV-associated cryptococcal meningitis. Latex agglutination (cryptococcal antigen) is more sensitive.",
  },
  {
    id: 206,
    subject: "Microbiology",
    stem: "The vector for Kala-azar (visceral leishmaniasis) in India is:",
    options: ["Anopheles mosquito", "Culex mosquito", "Phlebotomus sandfly", "Ixodes tick"],
    answer: 2,
    explanation:
      "Phlebotomus argentipes (female sandfly) is the vector for Kala-azar (Leishmania donovani) in India. Endemic in Bihar, Jharkhand, West Bengal, UP. Aldehyde (formol-gel) test: positive in Kala-azar (globulin elevation). Treat with liposomal amphotericin B (first-line in India).",
  },
  {
    id: 207,
    subject: "Microbiology",
    stem: "The 'school of fish' pattern on Gram stain is characteristic of:",
    options: ["Clostridium perfringens", "Haemophilus ducreyi", "Bacteroides fragilis", "Listeria monocytogenes"],
    answer: 1,
    explanation:
      "Haemophilus ducreyi (chancroid): small gram-negative coccobacilli in 'school of fish' or 'railroad track' parallel streams pattern. Causes painful genital ulcer (unlike painless primary syphilis). Treat with azithromycin single dose or ceftriaxone.",
  },
  {
    id: 208,
    subject: "Microbiology",
    stem: "The M protein of Group A Streptococcus (Streptococcus pyogenes) is responsible for:",
    options: ["Beta-haemolysis", "Antiphagocytic virulence", "Exotoxin production", "Resistance to penicillin"],
    answer: 1,
    explanation:
      "M protein of S. pyogenes is the primary virulence factor — antiphagocytic (inhibits complement activation and opsonisation). >80 serotypes based on M protein. Anti-M antibodies are type-specific and protective. Cross-reactive with cardiac myosin → rheumatic fever.",
  },
  {
    id: 209,
    subject: "Microbiology",
    stem: "Cold agglutinin test is positive in:",
    options: ["Mycoplasma pneumoniae infection", "Legionella pneumophila infection", "Chlamydia psittaci infection", "Pneumococcal pneumonia"],
    answer: 0,
    explanation:
      "Cold agglutinins (IgM anti-I RBC antibodies at 4°C) are positive in Mycoplasma pneumoniae pneumonia (~50% of cases). Also seen in EBV, CMV, and haemolytic anaemias. Mycoplasma: 'walking pneumonia', young adults, X-ray worse than clinical signs, no cell wall (penicillin ineffective).",
  },
  {
    id: 210,
    subject: "Microbiology",
    stem: "The Mantoux test uses:",
    options: ["Whole killed M. tuberculosis", "5 TU of PPD (purified protein derivative)", "BCG vaccine antigen", "10 TU of old tuberculin"],
    answer: 1,
    explanation:
      "Mantoux test: 5 TU (tuberculin units) of PPD (RT-23) injected intradermally on volar forearm. Read at 48–72 hours. Induration (not redness) ≥10 mm = positive in general population; ≥5 mm = positive in HIV, immunocompromised, recent TB contact.",
  },
  {
    id: 211,
    subject: "Microbiology",
    stem: "Negri bodies are pathognomonic of:",
    options: ["Herpes encephalitis", "Rabies", "Japanese encephalitis", "CMV encephalitis"],
    answer: 1,
    explanation:
      "Negri bodies (eosinophilic intracytoplasmic inclusions in Purkinje cells of cerebellum and hippocampal neurons) are pathognomonic of rabies. Seen on H&E stain of brain tissue (post-mortem diagnosis). Ante-mortem: RT-PCR of saliva, skin biopsy.",
  },
  {
    id: 212,
    subject: "Microbiology",
    stem: "The laboratory diagnosis of enteric fever (typhoid) in the first week of illness is best made by:",
    options: ["Stool culture", "Urine culture", "Blood culture", "Widal test"],
    answer: 2,
    explanation:
      "Blood culture is positive in 90% of cases in WEEK 1 (bacteraemia phase). Stool/urine culture positive weeks 2–3. Widal test: O agglutinins rise week 1, H agglutinins rise week 2. Widal titre ≥1:80 for O is significant; ≥1:160 for H. Blood culture = gold standard.",
  },

  // ─── ENT/OPHTHALMOLOGY EXTENDED (213–222) ───────────────────────────────
  {
    id: 213,
    subject: "ENT/Ophthalmology",
    stem: "The most common cause of conductive hearing loss in children is:",
    options: ["Otosclerosis", "Otitis media with effusion (glue ear)", "Acoustic neuroma", "Presbycusis"],
    answer: 1,
    explanation:
      "Otitis media with effusion (OME/'glue ear') is the most common cause of acquired conductive hearing loss in children (peak age 2–5 years). Accumulation of non-purulent fluid in middle ear. Treatment: observation 3 months → grommets (ventilation tubes).",
  },
  {
    id: 214,
    subject: "ENT/Ophthalmology",
    stem: "The treatment of choice for cholesteatoma is:",
    options: ["Antibiotics", "Topical ear drops", "Surgical excision (mastoidectomy)", "Hearing aid"],
    answer: 2,
    explanation:
      "Cholesteatoma (keratinising squamous epithelium in middle ear/mastoid) = surgical emergency — erodes bone, can cause intracranial complications. Treatment: mastoidectomy (cortical or modified radical). Cannot be treated conservatively (will expand and erode).",
  },
  {
    id: 215,
    subject: "ENT/Ophthalmology",
    stem: "The most common organism causing acute bacterial rhinosinusitis is:",
    options: ["Moraxella catarrhalis", "Haemophilus influenzae", "Streptococcus pneumoniae", "Staphylococcus aureus"],
    answer: 2,
    explanation:
      "Streptococcus pneumoniae is the most common cause of acute bacterial rhinosinusitis (30–35%), followed by H. influenzae (20–30%) and M. catarrhalis (<10%). Most viral sinusitis (>90%) resolves spontaneously without antibiotics.",
  },
  {
    id: 216,
    subject: "ENT/Ophthalmology",
    stem: "Rinne's test with BC > AC (Rinne negative) in the right ear suggests:",
    options: [
      "Right sensorineural hearing loss",
      "Right conductive hearing loss",
      "Left sensorineural hearing loss",
      "Normal hearing",
    ],
    answer: 1,
    explanation:
      "Normally AC > BC (Rinne positive). If BC > AC (Rinne negative) = conductive hearing loss in that ear. Weber test: sound lateralises to the AFFECTED ear in conductive loss; to the NORMAL ear in sensorineural loss.",
  },
  {
    id: 217,
    subject: "ENT/Ophthalmology",
    stem: "The most common benign tumour of the parotid gland is:",
    options: ["Mucoepidermoid carcinoma", "Pleomorphic adenoma", "Warthin's tumour", "Acinic cell carcinoma"],
    answer: 1,
    explanation:
      "Pleomorphic adenoma (benign mixed tumour) = most common salivary gland tumour (70–80%), most common in parotid. Contains epithelial + myoepithelial + mesenchymal elements. Risk of malignant transformation if untreated. Treat with superficial parotidectomy.",
  },
  {
    id: 218,
    subject: "ENT/Ophthalmology",
    stem: "Trachoma (blinding eye disease) is caused by:",
    options: ["Neisseria gonorrhoeae", "Chlamydia trachomatis (serotypes A–C)", "Herpes simplex virus", "Adenovirus"],
    answer: 1,
    explanation:
      "Trachoma: Chlamydia trachomatis serotypes A, B, Ba, C → leading infectious cause of blindness globally. WHO SAFE strategy: Surgery (trichiasis), Antibiotics (azithromycin), Facial cleanliness, Environmental improvement. India: highly endemic in Rajasthan, UP.",
  },
  {
    id: 219,
    subject: "ENT/Ophthalmology",
    stem: "Bitot's spots are a sign of deficiency of which vitamin?",
    options: ["Vitamin B12", "Vitamin C", "Vitamin A", "Vitamin D"],
    answer: 2,
    explanation:
      "Bitot's spots (foamy, cheesy triangular spots on bulbar conjunctiva) = early sign of vitamin A deficiency (xerophthalmia). Progression: night blindness → xerosis conjunctivae → Bitot's spots → corneal xerosis → keratomalacia → blindness.",
  },
  {
    id: 220,
    subject: "ENT/Ophthalmology",
    stem: "The most common cause of sudden painless loss of vision in an elderly patient with diabetes and hypertension is:",
    options: ["Acute angle closure glaucoma", "Central retinal artery occlusion (CRAO)", "Vitreous haemorrhage", "Retinal detachment"],
    answer: 1,
    explanation:
      "CRAO: sudden, painless, profound visual loss, 'cherry red spot' at macula (choroidal circulation visible through avascular fovea), pale retina. Emergency (irreversible after 90 min). Risk factors: emboli (carotid, cardiac), vasculitis, hypertension, DM. Urgent ophthalmology referral.",
  },
  {
    id: 221,
    subject: "ENT/Ophthalmology",
    stem: "The most common type of glaucoma in India is:",
    options: ["Acute angle-closure glaucoma", "Primary open-angle glaucoma", "Secondary glaucoma", "Congenital glaucoma"],
    answer: 1,
    explanation:
      "Primary open-angle glaucoma (POAG) is the most common glaucoma in India (and globally). Chronic, painless, progressive peripheral vision loss. IOP usually elevated (>21 mmHg). Cupping of optic disc (CDR >0.6). Treat with beta-blockers (timolol) or prostaglandin analogues (latanoprost).",
  },
  {
    id: 222,
    subject: "ENT/Ophthalmology",
    stem: "Corneal graft (penetrating keratoplasty) rejection is primarily mediated by:",
    options: ["Antibody-mediated rejection", "T-cell mediated (cellular) rejection", "Complement activation", "NK cell-mediated rejection"],
    answer: 1,
    explanation:
      "Corneal graft rejection is primarily T-cell mediated (cellular). Cornea is 'immune-privileged' (avascular, no lymphatics, low MHC expression) — hence the best graft survival of any tissue (~90% at 5 years). Rejection signs: oedema, keratic precipitates, Khodadoust line.",
  },

  // ─── PSM EXTENDED (223–232) ───────────────────────────────────────────────
  {
    id: 223,
    subject: "PSM/Community Medicine",
    stem: "The number of ASHA workers in India (approximately) is:",
    options: ["500,000", "1 million", "2 million", "5 million"],
    answer: 1,
    explanation:
      "There are approximately 1 million (10 lakh) ASHAs in India. Norm: 1 ASHA per 1000 population in general areas; 1 per habitation in tribal/hilly areas. ASHA is a community health volunteer, not a health worker (receives incentives, not salary).",
  },
  {
    id: 224,
    subject: "PSM/Community Medicine",
    stem: "Which is the correct infant mortality rate (IMR) of India as per SRS 2020-21?",
    options: ["27 per 1000 live births", "35 per 1000 live births", "42 per 1000 live births", "50 per 1000 live births"],
    answer: 1,
    explanation:
      "IMR India (SRS 2020-21): 35 per 1000 live births. Best state: Kerala (6/1000). Worst: MP (41/1000). U5MR (NFHS-5): 41.9. NMR: 28.2. MMR (SRS 2018-20): 97 per 100,000 live births. These figures are heavily tested in NEET PG.",
  },
  {
    id: 225,
    subject: "PSM/Community Medicine",
    stem: "Integrated Child Development Services (ICDS) is administered by the Ministry of:",
    options: ["Health and Family Welfare", "Women and Child Development", "Social Justice and Empowerment", "Rural Development"],
    answer: 1,
    explanation:
      "ICDS is administered by the Ministry of Women and Child Development (not MoHFW). Anganwadi centres provide 6 services: supplementary nutrition, non-formal pre-school education, nutrition and health education, immunisation, health check-up, referral services.",
  },
  {
    id: 226,
    subject: "PSM/Community Medicine",
    stem: "The attack rate in an outbreak is calculated as:",
    options: [
      "Number of new cases / Total population at risk × 100",
      "Number of cases / Population exposed × 100",
      "Cumulative incidence during the outbreak",
      "Both B and C",
    ],
    answer: 3,
    explanation:
      "Attack rate = number who develop disease / total exposed (at risk) × 100. It is essentially cumulative incidence used during an outbreak (typically a short, defined period). Secondary attack rate (SAR) = new cases in contacts / susceptible contacts × 100.",
  },
  {
    id: 227,
    subject: "PSM/Community Medicine",
    stem: "The National Nutrition Mission (POSHAN Abhiyaan) targets reduction in stunting to:",
    options: ["<20% by 2022", "25% by 2022", "<40% by 2022", "<15% by 2025"],
    answer: 1,
    explanation:
      "POSHAN Abhiyaan (2018): reduce stunting from 38.4% (NFHS-4) to 25% by 2022. Target 3% annual reduction. NFHS-5 shows stunting at 35.5% — still far from target. Also targets: anaemia, LBW, wasting, undernutrition, overweight.",
  },
  {
    id: 228,
    subject: "PSM/Community Medicine",
    stem: "Correlation coefficient (r) of +1 indicates:",
    options: ["No correlation", "Perfect negative correlation", "Perfect positive correlation", "Moderate positive correlation"],
    answer: 2,
    explanation:
      "Pearson's r: +1 = perfect positive correlation, -1 = perfect negative correlation, 0 = no correlation. 0.1–0.3 = weak, 0.3–0.7 = moderate, >0.7 = strong. r² (coefficient of determination) = % of variance in Y explained by X.",
  },
  {
    id: 229,
    subject: "PSM/Community Medicine",
    stem: "The Pradhan Mantri Jan Arogya Yojana (PM-JAY/Ayushman Bharat) provides health cover of:",
    options: ["₹1 lakh per family per year", "₹3 lakh per family per year", "₹5 lakh per family per year", "₹10 lakh per family per year"],
    answer: 2,
    explanation:
      "PM-JAY/Ayushman Bharat: ₹5 lakh per family per year for secondary and tertiary hospitalisation. Covers ~107 million vulnerable families (bottom 40% of population). Cashless, paperless at empanelled hospitals. Launched 2018. Previously called RSBY (₹30,000 cover).",
  },
  {
    id: 230,
    subject: "PSM/Community Medicine",
    stem: "Type I error (alpha error) in hypothesis testing refers to:",
    options: [
      "Accepting H₀ when it is false",
      "Rejecting H₀ when it is true",
      "Not detecting a true difference",
      "Incorrect sample size calculation",
    ],
    answer: 1,
    explanation:
      "Type I error (alpha): rejecting H₀ when it is actually true (false positive). Usually set at 0.05 (5%). Type II error (beta): accepting H₀ when it is false (false negative). Power = 1 - beta. POWER increases with larger sample size.",
  },
  {
    id: 231,
    subject: "PSM/Community Medicine",
    stem: "The first Indian state to achieve polio-free status was:",
    options: ["Bihar", "Uttar Pradesh", "Kerala", "Tamil Nadu"],
    answer: 2,
    explanation:
      "Kerala was the first state to achieve polio-free status. India was declared polio-free by WHO in 2014 (3 years after last case in UP in 2011). India used OPV (Oral Polio Vaccine - Sabin) in national pulse immunisation. IPV added to routine UIP in 2015.",
  },
  {
    id: 232,
    subject: "PSM/Community Medicine",
    stem: "Which of the following is a notifiable disease in India under the Integrated Disease Surveillance Programme (IDSP)?",
    options: ["Common cold", "Hypertension", "Cholera", "Hyperlipidaemia"],
    answer: 2,
    explanation:
      "Cholera is a notifiable disease under IDSP. All epidemic-prone diseases must be notified: cholera, plague, yellow fever (International Health Regulations notifiable), plus dengue, malaria, viral hepatitis, AES, AFP, influenza A H1N1, COVID-19 etc. under IDSP.",
  },

  // ─── FORENSIC MEDICINE (233–242) ─────────────────────────────────────────
  {
    id: 233,
    subject: "Forensic Medicine",
    stem: "Rigor mortis typically starts after death at:",
    options: ["Immediately", "30 minutes", "3–6 hours", "12–18 hours"],
    answer: 2,
    explanation:
      "Rigor mortis: onset 3–6 hours after death (earlier in hot climate/exercise before death), maximum stiffness at 12 hours, starts disappearing at 24–36 hours, completely gone by 48–72 hours. Caused by ATP depletion → actin-myosin cross-links unable to release.",
  },
  {
    id: 234,
    subject: "Forensic Medicine",
    stem: "The MHCA (Mental Healthcare Act) 2017 replaces which previous Act?",
    options: ["Indian Lunacy Act 1912", "Mental Health Act 1987", "Persons with Disabilities Act 1995", "NDPS Act 1985"],
    answer: 1,
    explanation:
      "MHCA 2017 replaced the Mental Health Act 1987. Key features: rights-based approach, advance directives, nominated representative, mental illness definition (Section 3), decriminalises suicide attempt (Section 115), free treatment at government facilities.",
  },
  {
    id: 235,
    subject: "Forensic Medicine",
    stem: "Section 375 IPC (now BNS 2023) defines:",
    options: ["Culpable homicide", "Rape", "Kidnapping", "Cheating"],
    answer: 1,
    explanation:
      "IPC Section 375 = Rape (7 circumstances including penetration, without consent, with minors). Punishment: Section 376 = minimum 7 years, maximum life imprisonment. 2013 Criminal Law Amendment (Nirbhaya Act) expanded definition. Note: BNS 2023 now applies (Sections 63–64 of BNS).",
  },
  {
    id: 236,
    subject: "Forensic Medicine",
    stem: "The minimum age of consent for sexual activity in India as per POCSO Act 2012 is:",
    options: ["16 years", "18 years", "14 years", "21 years"],
    answer: 1,
    explanation:
      "POCSO Act 2012: any sexual activity with a person below 18 years = 'child sexual abuse' regardless of consent. Mandatory reporting requirement for all persons/institutions. Punishment up to life imprisonment for aggravated sexual assault.",
  },
  {
    id: 237,
    subject: "Forensic Medicine",
    stem: "The MTP (Medical Termination of Pregnancy) Act 2021 allows termination up to 24 weeks for:",
    options: [
      "Any woman on request",
      "Rape survivors, disabled women, and minors (special categories)",
      "All married women",
      "Women with more than 3 children",
    ],
    answer: 1,
    explanation:
      "MTP Amendment 2021: up to 20 weeks with 1 registered medical practitioner opinion; up to 24 weeks for special categories (rape survivors, minors, disabled, mentally ill, multi-gestation); beyond 24 weeks only for substantial foetal abnormalities (Medical Board). No upper limit changed for foetal anomalies.",
  },
  {
    id: 238,
    subject: "Forensic Medicine",
    stem: "Putrefaction is accelerated by:",
    options: ["Cold temperature", "Dry environment", "Hot, moist conditions", "Burial underground"],
    answer: 2,
    explanation:
      "Putrefaction (decomposition by bacteria): accelerated by heat + moisture. Summer/tropical conditions accelerate decomposition significantly. Retarded by: cold (embalming), dry conditions (mummification), waterlogging (adipocere formation), burial depth (slower in deep burial).",
  },
  {
    id: 239,
    subject: "Forensic Medicine",
    stem: "A professional secret in medical ethics may be disclosed without the patient's consent in which situation?",
    options: [
      "Request by a relative",
      "Notifiable communicable disease",
      "Insurance company request",
      "Patient's employer request",
    ],
    answer: 1,
    explanation:
      "Compulsory disclosure of medical secrets: notifiable diseases (cholera, plague, etc.), court order/subpoena, when patient is a danger to self/others, medico-legal cases, MTP notification. Disclosure to insurance/employer without consent = breach of confidentiality.",
  },
  {
    id: 240,
    subject: "Forensic Medicine",
    stem: "McEwen's sign in drowning refers to:",
    options: ["Cherry-red mucosa", "Washerwoman's hands + cutis anserina", "Froth at nostrils and mouth", "Ruptured tympanic membrane"],
    answer: 1,
    explanation:
      "Signs of drowning: Washerwoman's hands (cutis anserina = goose skin), frothy fluid in airways (Tardieu's spots internally), diatoms in blood/bone marrow (proof of vital reaction). 'Cafe coronaire' = food bolus obstruction (not drowning). Diatom test = only reliable post-mortem test.",
  },
  {
    id: 241,
    subject: "Forensic Medicine",
    stem: "Section 304A IPC (BNS equivalent Section 106) deals with:",
    options: ["Murder", "Death by negligence (rash/negligent act)", "Culpable homicide not amounting to murder", "Abetment of suicide"],
    answer: 1,
    explanation:
      "IPC 304A = causing death by negligence (not amounting to culpable homicide) — 2 years imprisonment, fine, or both. Key in medical negligence. Jacob Mathew vs State of Punjab (2005) SC ruling: doctors negligent under civil law but criminal prosecution needs grossly negligent act.",
  },
  {
    id: 242,
    subject: "Forensic Medicine",
    stem: "Adipocere formation (saponification) in a dead body occurs in conditions of:",
    options: ["Hot and dry environment", "Cold and moist environment", "Waterlogged/buried in wet soil", "Both B and C"],
    answer: 3,
    explanation:
      "Adipocere (soap-like substance): hydrolysis + hydrogenation of body fat into fatty acids (palmitic, stearic acids). Occurs in cold, moist, anaerobic conditions — waterlogged bodies, buried in wet soil. Can preserve body outline for years. Grey-white, greasy, waxy substance.",
  },

  // ─── BIOCHEMISTRY EXTENDED (243–252) ─────────────────────────────────────
  {
    id: 243,
    subject: "Biochemistry",
    stem: "The rate-limiting enzyme of the urea cycle is:",
    options: ["Arginase", "Carbamoyl phosphate synthetase I (CPS-I)", "Argininosuccinate synthetase", "Ornithine transcarbamylase"],
    answer: 1,
    explanation:
      "CPS-I (in mitochondria) is the rate-limiting enzyme of the urea cycle. It catalyses: NH₃ + CO₂ + 2ATP → carbamoyl phosphate. Activated by N-acetylglutamate (NAG). Deficiency → hyperammonemia (most severe in neonates).",
  },
  {
    id: 244,
    subject: "Biochemistry",
    stem: "Phenylketonuria (PKU) is caused by deficiency of:",
    options: ["Tyrosine hydroxylase", "Phenylalanine hydroxylase", "Homogentisate oxidase", "Fumarylacetoacetase"],
    answer: 1,
    explanation:
      "PKU: phenylalanine hydroxylase deficiency → phenylalanine accumulates → intellectual disability, fair skin/hair (reduced melanin), musty odour (phenylacetate), eczema. Treat with phenylalanine-restricted diet + sapropterin (BH4) in BH4-responsive forms.",
  },
  {
    id: 245,
    subject: "Biochemistry",
    stem: "The enzyme deficient in gout (Lesch-Nyhan syndrome) is:",
    options: ["Xanthine oxidase", "Adenosine deaminase", "Hypoxanthine-guanine phosphoribosyltransferase (HGPRT)", "Purine nucleoside phosphorylase"],
    answer: 2,
    explanation:
      "Lesch-Nyhan syndrome: HGPRT deficiency → purine salvage pathway blocked → excess uric acid production → gout + neurological features (self-mutilation, choreoathetosis, intellectual disability). X-linked recessive. Allopurinol treats gout but not neurological features.",
  },
  {
    id: 246,
    subject: "Biochemistry",
    stem: "Competitive inhibition of an enzyme is characterised by:",
    options: [
      "Decreased Vmax, unchanged Km",
      "Unchanged Vmax, increased Km",
      "Decreased Vmax, increased Km",
      "Unchanged Vmax, unchanged Km",
    ],
    answer: 1,
    explanation:
      "Competitive inhibition: inhibitor competes with substrate for active site → Km increases (apparent reduced affinity), Vmax UNCHANGED (can be overcome by increasing substrate). Non-competitive: Vmax decreases, Km unchanged. Uncompetitive: both Km and Vmax decrease.",
  },
  {
    id: 247,
    subject: "Biochemistry",
    stem: "The vitamin deficiency that causes pellagra is:",
    options: ["Vitamin B1 (thiamine)", "Vitamin B2 (riboflavin)", "Vitamin B3 (niacin)", "Vitamin B6 (pyridoxine)"],
    answer: 2,
    explanation:
      "Pellagra: niacin (vitamin B3/nicotinic acid) deficiency. 3 Ds: Dermatitis (photosensitive, Casal's necklace), Diarrhoea, Dementia. A 4th D = Death if untreated. Can also occur in carcinoid syndrome and isoniazid treatment (pyridoxine also deficient). Treat with nicotinamide.",
  },
  {
    id: 248,
    subject: "Biochemistry",
    stem: "Which coenzyme is involved in transamination reactions?",
    options: ["NAD⁺", "FAD", "Pyridoxal phosphate (PLP)", "Thiamine pyrophosphate (TPP)"],
    answer: 2,
    explanation:
      "Pyridoxal phosphate (PLP) — active form of vitamin B6 — is the coenzyme for transamination (and all amino acid metabolism). ALT (alanine aminotransferase) and AST (aspartate aminotransferase) use PLP. Deficiency causes convulsions in infants (glutamate decarboxylase requires PLP).",
  },
  {
    id: 249,
    subject: "Biochemistry",
    stem: "Scurvy (vitamin C deficiency) causes impaired synthesis of:",
    options: ["Elastin", "Collagen (hydroxylation of proline and lysine)", "Keratin", "Fibronectin"],
    answer: 1,
    explanation:
      "Vitamin C (ascorbic acid) is required for hydroxylation of proline and lysine by prolyl and lysyl hydroxylases in collagen synthesis. Deficiency → defective collagen → bleeding gums, perifollicular haemorrhage, poor wound healing, corkscrew hairs, scorbutic rosary.",
  },
  {
    id: 250,
    subject: "Biochemistry",
    stem: "The transport protein for iron in the blood is:",
    options: ["Ferritin", "Haemosiderin", "Transferrin", "Lactoferrin"],
    answer: 2,
    explanation:
      "Transferrin (apotransferrin bound to iron) is the plasma transport protein for iron. Transferrin saturation = serum iron / TIBC × 100. In iron deficiency: low serum iron, high TIBC, low transferrin saturation (<20%). Ferritin = storage form (intracellular).",
  },
  {
    id: 251,
    subject: "Biochemistry",
    stem: "Homocystinuria is caused by deficiency of:",
    options: ["Methionine adenosyltransferase", "Cystathionine beta-synthase", "Cystathionase", "MTHFR (methylenetetrahydrofolate reductase)"],
    answer: 1,
    explanation:
      "Cystathionine beta-synthase deficiency → homocysteine accumulates → homocystinuria. Features: Marfan-like habitus, ectopia lentis (downward, vs Marfan's upward), intellectual disability, thromboembolism, osteoporosis. Treat with high B6 diet (if B6-responsive) or low methionine diet.",
  },
  {
    id: 252,
    subject: "Biochemistry",
    stem: "The first urine test used to diagnose phenylketonuria (PKU) at birth is:",
    options: ["DNPH test", "Guthrie test (bacterial inhibition assay)", "Ferric chloride test", "Urinary amino acid chromatography"],
    answer: 1,
    explanation:
      "Guthrie test (bacterial inhibition assay using Bacillus subtilis) was the original neonatal screening test for PKU on dried blood spot. Now replaced by tandem mass spectrometry (MS/MS) for newborn screening. Ferric chloride test on urine turns green in PKU.",
  },
];

