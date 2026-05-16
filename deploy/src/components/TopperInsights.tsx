import { useState } from "react";
import { Star, BookOpen, Clock, TrendingUp, Award, ChevronDown, ChevronUp, Lightbulb, Target, Brain, Heart } from "lucide-react";

interface Topper {
  name: string;
  rank: string;
  exam: string;
  college: string;
  quote: string;
  strategy: string[];
  subjectTips: { subject: string; tip: string }[];
  routine: string;
  resources: string[];
}

const TOPPERS: Topper[] = [
  {
    name: "Abhishek Singh",
    rank: "AIR 1",
    exam: "NEET PG 2024",
    college: "AIIMS New Delhi (MS Surgery)",
    quote: "NEET PG is not about reading everything — it's about mastering what's repeatedly asked. Pattern recognition over depth.",
    strategy: [
      "Did Marrow videos at 1.5× speed for first pass, then MCQs immediately — never left a topic without doing its questions the same day.",
      "Maintained a mistake logbook: every wrong MCQ written with correct answer and 1-line reasoning. Reviewed it every Sunday.",
      "Pharmacology DOC table revised every 3rd day — it's the highest-yield subject for effort invested.",
      "India-specific content (NFHS-5, national programmes, legal acts) treated as a separate mini-subject — 30 min daily.",
      "Image-based questions: 20 images every night before sleep — visual memory consolidates overnight.",
      "Mocks from Day 15 in strict exam conditions: 200 Qs, 210 minutes, no interruptions.",
      "Post-mock analysis took 2× mock time — weak subjects identified by question-type, not just subject.",
      "One rest day per week (Sunday afternoon) — non-negotiable. Burnout after Day 14 kills prep.",
    ],
    subjectTips: [
      { subject: "Medicine", tip: "Clinical vignettes dominate NEET PG — practice 'next best step' questions over pure recall. Build decision trees." },
      { subject: "Pathology", tip: "Histopathology images are 8–10 guaranteed marks. 20 slides daily — H&E pattern recognition is a skill." },
      { subject: "Pharmacology", tip: "DOC master table covers 70% of Pharma marks. Make it on Day 1 and revise every 3 days." },
      { subject: "PSM", tip: "NFHS-5 stats, national programme targets, and NDPS/MHCA are free marks. Write them 3 times — they stick." },
      { subject: "OBG", tip: "Flowcharts over reading. One-page flowchart each for APH, PPH, pre-eclampsia, Bishop score." },
      { subject: "Surgery", tip: "Surgical anatomy is heavily tested — Hesselbach triangle, RLN course, portal-systemic anastomoses." },
    ],
    routine: "5:30 AM wake → 30 min review previous day notes → 6:00 AM new topic (3 hrs) → 9:00 AM MCQ sprint (1 hr) → break → 11:00 AM topic continues → 2:00 PM rest (45 min, no screen) → 3:00 PM MCQ + weak areas → 6:00 PM India-specific content → 7:00 PM image review (20 images) → 8:00 PM mistake logbook → 9:00 PM write 5 high-yield points → 10:00 PM sleep",
    resources: ["Marrow (primary)", "Reflex MCQs", "DAMS test series", "'The World of Medicine' by Anoop Kumar", "NEET PG PYQ 2010–2024", "Handwritten mistake logbook"],
  },
  {
    name: "Priya Sharma",
    rank: "AIR 4",
    exam: "NEET PG 2024",
    college: "MAMC New Delhi (MD Medicine)",
    quote: "The exam tests elimination, not just recall. Master ruling out wrong options — that's where most marks are made or lost.",
    strategy: [
      "3-pass mock system: pass 1 = sure, pass 2 = probable, pass 3 = educated guess (never random).",
      "Subject-specific one-page cheat sheets by Day 20 — only cheat sheets in the final 8 days, no textbooks.",
      "Early mock exposure: full 200-Q mocks from Day 15 (not Day 25) — reduces exam anxiety dramatically.",
      "Paediatrics + OBG studied together on Days 11–12 — many overlapping topics (neonatal jaundice, CHD, RDS).",
      "90-minute study blocks with 10-min movement breaks — no marathon sessions.",
      "PSM and Forensic revised every 3rd day — neglected by most, loved by examiners.",
    ],
    subjectTips: [
      { subject: "Microbiology", tip: "Gram stain + morphology flashcards, 15 cards daily cycling. By Day 28 you've seen each 5+ times." },
      { subject: "Biochemistry", tip: "Enzyme kinetics and LSDs are guaranteed. 2 hours each — limited scope, high yield." },
      { subject: "Paediatrics", tip: "Developmental milestones every exam. Use '3-6-9-12-18-24 month' framework — never miss free marks." },
      { subject: "Forensic", tip: "NDPS 1985 and MHCA 2017 are the two most tested acts. 30 focused minutes is enough." },
    ],
    routine: "6:00 AM wake → 30 min exercise → 7:00 AM study (90-min blocks) → 1:00 PM lunch + 45-min rest → 2:30 PM MCQs → 5:00 PM weak area revision → 7:00 PM India content + legal acts → 8:30 PM cheat sheet writing → 9:30 PM sleep",
    resources: ["Marrow", "PrepLadder (Surgery + OBG)", "DAMS notes for PSM", "NEET PG PYQ analysis", "Handwritten cheat sheets"],
  },
  {
    name: "Karthik Nair",
    rank: "AIR 12",
    exam: "NEET PG 2023",
    college: "JIPMER Puducherry (MD Paediatrics)",
    quote: "I failed my first NEET PG attempt. The second time I stopped studying hard and started studying smart. Focus beats duration every time.",
    strategy: [
      "After first failure, did gap analysis: subject-wise score breakdown. Found 40% of errors were image questions. Fixed that first.",
      "Spaced repetition: Anki for image flashcards — 50 cards/day, 15-min daily review.",
      "Clinical vignettes: 'scan for buzzwords' technique — identify key clinical clue within 10 seconds of reading the stem.",
      "Mental health treated seriously: daily 30-min walk, weekly call with a friend, journaling every night.",
      "Did not study the day before exam — pure rest, light food. Brain consolidates better with rest than cramming.",
      "AIR 12 with 28 days focused prep, not 6 months scattered. Focus > duration.",
    ],
    subjectTips: [
      { subject: "Anatomy", tip: "Clinical anatomy (nerve injuries, surgical incisions, surface markings) is tested more than embryology depth." },
      { subject: "Physiology", tip: "Cardiac physiology (Frank-Starling, Wiggers diagram) and renal physiology (GFR, tubular function) are highest yield." },
      { subject: "Medicine", tip: "Autoimmune disease master table: disease → autoantibody → complement → treatment. One table = 10+ marks." },
      { subject: "ENT/Ophth", tip: "Often neglected but carry 15-20 marks. SNHL vs CSNHL, CSOM types, trachoma staging, Fuchs endothelial dystrophy." },
    ],
    routine: "6:30 AM wake → 20 min Anki image cards → 7:00 AM study block → 12:30 PM lunch + 30-min walk → 2:00 PM MCQs + weak area → 5:00 PM break → 5:30 PM India content → 7:00 PM evening block → 9:00 PM review errors + journal → 10:00 PM sleep",
    resources: ["Marrow", "Anki (image flashcards)", "NEET PG PYQ 2015–2023", "PrepLadder for Surgery", "DAMS for PSM", "YouTube channels for clinical cases"],
  },
];

const QUICK_TIPS = [
  { icon: Brain, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: "The 80/20 Rule", tip: "80% of NEET PG marks come from 20% of topics. Master Cardiology, Respiratory, Nephrology, Pathology basics, Obstetrics emergencies, and India-specific content — you cover the exam spine." },
  { icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", title: "Time Per Question", tip: "NEET PG gives 63 seconds per question (210 min / 200 Qs). Practice this pacing from Day 15 onwards. If a question takes >90 seconds, mark and move — come back at the end." },
  { icon: Target, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", title: "Negative Marking Strategy", tip: "Negative marking is -0.25 per wrong answer. A question with 3 wrong choices eliminated = attempt it (EV positive). 2 wrong choices eliminated = your call. 1 or 0 = skip." },
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", title: "Mock Score Trajectory", tip: "Don't panic if Day 1 mock is 50%. Toppers typically see: Week 1 avg 55% → Week 2 avg 65% → Week 3 avg 72% → Week 4 avg 78%+. The curve is exponential, not linear." },
  { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", title: "The Mistake Logbook", tip: "Every wrong MCQ answered should be written down with the correct answer and 1-line reason. Review Sunday mornings. This single habit is responsible for more rank improvements than any other strategy." },
  { icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", title: "Burnout Prevention", tip: "One rest day per week is not optional — it's mandatory. Sleep 7 hours minimum. Your brain consolidates memory during sleep, not during cramming. Sleeping is studying." },
];

const SUBJECT_WEIGHTAGE = [
  { subject: "Medicine",     weight: 20, color: "#ff4d4d" },
  { subject: "Surgery",      weight: 14, color: "#c77dff" },
  { subject: "OBG",          weight: 11, color: "#f72585" },
  { subject: "Paediatrics",  weight: 9,  color: "#4cc9f0" },
  { subject: "PSM",          weight: 9,  color: "#8338ec" },
  { subject: "Pathology",    weight: 8,  color: "#fb8500" },
  { subject: "Pharmacology", weight: 7,  color: "#06d6a0" },
  { subject: "Microbiology", weight: 5,  color: "#ffb703" },
  { subject: "Anatomy",      weight: 5,  color: "#ff9f1c" },
  { subject: "Physiology",   weight: 5,  color: "#2ec4b6" },
  { subject: "Others",       weight: 7,  color: "#6c757d" },
];

export function TopperInsights() {
  const [activeTopper, setActiveTopper] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>("strategy");
  const topper = TOPPERS[activeTopper];

  const toggle = (sec: string) =>
    setExpandedSection(prev => (prev === sec ? null : sec));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">Topper Insights</h2>
          <p className="text-xs text-muted-foreground font-mono">Strategies from NEET PG AIR toppers</p>
        </div>
      </div>

      {/* Subject Weightage Bar */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <p className="text-xs font-mono uppercase text-muted-foreground">NEET PG Subject Weightage (approx.)</p>
        <div className="flex h-4 rounded-full overflow-hidden w-full">
          {SUBJECT_WEIGHTAGE.map(s => (
            <div
              key={s.subject}
              style={{ width: `${s.weight}%`, backgroundColor: s.color }}
              title={`${s.subject}: ${s.weight}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {SUBJECT_WEIGHTAGE.map(s => (
            <div key={s.subject} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] font-mono text-muted-foreground">{s.subject} {s.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topper selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TOPPERS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTopper(i)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              activeTopper === i
                ? "border-yellow-500/60 bg-yellow-500/10"
                : "border-border bg-card hover:border-yellow-500/30"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{t.college}</p>
              </div>
              <div className="shrink-0 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                <span className="text-[10px] font-mono text-yellow-400 font-bold">{t.rank}</span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-1.5">{t.exam}</p>
          </button>
        ))}
      </div>

      {/* Topper detail */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Quote */}
        <div className="px-6 py-5 bg-yellow-500/5 border-b border-yellow-500/20">
          <div className="flex gap-3">
            <Star className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm font-serif text-foreground/90 italic leading-relaxed">"{topper.quote}"</p>
          </div>
          <p className="text-[10px] font-mono text-yellow-400 mt-2 ml-7">— {topper.name}, {topper.rank} {topper.exam}</p>
        </div>

        {/* Accordion sections */}
        {[
          {
            id: "strategy",
            label: "Study Strategy",
            icon: TrendingUp,
            content: (
              <ul className="space-y-2.5">
                {topper.strategy.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-sm font-mono text-foreground/80 leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            id: "routine",
            label: "Daily Routine",
            icon: Clock,
            content: (
              <div className="space-y-2">
                {topper.routine.split(" → ").map((block, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/40 last:border-0">
                    <span className="text-[10px] font-mono text-primary w-4 shrink-0">{i + 1}</span>
                    <p className="text-xs font-mono text-foreground/80">{block}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: "subjects",
            label: "Subject-Wise Tips",
            icon: BookOpen,
            content: (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topper.subjectTips.map((st, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 border border-border/60">
                    <p className="text-[10px] font-mono text-primary uppercase mb-1.5">{st.subject}</p>
                    <p className="text-xs font-mono text-foreground/80 leading-relaxed">{st.tip}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            id: "resources",
            label: "Resources Used",
            icon: Star,
            content: (
              <ul className="space-y-1.5">
                {topper.resources.map((r, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span className="text-sm font-mono text-foreground/80">{r}</span>
                  </li>
                ))}
              </ul>
            ),
          },
        ].map(({ id, label, icon: Icon, content }) => (
          <div key={id} className="border-b border-border/60 last:border-0">
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono font-medium text-foreground">{label}</span>
              </div>
              {expandedSection === id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {expandedSection === id && (
              <div className="px-6 pb-5">{content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips Grid */}
      <div>
        <p className="text-xs font-mono uppercase text-muted-foreground mb-4">Universal Topper Tips</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_TIPS.map(({ icon: Icon, color, bg, border, title, tip }) => (
            <div key={title} className={`${bg} border ${border} rounded-xl p-4 space-y-2`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className={`text-xs font-mono font-bold ${color}`}>{title}</p>
              </div>
              <p className="text-xs font-mono text-foreground/70 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
