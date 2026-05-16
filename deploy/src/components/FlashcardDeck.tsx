import { useState, useMemo, useEffect } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { Plus, RotateCcw, CheckCircle } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: string;
  created: string;
}

const STORAGE_KEY = "neetpg_flashcards";
const TODAY = new Date().toISOString().slice(0, 10);

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// SM-2 algorithm
function updateCard(card: Flashcard, quality: 0 | 1 | 2 | 3): Flashcard {
  let { interval, easeFactor, repetitions } = card;
  if (quality === 0) {
    interval = 1; repetitions = 0;
  } else if (quality === 1) {
    interval = Math.max(1, Math.round(interval * 1.2));
  } else {
    repetitions++;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
    if (quality === 3) easeFactor = Math.max(1.3, easeFactor + 0.1);
  }
  easeFactor = Math.max(1.3, easeFactor);
  return { ...card, interval, easeFactor, repetitions, dueDate: addDays(interval) };
}

const BUILT_IN: Omit<Flashcard, "id" | "interval" | "easeFactor" | "repetitions" | "dueDate" | "created">[] = [
  { front:"MUDPILES mnemonic stands for?", back:"Methanol, Uraemia, DKA, Paraldehyde, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates — causes of high anion gap metabolic acidosis", subject:"Medicine" },
  { front:"DOC for absence seizures?", back:"Ethosuximide (first line). Valproate if myoclonic component present.", subject:"Pharmacology" },
  { front:"NFHS-5 MMR India?", back:"97 per 100,000 live births (SRS 2018-20)", subject:"PSM" },
  { front:"APGAR score components?", back:"Appearance (colour), Pulse, Grimace (reflex), Activity (tone), Respiration — scored 0/1/2 each; normal ≥7 at 5 min", subject:"Paediatrics" },
  { front:"Wilson-Jungner criteria for screening — how many?", back:"10 criteria. Important: condition must be important health problem, effective treatment must exist, natural history must be understood", subject:"PSM" },
  { front:"Magnesium toxicity — first sign?", back:"Loss of deep tendon reflexes (DTRs). Then respiratory depression. Antidote: Calcium gluconate 1g IV", subject:"OBG" },
  { front:"TORCH infections — most common congenital?", back:"CMV (Cytomegalovirus) — most common; rubella most preventable; HSV most dangerous neonatally", subject:"Microbiology" },
  { front:"Hepatitis B serology: HBsAg+, Anti-HBs-, Anti-HBc IgM+ — interpretation?", back:"Acute hepatitis B infection (window period overlap)", subject:"Microbiology" },
  { front:"Km in enzyme kinetics?", back:"Substrate concentration at half-maximal velocity (Vmax/2). Low Km = high affinity. Competitive inhibitor: increases Km. Non-competitive: doesn't change Km.", subject:"Biochemistry" },
  { front:"Hesselbach's triangle boundaries?", back:"Medial: lateral border of rectus abdominis. Lateral: inferior epigastric vessels. Inferior: inguinal ligament. Direct hernias bulge through here.", subject:"Anatomy" },
  { front:"Jones criteria — major criteria (5)?", back:"Carditis, Polyarthritis, Sydenham's chorea, Erythema marginatum, Subcutaneous nodules (CASES mnemonic)", subject:"Medicine" },
  { front:"Rheumatic fever prophylaxis — duration?", back:"Benzathine penicillin IM monthly. Duration: 10 years or until age 25 (whichever longer); if carditis with valvular disease: 10 years or age 40", subject:"Paediatrics" },
  { front:"NTEP TB regimen — DS-TB?", back:"2HRZE / 4HR — 2 months Intensive phase (INH+Rifampicin+PZA+Ethambutol) then 4 months Continuation phase (INH+Rifampicin)", subject:"PSM" },
  { front:"Senile plaques composition?", back:"Beta-amyloid (Aβ42) — seen in Alzheimer's disease. Neurofibrillary tangles are hyperphosphorylated tau protein.", subject:"Pathology" },
  { front:"Reed-Sternberg cell phenotype?", back:"CD15+, CD30+, CD45- (LCA negative). Binucleated 'owl-eye' appearance. Classic Hodgkin lymphoma.", subject:"Pathology" },
  { front:"p53 gene — function and associated syndrome?", back:"Tumour suppressor — 'guardian of the genome'. Mutation in >50% of human cancers. Li-Fraumeni syndrome (germline p53 mutation).", subject:"Pathology" },
  { front:"SLICC criteria for SLE — minimum to diagnose?", back:"≥4 of 11 criteria (at least 1 clinical + 1 immunological), OR biopsy-proven lupus nephritis + ANA or anti-dsDNA positive", subject:"Medicine" },
  { front:"Bishop score — components?", back:"Dilation, Effacement, Station, Consistency, Position of cervix. Score ≥8 = favourable cervix. ≤6 = unfavourable (ripen first)", subject:"OBG" },
  { front:"Parkland formula for burns?", back:"4 ml × weight(kg) × %TBSA burned. Half in first 8 hours (from time of burn), half in next 16 hours. Use Ringer's lactate.", subject:"Surgery" },
  { front:"Alvarado score — diagnosis?", back:"Acute appendicitis. Max 10. Score ≥7 = probable appendicitis (surgery). Components: migration of pain (1), anorexia (1), nausea (1), RIF tenderness (2), rebound (1), elevated temperature (1), leukocytosis (2), shift to left (1)", subject:"Surgery" },
  { front:"GOLD staging for COPD — based on?", back:"Post-bronchodilator FEV1/FVC <0.70 confirms COPD. GOLD 1: FEV1≥80%, GOLD 2: 50-79%, GOLD 3: 30-49%, GOLD 4: <30% predicted", subject:"Medicine" },
  { front:"Gaucher disease — enzyme deficient?", back:"Glucocerebrosidase (beta-glucosidase). Most common LSD. Type 1 (non-neuropathic): hepatosplenomegaly, bone crises. Treatment: Imiglucerase (ERT)", subject:"Biochemistry" },
  { front:"Tay-Sachs disease — enzyme and substrate?", back:"Hexosaminidase A deficient → GM2 ganglioside accumulation. Cherry-red spot on macula. No hepatosplenomegaly (unlike Niemann-Pick).", subject:"Biochemistry" },
  { front:"Wallerian degeneration — direction?", back:"Anterograde (distal to injury). Myelin sheath breaks down. Schwann cells proliferate. Occurs in peripheral nervous system.", subject:"Physiology" },
  { front:"Frank-Starling law?", back:"Increased preload (end-diastolic volume) → increased stroke volume (up to a limit). Mechanism: sarcomere stretch → increased actin-myosin cross-bridge formation.", subject:"Physiology" },
  { front:"JVP 'a' wave — what does it represent?", back:"Atrial contraction. Absent in AF (no organised atrial contraction). Giant 'a' wave in tricuspid stenosis / complete heart block.", subject:"Physiology" },
  { front:"Colles' fracture — nerve injury?", back:"No nerve injury in classic Colles' (distal radius). BUT median nerve injury in Smith's fracture / carpal tunnel involvement.", subject:"Anatomy" },
  { front:"Saturday night palsy — nerve and motor deficit?", back:"Radial nerve (spiral groove of humerus). Wrist drop + finger drop. Triceps spared (branches above spiral groove).", subject:"Anatomy" },
  { front:"Common peroneal nerve injury — cause and deficit?", back:"Fracture neck of fibula. Foot drop (can't dorsiflex/evert). High-stepping gait. Sensory loss: dorsum of foot.", subject:"Anatomy" },
  { front:"Trachoma — WHO FISTO grading?", back:"TF (Trachomatous Inflammation Follicular), TI (Intense), TS (Scarring), TT (Trichiasis), CO (Corneal Opacity). Caused by Chlamydia trachomatis serotypes A-C.", subject:"ENT/Ophth/Derm" },
  { front:"Leprosy — most infectious type?", back:"Lepromatous (LL) — high bacterial load (BI 6+). Most bacilli. Glove-and-stocking anaesthesia. Leonine facies. Ridley-Jopling: TT→BT→BB→BL→LL", subject:"Microbiology" },
  { front:"NDPS Act 1985 — cannabis small vs commercial quantity?", back:"Small quantity: 1 kg (Section 27 — personal use). Commercial quantity: 20 kg (Section 37 — bail conditions strict)", subject:"Forensic" },
  { front:"MHCA 2017 — Section 3?", back:"Definition of mental illness: 'a substantial disorder of thinking, mood, perception, orientation or memory that grossly impairs judgement or behaviour'", subject:"Forensic" },
  { front:"Rigor mortis — onset and resolution?", back:"Onset: 1-2 hours after death (small muscles first — face, jaw). Complete: 6-12 hours. Resolves: 24-48 hours. Mechanism: ATP depletion → actin-myosin lock", subject:"Forensic" },
  { front:"Phototherapy for neonatal jaundice — threshold?", back:"Bhutani nomogram-based. Term infant: typically start at TSB >15-17 mg/dL at 72h. Adjust for gestation, haemolysis risk.", subject:"Paediatrics" },
  { front:"SAM — MUAC cutoff?", back:"Severe Acute Malnutrition (SAM): MUAC <11.5 cm. MAM: 11.5-12.5 cm. Normal: ≥12.5 cm (in children 6-59 months)", subject:"Paediatrics" },
  { front:"MTP Act 2021 — extended week limit?", back:"Up to 24 weeks for special categories (rape survivors, minors, physical disability, fetal abnormality detected late, change in marital status). Up to 20 weeks general. Medical board for >24 weeks.", subject:"Forensic" },
  { front:"Tetralogy of Fallot — 4 components?", back:"VSD + Pulmonary stenosis + Overriding aorta + RVH. Boot-shaped heart (coeur en sabot) on CXR. Right-to-left shunt → cyanosis. Squatting increases SVR.", subject:"Paediatrics" },
  { front:"IHD — STEMI vs NSTEMI distinction?", back:"STEMI: persistent ST elevation + troponin rise → PCI within 90 min. NSTEMI: ST depression / T-wave changes + troponin rise (no ST elevation). Both are ACS.", subject:"Medicine" },
  { front:"DOC for organophosphate poisoning?", back:"Atropine (large doses) + Pralidoxime (2-PAM). Atropine until secretions dry. Pralidoxime must be given within 24-48h (before ageing of AChE).", subject:"Pharmacology" },
];

function makeBuiltIns(): Flashcard[] {
  return BUILT_IN.map((card, i) => ({
    ...card,
    id: `builtin_${i}`,
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    dueDate: TODAY,
    created: TODAY,
  }));
}

const SUBJECT_COLORS: Record<string, string> = {
  Medicine:"text-blue-400",Pharmacology:"text-violet-400",Microbiology:"text-green-400",
  OBG:"text-pink-400",Paediatrics:"text-cyan-400",PSM:"text-amber-400",
  Surgery:"text-orange-400",Pathology:"text-rose-400",Forensic:"text-gray-400",
  Anatomy:"text-yellow-400",Physiology:"text-teal-400",Biochemistry:"text-indigo-400",
  "ENT/Ophth/Derm":"text-lime-400",
};

type ViewMode = "all" | "due" | "study";

export function FlashcardDeck() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = safeLoad<Flashcard[]>(STORAGE_KEY, []);
    if (saved.length === 0) {
      const initial = makeBuiltIns();
      safeSave(STORAGE_KEY, initial);
      return initial;
    }
    return saved;
  });

  const [mode, setMode] = useState<ViewMode>("all");
  const [studyIdx, setStudyIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ front: "", back: "", subject: "Medicine" });

  const saveCards = (updated: Flashcard[]) => {
    setCards(updated);
    safeSave(STORAGE_KEY, updated);
  };

  const dueCards = useMemo(() => cards.filter(c => c.dueDate <= TODAY), [cards]);

  const filteredAll = useMemo(() => {
    return subjectFilter === "All" ? cards : cards.filter(c => c.subject === subjectFilter);
  }, [cards, subjectFilter]);

  const allSubjects = useMemo(() => Array.from(new Set(cards.map(c => c.subject))).sort(), [cards]);

  const studyQueue = dueCards;
  const currentCard = studyQueue[studyIdx];

  const rate = (quality: 0 | 1 | 2 | 3) => {
    if (!currentCard) return;
    const updated = cards.map(c => c.id === currentCard.id ? updateCard(c, quality) : c);
    saveCards(updated);
    setFlipped(false);
    setStudyIdx(i => i + 1);
  };

  const addCard = () => {
    if (!form.front || !form.back) return;
    const card: Flashcard = {
      id: Date.now().toString(),
      ...form,
      interval: 1, easeFactor: 2.5, repetitions: 0,
      dueDate: TODAY, created: TODAY,
    };
    saveCards([...cards, card]);
    setForm({ front: "", back: "", subject: "Medicine" });
    setShowForm(false);
  };

  const deleteCard = (id: string) => saveCards(cards.filter(c => c.id !== id));

  const resetStudy = () => { setStudyIdx(0); setFlipped(false); };

  if (mode === "study") {
    if (studyQueue.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-16">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <div className="text-lg font-bold text-foreground">All done for today!</div>
          <p className="text-sm text-muted-foreground">No cards due. Come back tomorrow.</p>
          <button onClick={() => setMode("all")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Back to Deck</button>
        </div>
      );
    }
    if (studyIdx >= studyQueue.length) {
      return (
        <div className="flex flex-col items-center gap-4 py-16">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <div className="text-lg font-bold text-foreground">Session Complete!</div>
          <p className="text-sm text-muted-foreground">Reviewed {studyQueue.length} cards.</p>
          <div className="flex gap-3">
            <button onClick={resetStudy} className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
            <button onClick={() => setMode("all")} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Back to Deck</button>
          </div>
        </div>
      );
    }
    const card = studyQueue[studyIdx];
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Study Session</h2>
          <button onClick={() => setMode("all")} className="text-sm text-muted-foreground hover:text-foreground">Exit</button>
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Card {studyIdx + 1} of {studyQueue.length}</span>
          <span className={SUBJECT_COLORS[card.subject] ?? ""}>{card.subject}</span>
        </div>
        <div className="w-full bg-card border border-border rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(studyIdx / studyQueue.length) * 100}%` }} />
        </div>

        {/* Card */}
        <div
          className="bg-card border border-border rounded-xl p-8 min-h-[200px] flex flex-col items-center justify-center text-center cursor-pointer select-none hover:border-primary/50 transition-colors"
          onClick={() => setFlipped(f => !f)}
        >
          {!flipped ? (
            <div className="flex flex-col gap-3">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Question (tap to reveal)</div>
              <div className="text-foreground text-lg font-medium">{card.front}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-[10px] font-mono text-green-400 uppercase">Answer</div>
              <div className="text-foreground">{card.back}</div>
            </div>
          )}
        </div>

        {flipped && (
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => rate(0)} className="py-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-mono hover:bg-rose-500/30">Again<br/>(1d)</button>
            <button onClick={() => rate(1)} className="py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-mono hover:bg-orange-500/30">Hard<br/>(×1.2)</button>
            <button onClick={() => rate(2)} className="py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-mono hover:bg-green-500/30">Good<br/>(×EF)</button>
            <button onClick={() => rate(3)} className="py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-mono hover:bg-blue-500/30">Easy<br/>(+0.1)</button>
          </div>
        )}
        {!flipped && (
          <button onClick={() => setFlipped(true)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-mono">Reveal Answer</button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Flashcard Deck</h2>
          <p className="text-sm text-muted-foreground font-mono">{cards.length} cards · {dueCards.length} due today</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground">
            <Plus className="w-4 h-4" /> Add Card
          </button>
          {dueCards.length > 0 && (
            <button onClick={() => { setMode("study"); setStudyIdx(0); setFlipped(false); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono">
              Study Now ({dueCards.length})
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-foreground text-sm">Add Custom Card</h3>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Subject</label>
            <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
              {["Medicine","Surgery","Pharmacology","Physiology","Biochemistry","Pathology","Anatomy","Microbiology","OBG","Paediatrics","PSM","Forensic","ENT/Ophth/Derm"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Front (Question)</label>
            <textarea className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none resize-none" rows={2} value={form.front} onChange={e => setForm(p => ({ ...p, front: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Back (Answer)</label>
            <textarea className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none resize-none" rows={3} value={form.back} onChange={e => setForm(p => ({ ...p, back: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={addCard} disabled={!form.front || !form.back} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-2">
        {(["all", "due"] as ViewMode[]).map(v => (
          <button key={v} onClick={() => setMode(v)} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${mode === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {v === "all" ? `All (${filteredAll.length})` : `Due Today (${dueCards.length})`}
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...allSubjects].map(s => (
          <button key={s} onClick={() => setSubjectFilter(s)} className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${subjectFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Card list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(mode === "due" ? dueCards : filteredAll).map(card => (
          <div key={card.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono ${SUBJECT_COLORS[card.subject] ?? "text-muted-foreground"}`}>{card.subject}</span>
              <div className="flex items-center gap-2">
                {card.dueDate <= TODAY && <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">DUE</span>}
                <span className="text-[10px] font-mono text-muted-foreground">×{card.easeFactor.toFixed(1)}</span>
                {!card.id.startsWith("builtin_") && (
                  <button onClick={() => deleteCard(card.id)} className="text-muted-foreground hover:text-rose-400 transition-colors text-xs">✕</button>
                )}
              </div>
            </div>
            <div className="text-sm font-medium text-foreground">{card.front}</div>
            <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-1">{card.back}</div>
            <div className="text-[10px] font-mono text-muted-foreground">Next: {card.dueDate} · Rep #{card.repetitions} · {card.interval}d interval</div>
          </div>
        ))}
      </div>
    </div>
  );
}
