import { useState, useEffect, useCallback } from "react";
import { Sparkles, Flame, CalendarCheck, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

interface PredictionMeta {
  confidence: "high" | "medium" | "low";
  rationale: string;
  topic_frequency: string;
}

interface AIQuestion {
  id: number;
  subject: string;
  topic: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  prediction: PredictionMeta;
}

interface DailyData {
  date: string;
  theme: string;
  questions: AIQuestion[];
}

interface DailyLog {
  [dateKey: string]: { score: number; total: number; completed: boolean };
}

const LOG_KEY = "neetpg_ai_quiz_log";

function computeStreak(log: DailyLog): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (log[key]?.completed) streak++;
    else break;
  }
  return streak;
}

const CONFIDENCE_STYLES: Record<string, string> = {
  high:   "text-rose-400 bg-rose-500/10 border-rose-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  low:    "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

function PredictionBadge({ p }: { p: PredictionMeta }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2 border mt-3 ${CONFIDENCE_STYLES[p.confidence]}`}>
      <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">{p.confidence} prediction</span>
          <span className="text-[10px] font-mono opacity-70">{p.topic_frequency}</span>
        </div>
        <p className="text-[11px] font-mono opacity-90 leading-relaxed">{p.rationale}</p>
      </div>
    </div>
  );
}

export function AIPredictedQuiz() {
  const todayKey = new Date().toISOString().slice(0, 10);

  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [log, setLog]     = useState<DailyLog>(() => safeLoad(LOG_KEY, {}));
  const streak             = computeStreak(log);
  const todayEntry         = log[todayKey];

  const [started, setStarted]               = useState(false);
  const [practiceMode, setPracticeMode]     = useState(false);
  const [qIdx, setQIdx]                     = useState(0);
  const [selected, setSelected]             = useState<number | null>(null);
  const [answers, setAnswers]               = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished]             = useState(false);
  const [score, setScore]                   = useState(0);
  const [showPrediction, setShowPrediction] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/daily-questions?date=${todayKey}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data: DailyData = await res.json();
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No questions returned");
      }
      setDailyData(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [todayKey]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const questions = dailyData?.questions ?? [];

  const startQuiz = (practice = false) => {
    setPracticeMode(practice);
    setStarted(true);
    setFinished(false);
    setQIdx(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setShowExplanation(false);
    setShowPrediction(false);
    setScore(0);
  };

  const handleSelect = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    setShowExplanation(true);
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (qIdx + 1 < questions.length) {
      setQIdx(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
      setShowPrediction(false);
    } else {
      const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
      setScore(correct);
      setFinished(true);
      if (!practiceMode && !todayEntry?.completed) {
        const updated = { ...log, [todayKey]: { score: correct, total: questions.length, completed: true } };
        setLog(updated);
        safeSave(LOG_KEY, updated);
      }
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 max-w-2xl mx-auto">
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6">
          <Sparkles className="w-10 h-10 text-violet-400 mx-auto animate-pulse" />
        </div>
        <p className="text-sm font-mono text-muted-foreground">Generating today's AI questions…</p>
        <p className="text-xs font-mono text-muted-foreground/60">First load may take ~5 seconds</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-2xl mx-auto text-center">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        </div>
        <div>
          <p className="font-mono font-bold text-foreground mb-1">Could not load AI questions</p>
          <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto leading-relaxed mb-1">
            {fetchError.includes("No AI provider") || fetchError.includes("GEMINI")
              ? "Add a free AI key to Vercel env vars: GEMINI_API_KEY (Google AI Studio — free) or GROQ_API_KEY (Groq — free)."
              : fetchError}
          </p>
          {fetchError.includes("daily_questions") && (
            <p className="text-xs font-mono text-amber-400 mt-2">
              Run the Supabase SQL setup (see below) and redeploy.
            </p>
          )}
        </div>
        <button
          onClick={fetchQuestions}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
        <details className="w-full max-w-md text-left">
          <summary className="text-xs font-mono text-muted-foreground/60 cursor-pointer">Supabase SQL setup</summary>
          <pre className="mt-2 text-[10px] font-mono bg-card border border-border rounded-lg p-3 overflow-x-auto text-muted-foreground whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS daily_questions (
  date DATE PRIMARY KEY,
  theme TEXT,
  questions JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON daily_questions
  FOR SELECT USING (true);
CREATE POLICY "public_insert" ON daily_questions
  FOR INSERT WITH CHECK (true);`}
          </pre>
        </details>
      </div>
    );
  }

  // ── Already completed today ──────────────────────────────────────────────────
  if (!started && todayEntry?.completed) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <QuizHeader streak={streak} date={todayKey} theme={dailyData?.theme} />
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold font-mono text-emerald-400 mb-1">{todayEntry.score}/{todayEntry.total}</div>
          <div className="text-sm text-muted-foreground">Today's AI quiz completed!</div>
          <div className="text-xs font-mono text-emerald-400 mt-1">{Math.round(todayEntry.score / todayEntry.total * 100)}% accuracy</div>
        </div>
        <button onClick={() => startQuiz(true)} className="px-4 py-3 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground transition-colors">
          Practice Again (won't count toward daily)
        </button>
      </div>
    );
  }

  // ── Landing ──────────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <QuizHeader streak={streak} date={todayKey} theme={dailyData?.theme} />
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{questions.length}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">
                {Object.values(log).filter(v => v.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Days Done</div>
            </div>
          </div>

          {/* Subject preview */}
          <div className="flex flex-wrap gap-1.5">
            {[...new Set(questions.map(q => q.subject))].map(s => (
              <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                {s}
              </span>
            ))}
          </div>

          <button onClick={() => startQuiz(false)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-mono font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Start AI Quiz — {todayKey}
          </button>
        </div>
      </div>
    );
  }

  // ── Finished ─────────────────────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground">{practiceMode ? "Practice Complete" : "AI Quiz — Done!"}</h2>
        <div className={`rounded-xl p-6 text-center border ${score / questions.length >= 0.7 ? "bg-green-500/10 border-green-500/30" : score / questions.length >= 0.5 ? "bg-amber-500/10 border-amber-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
          <div className={`text-4xl font-bold font-mono mb-2 ${score / questions.length >= 0.7 ? "text-green-400" : score / questions.length >= 0.5 ? "text-amber-400" : "text-rose-400"}`}>
            {score}/{questions.length}
          </div>
          <div className="text-sm text-muted-foreground">{Math.round(score / questions.length * 100)}% accuracy</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold text-foreground mb-1">Question Review</div>
          {questions.map((q, i) => {
            const correct = answers[i] === q.answer;
            return (
              <div key={q.id} className={`rounded-lg p-3 border text-xs ${correct ? "border-green-500/30 bg-green-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
                <div className="font-medium text-foreground mb-1">{i + 1}. {q.stem}</div>
                <div className="text-green-400 mb-1">Correct: {q.options[q.answer]}</div>
                {!correct && (
                  <div className="text-rose-400 mb-1">
                    Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Not answered"}
                  </div>
                )}
                <div className="text-muted-foreground italic mb-2">{q.explanation}</div>
                <PredictionBadge p={q.prediction} />
              </div>
            );
          })}
        </div>

        <button onClick={() => setStarted(false)} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">
          Back
        </button>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  const currentQ = questions[qIdx];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {practiceMode && (
        <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
          Practice mode — not counted toward daily
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          AI Daily Quiz
        </h2>
        <span className="text-xs font-mono text-muted-foreground">Q {qIdx + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-card border border-border rounded-full h-1.5">
        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
      </div>

      {currentQ && (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
              {currentQ.subject}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/60">{currentQ.topic}</span>
            <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded border ${CONFIDENCE_STYLES[currentQ.prediction.confidence]}`}>
              {currentQ.prediction.confidence} yield
            </span>
          </div>

          <div className="text-foreground font-medium leading-relaxed">{currentQ.stem}</div>

          <div className="flex flex-col gap-2">
            {currentQ.options.map((opt, i) => {
              let cls = "bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground cursor-pointer";
              if (selected !== null) {
                if (i === currentQ.answer)      cls = "bg-green-500/20 border-green-500/50 text-green-400";
                else if (i === selected)         cls = "bg-rose-500/20 border-rose-500/50 text-rose-400";
                else                             cls = "bg-background border border-border/50 text-muted-foreground/40";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${cls}`}
                >
                  <span className="font-mono text-xs mr-2">{["A","B","C","D"][i]}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-background border border-border rounded-lg p-3 text-xs text-muted-foreground">
              <span className="text-foreground font-mono text-[10px] block mb-1">EXPLANATION</span>
              {currentQ.explanation}
            </div>
          )}

          {selected !== null && !showPrediction && (
            <button
              onClick={() => setShowPrediction(true)}
              className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1.5 self-start"
            >
              <TrendingUp className="w-3 h-3" />
              Why is this predicted for Nov 2026?
            </button>
          )}

          {showPrediction && <PredictionBadge p={currentQ.prediction} />}

          {selected !== null && (
            <button onClick={handleNext} className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-mono">
              {qIdx + 1 < questions.length ? "Next Question →" : "See Results"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuizHeader({ streak, date, theme }: { streak: number; date: string; theme?: string }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            AI Daily Quiz
            <span className="text-[10px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">AI Generated</span>
          </h2>
          <p className="text-xs text-muted-foreground font-mono">{date}{theme ? ` · ${theme}` : ""}</p>
        </div>
      </div>
      {streak > 0 && (
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-mono text-orange-400 font-bold">{streak} day streak</span>
        </div>
      )}
    </div>
  );
}
