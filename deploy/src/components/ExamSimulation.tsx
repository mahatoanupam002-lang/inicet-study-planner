import { useState, useEffect, useRef, useCallback } from "react";
import {
  FlaskConical,
  Timer,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { QUESTIONS, QUESTION_SUBJECTS, Question } from "@/data/questions";

// ─── Rank estimation (same brackets as RankPredictor) ────────────────────────
function estimateRank(pct: number): {
  airMin: number;
  airMax: number;
  category: string;
  color: string;
} {
  if (pct >= 90) return { airMin: 1,    airMax: 50,    category: "Top 50 — AIIMS Delhi / PGIMER likely",       color: "#22c55e" };
  if (pct >= 85) return { airMin: 50,   airMax: 200,   category: "Top 200 — Premier institutes",               color: "#4ade80" };
  if (pct >= 80) return { airMin: 200,  airMax: 500,   category: "Top 500 — AIIMS/JIPMER states",             color: "#86efac" };
  if (pct >= 75) return { airMin: 500,  airMax: 1000,  category: "Top 1000 — Good central institutes",        color: "#a3e635" };
  if (pct >= 70) return { airMin: 1000, airMax: 1800,  category: "Top 2000 — AIIMS branches / DNB seats",     color: "#facc15" };
  if (pct >= 65) return { airMin: 1800, airMax: 3000,  category: "DNB / State PG range",                      color: "#fb923c" };
  if (pct >= 55) return { airMin: 3000, airMax: 5000,  category: "Borderline — intensive revision needed",    color: "#f87171" };
  return           { airMin: 5000, airMax: 10000, category: "Below competitive range",                         color: "#ef4444" };
}

// ─── Negative marking ─────────────────────────────────────────────────────────
function negativeMarkingScore(correct: number, wrong: number): number {
  return correct - wrong * 0.33;
}

// ─── Fisher-Yates shuffle ─────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── MM:SS formatter ──────────────────────────────────────────────────────────
function formatTime(secs: number): string {
  const s = Math.max(0, secs);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "setup" | "running" | "results";
type Confidence = "sure" | "unsure" | "skipped";
type AnswerMap = Record<number, number | null>;   // questionId → option index (0-3) | null
type ConfidenceMap = Record<number, Confidence>;

// ─── Option label helper ──────────────────────────────────────────────────────
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export function ExamSimulation() {
  // ── Setup state ──
  const [numQuestions, setNumQuestions] = useState<50 | 100 | 200>(200);
  const [subjectFilter, setSubjectFilter] = useState<string>("All subjects");

  // ── Exam state ──
  const [phase, setPhase] = useState<Phase>("setup");
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [confidence, setConfidence] = useState<ConfidenceMap>({});
  const [secsLeft, setSecsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Results state ──
  const [showReview, setShowReview] = useState(false);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // We need a stable submit callback that doesn't close over stale state,
  // so we keep a ref pointing to the latest submit function.
  const submitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (phase !== "running") {
      stopTimer();
      return;
    }
    if (intervalRef.current !== null) return; // already running
    intervalRef.current = setInterval(() => {
      setSecsLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, stopTimer]);

  // ── Start exam ────────────────────────────────────────────────────────────
  const startExam = () => {
    const pool =
      subjectFilter === "All subjects"
        ? QUESTIONS
        : QUESTIONS.filter(q => q.subject === subjectFilter);
    const selected = shuffle(pool).slice(0, numQuestions);
    const total = selected.length;
    setExamQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setConfidence({});
    setSecsLeft(total * 54);
    setShowReview(false);
    setPhase("running");
  };

  // ── Submit exam ───────────────────────────────────────────────────────────
  const submitExam = useCallback(() => {
    stopTimer();
    setPhase("results");
  }, [stopTimer]);

  // Keep the ref up-to-date
  useEffect(() => {
    submitRef.current = submitExam;
  }, [submitExam]);

  // ── End exam with confirm ─────────────────────────────────────────────────
  const handleEndExam = () => {
    if (window.confirm("End exam now? Your current answers will be scored.")) {
      submitExam();
    }
  };

  // ── Answer / confidence selection ─────────────────────────────────────────
  const selectAnswer = (qId: number, opt: number) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const setConf = (qId: number, conf: Confidence) => {
    setConfidence(prev => ({ ...prev, [qId]: conf }));
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = (idx: number) => {
    setCurrentIdx(Math.max(0, Math.min(idx, examQuestions.length - 1)));
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const reset = () => {
    stopTimer();
    setPhase("setup");
    setExamQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setConfidence({});
    setSecsLeft(0);
    setShowReview(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Results computation
  // ─────────────────────────────────────────────────────────────────────────
  const results = (() => {
    if (phase !== "results") return null;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const subjectMap: Record<string, { correct: number; attempted: number }> = {};

    for (const q of examQuestions) {
      const ans = answers[q.id];
      if (!subjectMap[q.subject]) subjectMap[q.subject] = { correct: 0, attempted: 0 };

      if (ans === null || ans === undefined) {
        unanswered++;
      } else {
        subjectMap[q.subject].attempted++;
        if (ans === q.answer) {
          correct++;
          subjectMap[q.subject].correct++;
        } else {
          wrong++;
        }
      }
    }

    const total = examQuestions.length;
    const adjusted = negativeMarkingScore(correct, wrong);
    const pct = total > 0 ? (adjusted / total) * 100 : 0;
    const rank = estimateRank(Math.max(0, pct));

    return { correct, wrong, unanswered, total, adjusted, pct, rank, subjectMap };
  })();

  // ─────────────────────────────────────────────────────────────────────────
  // Export
  // ─────────────────────────────────────────────────────────────────────────
  const exportResults = () => {
    if (!results) return;
    const lines: string[] = [];
    lines.push("INI-CET Exam Simulation Results");
    lines.push("================================");
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push(`Questions: ${results.total}`);
    lines.push(`Subject Filter: ${subjectFilter}`);
    lines.push("");
    lines.push("SCORE SUMMARY");
    lines.push("-------------");
    lines.push(`Correct:    ${results.correct}`);
    lines.push(`Wrong:      ${results.wrong}`);
    lines.push(`Unanswered: ${results.unanswered}`);
    lines.push(`Adjusted Score: ${results.adjusted.toFixed(2)} / ${results.total}`);
    lines.push(`Percentage: ${results.pct.toFixed(2)}%`);
    lines.push(`Estimated AIR: ${results.rank.airMin.toLocaleString()}–${results.rank.airMax.toLocaleString()}`);
    lines.push(`Category: ${results.rank.category}`);
    lines.push("");
    lines.push("SUBJECT-WISE BREAKDOWN");
    lines.push("----------------------");
    for (const [subj, data] of Object.entries(results.subjectMap)) {
      const acc = data.attempted > 0 ? ((data.correct / data.attempted) * 100).toFixed(0) : "—";
      lines.push(`${subj}: ${data.correct}/${data.attempted} (${acc}%)`);
    }
    lines.push("");
    lines.push("QUESTION REVIEW");
    lines.push("---------------");
    examQuestions.forEach((q, i) => {
      const ans = answers[q.id];
      const isCorrect = ans === q.answer;
      const ansLabel = ans !== null && ans !== undefined ? OPTION_LABELS[ans] : "—";
      const correctLabel = OPTION_LABELS[q.answer];
      lines.push(`Q${i + 1} [${isCorrect ? "✓" : ans === undefined || ans === null ? "-" : "✗"}] ${q.stem.slice(0, 80)}`);
      lines.push(`  Your answer: ${ansLabel}  Correct: ${correctLabel}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inicet-simulation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — SETUP
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-violet-500/20 p-1.5 rounded-lg">
            <FlaskConical className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">Exam Simulation</p>
            <p className="text-[10px] font-mono text-muted-foreground">Full INI-CET mock with negative marking</p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Number of questions */}
          <div>
            <p className="text-[11px] font-mono uppercase text-muted-foreground mb-2.5">Number of Questions</p>
            <div className="flex gap-2">
              {([50, 100, 200] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-mono font-bold border transition-all ${
                    numQuestions === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Subject filter */}
          <div>
            <p className="text-[11px] font-mono uppercase text-muted-foreground mb-2.5">Subject</p>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {(["All subjects", ...QUESTION_SUBJECTS] as const).map(subj => (
                <button
                  key={subj}
                  onClick={() => setSubjectFilter(subj)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    subjectFilter === subj
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-foreground/70 leading-relaxed">
                Negative marking: <span className="text-amber-400 font-bold">–0.33</span> per wrong answer.
                Timer: <span className="text-amber-400 font-bold">54 seconds</span> per question.
              </p>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={startExam}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-mono font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Begin Simulation →
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — RUNNING
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "running") {
    const q = examQuestions[currentIdx];
    const total = examQuestions.length;
    const selectedOpt = answers[q.id] ?? null;
    const currentConf = confidence[q.id] ?? null;
    const progressPct = (currentIdx / total) * 100;
    const isLast = currentIdx === total - 1;
    const timerUrgent = secsLeft < 300; // < 5 min

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground">
            Q <span className="text-foreground">{currentIdx + 1}</span>
            <span className="text-muted-foreground/50"> / {total}</span>
          </span>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-sm font-bold ${
            timerUrgent
              ? "bg-destructive/10 border-destructive/30 text-destructive animate-pulse"
              : "bg-background border-border text-foreground"
          }`}>
            <Timer className="w-3.5 h-3.5" />
            {formatTime(secsLeft)}
          </div>

          <button
            onClick={handleEndExam}
            className="text-[11px] font-mono text-destructive border border-destructive/30 rounded-lg px-3 py-1 hover:bg-destructive/10 transition-colors"
          >
            End Exam
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question card */}
        <div className="p-5 space-y-4">
          {/* Subject badge + stem */}
          <div className="relative">
            <span className="absolute top-0 right-0 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              {q.subject}
            </span>
            <p className="text-sm font-mono text-foreground leading-relaxed pr-28">
              {q.stem}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = selectedOpt === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(q.id, i)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left text-sm font-mono transition-all ${
                    isSelected
                      ? "bg-primary/15 border-primary text-foreground"
                      : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}>
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom row: confidence + navigation */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Confidence buttons */}
            <div className="flex gap-1.5">
              {(
                [
                  { key: "sure",    label: "Sure ✓" },
                  { key: "unsure",  label: "Unsure ?" },
                  { key: "skipped", label: "Skip →" },
                ] as { key: Confidence; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setConf(q.id, key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    currentConf === key
                      ? key === "sure"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : key === "unsure"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : "bg-muted/50 border-border text-muted-foreground"
                      : "bg-background border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Prev / Next / Submit */}
            <div className="flex gap-1.5">
              <button
                onClick={() => goTo(currentIdx - 1)}
                disabled={currentIdx === 0}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground text-xs font-mono hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </button>

              {isLast ? (
                <button
                  onClick={submitExam}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold hover:opacity-90 transition-all"
                >
                  Submit Exam
                </button>
              ) : (
                <button
                  onClick={() => goTo(currentIdx + 1)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-muted-foreground text-xs font-mono hover:text-foreground hover:border-primary/40 transition-all flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — RESULTS
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "results" && results) {
    const { correct, wrong, unanswered, total, adjusted, pct, rank, subjectMap } = results;
    const safePct = Math.max(0, pct);

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-violet-500/20 p-1.5 rounded-lg">
            <FlaskConical className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">Simulation Results</p>
            <p className="text-[10px] font-mono text-muted-foreground">{total} questions · {subjectFilter}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Key numbers */}
          <div
            className="rounded-xl p-4 border space-y-3"
            style={{ borderColor: rank.color + "40", backgroundColor: rank.color + "0d" }}
          >
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Adjusted Score</p>
                <p className="text-4xl font-mono font-bold" style={{ color: rank.color }}>
                  {adjusted.toFixed(2)}
                </p>
                <p className="text-sm font-mono text-muted-foreground">/ {total}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Percentage</p>
                <p className="text-2xl font-mono font-bold" style={{ color: rank.color }}>
                  {safePct.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-2 rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, safePct)}%`, backgroundColor: rank.color }}
              />
            </div>

            {/* Category */}
            <p className="text-[11px] font-mono font-semibold" style={{ color: rank.color }}>
              {rank.category}
            </p>

            {/* Estimated AIR */}
            <div className="flex items-center justify-between text-xs font-mono text-foreground/80 bg-background/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">Estimated AIR</span>
              <span className="font-bold" style={{ color: rank.color }}>
                {rank.airMin.toLocaleString()} – {rank.airMax.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Correct / Wrong / Unanswered */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-emerald-400">{correct}</p>
              <p className="text-[10px] font-mono text-muted-foreground">Correct</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center">
              <XCircle className="w-4 h-4 text-destructive mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-destructive">{wrong}</p>
              <p className="text-[10px] font-mono text-muted-foreground">Wrong</p>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
              <BookOpen className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-muted-foreground">{unanswered}</p>
              <p className="text-[10px] font-mono text-muted-foreground">Unanswered</p>
            </div>
          </div>

          {/* Subject-wise breakdown */}
          {Object.keys(subjectMap).length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase text-muted-foreground mb-2.5">Subject-wise Breakdown</p>
              <div className="space-y-1.5">
                {Object.entries(subjectMap).map(([subj, data]) => {
                  const acc = data.attempted > 0 ? (data.correct / data.attempted) * 100 : null;
                  const accColor =
                    acc === null
                      ? "text-muted-foreground"
                      : acc >= 75
                      ? "text-emerald-400"
                      : acc >= 60
                      ? "text-amber-400"
                      : "text-destructive";
                  return (
                    <div
                      key={subj}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-xs font-mono"
                    >
                      <span className="text-foreground/80 flex-1 truncate">{subj}</span>
                      <span className="text-muted-foreground mx-3">
                        {data.correct}/{data.attempted}
                      </span>
                      <span className={`w-12 text-right font-bold ${accColor}`}>
                        {acc !== null ? `${acc.toFixed(0)}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed review toggle */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowReview(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background/50 hover:bg-background transition-colors text-sm font-mono font-semibold text-foreground"
            >
              <span>Detailed Review</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReview && (
              <div className="divide-y divide-border">
                {examQuestions.map((q, i) => {
                  const ans = answers[q.id];
                  const answered = ans !== null && ans !== undefined;
                  const isCorrect = answered && ans === q.answer;
                  const isWrong   = answered && ans !== q.answer;

                  return (
                    <div key={q.id} className="px-4 py-3 flex items-start gap-3 text-xs font-mono">
                      {/* Status icon */}
                      <span className="flex-shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isWrong ? (
                          <XCircle className="w-3.5 h-3.5 text-destructive" />
                        ) : (
                          <span className="inline-block w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-foreground/70 leading-relaxed truncate">
                          <span className="text-muted-foreground mr-1.5">Q{i + 1}</span>
                          {q.stem.slice(0, 100)}{q.stem.length > 100 ? "…" : ""}
                        </p>
                        <div className="flex gap-4 mt-1 text-[10px]">
                          <span>
                            <span className="text-muted-foreground">Your: </span>
                            <span className={isCorrect ? "text-emerald-400" : isWrong ? "text-destructive" : "text-muted-foreground"}>
                              {answered ? OPTION_LABELS[ans!] : "—"}
                            </span>
                          </span>
                          <span>
                            <span className="text-muted-foreground">Correct: </span>
                            <span className="text-emerald-400">{OPTION_LABELS[q.answer]}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background text-sm font-mono font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={exportResults}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-mono font-semibold hover:opacity-90 transition-all"
            >
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
