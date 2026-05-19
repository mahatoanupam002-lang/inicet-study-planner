import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Circle, Flag, BarChart3 } from "lucide-react";
import { ALL_NEET_PG_2026_QUESTIONS, NEET_PG_2026_META, NeetPGQuestion } from "@/data/neetPG2026Questions";
import { TestAnalyticsDashboard } from "./TestAnalyticsDashboard";
import { MockTest, TestResponse } from "@/lib/mockAnalytics";

type Phase = "config" | "test" | "results";

interface Config {
  subject: "all" | string;
  count: 10 | 25 | 50 | 100 | 200;
  timed: boolean;
}

function buildMockTest(questions: NeetPGQuestion[], responses: Map<string, string>, elapsedMs: number): MockTest {
  const totalTime = elapsedMs / 1000;
  const perQ = totalTime / Math.max(1, questions.length);

  const testResponses: TestResponse[] = questions.map((q, idx) => {
    const selected = responses.get(q.id);
    return {
      questionId: q.id,
      selectedOption: selected || "",
      correctOption: q.answer,
      isCorrect: selected === q.answer,
      timeSpentSeconds: perQ + (idx % 5 === 0 ? 15 : 0),
      concept: q.subject,
      questionType: "single-answer" as const,
      difficulty: q.difficulty,
    };
  });

  return {
    id: `mock-${Date.now()}`,
    date: new Date().toISOString(),
    totalQuestions: questions.length,
    responses: testResponses,
    totalTimeSeconds: totalTime,
  };
}

function TimerDisplay({ seconds }: { seconds: number }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const isLow = seconds < 300;
  return (
    <span className={`font-mono text-sm font-bold tabular-nums ${isLow ? "text-red-400 animate-pulse" : "text-foreground"}`}>
      {h > 0 && `${h}:`}{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function NeetPGMockTest() {
  const [phase, setPhase] = useState<Phase>("config");
  const [config, setConfig] = useState<Config>({ subject: "all", count: 25, timed: true });
  const [questions, setQuestions] = useState<NeetPGQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Map<string, string>>(new Map());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const startTimeRef = useRef<number>(0);

  const subjects = ["all", ...NEET_PG_2026_META.subjects];

  const startTest = useCallback(() => {
    let pool = config.subject === "all"
      ? ALL_NEET_PG_2026_QUESTIONS
      : ALL_NEET_PG_2026_QUESTIONS.filter(q => q.subject === config.subject);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, config.count);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setResponses(new Map());
    setFlagged(new Set());
    setTimeLeft(config.count * 63); // ~63s per question (NEET PG pace)
    startTimeRef.current = Date.now();
    setPhase("test");
  }, [config]);

  const submitTest = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    setElapsedMs(elapsed);
    const test = buildMockTest(questions, responses, elapsed);
    setMockTest(test);
    setPhase("results");
  }, [questions, responses]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "test" || !config.timed) return;
    if (timeLeft <= 0) { submitTest(); return; }
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(t); submitTest(); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, config.timed, timeLeft, submitTest]);

  const selectOption = (qid: string, opt: string) => {
    setResponses(prev => {
      const next = new Map(prev);
      next.set(qid, opt);
      return next;
    });
  };

  const toggleFlag = (qid: string) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid); else next.add(qid);
      return next;
    });
  };

  if (phase === "config") {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="bg-blue-500/20 p-1.5 rounded-lg">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">NEET PG 2026 Mock Test</p>
            <p className="text-[10px] font-mono text-muted-foreground">200-Q predictive paper · Aug 30 2026</p>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-muted-foreground uppercase">Subject</label>
            <select
              value={config.subject}
              onChange={e => setConfig(c => ({ ...c, subject: e.target.value }))}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
            >
              {subjects.map(s => <option key={s} value={s}>{s === "all" ? "All Subjects (Full Paper)" : s}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-muted-foreground uppercase">Questions</label>
            <div className="flex gap-2 flex-wrap">
              {([10, 25, 50, 100, 200] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setConfig(c => ({ ...c, count: n }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    config.count === n
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {n}Q
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 border border-border rounded-lg">
            <div>
              <p className="text-xs font-mono font-bold text-foreground">Timed Mode</p>
              <p className="text-[10px] font-mono text-muted-foreground">{config.count * 63}s · +4/−1 marking</p>
            </div>
            <button
              onClick={() => setConfig(c => ({ ...c, timed: !c.timed }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${config.timed ? "bg-primary" : "bg-border"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${config.timed ? "left-5" : "left-0.5"}`} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Questions", value: config.count },
              { label: "Max Marks", value: config.count * 4 },
              { label: "Duration", value: `${Math.floor(config.count * 63 / 60)}m` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-background/50 border border-border rounded-lg p-2.5">
                <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
                <p className="text-sm font-mono font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <button
            onClick={startTest}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-mono font-bold hover:opacity-90 transition-opacity"
          >
            Start Test →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "test" && questions.length > 0) {
    const q = questions[currentIdx];
    const answered = responses.get(q.id);
    const isFlagged = flagged.has(q.id);
    const answeredCount = responses.size;

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Test header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-muted-foreground">Q {currentIdx + 1}/{questions.length}</span>
          <div className="flex-1 h-1 bg-background rounded-full overflow-hidden mx-3">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
          {config.timed && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <TimerDisplay seconds={timeLeft} />
            </div>
          )}
          <button onClick={() => toggleFlag(q.id)} className={`p-1 rounded ${isFlagged ? "text-yellow-400" : "text-muted-foreground"}`}>
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Subject badge + question */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                {q.subject}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Difficulty {q.difficulty}/5</span>
            </div>
            <p className="text-sm font-mono text-foreground leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {(["A", "B", "C", "D"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => selectOption(q.id, opt)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-mono transition-colors flex items-start gap-2.5 ${
                  answered === opt
                    ? "bg-primary/15 border-primary text-foreground"
                    : "bg-background/50 border-border text-foreground/80 hover:border-primary/40"
                }`}
              >
                <span className={`shrink-0 font-bold mt-0.5 ${answered === opt ? "text-primary" : "text-muted-foreground"}`}>{opt}.</span>
                <span className="leading-relaxed">{q.options[opt]}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground disabled:opacity-30 hover:border-primary/40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <div className="text-[10px] font-mono text-muted-foreground">
              {answeredCount}/{questions.length} answered · {flagged.size} flagged
            </div>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(i => i + 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/40 text-xs font-mono text-primary hover:bg-primary/10 transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={submitTest}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Submit
              </button>
            )}
          </div>

          {/* Question navigator */}
          <div className="border-t border-border pt-3">
            <p className="text-[10px] font-mono text-muted-foreground mb-2">Jump to question</p>
            <div className="flex flex-wrap gap-1">
              {questions.map((qn, idx) => (
                <button
                  key={qn.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-colors ${
                    idx === currentIdx
                      ? "bg-primary text-primary-foreground"
                      : responses.has(qn.id)
                        ? flagged.has(qn.id)
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                          : "bg-emerald-400/20 text-emerald-400"
                        : "bg-background border border-border text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results" && mockTest) {
    const correct = mockTest.responses.filter(r => r.isCorrect).length;
    const wrong = mockTest.responses.filter(r => !r.isCorrect && r.selectedOption).length;
    const skipped = mockTest.responses.filter(r => !r.selectedOption).length;
    const score = correct * 4 - wrong;
    const maxScore = questions.length * 4;

    return (
      <div className="space-y-4">
        {/* Quick summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-emerald-500/20 p-1.5 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-foreground">Test Complete</p>
              <p className="text-[10px] font-mono text-muted-foreground">NEET PG 2026 Mock · {questions[0]?.subject !== questions[questions.length-1]?.subject ? "Mixed" : questions[0]?.subject}</p>
            </div>
            <button
              onClick={() => setPhase("config")}
              className="ml-auto text-[11px] font-mono text-primary hover:underline"
            >
              New Test
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Score", value: `${score}/${maxScore}`, color: score / maxScore >= 0.75 ? "text-emerald-400" : score / maxScore >= 0.6 ? "text-yellow-400" : "text-red-400" },
              { label: "Correct", value: correct, color: "text-emerald-400" },
              { label: "Wrong", value: wrong, color: "text-red-400" },
              { label: "Skipped", value: skipped, color: "text-muted-foreground" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center bg-background/50 border border-border rounded-lg p-2.5">
                <p className="text-[10px] font-mono text-muted-foreground">{label}</p>
                <p className={`text-base font-mono font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Answer review */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-mono font-bold text-foreground">Answer Review</p>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {questions.map((q, idx) => {
              const resp = responses.get(q.id);
              const isCorrect = resp === q.answer;
              const isSkipped = !resp;
              return (
                <div key={q.id} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">Q{idx + 1}</span>
                    {isSkipped
                      ? <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      : isCorrect
                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        : <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                    <p className="text-[11px] font-mono text-foreground/80 leading-relaxed">{q.question}</p>
                  </div>
                  <div className="ml-6 flex gap-3 flex-wrap">
                    {resp && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        Your: {resp}. {q.options[resp as keyof typeof q.options]}
                      </span>
                    )}
                    {!isCorrect && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Ans: {q.answer}. {q.options[q.answer]}
                      </span>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="ml-6 text-[10px] font-mono text-muted-foreground leading-relaxed">{q.rationale}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Full analytics */}
        <TestAnalyticsDashboard test={mockTest} />
      </div>
    );
  }

  return null;
}
