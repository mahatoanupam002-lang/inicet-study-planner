import { useState, useMemo } from "react";
import { BookOpen, CheckCircle, XCircle, Shuffle, ChevronLeft, ChevronRight, RotateCcw, TrendingUp } from "lucide-react";
import { QUESTIONS, QUESTION_SUBJECTS, Question } from "@/data/questions";
import { safeLoad, safeSave } from "@/lib/storage";

interface AttemptRecord { selected: number; correct: boolean; }
type FilterMode = "all" | "unattempted" | "wrong";

function loadAttempts(): Record<number, AttemptRecord> {
  return safeLoad("inicet_pyq_attempts", {});
}

function saveAttempts(attempts: Record<number, AttemptRecord>) {
  safeSave("inicet_pyq_attempts", attempts);
}

export function PYQBank() {
  const [attempts,      setAttempts]      = useState<Record<number, AttemptRecord>>(loadAttempts);
  const [subject,       setSubject]       = useState<string>("All");
  const [mode,          setMode]          = useState<FilterMode>("all");
  const [qIndex,        setQIndex]        = useState<number>(0);
  const [selectedOpt,   setSelectedOpt]   = useState<number | null>(null);
  const [showStats,     setShowStats]     = useState<boolean>(false);

  // Filtered question list
  const pool = useMemo<Question[]>(() => {
    let qs = subject === "All" ? QUESTIONS : QUESTIONS.filter(q => q.subject === subject);
    if (mode === "unattempted") qs = qs.filter(q => !attempts[q.id]);
    if (mode === "wrong")       qs = qs.filter(q => attempts[q.id] && !attempts[q.id].correct);
    return qs;
  }, [subject, mode, attempts]);

  const current  = pool[qIndex] ?? null;
  const attempt  = current ? attempts[current.id] : null;
  const revealed = selectedOpt !== null || attempt != null;

  const goTo = (idx: number) => {
    setQIndex(Math.max(0, Math.min(idx, pool.length - 1)));
    setSelectedOpt(null);
  };

  const random = () => goTo(Math.floor(Math.random() * pool.length));

  const select = (opt: number) => {
    if (revealed || !current) return;
    setSelectedOpt(opt);
    const correct = opt === current.answer;
    const next    = { ...attempts, [current.id]: { selected: opt, correct } };
    setAttempts(next);
    saveAttempts(next);
  };

  const resetAll = () => {
    setAttempts({});
    saveAttempts({});
    setQIndex(0);
    setSelectedOpt(null);
  };

  // Overall stats
  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect   = Object.values(attempts).filter(a => a.correct).length;
  const overallPct     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  // Per-subject stats
  const subjectStats = useMemo(() => {
    return QUESTION_SUBJECTS.map(subj => {
      const qs   = QUESTIONS.filter(q => q.subject === subj);
      const done = qs.filter(q => attempts[q.id]);
      const correct = done.filter(q => attempts[q.id].correct);
      return { subj, total: qs.length, done: done.length, correct: correct.length };
    });
  }, [attempts]);

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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono font-bold uppercase text-sm text-foreground">Performance Stats</h2>
          <button onClick={() => setShowStats(false)} className="text-xs font-mono text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-md">
            Back to Practice
          </button>
        </div>

        {/* Overall */}
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-mono font-bold text-primary">{overallPct ?? "—"}%</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Overall accuracy</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-foreground">{totalAttempted}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Attempted</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-emerald-400">{totalCorrect}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Correct</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-foreground">{QUESTIONS.length}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-1">Total Qs</p>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <p className="text-xs font-mono uppercase text-muted-foreground mb-4">By Subject</p>
          {subjectStats.map(({ subj, total, done, correct }) => {
            const pct = done > 0 ? Math.round((correct / done) * 100) : null;
            const color = pct === null ? "#555" : pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
            return (
              <div key={subj} className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground w-36 truncate flex-shrink-0">{subj}</span>
                <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(done / total) * 100}%`, backgroundColor: color }} />
                </div>
                <span className="text-[11px] font-mono text-muted-foreground w-16 text-right flex-shrink-0">
                  {done}/{total} {pct !== null ? `(${pct}%)` : ""}
                </span>
              </div>
            );
          })}
        </div>

        <button onClick={resetAll} className="flex items-center gap-2 text-xs font-mono text-destructive border border-destructive/30 px-4 py-2 rounded-md hover:bg-destructive/10 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset all attempts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-5 h-[calc(100vh-160px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">PYQ Practice</h2>
            <p className="text-xs text-muted-foreground font-mono">{QUESTIONS.length} questions · INI-CET style</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {overallPct !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">{overallPct}% accuracy</span>
            </div>
          )}
          <button onClick={() => setShowStats(true)} className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors">
            Stats
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {/* Subject filter */}
        <div className="flex flex-wrap gap-1.5">
          {["All", ...QUESTION_SUBJECTS].map(s => (
            <button
              key={s}
              onClick={() => { setSubject(s); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                subject === s ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {/* Mode filter */}
        <div className="flex gap-1.5 ml-auto">
          {(["all", "unattempted", "wrong"] as FilterMode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setQIndex(0); setSelectedOpt(null); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors capitalize ${
                mode === m ? "bg-secondary text-secondary-foreground border-secondary" : "text-muted-foreground border-border hover:border-muted-foreground"
              }`}
            >
              {m === "unattempted" ? "New" : m === "wrong" ? "Wrong" : "All"}
            </button>
          ))}
        </div>
      </div>

      {pool.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400/40 mx-auto" />
            <p className="text-sm font-mono text-muted-foreground">
              {mode === "unattempted" ? "All questions attempted!" : "No wrong answers — great work!"}
            </p>
            <button onClick={() => { setMode("all"); setQIndex(0); }} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono rounded-md">
              Show All
            </button>
          </div>
        </div>
      ) : current ? (
        <>
          {/* Question card */}
          <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl flex flex-col">
            {/* Question header */}
            <div className="px-5 pt-5 pb-4 border-b border-border/50 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                  {current.subject}
                </span>
                {attempt && (
                  attempt.correct
                    ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                    : <XCircle    className="w-4 h-4 text-destructive" />
                )}
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
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
                  <span className="font-bold flex-shrink-0">{OPTION_LABELS[i]}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {revealed && (
              <div className="mx-5 mb-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
                <p className="text-[11px] font-mono text-emerald-400 uppercase mb-1.5">Explanation</p>
                <p className="text-sm font-mono text-foreground/80 leading-relaxed">{current.explanation}</p>
              </div>
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
              onClick={random}
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
