import React, { useState, useEffect, useMemo } from "react";
import { 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  StickyNote, 
  Activity, 
  Target,
  FileText,
  Calendar,
  BookOpen,
  Flag,
  Crosshair,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Map,
  ListChecks,
  Download
} from "lucide-react";

// --- CORE DATA ---
const EXAM_DATE = new Date("2026-05-16T09:00:00");

const PHASES = [
  { id: "blitz", label: "Blitz Pass", days: [1, 18], color: "#ff4d4d" },
  { id: "revision", label: "Rapid Revision", days: [19, 24], color: "#ffaa00" },
  { id: "mock", label: "Mock & Consolidate", days: [25, 28], color: "#00e5cc" },
];

const SUBJECTS = ["All","Medicine","Surgery","Pathology","Pharmacology","OBG","Paediatrics","PSM","Microbiology","Biochemistry","Forensic","Anatomy/Physio","Revision","Full Mock"];

const DAILY_BLOCKS = [
  { time:"6:00–9:00 AM", label:"New topic study (Marrow)" },
  { time:"9:00–10:00 AM", label:"MCQs on yesterday's topic" },
  { time:"10:00 AM–1:00 PM", label:"New topic continues" },
  { time:"1:00–2:00 PM", label:"Break + light review" },
  { time:"2:00–5:00 PM", label:"New topic study" },
  { time:"5:00–6:00 PM", label:"MCQs on today's topics" },
  { time:"6:00–8:00 PM", label:"'World of' revision notes" },
  { time:"8:00–9:00 PM", label:"India-specific one-liners" },
  { time:"9:00–10:00 PM", label:"Image review (15–20 images)" },
  { time:"10:00–11:00 PM", label:"Write 5 key high-yield points" },
];

const SCHEDULE = [
  { day:1, phase:"blitz", subject:"Medicine", color:"#ff4d4d", focus:"Cardiology", marrow:"Cardiology module — complete", topics:["Heart failure — Framingham criteria, NYHA, management ladder (ARNI, SGLT2i)","IHD — STEMI vs NSTEMI, thrombolytics, primary PCI window","Hypertension — ISH 2020, India HTN guidelines, resistant HTN definition","Rheumatic fever — Jones criteria (major + minor), penicillin prophylaxis","Cardiomyopathies — HCM, DCM, RCM key differentiators + management"], mcq:"Reflex: Cardiology 40 Qs. Target >80% accuracy.", india:"Rheumatic heart disease — highest burden in India among young adults. NFHS-5: CVD rising. Penicillin prophylaxis schedule: monthly benzathine penicillin for 10 years or till age 25.", images:"ECG: STEMI patterns (ST elevation by territory), LBBB, AF, complete heart block. Echo: HCM asymmetric septal hypertrophy, LVEF in DCM." },
  { day:2, phase:"blitz", subject:"Medicine", color:"#ff4d4d", focus:"Respiratory + Nephrology", marrow:"Respiratory + Nephrology modules", topics:["COPD — GOLD 2023 staging (spirometry-based), LABA/LAMA/ICS stepwise therapy","Asthma — GINA 2023 steps, severe acute asthma management, biologics (omalizumab)","TB — NTEP 2023 regimens, DR-TB (MDR/XDR), DOTS strategy, BCG efficacy","Nephrotic vs Nephritic — causes, protein loss, haematuria, complement levels","CKD — KDIGO staging, anaemia of CKD (EPO), dialysis indications, renal replacement"], mcq:"Reflex: Respiratory 30 Qs + Nephrology 20 Qs", india:"NTEP regimens: 2HRZE/4HR (DS-TB), BDQ+LZD+PA (DR-TB). India TB incidence: 210/100,000 (WHO 2023). PMDT programme. RNTCP → NTEP transition 2020.", images:"CXR: consolidation, pleural effusion, TB (apical, miliary, cavitation). Renal biopsy: IgA nephropathy mesangial deposits, MPGN tram-track." },
  { day:3, phase:"blitz", subject:"Medicine", color:"#ff4d4d", focus:"Neurology + Endocrinology", marrow:"Neurology + Endocrinology modules", topics:["Stroke — TOAST classification, tPA criteria (4.5hr window), NIHSS, thrombectomy","Epilepsy — ILAE 2017 classification, DOC per seizure type, status epilepticus Mx","Diabetes — ADA 2024 HbA1c targets, insulin types, DKA vs HHS management","Thyroid — hypothyroid (levothyroxine dosing), hyperthyroid (carbimazole/PTU), thyroid storm","Cushing's — ACTH-dependent vs independent, overnight dexamethasone suppression test"], mcq:"Reflex: Neurology 25 Qs + Endocrinology 25 Qs", india:"India diabetes burden: 101 million (IDF 2023, highest globally). Iodine deficiency — National IDD programme, salt iodization mandate. Goitre belt: sub-Himalayan region.", images:"CT brain: ischaemic stroke (hypodense), haemorrhagic (hyperdense), midline shift. MRI: MS plaques, Wallerian degeneration." },
  { day:4, phase:"blitz", subject:"Medicine", color:"#ff4d4d", focus:"GI + Haematology + Rheumatology", marrow:"GI + Haematology modules", topics:["Liver cirrhosis — Child-Pugh vs MELD scoring, variceal bleed (terlipressin + banding), SBP","IBD — Crohn's vs UC (key differences), biologics (infliximab, vedolizumab), complications","Anaemias — iron studies interpretation, thalassaemia (α vs β), Hb electrophoresis patterns","Leukaemias — ALL vs AML vs CML differentiators, blast percentage thresholds","SLE — SLICC 2012 criteria, anti-dsDNA, anti-Sm, complement levels, lupus nephritis class"], mcq:"Reflex: GI 20 Qs + Haematology 20 Qs + Rheumatology 10 Qs", india:"Sickle cell disease — highest in tribal India (Odisha, Chhattisgarh, Jharkhand). National Sickle Cell Anaemia Elimination Mission 2023 — target: eliminate by 2047.", images:"Peripheral smear: sickle cells, target cells, hypersegmented neutrophils, blast cells, Reed-Sternberg cells, ringed sideroblasts." },
  { day:5, phase:"blitz", subject:"Surgery", color:"#c77dff", focus:"GI Surgery + Hernias", marrow:"GI Surgery module", topics:["Surgical abdomen — appendicitis (Alvarado score), peritonitis, bowel obstruction management","Hernias — inguinal anatomy (Hesselbach triangle), direct vs indirect, Lichtenstein vs TEP/TAPP","Colorectal — Duke's vs TNM staging, FAP (APC gene), Lynch syndrome (MMR genes), CRC Mx","Hepatobiliary — cholelithiasis, CBD stones (Charcot triad, Reynolds pentad), cholangitis","Thyroid surgery — indications, RLN injury (hoarseness), post-op hypocalcaemia management"], mcq:"Reflex: GI Surgery 40 Qs", india:"Gallbladder carcinoma: highest incidence globally in North India (Gangetic belt — Varanasi, Patna). Salmonella typhi association. Surgical approach: radical cholecystectomy.", images:"AXR: free gas under diaphragm, fluid levels (SBO). CT abdomen: appendicitis (fat stranding), perforation, pancreatitis (CT severity index)." },
  { day:6, phase:"blitz", subject:"Surgery", color:"#c77dff", focus:"Trauma + Oncosurgery + Vascular", marrow:"Trauma + Breast + Vascular modules", topics:["ATLS — primary survey (ABCDE), shock classification (I–IV by blood loss volume)","Breast cancer — TNM staging, SLNB indications, MRM vs BCS, hormone receptor therapy","Head and neck — thyroid Ca (papillary = best prognosis, anaplastic = worst), parotid tumours","Peripheral vascular — ABI interpretation, critical limb ischaemia, AAA (>5.5cm surgery)","Burns — Wallace rule of 9s, Parkland formula (4ml/kg/%TBSA), escharotomy indications"], mcq:"Reflex: Trauma + Oncosurgery 40 Qs", india:"Oral cancer — India has 1/3 of global burden. Tobacco/betel nut (areca) etiology. OSCC most common. Surgical margins: 1cm minimum. Neck dissection types.", images:"CT chest: tension pneumothorax (mediastinal shift), haemothorax. Mammogram: spiculated mass, microcalcifications. Burn depth assessment photos." },
  { day:7, phase:"blitz", subject:"Pathology", color:"#fb8500", focus:"General Pathology + Haematopathology", marrow:"General Pathology + Haematopathology", topics:["Cell injury — reversible changes (cloudy swelling), irreversible (karyolysis/karyorrhexis/pyknosis), apoptosis","Inflammation — acute (neutrophils), chronic (macrophages/lymphocytes), granulomas (TB: caseating; sarcoid: non-caseating)","Neoplasia — hallmarks of cancer (8 hallmarks), oncogenes vs tumour suppressors, carcinogenesis (initiation/promotion/progression)","Lymphomas — HL (Reed-Sternberg, subtypes: NSCHL most common) vs NHL (diffuse large B cell most common)","Amyloidosis — AL (primary/myeloma), AA (secondary/TB), congo red + apple-green birefringence"], mcq:"Reflex: General Pathology + Haematopathology 40 Qs", india:"Tropical splenomegaly (hyperreactive malarial splenomegaly) — India-specific. Visceral leishmaniasis (kala-azar): Bihar, Jharkhand, West Bengal. Aldehyde test (Napier).", images:"H&E: granulomas (TB vs sarcoid), Reed-Sternberg cells (owl-eye), amyloid deposits, necrosis types (coagulative vs liquefactive vs caseous)." },
  { day:8, phase:"blitz", subject:"Pathology", color:"#fb8500", focus:"Systemic Pathology", marrow:"Systemic Pathology module", topics:["Cardiac path — MI zones (coagulative necrosis 6hr), timeline of changes (neutrophils→macrophages→fibrosis)","Renal path — glomerulonephritides: IgA (mesangial), membranous (spike & dome), MPGN (tram-track), MCD (podocyte fusion)","Liver path — hepatitis patterns (bridging necrosis, piecemeal), cirrhosis (micronodular vs macronodular), HCC","Lung path — lobar vs bronchopneumonia, ARDS (hyaline membranes), adenocarcinoma vs SCC vs SCLC","Neuropath — Alzheimer (senile plaques + NFT), Parkinson (Lewy bodies, substantia nigra), WHO 2021 glioma grading (IDH mutation)"], mcq:"Reflex: Systemic Pathology 40 Qs", india:"Oral submucous fibrosis — India-specific precancerous lesion, areca nut etiology, juxtaepithelial fibrosis on biopsy. HBV carrier: 40 million in India.", images:"Renal biopsy EM: podocyte effacement (MCD), subepithelial deposits (membranous), mesangial (IgA). Liver: Mallory bodies, fatty change." },
  { day:9, phase:"blitz", subject:"Pharmacology", color:"#06d6a0", focus:"ANS + CVS + CNS Pharmacology", marrow:"ANS + CVS + CNS Pharmacology", topics:["Adrenergic drugs — α1/α2/β1/β2 selectivity chart, clinical uses, phaeochromocytoma Mx","Antihypertensives — mechanism per class, compelling indications (ACEi in DM nephropathy, β-blocker post-MI)","Antiarrhythmics — Vaughan Williams classification (I–IV), DOC per arrhythmia type","Antiepileptics — DOC per seizure (absence: ethosuximide/valproate, tonic-clonic: valproate), enzyme induction/inhibition","Antipsychotics — typical (D2 block, EPS) vs atypical (5HT2A+D2, metabolic SE), NMS vs serotonin syndrome"], mcq:"Reflex: ANS + CVS + CNS Pharmacology 40 Qs", india:"NDPS Act 1985 — Schedule I (cannabis, cocaine, heroin), II, III. Small quantity vs commercial quantity thresholds (cannabis: 1kg vs 20kg). Section 27: punishment for consumption.", images:"Receptor selectivity diagrams. ECG effects: quinidine (QT prolongation), digoxin (ST scooping, heart block)." },
  { day:10, phase:"blitz", subject:"Pharmacology", color:"#06d6a0", focus:"Antimicrobials + Anticancer + Clinical", marrow:"Antimicrobial + Anticancer Pharmacology", topics:["Antibiotics — mechanism (cell wall/protein/DNA synthesis), spectrum, ESKAPE organisms + resistance","Antifungals — azoles (CYP inhibition), amphotericin B (ergosterol binding, nephrotoxic), echinocandins","Anticancer — cell cycle specificity chart, targeted therapy (imatinib/BCR-ABL, trastuzumab/HER2), checkpoint inhibitors","NSAIDs + opioids — COX-1 vs COX-2, ceiling effect concept, WHO analgesic ladder, opioid conversion","Drug interactions — warfarin (enzyme inducers/inhibitors), lithium (NSAID/thiazide interaction), digoxin toxicity"], mcq:"Reflex: Antimicrobials + Clinical Pharmacology 40 Qs", india:"NLEM 2022 (National List of Essential Medicines) — new additions: bedaquiline, delamanid (DR-TB), dolutegravir (HIV). PMJAY drug formulary.", images:"Antibiotic mechanism diagrams. Cancer pathway diagrams: BCR-ABL, HER2, PD-1/PD-L1 checkpoint." },
  { day:11, phase:"blitz", subject:"OBG", color:"#f72585", focus:"Obstetrics", marrow:"Obstetrics module", topics:["ANC — PMSMA schedule, investigations per trimester, double/triple/quadruple marker interpretation","APH — placenta praevia (grades I–IV, USG diagnosis) vs abruptio (Couvelaire uterus, DIC risk)","PPH — 4 Ts (Tone 80%), oxytocin/carboprost/tranexamic acid protocol, B-Lynch suture, PPH drill","Pre-eclampsia/eclampsia — criteria (BP 140/90 + proteinuria), magnesium toxicity (loss of DTR first), antihypertensives","Preterm labour — tocolytics (nifedipine first line), antenatal steroids (34 weeks), surfactant (RDS threshold)"], mcq:"Reflex: Obstetrics 40 Qs", india:"JSSK benefits: free delivery, C-section, drugs, diagnostics, blood, diet, transport. JSY incentive: ₹1400 rural/₹1000 urban. MMR India: 97/100,000 live births (SRS 2018-20).", images:"USG: placenta praevia grades, biophysical profile scoring (5 parameters), Doppler: absent/reversed end-diastolic flow." },
  { day:12, phase:"blitz", subject:"OBG", color:"#f72585", focus:"Gynaecology", marrow:"Gynaecology module", topics:["Cervical cancer — HPV 16/18, FIGO 2018 staging, colposcopy findings (acetowhite, punctation), LEEP vs cone biopsy","Ovarian tumours — WHO classification (epithelial/germ cell/sex cord), tumour markers (CA-125, AFP, β-HCG, LDH, inhibin)","Fibroids — FIGO PALM-COEIN classification, medical (GnRH agonist, LNG-IUS) vs surgical (myomectomy vs hysterectomy)","Infertility — WHO definition, semen analysis (WHO 2021 criteria), ovulation induction, IVF indications","PCOD — Rotterdam criteria (2/3), insulin resistance, metformin + clomiphene, OHSS risk"], mcq:"Reflex: Gynaecology 40 Qs", india:"India HPV vaccination: 9-valent vaccine, target age 9-14 girls, school-based programme 2023. Cervical cancer: 2nd most common cancer in Indian women (18.3/100,000).", images:"Colposcopy: acetowhite epithelium, punctation, mosaic. USG: polycystic ovaries (>20 follicles per ovary, 'string of pearls')." },
  { day:13, phase:"blitz", subject:"Paediatrics", color:"#4cc9f0", focus:"Neonatology + Growth + Infections", marrow:"Paediatrics module", topics:["Neonatology — APGAR (5 parameters), NRP algorithm (warmth→stimulate→PPV→chest compressions→epinephrine), RDS (surfactant threshold <34wks)","Neonatal jaundice — physiological vs pathological, phototherapy thresholds (Bhutani nomogram), exchange transfusion","Malnutrition — SAM (MUAC <11.5cm, WHZ <-3SD), MAM (MUAC 11.5-12.5cm), F-75/F-100/RUTF protocol","UIP 2024 — all vaccines + schedule + new additions (PCV10, Rota, IPV, adult JE), cold chain requirements","Paediatric infections — measles (Koplik spots, complications: pneumonia/encephalitis), dengue (NS1/IgM/IgG), typhoid (Widal titre)"], mcq:"Reflex: Paediatrics 40 Qs", india:"IMNCI classification: assess→classify→treat. RBSK (Rashtriya Bal Swasthya Karyakram): screening at birth, 6wks, 6m, 9m, 12m, 2yr, 5yr. Mission Indradhanush: target >90% full immunisation.", images:"Growth charts (WHO): WAZ, HAZ, WHZ. X-ray: RDS (ground glass + air bronchogram). Rash: measles vs chickenpox vs roseola vs rubella." },
  { day:14, phase:"blitz", subject:"PSM", color:"#8338ec", focus:"Epidemiology + Biostatistics", marrow:"PSM Epidemiology + Biostatistics", topics:["Study designs — case-control vs cohort vs RCT vs cross-sectional: strengths, limitations, when to use","Measures — RR (cohort), OR (case-control), AR, PAR, NNT, NNH — how to calculate from 2×2 table","Biostatistics — sensitivity/specificity, PPV/NPV (prevalence dependent), LR+/LR-, ROC curve (AUC >0.8 = good test)","Screening — Wilson-Jungner criteria (10 criteria), lead time bias, length bias, overdiagnosis bias","Statistical tests — t-test (parametric, 2 groups), ANOVA (3+ groups), chi-square (categorical), Mann-Whitney (non-parametric)"], mcq:"Reflex: Epidemiology + Biostatistics 40 Qs", india:"NFHS-5 (2019-21) KEY STATS: TFR 2.0, MMR 97, IMR 35.2, NMR 28.2, U5MR 41.9, institutional delivery 88.6%, full immunisation 76.4%, stunting 35.5%, wasting 19.3%.", images:"Epidemic curves: common source (single peak) vs propagated (multiple peaks). ROC curve. 2×2 table for test characteristics." },
  { day:15, phase:"blitz", subject:"PSM", color:"#8338ec", focus:"National Programmes + Disease Control", marrow:"PSM National Programmes + Disease Control", topics:["NHM — ASHA (roles: 85+ tasks), ANM, AWW; PHC norms (1/30,000 population, 6 beds), CHC (80 beds, specialists)","Nutrition — ICDS (Anganwadi: 6 services), PM POSHAN (midday meal), POSHAN Abhiyaan targets","Vector-borne — malaria (ACT: Artesunate+SP for P.vivax; AL for P.falciparum), dengue (NS1 first 5 days), filariasis MDA","TB programme — NTEP cascade: presumptive→diagnosed→notified→treated→cured. Private sector notification mandatory","Water quality — bacteriological standard: 0 coliform/100ml (drinking), MPN method, chlorination (0.5mg/L residual)"], mcq:"Reflex: PSM National Programmes 30 Qs + 10 environmental health Qs", india:"Kala-azar elimination: target <1 case/10,000 population at block level. NVBDCP manages all vector-borne diseases. Filariasis elimination target 2027 — MDA with DEC+Albendazole+Ivermectin.", images:"PHC/CHC organogram. Water treatment flow diagram. Malaria life cycle (definitive host = Anopheles female)." },
  { day:16, phase:"blitz", subject:"Microbiology", color:"#ffb703", focus:"Bacteriology + Virology", marrow:"Bacteriology + Virology modules", topics:["Gram positive — Staph aureus (toxins: TSS-1, TSST, exfoliatin), MRSA (vancomycin), Strep pyogenes (ASO titre)","Gram negative — E.coli pathotypes (ETEC/EPEC/EHEC/EIEC), Salmonella typhi (rose spots, Widal), H.pylori (CLO test)","Mycobacteria — M.tb (Ghon focus→complex→Ranke complex), leprosy (Ridley-Jopling classification, BI, MI)","DNA viruses — HBV serology (HBsAg/anti-HBs/HBeAg/anti-HBe/anti-HBc IgM), herpes latency sites","RNA viruses — HIV (CD4 staging: <200 = AIDS, ART: TLD first line), influenza (antigenic shift = pandemic, drift = epidemic)"], mcq:"Reflex: Bacteriology + Virology 40 Qs", india:"NACO ART 2021: TLD (TDF+3TC+DTG) first line. VL monitoring: at 6m, 12m, then annually. HIV prevalence India: 0.22% (2021). NACP-V targets.", images:"Gram stains: gram+cocci clusters (Staph), gram-rods (E.coli). HBV serology interpretation chart. HIV Western blot bands." },
  { day:17, phase:"blitz", subject:"Microbiology", color:"#ffb703", focus:"Parasitology + Mycology + Biochemistry", marrow:"Parasitology + Biochemistry Molecular", topics:["Malaria — 4 Plasmodium species (vivax: Schüffner dots, falciparum: Maurer clefts, malariae: band forms), life cycle","GI parasites — Entamoeba histolytica (trophozoite with RBCs, flask-shaped ulcer), Giardia (pear-shaped, teardrop trophozoite), Ascaris","Fungi — Candida (germ tube test), Aspergillus (V-shaped hyphae at 45°), Cryptococcus (India ink, latex agglutination)","Biochemistry: Molecular — CRISPR-Cas9 mechanism, PCR types (RT-PCR, real-time, multiplex), DNA repair (NER, BER, MMR)","Biochemistry: LSDs — Gaucher (glucocerebrosidase), Niemann-Pick (sphingomyelinase), Tay-Sachs (hex-A), Fabry (α-galactosidase)"], mcq:"Reflex: Parasitology + Biochemistry 30 Qs", india:"Lymphatic filariasis — W.bancrofti in India (mosquito: Culex). MDA: DEC+Albendazole+Ivermectin triple drug therapy. Nocturnal periodicity. Night blood smear for microfilariae.", images:"Thick/thin smear: P.falciparum (crescent gametocytes), P.vivax (enlarged RBC). Fungal KOH mounts. Ascaris egg (mammillated coat)." },
  { day:18, phase:"blitz", subject:"Forensic", color:"#adb5bd", focus:"Complete Forensics + India Legal", marrow:"Forensic Medicine module", topics:["Thanatology — signs of death, rigor mortis (ATP depletion, 3-6hr onset, 12hr complete, 48-72hr disappears), putrefaction","Wounds — incised (clean edges), lacerated (irregular), contused (bruise), defence wounds location, firearm (entry vs exit)","Toxicology — organophosphate (SLUDGE/DUMBELS, pralidoxime + atropine), CO poisoning (COHb, cherry-red), snakebite (polyvalent ASV)","Sexual offences — IPC 375 (rape, 7 clauses), IPC 376 (punishment: 7yr minimum), MTP Act 2021 (24 weeks for special categories)","Legal medicine — MHCA 2017 vs MHA 1987 (key differences: rights-based, advance directive, nominated representative), POCSO 2012"], mcq:"Reflex: Forensics 40 Qs", india:"NDPS Act 1985: Schedule I substances. Small quantity (cannabis 1kg, heroin 5g) vs commercial (cannabis 20kg, heroin 250g). IPC 304A: death by negligence (2yr). MHCA 2017: Section 3 — mental illness definition; Section 31 — advance directive.", images:"Wound patterns: stab (clean edges), laceration (bridging tissue), firearm (stellate entry from contact range). Ligature marks: suspension vs strangulation." },
  { day:19, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"Medicine + Surgery Weak Areas", marrow:"Weak area targeted revision", topics:["Re-attempt all incorrect MCQs from Days 1–6 (minimum 60 Qs)","Medicine: Cranial nerve palsies (III/IV/VI/VII/XII), UMN vs LMN signs table","Medicine: Dermatology — SLE rash, psoriasis (Auspitz sign), erythema nodosum vs multiforme","Surgery: Orthopaedics — fractures + nerve injuries (radial nerve in humeral shaft, common peroneal in neck fibula)","Surgery: Urology — BPH (IPSS score, alpha-blockers vs 5α-reductase), RCC (clear cell, VHL gene), TCC bladder"], mcq:"Reflex: Full Medicine + Surgery mock — 80 Qs in 60 min. Track time per question.", india:"Revisit: NTEP regimens, JSSK benefits, MMR/IMR/U5MR NFHS-5 figures. Write them from memory.", images:"Radiology revision sprint: 30 CXR + abdominal CT + ortho X-ray images. Identify without labels." },
  { day:20, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"Pathology + Pharmacology Deep Revision", marrow:"Targeted weak area revision", topics:["Pathology: Tumour suppressors — p53 (Li-Fraumeni), Rb (retinoblastoma), BRCA1/2 (breast/ovarian), APC (FAP), VHL (RCC)","Pathology: Autoantibody chart — ANA (SLE), anti-dsDNA (specific for SLE), anti-Sm, anti-Ro/La, ANCA (c-ANCA=GPA, p-ANCA=MPA)","Pharmacology: High-risk interactions — warfarin + enzyme inducers (rifampicin, phenytoin), serotonin syndrome (SSRI+tramadol+linezolid)","Pharmacology: Pregnancy safety — absolute teratogens (thalidomide, isotretinoin, valproate, warfarin, methotrexate)","Pharmacology: Drug-induced conditions — SLE (hydralazine, procainamide), lupus nephritis, drug fever"], mcq:"Reflex: Pathology + Pharmacology mock — 80 Qs", india:"NLEM 2022 additions review. Teratogen counselling in pregnancy — MoHFW guidelines.", images:"IF patterns: IgA nephropathy (mesangial), lupus nephritis class IV (full house), anti-GBM (linear). Autoantibody clinical correlation chart." },
  { day:21, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"OBG + Paediatrics Consolidation", marrow:"OBG + Paediatrics revision", topics:["OBG: Bishop score (6 parameters, >8 = favourable cervix), modified Bishop, induction vs augmentation","OBG: Forceps types (Wrigley/outlet, Neville-Barnes/mid), ventouse indications, contraindications","Paediatrics: CHD — acyanotic (VSD: most common, pansystolic murmur; ASD: fixed split S2; PDA: machinery murmur)","Paediatrics: Cyanotic CHD — ToF (4 features, boot-shaped heart, right-to-left shunt, squatting)","Paediatrics: Developmental milestones — social smile (6wks), head control (3m), sits (6m), stands (9m), walks (12m), 2-word sentences (2yr)"], mcq:"Reflex: OBG + Paediatrics mock — 80 Qs", india:"PMSMA: 9th of every month, free ANC at government health facilities. RBSK: 4D screening (Defects at birth, Diseases, Deficiencies, Development delays).", images:"CTG interpretation: baseline, variability, accelerations, decelerations (early/late/variable). Paediatric CXR: ToF boot-shaped heart, VSD cardiomegaly." },
  { day:22, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"PSM + Microbiology + Biochemistry Sprint", marrow:"PSM + Micro + Biochem targeted", topics:["PSM: Statistical tests decision tree — parametric vs non-parametric, paired vs unpaired, correlation vs regression","PSM: Health indicators — DALYs (YLL + YLD), QALY, HDI components, GBD 2021 India top causes","Microbiology: TORCH — Toxoplasma (IgG avidity), Rubella (vaccination history), CMV (most common congenital), HSV (neonatal)","Biochemistry: Enzyme kinetics — Michaelis-Menten (Km=substrate at Vmax/2), competitive vs non-competitive inhibition (Lineweaver-Burk)","Biochemistry: Porphyrias — AIP (Watson-Schwartz test, urine turns dark), PCT (photosensitivity, uroporphyrin)"], mcq:"50-Q India-specific sprint: programmes, statistics, acts — timed 40 minutes", india:"GBD 2021 India: top causes of DALYs — ischaemic heart disease, neonatal disorders, COPD, lower respiratory infections, diabetes. Nutrition transition: double burden.", images:"Biochemistry pathway diagrams: urea cycle, porphyrin synthesis. TORCH serology interpretation flowchart." },
  { day:23, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"India-Specific Masterclass Day", marrow:"India-specific content — all subjects", topics:["Legal framework: NDPS 1985, MHCA 2017 (Sections 3/18/31/89/103), POCSO 2012, IPC 302/304A/375/376, MTP Act 2021","National Programmes complete: NHM, NTEP, NVBDCP, NACP-V, NPCB, NMHP — targets + 2023 achievements","NFHS-5 state extremes: highest IMR (MP 43), lowest IMR (Kerala 6); highest TFR (Bihar 2.98), lowest (Sikkim 1.1)","MoHFW 2023-24 circulars: new drug approvals (nirsevimab for RSV), guideline updates, NLEM changes","Historical epidemics in India: plague (Surat 1994), Nipah (Kerala 2018, 2023), COVID-19 (India-specific data)"], mcq:"80-Q India-specific grand test — pure India content", india:"This entire day IS India-specific content. No other resource needed. This is your biggest rank differentiator.", images:"Health programme logos and visual mnemonics. India map: disease burden by state (TB, malaria, kala-azar endemic zones)." },
  { day:24, phase:"revision", subject:"Revision", color:"#ffaa00", focus:"Image Bank Masterclass + Integration", marrow:"Image bank + cross-subject integration", topics:["50 histopathology images — rapid identification without prompts (H&E staining patterns)","30 radiology images — CXR (10), CT brain (5), CT abdomen (5), ortho X-ray (5), MRI (5)","20 clinical photos — dermatology rashes (5), ophthalmology (5), peripheral smears (5), clinical signs (5)","40 cross-subject integration Qs — single question requires 2+ subject knowledge (Pathology+Medicine+Pharmacology)","Review all bookmarked/flagged difficult questions from Days 1–23 in Reflex"], mcq:"Image-based 80-Q mock — set to image-only mode in Reflex", india:"Dermatology India: leprosy (Ridley-Jopling: TT/BT/BB/BL/LL), cutaneous leishmaniasis (painless ulcer with raised edges), chromoblastomycosis (cauliflower lesion).", images:"This IS the day. Build visual logbook of every misidentified image. Don't move on without identifying it correctly." },
  { day:25, phase:"mock", subject:"Full Mock 1", color:"#00e5cc", focus:"Full 200-Q Timed Exam Simulation", marrow:"Grand test — exam conditions", topics:["Attempt full 200-Q mock in strict 4 × 45-minute sections — no pausing","Tag each answer: SURE (attempt) / UNSURE (attempt with caution) / GUESS (skip or 60% rule)","Post-mock: calculate raw score. Negative marking: +1 correct, -0.33 wrong, 0 unanswered","Analyse: which subjects had highest miss rate? Which question types (clinical vignette vs single-topic vs image)?","Rank your top 3 weak areas by number of incorrect answers — these get emergency attention Days 26-27"], mcq:"200 Qs in 180 minutes — full exam simulation", india:"Flag every India-specific question you got wrong — highest priority for revision", images:"Note every image question you got wrong — add to visual logbook immediately after mock" },
  { day:26, phase:"mock", subject:"Full Mock 2", color:"#00e5cc", focus:"Emergency Targeted Revision + Mock 2", marrow:"Targeted revision + grand test", topics:["Morning (3hr): Emergency revision — only top 3 weak areas from Mock 1. No other subjects.","Use 'The World of' notes only — no first-pass reading. Revision mode only.","Build your cheat sheet: 1 A4 page per subject, maximum 10 bullet points, only things you kept getting wrong","Afternoon: Full 200-Q Mock 2 — strict exam conditions","Evening: Compare Mock 1 vs Mock 2 scores. Are weak areas improving?"], mcq:"Full Mock 2 — 200 Qs. Track improvement vs Mock 1.", india:"Update India one-pager: add any missed programme statistics from Mock 1 errors", images:"20-image rapid review: only image types missed in Mock 1" },
  { day:27, phase:"mock", subject:"Full Mock 3", color:"#00e5cc", focus:"Final Mock + Consolidation", marrow:"Final grand test + 'World of' notes", topics:["Morning: Full 200-Q Mock 3 — aim for highest accuracy yet","Post-mock: final analysis. If accuracy <70%, identify single highest-yield subject and revise 2 hours.","Afternoon: Rapid pass through all 'The World of' revision notes — 30 min per subject maximum","Evening: Read cheat sheets only — 1 pass, no adding new content","Night: Pack bag, prepare admit card print, valid ID. Sleep by 10 PM — non-negotiable."], mcq:"Full Mock 3 — 200 Qs. Final benchmark.", india:"Final 10-min read: NDPS schedules, MHCA 2017 key sections, NFHS-5 top stats, MMR/IMR", images:"Final 20-image sprint — only your personal logbook of previously missed images" },
  { day:28, phase:"mock", subject:"Exam Eve", color:"#00e5cc", focus:"Exam Day — You Are Ready", marrow:"Rest", topics:["Read cheat sheets ONLY — maximum 2 hours total, then stop","Revise your strongest subjects — build confidence, not anxiety","Logistics: admit card printed, valid government ID, black/blue pens, water bottle","Light meal, good hydration, short 20-min walk in fresh air","Sleep by 9:30 PM. You have covered everything. Trust the work."], mcq:"Maximum 20 Qs — only your most confident topic, only for momentum. Stop by 2 PM.", india:"One final glance: NFHS-5 key figures + NDPS + MHCA 2017. 5 minutes only.", images:"None. Rest your eyes for tomorrow." },
];

export default function App() {
  const [completedDays, setCompletedDays] = useState<number[]>(() => 
    JSON.parse(localStorage.getItem('inicet_completed_days') || '[]')
  );
  const [notes, setNotes] = useState<Record<number, string>>(() => 
    JSON.parse(localStorage.getItem('inicet_notes') || '{}')
  );
  
  const [activeTab, setActiveTab] = useState<'planner' | 'schedule' | 'notes'>('planner');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDayId, setSelectedDayId] = useState<number>(1);
  const [detailTab, setDetailTab] = useState<'TOPICS' | 'INDIA' | 'IMAGES' | 'MCQ' | 'NOTE'>('TOPICS');
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>(() => {
    const distance = EXAM_DATE.getTime() - new Date().getTime();
    if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  });

  useEffect(() => {
    localStorage.setItem('inicet_completed_days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('inicet_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = EXAM_DATE.getTime() - now;
      
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleDayCompletion = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const updateNote = (day: number, text: string) => {
    setNotes(prev => ({
      ...prev,
      [day]: text
    }));
  };

  const filteredSchedule = useMemo(() => {
    if (selectedSubject === 'All') return SCHEDULE;
    return SCHEDULE.filter(s => s.subject === selectedSubject || s.phase === selectedSubject.toLowerCase());
  }, [selectedSubject]);

  const selectedDay = SCHEDULE.find(s => s.day === selectedDayId) || SCHEDULE[0];

  const goNextDay = () => {
    if (selectedDayId < 28) setSelectedDayId(prev => prev + 1);
  };
  
  const goPrevDay = () => {
    if (selectedDayId > 1) setSelectedDayId(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card p-4 md:p-6 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-destructive p-2 rounded-md">
            <Target className="w-6 h-6 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-primary">INI-CET War Plan</h1>
            <p className="text-xs text-muted-foreground font-mono">MAY 16, 2026 // COMMAND CENTER</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-background border border-border px-6 py-3 rounded-lg font-mono">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Days</span>
          </div>
          <span className="text-border font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Hrs</span>
          </div>
          <span className="text-border font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Min</span>
          </div>
          <span className="text-border font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-accent-foreground">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground uppercase">Sec</span>
          </div>
        </div>
      </header>

      {/* Nav Tabs & Progress */}
      <div className="px-4 md:px-6 py-4 border-b border-border/50 bg-background flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-card p-1 rounded-lg border border-border w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'planner' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
          >
            <Calendar className="w-4 h-4" /> Planner
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'schedule' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
          >
            <Clock className="w-4 h-4" /> Daily Schedule
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'notes' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
          >
            <StickyNote className="w-4 h-4" /> My Notes
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
            PROGRESS: {completedDays.length}/28 DAYS
          </div>
          <div className="h-2 w-full md:w-48 bg-card rounded-full overflow-hidden border border-border">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(completedDays.length / 28) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* PLANNER VIEW */}
        {activeTab === 'planner' && (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left: 28-day grid & filters */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5" /> Subject Filter
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(subj => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedSubject === subj 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> 28-Day Grid
                  </h3>
                  <div className="flex gap-3 text-[10px] uppercase font-mono">
                    {PHASES.map(p => (
                      <div key={p.id} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}} />
                        <span className="text-muted-foreground">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {SCHEDULE.map((day) => {
                    const isSelected = day.day === selectedDayId;
                    const isCompleted = completedDays.includes(day.day);
                    const hasNotes = !!notes[day.day] && notes[day.day].trim().length > 0;
                    const isVisible = filteredSchedule.some(s => s.day === day.day);

                    return (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDayId(day.day)}
                        style={{
                          borderColor: isSelected ? day.color : isCompleted ? '#1f1f2e' : 'var(--border)',
                          backgroundColor: isSelected ? `${day.color}15` : isCompleted ? 'var(--card)' : 'transparent',
                          opacity: isVisible ? 1 : 0.2
                        }}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all duration-200 hover:brightness-125 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
                      >
                        <span className={`text-sm font-mono font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {day.day}
                        </span>
                        
                        {isCompleted && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </div>
                        )}
                        
                        {hasNotes && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Day Detail Card */}
            <div className="w-full lg:w-2/3 flex flex-col h-full min-h-[600px]">
              <div className="bg-card border border-border rounded-xl flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1" style={{backgroundColor: selectedDay.color}} />
                
                {/* Detail Header */}
                <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-background border border-border font-mono">
                      <span className="text-xs text-muted-foreground">DAY</span>
                      <span className="text-xl font-bold" style={{color: selectedDay.color}}>{selectedDay.day}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm" style={{backgroundColor: `${selectedDay.color}20`, color: selectedDay.color, border: `1px solid ${selectedDay.color}40`}}>
                          {PHASES.find(p => p.id === selectedDay.phase)?.label}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">{selectedDay.subject}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground font-serif tracking-tight">{selectedDay.focus}</h2>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <button onClick={goPrevDay} disabled={selectedDayId === 1} className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={goNextDay} disabled={selectedDayId === 28} className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => toggleDayCompletion(selectedDay.day)}
                      className={`px-4 py-2 rounded-md font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors ${
                        completedDays.includes(selectedDay.day) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background border border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {completedDays.includes(selectedDay.day) ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      {completedDays.includes(selectedDay.day) ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                </div>

                <div className="px-6 py-3 bg-muted/30 border-b border-border flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" /> Source: {selectedDay.marrow}
                </div>

                {/* Inner Tabs */}
                <div className="flex border-b border-border overflow-x-auto no-scrollbar">
                  {['TOPICS', 'INDIA', 'IMAGES', 'MCQ', 'NOTE'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab as any)}
                      className={`px-6 py-3 text-sm font-mono tracking-wider transition-colors whitespace-nowrap relative ${
                        detailTab === tab 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {detailTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5" style={{backgroundColor: selectedDay.color}} />
                      )}
                      {tab === 'INDIA' && <Flag className="w-3 h-3 inline mr-2 text-orange-400" />}
                      {tab === 'IMAGES' && <Target className="w-3 h-3 inline mr-2 text-blue-400" />}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
                  
                  {detailTab === 'TOPICS' && (
                    <div className="space-y-4">
                      {selectedDay.topics.map((topic, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center font-mono text-sm font-bold mt-0.5" style={{color: selectedDay.color}}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 bg-background border border-border rounded-lg p-4 group-hover:border-muted-foreground transition-colors font-serif leading-relaxed text-foreground/90">
                            {topic}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === 'INDIA' && (
                    <div className="h-full flex flex-col">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 relative overflow-hidden flex-1">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-orange-500 p-2 rounded-lg">
                            <Flag className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-orange-400 font-mono tracking-wide">AIIMS EDGE: INDIA-SPECIFIC</h3>
                        </div>
                        <div className="font-serif text-lg leading-relaxed text-foreground/90 p-4 bg-background/50 rounded-lg border border-border/50 shadow-inner">
                          {selectedDay.india}
                        </div>
                        <div className="mt-6 flex items-start gap-3 text-sm text-orange-300/70 bg-orange-500/5 p-3 rounded-md border border-orange-500/10">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>These statistics and guidelines are frequently tested directly. Memorize exact values.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'IMAGES' && (
                    <div className="h-full flex flex-col">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 relative flex-1">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-blue-500 p-2 rounded-lg">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-blue-400 font-mono tracking-wide">IMAGE REVIEW TARGETS</h3>
                        </div>
                        <div className="font-serif text-lg leading-relaxed text-foreground/90 p-4 bg-background/50 rounded-lg border border-border/50">
                          {selectedDay.images}
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'MCQ' && (
                    <div className="h-full flex flex-col">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 relative flex-1">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-emerald-500 p-2 rounded-lg">
                            <Crosshair className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-emerald-400 font-mono tracking-wide">DAILY MCQ MISSION</h3>
                        </div>
                        
                        <div className="font-serif text-xl font-bold mb-8 text-foreground p-6 bg-background/60 rounded-lg border border-emerald-500/30 text-center">
                          {selectedDay.mcq}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-auto">
                          <div className="bg-background border border-border p-4 rounded-lg text-center">
                            <span className="block text-2xl font-mono font-bold text-emerald-500">+1</span>
                            <span className="text-xs text-muted-foreground uppercase font-mono">Correct</span>
                          </div>
                          <div className="bg-background border border-border p-4 rounded-lg text-center">
                            <span className="block text-2xl font-mono font-bold text-destructive">-0.33</span>
                            <span className="text-xs text-muted-foreground uppercase font-mono">Incorrect</span>
                          </div>
                          <div className="bg-background border border-border p-4 rounded-lg text-center">
                            <span className="block text-2xl font-mono font-bold text-muted-foreground">0</span>
                            <span className="text-xs text-muted-foreground uppercase font-mono">Unattempted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailTab === 'NOTE' && (
                    <div className="h-full flex flex-col">
                      <textarea
                        className="w-full flex-1 bg-background border border-border rounded-xl p-4 font-mono text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-muted-foreground/50"
                        placeholder="Write your high-yield points, memory hooks, or weak areas here..."
                        value={notes[selectedDay.day] || ''}
                        onChange={(e) => updateNote(selectedDay.day, e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {notes[selectedDay.day]?.length || 0} characters (Auto-saved)
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* DAILY SCHEDULE VIEW */}
        {activeTab === 'schedule' && (
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
            <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-foreground">Optimal Daily Routine</h2>
              </div>
              <div className="divide-y divide-border">
                {DAILY_BLOCKS.map((block, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-muted/30 transition-colors">
                    <div className="w-40 font-mono text-sm font-bold text-primary mb-1 sm:mb-0 shrink-0">
                      {block.time}
                    </div>
                    <div className="font-serif text-foreground/90">
                      {block.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
                <h3 className="font-mono text-destructive font-bold mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> NON-NEGOTIABLES
                </h3>
                <ul className="space-y-4 font-serif text-sm">
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> No new resources after Day 18</li>
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> 1 full mock required from Day 22</li>
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Skip question if &lt;60% confident</li>
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Anatomy/Physio via MCQs only</li>
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Sleep strictly at 10 PM on exam eve</li>
                  <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Creatine 5g daily for cognitive stamina</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* MY NOTES VIEW */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2 shrink-0">
              {SCHEDULE.map(day => {
                const hasNotes = !!notes[day.day] && notes[day.day].trim().length > 0;
                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDayId(day.day)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors flex items-center gap-2 ${
                      selectedDayId === day.day
                        ? 'bg-primary text-primary-foreground border-primary'
                        : hasNotes
                        ? 'bg-accent text-accent-foreground border-border'
                        : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
                    }`}
                  >
                    Day {day.day}
                    {hasNotes && <div className={`w-1.5 h-1.5 rounded-full ${selectedDayId === day.day ? 'bg-primary-foreground' : 'bg-primary'}`} />}
                  </button>
                )
              })}
            </div>

            <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1" style={{backgroundColor: selectedDay.color}} />
              
              <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-lg" style={{color: selectedDay.color}}>DAY {selectedDay.day}</span>
                  <span className="font-serif text-foreground/80 hidden sm:inline">— {selectedDay.focus}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Download className="w-3.5 h-3.5" /> Auto-saved to localStorage
                </div>
              </div>
              
              <textarea
                className="w-full flex-1 bg-background p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-muted-foreground/30 leading-relaxed"
                placeholder={`No notes for Day ${selectedDay.day} yet. Use this space for high-yield pointers, missed MCQs, or memory hooks...`}
                value={notes[selectedDayId] || ''}
                onChange={(e) => updateNote(selectedDayId, e.target.value)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}