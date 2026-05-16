import { useState, useMemo } from "react";
import { TrendingUp, AlertCircle, Info } from "lucide-react";

interface MockEntry {
  score: number;
  total: number;
}

// NEET PG rank estimation based on historical data patterns.
// Roughly: score% → estimated AIR (from cutoff analysis 2020-2025).
// These brackets are derived from publicly available NEET PG result trends.
function estimateRank(pct: number): { airMin: number; airMax: number; category: string; color: string; advice: string } {
  if (pct >= 90)  return { airMin: 1,     airMax: 500,   category: "Top 500 — Government MDH/MS/MD seats", color: "#22c55e", advice: "Outstanding. Secure top government specialty. Maintain with mock analysis." };
  if (pct >= 85)  return { airMin: 500,   airMax: 2000,  category: "Top 2000 — Good government PG seats", color: "#4ade80", advice: "Excellent. Focus on weakest 2 subjects to push into top 500." };
  if (pct >= 80)  return { airMin: 2000,  airMax: 5000,  category: "Top 5000 — Decent government PG seats", color: "#86efac", advice: "Very good. Targeted revision on India-specific content and image MCQs." };
  if (pct >= 75)  return { airMin: 5000,  airMax: 10000, category: "Top 10,000 — Government DNB / private seats", color: "#a3e635", advice: "Solid. India-specific programmes and PSM stats are rank differentiators at this level." };
  if (pct >= 70)  return { airMin: 10000, airMax: 20000, category: "Private PG / DNB range", color: "#facc15", advice: "Improve weakest 2 subjects. Pharmacology DOC table and PSM one-liners add marks fast." };
  if (pct >= 60)  return { airMin: 20000, airMax: 40000, category: "Borderline — intensive revision needed", color: "#fb923c", advice: "Focus sprint on high-yield topics. Cover basics of all subjects before deep dives." };
  return           { airMin: 40000, airMax: 100000, category: "Below competitive range — restructure prep", color: "#ef4444", advice: "Drop depth, go broad. Cover all subjects at basic level first. Use adaptive plan." };
}

function negativeMarkingScore(raw: number, wrong: number): number {
  return raw - wrong * 0.25;
}

const PERCENTILE_BENCHMARKS = [
  { pct: "90%+", air: "~AIR 1–500",     label: "Govt top specialty" },
  { pct: "85%",  air: "~AIR 500–2000",  label: "Govt PG seats" },
  { pct: "80%",  air: "~AIR 2000–5000", label: "Decent govt PG" },
  { pct: "75%",  air: "~AIR 5000–10K",  label: "DNB / private" },
  { pct: "70%",  air: "~AIR 10K–20K",   label: "Private PG" },
  { pct: "60%",  air: "~AIR 20K–40K",   label: "Borderline" },
];

export function RankPredictor() {
  const [mocks, setMocks] = useState<MockEntry[]>([
    { score: 0, total: 200 },
    { score: 0, total: 200 },
    { score: 0, total: 200 },
  ]);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([0, 0, 0]);
  const [showInfo, setShowInfo] = useState(false);

  const filledMocks = mocks.filter((m, i) => m.score > 0 || wrongAnswers[i] > 0);

  const avgPct = useMemo(() => {
    if (filledMocks.length === 0) return null;
    const scores = mocks
      .map((m, i) => {
        if (m.score === 0 && wrongAnswers[i] === 0) return null;
        const adjusted = negativeMarkingScore(m.score, wrongAnswers[i]);
        return (adjusted / m.total) * 100;
      })
      .filter(Boolean) as number[];
    if (scores.length === 0) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [mocks, wrongAnswers]);

  const prediction = avgPct !== null ? estimateRank(avgPct) : null;

  const updateScore = (i: number, val: string) => {
    const num = Math.max(0, Math.min(200, parseInt(val) || 0));
    setMocks(prev => prev.map((m, idx) => idx === i ? { ...m, score: num } : m));
  };

  const updateWrong = (i: number, val: string) => {
    const num = Math.max(0, Math.min(200, parseInt(val) || 0));
    setWrongAnswers(prev => prev.map((w, idx) => idx === i ? num : w));
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-500/20 p-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">Rank Predictor</p>
            <p className="text-[10px] font-mono text-muted-foreground">Enter mock scores → get estimated AIR</p>
          </div>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="text-muted-foreground hover:text-foreground transition-colors">
          <Info className="w-4 h-4" />
        </button>
      </div>

      {showInfo && (
        <div className="mx-5 mt-4 bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
          <div className="flex gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-foreground/70 leading-relaxed">
              Estimates are based on historical NEET PG cutoff trends (2020–2025). Actual rank depends on exam difficulty, number of candidates, and paper pattern. Use this as a directional guide, not a guarantee. Negative marking: -0.25 per wrong answer.
            </p>
          </div>
        </div>
      )}

      <div className="p-5 space-y-5">
        {/* Mock score inputs */}
        <div className="space-y-3">
          {mocks.map((m, i) => {
            const adjusted = negativeMarkingScore(m.score, wrongAnswers[i]);
            const pct = m.score > 0 || wrongAnswers[i] > 0 ? (adjusted / m.total) * 100 : null;
            return (
              <div key={i} className="grid grid-cols-12 items-center gap-3">
                <span className="col-span-2 text-[11px] font-mono text-muted-foreground">Mock {i + 1}</span>
                <div className="col-span-3 flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={m.score || ""}
                    placeholder="Correct"
                    onChange={e => updateScore(i, e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary text-center"
                  />
                </div>
                <span className="col-span-1 text-[10px] font-mono text-muted-foreground text-center">Wrong</span>
                <div className="col-span-3 flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={wrongAnswers[i] || ""}
                    placeholder="Wrong"
                    onChange={e => updateWrong(i, e.target.value)}
                    className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary text-center"
                  />
                </div>
                <div className="col-span-3 text-right">
                  {pct !== null ? (
                    <span className={`text-xs font-mono font-bold ${pct >= 75 ? "text-emerald-400" : pct >= 65 ? "text-yellow-400" : "text-destructive"}`}>
                      {pct.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground/40">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prediction result */}
        {prediction && avgPct !== null && (
          <div
            className="rounded-xl p-4 border space-y-3"
            style={{ borderColor: prediction.color + "40", backgroundColor: prediction.color + "10" }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-0.5">Avg Adjusted Score</p>
                <p className="text-2xl font-mono font-bold" style={{ color: prediction.color }}>
                  {avgPct.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-muted-foreground uppercase mb-0.5">Estimated AIR</p>
                <p className="text-xl font-mono font-bold text-foreground">
                  {prediction.airMin.toLocaleString()}–{prediction.airMax.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden bg-background"
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, avgPct)}%`, backgroundColor: prediction.color }}
              />
            </div>
            <p className="text-[11px] font-mono font-medium" style={{ color: prediction.color }}>
              {prediction.category}
            </p>
            <p className="text-[11px] font-mono text-foreground/70 leading-relaxed bg-background/50 rounded-lg p-2.5">
              {prediction.advice}
            </p>
          </div>
        )}

        {/* Benchmark table */}
        <div>
          <p className="text-[10px] font-mono uppercase text-muted-foreground mb-3">Historical Cutoff Benchmarks</p>
          <div className="space-y-1">
            {PERCENTILE_BENCHMARKS.map(b => (
              <div
                key={b.pct}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-mono transition-colors ${
                  avgPct !== null && parseFloat(b.pct) <= avgPct
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-background/50"
                }`}
              >
                <span className="w-10 text-primary font-bold">{b.pct}</span>
                <span className="w-28 text-muted-foreground">{b.air}</span>
                <span className="text-foreground/70">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
