import { useState } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus, BookOpen } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type Year = 2022 | 2023 | 2024;

interface SubjectData {
  count: number;
  hotspots: string[];
}

interface YearData {
  [subject: string]: SubjectData;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const PAPER_DATA: Record<Year, YearData> = {
  2024: {
    "Medicine":              { count: 38, hotspots: ["Heart failure (ARNI/SGLT2i)", "CKD management (KDIGO)", "Stroke (tPA window)", "Diabetes (ADA 2024 targets)", "Autoimmune disorders (SLE/RA)"] },
    "Surgery":               { count: 28, hotspots: ["Inguinal hernia (Lichtenstein vs TEP)", "Breast cancer (SLNB/MRM)", "ATLS shock classification", "Colorectal cancer (Duke/TNM staging)", "Thyroid surgery complications (RLN)"] },
    "OBG":                   { count: 22, hotspots: ["PPH management (4 Ts)", "Pre-eclampsia (MgSO4 toxicity)", "PCOS (Rotterdam criteria)", "Cervical cancer (HPV/FIGO 2018)", "Bishop score interpretation"] },
    "Paediatrics":           { count: 18, hotspots: ["UIP vaccine schedule", "Developmental milestones", "SAM management (F-75/F-100/RUTF)", "Neonatal RDS (surfactant therapy)", "Tetralogy of Fallot features"] },
    "PSM/Community Medicine":{ count: 18, hotspots: ["NFHS-5 statistics (MMR/IMR/TFR)", "Sensitivity/specificity calculations", "Wilson-Jungner criteria", "PHC norms (IPHS 2022)", "Vector-borne disease elimination targets"] },
    "Pathology":             { count: 16, hotspots: ["MI histological timeline", "Glomerulonephritis (IgA vs membranous)", "Reed-Sternberg cells (Hodgkin)", "Amyloid (Congo red/apple-green)", "Tumour suppressors (p53/Rb/BRCA)"] },
    "Pharmacology":          { count: 14, hotspots: ["DOC per condition (seizure/HTN/DM)", "Drug teratogens in pregnancy", "Warfarin interactions (CYP enzymes)", "Antiepileptic choices", "Antihypertensive compelling indications"] },
    "Microbiology":          { count: 12, hotspots: ["HBV serology interpretation", "HIV staging (CD4 thresholds)", "Malaria species differentiation", "MRSA treatment (vancomycin)", "Gram stain morphology patterns"] },
    "Biochemistry":          { count: 10, hotspots: ["Enzyme kinetics (Km/Vmax)", "Lysosomal storage disorders (Gaucher/Tay-Sachs)", "Porphyrias (AIP vs PCT)", "DNA repair mechanisms", "Vitamin deficiency clinical features"] },
    "Anatomy":               { count: 8,  hotspots: ["Nerve injuries and corresponding fractures", "Inguinal canal contents", "Portal-systemic anastomoses", "Surgical triangles of neck"] },
    "Physiology":            { count: 8,  hotspots: ["Frank-Starling law", "JVP waveforms", "Renal physiology (GFR/tubular)", "Cardiac cycle (Wiggers diagram)"] },
    "Forensic Medicine":     { count: 4,  hotspots: ["NDPS Act quantities/schedules", "MHCA 2017 key sections", "Rigor mortis timeline", "MTP Act 2021 limits"] },
    "ENT/Ophthalmology":     { count: 4,  hotspots: ["Trachoma grading (WHO FISTO)", "SNHL causes and diagnosis", "Leprosy (Ridley-Jopling classification)", "Glaucoma types (open vs closed angle)"] },
  },
  2023: {
    "Medicine":              { count: 36, hotspots: ["Renal tubular acidosis types", "Heart failure (ARNI/SGLT2i)", "Pulmonary embolism (CTPA/CTPA)", "SLE (SLICC criteria)", "IBD (Crohn vs UC)"] },
    "Surgery":               { count: 26, hotspots: ["Appendicitis (Alvarado score)", "Breast cancer staging", "Acute pancreatitis (Ranson/APACHE)", "Burns (Parkland formula)", "Hepatobiliary surgery (Klatskin/Whipple)"] },
    "OBG":                   { count: 24, hotspots: ["Placenta praevia grading", "Molar pregnancy (complete vs partial)", "Ectopic pregnancy (methotrexate)", "FIGO staging (cervix/ovary)", "Cardinal movements of labour"] },
    "Paediatrics":           { count: 18, hotspots: ["Kawasaki disease (IVIG)", "Cystic fibrosis (sweat test)", "Neonatal jaundice (phototherapy)", "VSD vs ASD (acyanotic CHD)", "Hirschsprung's disease"] },
    "PSM/Community Medicine":{ count: 20, hotspots: ["Epidemiological study designs", "NFHS-4 to NFHS-5 comparison", "National programmes (NTEP/NHM)", "Statistics (Type I/II error, NNT)", "Epidemic investigation steps"] },
    "Pathology":             { count: 16, hotspots: ["Coagulative vs liquefactive necrosis", "Psammoma bodies (which tumours)", "Philadelphia chromosome (BCR-ABL)", "Li-Fraumeni syndrome (p53)", "Amyloid subtypes (AL/AA)"] },
    "Pharmacology":          { count: 14, hotspots: ["Antifungal mechanisms", "Immunosuppressants (calcineurin inhibitors)", "NMS vs Serotonin syndrome", "Adverse effects of antibiotics", "DOC for specific infections"] },
    "Microbiology":          { count: 12, hotspots: ["TB diagnosis (Mantoux/IGRA)", "Dengue serology (NS1/IgM)", "Rickettsial infections (Weil-Felix)", "Sexually transmitted infections", "COVID-19 (ACE2 receptor)"] },
    "Biochemistry":          { count: 10, hotspots: ["Urea cycle disorders", "Fatty acid synthesis (acetyl-CoA carboxylase)", "Scurvy (collagen hydroxylation)", "G6PD deficiency", "Homocystinuria (CBS)"] },
    "Anatomy":               { count: 10, hotspots: ["Brachial plexus injuries (Erb/Klumpke)", "Femoral triangle anatomy", "Spinal cord blood supply (Adamkiewicz)", "Cavernous sinus contents", "Ductus arteriosus/venosus"] },
    "Physiology":            { count: 8,  hotspots: ["Acid-base balance (bicarbonate buffer)", "ADH regulation (osmolality vs volume)", "Cardiac output (Fick principle)", "Oxygen-haemoglobin dissociation curve"] },
    "Forensic Medicine":     { count: 2,  hotspots: ["MTP Act provisions", "NDPS Act schedules"] },
    "ENT/Ophthalmology":     { count: 4,  hotspots: ["Cholesteatoma management", "Retinal detachment vs CRAO", "Allergic rhinitis management", "Colour blindness genetics"] },
  },
  2022: {
    "Medicine":              { count: 40, hotspots: ["Cardiac arrhythmias (management)", "Nephrotic vs nephritic syndrome", "Thyroid disorders (Graves vs Hashimoto)", "Vasculitis (GPA/MPA/eosinophilic)", "Acid-base disorders (ABG interpretation)"] },
    "Surgery":               { count: 26, hotspots: ["Varicose veins (Trendelenburg test)", "Hernias (types and anatomy)", "Colon carcinoma (Duke's staging)", "Meckel's diverticulum (rule of 2s)", "Salivary gland tumours (pleomorphic adenoma)"] },
    "OBG":                   { count: 22, hotspots: ["Infertility (tubal factor/PCOS)", "Amenorrhoea (primary/secondary)", "Gestational trophoblastic disease", "Rupture uterus", "HRT indications/contraindications"] },
    "Paediatrics":           { count: 16, hotspots: ["Vitamin D deficiency (rickets X-ray)", "Immunodeficiency disorders", "SAM (MUAC criteria)", "Congenital rubella syndrome", "Newborn metabolic screening"] },
    "PSM/Community Medicine":{ count: 18, hotspots: ["SWOT analysis/health planning", "Sampling methods", "Vital statistics (SRS/NFHS)", "National immunisation schedule", "Occupational health (pneumoconiosis)"] },
    "Pathology":             { count: 16, hotspots: ["Tumour markers (AFP/CEA/CA-125)", "Haematological malignancies (NHL classification)", "Viral hepatitis pathology", "Chronic inflammation granuloma", "Paraneoplastic syndromes"] },
    "Pharmacology":          { count: 12, hotspots: ["Benzodiazepine pharmacology", "Cancer chemotherapy mechanisms", "Drug-drug interactions (P450)", "Autonomic pharmacology", "Antimalarial drugs"] },
    "Microbiology":          { count: 10, hotspots: ["Enterobacteriaceae differentiation", "Opportunistic infections in HIV", "Antifungal susceptibility", "Prion diseases", "Viral replication mechanisms"] },
    "Biochemistry":          { count: 8,  hotspots: ["Glycolysis enzymes and regulation", "Amino acid metabolism (PKU/tyrosinaemia)", "Lipid transport (lipoproteins)", "Nucleotide metabolism (de novo vs salvage)", "Electron transport chain"] },
    "Anatomy":               { count: 10, hotspots: ["Cranial nerve examination", "Inguinal region anatomy", "Heart anatomy (valves/chambers)", "Lymphatic drainage (breast/testis)", "Blood supply of spinal cord"] },
    "Physiology":            { count: 10, hotspots: ["Neuromuscular junction physiology", "Hormonal regulation (hypothalamic-pituitary axis)", "Respiratory physiology (dead space/V-Q mismatch)", "GI physiology (motility/secretion)", "Renal physiology (countercurrent)"] },
    "Forensic Medicine":     { count: 6,  hotspots: ["Rigor mortis and other PMCs", "Sexual offences (IPC/POCSO)", "Medical negligence (304A IPC)", "Firearm injuries", "Drowning (vital signs)"] },
    "ENT/Ophthalmology":     { count: 6,  hotspots: ["Otosclerosis (hearing loss pattern)", "Presbycusis vs noise-induced SNHL", "Cataract surgery (IOL types)", "Diabetic retinopathy grading", "Epistaxis management (Woodruff's plexus)"] },
  },
};

const SUBJECT_ORDER = [
  "Medicine", "Surgery", "OBG", "Paediatrics", "PSM/Community Medicine",
  "Pathology", "Pharmacology", "Microbiology", "Biochemistry",
  "Anatomy", "Physiology", "Forensic Medicine", "ENT/Ophthalmology",
];

const SUBJECT_COLORS: Record<string, string> = {
  "Medicine":               "#3b82f6",
  "Surgery":                "#ef4444",
  "OBG":                    "#ec4899",
  "Paediatrics":            "#06b6d4",
  "PSM/Community Medicine": "#22c55e",
  "Pathology":              "#f59e0b",
  "Pharmacology":           "#8b5cf6",
  "Microbiology":           "#14b8a6",
  "Biochemistry":           "#f97316",
  "Anatomy":                "#84cc16",
  "Physiology":             "#0ea5e9",
  "Forensic Medicine":      "#f43f5e",
  "ENT/Ophthalmology":      "#a855f7",
};

type Trend = "up" | "down" | "same";
function getTrend(curr: number, prev: number): Trend {
  if (curr > prev + 1) return "up";
  if (curr < prev - 1) return "down";
  return "same";
}

// ─── Component ─────────────────────────────────────────────────────────────
export function NEETPGPaperAnalysis() {
  const [year, setYear] = useState<Year>(2024);
  const [expanded, setExpanded] = useState<string | null>(null);

  const data = PAPER_DATA[year];
  const prevData = year === 2024 ? PAPER_DATA[2023] : year === 2023 ? PAPER_DATA[2022] : null;
  const totalQ = SUBJECT_ORDER.reduce((s, subj) => s + (data[subj]?.count ?? 0), 0);
  const maxCount = Math.max(...SUBJECT_ORDER.map(s => data[s]?.count ?? 0));

  const YEARS: Year[] = [2024, 2023, 2022];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-2.5">
        <div className="bg-blue-500/20 p-1.5 rounded-lg shrink-0">
          <BarChart2 className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-mono font-bold text-foreground">NEET PG Paper Analysis</p>
          <p className="text-[10px] font-mono text-muted-foreground">
            Subject-wise question distribution · {totalQ} questions total
          </p>
        </div>
      </div>

      {/* Year selector */}
      <div className="flex gap-2">
        {YEARS.map(y => (
          <button
            key={y}
            onClick={() => { setYear(y); setExpanded(null); }}
            className={`flex-1 py-2 rounded-xl text-sm font-mono font-bold border transition-all ${
              year === y
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Chart + details card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-xs font-mono font-bold text-foreground">Subject Distribution — NEET PG {year}</p>
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            {prevData && (
              <>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Up</span>
                <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-destructive" /> Down</span>
                <span className="flex items-center gap-1"><Minus className="w-3 h-3 text-muted-foreground" /> Same</span>
              </>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          {SUBJECT_ORDER.map(subj => {
            const curr = data[subj]?.count ?? 0;
            const prev = prevData?.[subj]?.count ?? curr;
            const trend: Trend = prevData ? getTrend(curr, prev) : "same";
            const pct = totalQ > 0 ? (curr / totalQ) * 100 : 0;
            const barPct = maxCount > 0 ? (curr / maxCount) * 100 : 0;
            const color = SUBJECT_COLORS[subj] ?? "#888";
            const isExpanded = expanded === subj;

            return (
              <div key={subj}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : subj)}
                  className="w-full"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 group">
                    {/* Subject label */}
                    <div className="w-40 shrink-0 text-left">
                      <span className="text-xs font-mono text-foreground/80 group-hover:text-foreground transition-colors truncate block">
                        {subj}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="flex-1 h-5 bg-background rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${barPct}%`, backgroundColor: color + "cc" }}
                      />
                    </div>

                    {/* Count + % */}
                    <div className="flex items-center gap-2 w-24 justify-end shrink-0">
                      <span className="text-xs font-mono font-bold" style={{ color }}>
                        {curr}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        ({pct.toFixed(1)}%)
                      </span>
                      {/* Trend indicator */}
                      {prevData && (
                        <span className="w-4 flex justify-center">
                          {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                          {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                          {trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded hotspots */}
                {isExpanded && data[subj] && (
                  <div className="ml-40 mt-2 mb-1 pl-3 border-l-2 border-border/60">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-3 h-3 shrink-0" style={{ color }} />
                      <p className="text-[10px] font-mono font-semibold" style={{ color }}>
                        Top 5 high-yield topics — NEET PG {year}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {data[subj].hotspots.map((hs, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[9px] font-mono font-bold mt-0.5 w-3.5 shrink-0" style={{ color }}>
                            {i + 1}.
                          </span>
                          <p className="text-[11px] font-mono text-foreground/70 leading-relaxed">{hs}</p>
                        </div>
                      ))}
                    </div>
                    {prevData?.[subj] && (
                      <p className="mt-2 text-[10px] font-mono text-muted-foreground">
                        vs {year === 2024 ? 2023 : 2022}: {prevData[subj].count} questions
                        {" "}({getTrend(data[subj].count, prevData[subj].count) === "up" ? "↑" : getTrend(data[subj].count, prevData[subj].count) === "down" ? "↓" : "→"}{" "}
                        {Math.abs(data[subj].count - prevData[subj].count) === 0 ? "no change" : `${Math.abs(data[subj].count - prevData[subj].count)} questions ${data[subj].count > prevData[subj].count ? "more" : "fewer"}`})
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-4 py-3 border-t border-border bg-background/30">
          <p className="text-[10px] font-mono text-muted-foreground">
            Click any row to see high-yield topics. Data is based on expert analysis of NEET PG question patterns.
            {prevData ? ` Trends compared to ${year === 2024 ? 2023 : 2022}.` : ""}
          </p>
        </div>
      </div>

      {/* Year comparison table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-mono font-bold text-foreground">3-Year Trend Comparison</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-4 py-2 text-left text-muted-foreground font-semibold">Subject</th>
                {YEARS.map(y => (
                  <th key={y} className={`px-4 py-2 text-right font-semibold ${y === year ? "text-primary" : "text-muted-foreground"}`}>
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBJECT_ORDER.map((subj, i) => {
                const color = SUBJECT_COLORS[subj] ?? "#888";
                return (
                  <tr key={subj} className={`border-b border-border/50 hover:bg-background/30 transition-colors ${i % 2 === 0 ? "" : "bg-background/10"}`}>
                    <td className="px-4 py-1.5 text-foreground/80 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0 inline-block" style={{ backgroundColor: color }} />
                      {subj}
                    </td>
                    {YEARS.map(y => (
                      <td key={y} className={`px-4 py-1.5 text-right font-bold ${y === year ? "" : "text-muted-foreground"}`}
                          style={y === year ? { color } : {}}>
                        {PAPER_DATA[y][subj]?.count ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="border-t border-border bg-background/30 font-bold">
                <td className="px-4 py-2 text-foreground">Total</td>
                {YEARS.map(y => {
                  const tot = SUBJECT_ORDER.reduce((s, subj) => s + (PAPER_DATA[y][subj]?.count ?? 0), 0);
                  return (
                    <td key={y} className={`px-4 py-2 text-right ${y === year ? "text-primary" : "text-muted-foreground"}`}>
                      {tot}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Study strategy card */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-mono font-bold text-foreground">Exam Strategy Insights — NEET PG {year}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
            <p className="text-[10px] font-mono font-semibold text-emerald-400 mb-1.5">High Yield (≥15 Qs)</p>
            {SUBJECT_ORDER.filter(s => (data[s]?.count ?? 0) >= 15).map(s => (
              <p key={s} className="text-[11px] font-mono text-foreground/70 leading-relaxed">
                • {s} <span className="text-emerald-400 font-bold">({data[s]?.count})</span>
              </p>
            ))}
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
            <p className="text-[10px] font-mono font-semibold text-amber-400 mb-1.5">Moderate (8–14 Qs)</p>
            {SUBJECT_ORDER.filter(s => { const c = data[s]?.count ?? 0; return c >= 8 && c < 15; }).map(s => (
              <p key={s} className="text-[11px] font-mono text-foreground/70 leading-relaxed">
                • {s} <span className="text-amber-400 font-bold">({data[s]?.count})</span>
              </p>
            ))}
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <p className="text-[10px] font-mono font-semibold text-blue-400 mb-1.5">Lower Yield (&lt;8 Qs)</p>
            {SUBJECT_ORDER.filter(s => (data[s]?.count ?? 0) < 8).map(s => (
              <p key={s} className="text-[11px] font-mono text-foreground/70 leading-relaxed">
                • {s} <span className="text-blue-400 font-bold">({data[s]?.count})</span>
              </p>
            ))}
            <p className="text-[10px] font-mono text-muted-foreground mt-2">Focus on key topics only; don't over-invest time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
