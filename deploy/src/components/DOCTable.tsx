import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";

interface DOCEntry {
  condition: string;
  doc: string;
  alternative?: string;
  notes?: string;
  subject: string;
}

const DOC_DATA: DOCEntry[] = [
  // Medicine - Cardiology
  { condition:"Heart failure (HFrEF)", doc:"Sacubitril/Valsartan (ARNI) + Beta-blocker + MRA + SGLT2i", alternative:"ACEi if ARNI not tolerated", notes:"NYHA II–IV; SGLT2i added per 2022 ESC", subject:"Medicine" },
  { condition:"Atrial fibrillation — rate control", doc:"Beta-blocker", alternative:"Digoxin (if HF)", notes:"Target HR <110 bpm", subject:"Medicine" },
  { condition:"Atrial fibrillation — rhythm control", doc:"Amiodarone", alternative:"Flecainide (no structural HD)", subject:"Medicine" },
  { condition:"SVT (acute)", doc:"Adenosine", alternative:"Verapamil", notes:"Vagal manoeuvres first", subject:"Medicine" },
  { condition:"Ventricular tachycardia (acute)", doc:"Amiodarone IV", alternative:"Lidocaine", subject:"Medicine" },
  { condition:"STEMI", doc:"Primary PCI (within 90 min)", alternative:"Streptokinase (if PCI unavailable within 120 min)", subject:"Medicine" },
  { condition:"Hypertensive emergency", doc:"IV Sodium nitroprusside", alternative:"IV Labetalol / Nicardipine", subject:"Medicine" },
  { condition:"Resistant hypertension", doc:"Add spironolactone (4th drug)", alternative:"Amiloride", notes:"After maximising ACEi/ARB + CCB + thiazide", subject:"Medicine" },
  { condition:"HCM (symptomatic)", doc:"Beta-blocker", alternative:"Verapamil (if BB intolerant)", subject:"Medicine" },
  // Medicine - Respiratory
  { condition:"COPD acute exacerbation", doc:"SABA (salbutamol) + SAMA (ipratropium) + systemic corticosteroid", alternative:"Prednisolone 40mg x 5 days", notes:"Add antibiotics if purulent sputum", subject:"Medicine" },
  { condition:"Severe acute asthma", doc:"IV Salbutamol + IV MgSO4", alternative:"Heliox", notes:"MgSO4 2g IV over 20 min", subject:"Medicine" },
  { condition:"Pulmonary TB (drug-sensitive)", doc:"2HRZE / 4HR (NTEP 2023)", notes:"H=INH, R=Rifampicin, Z=PZA, E=Ethambutol", subject:"Medicine" },
  { condition:"MDR-TB", doc:"Bedaquiline + Linezolid + Pretomanid (BPaL)", alternative:"Bedaquiline-based longer regimen", subject:"Medicine" },
  { condition:"PCP (Pneumocystis jirovecii)", doc:"TMP-SMX (Co-trimoxazole)", alternative:"Pentamidine", notes:"Adjuvant steroids if PaO2 <70 mmHg", subject:"Medicine" },
  // Medicine - Neurology
  { condition:"Status epilepticus — 1st line", doc:"Lorazepam IV 0.1 mg/kg", alternative:"Diazepam IV/rectal", subject:"Medicine" },
  { condition:"Status epilepticus — 2nd line", doc:"IV Levetiracetam 60 mg/kg", alternative:"Phenytoin / Valproate IV", subject:"Medicine" },
  { condition:"Absence seizures", doc:"Ethosuximide", alternative:"Sodium valproate", notes:"Valproate if myoclonic component", subject:"Medicine" },
  { condition:"Juvenile myoclonic epilepsy", doc:"Sodium valproate", alternative:"Levetiracetam", subject:"Medicine" },
  { condition:"Trigeminal neuralgia", doc:"Carbamazepine", alternative:"Oxcarbazepine", subject:"Medicine" },
  { condition:"Migraine — acute", doc:"Sumatriptan (triptan)", alternative:"Naproxen + metoclopramide", subject:"Medicine" },
  { condition:"Migraine — prophylaxis", doc:"Propranolol", alternative:"Topiramate / Amitriptyline", subject:"Medicine" },
  { condition:"Bacterial meningitis", doc:"Ceftriaxone 2g IV BD + Dexamethasone", alternative:"Ampicillin (Listeria coverage in elderly)", subject:"Medicine" },
  { condition:"Myasthenia gravis", doc:"Pyridostigmine (symptom control)", alternative:"Prednisolone + Azathioprine (immunosuppression)", subject:"Medicine" },
  { condition:"Wilson's disease", doc:"D-Penicillamine", alternative:"Trientine (if D-pen intolerant)", subject:"Medicine" },
  { condition:"Parkinson's disease — early", doc:"Levodopa + Carbidopa", alternative:"Dopamine agonist (pramipexole) in young onset", subject:"Medicine" },
  { condition:"Cerebral malaria", doc:"IV Artesunate", alternative:"IV Quinine", subject:"Medicine" },
  // Medicine - Endocrinology
  { condition:"Type 2 diabetes — 1st line", doc:"Metformin", notes:"Add SGLT2i/GLP-1 if CVD/CKD", subject:"Medicine" },
  { condition:"DKA", doc:"IV Regular insulin infusion + IV 0.9% NaCl + K+ replacement", notes:"Start K+ when K <5.5 mEq/L", subject:"Medicine" },
  { condition:"HHS (Hyperosmolar)", doc:"IV 0.9% NaCl (aggressive) + Low-dose insulin (once glucose falling)", subject:"Medicine" },
  { condition:"Thyroid storm", doc:"PTU + Beta-blocker (propranolol) + Iodine (Lugol's) + Hydrocortisone", notes:"PTU blocks synthesis AND T4→T3 conversion", subject:"Medicine" },
  { condition:"Hyperthyroidism (Graves')", doc:"Carbimazole", alternative:"PTU (in 1st trimester / thyroid storm)", subject:"Medicine" },
  { condition:"Addison's disease", doc:"Hydrocortisone (GC) + Fludrocortisone (MC)", subject:"Medicine" },
  { condition:"SIADH", doc:"Fluid restriction", alternative:"Demeclocycline / Tolvaptan (severe)", subject:"Medicine" },
  { condition:"Severe symptomatic hyponatraemia", doc:"3% hypertonic saline", notes:"Correct no faster than 8–10 mEq/L/24h (risk of osmotic demyelination)", subject:"Medicine" },
  { condition:"Hyperkalaemia (cardiac emergency)", doc:"IV Calcium gluconate (cardioprotection)", notes:"Then insulin+glucose + salbutamol nebulisation to shift K+", subject:"Medicine" },
  { condition:"Cushing's (pituitary — Cushing's disease)", doc:"Transsphenoidal surgery", alternative:"Ketoconazole (medical)", subject:"Medicine" },
  // Medicine - GI/Hepatology
  { condition:"H. pylori eradication", doc:"Triple therapy: PPI + Clarithromycin + Amoxicillin x 14 days", alternative:"Quadruple if clarithromycin resistance high", subject:"Medicine" },
  { condition:"Acute variceal bleed", doc:"Terlipressin + Endoscopic band ligation", alternative:"Somatostatin analogue (octreotide)", subject:"Medicine" },
  { condition:"Spontaneous bacterial peritonitis (SBP)", doc:"IV Cefotaxime (3rd-gen cephalosporin)", alternative:"IV Piperacillin-tazobactam", subject:"Medicine" },
  { condition:"Hepatic encephalopathy", doc:"Lactulose", alternative:"Rifaximin (addition/maintenance)", subject:"Medicine" },
  { condition:"Ulcerative colitis — mild/moderate", doc:"5-ASA (Mesalazine)", alternative:"Oral prednisolone", subject:"Medicine" },
  { condition:"Crohn's disease — moderate/severe", doc:"Infliximab / Adalimumab (anti-TNF)", alternative:"Vedolizumab / Ustekinumab", subject:"Medicine" },
  { condition:"Achalasia", doc:"Laparoscopic Heller myotomy + Dor fundoplication", alternative:"Pneumatic dilation", subject:"Medicine" },
  // Medicine - Nephrology
  { condition:"Minimal change disease", doc:"Prednisolone 1 mg/kg/day", alternative:"Cyclophosphamide (frequent relapsers)", subject:"Medicine" },
  { condition:"IgA nephropathy (progressive)", doc:"ACEi/ARB (blood pressure + proteinuria control)", alternative:"Corticosteroids if proteinuria >1g/day", subject:"Medicine" },
  { condition:"RPGN / Anti-GBM disease", doc:"Pulse methylprednisolone + Cyclophosphamide + Plasmapheresis", subject:"Medicine" },
  { condition:"CKD-associated anaemia", doc:"Erythropoiesis-stimulating agents (ESA) + IV Iron", subject:"Medicine" },
  { condition:"Hyperuricaemia / Gout (chronic)", doc:"Allopurinol (urate-lowering)", alternative:"Febuxostat (if allopurinol intolerant)", subject:"Medicine" },
  { condition:"Acute gout (attack)", doc:"NSAIDs (indomethacin)", alternative:"Colchicine / Prednisolone", subject:"Medicine" },
  // Pharmacology
  { condition:"Opioid overdose", doc:"Naloxone", notes:"0.4–2 mg IV; repeat every 2–3 min", subject:"Pharmacology" },
  { condition:"Benzodiazepine overdose", doc:"Flumazenil", notes:"Short-acting; watch for re-sedation", subject:"Pharmacology" },
  { condition:"Paracetamol overdose", doc:"N-Acetylcysteine (NAC)", notes:"Most effective within 8–10 hrs; Rumack-Matthew nomogram", subject:"Pharmacology" },
  { condition:"Heparin overdose", doc:"Protamine sulfate", notes:"1 mg protamine per 100 IU heparin", subject:"Pharmacology" },
  { condition:"Warfarin overdose (urgent reversal)", doc:"4-factor PCC (prothrombin complex concentrate) + Vitamin K", alternative:"FFP if PCC unavailable", subject:"Pharmacology" },
  { condition:"Organophosphate poisoning", doc:"Atropine (large doses) + Pralidoxime", notes:"Atropine until secretions dry; pralidoxime within 24–48h", subject:"Pharmacology" },
  { condition:"Cyanide poisoning", doc:"Hydroxycobalamin IV", alternative:"Sodium thiosulfate + Amyl nitrite", subject:"Pharmacology" },
  { condition:"Carbon monoxide poisoning", doc:"100% O2 (high-flow mask)", alternative:"Hyperbaric O2 (if severe / pregnancy)", subject:"Pharmacology" },
  { condition:"Methanol / Ethylene glycol poisoning", doc:"Fomepizole (4-methylpyrazole)", alternative:"Ethanol IV (if fomepizole unavailable)", subject:"Pharmacology" },
  { condition:"Iron overdose", doc:"Deferoxamine (chelation)", subject:"Pharmacology" },
  { condition:"Lead poisoning (encephalopathy)", doc:"Dimercaprol (BAL) + CaNa2EDTA", subject:"Pharmacology" },
  { condition:"NMS (Neuroleptic Malignant Syndrome)", doc:"Stop antipsychotic + Dantrolene + Bromocriptine", subject:"Pharmacology" },
  { condition:"Serotonin syndrome", doc:"Cyproheptadine + Supportive care", notes:"Stop all serotonergic agents", subject:"Pharmacology" },
  // Microbiology / Infections
  { condition:"MRSA", doc:"Vancomycin IV", alternative:"Linezolid / Daptomycin / Teicoplanin", subject:"Microbiology" },
  { condition:"VRE (Vancomycin-resistant Enterococcus)", doc:"Linezolid", alternative:"Daptomycin", subject:"Microbiology" },
  { condition:"ESBL-producing organisms", doc:"Carbapenems (Meropenem / Imipenem)", subject:"Microbiology" },
  { condition:"Pseudomonas aeruginosa", doc:"Piperacillin-Tazobactam", alternative:"Ceftazidime / Cefepime / Meropenem", subject:"Microbiology" },
  { condition:"Cryptococcal meningitis", doc:"Amphotericin B deoxycholate + Flucytosine (induction)", alternative:"Fluconazole (consolidation)", subject:"Microbiology" },
  { condition:"Invasive aspergillosis", doc:"Voriconazole", alternative:"Liposomal Amphotericin B", subject:"Microbiology" },
  { condition:"CMV retinitis (HIV)", doc:"Ganciclovir IV", alternative:"Valganciclovir (oral, maintenance)", subject:"Microbiology" },
  { condition:"Visceral leishmaniasis (Kala-azar, India)", doc:"Liposomal Amphotericin B", alternative:"Miltefosine (oral)", notes:"WHO-recommended for India since 2010", subject:"Microbiology" },
  { condition:"Malaria — P. falciparum (uncomplicated)", doc:"Artemether-Lumefantrine (AL)", alternative:"Artesunate-Mefloquine", subject:"Microbiology" },
  { condition:"Malaria — P. vivax", doc:"Chloroquine + Primaquine", notes:"Primaquine for radical cure (check G6PD)", subject:"Microbiology" },
  { condition:"Toxoplasmosis (CNS)", doc:"Pyrimethamine + Sulfadiazine + Folinic acid", subject:"Microbiology" },
  { condition:"Filariasis (lymphatic) — MDA India", doc:"DEC + Albendazole + Ivermectin (triple drug)", subject:"Microbiology" },
  // OBG
  { condition:"PPH — uterotonic (1st line)", doc:"Oxytocin 10 IU IM", alternative:"Syntometrine (oxytocin+ergometrine)", subject:"OBG" },
  { condition:"PPH refractory to oxytocin", doc:"Carboprost (15-methyl PGF2α)", alternative:"Misoprostol / Tranexamic acid", subject:"OBG" },
  { condition:"Pre-eclampsia — seizure prophylaxis", doc:"MgSO4 (Pritchard regime)", notes:"Monitor reflexes/UO/RR; Ca gluconate as antidote", subject:"OBG" },
  { condition:"Pre-eclampsia — antihypertensive", doc:"Labetalol IV (acute)", alternative:"Nifedipine / Hydralazine", subject:"OBG" },
  { condition:"Gestational diabetes", doc:"Metformin (2nd trimester onwards)", alternative:"Insulin (if targets not met)", subject:"OBG" },
  { condition:"Ectopic pregnancy (unruptured, stable)", doc:"Methotrexate IM", notes:"hCG <5000, no fetal cardiac activity, tube <4cm", subject:"OBG" },
  { condition:"PCOS — ovulation induction", doc:"Clomiphene citrate", alternative:"Letrozole (better live birth rates, off-label)", subject:"OBG" },
  { condition:"PCOS — insulin resistance", doc:"Metformin", subject:"OBG" },
  { condition:"Tocolysis (preterm labour)", doc:"Nifedipine (calcium channel blocker)", alternative:"Atosiban (oxytocin antagonist)", notes:"Aim for 48h to complete steroids", subject:"OBG" },
  { condition:"Cervical ripening", doc:"Misoprostol (PGE1)", alternative:"Dinoprostone (PGE2 gel)", subject:"OBG" },
  // Paediatrics
  { condition:"Neonatal sepsis (early onset <72h)", doc:"Ampicillin + Gentamicin", subject:"Paediatrics" },
  { condition:"Neonatal sepsis (late onset >72h)", doc:"Vancomycin + Cefotaxime/Ceftazidime", subject:"Paediatrics" },
  { condition:"Neonatal seizures — 1st line", doc:"Phenobarbitone 20 mg/kg IV loading dose", alternative:"Levetiracetam", subject:"Paediatrics" },
  { condition:"RSV bronchiolitis", doc:"Supportive (O2 + IV fluids + NG feeds)", notes:"No role for bronchodilators/steroids routinely", subject:"Paediatrics" },
  { condition:"Croup (laryngotracheitis) — moderate/severe", doc:"Nebulised epinephrine + Oral/IM Dexamethasone", subject:"Paediatrics" },
  { condition:"Kawasaki disease", doc:"IVIG 2g/kg single infusion + Aspirin", notes:"Within 10 days of fever onset", subject:"Paediatrics" },
  { condition:"Acute rheumatic fever prophylaxis", doc:"Benzathine penicillin G IM monthly", notes:"Duration: 10 years or until age 25 (whichever longer)", subject:"Paediatrics" },
  { condition:"SAM management", doc:"F-75 (stabilisation) → F-100 / RUTF (rehabilitation)", subject:"Paediatrics" },
  { condition:"Childhood ITP (acute)", doc:"Observation (if mild) / IVIG (if bleeding)", alternative:"Prednisolone", subject:"Paediatrics" },
  { condition:"Childhood ALL (induction)", doc:"Vincristine + Prednisolone + L-Asparaginase ± Daunorubicin", subject:"Paediatrics" },
  { condition:"Neonatal Vitamin K deficiency bleeding", doc:"Vitamin K1 (phytomenadione) prophylaxis at birth", subject:"Paediatrics" },
  // PSM
  { condition:"Cholera", doc:"ORS + Doxycycline (adults)", alternative:"Azithromycin (children/pregnancy)", subject:"PSM" },
  { condition:"Plague", doc:"Streptomycin IM", alternative:"Doxycycline / Gentamicin", subject:"PSM" },
  { condition:"Typhoid (uncomplicated)", doc:"Azithromycin", alternative:"Ceftriaxone IV (complicated)", notes:"Fluoroquinolone resistance common in India", subject:"PSM" },
  { condition:"Meningococcal meningitis", doc:"Ceftriaxone IV + Dexamethasone", notes:"Rifampicin prophylaxis for close contacts", subject:"PSM" },
  // Psychiatry (Pharmacology)
  { condition:"Schizophrenia — 1st episode", doc:"Risperidone / Olanzapine (atypical)", notes:"Fewer EPS than typicals", subject:"Pharmacology" },
  { condition:"Treatment-resistant schizophrenia", doc:"Clozapine", notes:"Monitor WBC weekly (risk of agranulocytosis)", subject:"Pharmacology" },
  { condition:"Bipolar disorder — acute mania", doc:"Lithium / Sodium valproate", notes:"Lithium: narrow TI; monitor levels + renal function", subject:"Pharmacology" },
  { condition:"Depression — 1st line", doc:"SSRI (Fluoxetine / Sertraline)", subject:"Pharmacology" },
  { condition:"OCD", doc:"SSRI (Fluoxetine / Fluvoxamine) + CBT", subject:"Pharmacology" },
  { condition:"Alcohol withdrawal — acute", doc:"Chlordiazepoxide (benzodiazepine)", alternative:"Diazepam / Lorazepam", subject:"Pharmacology" },
  { condition:"Alcohol dependence — relapse prevention", doc:"Naltrexone", alternative:"Acamprosate / Disulfiram", subject:"Pharmacology" },
];

const SUBJECT_COLORS: Record<string, string> = {
  Medicine:     "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pharmacology: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Microbiology: "bg-green-500/20 text-green-400 border-green-500/30",
  OBG:          "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Paediatrics:  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  PSM:          "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Surgery:      "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Pathology:    "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const ALL_SUBJECTS = Array.from(new Set(DOC_DATA.map(d => d.subject))).sort();

export function DOCTable() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sortCol, setSortCol] = useState<"condition" | "doc" | "subject">("condition");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let data = DOC_DATA.filter(e => {
      const matchSearch = !q || e.condition.toLowerCase().includes(q) || e.doc.toLowerCase().includes(q) || (e.alternative ?? "").toLowerCase().includes(q) || e.subject.toLowerCase().includes(q);
      const matchSubject = subjectFilter === "All" || e.subject === subjectFilter;
      return matchSearch && matchSubject;
    });
    data = [...data].sort((a, b) => {
      const av = a[sortCol] ?? "";
      const bv = b[sortCol] ?? "";
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [search, subjectFilter, sortCol, sortAsc]);

  const handleSort = (col: "condition" | "doc" | "subject") => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(true); }
  };

  const exportCSV = () => {
    const headers = ["Condition", "Drug of Choice", "Alternative", "Notes", "Subject"];
    const rows = filtered.map(e => [e.condition, e.doc, e.alternative ?? "", e.notes ?? "", e.subject].map(v => `"${v.replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "doc-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Drug of Choice (DOC) Master Table</h2>
          <p className="text-sm text-muted-foreground font-mono">{filtered.length} of {DOC_DATA.length} entries</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            placeholder="Search condition, drug, or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...ALL_SUBJECTS].map(s => (
          <button
            key={s}
            onClick={() => setSubjectFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${subjectFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              {[
                { key: "condition" as const, label: "Condition" },
                { key: "doc" as const, label: "Drug of Choice" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground select-none"
                  onClick={() => handleSort(key)}
                >
                  {label} {sortCol === key ? (sortAsc ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Alternative</th>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">Notes</th>
              <th
                className="px-4 py-3 text-left text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground select-none"
                onClick={() => handleSort("subject")}
              >
                Subject {sortCol === "subject" ? (sortAsc ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{entry.condition}</td>
                <td className="px-4 py-3 text-primary font-mono text-xs">{entry.doc}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{entry.alternative ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs italic">{entry.notes ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${SUBJECT_COLORS[entry.subject] ?? "bg-card border-border text-muted-foreground"}`}>
                    {entry.subject}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">No entries match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
