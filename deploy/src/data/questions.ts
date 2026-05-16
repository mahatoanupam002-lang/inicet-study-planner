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

  // ─── ANATOMY EXTENDED (253–264) ──────────────────────────────────────────
  {
    id: 253,
    subject: "Anatomy",
    stem: "Injury to the common peroneal nerve at the neck of the fibula causes which deformity?",
    options: ["Foot drop with loss of eversion", "Equinovarus foot", "Claw toes", "Loss of ankle jerk"],
    answer: 0,
    explanation:
      "Common peroneal nerve wraps around the neck of the fibula — most vulnerable point. Injury → foot drop (loss of dorsiflexion and eversion — deep and superficial peroneal nerve components). Ankle jerk is mediated by the tibial nerve (L5/S1) and is spared.",
  },
  {
    id: 254,
    subject: "Anatomy",
    stem: "The contents of the inguinal canal in males include all EXCEPT:",
    options: ["Vas deferens", "Ilioinguinal nerve", "Genitofemoral nerve (genital branch)", "Inferior epigastric vessels"],
    answer: 3,
    explanation:
      "Inguinal canal contents (male): spermatic cord (vas deferens, testicular artery, pampiniform plexus, lymphatics, genital branch of genitofemoral nerve, cremasteric artery) + ilioinguinal nerve. Inferior epigastric vessels lie medial to the deep inguinal ring, not in the canal.",
  },
  {
    id: 255,
    subject: "Anatomy",
    stem: "The portal-systemic anastomosis at the gastro-oesophageal junction involves which veins?",
    options: [
      "Left gastric veins and azygos/hemiazygos veins",
      "Short gastric veins and splenic vein",
      "Inferior mesenteric vein and inferior rectal vein",
      "Superior rectal vein and middle rectal vein",
    ],
    answer: 0,
    explanation:
      "At the oesophageal end: left gastric (portal) ↔ oesophageal (azygos/systemic). In portal hypertension, these enlarge to form oesophageal varices — the most dangerous site (risk of fatal haemorrhage). Other sites: rectum, umbilicus (caput medusae), retroperitoneum.",
  },
  {
    id: 256,
    subject: "Anatomy",
    stem: "Erb's palsy involves injury to which nerve roots?",
    options: ["C5, C6", "C7, C8", "C8, T1", "C5, C6, C7"],
    answer: 0,
    explanation:
      "Erb's palsy: upper brachial plexus injury (C5, C6) — waiter's tip position (arm adducted, internally rotated, forearm pronated, wrist flexed). Loss: shoulder abduction, lateral rotation, elbow flexion, forearm supination. Caused by traction at birth or shoulder depression injury.",
  },
  {
    id: 257,
    subject: "Anatomy",
    stem: "The surgical triangle of the neck where the carotid artery is accessed for carotid endarterectomy is bounded by:",
    options: [
      "SCM, omohyoid, posterior belly of digastric",
      "SCM, anterior belly of digastric, hyoid bone",
      "Trapezius, SCM, clavicle",
      "SCM, stylohyoid, posterior belly of digastric",
    ],
    answer: 0,
    explanation:
      "Carotid triangle (anterior cervical triangle): SCM (posterior), omohyoid (inferior), posterior belly of digastric and stylohyoid (superior). Contains carotid artery bifurcation, internal jugular vein, CN IX, X, XI, XII. Site of carotid endarterectomy and lymph node dissection.",
  },
  {
    id: 258,
    subject: "Anatomy",
    stem: "The lymphatic drainage of the testis follows the:",
    options: ["Inguinal lymph nodes", "Iliac lymph nodes", "Para-aortic (lumbar) lymph nodes", "Sacral lymph nodes"],
    answer: 2,
    explanation:
      "Testes develop retroperitoneally and drain to para-aortic (lumbar) lymph nodes around L1-L2 — following the gonadal vessels. This is why testicular cancer spreads to para-aortic nodes, not inguinal nodes (unlike scrotal skin, which drains to inguinal nodes).",
  },
  {
    id: 259,
    subject: "Anatomy",
    stem: "The recurrent laryngeal nerve (a branch of vagus) is at risk during which surgery?",
    options: ["Parotidectomy", "Thyroidectomy", "Submandibular gland excision", "Mastoidectomy"],
    answer: 1,
    explanation:
      "The recurrent laryngeal nerve (RLN) loops under the aortic arch (left) and right subclavian artery, ascending in the tracheo-oesophageal groove. It enters the larynx at the cricothyroid joint. At highest risk during thyroidectomy. Injury → hoarseness (unilateral) or aphonia and breathing difficulty (bilateral).",
  },
  {
    id: 260,
    subject: "Anatomy",
    stem: "The femoral nerve is formed from posterior divisions of:",
    options: ["L2, L3, L4", "L1, L2, L3", "L3, L4, L5", "L2, L3, L4, L5"],
    answer: 0,
    explanation:
      "Femoral nerve (L2, L3, L4 posterior divisions) is the largest branch of the lumbar plexus. Lies lateral to femoral artery in femoral triangle. Supplies: quadriceps femoris, sartorius, iliacus. Skin of anteromedial thigh and medial leg (saphenous nerve). Damaged in psoas abscess or hip surgery.",
  },
  {
    id: 261,
    subject: "Anatomy",
    stem: "The contents of the posterior compartment of the thigh are supplied by which nerve?",
    options: ["Femoral nerve", "Sciatic nerve", "Obturator nerve", "Common peroneal nerve only"],
    answer: 1,
    explanation:
      "The sciatic nerve (L4, L5, S1, S2, S3) supplies the posterior compartment of the thigh (hamstrings: biceps femoris, semimembranosus, semitendinosus, and ischial head of adductor magnus). The tibial division supplies most hamstrings; common peroneal supplies short head of biceps femoris.",
  },
  {
    id: 262,
    subject: "Anatomy",
    stem: "The lateral boundary of the femoral ring (allowing femoral hernia passage) is:",
    options: ["Lacunar ligament", "Femoral vein", "Inguinal ligament", "Pectineal ligament"],
    answer: 1,
    explanation:
      "Femoral ring boundaries: anterior = inguinal ligament, posterior = pectineal ligament, medial = lacunar ligament, lateral = femoral vein. Femoral hernia passes through the femoral canal (medial to the femoral vein). More common in females. Strangulation risk is HIGH due to rigid boundaries.",
  },
  {
    id: 263,
    subject: "Anatomy",
    stem: "Wrist drop following a mid-shaft fracture of the humerus is due to injury of:",
    options: ["Median nerve", "Ulnar nerve", "Radial nerve in the spiral groove", "Anterior interosseous nerve"],
    answer: 2,
    explanation:
      "The radial nerve runs in the spiral groove of the humerus (closely applied to bone). Mid-shaft fractures damage it here → wrist drop (loss of ECRL, ECRB, ECU, finger extensors) + sensory loss on dorsum of hand. Elbow extension (triceps, supplied higher) is SPARED.",
  },
  {
    id: 264,
    subject: "Anatomy",
    stem: "The diaphragm is pierced by the inferior vena cava at the level of:",
    options: ["T8", "T10", "T12", "L1"],
    answer: 0,
    explanation:
      "Diaphragm openings: T8 = IVC + right phrenic nerve; T10 = oesophagus + vagal trunks + left gastric vessels; T12 = aorta + thoracic duct + azygos vein. Mnemonic: 'I 8 (ate) 10 eggs AT 12' = IVC at T8, Esophagus at T10, Aorta at T12.",
  },

  // ─── PHYSIOLOGY EXTENDED (265–276) ───────────────────────────────────────
  {
    id: 265,
    subject: "Physiology",
    stem: "The JVP waveform component 'a wave' corresponds to:",
    options: ["Right ventricular contraction", "Right atrial contraction (systole)", "Tricuspid valve closure", "Right ventricular filling"],
    answer: 1,
    explanation:
      "JVP waveforms: 'a' = atrial contraction (pre-systolic); 'c' = tricuspid valve closure/bulging; 'x' descent = atrial relaxation; 'v' = venous filling with tricuspid closed; 'y' descent = tricuspid opens. 'a' wave absent in AF; giant 'a' wave in tricuspid stenosis, complete heart block.",
  },
  {
    id: 266,
    subject: "Physiology",
    stem: "The Fick principle for measurement of cardiac output states that cardiac output equals:",
    options: [
      "Heart rate × stroke volume",
      "O₂ consumption / (arteriovenous O₂ difference)",
      "Mean arterial pressure / systemic vascular resistance",
      "Stroke volume / end-diastolic volume",
    ],
    answer: 1,
    explanation:
      "Fick principle: CO = O₂ consumption (mL/min) ÷ (arterial O₂ content - venous O₂ content). Normal CO = 5 L/min. Cardiac index (CI) = CO/BSA (normal 2.5-4.0 L/min/m²). Used in right heart catheterisation to measure CO directly.",
  },
  {
    id: 267,
    subject: "Physiology",
    stem: "The normal GFR in an adult is approximately:",
    options: ["80 mL/min", "125 mL/min", "180 mL/min", "250 mL/min"],
    answer: 1,
    explanation:
      "Normal GFR: ~125 mL/min (180 L/day). The kidneys filter 180 L/day but excrete only ~1.5 L urine (99% reabsorption). GFR is measured by inulin clearance (gold standard) or estimated by creatinine clearance. CKD stages based on GFR (KDIGO): G1 ≥90, G2 60-89, G3a 45-59, G3b 30-44, G4 15-29, G5 <15.",
  },
  {
    id: 268,
    subject: "Physiology",
    stem: "In the Wiggers diagram, the period of isovolumetric relaxation ends when:",
    options: ["Mitral valve opens", "Aortic valve closes", "Tricuspid valve opens", "Pulmonic valve opens"],
    answer: 0,
    explanation:
      "Isovolumetric relaxation: begins at aortic valve closure (second heart sound S2) and ends when ventricular pressure falls below atrial pressure → mitral (and tricuspid) valves open → ventricular filling begins. During this phase, LV pressure drops rapidly with no change in volume.",
  },
  {
    id: 269,
    subject: "Physiology",
    stem: "The normal pulmonary capillary wedge pressure (PCWP) is:",
    options: ["2-5 mmHg", "6-12 mmHg", "15-20 mmHg", "20-25 mmHg"],
    answer: 1,
    explanation:
      "Normal PCWP (wedge pressure) = 6-12 mmHg. PCWP reflects left atrial pressure. Elevated PCWP (>18 mmHg) = cardiogenic pulmonary oedema. Low PCWP + high cardiac output = distributive shock. Used in Swan-Ganz catheter-guided management of critically ill patients.",
  },
  {
    id: 270,
    subject: "Physiology",
    stem: "Which of the following shifts the oxygen-haemoglobin dissociation curve to the RIGHT?",
    options: ["Decreased temperature", "Alkalosis (increased pH)", "Foetal haemoglobin (HbF)", "Increased 2,3-DPG"],
    answer: 3,
    explanation:
      "Right shift (decreased O₂ affinity, promotes O₂ delivery to tissues): increased temperature, acidosis (Bohr effect), increased PCO₂, increased 2,3-DPG. Left shift (increased affinity, useful in placenta): HbF, decreased 2,3-DPG, alkalosis, hypothermia, CO poisoning.",
  },
  {
    id: 271,
    subject: "Physiology",
    stem: "The primary buffer system of extracellular fluid is:",
    options: ["Phosphate buffer", "Protein buffer", "Bicarbonate-carbonic acid buffer", "Haemoglobin buffer"],
    answer: 2,
    explanation:
      "The bicarbonate-carbonic acid system (pKa 6.1, [HCO₃⁻]/[H₂CO₃] = 20:1 at pH 7.4) is the most important ECF buffer because its components are regulated independently (lungs control CO₂; kidneys control HCO₃⁻), maintaining pH despite large acid/base loads.",
  },
  {
    id: 272,
    subject: "Physiology",
    stem: "Renin is secreted by the juxtaglomerular cells in response to:",
    options: [
      "Increased renal perfusion pressure",
      "Increased NaCl at macula densa",
      "Decreased renal perfusion pressure and sympathetic stimulation",
      "Increased angiotensin II",
    ],
    answer: 2,
    explanation:
      "Renin release stimuli: decreased renal perfusion pressure (baroreceptor mechanism), decreased NaCl delivery to macula densa, sympathetic stimulation (beta-1 adrenoceptors on JG cells). Renin cleaves angiotensinogen → Ang I → ACE → Ang II → aldosterone + vasoconstriction.",
  },
  {
    id: 273,
    subject: "Physiology",
    stem: "The 'windkessel effect' refers to the function of:",
    options: ["Cardiac muscle stretch receptors", "Arterial compliance in converting pulsatile to continuous flow", "Venous pooling in capacitance vessels", "Baroreceptor reflex arc"],
    answer: 1,
    explanation:
      "Windkessel effect: large arteries (aorta, major branches) store energy during systole (elastic recoil) and release it during diastole, converting pulsatile ventricular output into more continuous peripheral flow. Decreased in atherosclerosis → widened pulse pressure in elderly.",
  },
  {
    id: 274,
    subject: "Physiology",
    stem: "The most potent stimulus for ADH (vasopressin) secretion is:",
    options: ["Decreased blood volume (hypovolaemia)", "Increased plasma osmolality", "Pain", "Nausea"],
    answer: 1,
    explanation:
      "Plasma osmolality is the most sensitive stimulus for ADH (threshold: 285 mOsm/kg; only 1-2% change triggers ADH). Hypovolaemia is a potent stimulus but only after 10-15% blood volume loss. ADH = arginine vasopressin; acts on V2 receptors in collecting duct → inserts aquaporin-2.",
  },
  {
    id: 275,
    subject: "Physiology",
    stem: "The 'P wave' on ECG represents:",
    options: ["SA node depolarisation", "Atrial depolarisation", "AV node conduction", "Atrial repolarisation"],
    answer: 1,
    explanation:
      "P wave = atrial depolarisation (SA node → atria). PR interval = AV node + His-Purkinje conduction (0.12-0.20 sec). QRS = ventricular depolarisation. ST segment = plateau phase. T wave = ventricular repolarisation. Atrial repolarisation is buried in QRS complex.",
  },
  {
    id: 276,
    subject: "Physiology",
    stem: "Carbon dioxide is primarily transported in the blood as:",
    options: ["Dissolved CO₂ in plasma", "Carbaminohaemoglobin", "Bicarbonate ions (HCO₃⁻)", "Carbonic acid"],
    answer: 2,
    explanation:
      "CO₂ transport: ~70% as HCO₃⁻ (formed by carbonic anhydrase in RBCs → CO₂ + H₂O ↔ H₂CO₃ ↔ H⁺ + HCO₃⁻); ~23% as carbaminohaemoglobin; ~7% dissolved. Chloride shift: HCO₃⁻ exits RBC in exchange for Cl⁻ (Hamburger phenomenon).",
  },

  // ─── MEDICINE EXTENDED (277–292) ─────────────────────────────────────────
  {
    id: 277,
    subject: "Medicine",
    stem: "A 65-year-old man with COPD and FEV1 40% predicted, 2 or more exacerbations per year, with dyspnoea on mild exertion belongs to GOLD group:",
    options: ["A", "B", "C", "D"],
    answer: 3,
    explanation:
      "GOLD 2023 classification: Group D = high-risk patients (FEV1 <50% OR ≥2 exacerbations/year) with high symptom burden (mMRC ≥2 or CAT ≥10). Group D needs triple inhaled therapy (LABA + LAMA + ICS). FEV1 40% = GOLD 3 (severe).",
  },
  {
    id: 278,
    subject: "Medicine",
    stem: "Which of the following is a class I indication (benefit >> risk, recommended) for primary PCI in STEMI?",
    options: [
      "STEMI presenting >12 hours after symptom onset",
      "STEMI presenting within 12 hours of symptom onset at a PCI-capable centre",
      "STEMI in a patient with prior CABG",
      "STEMI with cardiogenic shock beyond 36 hours",
    ],
    answer: 1,
    explanation:
      "Primary PCI is the preferred reperfusion strategy for STEMI if it can be performed within 90 minutes of first medical contact (door-to-balloon time). Class I: symptoms <12 hours, PCI-capable centre within 120 min. Thrombolytics if PCI cannot be achieved within 120 min of FMC.",
  },
  {
    id: 279,
    subject: "Medicine",
    stem: "The NYHA Class III heart failure is defined as:",
    options: [
      "No limitation of physical activity",
      "Slight limitation — comfortable at rest but ordinary activity causes symptoms",
      "Marked limitation — comfortable at rest but less than ordinary activity causes symptoms",
      "Symptoms at rest",
    ],
    answer: 2,
    explanation:
      "NYHA classification: I = no limitation; II = slight limitation (ordinary activity); III = marked limitation (less than ordinary activity causes symptoms, comfortable at rest); IV = symptoms at rest. Class III-IV = indication for cardiac transplant evaluation.",
  },
  {
    id: 280,
    subject: "Medicine",
    stem: "The drug that reduces mortality in heart failure with reduced ejection fraction (HFrEF) by blocking both AT1 receptor and neprilysin is:",
    options: ["Losartan", "Spironolactone", "Sacubitril/valsartan (ARNI)", "Ivabradine"],
    answer: 2,
    explanation:
      "Sacubitril/valsartan (LCZ696, Entresto) = ARNI (angiotensin receptor-neprilysin inhibitor). PARADIGM-HF trial: ARNI reduced CV mortality and HF hospitalisation by 20% vs enalapril. Replaces ACE inhibitor/ARB in HFrEF patients (EF ≤40%) who are stable. Avoid in combination with ACE inhibitor (angioedema risk).",
  },
  {
    id: 281,
    subject: "Medicine",
    stem: "In Diabetic Ketoacidosis (DKA), the initial IV fluid of choice is:",
    options: ["5% Dextrose", "0.9% Normal saline (NaCl)", "Ringer's lactate", "Half-normal saline (0.45%)"],
    answer: 1,
    explanation:
      "Initial management of DKA: 0.9% NaCl (normal saline) 1 L over first hour to correct hypovolaemia. Switch to 0.45% NaCl once serum Na corrects. Start dextrose when blood glucose <250 mg/dL. Insulin: 0.1 U/kg/hr regular insulin IV. Potassium replacement mandatory (insulin drives K into cells).",
  },
  {
    id: 282,
    subject: "Medicine",
    stem: "According to ADA 2024, the HbA1c target for most non-pregnant adults with Type 2 Diabetes is:",
    options: ["<6.5%", "<7.0%", "<7.5%", "<8.0%"],
    answer: 1,
    explanation:
      "ADA 2024: HbA1c <7.0% for most non-pregnant adults with T2DM. More stringent (<6.5%) for short duration, long life expectancy, no CVD. Less stringent (<8.0%) for elderly, multiple comorbidities, hypoglycaemia-prone, limited life expectancy. SGLT2i and GLP-1 RA are preferred add-ons due to CV/renal benefits.",
  },
  {
    id: 283,
    subject: "Medicine",
    stem: "The tPA (alteplase) window for acute ischaemic stroke is:",
    options: ["Within 1.5 hours", "Within 3 hours (extended to 4.5 hours in eligible patients)", "Within 6 hours", "Within 12 hours"],
    answer: 1,
    explanation:
      "IV alteplase is approved within 3 hours of stroke onset for eligible patients (no haemorrhage on CT, no anticoagulation, BP <185/110 after treatment, no major surgery <14 days). Extended to 4.5 hours in carefully selected patients (ECASS III trial). Mechanical thrombectomy for large vessel occlusion up to 24 hours.",
  },
  {
    id: 284,
    subject: "Medicine",
    stem: "Resistant hypertension is defined as blood pressure remaining above goal despite the concurrent use of how many antihypertensive medications?",
    options: ["2 drugs at maximum dose", "3 drugs including a diuretic", "4 drugs", "5 drugs"],
    answer: 1,
    explanation:
      "Resistant hypertension: BP above goal (usually <130/80 mmHg) despite ≥3 antihypertensive drugs from different classes including a diuretic at maximally tolerated doses. Always exclude secondary causes (primary aldosteronism, renal artery stenosis, obstructive sleep apnoea, CKD, phaeochromocytoma).",
  },
  {
    id: 285,
    subject: "Medicine",
    stem: "The SLICC criteria for SLE require at least how many criteria (or biopsy-proven lupus nephritis)?",
    options: ["4 of 11", "4 of 17", "4 of 19", "6 of 17"],
    answer: 1,
    explanation:
      "SLICC 2012 criteria: ≥4 of 17 criteria (11 clinical + 6 immunological) OR biopsy-proven lupus nephritis with either ANA or anti-dsDNA. Clinical domains: malar rash, discoid rash, photosensitivity, alopecia, oral ulcers, synovitis, serositis, renal, neurological, haemolytic anaemia, leucopenia/lymphopenia/thrombocytopenia.",
  },
  {
    id: 286,
    subject: "Medicine",
    stem: "The KDIGO staging for CKD stage G3a is defined by GFR:",
    options: ["60-89 mL/min/1.73m²", "45-59 mL/min/1.73m²", "30-44 mL/min/1.73m²", "15-29 mL/min/1.73m²"],
    answer: 1,
    explanation:
      "KDIGO CKD stages by GFR: G1 ≥90, G2 60-89, G3a 45-59, G3b 30-44, G4 15-29, G5 <15 (or dialysis). CKD = GFR <60 OR kidney damage markers present for >3 months. ESRD criteria: GFR <15 or on dialysis. Albuminuria stages: A1 <30, A2 30-300, A3 >300 mg/g.",
  },
  {
    id: 287,
    subject: "Medicine",
    stem: "Which finding on echocardiography is diagnostic of cardiac tamponade?",
    options: ["Tricuspid regurgitation", "Right ventricular diastolic collapse", "Paradoxical septal motion", "Left atrial enlargement"],
    answer: 1,
    explanation:
      "Cardiac tamponade echo features: pericardial effusion + right atrial systolic collapse (earliest), right ventricular diastolic collapse (most specific), exaggerated respiratory variation in mitral/tricuspid flow (>25% variation). Kussmaul sign is paradoxically NOT present in tamponade (it is in constrictive pericarditis).",
  },
  {
    id: 288,
    subject: "Medicine",
    stem: "First-line treatment for Crohn's disease involving the terminal ileum causing moderate symptoms is:",
    options: ["Sulfasalazine", "Budesonide", "Methotrexate", "Infliximab"],
    answer: 1,
    explanation:
      "Moderate ileal Crohn's disease: oral budesonide (9 mg/day × 8-16 weeks) for ileocaecal Crohn's — high first-pass metabolism → fewer systemic steroid effects. For severe disease or failure: systemic steroids, then immunomodulators (azathioprine) or biologics (infliximab/adalimumab).",
  },
  {
    id: 289,
    subject: "Medicine",
    stem: "Rapid shallow breathing index (RSBI) is used to predict weaning from mechanical ventilation. RSBI < __ favours successful weaning:",
    options: ["60", "80", "100", "105"],
    answer: 3,
    explanation:
      "RSBI (Yang-Tobin index) = f/VT (respiratory frequency/tidal volume in litres). RSBI <105 breaths/min/L predicts successful weaning from mechanical ventilation (sensitivity 97%, specificity 64%). RSBI >105 = likely to fail weaning. Measured during spontaneous breathing trial (SBT).",
  },
  {
    id: 290,
    subject: "Medicine",
    stem: "Which SGLT2 inhibitor has shown specific benefit in both heart failure with reduced AND preserved ejection fraction (HFrEF and HFpEF)?",
    options: ["Empagliflozin only (HFrEF)", "Dapagliflozin only (HFrEF)", "Empagliflozin (both HFrEF and HFpEF)", "Canagliflozin"],
    answer: 2,
    explanation:
      "EMPEROR-Reduced trial (empagliflozin in HFrEF) and EMPEROR-Preserved trial (empagliflozin in HFpEF) both showed reduced HF hospitalisations. DAPA-HF (dapagliflozin) and DELIVER (dapagliflozin in HFpEF) also positive. SGLT2i now recommended in all HF phenotypes regardless of diabetes status.",
  },
  {
    id: 291,
    subject: "Medicine",
    stem: "The classic histological finding in IgA nephropathy (Berger's disease) on immunofluorescence is:",
    options: ["Linear IgG deposits", "Subepithelial 'humps'", "Mesangial IgA deposits", "Granular IgG and C3 along GBM"],
    answer: 2,
    explanation:
      "IgA nephropathy (Berger's disease): mesangial IgA deposits on immunofluorescence (most common GN worldwide; most common cause of haematuria in young adults). Episodic macroscopic haematuria coinciding with URTIs (synpharyngitic haematuria). Treatment: RAS blockade; fish oil; steroids for severe proteinuria.",
  },
  {
    id: 292,
    subject: "Medicine",
    stem: "The most common valvular complication of rheumatic fever is:",
    options: ["Aortic stenosis", "Mitral stenosis", "Tricuspid regurgitation", "Pulmonary stenosis"],
    answer: 1,
    explanation:
      "Rheumatic fever most commonly affects the mitral valve → mitral stenosis (most common valvular complication of rheumatic heart disease). 'MVT' = mitral > aortic > tricuspid (involvement decreasing). MS: opening snap, mid-diastolic rumble at apex, left parasternal lift (right ventricular heave).",
  },

  // ─── SURGERY EXTENDED (293–304) ──────────────────────────────────────────
  {
    id: 293,
    subject: "Surgery",
    stem: "In ATLS (Advanced Trauma Life Support), Class III haemorrhagic shock is characterised by blood loss of:",
    options: ["Up to 750 mL (up to 15%)", "750–1500 mL (15-30%)", "1500–2000 mL (30-40%)", ">2000 mL (>40%)"],
    answer: 2,
    explanation:
      "ATLS shock classification: Class I <15% (750 mL); Class II 15-30% (750-1500 mL); Class III 30-40% (1500-2000 mL) — confused, tachycardic, tachypnoiec, hypotensive; Class IV >40% (>2000 mL) — lethal without immediate intervention. Class III needs crystalloid + blood products.",
  },
  {
    id: 294,
    subject: "Surgery",
    stem: "The 'Rule of Nines' for estimating burns in adults assigns what percentage to the head and neck?",
    options: ["4.5%", "9%", "18%", "1%"],
    answer: 1,
    explanation:
      "Rule of Nines (Pulaski-Tennison): head+neck = 9%, each arm = 9%, anterior trunk = 18%, posterior trunk = 18%, each leg = 18%, perineum = 1%. Total = 100%. In children, Lund-Browder chart is more accurate (head proportionally larger — 18% at birth). Burns >10% in children, >20% in adults need IV resuscitation.",
  },
  {
    id: 295,
    subject: "Surgery",
    stem: "Lichtenstein repair of inguinal hernia is a:",
    options: ["Pure tissue repair (no mesh)", "Tension-free mesh repair of the posterior wall of inguinal canal", "Laparoscopic repair (TEP/TAPP)", "Bassini repair with modification"],
    answer: 1,
    explanation:
      "Lichtenstein tension-free hernioplasty: flat polypropylene mesh placed over the posterior wall of the inguinal canal, sutured to the inguinal ligament (inferior), conjoint tendon (medial), and internal oblique (superior). Current gold standard for open inguinal hernia repair. Lower recurrence than Bassini (tissue repair).",
  },
  {
    id: 296,
    subject: "Surgery",
    stem: "Sentinel lymph node biopsy is the standard of care for clinically node-negative breast cancer. The sentinel node is identified by:",
    options: ["CT scan", "Blue dye and/or radiotracer (technetium-99m sulphur colloid)", "PET scan", "FNAC of axilla"],
    answer: 1,
    explanation:
      "SLNB: patent blue dye and/or radiotracer (Tc-99m sulphur colloid) injected periareolar/peritumoral. Gamma probe + visual identification of blue node identifies sentinel node. If SLN histologically negative → axillary node clearance avoided → less morbidity. ICG fluorescence also used.",
  },
  {
    id: 297,
    subject: "Surgery",
    stem: "The Klatskin tumour is a cholangiocarcinoma located at:",
    options: ["Ampulla of Vater", "Distal common bile duct", "Confluence of right and left hepatic ducts (hilar)", "Cystic duct"],
    answer: 2,
    explanation:
      "Klatskin tumour = hilar cholangiocarcinoma at the confluence of right and left hepatic ducts. Bismuth-Corlette classification stages extent of hepatic duct involvement. Presents with painless obstructive jaundice + weight loss. Often not resectable at presentation. Treated with radical resection (hepatectomy + Roux-en-Y hepaticojejunostomy) if possible.",
  },
  {
    id: 298,
    subject: "Surgery",
    stem: "Which BRCA mutation is most commonly associated with breast AND ovarian cancer?",
    options: ["BRCA1", "BRCA2", "BRCA1 and BRCA2 equally", "TP53 (Li-Fraumeni)"],
    answer: 0,
    explanation:
      "BRCA1 (chromosome 17q): lifetime breast cancer risk ~72%, ovarian cancer risk ~44%. BRCA2 (chromosome 13q): breast cancer risk ~69%, ovarian cancer risk ~17%, also associated with male breast cancer and pancreatic cancer. BRCA1 more associated with triple-negative breast cancer. Prophylactic mastectomy/salpingo-oophorectomy discussed.",
  },
  {
    id: 299,
    subject: "Surgery",
    stem: "The most common site of carcinoma in the large bowel is:",
    options: ["Caecum", "Transverse colon", "Rectosigmoid junction and rectum", "Descending colon"],
    answer: 2,
    explanation:
      "~60-70% of colorectal cancers occur in the rectum and sigmoid colon (left side, within reach of sigmoidoscopy). Right-sided (caecal) cancers present late with iron deficiency anaemia. Left-sided present with obstruction, rectal bleeding, altered bowel habits. CEA is used for monitoring, not diagnosis.",
  },
  {
    id: 300,
    subject: "Surgery",
    stem: "The gold standard investigation for diagnosing ischaemic heart disease prior to major non-cardiac surgery is:",
    options: ["Resting ECG", "Exercise stress test", "Dobutamine stress echocardiography", "CT coronary angiography"],
    answer: 2,
    explanation:
      "Dobutamine stress echo (DSE) is preferred for preoperative cardiac evaluation in patients unable to exercise (limited by orthopaedic/vascular disease). Reveals wall motion abnormalities with pharmacological stress. Nuclear perfusion scan is alternative. Echocardiography at rest assesses EF and valvular disease.",
  },
  {
    id: 301,
    subject: "Surgery",
    stem: "Charcot's neurological triad (in Charcot's joint/neuropathic arthropathy) involves all EXCEPT:",
    options: ["Ataxia", "Arthropathy", "Areflexia", "Amyotrophy"],
    answer: 0,
    explanation:
      "Charcot's neurological joint triad: arthropathy (neuropathic joint), amyotrophy, areflexia — caused by loss of pain/proprioception. Common causes: diabetes mellitus (foot), tabes dorsalis (knee), syringomyelia (shoulder). Ataxia is NOT part of Charcot's joint triad (though it may accompany the underlying neurological condition).",
  },
  {
    id: 302,
    subject: "Surgery",
    stem: "The anti-nausea drug used perioperatively that has a high risk of prolonging the QT interval is:",
    options: ["Ondansetron", "Metoclopramide", "Droperidol", "Dexamethasone"],
    answer: 2,
    explanation:
      "Droperidol (butyrophenone) has a black box warning for QT prolongation and risk of Torsades de Pointes. Still used in low doses for PONV. Ondansetron (5-HT3 antagonist) also prolongs QT slightly but is safer. Dexamethasone is the safest antiemetic for PONV prophylaxis.",
  },
  {
    id: 303,
    subject: "Surgery",
    stem: "The APACHE II (Acute Physiology and Chronic Health Evaluation) score is used to assess severity and predict mortality in:",
    options: ["Major trauma patients", "Burns patients", "ICU patients with acute illness", "Surgical site infections"],
    answer: 2,
    explanation:
      "APACHE II uses 12 physiological variables + age + chronic health score. Predicts ICU mortality probability. Score >20 = high mortality. Used in pancreatitis (APACHE II ≥8 = severe), sepsis, and general ICU population for resource allocation and outcome prediction.",
  },
  {
    id: 304,
    subject: "Surgery",
    stem: "Virchow's node (Troisier's sign) is an enlarged left supraclavicular lymph node signifying metastasis from:",
    options: ["Lung cancer (ipsilateral)", "Intra-abdominal malignancy (especially stomach)", "Head and neck cancer", "Breast cancer"],
    answer: 1,
    explanation:
      "Virchow's node (left supraclavicular) receives lymphatic drainage from the thoracic duct, which drains the entire abdominal cavity. Troisier's sign = palpable Virchow's node = distant metastasis from GI cancer (stomach most classic, also pancreas, colon). It is the left side because the thoracic duct enters at the left subclavian vein.",
  },

  // ─── OBG EXTENDED (305–316) ──────────────────────────────────────────────
  {
    id: 305,
    subject: "OBG",
    stem: "The Rotterdam criteria for PCOD diagnosis require at least 2 of 3 features. These features are:",
    options: [
      "Oligomenorrhoea + hyperandrogenism + polycystic ovaries on USG",
      "Obesity + insulin resistance + hyperandrogenism",
      "Hirsutism + infertility + elevated LH",
      "Anovulation + elevated LH/FSH ratio + obesity",
    ],
    answer: 0,
    explanation:
      "Rotterdam 2003 criteria (2 of 3): (1) oligo-/anovulation, (2) clinical/biochemical hyperandrogenism, (3) polycystic ovaries on USG (≥12 follicles 2-9mm or ovarian volume >10 mL per ovary). LH/FSH ratio >2:1 is suggestive but not a diagnostic criterion. Exclude other androgen disorders.",
  },
  {
    id: 306,
    subject: "OBG",
    stem: "Which grade of placenta praevia (old Grades I-IV) is called 'Type IV' (complete, central placenta praevia)?",
    options: [
      "Placenta partially covers the internal os",
      "Placenta completely covers the internal os",
      "Lower edge of placenta within 2 cm of internal os",
      "Placenta at the lower uterine segment but not reaching internal os",
    ],
    answer: 1,
    explanation:
      "Old Grades: Type I = low-lying (lower segment, not reaching os); Type II = marginal (reaching but not covering os); Type III = partial/incomplete praevia (partially covers os); Type IV = complete/central praevia (completely covers internal os). Current classification: just 'placenta praevia' vs 'low-lying'. Type IV → elective CS at 36-37 weeks.",
  },
  {
    id: 307,
    subject: "OBG",
    stem: "The magnesium toxicity monitoring parameter that is lost FIRST with rising serum Mg levels is:",
    options: ["Respiratory depression", "Cardiac arrest", "Knee jerk (patellar reflex)", "Urinary output reduction"],
    answer: 2,
    explanation:
      "Mg toxicity monitoring: patellar reflex disappears at 7-10 mEq/L (FIRST sign — monitor every 30 min with MgSO4 infusion), respiratory depression at 10-13 mEq/L, cardiac arrest at >15 mEq/L. Antidote: calcium gluconate 1g IV. Maintain urine output >30 mL/hr (ensure renal excretion of Mg).",
  },
  {
    id: 308,
    subject: "OBG",
    stem: "Hydatidiform mole (complete vs partial) — complete mole characteristically has which chromosomal pattern?",
    options: ["46,XY (biparental)", "46,XX (entirely paternal origin — androgenetic)", "69,XXX (triploidy)", "47,XXY"],
    answer: 1,
    explanation:
      "Complete mole: 46,XX (or rarely 46,XY), ENTIRELY paternal (androgenetic) — empty egg fertilised by one sperm (23X) that doubles or two sperm. No fetal tissue. Partial mole: 69,XXX or 69,XXY (triploidy), biparental, fetal tissue present. Complete moles have higher risk of gestational trophoblastic neoplasia (15-20%).",
  },
  {
    id: 309,
    subject: "OBG",
    stem: "The WHO definition of postpartum haemorrhage (primary PPH) is blood loss exceeding:",
    options: ["300 mL within 24 hours", "500 mL after vaginal delivery or 1000 mL after caesarean section", "1000 mL after any delivery", "Any blood loss requiring transfusion"],
    answer: 1,
    explanation:
      "WHO definition PPH: >500 mL after vaginal delivery or >1000 mL after caesarean section within 24 hours of delivery. Severe PPH: >1000 mL with signs of haemodynamic instability. Clinical blood loss is often underestimated. Treatment: uterotonic drugs (oxytocin first), then misoprostol, ergometrine, carboprost (PGF2α), tranexamic acid.",
  },
  {
    id: 310,
    subject: "OBG",
    stem: "The FIGO 2018 staging of cervical carcinoma now includes imaging findings. Stage IVA means:",
    options: ["Tumour invades pelvic wall", "Tumour invades mucosa of bladder or rectum", "Distant metastases", "Parametrial invasion"],
    answer: 1,
    explanation:
      "FIGO 2018 cervical cancer: IVA = tumour invades mucosa of bladder or rectum (proven by biopsy — bullous oedema alone insufficient). IVB = distant metastasis (including peritoneal spread, inguinal lymph node metastasis, lungs, liver). IIIC1 = pelvic LN metastasis; IIIC2 = para-aortic LN metastasis (new in 2018).",
  },
  {
    id: 311,
    subject: "OBG",
    stem: "Abruptio placentae (placental abruption) differs from placenta praevia in that:",
    options: [
      "Painless bleeding is characteristic of abruption",
      "Tender, hard (woody) uterus is characteristic of abruption",
      "Fetal presentation is normal in praevia",
      "Placenta praevia causes concealed haemorrhage more often",
    ],
    answer: 1,
    explanation:
      "Abruption: painful, tender, hard (woody) uterus; bleeding may be concealed or revealed; fetal distress common; associated with hypertension. Placenta praevia: PAINLESS bright red bleeding; soft uterus; abnormal fetal lie (praevia occupies lower uterine segment blocking normal lie).",
  },
  {
    id: 312,
    subject: "OBG",
    stem: "The investigation of choice for diagnosis of polycystic ovarian syndrome (PCOS) is:",
    options: ["Serum LH level", "Serum testosterone", "Pelvic ultrasound (transvaginal)", "Laparoscopy"],
    answer: 2,
    explanation:
      "Pelvic USG (preferably transvaginal): ≥12 follicles 2-9mm per ovary or ovarian volume >10 mL = polycystic morphology (Rotterdam criterion). Combined with clinical (oligomenorrhoea, hirsutism, acne) and biochemical (hyperandrogenaemia). USG alone is NOT diagnostic; all 3 criteria considered.",
  },
  {
    id: 313,
    subject: "OBG",
    stem: "The normal duration of the first stage of labour in a primigravida is:",
    options: ["<4 hours", "<8 hours", "Up to 12 hours", "Up to 24 hours"],
    answer: 2,
    explanation:
      "Active labour (first stage) in primigravida: up to 12 hours is normal (WHO partograph action line). Latent phase (0-3 cm dilation): up to 8-20 hours. Active phase cervical dilatation: ≥0.5 cm/hour (active phase arrest if no progress for 4+ hours with adequate contractions). Second stage: up to 2 hours (primigravida).",
  },
  {
    id: 314,
    subject: "OBG",
    stem: "Which drug is the first choice for medical induction of cervical ripening/labour?",
    options: ["Oxytocin", "Dinoprostone (PGE2)", "Misoprostol (PGE1)", "Mifepristone"],
    answer: 1,
    explanation:
      "Dinoprostone (PGE2) gel/insert is the standard pharmacological cervical ripening agent when Bishop score <6 (unfavourable cervix). Misoprostol (cheaper, more potent, oral/vaginal/sublingual) is increasingly used but not FDA-approved for induction in USA. Oxytocin: only after cervix is favourable (Bishop ≥6).",
  },
  {
    id: 315,
    subject: "OBG",
    stem: "The most common cause of primary amenorrhoea with normal secondary sexual characteristics is:",
    options: ["Turner syndrome", "Hypothyroidism", "Müllerian agenesis (MRKH syndrome)", "Androgen insensitivity syndrome"],
    answer: 2,
    explanation:
      "MRKH (Mayer-Rokitansky-Küster-Hauser) syndrome: congenital absence of uterus and upper vagina, normal 46,XX karyotype, normal ovaries (normal oestrogen → normal secondary sexual characteristics), primary amenorrhoea. Second most common cause after gonadal dysgenesis. Treatment: vaginal dilators or surgical neovaginoplasty.",
  },
  {
    id: 316,
    subject: "OBG",
    stem: "Obstetric cholestasis (intrahepatic cholestasis of pregnancy) is characterised by:",
    options: [
      "Elevated transaminases + jaundice + pruritis in first trimester",
      "Intense pruritis (especially palms/soles) + elevated bile acids in third trimester",
      "Nausea + fatty liver + elevated ammonia",
      "Jaundice + haemolysis + low platelets in second trimester",
    ],
    answer: 1,
    explanation:
      "Obstetric cholestasis: intense pruritus (worse at night, palms/soles) + elevated serum bile acids (>10 μmol/L; severe >40 μmol/L) in late pregnancy (3rd trimester). Associated with increased risk of stillbirth and preterm delivery. Treat with ursodeoxycholic acid. Delivery by 37-38 weeks recommended.",
  },

  // ─── PAEDIATRICS EXTENDED (317–328) ──────────────────────────────────────
  {
    id: 317,
    subject: "Paediatrics",
    stem: "The MUAC (mid-upper arm circumference) cutoff for severe acute malnutrition (SAM) in children aged 6-59 months is:",
    options: ["<13.5 cm", "<12.5 cm", "<11.5 cm", "<10.5 cm"],
    answer: 1,
    explanation:
      "WHO SAM criteria: MUAC <11.5 cm (severe) — requires therapeutic feeding (F-75 then F-100 or RUTF). MUAC 11.5-12.5 = moderate acute malnutrition (MAM) — supplementary feeding. MUAC >12.5 = normal. MUAC is independent of age (6-59 months), easy to use in field settings. WHZ <-3 also defines SAM.",
  },
  {
    id: 318,
    subject: "Paediatrics",
    stem: "The radiological sign of Tetralogy of Fallot on chest X-ray is:",
    options: ["Snowman (figure of 8) appearance", "Boot-shaped heart (coeur en sabot)", "Egg-on-side appearance", "Cardiomegaly with pulmonary plethora"],
    answer: 1,
    explanation:
      "Tetralogy of Fallot (VSD + pulmonary stenosis + overriding aorta + RVH): boot-shaped heart on CXR due to RVH + concave main pulmonary artery segment, with decreased pulmonary vascularity. 'Snowman' sign = TAPVR. 'Egg on side' = TGA. Tet spells: hypercyanotic episodes — knee-chest position + morphine + O2.",
  },
  {
    id: 319,
    subject: "Paediatrics",
    stem: "The developmental milestone 'walking independently without support' is typically achieved at:",
    options: ["9 months", "12 months", "15 months", "18 months"],
    answer: 1,
    explanation:
      "Gross motor milestones: rolls over at 4-5 months, sits unsupported at 6 months, crawls at 8-9 months, pulls to stand at 9-10 months, walks with support at 11-12 months, walks independently at 12-15 months (average 12-13 months). Concern if not walking by 18 months.",
  },
  {
    id: 320,
    subject: "Paediatrics",
    stem: "RDS (Respiratory Distress Syndrome) in preterm neonates is due to deficiency of:",
    options: ["Oxygen delivery", "Pulmonary vasodilation", "Surfactant (dipalmitoylphosphatidylcholine, DPPC)", "Alveolar macrophages"],
    answer: 2,
    explanation:
      "Neonatal RDS: surfactant deficiency → high surface tension → alveolar collapse at end-expiration. Type II pneumocytes produce surfactant (DPPC main component) — matures after 36 weeks. Prevention: antenatal corticosteroids (betamethasone 12mg IM ×2 doses, 24h apart); Treatment: exogenous surfactant (poractant alfa/beractant) via intratracheal administration.",
  },
  {
    id: 321,
    subject: "Paediatrics",
    stem: "The earliest feature of vitamin D deficiency (rickets) on X-ray is:",
    options: ["Genu valgum", "Cupping and fraying of the metaphysis", "Looser's zones", "Subperiosteal new bone formation"],
    answer: 1,
    explanation:
      "Nutritional rickets X-ray changes: cupping + fraying + splaying of metaphysis (widened, ragged metaphyseal zone — especially distal radius and ulna). Later: genu valgum/varum, codfish vertebrae, Looser's zones (pseudofractures). Clinical: craniotabes, rachitic rosary, Harrison's sulcus, frontal bossing.",
  },
  {
    id: 322,
    subject: "Paediatrics",
    stem: "Hirschsprung's disease (congenital megacolon) is caused by absence of:",
    options: [
      "Goblet cells in the colon",
      "Ganglion cells (Auerbach's and Meissner's plexuses) in the distal colon",
      "Muscularis propria in the sigmoid",
      "Circular smooth muscle in the rectum",
    ],
    answer: 1,
    explanation:
      "Hirschsprung's disease: absence of ganglion cells (neural crest migration failure) in Meissner's (submucosal) and Auerbach's (myenteric) plexuses → aganglionic segment cannot relax → functional obstruction. Presentation: delayed passage of meconium (>48h), abdominal distension. Diagnosis: rectal biopsy (absence of ganglion cells). Treat: Swenson/Soave pull-through operation.",
  },
  {
    id: 323,
    subject: "Paediatrics",
    stem: "The vaccine given at birth in India under UIP includes:",
    options: ["BCG + OPV + DPT", "BCG + OPV + Hepatitis B", "BCG + IPV + Hepatitis B", "OPV + Hepatitis B only"],
    answer: 1,
    explanation:
      "UIP schedule at birth: BCG (0.05 mL ID, right deltoid region), OPV (zero dose, 2 drops oral), Hepatitis B (0.5 mL IM, within 24 hours of birth). DPT starts at 6 weeks. IPV (inactivated polio) was added to UIP from 2015 but OPV continues. Hepatitis B birth dose prevents perinatal transmission.",
  },
  {
    id: 324,
    subject: "Paediatrics",
    stem: "The specific gravity of neonatal CSF is lower than adult CSF. Normal CSF protein in neonates is:",
    options: ["10-45 mg/dL (same as adults)", "20-170 mg/dL", "200-300 mg/dL", "<5 mg/dL"],
    answer: 1,
    explanation:
      "Neonatal CSF: protein 20-170 mg/dL (higher than adults due to immature blood-brain barrier); glucose 34-119 mg/dL; WBC ≤30 cells/μL (more acceptable than adult <5). Preterm neonates have even higher protein. Neonatal bacterial meningitis: often presents non-specifically — temperature instability, poor feeding, bulging fontanelle, seizures.",
  },
  {
    id: 325,
    subject: "Paediatrics",
    stem: "The most common cause of stridor in a neonate is:",
    options: ["Subglottic stenosis", "Laryngeal web", "Laryngomalacia", "Tracheomalacia"],
    answer: 2,
    explanation:
      "Laryngomalacia (floppy larynx): most common cause of stridor in neonates and infants (~60% of cases). Characteristic: inspiratory stridor, worse in supine position, relieved by prone position, exacerbated by crying. Arytenoid cartilage/epiglottis collapses during inspiration. Usually resolves by 18-24 months. Rarely needs supraglottoplasty.",
  },
  {
    id: 326,
    subject: "Paediatrics",
    stem: "The DOC for whooping cough (pertussis) is:",
    options: ["Ampicillin", "Erythromycin/Azithromycin", "Cotrimoxazole", "Cefuroxime"],
    answer: 1,
    explanation:
      "Whooping cough (Bordetella pertussis): azithromycin (5 days) or erythromycin (14 days) is the DOC — reduces infectivity and severity if given early (catarrhal phase). If given in paroxysmal phase, reduces transmission but may not shorten illness. DTaP vaccination is the key preventive strategy.",
  },
  {
    id: 327,
    subject: "Paediatrics",
    stem: "The characteristic ECG finding in hypertrophic cardiomyopathy (HCM) is:",
    options: ["Prolonged QT interval", "Deep Q waves in lateral leads and LVH", "Wolff-Parkinson-White pattern (delta wave)", "Complete right bundle branch block"],
    answer: 1,
    explanation:
      "HCM ECG: LVH + deep narrow Q waves in inferior and lateral leads (pseudoinfarct pattern due to septal depolarisation), ST/T wave changes. ECG is abnormal in ~90%. HCM = most common cause of sudden cardiac death in young athletes. Obstructive HCM treated with beta-blockers; alcohol septal ablation; surgical myomectomy.",
  },
  {
    id: 328,
    subject: "Paediatrics",
    stem: "The APGAR score of a neonate showing: blue body (acrocyanotic), HR 80/min, grimace to stimulation, some flexion, weak cry — is:",
    options: ["4", "5", "6", "7"],
    answer: 1,
    explanation:
      "APGAR scoring: Appearance (body blue, peripheral blue = acrocyanosis) = 1; Pulse (HR 80, i.e., <100/min) = 1; Grimace (grimace only, not vigorous cough/sneeze) = 1; Activity (some flexion, not active flexion) = 1; Respiration (weak cry, not vigorous) = 1. Total = 1+1+1+1+1 = 5. Score 4-6 = moderate depression — requires stimulation and supplemental oxygen.",
  },

  // ─── PSM/COMMUNITY MEDICINE EXTENDED (329–340) ───────────────────────────
  {
    id: 329,
    subject: "PSM/Community Medicine",
    stem: "The MMR (Maternal Mortality Ratio) of India as per SRS 2018-20 is:",
    options: ["57 per 100,000 live births", "97 per 100,000 live births", "113 per 100,000 live births", "167 per 100,000 live births"],
    answer: 1,
    explanation:
      "SRS (Sample Registration System) 2018-20: India MMR = 97 per 100,000 live births (SDG target <70 by 2030). Lowest: Kerala (19), Maharashtra (33). Highest: Assam (195), Madhya Pradesh (175). UN SDG Goal 3.1: reduce global MMR to <70 by 2030. India's MMR has been declining (254 in 2004-06 → 97 in 2018-20).",
  },
  {
    id: 330,
    subject: "PSM/Community Medicine",
    stem: "The Wilson-Jungner criteria for evaluating a disease for population screening include all EXCEPT:",
    options: [
      "The disease should be an important health problem",
      "There should be a recognisable early or latent stage",
      "The screening test should be 100% specific",
      "Treatment in the early stage should be more effective than at late stage",
    ],
    answer: 2,
    explanation:
      "Wilson-Jungner (1968) criteria for screening: important health problem; recognisable latent stage; accepted treatment exists; facilities for diagnosis and treatment available; suitable test exists (acceptable, reliable); natural history understood; agreed policy on who to treat; cost-benefit acceptable; continuous case-finding. No criterion requires 100% specificity.",
  },
  {
    id: 331,
    subject: "PSM/Community Medicine",
    stem: "Number Needed to Treat (NNT) is calculated as:",
    options: ["1 / Absolute Risk Increase", "1 / Absolute Risk Reduction (ARR)", "Relative Risk - 1", "1 / Relative Risk Reduction"],
    answer: 1,
    explanation:
      "NNT = 1/ARR (absolute risk reduction). ARR = Control event rate - Treatment event rate. Small NNT = more effective treatment. Example: ARR 5% → NNT = 20 (treat 20 patients to prevent 1 event). NNT is dependent on baseline risk (unlike RRR). NNH (Number Needed to Harm) = 1/ARI.",
  },
  {
    id: 332,
    subject: "PSM/Community Medicine",
    stem: "The PHC (Primary Health Centre) in India serves a population of approximately:",
    options: ["5,000 (hilly/tribal) and 10,000 (plains)", "20,000 (hilly) and 30,000 (plains)", "30,000 (hilly) and 50,000 (plains)", "100,000 (uniform)"],
    answer: 1,
    explanation:
      "PHC norms (IPHS 2022): serves 20,000 population in hilly/tribal areas and 30,000 in plains. Has 1 medical officer (MBBS). Sub-centre serves 3,000 (hilly) or 5,000 (plains) with 1 ANM. CHC (Community Health Centre) serves 80,000-120,000 population with 4 specialists (surgeon, physician, obstetrician, paediatrician).",
  },
  {
    id: 333,
    subject: "PSM/Community Medicine",
    stem: "The relative risk (RR) is the appropriate measure of association in which study design?",
    options: ["Case-control study", "Cross-sectional study", "Cohort study", "Randomised controlled trial"],
    answer: 2,
    explanation:
      "Relative Risk (RR) = risk in exposed / risk in unexposed. Used in cohort studies and RCTs where incidence can be measured directly. Odds Ratio (OR) is used in case-control studies (cannot calculate incidence). OR approximates RR when outcome is rare (<10%). In cross-sectional: prevalence ratio or OR.",
  },
  {
    id: 334,
    subject: "PSM/Community Medicine",
    stem: "The Total Fertility Rate (TFR) of India as per NFHS-5 (2019-21) is:",
    options: ["1.8", "2.0", "2.2", "2.8"],
    answer: 1,
    explanation:
      "NFHS-5 (2019-21) TFR: India = 2.0 (replacement level is 2.1). First time India has reached near replacement TFR nationally. TFR <2 in: Kerala (1.8), Tamil Nadu (1.8), Telangana (1.7), Sikkim (1.1). TFR still >2 in: Bihar (2.98), Meghalaya (2.9), UP (2.35). India's TFR declining from 3.4 (NFHS-1, 1992-93).",
  },
  {
    id: 335,
    subject: "PSM/Community Medicine",
    stem: "The positive predictive value (PPV) of a diagnostic test depends primarily on:",
    options: ["Sensitivity of the test alone", "Specificity of the test alone", "Both sensitivity and specificity, and prevalence of the disease", "Sample size of the study"],
    answer: 2,
    explanation:
      "PPV = TP/(TP+FP). PPV depends on: test sensitivity + specificity + PREVALENCE. In low-prevalence disease (rare disease), even a highly specific test has low PPV (many false positives). Sensitivity = doesn't miss disease; Specificity = doesn't falsely label healthy. PPV rises with increasing prevalence.",
  },
  {
    id: 336,
    subject: "PSM/Community Medicine",
    stem: "The index case (or 'case zero') in epidemiology refers to:",
    options: [
      "The most severe case in an outbreak",
      "The first identified/index case that brings the outbreak to attention",
      "The source case from whom all others were infected",
      "The case with the highest secondary attack rate",
    ],
    answer: 1,
    explanation:
      "Index case = the first identified case in a defined setting (brings the outbreak to the attention of public health authorities). Primary case = person who introduces disease into a defined population. Secondary cases = cases arising from exposure to the primary case. Not synonymous terms.",
  },
  {
    id: 337,
    subject: "PSM/Community Medicine",
    stem: "Which elimination target has India achieved for malaria in terms of Annual Parasite Incidence (API)?",
    options: [
      "API <5 per 1000 population (elimination threshold)",
      "API <1 per 1000 population",
      "Zero indigenous cases",
      "API <10 per 1000 population",
    ],
    answer: 1,
    explanation:
      "India achieved API <1 per 1000 population (WHO pre-elimination threshold) in 2020-21. National Framework for Malaria Elimination (NFME) 2016-30: eliminate malaria from 27 states/UTs by 2022, malaria-free India by 2030. P. falciparum proportion increasing (>50%) as P. vivax declines.",
  },
  {
    id: 338,
    subject: "PSM/Community Medicine",
    stem: "The Integrated Management of Neonatal and Childhood Illness (IMNCI) strategy classifies a child as having 'very severe disease' if which feature is present?",
    options: [
      "Fast breathing alone",
      "Chest indrawing alone",
      "General danger signs (not able to drink, convulsions, lethargy)",
      "Fever for 2 days",
    ],
    answer: 2,
    explanation:
      "IMNCI general danger signs (any = 'very severe'): not able to drink or breastfeed; vomits everything; convulsions now or during illness; lethargic or unconscious. IMNCI also classifies pneumonia, diarrhoea, malaria, ear problems, nutritional status. Trained health workers assess these in children 2 months-5 years.",
  },
  {
    id: 339,
    subject: "PSM/Community Medicine",
    stem: "Case fatality rate (CFR) is defined as:",
    options: [
      "Number of deaths / total population at risk × 100",
      "Number of deaths from disease / total number of cases of that disease × 100",
      "Number of deaths / total deaths from all causes × 100",
      "Number of deaths in a year / mid-year population × 1000",
    ],
    answer: 1,
    explanation:
      "CFR (%) = number of deaths from a specific disease / number of confirmed cases × 100. Measures disease severity (lethality). E.g., COVID-19 CFR ~1-3%. Differs from mortality rate (which uses total population denominator). High CFR = highly lethal disease (even if rare); low CFR but high incidence = still high mortality.",
  },
  {
    id: 340,
    subject: "PSM/Community Medicine",
    stem: "The Standardised Mortality Ratio (SMR) is used to:",
    options: [
      "Compare crude death rates between populations",
      "Compare observed deaths in a study population to expected deaths (if same age-specific rates as standard population)",
      "Measure mortality in clinical trials",
      "Calculate age-specific mortality rates",
    ],
    answer: 1,
    explanation:
      "SMR = (observed deaths / expected deaths) × 100. SMR >100 = higher mortality than reference population; <100 = lower. Used in occupational health (e.g., SMR for lung cancer in asbestos workers vs general population) and cohort studies with indirect standardisation. Accounts for age differences between populations.",
  },

  // ─── FORENSIC MEDICINE EXTENDED (341–350) ────────────────────────────────
  {
    id: 341,
    subject: "Forensic Medicine",
    stem: "The NDPS (Narcotic Drugs and Psychotropic Substances) Act 1985 classifies drug offences. What is the maximum imprisonment for 'commercial quantity' of heroin?",
    options: ["7 years", "10 years", "Life imprisonment with fine", "Death penalty"],
    answer: 2,
    explanation:
      "NDPS Act 1985: commercial quantity offences = rigorous imprisonment of 10-20 years (or life imprisonment for repeat offenders) + fine ≥₹1-2 lakh. Heroin commercial quantity = >250g; small quantity ≤5g. Death penalty only for repeat offenders convicted of commercial quantity offences. 2021 Amendment: bail for small quantity possession after 6 months if no charge sheet.",
  },
  {
    id: 342,
    subject: "Forensic Medicine",
    stem: "Thanatology is the scientific study of:",
    options: ["Wounds and injuries", "Death and dying", "Poisons and toxicology", "Sexual offences"],
    answer: 1,
    explanation:
      "Thanatology (from Greek Thanatos = death) is the scientific study of death and dying — its causes, mechanisms, and processes. Encompasses forensic pathology, palliative care perspectives, and medico-legal aspects. Includes signs of death (early: cooling, lividity, rigor; late: decomposition, adipocere, mummification).",
  },
  {
    id: 343,
    subject: "Forensic Medicine",
    stem: "Post-mortem lividity (livor mortis) becomes fixed (non-blanching) after approximately:",
    options: ["2-4 hours", "6-8 hours", "12-16 hours", "24 hours"],
    answer: 2,
    explanation:
      "Livor mortis (hypostasis): blood pools in dependent parts. Appears 2-4 hours; fully developed 6-12 hours; FIXED (cannot be shifted by position change) 12-16 hours. Fixed lividity is crucial in forensic practice — if lividity pattern does not match final body position, body was moved after 12-16 hours post-mortem.",
  },
  {
    id: 344,
    subject: "Forensic Medicine",
    stem: "The IPC section dealing with causing grievous hurt by act endangering life or personal safety is:",
    options: ["IPC 319", "IPC 320", "IPC 322", "IPC 325"],
    answer: 3,
    explanation:
      "IPC 319 = simple hurt definition; IPC 320 = grievous hurt (8 types: emasculation, permanent loss of eye/ear/joint/limb, permanent disability, life-endangering hurt, severe pain >20 days, fracture, burn/disfigurement); IPC 322 = voluntarily causing grievous hurt; IPC 325 = punishment for voluntarily causing grievous hurt (7 years + fine).",
  },
  {
    id: 345,
    subject: "Forensic Medicine",
    stem: "The consent required before performing a non-therapeutic medical procedure on a mentally competent adult patient should be:",
    options: ["Expressed or implied", "Only implied", "Only expressed and informed", "Compulsory in writing for all procedures"],
    answer: 2,
    explanation:
      "For non-therapeutic procedures (and all significant medical/surgical procedures), informed expressed consent is required — patient must understand the procedure, risks, alternatives, and benefits. Implied consent applies to emergency/unconscious patients. Written consent is best practice but not legally mandatory for ALL procedures — verbal expressed consent is valid.",
  },
  {
    id: 346,
    subject: "Forensic Medicine",
    stem: "The cause of death in hanging is primarily due to:",
    options: ["Asphyxia from tracheal obstruction alone", "Fracture-dislocation of cervical spine (in judicial hanging) or venous obstruction + carotid compression", "Anoxia from carotid artery occlusion alone", "Cardiac arrest from vagal stimulation"],
    answer: 1,
    explanation:
      "Mechanism of death in hanging: (1) Judicial/long-drop hanging: fracture-dislocation C2-C3 → transection of spinal cord → instantaneous death; (2) Suicidal/accidental (short drop): combination of venous obstruction (jugular veins), carotid compression, airway obstruction, vagal inhibition. Petechial haemorrhages in eyes/face = sign of asphyxia.",
  },
  {
    id: 347,
    subject: "Forensic Medicine",
    stem: "The Supreme Court landmark judgment in Aruna Shanbaug case (2011) addressed:",
    options: ["Medical negligence standards", "Passive euthanasia and withdrawal of life support", "Consent in emergency surgery", "Organ transplantation ethics"],
    answer: 1,
    explanation:
      "SC 2011 (Aruna Shanbaug vs Union of India): permitted passive euthanasia (withdrawal of life support) with conditions — close relatives/guardian petition to High Court, two medical boards examine, HC bench of 2 judges must approve. Active euthanasia remains illegal. SC 2018 (Common Cause vs UOI): advance directives (living wills) upheld with guidelines.",
  },
  {
    id: 348,
    subject: "Forensic Medicine",
    stem: "In firearm injuries, the presence of blackening, tattooing, and singeing around the wound indicates:",
    options: ["Exit wound", "Entry wound with distant range", "Entry wound at close/contact range", "Ricochet wound"],
    answer: 2,
    explanation:
      "Entry wound features: smaller, inverted edges, abrasion collar (ring of abrasion around entry). Close range/contact: blackening (soot), tattooing/stippling (unburnt powder), singeing, stellate laceration (from gas expansion). Distance >1 metre: only abrasion collar, no soot/tattooing. Exit wound: larger, everted edges, no abrasion collar (usually).",
  },
  {
    id: 349,
    subject: "Forensic Medicine",
    stem: "Tardieu's spots are subpleural petechial haemorrhages seen in:",
    options: ["Traumatic asphyxia", "All forms of mechanical asphyxia", "Carbon monoxide poisoning", "Strangulation specifically"],
    answer: 1,
    explanation:
      "Tardieu's spots: minute subpleural/subpericardial/subconjunctival petechiae from capillary rupture due to increased venous pressure during asphyxia. Seen in all forms of mechanical asphyxia (hanging, strangulation, smothering, drowning, throttling). Size varies from pin-point to 2-3mm. NOT specific to one type of asphyxia.",
  },
  {
    id: 350,
    subject: "Forensic Medicine",
    stem: "The Consumer Protection Act 2019 applies to medical services. A complaint can be filed within how many years of the cause of action?",
    options: ["1 year", "2 years", "3 years", "5 years"],
    answer: 1,
    explanation:
      "Consumer Protection Act 2019 (replaces 1986 Act): medical services are included (Supreme Court 1995: Indian Medical Association vs V.P. Shanta). Limitation: complaint must be filed within 2 years of cause of action (with power to condone delay if sufficient cause shown). District commission: up to ₹50 lakh; State: ₹50 lakh-₹2 crore; National: >₹2 crore.",
  },

  // ─── MICROBIOLOGY EXTENDED (351–362) ─────────────────────────────────────
  {
    id: 351,
    subject: "Microbiology",
    stem: "MRSA (methicillin-resistant Staphylococcus aureus) is treated with:",
    options: ["Cloxacillin", "Amoxicillin-clavulanate", "Vancomycin or Linezolid", "Ceftriaxone"],
    answer: 2,
    explanation:
      "MRSA: resistance via mecA gene encoding PBP2a (low affinity for all beta-lactams). Treatment: vancomycin (IV, drug of choice for serious infections), linezolid, daptomycin, or teicoplanin. Community-acquired MRSA (CA-MRSA): often susceptible to cotrimoxazole, clindamycin. Tigecycline for complicated skin/soft tissue infections.",
  },
  {
    id: 352,
    subject: "Microbiology",
    stem: "HBsAg persists >6 months, HBeAg positive, high HBV DNA, elevated ALT — this represents which phase of chronic HBV infection?",
    options: ["Immune tolerant phase", "Immune clearance (HBeAg-positive hepatitis) phase", "Inactive carrier state", "HBeAg-negative hepatitis phase"],
    answer: 1,
    explanation:
      "Immune clearance phase (HBeAg-positive hepatitis): HBsAg+, HBeAg+, high HBV DNA (>2×10⁴ IU/mL), elevated ALT, active necroinflammation — liver is being damaged. Immune tolerant: high DNA but NORMAL ALT (no liver damage). Inactive carrier: low/undetectable HBV DNA, normal ALT, anti-HBe positive. Treatment indicated in immune clearance phase.",
  },
  {
    id: 353,
    subject: "Microbiology",
    stem: "The HIV WHO clinical staging that corresponds to CDC Stage C (AIDS) is:",
    options: ["WHO Stage 1", "WHO Stage 2", "WHO Stage 3", "WHO Stage 4"],
    answer: 3,
    explanation:
      "WHO HIV Stage 4 = AIDS-defining conditions (= CDC Stage C): Pneumocystis pneumonia, cerebral toxoplasmosis, cryptococcal meningitis, cytomegalovirus retinitis, disseminated MAC, HIV wasting syndrome, HIV encephalopathy, CD4 <200 cells/μL typically. ART is initiated at any CD4 count (treat all) per 2016 WHO guidelines.",
  },
  {
    id: 354,
    subject: "Microbiology",
    stem: "Which Plasmodium species causes 'malignant tertian malaria' with the highest mortality?",
    options: ["P. vivax", "P. malariae", "P. ovale", "P. falciparum"],
    answer: 3,
    explanation:
      "P. falciparum = malignant tertian malaria (fever every 48h, but irregular). Most lethal due to: cytoadherence (infected RBCs stick to cerebral vessels → cerebral malaria), rosetting, all RBC stages infected (unlike P. vivax which only infects reticulocytes). Treatment: artemisinin combination therapy (ACT) e.g., artesunate + amodiaquine/mefloquine. IV artesunate for severe malaria.",
  },
  {
    id: 355,
    subject: "Microbiology",
    stem: "The CLO (Campylobacter-Like Organism) test detects H. pylori by detecting:",
    options: ["Lipase activity", "Catalase activity", "Urease activity", "Oxidase activity"],
    answer: 2,
    explanation:
      "CLO test (rapid urease test): biopsy placed in urea-containing gel. H. pylori urease converts urea to NH₃ (ammonia) → pH rises → colour change to pink/red = positive. Sensitivity 90-95%, specificity >95%. Result in 1-24 hours. False negative: recent PPI/antibiotic use. Urea breath test (UBT) and stool antigen are non-invasive alternatives.",
  },
  {
    id: 356,
    subject: "Microbiology",
    stem: "The ELISA test for HIV detects:",
    options: ["HIV DNA", "HIV p24 antigen only (4th gen)", "HIV antibodies (3rd gen) or both antigen and antibodies (4th gen)", "HIV RNA viral load"],
    answer: 2,
    explanation:
      "3rd generation HIV ELISA: detects HIV IgG antibodies (window period ~4 weeks). 4th generation (combination antigen/antibody): detects p24 antigen + antibodies (window period reduced to ~2-3 weeks). 5th generation: differentiates HIV-1 vs HIV-2. Confirmatory test: Western blot or HIV RNA PCR. NACO guidelines in India: 3 ELISA tests with different antigens for confirmation.",
  },
  {
    id: 357,
    subject: "Microbiology",
    stem: "Koplik's spots, Forchheimer spots, Nagayama spots are associated with measles, rubella, and exanthem subitum (HHV-6) respectively. The causative virus of exanthem subitum is:",
    options: ["Paramyxovirus", "Togavirus (Rubivirus)", "Human herpesvirus 6 (HHV-6)", "Parvovirus B19"],
    answer: 2,
    explanation:
      "Exanthem subitum (roseola infantum): HHV-6 (Human Herpesvirus 6), rarely HHV-7. Peak age 6-18 months. High fever for 3-5 days → sudden defervescence → rose-pink maculopapular rash on trunk. Nagayama spots (small erythematous papules on soft palate/uvula). Rubella: togavirus, Forchheimer spots (petechiae on soft palate). Parvovirus B19: slapped-cheek disease (erythema infectiosum).",
  },
  {
    id: 358,
    subject: "Microbiology",
    stem: "Gram stain of CSF in bacterial meningitis shows gram-negative diplococci. The most likely causative organism is:",
    options: ["Haemophilus influenzae", "Neisseria meningitidis", "Streptococcus pneumoniae", "Listeria monocytogenes"],
    answer: 1,
    explanation:
      "Gram-negative diplococci (coffee-bean shaped) in CSF = Neisseria meningitidis (meningococcus). Gram-positive diplococci (lancet-shaped) = S. pneumoniae. Gram-negative coccobacilli = H. influenzae. Gram-positive rods = Listeria monocytogenes (elderly, immunocompromised, pregnant). N. meningitidis: petechiae/purpura, Waterhouse-Friderichsen syndrome. Treatment: ceftriaxone; chemoprophylaxis: rifampicin/ciprofloxacin.",
  },
  {
    id: 359,
    subject: "Microbiology",
    stem: "The organism associated with 'rice-water stools' and comma-shaped gram-negative rods is:",
    options: ["Shigella dysenteriae", "Vibrio cholerae", "Campylobacter jejuni", "Enterotoxigenic E. coli"],
    answer: 1,
    explanation:
      "Vibrio cholerae: comma-shaped (vibrio) gram-negative rods, oxidase positive. Produces cholera toxin (ADP-ribosylates Gs → permanent activation → massive cAMP → Cl⁻ secretion → rice-water stools). O1 and O139 serogroups cause epidemic cholera. Treatment: ORS + tetracycline/doxycycline. Dark-field microscopy: 'shooting stars' motility.",
  },
  {
    id: 360,
    subject: "Microbiology",
    stem: "The most common opportunistic infection in HIV patients in India is:",
    options: ["PCP (Pneumocystis pneumonia)", "Tuberculosis (Mycobacterium tuberculosis)", "Cryptococcal meningitis", "CMV retinitis"],
    answer: 1,
    explanation:
      "In India (and other high-TB-burden countries), tuberculosis is the most common opportunistic infection in HIV patients — ~40% of HIV patients develop TB. Globally (in developed nations), PCP is more common. HIV-TB co-infection: start ART within 2-4 weeks of TB treatment (if CD4 <50 cells/μL within 2 weeks). ART + ATT → immune reconstitution inflammatory syndrome (IRIS) risk.",
  },
  {
    id: 361,
    subject: "Microbiology",
    stem: "The heterophile antibody test (Monospot/Paul-Bunnell test) is used to diagnose:",
    options: ["CMV mononucleosis", "EBV infectious mononucleosis", "Toxoplasmosis", "HIV acute seroconversion"],
    answer: 1,
    explanation:
      "Paul-Bunnell/Monospot test: detects IgM heterophile antibodies (agglutinate sheep/horse red cells) in EBV infectious mononucleosis. Sensitivity 85-90%, specificity 95% after 1st week. False negative in young children (<4 years) and early illness. EBV = Epstein-Barr virus: tonsillopharyngitis, splenomegaly, atypical lymphocytes (Downey cells), lymphadenopathy. Ampicillin → rash in IM.",
  },
  {
    id: 362,
    subject: "Microbiology",
    stem: "AFB (acid-fast bacilli) staining by Ziehl-Neelsen technique uses which counterstain?",
    options: ["Crystal violet", "Safranin", "Methylene blue", "Malachite green"],
    answer: 2,
    explanation:
      "ZN staining: (1) Carbol fuchsin (primary stain, heated = hot ZN) — mycobacteria retain red colour due to mycolic acid in cell wall; (2) 20% H₂SO₄ (acid decolouriser) — removes stain from non-acid-fast bacteria; (3) Methylene blue (counterstain) — non-acid-fast bacteria appear blue. AFB = red rods against blue background.",
  },

  // ─── BIOCHEMISTRY EXTENDED (243–252) ─────────────────────────────────────
  {
    id: 363,
    subject: "Biochemistry",
    stem: "In McArdle disease (GSD type V), the biochemical finding during forearm exercise test is:",
    options: [
      "Normal rise in lactate with no rise in ammonia",
      "No rise in lactate but normal rise in ammonia",
      "No rise in lactate and no rise in ammonia",
      "Normal rise in both lactate and ammonia",
    ],
    answer: 1,
    explanation:
      "Forearm exercise test in McArdle's (muscle phosphorylase deficiency): NO rise in venous lactate (cannot breakdown glycogen to glucose-1-phosphate → pyruvate → lactate), but normal rise in ammonia (AMP deaminase still active). Debranching enzyme deficiency: similar pattern. Myophosphorylase stain negative on muscle biopsy.",
  },
  {
    id: 364,
    subject: "Biochemistry",
    stem: "Which vitamin is required for the post-translational carboxylation of glutamate residues in clotting factors II, VII, IX, X?",
    options: ["Vitamin A", "Vitamin C", "Vitamin K", "Vitamin E"],
    answer: 2,
    explanation:
      "Vitamin K (phylloquinone/menaquinone) is required for gamma-carboxylation of glutamate → gla (gamma-carboxyglutamate) residues in factors II, VII, IX, X, and anticoagulant proteins C and S. This carboxylation enables Ca²⁺-mediated binding to phospholipid surfaces. Warfarin inhibits VKORC1 → blocks vitamin K recycling.",
  },
  {
    id: 365,
    subject: "Biochemistry",
    stem: "The key enzyme that is deficient in Pompe disease (GSD type II) is:",
    options: ["Muscle glycogen phosphorylase", "Glucose-6-phosphatase", "Acid alpha-glucosidase (acid maltase)", "Debranching enzyme"],
    answer: 2,
    explanation:
      "Pompe disease (GSD IIa): deficiency of lysosomal acid alpha-1,4-glucosidase (acid maltase/GAA) → glycogen accumulates in lysosomes of cardiac and skeletal muscle. Infantile form: cardiomegaly, hypotonia, respiratory failure, death by 2 years if untreated. Treatment: enzyme replacement therapy (alglucosidase alfa). GAA gene mutation on chromosome 17q25.",
  },
  {
    id: 366,
    subject: "Biochemistry",
    stem: "The enzyme that catalyses the rate-limiting step of de novo purine synthesis is:",
    options: ["HGPRT", "Adenylosuccinate lyase", "PRPP amidotransferase (glutamine phosphoribosylpyrophosphate amidotransferase)", "Xanthine oxidase"],
    answer: 2,
    explanation:
      "PRPP amidotransferase catalyses: PRPP + glutamine → PRA (5-phosphoribosylamine) — rate-limiting step of de novo purine synthesis. Inhibited by end-products AMP and GMP (feedback inhibition). Allopurinol → inhibits xanthine oxidase (last step: hypoxanthine → xanthine → uric acid). Febuxostat: non-purine XO inhibitor.",
  },
  {
    id: 367,
    subject: "Biochemistry",
    stem: "Niemann-Pick disease Type A is caused by deficiency of:",
    options: ["Glucocerebrosidase", "Sphingomyelinase", "Hexosaminidase A", "Alpha-galactosidase A"],
    answer: 1,
    explanation:
      "Niemann-Pick types A and B: sphingomyelinase deficiency → sphingomyelin accumulates in macrophages (foam cells). Type A: severe, neuropathic, cherry-red spot at macula (like Tay-Sachs), hepatosplenomegaly, death by age 3. Type B: less severe, no neurological involvement. Sphingomyelin also elevated in Niemann-Pick Type C (NPC1/2 cholesterol transport defect — different mechanism).",
  },
  {
    id: 368,
    subject: "Biochemistry",
    stem: "Tay-Sachs disease (GM2 gangliosidosis) is characterised by deficiency of:",
    options: ["Glucocerebrosidase", "Sphingomyelinase", "Hexosaminidase A (alpha subunit)", "Galactocerebrosidase"],
    answer: 2,
    explanation:
      "Tay-Sachs: hexosaminidase A (alpha subunit) deficiency → GM2 ganglioside accumulation → neurodegeneration. Features: progressive motor and mental deterioration, cherry-red spot at macula (50% of cases), exaggerated startle response, macrocephaly. Autosomal recessive; highest prevalence in Ashkenazi Jews. No hepatosplenomegaly (unlike Niemann-Pick or Gaucher's).",
  },
  {
    id: 369,
    subject: "Biochemistry",
    stem: "Insulin stimulates de novo fatty acid synthesis by activating which enzyme?",
    options: ["Hormone-sensitive lipase", "Carnitine palmitoyltransferase I (CPT-I)", "Acetyl-CoA carboxylase (ACC)", "Malonyl-CoA decarboxylase"],
    answer: 2,
    explanation:
      "Acetyl-CoA carboxylase (ACC): rate-limiting enzyme of fatty acid synthesis. Acetyl-CoA + CO₂ + ATP → malonyl-CoA. ACC activated by insulin (via dephosphorylation) and citrate; inhibited by glucagon/adrenaline (via phosphorylation, AMPK), malonyl-CoA product. Malonyl-CoA also inhibits CPT-I → prevents fatty acid oxidation (cannot synthesise and oxidise simultaneously).",
  },
  {
    id: 370,
    subject: "Biochemistry",
    stem: "AIP (Acute Intermittent Porphyria) presents with the classic triad of:",
    options: [
      "Photosensitivity + skin blistering + hypertrichosis",
      "Abdominal pain + neuropsychiatric features + dark urine (port-wine)",
      "Haemolytic anaemia + jaundice + splenomegaly",
      "Hepatocellular carcinoma + cirrhosis + elevated iron",
    ],
    answer: 1,
    explanation:
      "AIP (porphobilinogen deaminase deficiency): autosomal dominant, presents after puberty. Classic triad: abdominal pain (colicky, severe), neuropsychiatric features (psychosis, seizures, motor neuropathy), dark/port-wine urine (ALA + PBG in urine). No photosensitivity (unlike PCT). Precipitated by: drugs (barbiturates, sulphonamides, rifampicin, OCPs), alcohol, fasting, stress.",
  },
  {
    id: 371,
    subject: "Biochemistry",
    stem: "The Km of an enzyme is defined as the substrate concentration at which the reaction rate equals:",
    options: ["Maximum velocity (Vmax)", "Half of Vmax", "Zero", "Twice Vmax"],
    answer: 1,
    explanation:
      "Michaelis-Menten equation: V = Vmax[S] / (Km + [S]). Km = substrate concentration when V = Vmax/2. Low Km = high affinity for substrate (enzyme half-saturated at low [S]). High Km = low affinity. Km is constant regardless of enzyme concentration (unlike Vmax). Competitive inhibitor: increases apparent Km, Vmax unchanged.",
  },
  {
    id: 372,
    subject: "Biochemistry",
    stem: "The most abundant protein in human plasma is:",
    options: ["Immunoglobulin G", "Fibrinogen", "Albumin", "Alpha-2 macroglobulin"],
    answer: 2,
    explanation:
      "Albumin: most abundant plasma protein (~35-50 g/L, ~60% of total plasma protein). Functions: maintains oncotic pressure, transport (fatty acids, bilirubin, hormones, drugs), antioxidant (thiol groups). Synthesised in liver (halflife ~20 days). Hypoalbuminaemia: liver disease, nephrotic syndrome, malnutrition, acute phase response (negative acute-phase protein).",
  },

  // ─── PATHOLOGY EXTENDED (381–392) ────────────────────────────────────────
  {
    id: 381,
    subject: "Pathology",
    stem: "Congo red staining of amyloid shows which appearance under polarised light?",
    options: ["Green fluorescence", "Apple-green birefringence", "Yellow birefringence", "Red fluorescence"],
    answer: 1,
    explanation:
      "Amyloid: Congo red stain → salmon-pink colour under light microscopy → apple-green birefringence under POLARISED light (pathognomonic). Thioflavin T/S: fluorescent yellow-green (more sensitive). AL amyloid (primary): immunoglobulin light chains — plasma cell disorders; AA amyloid (secondary/reactive): serum amyloid A protein — chronic inflammatory diseases.",
  },
  {
    id: 382,
    subject: "Pathology",
    stem: "The histological timeline of acute MI: at 24 hours, the characteristic finding is:",
    options: ["No change visible", "Coagulative necrosis with neutrophil infiltration", "Macrophage infiltration with early granulation tissue", "Dense fibrous scar"],
    answer: 1,
    explanation:
      "MI histological timeline: 0-4h: no light microscopy change (early: wavy fibres, contraction bands); 4-12h: early coagulative necrosis, oedema; 12-24h: coagulative necrosis + neutrophil infiltration; 1-3 days: dead myocytes + PMNs; 3-7 days: macrophages begin; 1-2 weeks: granulation tissue + new capillaries; 2+ months: dense fibrous scar.",
  },
  {
    id: 383,
    subject: "Pathology",
    stem: "Membranous nephropathy is characterised on electron microscopy by:",
    options: ["Subendothelial deposits", "Mesangial deposits", "Subepithelial deposits and GBM spikes", "Linear IgG deposits"],
    answer: 2,
    explanation:
      "Membranous nephropathy: subepithelial immune complex deposits → GBM thickening with 'spikes' (seen on Jones silver stain). IF: granular IgG + C3 along GBM ('beaded' pattern). EM: subepithelial electron-dense deposits. Most common cause of nephrotic syndrome in non-diabetic adults. Primary: anti-PLA2R antibodies. Secondary: SLE, hepatitis B, malignancy, drugs.",
  },
  {
    id: 384,
    subject: "Pathology",
    stem: "Rapidly progressive glomerulonephritis (RPGN) is histologically characterised by:",
    options: ["Mesangial hypercellularity", "Membranous thickening", "Crescents in Bowman's space (>50% glomeruli)", "Focal segmental sclerosis"],
    answer: 2,
    explanation:
      "RPGN: crescents in Bowman's space (proliferation of parietal epithelial cells + macrophages) in >50% of glomeruli. Three types: Type I = anti-GBM (Goodpasture), Type II = immune complex (SLE, IgA, post-streptococcal), Type III = pauci-immune (ANCA-associated vasculitis — MPA, GPA). Treatment: plasmapheresis (Type I), immunosuppression (Type II/III).",
  },
  {
    id: 385,
    subject: "Pathology",
    stem: "The tumour suppressor gene mutated in >50% of all human cancers is:",
    options: ["Rb gene", "BRCA1", "p53 (TP53)", "APC"],
    answer: 2,
    explanation:
      "p53 (TP53) on chromosome 17p is mutated in >50% of all human cancers — the 'guardian of the genome.' p53 senses DNA damage → induces cell cycle arrest (p21/CIP1) or apoptosis (Bax). Loss → cells continue dividing with damaged DNA → malignant transformation. Li-Fraumeni syndrome = germline TP53 mutation.",
  },
  {
    id: 386,
    subject: "Pathology",
    stem: "Onion-skin periosteal reaction on X-ray is characteristic of:",
    options: ["Osteosarcoma", "Chondrosarcoma", "Ewing's sarcoma", "Giant cell tumour"],
    answer: 2,
    explanation:
      "Ewing's sarcoma: onion-skin (lamellated) periosteal reaction on X-ray + soft tissue mass + diaphysis of long bones. Most common in 5-20 years. t(11;22) — EWS-FLI1 fusion. CD99+ (membranous). Periosteal reaction in osteosarcoma = Codman's triangle (sunburst pattern in some). GCT: soap-bubble lesion, epiphysis.",
  },
  {
    id: 387,
    subject: "Pathology",
    stem: "Dystrophic calcification is seen in which condition?",
    options: ["Hyperparathyroidism", "Metastatic deposits with normal serum calcium", "Atherosclerotic plaques (with normal serum calcium)", "Hypervitaminosis D"],
    answer: 2,
    explanation:
      "Dystrophic calcification: calcium deposition in dead/dying/abnormal tissue (serum calcium NORMAL). Examples: atherosclerotic plaques, caseous TB necrosis, liquefactive necrosis, calcifying tumours (psammoma bodies). Metastatic calcification: calcium deposits in normal tissue due to hypercalcaemia (hyperparathyroidism, hypervitaminosis D, sarcoidosis).",
  },
  {
    id: 388,
    subject: "Pathology",
    stem: "The hallmark immunohistochemical marker distinguishing Hodgkin lymphoma (nodular sclerosis type) from other lymphomas is:",
    options: ["CD20+, CD15-, CD30-", "CD15+, CD30+, CD45-", "CD3+, CD8+", "CD19+, CD20+, CD10+"],
    answer: 1,
    explanation:
      "Classic Hodgkin lymphoma RS cells: CD15+, CD30+, CD45- (LCA negative). CD20 variable. CD45 negativity helps distinguish from NHL. Nodular lymphocyte-predominant HL (NLPHL): CD20+, CD45+, CD15-, CD30- (popcorn cells, different biology). BCL-2 positive in follicular lymphoma; TdT in lymphoblastic lymphoma.",
  },
  {
    id: 389,
    subject: "Pathology",
    stem: "Which type of hypersensitivity reaction is responsible for contact dermatitis (e.g., nickel allergy)?",
    options: ["Type I (IgE-mediated)", "Type II (Cytotoxic)", "Type III (Immune complex)", "Type IV (Delayed/cell-mediated)"],
    answer: 3,
    explanation:
      "Contact dermatitis (e.g., nickel, poison ivy, latex): Type IV (delayed-type hypersensitivity, DTH) — T-cell mediated, no antibodies involved. Antigen-presenting cells process allergen → sensitised T cells release cytokines → 48-72h after exposure. Type I: anaphylaxis, urticaria. Type II: Goodpasture, haemolytic transfusion reactions. Type III: serum sickness, SLE.",
  },
  {
    id: 390,
    subject: "Pathology",
    stem: "Warthin-Finkeldey giant cells (polykaryocytes) are pathognomonic of:",
    options: ["Herpes zoster", "Measles", "Mumps", "CMV infection"],
    answer: 1,
    explanation:
      "Warthin-Finkeldey giant cells: multinucleated syncytial giant cells with numerous nuclei in a 'grape cluster' pattern — pathognomonic of measles (rubeola). Found in lymphoid tissue (tonsils, appendix, lymph nodes) during prodromal phase. Multinucleated cells are also seen in herpes (Tzanck smear), but those have cowdry A inclusions.",
  },
  {
    id: 391,
    subject: "Pathology",
    stem: "The translocation associated with follicular lymphoma is:",
    options: ["t(14;18) — BCL2/IgH", "t(8;14) — c-MYC/IgH", "t(9;22) — BCR/ABL", "t(11;14) — BCL1/IgH"],
    answer: 0,
    explanation:
      "Follicular lymphoma: t(14;18)(q32;q21) — BCL2 gene moves next to IgH enhancer → BCL2 overexpression → anti-apoptotic → cells accumulate. Most common adult NHL in Western countries. CD10+, BCL2+, BCL6+. Indolent but incurable. Transformation to DLBCL (Richter transformation in CLL; in follicular lymphoma = histological transformation).",
  },
  {
    id: 392,
    subject: "Pathology",
    stem: "Foam cells (lipid-laden macrophages) are the hallmark of:",
    options: ["Fibrous plaque in atherosclerosis", "Fatty streak (earliest atherosclerotic lesion)", "Complex plaque with calcification", "Fibromuscular dysplasia"],
    answer: 1,
    explanation:
      "Fatty streak = earliest grossly visible atherosclerotic lesion: lipid-laden macrophages (foam cells) accumulated in the intima. Foam cells form when oxidised LDL is taken up by macrophages via scavenger receptors. Progress to fibrous plaque (smooth muscle + collagen + lipid core + foam cells + fibrous cap). Unstable plaques (thin cap) → rupture → ACS.",
  },

  // ─── ENT/OPHTHALMOLOGY EXTENDED (393–402) ────────────────────────────────
  {
    id: 393,
    subject: "ENT/Ophthalmology",
    stem: "The WHO trachoma grading classifies active trachoma based on follicular involvement. TF (trachomatous follicular inflammation) is defined as:",
    options: [
      "Intense inflammatory thickening obscuring deep vessels",
      "Five or more follicles ≥0.5mm on upper tarsal conjunctiva",
      "Trichiasis (inturned eyelashes)",
      "Corneal opacity directly affecting visual axis",
    ],
    answer: 1,
    explanation:
      "WHO FISTO trachoma grading: TF = ≥5 follicles on upper tarsal conjunctiva; TI = intense inflammation (>50% of deep vessels obscured); TS = tarsal conjunctival scarring; TT = trichiasis; CO = corneal opacity over pupil. TF + TI = active trachoma. SAFE strategy for control. Azithromycin single dose (1g adults, 20mg/kg children) or tetracycline eye ointment.",
  },
  {
    id: 394,
    subject: "ENT/Ophthalmology",
    stem: "The Ridley-Jopling classification of leprosy divides it into 5 types. The 'borderline tuberculoid' (BT) type is characterised by:",
    options: [
      "No bacilli (AFB index 0), high cell-mediated immunity",
      "Few (1-5) well-defined asymmetric lesions, few if any AFB",
      "Many lesions, widespread nerve involvement, moderate AFB",
      "Innumerable lesions, glove-and-stocking anaesthesia, AFB 5+",
    ],
    answer: 1,
    explanation:
      "Ridley-Jopling classification: TT (tuberculoid) → BT → BB (borderline) → BL → LL (lepromatous). BT: few well-defined hypopigmented/erythematous plaques (1-5), asymmetric, impaired sensation, few or no AFB (BI 0-1+), moderate CMI. WHO simplified: paucibacillary (≤5 patches) = TT/BT; multibacillary (>5) = BB/BL/LL. Lepromin test positive in TT/BT.",
  },
  {
    id: 395,
    subject: "ENT/Ophthalmology",
    stem: "Open angle glaucoma differs from acute angle-closure glaucoma in that open-angle glaucoma typically presents with:",
    options: [
      "Severe eye pain and redness",
      "Nausea, vomiting, halos around lights",
      "Insidious, asymptomatic peripheral visual field loss",
      "Corneal oedema with blurred vision",
    ],
    answer: 2,
    explanation:
      "Primary open-angle glaucoma (POAG): insidious, painless, progressive peripheral visual field loss (tunnel vision) — often detected late. Trabecular meshwork blocked but iridocorneal angle open. IOP typically >21 mmHg. Optic disc cupping (CDR >0.6). Acute angle-closure: dramatic presentation — severe pain, redness, mid-dilated fixed pupil, corneal oedema, halos. Emergency: pilocarpine + acetazolamide + mannitol.",
  },
  {
    id: 396,
    subject: "ENT/Ophthalmology",
    stem: "The gold standard investigation for diagnosing Ménière's disease is:",
    options: ["Audiometry alone", "MRI brain with gadolinium", "Electrocochleography (ECoG)", "Vestibular evoked myogenic potentials (VEMP)"],
    answer: 2,
    explanation:
      "Ménière's disease (endolymphatic hydrops): triad of episodic vertigo (lasting 20 min-12 hours) + fluctuating sensorineural hearing loss + tinnitus ± aural fullness. Electrocochleography (ECoG): summating potential/action potential (SP/AP) ratio >0.4 indicates endolymphatic hydrops. MRI (intratympanic gadolinium): visualises endolymph directly. Medical treatment: low-salt diet, diuretics, betahistine.",
  },
  {
    id: 397,
    subject: "ENT/Ophthalmology",
    stem: "Pseudomonas aeruginosa causes which type of otitis externa that is rapidly progressive and involves cartilage and bone?",
    options: ["Acute otitis externa", "Malignant (necrotising) otitis externa", "Otomycosis", "Bullous myringitis"],
    answer: 1,
    explanation:
      "Malignant (necrotising) otitis externa: P. aeruginosa infection in elderly diabetics or immunocompromised → aggressive infection spreading from EAC to skull base, mastoid, and cranial nerves (CN VII most common). Osteomyelitis of temporal bone. Granulation tissue at bony-cartilaginous junction. Treatment: prolonged anti-pseudomonal antibiotics (ciprofloxacin IV/oral) + surgical debridement.",
  },
  {
    id: 398,
    subject: "ENT/Ophthalmology",
    stem: "The most common cause of unilateral sensorineural hearing loss in young adults is:",
    options: ["Presbycusis", "Acoustic neuroma (vestibular schwannoma)", "CSOM with cholesteatoma", "Sudden SNHL"],
    answer: 1,
    explanation:
      "Acoustic neuroma (vestibular schwannoma): benign tumour of Schwann cells of CN VIII (usually superior vestibular nerve). Presents with unilateral progressive SNHL, tinnitus, +/- vertigo, absent caloric response, elevated acoustic reflex threshold. MRI with gadolinium: gold standard (ice-cream cone appearance in IAM). Treatment: microsurgery/radiosurgery. Bilateral = NF2.",
  },
  {
    id: 399,
    subject: "ENT/Ophthalmology",
    stem: "The most common nasal polyp is:",
    options: ["Antrochoanal polyp (Killian's polyp)", "Ethmoidal polyp (sinonasal polyp)", "Juvenile nasopharyngeal angiofibroma", "Inverted papilloma"],
    answer: 1,
    explanation:
      "Ethmoidal polyps (sinonasal polyps): most common, bilateral, multiple, arising from ethmoid sinuses, associated with allergic rhinitis, asthma, aspirin sensitivity (Samter's triad), chronic sinusitis, CF. Pale grey, insensate, smooth, sessile. Antrochoanal polyp (Killian's): unilateral, single, arising from maxillary antrum, common in young people/children. Treatment: endoscopic sinus surgery (FESS).",
  },
  {
    id: 400,
    subject: "ENT/Ophthalmology",
    stem: "Congenital cataract, if present, should ideally be operated by which age to prevent amblyopia?",
    options: ["At 1 year", "At 3 months (dense central cataract by 6-8 weeks)", "At 5 years", "Before school age (5-6 years)"],
    answer: 1,
    explanation:
      "Congenital dense unilateral cataract: must be operated within 6-8 weeks of birth (maximum by 3 months) to prevent deprivation amblyopia (irreversible visual cortex changes during critical period of visual development). Followed by aggressive optical correction (contact lens/spectacles) and occlusion therapy (patching fellow eye). Bilateral dense cataract: also urgent, within 6-10 weeks.",
  },
  {
    id: 401,
    subject: "ENT/Ophthalmology",
    stem: "The Schirmer's test is used to assess:",
    options: ["Corneal sensitivity", "Intraocular pressure", "Lacrimal (tear) secretion", "Visual field defects"],
    answer: 2,
    explanation:
      "Schirmer's test: strip of filter paper (5mm wide × 35mm long) folded at the notch (5mm) and placed in lower conjunctival fornix at junction of outer 1/3 and inner 2/3. Wetting after 5 minutes: >15mm (Schirmer I, no anaesthesia) = normal. <5mm = abnormal (dry eye/keratoconjunctivitis sicca). Sjögren's syndrome = primary dry eye + dry mouth.",
  },
  {
    id: 402,
    subject: "ENT/Ophthalmology",
    stem: "Ludwig's angina is a life-threatening condition originating from infection of which teeth?",
    options: ["Upper incisors", "Upper molars", "Lower second/third molars", "Lower premolars"],
    answer: 2,
    explanation:
      "Ludwig's angina: bilateral submandibular space infection (sublingual + submylohyoid + submaxillary spaces), most commonly from lower 2nd/3rd molar periapical abscess (roots below mylohyoid line). Rapidly spreading bilateral neck cellulitis → floor of mouth elevation, glottic oedema, airway compromise → death if untreated. Emergency: airway management (awake fibreoptic intubation/tracheostomy) + IV antibiotics + surgical drainage.",
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

