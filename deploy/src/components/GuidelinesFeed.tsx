import { useState } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { BookMarked, ChevronDown, ChevronUp } from "lucide-react";

interface Guideline {
  id: number;
  title: string;
  subject: string;
  year: number;
  keyPoints: string[];
  tag: "New" | "Updated" | "Current";
}

const GUIDELINES: Guideline[] = [
  { id:1,  title:"ADA Standards of Care in Diabetes 2024",         subject:"Medicine",     year:2024, keyPoints:["HbA1c target <7% for most adults, <8% for elderly/comorbid","SGLT2i + GLP-1 RA preferred if CVD, CKD, or HF present","Semaglutide (GLP-1 RA) shown to reduce cardiovascular events","Tirzepatide (GIP/GLP-1 dual agonist) approved — superior weight loss","Continue Metformin as background therapy unless contraindicated"], tag:"New" },
  { id:2,  title:"GINA Asthma Management Report 2023",              subject:"Medicine",     year:2023, keyPoints:["No SABA-only treatment anymore — all patients need ICS","Step 1-2: Low-dose ICS-formoterol as reliever (not SABA)","Biologic agents: Omalizumab (anti-IgE), Mepolizumab (anti-IL5) for severe asthma","Azithromycin as add-on for persistent adult asthma","Severe asthma: add Tiotropium as Step 4-5"], tag:"Updated" },
  { id:3,  title:"GOLD COPD Guidelines 2023",                       subject:"Medicine",     year:2023, keyPoints:["GOLD ABE classification replaces ABCD (removes lung function from exacerbation group)","Triple therapy (ICS+LABA+LAMA) preferred for frequent exacerbators","Roflumilast add-on for FEV1<50% + chronic bronchitis phenotype","Blood eosinophil count guides ICS use (≥300 cells/μL: more likely to benefit)","Vaccination: COVID-19, influenza, pneumococcal, pertussis"], tag:"Updated" },
  { id:4,  title:"NTEP (National TB Elimination Programme) 2023",   subject:"PSM",          year:2023, keyPoints:["BPaLM regimen (Bedaquiline+Pretomanid+Linezolid+Moxifloxacin) for pre-XDR TB","Shorter 6-month regimen for drug-sensitive TB still 2HRZE/4HR","Ni-kshay Mitra programme: community support for TB patients","India TB Report 2023: incidence 199/100,000 (declining)","Target: TB-free India by 2025 (from Nikshay Poshan Yojana data)"], tag:"Updated" },
  { id:5,  title:"WHO Malaria Treatment Guidelines 2023",           subject:"PSM",          year:2023, keyPoints:["Artemisinin-based combination therapy (ACT) remains first-line","AL (Artemether-Lumefantrine) for uncomplicated P. falciparum","IV Artesunate for severe malaria (replaces IV Quinine)","Tafenoquine single-dose for P. vivax radical cure (G6PD normal)","RTS,S/AS01 (Mosquirix) vaccine recommended for children in endemic areas"], tag:"New" },
  { id:6,  title:"NLEM 2022 — National List of Essential Medicines", subject:"Pharmacology", year:2022, keyPoints:["432 medicines total (up from 376 in 2015)","New additions: Bedaquiline, Delamanid (DR-TB), Dolutegravir (HIV)","Nirsevimab added 2023 for RSV prevention in neonates","Dapagliflozin (SGLT2i) added for HF and DM","Pembrolizumab (checkpoint inhibitor) added for cancer"], tag:"Updated" },
  { id:7,  title:"NACO ART Guidelines 2021 — HIV",                  subject:"Medicine",     year:2021, keyPoints:["TLD (TDF+3TC+DTG) as first-line for all adults","Dolutegravir-based regimens superior — high barrier to resistance","Viral load monitoring: 6 months, 12 months, then annually","CD4 count no longer triggers for ART (treat all regardless of CD4)","PrEP (pre-exposure prophylaxis): TDF+FTC for high-risk groups"], tag:"Current" },
  { id:8,  title:"ESC Heart Failure Guidelines 2021/2023 Update",   subject:"Medicine",     year:2023, keyPoints:["Four pillars for HFrEF: ACEi/ARB/ARNI + Beta-blocker + MRA + SGLT2i","SGLT2i (dapagliflozin/empagliflozin) for ALL HFrEF regardless of diabetes","ARNI (sacubitril-valsartan) preferred over ACEi in ambulatory HFrEF","HFmrEF and HFpEF: SGLT2i now recommended","Omecamtiv mecarbil (myosin activator) — emerging therapy"], tag:"Updated" },
  { id:9,  title:"MHCA 2017 — Mental Healthcare Act India",          subject:"Forensic",     year:2017, keyPoints:["Section 3: Mental illness definition (substantial disorder of thinking/mood/perception)","Section 18: Right to access mental healthcare (fundamental right)","Section 31: Advance directive — person can specify future treatment preferences","Section 89: Emergency treatment without consent if immediate danger","Replaced MHA 1987 — rights-based approach, reduced stigma"], tag:"Current" },
  { id:10, title:"WHO Obesity Management Guidelines 2022",           subject:"Medicine",     year:2022, keyPoints:["GLP-1 RA (Semaglutide 2.4mg weekly) for obesity — 15% weight loss","Tirzepatide for obesity — 20%+ weight loss in trials","BMI cutoffs for Asia-Pacific: overweight ≥23, obese ≥27.5 kg/m²","Bariatric surgery: BMI ≥37.5 (or ≥32.5 with comorbidities) in Asians","Lifestyle intervention essential component of all strategies"], tag:"Updated" },
  { id:11, title:"KDIGO CKD Management Guidelines 2024",             subject:"Medicine",     year:2024, keyPoints:["SGLT2i for all CKD patients with or without diabetes (if eGFR ≥20)","Finerenone (non-steroidal MRA) for diabetic CKD","Target BP <120/80 for most CKD patients","Avoid NSAIDs in CKD (even topical)","Referral to nephrologist: eGFR <30 or rapidly declining"], tag:"New" },
  { id:12, title:"UIP 2024 — Universal Immunisation Programme India",subject:"PSM",          year:2024, keyPoints:["PCV10 (10-valent pneumococcal vaccine) added at 6, 10, 14 weeks + booster","HPV vaccine: 9-valent (Gardasil 9), girls 9-14 years, school programme","Adult JE vaccine for endemic districts","Measles-Rubella: second dose at 16-24 months","Rotavirus vaccine: RV1 (Rotarix) at 6, 10 weeks in select states"], tag:"Updated" },
];

const TAG_COLORS = {
  New:     "bg-green-500/20 text-green-400 border-green-500/30",
  Updated: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Current: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const SUBJECT_COLORS: Record<string, string> = {
  Medicine:"bg-blue-500/20 text-blue-400",Pharmacology:"bg-violet-500/20 text-violet-400",
  PSM:"bg-amber-500/20 text-amber-400",Forensic:"bg-gray-500/20 text-gray-400",
};

const BOOKMARK_KEY = "neetpg_guideline_bookmarks";
const SUBJECTS = Array.from(new Set(GUIDELINES.map(g => g.subject))).sort();
const YEARS = Array.from(new Set(GUIDELINES.map(g => g.year))).sort((a, b) => b - a);

export function GuidelinesFeed() {
  const [bookmarks, setBookmarks] = useState<number[]>(() => safeLoad<number[]>(BOOKMARK_KEY, []));
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const toggleBookmark = (id: number) => {
    const updated = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    setBookmarks(updated);
    safeSave(BOOKMARK_KEY, updated);
  };

  const toggleExpand = (id: number) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const filtered = GUIDELINES.filter(g => {
    const matchSubject = subjectFilter === "All" || g.subject === subjectFilter;
    const matchYear = yearFilter === "All" || g.year === parseInt(yearFilter);
    return matchSubject && matchYear;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Guidelines Feed</h2>
          <p className="text-sm text-muted-foreground font-mono">Recent medical guidelines for NEET PG</p>
        </div>
        {bookmarks.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg">
            <BookMarked className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-foreground">{bookmarks.length} bookmarked</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          {["All", ...SUBJECTS].map(s => (
            <button key={s} onClick={() => setSubjectFilter(s)} className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${subjectFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {["All", ...YEARS.map(String)].map(y => (
            <button key={y} onClick={() => setYearFilter(y)} className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${yearFilter === y ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines list */}
      <div className="flex flex-col gap-3">
        {filtered.map(g => (
          <div key={g.id} className={`bg-card border rounded-xl transition-all ${bookmarks.includes(g.id) ? "border-primary/40" : "border-border"}`}>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${TAG_COLORS[g.tag]}`}>{g.tag}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${SUBJECT_COLORS[g.subject] ?? "bg-card text-muted-foreground"}`}>{g.subject}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{g.year}</span>
                </div>
                <button
                  onClick={() => toggleBookmark(g.id)}
                  title={bookmarks.includes(g.id) ? "Remove bookmark" : "Bookmark"}
                  className={`p-1.5 rounded transition-colors ${bookmarks.includes(g.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <BookMarked className="w-4 h-4" />
                </button>
              </div>
              <div className="font-semibold text-foreground text-sm">{g.title}</div>
              <button
                onClick={() => toggleExpand(g.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
              >
                {expanded[g.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded[g.id] ? "Hide" : "Show"} key points ({g.keyPoints.length})
              </button>
              {expanded[g.id] && (
                <div className="flex flex-col gap-1.5 mt-1">
                  {g.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">No guidelines match your filters.</div>
        )}
      </div>
    </div>
  );
}
