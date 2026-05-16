import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Zap,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { QUESTIONS, QUESTION_SUBJECTS, Question } from "@/data/questions";
import { safeLoad } from "@/lib/storage";

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

interface AttemptRecord {
  selected: number;
  correct: boolean;
}

type Phase = "idle" | "running" | "flash" | "summary";

// ─── Constants ────────────────────────────────────────────────────────────────

const DRILL_SIZE = 10;
const PER_Q_SECS = 8;
const FLASH_MS = 1000;
const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const WEAK_THRESHOLD = 0.60; // < 60% accuracy = weak subject

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

/**
 * Identify weak subjects (< WEAK_THRESHOLD accuracy, min 3 attempts).
 */
function getWeakSubjects(
  attempts: Record<string, AttemptRecord>
): Set<string> {
  const subjStats: Record<string, { correct: number; total: number }> = {};
  for (const subj of QUESTION_SUBJECTS) {
    subjStats[subj] = { correct: 0, total: 0 };
  }

  // Map local question UIDs to subjects
  const localSubjMap: Record<string, string> = {};
  for (const q of QUESTIONS) {
    localSubjMap[`local-${q.id}`] = q.subject;
  }

  for (const [uid, record] of Object.entries(attempts)) {
    const subj = localSubjMap[uid];
    if (subj && subjStats[subj]) {
      subjStats[subj].total++;
      if (record.correct) subjStats[subj].correct++;
    }
  }

  const weak = new Set<string>();
  for (const [subj, stats] of Object.entries(subjStats)) {
    if (stats.total >= 3 && stats.correct / stats.total < WEAK_THRESHOLD) {
      weak.add(subj);
    }
  }
  return weak;
}

/**
 * Build a 10-question rapid-fire pool:
 *   1. Wrong questions from localStorage attempts (shuffled)
 *   2. Fill remaining slots from weak subjects
 *   3. Pad with random from any remaining
 */
function buildPool(
  allLocal: UnifiedQuestion[],
  allAI: UnifiedQuestion[],
  attempts: Record<string, AttemptRecord>
): UnifiedQuestion[] {
  const all = [...allLocal, ...allAI];
  const weakSubjects = getWeakSubjects(attempts);

  // Wrong questions (previously answered incorrectly)
  const wrong = shuffle(
    all.filter((q) => attempts[q.uid] && !attempts[q.uid].correct)
  );

  // Weak-subject questions not yet in wrong list
  const wrongUids = new Set(wrong.map((q) => q.uid));
  const weakPool = shuffle(
    all.filter(
      (q) => !wrongUids.has(q.uid) && weakSubjects.has(q.subject)
    )
  );

  // Random filler
  const usedUids = new Set([...wrong.map((q) => q.uid), ...weakPool.map((q) => q.uid)]);
  const filler = shuffle(all.filter((q) => !usedUids.has(q.uid)));

  const combined = [...wrong, ...weakPool, ...filler];
  return combined.slice(0, DRILL_SIZE);
}

// ─── TimerBar ─────────────────────────────────────────────────────────────────

function TimerBar({ secsLeft }: { secsLeft: number }) {
  const pct = (secsLeft / PER_Q_SECS) * 100;
  const urgent = secsLeft <= 3;

  return (
    <div className="relative h-2 bg-border rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-linear ${
          urgent
            ? "bg-destructive"
            : secsLeft <= 5
            ? "bg-amber-500"
            : "bg-emerald-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RapidRevision({ onComplete }: { onComplete?: () => void } = {}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<UnifiedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState<(number | null)[]>([]);
  const [secsLeft, setSecsLeft] = useState(PER_Q_SECS);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [showReview, setShowReview] = useState(false);

  // AI questions from /daily-questions.json
  const [aiQuestions, setAiQuestions] = useState<UnifiedQuestion[]>([]);

  // Fetch AI questions on mount
  useEffect(() => {
    fetch(`/daily-questions.json?v=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const qs = (data.questions ?? []) as AIQuestion[];
        setAiQuestions(qs.map(aiToUnified));
      })
      .catch(() => {});
  }, []);

  const allLocal = useMemo(() => QUESTIONS.map(localToUnified), []);

  // Timer ref pattern to avoid stale closures
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<() => void>(() => {});

  const stopTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start session
  const startSession = useCallback(() => {
    const attempts = safeLoad<Record<string, AttemptRecord>>(
      "neetpg_pyq_attempts",
      {}
    );
    const pool = buildPool(allLocal, aiQuestions, attempts);
    if (pool.length === 0) return;
    setQuestions(pool);
    setCurrentIdx(0);
    setSessionAnswers(new Array(Math.min(pool.length, DRILL_SIZE)).fill(null));
    setSecsLeft(PER_Q_SECS);
    setFlash(null);
    setShowReview(false);
    setPhase("running");
  }, [allLocal, aiQuestions]);

  // Advance to next question or end
  const advance = useCallback(
    (qIdx: number) => {
      stopTimer();
      setFlash(null);
      if (qIdx + 1 >= questions.length) {
        setPhase("summary");
        onComplete?.();
      } else {
        setCurrentIdx(qIdx + 1);
        setSecsLeft(PER_Q_SECS);
        setPhase("running");
      }
    },
    [stopTimer, questions.length]
  );

  // Keep advanceRef current
  useEffect(() => {
    advanceRef.current = () => advance(currentIdx);
  }, [advance, currentIdx]);

  // Timer tick
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
          // Time expired — count as wrong, show flash, then advance
          setSessionAnswers((ans) => {
            const next = [...ans];
            next[currentIdx] = null; // null = expired = wrong
            return next;
          });
          setFlash("wrong");
          setPhase("flash");
          setTimeout(() => advanceRef.current(), FLASH_MS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, currentIdx, stopTimer]);

  // Handle answer selection
  const selectAnswer = (opt: number) => {
    if (phase !== "running") return;
    stopTimer();
    const q = questions[currentIdx];
    const correct = opt === q.answer;
    setSessionAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = opt;
      return next;
    });
    setFlash(correct ? "correct" : "wrong");
    setPhase("flash");
    setTimeout(() => advanceRef.current(), FLASH_MS);
  };

  // Summary stats
  const summary = useMemo(() => {
    if (phase !== "summary") return null;
    let correct = 0;
    const mistakes: { q: UnifiedQuestion; chosen: number | null }[] = [];
    questions.forEach((q, i) => {
      const ans = sessionAnswers[i];
      if (ans !== null && ans === q.answer) {
        correct++;
      } else {
        mistakes.push({ q, chosen: ans });
      }
    });
    const total = questions.length;
    const pct = total > 0 ? (correct / total) * 100 : 0;
    return { correct, total, pct, mistakes };
  }, [phase, questions, sessionAnswers]);

  // Encouragement message
  const encouragement = (pct: number) => {
    if (pct === 100) return "Perfect round! Outstanding recall!";
    if (pct >= 80) return "Excellent! You're in great shape.";
    if (pct >= 60) return "Good effort. A bit more revision will seal it.";
    if (pct >= 40) return "Keep drilling — repetition builds retention.";
    return "Tough session. Focus on these weak spots today!";
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — IDLE
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "idle") {
    const attempts = safeLoad<Record<string, AttemptRecord>>(
      "neetpg_pyq_attempts",
      {}
    );
    const wrongCount = Object.values(attempts).filter((a) => !a.correct).length;
    const weakSubjs = getWeakSubjects(attempts);

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-amber-500/20 p-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">
              Rapid Revision
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              10 questions · 8 seconds each · no navigation
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* How it works */}
          <div className="space-y-2">
            {[
              {
                icon: <XCircle className="w-3.5 h-3.5 text-destructive" />,
                label: `${wrongCount} wrong answers queued`,
                sub: "Questions you previously got wrong",
              },
              {
                icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
                label:
                  weakSubjs.size > 0
                    ? `${weakSubjs.size} weak subject${weakSubjs.size !== 1 ? "s" : ""} targeted`
                    : "All subjects balanced",
                sub:
                  weakSubjs.size > 0
                    ? Array.from(weakSubjs).slice(0, 3).join(", ") +
                      (weakSubjs.size > 3 ? "…" : "")
                    : "No weak subjects detected yet",
              },
            ].map(({ icon, label, sub }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border/50"
              >
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p className="text-xs font-mono font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3 text-[11px] font-mono text-foreground/70 space-y-1 leading-relaxed">
            <p>
              <span className="text-amber-400 font-bold">8 seconds</span> per
              question — timer auto-submits when it expires.
            </p>
            <p>
              <span className="text-amber-400 font-bold">No going back</span>{" "}
              — strict sequential, fast-paced.
            </p>
            <p>1-second flash shows correct/wrong, then moves on.</p>
          </div>

          <button
            onClick={startSession}
            className="w-full py-3 rounded-xl bg-amber-500 text-black font-mono font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Zap className="w-4 h-4 inline mr-2 mb-0.5" />
            Start Rapid Drill
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — RUNNING / FLASH
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "running" || phase === "flash") {
    const q = questions[currentIdx];
    const total = questions.length;
    const progressPct = ((currentIdx + (phase === "flash" ? 1 : 0)) / total) * 100;
    const selectedAns = sessionAnswers[currentIdx];
    const isFlash = phase === "flash";

    return (
      <div
        className={`bg-card border rounded-xl overflow-hidden transition-colors duration-200 ${
          isFlash
            ? flash === "correct"
              ? "border-emerald-500/60"
              : "border-destructive/60"
            : "border-border"
        }`}
      >
        {/* Top bar */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between gap-3 transition-colors duration-200 ${
            isFlash
              ? flash === "correct"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-destructive/40 bg-destructive/5"
              : "border-border"
          }`}
        >
          <span className="text-xs font-mono font-bold text-muted-foreground">
            <span className="text-foreground">{currentIdx + 1}</span>
            <span className="text-muted-foreground/50"> / {total}</span>
          </span>

          {/* Timer digit */}
          <div
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg transition-colors ${
              secsLeft <= 3
                ? "border-destructive text-destructive animate-pulse"
                : secsLeft <= 5
                ? "border-amber-500 text-amber-400"
                : "border-emerald-500/60 text-emerald-400"
            }`}
          >
            {secsLeft}
          </div>

          {isFlash ? (
            <span
              className={`text-xs font-mono font-bold ${
                flash === "correct" ? "text-emerald-400" : "text-destructive"
              }`}
            >
              {flash === "correct" ? "Correct!" : "Wrong"}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-muted-foreground">
              {q.subject}
            </span>
          )}
        </div>

        {/* Timer bar */}
        <div className="px-0">
          <TimerBar secsLeft={secsLeft} />
        </div>

        {/* Progress bar (question count) */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-muted-foreground/40 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-5 space-y-4">
          <p className="text-sm font-mono text-foreground leading-relaxed min-h-[3rem]">
            {q.stem}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls = "";
              if (isFlash) {
                if (i === q.answer) {
                  cls =
                    "bg-emerald-500/10 border-emerald-500 text-emerald-300";
                } else if (i === selectedAns && i !== q.answer) {
                  cls = "bg-destructive/10 border-destructive text-destructive";
                } else {
                  cls = "bg-background border-border/30 text-foreground/25";
                }
              } else {
                cls =
                  "bg-background border-border text-muted-foreground hover:border-amber-500/50 hover:text-foreground hover:bg-amber-500/5 active:scale-[0.99]";
              }

              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  disabled={isFlash}
                  className={`w-full flex items-start gap-3 px-4 py-2.5 rounded-xl border text-left text-sm font-mono transition-all duration-150 ${cls}`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors ${
                      isFlash && i === q.answer
                        ? "border-emerald-500 bg-emerald-500/30 text-emerald-400"
                        : isFlash && i === selectedAns && i !== q.answer
                        ? "border-destructive bg-destructive/20 text-destructive"
                        : "border-current"
                    }`}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Flash explanation (wrong only) */}
          {isFlash && flash === "wrong" && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2 text-[11px] font-mono text-foreground/70 leading-relaxed">
              <span className="text-destructive font-semibold">
                Correct answer:{" "}
              </span>
              {OPTION_LABELS[q.answer]}. {q.explanation.slice(0, 140)}
              {q.explanation.length > 140 ? "…" : ""}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — SUMMARY
  // ─────────────────────────────────────────────────────────────────────────
  if (phase === "summary" && summary) {
    const { correct, total, pct, mistakes } = summary;
    const color =
      pct >= 80
        ? "#22c55e"
        : pct >= 60
        ? "#eab308"
        : pct >= 40
        ? "#f97316"
        : "#ef4444";

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-amber-500/20 p-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">
              Session Complete
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              Rapid Revision · {total} questions
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Score ring + stats */}
          <div
            className="rounded-xl border p-5 flex flex-col items-center gap-3"
            style={{
              borderColor: color + "40",
              backgroundColor: color + "0d",
            }}
          >
            {/* Big score */}
            <div className="text-center">
              <p
                className="text-5xl font-mono font-bold"
                style={{ color }}
              >
                {correct}
                <span
                  className="text-2xl font-normal text-muted-foreground"
                >
                  /{total}
                </span>
              </p>
              <p
                className="text-lg font-mono font-semibold mt-1"
                style={{ color }}
              >
                {pct.toFixed(0)}% accuracy
              </p>
            </div>

            {/* Bar */}
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, pct)}%`,
                  backgroundColor: color,
                }}
              />
            </div>

            {/* Encouragement */}
            <p
              className="text-[11px] font-mono font-semibold text-center"
              style={{ color }}
            >
              {encouragement(pct)}
            </p>
          </div>

          {/* Correct / Wrong grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-2xl font-mono font-bold text-emerald-400">
                {correct}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Correct
              </p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
              <XCircle className="w-5 h-5 text-destructive mx-auto mb-1.5" />
              <p className="text-2xl font-mono font-bold text-destructive">
                {total - correct}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                Wrong / Expired
              </p>
            </div>
          </div>

          {/* Review Mistakes toggle */}
          {mistakes.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowReview((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-background/50 hover:bg-background transition-colors text-sm font-mono font-semibold text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  Review Mistakes ({mistakes.length})
                </span>
                {showReview ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showReview && (
                <div className="divide-y divide-border">
                  {mistakes.map(({ q, chosen }, i) => (
                    <div key={q.uid} className="px-4 py-4 text-xs font-mono">
                      <p className="text-foreground/80 leading-relaxed mb-2">
                        <span className="text-muted-foreground mr-1.5">
                          Q{i + 1}
                        </span>
                        {q.stem}
                      </p>

                      <div className="space-y-1 mb-2">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={`flex items-start gap-2 px-3 py-1.5 rounded-lg ${
                              oi === q.answer
                                ? "bg-emerald-500/10 text-emerald-300"
                                : oi === chosen
                                ? "bg-destructive/10 text-destructive"
                                : "text-foreground/30"
                            }`}
                          >
                            <span className="font-bold shrink-0">
                              {OPTION_LABELS[oi]}.
                            </span>
                            <span>{opt}</span>
                            {oi === q.answer && (
                              <CheckCircle className="w-3 h-3 ml-auto shrink-0 mt-0.5 text-emerald-400" />
                            )}
                            {oi === chosen && oi !== q.answer && (
                              <XCircle className="w-3 h-3 ml-auto shrink-0 mt-0.5 text-destructive" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-background/60 border border-border rounded-lg px-3 py-2 text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={startSession}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-mono font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Start Again
            </button>
            {mistakes.length > 0 && !showReview && (
              <button
                onClick={() => setShowReview(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background text-sm font-mono font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Eye className="w-4 h-4" />
                Review Mistakes
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
