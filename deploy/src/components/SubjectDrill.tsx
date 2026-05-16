import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Target,
  Timer,
  CheckCircle,
  XCircle,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
} from "lucide-react";
import { QUESTIONS, QUESTION_SUBJECTS, Question } from "@/data/questions";
import { safeLoad, safeSave } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIQuestion {
  id: string;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  mnemonic: string | null;
  key_concept: string | null;
  difficulty: "easy" | "medium" | "hard";
  exam_hint: string | null;
  batch_date: string;
}

interface UnifiedQuestion {
  uid: string;
  subject: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  isAI: boolean;
}

export interface DrillScore {
  subject: string;
  score: number;
  total: number;
  pct: number;
  date: string;
}

type Phase = "setup" | "running" | "results";
type CountOption = 25 | 50 | 100;

// ─── Constants ────────────────────────────────────────────────────────────────

const DRILL_SCORES_KEY = "neetpg_drill_scores";
const OPTION_LABELS = ["A", "B", "C", "D"] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs: number): string {
  const s = Math.max(0, secs);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function localToUnified(q: Question): UnifiedQuestion {
  return {
    uid: `local-${q.id}`,
    subject: q.subject,
    stem: q.stem,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    isAI: false,
  };
}

function aiToUnified(q: AIQuestion): UnifiedQuestion {
  return {
    uid: q.id,
    subject: q.subject,
    stem: q.question,
    options: q.options as [string, string, string, string],
    answer: q.correct_answer as 0 | 1 | 2 | 3,
    explanation: q.explanation,
    isAI: true,
  };
}

// ─── FeedbackOverlay ──────────────────────────────────────────────────────────

function FeedbackOverlay({
  correct,
  explanation,
}: {
  correct: boolean;
  explanation: string;
}) {
  return (
    <div
      className={`mt-3 rounded-xl border px-4 py-3 ${
        correct
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-destructive/10 border-destructive/30"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {correct ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive shrink-0" />
        )}
        <span
          className={`text-xs font-mono font-bold ${
            correct ? "text-emerald-400" : "text-destructive"
          }`}
        >
          {correct ? "Correct!" : "Wrong"}
        </span>
      </div>
      <p className="text-xs font-mono text-foreground/75 leading-relaxed">
        {explanation}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SubjectDrill({ onComplete }: { onComplete?: () => void } = {}) {
  // Setup state
  const [subject, setSubject] = useState<string>(QUESTION_SUBJECTS[0]);
  const [count, setCount] = useState<CountOption>(50);

  // Session state
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<UnifiedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [secsLeft, setSecsLeft] = useState(0);
  const [feedback, setFeedback] = useState<{
    selected: number;
    correct: boolean;
  } | null>(null);
  const [advancing, setAdvancing] = useState(false);

  // Results state
  const [showReview, setShowReview] = useState(false);
  const [scores, setScores] = useState<DrillScore[]>(() =>
    safeLoad<DrillScore[]>(DRILL_SCORES_KEY, [])
  );

  // AI questions
  const [aiQuestions, setAiQuestions] = useState<UnifiedQuestion[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Timer
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<() => void>(() => {});

  // Fetch AI questions on mount
  useEffect(() => {
    setLoadingAI(true);
    fetch(`/daily-questions.json?v=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const qs = (data.questions ?? []) as AIQuestion[];
        setAiQuestions(qs.map(aiToUnified));
      })
      .catch(() => {})
      .finally(() => setLoadingAI(false));
  }, []);

  // Combined pool for subject
  const subjectPool = useMemo<UnifiedQuestion[]>(() => {
    const local = QUESTIONS.filter((q) => q.subject === subject).map(
      localToUnified
    );
    const ai = aiQuestions.filter((q) => q.subject === subject);
    return [...local, ...ai];
  }, [subject, aiQuestions]);

  // Timer management
  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase !== "running") {
      stopTimer();
      return;
    }
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      setSecsLeft((prev) => {
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

  // Start drill
  const startDrill = () => {
    const pool = shuffle(subjectPool).slice(0, count);
    setQuestions(pool);
    setCurrentIdx(0);
    setAnswers({});
    setFeedback(null);
    setAdvancing(false);
    setShowReview(false);
    setSecsLeft(30 * 60); // 30 minutes
    setPhase("running");
  };

  // Submit drill
  const submitDrill = useCallback(() => {
    stopTimer();
    setPhase("results");
    onComplete?.();
  }, [stopTimer, onComplete]);

  useEffect(() => {
    submitRef.current = submitDrill;
  }, [submitDrill]);

  // Answer selection with immediate feedback and auto-advance
  const selectAnswer = (uid: string, opt: number) => {
    if (feedback !== null || advancing) return;
    const q = questions[currentIdx];
    const correct = opt === q.answer;
    setAnswers((prev) => ({ ...prev, [uid]: opt }));
    setFeedback({ selected: opt, correct });

    // Auto-advance after 2 seconds
    setAdvancing(true);
    setTimeout(() => {
      setFeedback(null);
      setAdvancing(false);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        submitDrill();
      }
    }, 2000);
  };

  // Results computation
  const results = useMemo(() => {
    if (phase !== "results" || questions.length === 0) return null;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    for (const q of questions) {
      const ans = answers[q.uid];
      if (ans === null || ans === undefined) unanswered++;
      else if (ans === q.answer) correct++;
      else wrong++;
    }
    const total = questions.length;
    const pct = total > 0 ? (correct / total) * 100 : 0;
    return { correct, wrong, unanswered, total, pct };
  }, [phase, questions, answers]);

  // Save score when results computed
  useEffect(() => {
    if (!results) return;
    const entry: DrillScore = {
      subject,
      score: results.correct,
      total: results.total,
      pct: Math.round(results.pct),
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [entry, ...scores].slice(0, 100);
    setScores(updated);
    safeSave(DRILL_SCORES_KEY, updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Export results
  const exportResults = () => {
    if (!results) return;
    const lines: string[] = [];
    lines.push("NEET PG Subject Drill Results");
    lines.push("==============================");
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push(`Subject: ${subject}`);
    lines.push(`Questions: ${results.total}`);
    lines.push("");
    lines.push("SCORE");
    lines.push(`  Correct:    ${results.correct}`);
    lines.push(`  Wrong:      ${results.wrong}`);
    lines.push(`  Unanswered: ${results.unanswered}`);
    lines.push(`  Score:      ${results.correct}/${results.total} (${results.pct.toFixed(1)}%)`);
    lines.push("");
    lines.push("QUESTION REVIEW");
    questions.forEach((q, i) => {
      const ans = answers[q.uid];
      const answered = ans !== null && ans !== undefined;
      const isCorrect = answered && ans === q.answer;
      const ansLabel = answered ? OPTION_LABELS[ans!] : "—";
      const correctLabel = OPTION_LABELS[q.answer];
      lines.push(
        `Q${i + 1} [${isCorrect ? "✓" : answered ? "✗" : "-"}] ${q.stem.slice(0, 80)}`
      );
      lines.push(`  Your: ${ansLabel}  Correct: ${correctLabel}`);
      if (!isCorrect) lines.push(`  Explanation: ${q.explanation.slice(0, 120)}`);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neetpg-drill-${subject.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset
  const reset = () => {
    stopTimer();
    setPhase("setup");
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setFeedback(null);
    setAdvancing(false);
    setShowReview(false);
    setSecsLeft(0);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — SETUP
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-blue-500/20 p-1.5 rounded-lg">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">
              Subject Drill
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              Timed mock with instant feedback
            </p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Subject picker */}
          <div>
            <p className="text-[11px] font-mono uppercase text-muted-foreground mb-2.5">
              Subject
            </p>
            <div className="flex gap-2 flex-wrap">
              {QUESTION_SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    subject === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Count picker */}
          <div>
            <p className="text-[11px] font-mono uppercase text-muted-foreground mb-2.5">
              Number of Questions
            </p>
            <div className="flex gap-2">
              {([25, 50, 100] as CountOption[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-lg text-sm font-mono font-bold border transition-all ${
                    count === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Pool info */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-[11px] font-mono text-foreground/70 leading-relaxed">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-blue-400 font-semibold">Question Pool</span>
              {loadingAI && (
                <span className="ml-auto text-muted-foreground animate-pulse">
                  loading AI…
                </span>
              )}
            </div>
            <span>
              {subjectPool.length} questions available for{" "}
              <span className="text-foreground font-semibold">{subject}</span>
              {aiQuestions.filter((q) => q.subject === subject).length > 0 && (
                <span className="ml-1 text-yellow-400">
                  <Zap className="w-3 h-3 inline mr-0.5" />
                  {aiQuestions.filter((q) => q.subject === subject).length} AI
                </span>
              )}
            </span>
          </div>

          {/* Timer info */}
          <div className="bg-muted/20 border border-border rounded-lg px-4 py-3 text-[11px] font-mono text-foreground/60">
            <Timer className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-muted-foreground" />
            30-minute countdown · instant feedback after each answer · auto-advance in 2 seconds
          </div>

          <button
            onClick={startDrill}
            disabled={subjectPool.length === 0}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-mono font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Drill →
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — RUNNING
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "running") {
    const q = questions[currentIdx];
    const total = questions.length;
    const progressPct = ((currentIdx + (feedback ? 1 : 0)) / total) * 100;
    const timerUrgent = secsLeft < 300;
    const selectedOpt = feedback?.selected ?? null;
    const revealed = feedback !== null;

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground">
            Q{" "}
            <span className="text-foreground">{currentIdx + 1}</span>
            <span className="text-muted-foreground/50"> / {total}</span>
          </span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-sm font-bold ${
              timerUrgent
                ? "bg-destructive/10 border-destructive/30 text-destructive animate-pulse"
                : "bg-background border-border text-foreground"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            {formatTime(secsLeft)}
          </div>

          <button
            onClick={() => {
              if (window.confirm("End drill now? Your current answers will be scored.")) {
                submitDrill();
              }
            }}
            className="text-[11px] font-mono text-destructive border border-destructive/30 rounded-lg px-3 py-1 hover:bg-destructive/10 transition-colors"
          >
            End
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
            <span className="absolute top-0 right-0 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {q.subject}
            </span>
            <p className="text-sm font-mono text-foreground leading-relaxed pr-28">
              {q.stem}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls =
                "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground";
              if (revealed) {
                if (i === q.answer) {
                  cls = "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                } else if (i === selectedOpt && i !== q.answer) {
                  cls = "bg-destructive/10 border-destructive text-destructive";
                } else {
                  cls = "bg-background border-border/40 text-foreground/30";
                }
              } else if (selectedOpt === i) {
                cls = "bg-primary/15 border-primary text-foreground";
              }

              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(q.uid, i)}
                  disabled={revealed}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left text-sm font-mono transition-all ${cls}`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                      revealed && i === q.answer
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : revealed && i === selectedOpt && i !== q.answer
                        ? "border-destructive bg-destructive/20 text-destructive"
                        : "border-border"
                    }`}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {revealed && feedback && (
            <FeedbackOverlay
              correct={feedback.correct}
              explanation={q.explanation}
            />
          )}

          {/* Advance hint */}
          {revealed && (
            <p className="text-[10px] font-mono text-muted-foreground text-center animate-pulse">
              Auto-advancing in 2 seconds…
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — RESULTS
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "results" && results) {
    const { correct, wrong, unanswered, total, pct } = results;
    const color =
      pct >= 75
        ? "#22c55e"
        : pct >= 60
        ? "#eab308"
        : "#ef4444";

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-blue-500/20 p-1.5 rounded-lg">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">
              Drill Results
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              {total} questions · {subject}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Score card */}
          <div
            className="rounded-xl p-4 border space-y-3"
            style={{
              borderColor: color + "40",
              backgroundColor: color + "0d",
            }}
          >
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                  Score
                </p>
                <p
                  className="text-4xl font-mono font-bold"
                  style={{ color }}
                >
                  {correct}
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  / {total}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                  Accuracy
                </p>
                <p
                  className="text-2xl font-mono font-bold"
                  style={{ color }}
                >
                  {pct.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Bar */}
            <div className="h-2 rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
              />
            </div>

            <p
              className="text-[11px] font-mono font-semibold"
              style={{ color }}
            >
              {pct >= 75
                ? "Strong performance — keep it up!"
                : pct >= 60
                ? "Decent — revisit weak areas."
                : "Needs work — schedule focused revision."}
            </p>
          </div>

          {/* Correct / Wrong / Unanswered */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-emerald-400">
                {correct}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Correct
              </p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center">
              <XCircle className="w-4 h-4 text-destructive mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-destructive">
                {wrong}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Wrong
              </p>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-3 text-center">
              <BookOpen className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xl font-mono font-bold text-muted-foreground">
                {unanswered}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Skipped
              </p>
            </div>
          </div>

          {/* Recent drill scores */}
          {scores.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase text-muted-foreground mb-2">
                Recent Drill History
              </p>
              <div className="space-y-1">
                {scores.slice(0, 5).map((s, i) => {
                  const c =
                    s.pct >= 75 ? "text-emerald-400" : s.pct >= 60 ? "text-amber-400" : "text-destructive";
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-xs font-mono"
                    >
                      <span className="text-foreground/70 truncate flex-1">
                        {s.subject}
                      </span>
                      <span className="text-muted-foreground mx-3">
                        {s.score}/{s.total}
                      </span>
                      <span className={`font-bold w-12 text-right ${c}`}>
                        {s.pct}%
                      </span>
                      <span className="text-muted-foreground/50 ml-3 text-[10px]">
                        {s.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Per-question review toggle */}
          <div className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowReview((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-background/50 hover:bg-background transition-colors text-sm font-mono font-semibold text-foreground"
            >
              <span>Per-Question Review</span>
              {showReview ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {showReview && (
              <div className="divide-y divide-border">
                {questions.map((q, i) => {
                  const ans = answers[q.uid];
                  const answered = ans !== null && ans !== undefined;
                  const isCorrect = answered && ans === q.answer;
                  const isWrong = answered && ans !== q.answer;
                  return (
                    <div
                      key={q.uid}
                      className="px-4 py-3 text-xs font-mono"
                    >
                      <div className="flex items-start gap-3">
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
                            <span className="text-muted-foreground mr-1.5">
                              Q{i + 1}
                            </span>
                            {q.stem.slice(0, 100)}
                            {q.stem.length > 100 ? "…" : ""}
                          </p>
                          <div className="flex gap-4 mt-1 text-[10px]">
                            <span>
                              <span className="text-muted-foreground">
                                Your:{" "}
                              </span>
                              <span
                                className={
                                  isCorrect
                                    ? "text-emerald-400"
                                    : isWrong
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }
                              >
                                {answered ? OPTION_LABELS[ans!] : "—"}
                              </span>
                            </span>
                            <span>
                              <span className="text-muted-foreground">
                                Correct:{" "}
                              </span>
                              <span className="text-emerald-400">
                                {OPTION_LABELS[q.answer]}
                              </span>
                            </span>
                          </div>
                          {isWrong && (
                            <p className="text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
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
              Export
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
