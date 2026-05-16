import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen, CheckCircle, XCircle, Shuffle, ChevronLeft, ChevronRight,
  RotateCcw, TrendingUp, Lightbulb, Brain, Zap, RefreshCw, Search,
} from "lucide-react";
import { QUESTIONS, QUESTION_SUBJECTS, Question } from "@/data/questions";
import { safeLoad, safeSave } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttemptRecord { selected: number; correct: boolean; }
type FilterMode      = "all" | "unattempted" | "wrong";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type SourceFilter    = "all" | "today" | "classic";

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
  topic?: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  mnemonic?: string | null;
  key_concept?: string | null;
  difficulty: "easy" | "medium" | "hard";
  exam_hint?: string | null;
  isAI: boolean;
  batch_date?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function localToUnified(q: Question): UnifiedQuestion {
  return {
    uid: `local-${q.id}`,
    subject: q.subject,
    stem: q.stem,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    difficulty: "medium",
    isAI: false,
  };
}

function aiToUnified(q: AIQuestion): UnifiedQuestion {
  return {
    uid: q.id,
    subject: q.subject,
    topic: q.topic,
    stem: q.question,
    options: q.options as [string, string, string, string],
    answer: q.correct_answer as 0 | 1 | 2 | 3,
    explanation: q.explanation,
    mnemonic: q.mnemonic,
    key_concept: q.key_concept,
    difficulty: q.difficulty ?? "medium",
    exam_hint: q.exam_hint,
    isAI: true,
    batch_date: q.batch_date,
  };
}

function loadAttempts(): Record<string, AttemptRecord> {
  return safeLoad("neetpg_pyq_attempts", {});
}
function saveAttempts(a: Record<string, AttemptRecord>) {
  safeSave("neetpg_pyq_attempts", a);
}

const TODAY = new Date().toISOString().slice(0, 10);

const DIFF_COLORS: Record<string, string> = {
  easy:   "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  medium: "text-yellow-400  border-yellow-500/40  bg-yellow-500/10",
  hard:   "text-destructive border-destructive/40  bg-destructive/10",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DiffBadge({ level }: { level: string }) {
  return (
    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${DIFF_COLORS[level] ?? DIFF_COLORS.medium}`}>
      {level}
    </span>
  );
}

function MnemonicBox({ text }: { text: string }) {
  return (
    <div className="mx-5 mb-3 flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/25 rounded-xl px-4 py-3">
      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider mb-1">Mnemonic</p>
        <p className="text-sm font-mono text-yellow-200 font-semibold leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function KeyConceptBox({ text }: { text: string }) {
  return (
    <div className="mx-5 mb-3 flex items-start gap-2 bg-primary/8 border border-primary/25 rounded-xl px-4 py-3">
      <Brain className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">Key Concept</p>
        <p className="text-sm font-mono text-foreground/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ─── Stats View ───────────────────────────────────────────────────────────────

function StatsView({
  attempts, allQuestions, onBack, onReset, todayCount,
}: {
  attempts: Record<string, AttemptRecord>;
  allQuestions: UnifiedQuestion[];
  onBack: () => void;
  onReset: () => void;
  todayCount: number;
}) {
  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect   = Object.values(attempts).filter(a => a.correct).length;
  const overallPct     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const subjectStats = useMemo(() => {
    return QUESTION_SUBJECTS.map(subj => {
      const qs      = allQuestions.filter(q => q.subject === subj);
      const done    = qs.filter(q => attempts[q.uid]);
      const correct = done.filter(q => attempts[q.uid].correct);
      return { subj, total: qs.length, done: done.length, correct: correct.length };
    });
  }, [attempts, allQuestions]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono font-bold uppercase text-sm text-foreground">Performance Stats</h2>
        <button onClick={onBack} className="text-xs font-mono text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-md">
          Back to Practice
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Overall Accuracy", value: overallPct !== null ? `${overallPct}%` : "—", color: "text-primary"     },
          { label: "Attempted",        value: totalAttempted,                                color: "text-foreground"  },
          { label: "Correct",          value: totalCorrect,                                  color: "text-emerald-400" },
          { label: "Today's AI Qs",    value: todayCount,                                    color: "text-yellow-400"  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <p className="text-xs font-mono uppercase text-muted-foreground mb-4">By Subject</p>
        {subjectStats.map(({ subj, total, done, correct }) => {
          const pct   = done > 0 ? Math.round((correct / done) * 100) : null;
          const color = pct === null ? "#555" : pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
          return (
            <div key={subj} className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-muted-foreground w-40 truncate shrink-0">{subj}</span>
              <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                <div className="h-full rounded-full transition-all" style={{ width: `${total > 0 ? (done/total)*100 : 0}%`, backgroundColor: color }} />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground w-20 text-right shrink-0">
                {done}/{total}{pct !== null ? ` (${pct}%)` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <button onClick={onReset} className="flex items-center gap-2 text-xs font-mono text-destructive border border-destructive/30 px-4 py-2 rounded-md hover:bg-destructive/10 transition-colors">
        <RotateCcw className="w-3.5 h-3.5" /> Reset all attempts
      </button>
    </div>
  );
}

// ─── Main PYQBank ─────────────────────────────────────────────────────────────

interface PYQBankProps {
  onCorrect?: () => void;
  onWrong?: () => void;
}

export function PYQBank({ onCorrect, onWrong }: PYQBankProps = {}) {
  const [attempts,    setAttempts]    = useState<Record<string, AttemptRecord>>(loadAttempts);
  const [subject,     setSubject]     = useState<string>("All");
  const [mode,        setMode]        = useState<FilterMode>("all");
  const [difficulty,  setDifficulty]  = useState<DifficultyFilter>("all");
  const [source,      setSource]      = useState<SourceFilter>("all");
  const [qIndex,      setQIndex]      = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showStats,   setShowStats]   = useState<boolean>(false);
  const [search,      setSearch]      = useState<string>("");

  // AI questions loaded from static JSON file (auto-published by GitHub Actions)
  const [aiQuestions, setAiQuestions] = useState<UnifiedQuestion[]>([]);
  const [aiMeta,      setAiMeta]      = useState<{ lastUpdated: string; todayCount: number; totalDays: number } | null>(null);
  const [loadingAI,   setLoadingAI]   = useState<boolean>(true);

  const fetchAI = useCallback(async () => {
    setLoadingAI(true);
    try {
      const res  = await fetch(`/daily-questions.json?v=${Date.now()}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      const qs   = (data.questions ?? []) as AIQuestion[];
      setAiQuestions(qs.map(aiToUnified));
      setAiMeta({ lastUpdated: data.lastUpdated ?? "", todayCount: data.todayCount ?? 0, totalDays: data.totalDays ?? 1 });
    } catch {
      // File doesn't exist yet — first workflow run pending; silent fallback
    } finally {
      setLoadingAI(false);
    }
  }, []);

  useEffect(() => { fetchAI(); }, [fetchAI]);

  const allQuestions = useMemo<UnifiedQuestion[]>(() => [
    ...aiQuestions,
    ...QUESTIONS.map(localToUnified),
  ], [aiQuestions]);

  const todayCount = useMemo(
    () => aiQuestions.filter(q => q.batch_date === TODAY).length,
    [aiQuestions]
  );

  const pool = useMemo<UnifiedQuestion[]>(() => {
    let qs = allQuestions;

    if (source === "today")   qs = qs.filter(q => q.isAI && q.batch_date === TODAY);
    if (source === "classic") qs = qs.filter(q => !q.isAI);

    if (subject !== "All")    qs = qs.filter(q => q.subject === subject);
    if (difficulty !== "all") qs = qs.filter(q => q.difficulty === difficulty);

    if (mode === "unattempted") qs = qs.filter(q => !attempts[q.uid]);
    if (mode === "wrong")       qs = qs.filter(q => attempts[q.uid] && !attempts[q.uid].correct);

    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter(q =>
        q.stem.toLowerCase().includes(s) ||
        q.subject.toLowerCase().includes(s) ||
        q.topic?.toLowerCase().includes(s)
      );
    }
    return qs;
  }, [allQuestions, source, subject, difficulty, mode, search, attempts]);

  const current = pool[qIndex] ?? null;
  const attempt = current ? attempts[current.uid] : null;
  const revealed = selectedOpt !== null || attempt != null;

  const goTo = (idx: number) => {
    setQIndex(Math.max(0, Math.min(idx, pool.length - 1)));
    setSelectedOpt(null);
  };

  const select = (opt: number) => {
    if (revealed || !current) return;
    setSelectedOpt(opt);
    const correct = opt === current.answer;
    const next    = { ...attempts, [current.uid]: { selected: opt, correct } };
    setAttempts(next);
    saveAttempts(next);
    if (correct) onCorrect?.(); else onWrong?.();
  };

  const resetAll = () => {
    setAttempts({});
    saveAttempts({});
    setQIndex(0);
    setSelectedOpt(null);
  };

  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect   = Object.values(attempts).filter(a => a.correct).length;
  const overallPct     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const OPTION_LABELS = ["A", "B", "C", "D"] as const;

  const optClass = (i: number) => {
    if (!revealed) return "border-border text-foreground/80 hover:border-primary/50 hover:bg-primary/5";
    if (i === current!.answer) return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
    const chosen = selectedOpt ?? attempt?.selected ?? -1;
    if (i === chosen && i !== current!.answer) return "border-destructive bg-destructive/10 text-destructive";
    return "border-border/40 text-foreground/30";
  };

  if (showStats) {
    return (
      <StatsView
        attempts={attempts}
        allQuestions={allQuestions}
        onBack={() => setShowStats(false)}
        onReset={() => { resetAll(); setShowStats(false); }}
        todayCount={todayCount}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 h-[calc(100vh-160px)]">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">PYQ Practice</h2>
            <p className="text-xs text-muted-foreground font-mono">
              {allQuestions.length.toLocaleString()} questions
              {aiMeta && aiMeta.totalDays > 0 && (
                <span className="ml-2 text-primary/80">
                  · Day {aiMeta.totalDays} · {(aiMeta.totalDays * 500).toLocaleString()} total
                </span>
              )}
              {todayCount > 0 && (
                <span className="ml-2 text-yellow-400">
                  <Zap className="w-3 h-3 inline mr-0.5" />+{todayCount} today
                </span>
              )}
              {loadingAI && <span className="ml-2 animate-pulse">· loading…</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {overallPct !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">{overallPct}% accuracy</span>
            </div>
          )}
          <button
            onClick={fetchAI}
            title="Refresh AI questions"
            className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowStats(true)} className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors">
            Stats
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setQIndex(0); setSelectedOpt(null); }}
          placeholder="Search questions, topics, subjects…"
          className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 shrink-0">
        {/* Source */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "today", "classic"] as SourceFilter[]).map(s => (
            <button
              key={s}
              onClick={() => { setSource(s); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                source === s ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              {s === "today" ? `Today's AI (${todayCount})` : s === "classic" ? "Classic PYQ" : "All"}
            </button>
          ))}
        </div>

        {/* Subject */}
        <div className="flex flex-wrap gap-1.5">
          {["All", ...QUESTION_SUBJECTS].map(s => (
            <button
              key={s}
              onClick={() => { setSubject(s); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                subject === s ? "bg-secondary text-secondary-foreground border-secondary" : "text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Mode + Difficulty */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "unattempted", "wrong"] as FilterMode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                mode === m ? "bg-card text-foreground border-border" : "text-muted-foreground border-border/50 hover:border-muted-foreground"
              }`}
            >
              {m === "unattempted" ? "New" : m === "wrong" ? "Wrong" : "All"}
            </button>
          ))}
          <div className="w-px h-5 bg-border self-center mx-1" />
          {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map(d => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors capitalize ${
                difficulty === d
                  ? d === "all"    ? "bg-secondary text-secondary-foreground border-secondary"
                  : d === "easy"   ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : d === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                  :                  "bg-destructive/20 text-destructive border-destructive/40"
                  : "text-muted-foreground border-border/50 hover:border-muted-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {pool.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400/40 mx-auto" />
            <p className="text-sm font-mono text-muted-foreground">
              {mode === "unattempted" ? "All questions attempted!" : "No wrong answers — great work!"}
            </p>
            <button
              onClick={() => { setMode("all"); setDifficulty("all"); setSource("all"); setQIndex(0); }}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono rounded-md"
            >
              Show All
            </button>
          </div>
        </div>
      ) : current ? (
        <>
          {/* Question card */}
          <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl flex flex-col min-h-0">
            {/* Card header */}
            <div className="px-5 pt-4 pb-3 border-b border-border/50 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                  {current.subject}
                </span>
                {current.topic && (
                  <span className="text-[10px] font-mono text-muted-foreground/70">{current.topic}</span>
                )}
                <DiffBadge level={current.difficulty} />
                {current.isAI && current.exam_hint && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-primary/30 text-primary/70 bg-primary/5">
                    {current.exam_hint}
                  </span>
                )}
                {attempt && (attempt.correct
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <XCircle    className="w-4 h-4 text-destructive" />
                )}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                {qIndex + 1} / {pool.length}
              </span>
            </div>

            {/* Stem */}
            <div className="px-5 py-5">
              <p className="font-serif text-base text-foreground leading-relaxed">{current.stem}</p>
            </div>

            {/* Options */}
            <div className="px-5 pb-5 space-y-2.5">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => select(i)}
                  disabled={revealed}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-mono flex items-start gap-3 ${optClass(i)}`}
                >
                  <span className="font-bold shrink-0">{OPTION_LABELS[i]}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Rank-1 reveal: key concept → mnemonic → full explanation */}
            {revealed && (
              <>
                {current.key_concept && <KeyConceptBox text={current.key_concept} />}
                {current.mnemonic    && <MnemonicBox   text={current.mnemonic}   />}
                <div className="mx-5 mb-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <p className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1.5">Explanation</p>
                  <p className="text-sm font-mono text-foreground/80 leading-relaxed">{current.explanation}</p>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="shrink-0 flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(qIndex - 1)}
              disabled={qIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => goTo(Math.floor(Math.random() * pool.length))}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4" /> Random
            </button>
            <button
              onClick={() => goTo(qIndex + 1)}
              disabled={qIndex >= pool.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
