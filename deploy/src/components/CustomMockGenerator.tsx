import { useState, useMemo } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { QUESTIONS, QUESTION_SUBJECTS } from "@/data/questions";
import { Sliders, Clock, Flag, CheckCircle, XCircle, Download, RotateCcw } from "lucide-react";

interface MockResult {
  date: string;
  selectedSubjects: string[];
  qCount: number;
  score: number;
  adjusted: number;
  total: number;
  timeTaken: number;
  subjectBreakdown: Record<string, { total: number; correct: number; wrong: number }>;
}

const MOCK_HISTORY_KEY = "neetpg_custom_mock_history";

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const h = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const a = [...arr];
  let s = h;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Screen = "setup" | "exam" | "results";

export function CustomMockGenerator() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [qCount, setQCount] = useState(25);
  const [timeMult, setTimeMult] = useState(100); // % of base time

  // Exam state
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);
  const [startTime, setStartTime] = useState(0);

  // Results state
  const [result, setResult] = useState<MockResult | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  const history = useMemo(() => safeLoad<MockResult[]>(MOCK_HISTORY_KEY, []), [result]);

  const subjectCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of QUESTIONS) {
      map[q.subject] = (map[q.subject] ?? 0) + 1;
    }
    return map;
  }, []);

  const availableCount = useMemo(() => {
    return QUESTIONS.filter(q => selectedSubjects.includes(q.subject)).length;
  }, [selectedSubjects]);

  const actualQCount = Math.min(qCount, availableCount);
  const baseTimeSec = actualQCount * 60;
  const totalTimeSec = Math.round(baseTimeSec * timeMult / 100);

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const startExam = () => {
    const pool = QUESTIONS.filter(q => selectedSubjects.includes(q.subject));
    const shuffled = seededShuffle(pool, Date.now().toString()).slice(0, actualQCount);
    setQuestions(shuffled);
    setAnswers(Array(shuffled.length).fill(null));
    setFlagged(Array(shuffled.length).fill(false));
    setQIdx(0);
    setTimeLeft(totalTimeSec);
    setStartTime(Date.now());
    setNavOpen(false);

    // Start timer
    if (timerRef) clearInterval(timerRef);
    const ref = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(ref);
          submitExam(shuffled, answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerRef(ref);
    setScreen("exam");
  };

  const submitExam = (qs = questions, ans = answers) => {
    if (timerRef) clearInterval(timerRef);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    let correct = 0, wrong = 0;
    const breakdown: Record<string, { total: number; correct: number; wrong: number }> = {};
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (!breakdown[q.subject]) breakdown[q.subject] = { total: 0, correct: 0, wrong: 0 };
      breakdown[q.subject].total++;
      if (ans[i] !== null) {
        if (ans[i] === q.answer) { correct++; breakdown[q.subject].correct++; }
        else { wrong++; breakdown[q.subject].wrong++; }
      }
    }
    const adjusted = correct - wrong * 0.25;
    const res: MockResult = {
      date: new Date().toISOString(),
      selectedSubjects,
      qCount: qs.length,
      score: correct,
      adjusted: Math.round(adjusted * 100) / 100,
      total: qs.length,
      timeTaken,
      subjectBreakdown: breakdown,
    };
    setResult(res);
    // Save to history (keep last 5)
    const history = safeLoad<MockResult[]>(MOCK_HISTORY_KEY, []);
    safeSave(MOCK_HISTORY_KEY, [res, ...history].slice(0, 5));
    setScreen("results");
  };

  const handleSelectAnswer = (optIdx: number) => {
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const toggleFlag = (i: number) => {
    const updated = [...flagged];
    updated[i] = !updated[i];
    setFlagged(updated);
  };

  const confirmSubmit = () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0 && !confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) return;
    submitExam();
  };

  const exportResult = () => {
    if (!result) return;
    const lines = [
      `NEET PG Custom Mock — ${result.date.slice(0, 10)}`,
      `Score: ${result.score}/${result.total} | Adjusted (−0.25): ${result.adjusted}/${result.total}`,
      `Accuracy: ${Math.round(result.score / result.total * 100)}%`,
      `Time taken: ${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`,
      ``,
      `Subject Breakdown:`,
      ...Object.entries(result.subjectBreakdown).map(([s, v]) => `  ${s}: ${v.correct}/${v.total} correct`),
      ``,
      `Question Review:`,
      ...questions.map((q, i) => `Q${i+1}. ${q.stem}\nCorrect: ${q.options[q.answer]}\nYours: ${answers[i] !== null ? q.options[answers[i]!] : "Skipped"}\n${q.explanation}\n`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mock-result.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  // ─── Setup Screen ─────────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Sliders className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Custom Mock Generator</h2>
            <p className="text-sm text-muted-foreground font-mono">Build your own timed exam</p>
          </div>
        </div>

        {/* Subject selection */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="font-semibold text-foreground text-sm mb-3">Select Subjects</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUESTION_SUBJECTS.map(s => {
              const count = subjectCounts[s] ?? 0;
              const active = selectedSubjects.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono text-left border transition-colors ${active ? "bg-primary/20 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                >
                  <span>{s}</span>
                  <span className="block text-[10px] opacity-60">{count} questions</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setSelectedSubjects(selectedSubjects.length === QUESTION_SUBJECTS.length ? [] : [...QUESTION_SUBJECTS])}
            className="mt-3 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedSubjects.length === QUESTION_SUBJECTS.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Question count slider */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="font-semibold text-foreground text-sm mb-3">Question Count: {actualQCount}</div>
          <input type="range" min={10} max={200} step={5} value={qCount} onChange={e => setQCount(parseInt(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
            {[10,25,50,100,200].map(n => <span key={n}>{n}</span>)}
          </div>
          {availableCount < qCount && (
            <div className="text-xs text-amber-400 mt-2">Only {availableCount} questions available for selected subjects. Will use all.</div>
          )}
        </div>

        {/* Time limit */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="font-semibold text-foreground text-sm mb-3">
            Time Limit: {formatTime(totalTimeSec)} ({timeMult}% of base 1 min/question)
          </div>
          <input type="range" min={70} max={130} step={5} value={timeMult} onChange={e => setTimeMult(parseInt(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
            <span>70% (Faster)</span><span>100% (Normal)</span><span>130% (More time)</span>
          </div>
        </div>

        <button
          onClick={startExam}
          disabled={selectedSubjects.length === 0 || availableCount === 0}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-sm font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Test ({actualQCount} Q · {formatTime(totalTimeSec)})
        </button>

        {history.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-semibold text-foreground mb-3">Recent Tests</div>
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 text-xs">
                <span className="font-mono text-muted-foreground">{h.date.slice(0, 10)}</span>
                <span className="text-foreground">{h.score}/{h.total} correct</span>
                <span className={`font-mono ${h.adjusted >= h.total * 0.7 ? "text-green-400" : h.adjusted >= h.total * 0.5 ? "text-amber-400" : "text-rose-400"}`}>
                  {h.adjusted.toFixed(1)} adj
                </span>
                <span className="ml-auto text-muted-foreground">{Math.round(h.score / h.total * 100)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Exam Screen ─────────────────────────────────────────────
  if (screen === "exam") {
    const currentQ = questions[qIdx];
    const answeredCount = answers.filter(a => a !== null).length;
    return (
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground">Q {qIdx + 1}/{questions.length}</span>
            <span className="text-xs font-mono text-muted-foreground">{answeredCount} answered</span>
          </div>
          <div className={`flex items-center gap-1.5 font-mono text-sm font-bold ${timeLeft < 120 ? "text-rose-400" : "text-foreground"}`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
          <button onClick={confirmSubmit} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-mono">Submit</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">{currentQ?.subject}</span>
              {flagged[qIdx] && <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">Flagged</span>}
            </div>
            <div className="text-foreground font-medium">{currentQ?.stem}</div>
            <div className="flex flex-col gap-2">
              {currentQ?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors ${answers[qIdx] === i ? "bg-primary/20 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                >
                  <span className="font-mono text-xs mr-2">{["A","B","C","D"][i]}.</span>{opt}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button onClick={() => setQIdx(i => Math.max(0, i - 1))} disabled={qIdx === 0} className="px-3 py-1.5 bg-card border border-border text-muted-foreground rounded-lg text-xs disabled:opacity-50 hover:text-foreground">Prev</button>
              <button onClick={() => toggleFlag(qIdx)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${flagged[qIdx] ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
                <Flag className="w-3.5 h-3.5" /> Flag
              </button>
              <button onClick={() => setQIdx(i => Math.min(questions.length - 1, i + 1))} disabled={qIdx === questions.length - 1} className="ml-auto px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs disabled:opacity-50">Next</button>
            </div>
          </div>

          {/* Navigator */}
          <div className="lg:col-span-1">
            <button onClick={() => setNavOpen(o => !o)} className="lg:hidden w-full mb-2 px-3 py-2 bg-card border border-border text-muted-foreground rounded-lg text-xs">
              {navOpen ? "Hide" : "Show"} Navigator
            </button>
            <div className={`${navOpen ? "block" : "hidden lg:block"} bg-card border border-border rounded-xl p-3`}>
              <div className="text-xs font-mono text-muted-foreground mb-2">Navigator</div>
              <div className="grid grid-cols-5 gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQIdx(i)}
                    className={`w-full aspect-square flex items-center justify-center text-[10px] font-mono rounded transition-colors ${i === qIdx ? "bg-primary text-primary-foreground" : flagged[i] ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : answers[i] !== null ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-background text-muted-foreground border border-border"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1 mt-3 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" />Answered</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500" />Flagged</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-border" />Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Results Screen ─────────────────────────────────────────
  if (!result) return null;
  const pct = Math.round(result.score / result.total * 100);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Mock Results</h2>
        <div className="flex gap-2">
          <button onClick={exportResult} className="flex items-center gap-2 px-3 py-2 bg-card border border-border text-muted-foreground rounded-lg text-xs hover:text-foreground">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => { setScreen("setup"); setResult(null); setReviewMode(false); }} className="flex items-center gap-2 px-3 py-2 bg-card border border-border text-muted-foreground rounded-lg text-xs hover:text-foreground">
            <RotateCcw className="w-3.5 h-3.5" /> New Test
          </button>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`bg-card border rounded-xl p-4 text-center ${pct >= 70 ? "border-green-500/40" : pct >= 50 ? "border-amber-500/40" : "border-rose-500/40"}`}>
          <div className={`text-3xl font-bold font-mono ${pct >= 70 ? "text-green-400" : pct >= 50 ? "text-amber-400" : "text-rose-400"}`}>{pct}%</div>
          <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-foreground">{result.score}/{result.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Correct</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-primary">{result.adjusted.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground mt-1">Adjusted Score</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold font-mono text-foreground">{Math.floor(result.timeTaken / 60)}m</div>
          <div className="text-xs text-muted-foreground mt-1">Time Taken</div>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-sm font-semibold text-foreground mb-3">Subject Breakdown</div>
        <div className="flex flex-col gap-2">
          {Object.entries(result.subjectBreakdown).sort(([, a], [, b]) => (b.correct / b.total) - (a.correct / a.total)).map(([s, v]) => {
            const acc = v.total > 0 ? v.correct / v.total : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground truncate">{s}</span>
                    <span className="font-mono text-muted-foreground ml-2">{v.correct}/{v.total}</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${acc >= 0.7 ? "bg-green-500" : acc >= 0.5 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${acc * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review toggle */}
      <button onClick={() => setReviewMode(r => !r)} className="flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border text-muted-foreground rounded-xl text-sm hover:text-foreground transition-colors">
        {reviewMode ? <ChevUp /> : <ChevDown />}
        {reviewMode ? "Hide" : "Review All Questions"}
      </button>

      {reviewMode && (
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const wasCorrect = answers[i] === q.answer;
            return (
              <div key={q.id} className={`bg-card border rounded-xl p-4 ${wasCorrect ? "border-green-500/30" : "border-rose-500/30"}`}>
                <div className="flex items-start gap-2 mb-2">
                  {wasCorrect ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  <div className="text-sm text-foreground font-medium">{i + 1}. {q.stem}</div>
                </div>
                <div className="text-xs text-green-400 mb-1">Correct: {q.options[q.answer]}</div>
                {!wasCorrect && <div className="text-xs text-rose-400 mb-1">Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Skipped"}</div>}
                <div className="text-xs text-muted-foreground italic">{q.explanation}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChevUp() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>; }
function ChevDown() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>; }
