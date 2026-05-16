import { useState, useMemo } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { QUESTIONS } from "@/data/questions";
import { CalendarCheck, Flame } from "lucide-react";

interface DailyLog {
  [dateKey: string]: { score: number; total: number; completed: boolean };
}

interface PyqAttempts {
  [id: number]: { selected: number; correct: boolean };
}

function hashSeed(s: string): number {
  return s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSubjectAccuracy(pyqAttempts: PyqAttempts): Record<string, { total: number; correct: number }> {
  const map: Record<string, { total: number; correct: number }> = {};
  for (const q of QUESTIONS) {
    const attempt = pyqAttempts[q.id];
    if (!attempt) continue;
    if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0 };
    map[q.subject].total++;
    if (attempt.correct) map[q.subject].correct++;
  }
  return map;
}

function selectDailyQuestions(seed: number, pyqAttempts: PyqAttempts, count = 10) {
  const acc = getSubjectAccuracy(pyqAttempts);
  const weighted: typeof QUESTIONS = [];
  for (const q of QUESTIONS) {
    const subAcc = acc[q.subject];
    const accuracy = subAcc && subAcc.total > 0 ? subAcc.correct / subAcc.total : 0.5;
    weighted.push(q);
    if (accuracy < 0.6) weighted.push(q); // 2x weight for weak subjects
  }
  const shuffled = seededShuffle(weighted, seed);
  const seen = new Set<number>();
  const selected = [];
  for (const q of shuffled) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      selected.push(q);
    }
    if (selected.length >= count) break;
  }
  return selected;
}

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

export function DailyQuiz() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const seed = hashSeed(new Date().toDateString());

  const [log, setLog] = useState<DailyLog>(() => safeLoad("neetpg_daily_quiz_log", {}));
  const [pyqAttempts] = useState<PyqAttempts>(() => safeLoad("neetpg_pyq_attempts", {}));

  const dailyQuestions = useMemo(() => selectDailyQuestions(seed, pyqAttempts, 10), [seed, pyqAttempts]);

  const todayEntry = log[todayKey];
  const streak = computeStreak(log);

  const acc = useMemo(() => getSubjectAccuracy(pyqAttempts), [pyqAttempts]);
  const weakSubjects = useMemo(() => {
    return Object.entries(acc)
      .filter(([, v]) => v.total >= 3)
      .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
      .slice(0, 3)
      .map(([s]) => s);
  }, [acc]);

  const [started, setStarted] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const questions = dailyQuestions;
  const currentQ = questions[qIdx];

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
    } else {
      // End
      const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
      setScore(correct);
      setFinished(true);
      if (!practiceMode && !todayEntry?.completed) {
        const updated = { ...log, [todayKey]: { score: correct, total: questions.length, completed: true } };
        setLog(updated);
        safeSave("neetpg_daily_quiz_log", updated);
      }
    }
  };

  const subjectBreakdown = useMemo(() => {
    if (!finished) return {};
    const map: Record<string, { total: number; correct: number }> = {};
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0 };
      map[q.subject].total++;
      if (answers[i] === q.answer) map[q.subject].correct++;
    }
    return map;
  }, [finished, questions, answers]);

  const startQuiz = (practice = false) => {
    setPracticeMode(practice);
    setStarted(true);
    setFinished(false);
    setQIdx(0);
    setSelected(null);
    setAnswers(Array(10).fill(null));
    setShowExplanation(false);
    setScore(0);
  };

  // Summary screen (completed today)
  if (!started && todayEntry?.completed) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <CalendarCheck className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Daily Quiz</h2>
            <p className="text-sm text-muted-foreground font-mono">{todayKey}</p>
          </div>
          {streak > 0 && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-mono text-orange-400 font-bold">{streak} day streak</span>
            </div>
          )}
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold font-mono text-green-400 mb-1">{todayEntry.score}/{todayEntry.total}</div>
          <div className="text-sm text-muted-foreground">Today's quiz completed!</div>
          <div className="text-xs font-mono text-green-400 mt-1">{Math.round(todayEntry.score / todayEntry.total * 100)}% accuracy</div>
        </div>
        <button onClick={() => startQuiz(true)} className="px-4 py-3 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground transition-colors">
          Practice Again (new random set — doesn't count toward daily)
        </button>
      </div>
    );
  }

  // Landing screen
  if (!started) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <CalendarCheck className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Daily Quiz</h2>
            <p className="text-sm text-muted-foreground font-mono">{todayKey}</p>
          </div>
          {streak > 0 && (
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-mono text-orange-400 font-bold">{streak} day streak</span>
            </div>
          )}
        </div>

        {weakSubjects.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="text-xs font-mono text-amber-400 mb-2">Today's Focus (Weak Areas)</div>
            <div className="flex flex-wrap gap-2">
              {weakSubjects.map(s => (
                <span key={s} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-mono">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">10</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{Object.keys(log).filter(k => log[k].completed).length}</div>
              <div className="text-xs text-muted-foreground">Days Done</div>
            </div>
          </div>
          <button onClick={() => startQuiz(false)} className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-mono font-bold">
            Start Today's Quiz
          </button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground">{practiceMode ? "Practice Complete" : "Daily Quiz — Done!"}</h2>
        <div className={`rounded-xl p-6 text-center border ${score >= 7 ? "bg-green-500/10 border-green-500/30" : score >= 5 ? "bg-amber-500/10 border-amber-500/30" : "bg-rose-500/10 border-rose-500/30"}`}>
          <div className={`text-4xl font-bold font-mono mb-2 ${score >= 7 ? "text-green-400" : score >= 5 ? "text-amber-400" : "text-rose-400"}`}>{score}/10</div>
          <div className="text-sm text-muted-foreground">{Math.round(score / 10 * 100)}% accuracy</div>
        </div>

        {/* Subject breakdown */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-semibold text-foreground mb-3">Subject Breakdown</div>
          <div className="flex flex-col gap-2">
            {Object.entries(subjectBreakdown).map(([s, v]) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex-1 text-xs text-muted-foreground truncate">{s}</div>
                <div className="w-24 bg-background rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${v.correct / v.total >= 0.7 ? "bg-green-500" : v.correct / v.total >= 0.5 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${(v.correct / v.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-10 text-right">{v.correct}/{v.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review questions */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <div className="text-sm font-semibold text-foreground">Review Questions</div>
          {questions.map((q, i) => {
            const wasCorrect = answers[i] === q.answer;
            return (
              <div key={q.id} className={`rounded-lg p-3 border text-xs ${wasCorrect ? "border-green-500/30 bg-green-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
                <div className="font-medium text-foreground mb-1">{i + 1}. {q.stem}</div>
                <div className="text-green-400 mb-1">Correct: {q.options[q.answer]}</div>
                {!wasCorrect && <div className="text-rose-400 mb-1">Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Not answered"}</div>}
                <div className="text-muted-foreground italic">{q.explanation}</div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setStarted(false)} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">Back</button>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {practiceMode && <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded">Practice mode — not counted toward daily</div>}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Daily Quiz</h2>
        <span className="text-xs font-mono text-muted-foreground">Q {qIdx + 1} of {questions.length}</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-card border border-border rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((qIdx) / questions.length) * 100}%` }} />
      </div>

      {currentQ && (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded">{currentQ.subject}</span>
          </div>
          <div className="text-foreground font-medium">{currentQ.stem}</div>
          <div className="flex flex-col gap-2">
            {currentQ.options.map((opt, i) => {
              let cls = "bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground";
              if (selected !== null) {
                if (i === currentQ.answer) cls = "bg-green-500/20 border-green-500/50 text-green-400";
                else if (i === selected) cls = "bg-rose-500/20 border-rose-500/50 text-rose-400";
                else cls = "bg-background border border-border/50 text-muted-foreground/50";
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
