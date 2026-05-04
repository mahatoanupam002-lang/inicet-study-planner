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
];
