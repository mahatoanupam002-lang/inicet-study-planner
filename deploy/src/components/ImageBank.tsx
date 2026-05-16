import { useState, useMemo } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface ImageCase {
  id: string;
  category: "Histopathology" | "Radiology" | "Clinical" | "ECG" | "Peripheral Smear" | "Ophthalmology";
  subject: string;
  title: string;
  description: string;
  keyFeatures: string[];
  diagnosis: string;
  teaching: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const CASES: ImageCase[] = [
  // Histopathology (15)
  { id:"hp1", title:"Caseating granuloma", category:"Histopathology", subject:"Pathology", description:"H&E stain showing central acellular eosinophilic necrosis surrounded by epithelioid histiocytes and Langhans giant cells (peripheral nuclei in horseshoe pattern). Lymphocytic cuff at periphery.", keyFeatures:["Central caseating (cheese-like) necrosis","Epithelioid histiocytes","Langhans giant cells — nuclei at periphery","No viable tissue in centre","Lymphocytic infiltrate"], diagnosis:"Tuberculosis (caseating granuloma)", teaching:"Caseating = TB until proven otherwise. Non-caseating = Sarcoidosis, Crohn's, Berylliosis. Langhans cells (TB) vs Foreign body giant cells (peripheral nuclei in random pattern)", difficulty:"Easy" },
  { id:"hp2", title:"Reed-Sternberg cell", category:"Histopathology", subject:"Pathology", description:"Large binucleated/multinucleated cell with prominent 'owl-eye' eosinophilic nucleoli in a background of lymphocytes, eosinophils, and plasma cells.", keyFeatures:["Binucleated/multinucleated cell","Large eosinophilic nucleoli (owl-eye)","Background inflammatory cells","CD15+ CD30+ CD45-","Lacunar cell variant in NSCHL"], diagnosis:"Hodgkin lymphoma (Reed-Sternberg cell)", teaching:"RS cells are IHC: CD15+, CD30+, PAX5+ (weak), CD45−. Most common subtype: Nodular Sclerosis (NSCHL). Mixed cellularity has most RS cells.", difficulty:"Easy" },
  { id:"hp3", title:"Membranous nephropathy", category:"Histopathology", subject:"Pathology", description:"Electron microscopy showing subepithelial electron-dense deposits with spikes of basement membrane material projecting between deposits ('spike and dome' pattern). Podocyte foot process effacement.", keyFeatures:["Subepithelial deposits on EM","Spike-and-dome on silver stain","Diffuse capillary wall thickening on LM","IF: granular IgG + C3","PLA2R antibody (primary form)"], diagnosis:"Membranous nephropathy (MGN)", teaching:"Most common cause of adult nephrotic syndrome (primary). PLA2R antibody in 70-80% primary MGN. Secondary causes: HBV, SLE, solid tumours, drugs (NSAIDs, gold).", difficulty:"Medium" },
  { id:"hp4", title:"Amyloid deposits", category:"Histopathology", subject:"Pathology", description:"Congo red stain showing homogeneous eosinophilic material in vessel walls and glomeruli, displaying apple-green birefringence under polarised light.", keyFeatures:["Homogeneous acellular eosinophilic deposits","Congo red positive","Apple-green birefringence under polarised light","Vessel walls + mesangium + interstitium","Amorphous on H&E"], diagnosis:"Amyloidosis", teaching:"Congo red → apple-green birefringence = amyloid. AL (primary/myeloma): light chains. AA (secondary): serum amyloid A protein. Sites: kidney (proteinuria), heart (restrictive CMP), tongue (macroglossia).", difficulty:"Easy" },
  { id:"hp5", title:"Hepatocellular carcinoma", category:"Histopathology", subject:"Pathology", description:"Trabeculae of malignant hepatocytes with prominent nucleoli, increased N:C ratio, bile production, and sinusoidal pattern. Background cirrhotic nodules visible.", keyFeatures:["Trabecular pattern of tumour cells","Bile production (green pigment)","Prominent nucleoli","AFP elevation","Sinusoidal vasculature"], diagnosis:"Hepatocellular carcinoma (HCC)", teaching:"HCC arises in cirrhosis (HBV, HCV, alcoholic, NASH). Serum AFP >400 ng/mL diagnostic. Fibrolamellar variant: good prognosis, young non-cirrhotic patients.", difficulty:"Hard" },
  { id:"hp6", title:"Psammoma bodies", category:"Histopathology", subject:"Pathology", description:"Laminated concentric calcifications in a papillary tumour with tall columnar cells showing nuclear clearing and pseudo-inclusions. Fibrovascular cores visible.", keyFeatures:["Concentric laminated calcifications","Nuclear clearing ('Orphan Annie' nuclei)","Nuclear pseudo-inclusions and grooves","Papillary architecture","Fibrovascular cores"], diagnosis:"Papillary thyroid carcinoma", teaching:"PTC: most common thyroid cancer. Psammoma bodies in 50%. RET/PTC rearrangement + BRAF V600E mutation. Spreads lymphatically. Excellent prognosis (10-yr survival >95%).", difficulty:"Easy" },
  { id:"hp7", title:"Chronic active hepatitis", category:"Histopathology", subject:"Pathology", description:"H&E showing interface hepatitis (piecemeal necrosis at portal-hepatocyte border), portal tract inflammation with lymphocytes and plasma cells, and fibrous septa extending into lobule.", keyFeatures:["Interface hepatitis (limiting plate disruption)","Portal tract lymphoplasmacytic infiltrate","Rosette formation of hepatocytes","Fibrous septa","May show 'ground glass' cells (HBV)"], diagnosis:"Chronic active hepatitis (HBV/HCV/AIH)", teaching:"Interface hepatitis = chronic hepatitis. Ground glass cells = HBV (HBsAg in ER). Plasma cell predominance = autoimmune hepatitis. Stage I-IV fibrosis (Metavir/ISHAK).", difficulty:"Medium" },
  { id:"hp8", title:"Meningioma — psammoma body", category:"Histopathology", subject:"Pathology", description:"Whorled pattern of meningothelial cells arranged in concentric layers with central psammoma bodies. Well-circumscribed lesion arising from arachnoid.", keyFeatures:["Whorled meningothelial cells","Central psammoma bodies","Syncytial cytoplasm","EMA+ and Vimentin+ on IHC","WHO Grade I (most common)"], diagnosis:"Meningioma (meningothelial type)", teaching:"Most common benign intracranial tumour. Parasagittal location most common. WHO grade I: psammomatous, meningothelial. Grade II: atypical. Grade III: anaplastic. PR receptor positive.", difficulty:"Medium" },
  { id:"hp9", title:"Clear cell carcinoma kidney", category:"Histopathology", subject:"Pathology", description:"Sheets of large cells with clear cytoplasm (glycogen and lipid), prominent thin-walled sinusoidal vasculature, and low-grade nuclear pleomorphism.", keyFeatures:["Clear cytoplasm (glycogen/lipid)","Prominent thin-walled vasculature","Alveolar/nested pattern","CD10+ Vimentin+ on IHC","VHL mutation"], diagnosis:"Clear cell renal cell carcinoma (ccRCC)", teaching:"Most common RCC (70-75%). VHL gene mutation (Ch 3p). Sporadic (most) and von Hippel-Lindau syndrome. Fuhrman grade I-IV. Haematogenous spread to lung.", difficulty:"Medium" },
  { id:"hp10", title:"Hyaline membrane disease", category:"Histopathology", subject:"Pathology", description:"Lung tissue showing homogeneous eosinophilic membranes lining the alveolar walls (hyaline membranes), collapsed alveoli with atelectasis, and distended alveolar ducts.", keyFeatures:["Eosinophilic hyaline membranes","Alveolar collapse/atelectasis","Distended alveolar ducts","Absent surfactant","Preterm infant (< 34 weeks)"], diagnosis:"Hyaline Membrane Disease / RDS of newborn", teaching:"Due to surfactant deficiency (DPPC). Type II pneumocytes reduced in preterm. Antenatal betamethasone stimulates surfactant. Treatment: exogenous surfactant + CPAP.", difficulty:"Easy" },
  { id:"hp11", title:"Oncocytoma kidney", category:"Histopathology", subject:"Pathology", description:"Nests and tubules of large cells with abundant granular eosinophilic cytoplasm (packed mitochondria) in an edematous stroma. Central scar visible on low power.", keyFeatures:["Granular eosinophilic cytoplasm","Packed mitochondria (EM)","Central stellate scar","CK7+ CD10-","Mahogany brown on gross"], diagnosis:"Renal oncocytoma", teaching:"Benign renal neoplasm. Cannot reliably distinguish from ccRCC on imaging. Central scar on CT = oncocytoma (not always). Treatment: nephron-sparing surgery.", difficulty:"Hard" },
  { id:"hp12", title:"Invasive ductal carcinoma breast", category:"Histopathology", subject:"Pathology", description:"Irregular nests, cords and glands of malignant epithelial cells with desmoplastic stromal reaction. High N:C ratio, mitoses visible. Absence of myoepithelial layer.", keyFeatures:["Irregular infiltrating glands/cords","Desmoplastic stroma","Loss of myoepithelial layer","ER/PR/HER2 testing essential","Nottingham grading (1-3)"], diagnosis:"Invasive ductal carcinoma NOS (IDC, Grade 2)", teaching:"Most common breast cancer. Nottingham grade: tubule formation + nuclear pleomorphism + mitotic count. ER/PR/HER2 status dictates therapy. Triple negative = poor prognosis.", difficulty:"Easy" },
  { id:"hp13", title:"Seminoma testis", category:"Histopathology", subject:"Pathology", description:"Sheets of large cells with clear cytoplasm, prominent central nucleoli, and fibrous septa with lymphocytic infiltrate. Granulomatous reaction in background.", keyFeatures:["Large cells with clear glycogen-rich cytoplasm","Prominent nucleoli","Fibrous septa with lymphocytes","Granulomatous reaction","PLAP+ CD117+ on IHC"], diagnosis:"Seminoma (testicular germ cell tumour)", teaching:"Most common testicular tumour (peak: 30-40 yr). PLAP+, CD117+, OCT3/4+. Radiosensitive. Stage I-III. AFP NOT elevated (unlike non-seminoma). LDH elevated.", difficulty:"Medium" },
  { id:"hp14", title:"Ganglioneuroma", category:"Histopathology", subject:"Pathology", description:"Mature ganglion cells scattered in a Schwannian stroma with Nissl substance and prominent nucleoli. No mitoses or necrosis. Well-differentiated tumour.", keyFeatures:["Mature ganglion cells with Nissl substance","Schwannian background stroma","No mitoses or necrosis","Benign behaviour","Retroperitoneal / posterior mediastinal"], diagnosis:"Ganglioneuroma", teaching:"Neuroblastoma (malignant) → Ganglioneuroblastoma (intermediate) → Ganglioneuroma (benign). Ganglioneuroma: mature, no catecholamines, benign. Treatment: complete resection.", difficulty:"Hard" },
  { id:"hp15", title:"Glioblastoma multiforme", category:"Histopathology", subject:"Pathology", description:"Highly cellular tumour with necrosis, pseudopalisading of tumour cells around necrosis, microvascular proliferation (glomeruloid vessels), nuclear pleomorphism, and mitoses.", keyFeatures:["Pseudopalisading necrosis","Glomeruloid microvascular proliferation","High mitotic activity","GFAP+ on IHC","IDH wild-type (primary GBM)"], diagnosis:"Glioblastoma (WHO Grade 4)", teaching:"Most malignant primary brain tumour. Pseudopalisading necrosis = pathognomonic. EGFR amplification, PTEN loss, IDH wild-type (primary GBM). Median survival ~15 months.", difficulty:"Medium" },

  // Radiology (15)
  { id:"rad1", title:"Free gas under diaphragm", category:"Radiology", subject:"Surgery", description:"Erect CXR showing crescentic lucency under the right hemidiaphragm (pneumoperitoneum). Liver shadow visible below.", keyFeatures:["Crescentic air under right hemidiaphragm","Both sides if large","Best seen on erect CXR","Minimal air detectable (as little as 1 mL)","Absence doesn't exclude perforation"], diagnosis:"Pneumoperitoneum (perforated viscus)", teaching:"ALWAYS do erect CXR in suspected perforation. Right side better (liver contrast). Causes: perforated DU (most common), perforated appendix, post-laparotomy (up to 10 days normal).", difficulty:"Easy" },
  { id:"rad2", title:"Ground glass + air bronchograms", category:"Radiology", subject:"Paediatrics", description:"CXR of newborn showing diffuse bilateral granular ('ground glass') opacification with air bronchograms (air-filled bronchi visible against opaque background) and low lung volumes.", keyFeatures:["Bilateral granular opacity","Air bronchograms throughout","Low lung volumes","Preterm infant","'White-out' in severe cases"], diagnosis:"Respiratory Distress Syndrome (RDS) / Hyaline Membrane Disease", teaching:"RDS in premature infants due to surfactant deficiency. Antenatal steroids (betamethasone) if <34 weeks. Treatment: surfactant (Poractant alfa) + CPAP/ventilation.", difficulty:"Easy" },
  { id:"rad3", title:"Boot-shaped heart", category:"Radiology", subject:"Paediatrics", description:"CXR showing upturned cardiac apex with concavity at left heart border (pulmonary bay), giving a 'boot' or 'coeur en sabot' shape. Oligaemic lung fields.", keyFeatures:["Upturned cardiac apex","Concave pulmonary bay (absent main PA)","Oligaemic lung fields","Right-sided aortic arch (25%)","Normal heart size"], diagnosis:"Tetralogy of Fallot", teaching:"ToF = VSD + PS + Overriding aorta + RVH. Boot-shaped heart on CXR. Right-to-left shunt → cyanosis. Squatting increases SVR (reduces R-L shunt).", difficulty:"Easy" },
  { id:"rad4", title:"'String of pearls' sign", category:"Radiology", subject:"Surgery", description:"Abdominal X-ray showing small oval gas bubbles arranged in a row, trapped in the valvulae conniventes of the small bowel, in the right iliac fossa area (supine film).", keyFeatures:["Small oval gas bubbles in a chain","Valvulae conniventes visible","Central abdomen","Supine film finding","No free gas"], diagnosis:"Small bowel obstruction", teaching:"'String of pearls': trapped gas bubbles in SBO. Look for: central location (vs colon peripheral), valvulae conniventes crossing full width (vs haustra — partial). Step-ladder pattern in erect view.", difficulty:"Medium" },
  { id:"rad5", title:"'Onion-skin' periosteal reaction", category:"Radiology", subject:"Pathology", description:"X-ray of proximal tibial diaphysis showing laminated periosteal reaction with concentric layers of new bone formation ('onion peel' pattern). Associated soft tissue mass.", keyFeatures:["Laminated/layered periosteal reaction","Diaphyseal lesion in long bone","Soft tissue mass","Age 5-25 years","t(11;22) translocation"], diagnosis:"Ewing's sarcoma", teaching:"Ewing's sarcoma: most common in diaphysis of long bones. Peak age 10-15. Onion-skin periosteal reaction. t(11;22) → EWS-FLI1 fusion. Highly malignant. Osteosarcoma: metaphysis, sunburst pattern.", difficulty:"Medium" },
  { id:"rad6", title:"'Sunburst' periosteal reaction", category:"Radiology", subject:"Pathology", description:"X-ray of distal femoral metaphysis showing spiculated 'sunburst' or 'hair-on-end' periosteal reaction with Codman's triangle at the periphery. Bone destruction visible.", keyFeatures:["Sunburst/spiculated periosteal reaction","Codman's triangle (periosteal elevation)","Metaphyseal location","Age 10-20 years","Skip lesions possible"], diagnosis:"Osteosarcoma", teaching:"Most common primary bone malignancy. Metaphysis of long bones (distal femur > proximal tibia > proximal humerus). Sunburst = osteosarcoma. Onion-skin = Ewing's. TP53/RB mutations.", difficulty:"Medium" },
  { id:"rad7", title:"'Egg-shell' calcification", category:"Radiology", subject:"Surgery", description:"CT abdomen showing a large cystic lesion with peripheral curvilinear calcification ('egg-shell' pattern) in the liver. Well-circumscribed, daughter cysts visible within.", keyFeatures:["Peripheral calcification","Daughter cysts within main cyst","Well-circumscribed hepatic cyst","'Water lily' sign if collapsed","Hepatic location most common"], diagnosis:"Hydatid cyst (Echinococcosis)", teaching:"Caused by Echinococcus granulosus (dog tapeworm). Liver (70%) > lung (15%). 'Water lily' sign = floating membranes. Casoni test (intradermal, not used now). Treatment: PAIR + Albendazole.", difficulty:"Medium" },
  { id:"rad8", title:"Bat wing pulmonary oedema", category:"Radiology", subject:"Medicine", description:"CXR showing bilateral perihilar haziness in a 'bat wing' or 'butterfly' pattern, with Kerley B lines (horizontal lines at lung bases) and cardiomegaly.", keyFeatures:["Perihilar 'bat wing' haziness","Kerley B lines at lung bases","Cardiomegaly","Upper lobe diversion (venous)","Pleural effusion (bilateral)"], diagnosis:"Pulmonary oedema (cardiogenic)", teaching:"Acute pulmonary oedema (APO): CXR features in order of severity — upper lobe diversion → Kerley B lines → alveolar oedema → pleural effusion. Causes: LVF, MI, aortic stenosis.", difficulty:"Easy" },
  { id:"rad9", title:"'Lead pipe' colon", category:"Radiology", subject:"Medicine", description:"Barium enema showing loss of normal haustral pattern throughout the colon, resulting in a smooth, featureless, shortened 'lead pipe' appearance. Loss of redundancy.", keyFeatures:["Loss of haustra","Smooth featureless colon wall","Shortened colon","No deep ulceration on this view","Affects colon continuously from rectum"], diagnosis:"Ulcerative colitis (chronic changes)", teaching:"UC: continuous from rectum proximally. 'Lead pipe' colon in chronic UC (loss of haustra + fibrosis). Barium enema largely replaced by colonoscopy. Toxic megacolon: transverse colon >6cm.", difficulty:"Medium" },
  { id:"rad10", title:"'Coin lesion' lung", category:"Radiology", subject:"Medicine", description:"CXR and CT showing a solitary pulmonary nodule (SPN) <3cm, well-circumscribed, with lobulated margins and slight speculation in the right upper lobe of a 65-year-old smoker.", keyFeatures:["Solitary well-circumscribed nodule","Spiculated / lobulated margins","Upper lobe (smoker)",">3cm = mass (malignant until proven)","Calcification patterns: popcorn=hamartoma, central=granuloma"], diagnosis:"Suspicious coin lesion — likely bronchogenic carcinoma", teaching:"Coin lesion workup: size, margins, growth rate, PET-CT. Malignant features: spiculation, >3cm, upper lobe, smoker. Benign: popcorn calcification (hamartoma), central (granuloma), laminated.", difficulty:"Hard" },
  { id:"rad11", title:"Shifting dullness — USG", category:"Radiology", subject:"Medicine", description:"Ultrasound abdomen showing free fluid (hypoechoic/anechoic) in the hepatorenal space (Morrison's pouch), paracolic gutters, and pelvis (pouch of Douglas). Bowel loops floating.", keyFeatures:["Anechoic free fluid Morrison's pouch","Fluid in paracolic gutters","Pelvic free fluid","Most dependent: hepatorenal space","Floating bowel loops"], diagnosis:"Ascites (free intraperitoneal fluid)", teaching:"Morrison's pouch = hepatorenal recess = most dependent in supine. 100 mL detectable on USG. Causes: cirrhosis (most common), malignancy, TB peritonitis, cardiac. SAAG ≥1.1 = portal HT.", difficulty:"Easy" },
  { id:"rad12", title:"Ivory vertebra", category:"Radiology", subject:"Pathology", description:"Plain X-ray spine showing sclerotic (increased density) vertebral body maintaining normal size and shape ('ivory vertebra'). Adjacent vertebrae appear normal.", keyFeatures:["Dense sclerotic vertebral body","Normal size maintained","Single or multiple vertebrae","No collapse","Normal disc spaces"], diagnosis:"Ivory vertebra — lymphoma or Paget's disease", teaching:"Ivory vertebra causes: Lymphoma (most common, especially Hodgkin's), Paget's disease (enlarged vertebra), Osteosarcoma, Myeloma (rare — usually lytic), Prostate/Breast met. Paget's: also enlarged.", difficulty:"Hard" },
  { id:"rad13", title:"'Snowstorm' uterus", category:"Radiology", subject:"OBG", description:"Ultrasound showing uterine cavity filled with echogenic 'snowstorm' pattern — multiple tiny echogenic foci without normal gestational sac. No fetal parts visible. Bilateral theca-lutein cysts.", keyFeatures:["Echogenic 'snowstorm' in uterine cavity","No fetal parts","Bilateral theca-lutein cysts","Uterus enlarged","Elevated beta-hCG"], diagnosis:"Hydatidiform mole (complete mole)", teaching:"Complete mole: 46,XX (paternal origin). No fetus. hCG very high. Risk of choriocarcinoma 2-3%. Management: suction evacuation + hCG monitoring for 6 months. Contraception essential.", difficulty:"Easy" },
  { id:"rad14", title:"'Steeple sign' larynx", category:"Radiology", subject:"Paediatrics", description:"AP neck X-ray showing narrowing of the subglottic airway with a 'steeple' or 'pencil point' shape at the subglottis, without epiglottitis. Soft tissue neck XR.", keyFeatures:["Symmetric subglottic narrowing","'Steeple' or 'pencil' shape","AP view of neck","Normal epiglottis","Age 6 months to 3 years"], diagnosis:"Croup (laryngotracheobronchitis)", teaching:"Croup = laryngotracheobronchitis. Caused by Parainfluenza virus (most common). 'Steeple sign' = subglottic narrowing. Barking cough, stridor. Treatment: dexamethasone + nebulised adrenaline.", difficulty:"Easy" },
  { id:"rad15", title:"'Thumb printing' sign colon", category:"Radiology", subject:"Surgery", description:"Plain abdominal X-ray showing thumb-like indentations along the mucosal margin of the colon, particularly the splenic flexure, due to submucosal oedema/haemorrhage.", keyFeatures:["Thumb-like mucosal indentations","Submucosal oedema pattern","Splenic flexure most affected","Absent haustra at affected segment","Clinical: acute abdominal pain + bloody diarrhoea"], diagnosis:"Ischaemic colitis", teaching:"Ischaemic colitis: 'watershed areas' — splenic flexure (Griffith's point) and rectosigmoid junction (Sudeck's point). 'Thumb printing' = submucosal oedema. Causes: atherosclerosis, low-flow states.", difficulty:"Hard" },

  // ECG (5)
  { id:"ecg1", title:"Acute STEMI — anterior", category:"ECG", subject:"Medicine", description:"ECG showing ST-segment elevation in leads V1-V6 and I, aVL. Reciprocal ST depression in inferior leads (II, III, aVF). Q waves developing in V1-V3.", keyFeatures:["ST elevation V1-V6","Reciprocal depression in inferior leads","Developing Q waves V1-V4","Acute presentation","LAD territory"], diagnosis:"Anterior STEMI (LAD occlusion)", teaching:"STEMI territory: Anterior (V1-V4) = LAD. Inferior (II,III,aVF) = RCA. Lateral (I,aVL,V5-V6) = LCx. Posterior: tall R wave V1-V2 with ST depression (reciprocal of posterior ST elevation).", difficulty:"Easy" },
  { id:"ecg2", title:"Digoxin toxicity ECG", category:"ECG", subject:"Pharmacology", description:"ECG showing 'reversed tick' or 'scooping' ST depression (downsloping ST segment curving upward), shortened QT interval, and slow heart rate. 'Salvador Dali moustache' appearance.", keyFeatures:["Scooped/reversed tick ST depression","Shortened QT interval","Bradycardia","Any arrhythmia possible","Bidirectional VT in severe toxicity"], diagnosis:"Digoxin effect / toxicity", teaching:"Digoxin effect (therapeutic): scooped ST. Digoxin toxicity: any arrhythmia (PAT with block = classic, bidirectional VT = pathognomonic). Toxic level: >2 ng/mL. Antidote: Digibind (Fab fragments).", difficulty:"Medium" },
  { id:"ecg3", title:"Hyperkalaemia ECG changes", category:"ECG", subject:"Medicine", description:"ECG sequence: peaked (tented) T waves in precordial leads, then PR prolongation, P wave disappearance, wide QRS with sine-wave pattern. Precedes VF/asystole.", keyFeatures:["Peaked (tented) T waves — FIRST change","Widened QRS","P wave disappears","Sine wave pattern","Risk of VF"], diagnosis:"Hyperkalaemia ECG changes", teaching:"K+ ECG sequence: peaked T → PR prolongation → P loss → wide QRS → sine wave → VF. Treatment: Calcium gluconate (cardioprotection), then insulin+glucose, bicarbonate, salbutamol, dialysis.", difficulty:"Medium" },
  { id:"ecg4", title:"Complete heart block (3rd degree AV block)", category:"ECG", subject:"Medicine", description:"Regular P waves (atrial rate 70-80/min) completely independent of regular QRS complexes (ventricular rate 30-40/min). P waves 'march through' QRS without consistent PR interval.", keyFeatures:["P waves and QRS completely dissociated","Regular P rate (faster)","Regular ventricular rate (slower)","No constant PR interval","Escape rhythm: wide QRS (ventricular) or narrow (junctional)"], diagnosis:"Complete (3rd degree) AV block", teaching:"3rd degree AVB: atria and ventricles beat independently. Escape rate <40 bpm = ventricular escape (wide, unstable). Causes: inferior MI (RCA), Lyme disease, drugs (beta-blocker, digoxin). Pacemaker required.", difficulty:"Medium" },
  { id:"ecg5", title:"Wolff-Parkinson-White syndrome", category:"ECG", subject:"Medicine", description:"ECG showing short PR interval (<120ms), delta wave (slurred upstroke of QRS complex), and widened QRS (>120ms). Features seen in sinus rhythm.", keyFeatures:["Short PR interval (<120ms)","Delta wave (slurred QRS upstroke)","Wide QRS >120ms","Pseudo-infarction pattern V1-V3","Risk of AF with rapid ventricular response"], diagnosis:"Wolff-Parkinson-White syndrome (WPW)", teaching:"WPW: accessory pathway (Bundle of Kent) bypasses AV node → pre-excitation. Risk: AF→rapid ventricular response→VF. AVOID AV-nodal blocking drugs (adenosine, verapamil, digoxin) in WPW+AF. Treatment: ablation.", difficulty:"Hard" },

  // Peripheral Smear (5)
  { id:"ps1", title:"Peripheral smear — P. falciparum", category:"Peripheral Smear", subject:"Microbiology", description:"Thin blood film showing small ring forms (appliqué/accolé position at RBC margin), multiple parasites per RBC, banana-shaped (crescent) gametocytes, and no enlarged RBCs.", keyFeatures:["Small delicate ring forms","Multiple rings per RBC","Appliqué (marginal) position","Banana-shaped gametocytes","No schüffner dots"], diagnosis:"Plasmodium falciparum malaria", teaching:"P. falciparum: malignant tertian malaria. No schüffner dots (unlike vivax). Gametocytes crescent-shaped. Sequestration in deep vessels → cerebral malaria. Maurer's clefts (coarse, irregular).", difficulty:"Easy" },
  { id:"ps2", title:"Peripheral smear — CML", category:"Peripheral Smear", subject:"Pathology", description:"Blood film showing left-shifted granulocytes at all stages (myeloblasts, promyelocytes, myelocytes, metamyelocytes, bands, neutrophils), basophilia, eosinophilia. Blast count <5%. Platelet clumps.", keyFeatures:["All stages of granulocyte maturation","Basophilia prominent","Eosinophilia","Blast count <5%","Low LAP score"], diagnosis:"Chronic Myeloid Leukaemia (CML)", teaching:"CML: Philadelphia chromosome t(9;22), BCR-ABL1 fusion. Low/absent LAP score (vs leukaemoid reaction = high LAP). Treatment: Imatinib (TKI). Blast crisis → AML (most common) or ALL.", difficulty:"Medium" },
  { id:"ps3", title:"Peripheral smear — Sickle cell", category:"Peripheral Smear", subject:"Pathology", description:"Blood film showing elongated sickle-shaped (crescent) red blood cells, target cells, polychromasia, Howell-Jolly bodies (nuclear remnants — hyposplenism), and nucleated RBCs.", keyFeatures:["Sickle-shaped RBCs","Target cells","Howell-Jolly bodies (asplenic)","Polychromasia","Nucleated RBCs"], diagnosis:"Sickle cell anaemia (HbSS)", teaching:"Sickle cell disease: HbS (Glu→Val at position 6 of beta globin). HbSS = most severe. Howell-Jolly bodies = autosplenectomy. Crises: vaso-occlusive, aplastic (parvovirus B19), sequestration, haemolytic.", difficulty:"Easy" },
  { id:"ps4", title:"Peripheral smear — Iron deficiency anaemia", category:"Peripheral Smear", subject:"Medicine", description:"Blood film showing hypochromic (pale centre >1/3 RBC diameter), microcytic RBCs, anisocytosis, poikilocytosis (pencil/elongated cells, target cells), and thrombocytosis.", keyFeatures:["Microcytic hypochromic RBCs","Pencil cells (elongated)","Anisocytosis + poikilocytosis","Target cells","Thrombocytosis (reactive)"], diagnosis:"Iron deficiency anaemia", teaching:"IDA: low Fe, high TIBC, low ferritin. Pencil cells (cigar cells) typical. Thrombocytosis reactive. Causes in India: dietary deficiency, hookworm. Treat cause + oral iron. IV iron if severe/malabsorption.", difficulty:"Easy" },
  { id:"ps5", title:"Peripheral smear — Acute lymphoblastic leukaemia (ALL)", category:"Peripheral Smear", subject:"Paediatrics", description:"Blood film showing large numbers of homogeneous lymphoblasts — cells with scant cytoplasm, fine chromatin, inconspicuous nucleoli, and occasional cytoplasmic vacuoles.", keyFeatures:["Lymphoblasts (>20% blasts)","Fine/open chromatin","Scant cytoplasm","Inconspicuous nucleoli","PAS positive (glycogen in ALL)"], diagnosis:"Acute Lymphoblastic Leukaemia (ALL)", teaching:"ALL: most common childhood cancer. Peak age 2-5 years. Pre-B cell ALL most common (CD10+, TdT+). Philadelphia chromosome t(9;22) in 25% adult ALL = poor prognosis. Treatment: VPLAD protocol.", difficulty:"Medium" },

  // Clinical (5)
  { id:"cl1", title:"Malar rash", category:"Clinical", subject:"Medicine", description:"Butterfly-shaped erythematous rash over the cheeks and nasal bridge, sparing the nasolabial folds. Fixed erythema, may be slightly raised. No scarring.", keyFeatures:["Butterfly distribution","Nasolabial folds spared","Photosensitive","Fixed/flush erythema","May be mistaken for rosacea (rosacea involves nasolabial folds)"], diagnosis:"Systemic Lupus Erythematosus (SLE) malar rash", teaching:"SLE malar rash: nasolabial fold sparing is key differentiator from rosacea. SLICC criteria: acute cutaneous lupus (malar rash) = 1 clinical criterion. Anti-dsDNA and anti-Sm = specific for SLE.", difficulty:"Easy" },
  { id:"cl2", title:"Koplik spots", category:"Clinical", subject:"Microbiology", description:"Small white/bluish-white spots on erythematous base on the buccal mucosa (opposite lower molars), appearing 2-3 days before the measles rash.", keyFeatures:["On buccal mucosa (opposite lower molars)","White spots on red base","Appear BEFORE rash (prodrome)","Pathognomonic for measles","Disappear as rash appears"], diagnosis:"Measles (Koplik spots)", teaching:"Koplik spots are PATHOGNOMONIC for measles. Measles rash: starts at hairline → face → trunk → limbs (centrifugal). Complications: pneumonia (most common cause of death), encephalitis, SSPE (late).", difficulty:"Easy" },
  { id:"cl3", title:"Kayser-Fleischer rings", category:"Clinical", subject:"Medicine", description:"Slit-lamp examination showing golden-brown granular ring of pigment at the periphery of the cornea (Descemet's membrane), most visible superiorly then inferiorly. Bilateral.", keyFeatures:["Golden-brown corneal ring","Peripheral location (Descemet's membrane)","Best seen on slit lamp","Bilateral","Not seen in all cases (absent in neurological WD 50%)"], diagnosis:"Wilson's disease (Kayser-Fleischer rings)", teaching:"KF rings = copper deposits in Descemet's membrane. Present in >95% neurological WD, 50% hepatic WD. Low ceruloplasmin, high urinary copper, liver biopsy = diagnostic. DOC: D-Penicillamine.", difficulty:"Medium" },
  { id:"cl4", title:"Janeway lesions", category:"Clinical", subject:"Medicine", description:"Small, painless erythematous or haemorrhagic macules on the palms and soles (thenar/hypothenar eminences). Non-tender, irregular borders. Blanch on pressure.", keyFeatures:["Palms and soles location","PAINLESS (vs Osler's nodes = painful)","Septic emboli (infective endocarditis)","Non-tender macules/papules","Haemorrhagic"], diagnosis:"Janeway lesions (infective endocarditis)", teaching:"IE peripheral signs: Janeway (painless, palms/soles = septic emboli), Osler's nodes (painful, pulp of fingers = immune complex), Roth spots (retina), splinter haemorrhages. Duke criteria: 2 major, or 1 major+3 minor, or 5 minor.", difficulty:"Medium" },
  { id:"cl5", title:"Argyll Robertson pupil", category:"Clinical", subject:"Medicine", description:"Small, irregular pupils that accommodate but do not react to light ('light-near dissociation'). Accommodation reflex preserved. Bilateral in syphilis.", keyFeatures:["Small irregular pupils","Light reflex absent","Accommodation reflex preserved","Bilateral in syphilis","'Prostitute's pupil' — accommodates but doesn't react"], diagnosis:"Argyll Robertson pupil (neurosyphilis)", teaching:"'Accommodates but doesn't react' = Argyll Robertson (syphilis). 'Reacts but doesn't accommodate' = Adie's tonic pupil. AR pupils: tertiary neurosyphilis. Caused by: mid-brain dorsal lesion (superior colliculus).", difficulty:"Hard" },

  // Ophthalmology (5)
  { id:"op1", title:"Papilloedema", category:"Ophthalmology", subject:"Medicine", description:"Fundus showing swollen optic disc with blurred margins (especially superiorly and inferiorly), peripapillary flame haemorrhages, dilated tortuous veins, absent spontaneous venous pulsations, and a cup-disc ratio of 0.", keyFeatures:["Blurred disc margins (superior + inferior first)","Peripapillary flame haemorrhages","Dilated tortuous veins","Absent SVP","Normal visual acuity initially"], diagnosis:"Papilloedema (raised ICP)", teaching:"Papilloedema = bilateral disc swelling from raised ICP. Causes: SOL, pseudotumour cerebri (IIH), meningitis, hypertensive crisis. IIH: obese women, LP pressure >25 cmH2O. Unilateral disc swelling = Foster Kennedy syndrome (ipsilateral optic atrophy + contralateral papilloedema).", difficulty:"Medium" },
  { id:"op2", title:"Diabetic retinopathy — proliferative", category:"Ophthalmology", subject:"Medicine", description:"Fundus photograph showing new vessels on disc (NVD) and elsewhere (NVE), vitreous haemorrhage (obscuring details), preretinal haemorrhage, fibrovascular proliferation, and multiple dot and blot haemorrhages.", keyFeatures:["New vessels on disc (NVD) or elsewhere","Preretinal/vitreous haemorrhage","Fibrovascular proliferations","Dot and blot haemorrhages","Cotton wool spots"], diagnosis:"Proliferative Diabetic Retinopathy (PDR)", teaching:"PDR = new vessel formation (NVD/NVE). Urgent pan-retinal photocoagulation (PRP). CRVO also causes NVE. Anti-VEGF (ranibizumab) for diabetic macular oedema. Screen: annually after 5 yr T1DM, at diagnosis T2DM.", difficulty:"Hard" },
  { id:"op3", title:"Cherry-red spot on macula", category:"Ophthalmology", subject:"Medicine", description:"Fundus showing pale/milky white ischaemic retina surrounding a bright red foveal area (cherry-red spot). Arteries thread-like, veins normal.", keyFeatures:["Bright red fovea against pale retina","White/pale surrounding retina","Thread-like attenuated arteries","Retinal oedema","Sudden painless visual loss"], diagnosis:"Central Retinal Artery Occlusion (CRAO)", teaching:"CRAO: sudden painless visual loss. Cherry-red spot (fovea preserved by choroid). Pale oedematous retina. Causes: embolism (carotid atherosclerosis most common), temporal arteritis (check ESR). Window for treatment: 90 min (thrombolysis).", difficulty:"Medium" },
  { id:"op4", title:"Bitot's spots", category:"Ophthalmology", subject:"PSM", description:"Temporal perilimbal conjunctiva showing triangular silvery-white foamy accumulations (Bitot's spots) with the base at the limbus. Keratin debris with Corynebacterium xerosis overgrowth.", keyFeatures:["Triangular foamy white patches","Temporal conjunctiva (most common)","Bilateral usually","Keratin + Corynebacterium","Associated with night blindness"], diagnosis:"Vitamin A deficiency (Bitot's spots — XN/X1B)", teaching:"WHO xerophthalmia classification: XN (night blindness), X1A (conjunctival xerosis), X1B (Bitot's spots), X2 (corneal xerosis), X3A (corneal ulcer <1/3), X3B (keratomalacia). Bitot's alone not diagnostic — treat with Vit A.", difficulty:"Easy" },
  { id:"op5", title:"Optic atrophy", category:"Ophthalmology", subject:"Medicine", description:"Fundus showing pale (white/chalk-white) optic disc with sharply defined margins. Reduced number of vessels on disc surface. Cup-disc ratio may be normal.", keyFeatures:["Pale chalk-white disc","Sharp margins (vs papilloedema = blurred)","Reduced disc vasculature","Vision loss (central or peripheral)","Afferent pupillary defect"], diagnosis:"Optic atrophy", teaching:"Optic atrophy causes: METHANOL (toxic), MS, Glaucoma, Ischaemia (AION), Paget's, Syphilis, Trauma, Hereditary (Leber's). Primary optic atrophy: pale disc, sharp margins. Secondary: following papilloedema (disc elevation then pale).", difficulty:"Medium" },
];

const CATEGORIES = ["All", "Histopathology", "Radiology", "Clinical", "ECG", "Peripheral Smear", "Ophthalmology"] as const;
type Category = typeof CATEGORIES[number];

const DIFF_COLORS = { Easy: "text-green-400 bg-green-500/10", Medium: "text-amber-400 bg-amber-500/10", Hard: "text-rose-400 bg-rose-500/10" };

export function ImageBank() {
  const [category, setCategory] = useState<Category>("All");
  const [mode, setMode] = useState<"browse" | "quiz">("browse");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState({ easy: 0, hard: 0 });
  const [practiced, setPracticed] = useState<Set<string>>(new Set());

  const filtered = useMemo(() =>
    category === "All" ? CASES : CASES.filter(c => c.category === category),
    [category]
  );

  const quizCases = useMemo(() => filtered, [filtered]);
  const currentQuizCase = quizCases[quizIdx];

  const markQuiz = (easy: boolean) => {
    if (currentQuizCase) {
      setPracticed(prev => new Set([...prev, currentQuizCase.id]));
      setQuizScore(s => easy ? { ...s, easy: s.easy + 1 } : { ...s, hard: s.hard + 1 });
    }
    setQuizRevealed(false);
    setQuizIdx(i => i + 1);
  };

  const resetQuiz = () => { setQuizIdx(0); setQuizRevealed(false); setQuizScore({ easy: 0, hard: 0 }); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Image Bank</h2>
          <p className="text-sm text-muted-foreground font-mono">{CASES.length} cases · {practiced.size} practiced this session</p>
        </div>
        <div className="flex gap-2">
          {(["browse", "quiz"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); resetQuiz(); }} className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {m === "browse" ? "Browse" : "Quiz Mode"}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); setQuizIdx(0); }} className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
            {cat === "All" ? `All (${CASES.length})` : `${cat} (${CASES.filter(c => c.category === cat).length})`}
          </button>
        ))}
      </div>

      {mode === "browse" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">{c.category}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${DIFF_COLORS[c.difficulty]}`}>{c.difficulty}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{c.subject}</span>
              </div>
              <div className="font-medium text-foreground text-sm">{c.description}</div>
              <div className="flex flex-col gap-1">
                {c.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span> {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setRevealed(r => ({ ...r, [c.id]: !r[c.id] }))}
                className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                {revealed[c.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {revealed[c.id] ? "Hide Diagnosis" : "Reveal Diagnosis"}
              </button>
              {revealed[c.id] && (
                <div className="border-t border-border pt-3 flex flex-col gap-2">
                  <div className="text-sm font-bold text-primary">{c.diagnosis}</div>
                  <div className="text-xs text-muted-foreground">{c.teaching}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === "quiz" && (
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
          {/* Score */}
          <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-mono text-green-400">{quizScore.easy} Easy</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-mono text-rose-400">{quizScore.hard} Hard</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-auto">{quizIdx} / {quizCases.length}</span>
          </div>

          {quizIdx >= quizCases.length ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <div className="text-lg font-bold text-foreground">Quiz Complete!</div>
              <div className="text-sm text-muted-foreground">Easy: {quizScore.easy} · Hard: {quizScore.hard}</div>
              <button onClick={resetQuiz} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Try Again</button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
              {currentQuizCase && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">{currentQuizCase.category}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${DIFF_COLORS[currentQuizCase.difficulty]}`}>{currentQuizCase.difficulty}</span>
                  </div>
                  <div className="text-foreground">{currentQuizCase.description}</div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-mono text-muted-foreground">Key Features:</div>
                    {currentQuizCase.keyFeatures.map((f, i) => (
                      <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>{f}
                      </div>
                    ))}
                  </div>
                  {!quizRevealed ? (
                    <button onClick={() => setQuizRevealed(true)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-mono">Reveal Diagnosis</button>
                  ) : (
                    <div className="flex flex-col gap-3 border-t border-border pt-4">
                      <div className="text-lg font-bold text-primary">{currentQuizCase.diagnosis}</div>
                      <div className="text-sm text-muted-foreground">{currentQuizCase.teaching}</div>
                      <div className="flex gap-3">
                        <button onClick={() => markQuiz(true)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600/20 border border-green-600/30 text-green-400 rounded-lg text-sm font-mono hover:bg-green-600/30">
                          <CheckCircle className="w-4 h-4" /> Easy
                        </button>
                        <button onClick={() => markQuiz(false)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-600/20 border border-rose-600/30 text-rose-400 rounded-lg text-sm font-mono hover:bg-rose-600/30">
                          <XCircle className="w-4 h-4" /> Hard
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
