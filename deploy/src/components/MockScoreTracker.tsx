import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import { Trophy, TrendingUp, Save } from "lucide-react";
import { SCHEDULE } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";

export interface MockScore { raw: number; total: number; }
type MockScores = Record<number, MockScore>; // keyed by day number (25,26,27)

const MOCK_DAYS = SCHEDULE.filter(d => d.phase === 'mock' && d.subject.startsWith('Full Mock'));

interface TooltipPayload {
  payload?: { label: string; pct: number; raw: number; total: number };
}
function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <div className="text-muted-foreground mb-1">{d.label}</div>
      <div className="text-foreground font-bold">{d.pct}%</div>
      <div className="text-muted-foreground">{d.raw}/{d.total} correct</div>
    </div>
  );
}

export function MockScoreTracker() {
  const [scores, setScores] = useState<MockScores>(() => safeLoad('inicet_mock_scores', {}));
  const [inputs, setInputs] = useState<Record<number, { raw: string; total: string }>>({});

  useEffect(() => { safeSave('inicet_mock_scores', scores); }, [scores]);

  // init inputs from saved scores
  useEffect(() => {
    setInputs(
      MOCK_DAYS.reduce((acc, d) => {
        const s = scores[d.day];
        return { ...acc, [d.day]: { raw: s?.raw.toString() ?? '', total: s?.total.toString() ?? '200' } };
      }, {})
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = (dayId: number) => {
    const inp = inputs[dayId];
    const raw = parseInt(inp?.raw ?? ''), total = parseInt(inp?.total ?? '200');
    if (!isNaN(raw) && !isNaN(total) && total > 0 && raw >= 0 && raw <= total) {
      setScores(prev => ({ ...prev, [dayId]: { raw, total } }));
    }
  };

  const chartData = MOCK_DAYS.map(d => {
    const s = scores[d.day];
    const pct = s ? Math.round((s.raw / s.total) * 100) : null;
    return { label: d.subject, pct, raw: s?.raw ?? 0, total: s?.total ?? 200 };
  }).filter(d => d.pct !== null) as { label: string; pct: number; raw: number; total: number }[];

  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].pct - chartData[0].pct
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="text-sm font-mono uppercase text-muted-foreground">Mock Test Scores</h2>
        {trend !== null && (
          <span className={`ml-auto text-xs font-mono flex items-center gap-1 ${trend >= 0 ? 'text-emerald-400' : 'text-destructive'}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {trend >= 0 ? '+' : ''}{trend}% vs Mock 1
          </span>
        )}
      </div>

      {/* Input cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_DAYS.map(day => {
          const s = scores[day.day];
          const inp = inputs[day.day] ?? { raw: '', total: '200' };
          const pct = s ? Math.round((s.raw / s.total) * 100) : null;
          const color = pct === null ? 'text-muted-foreground' : pct >= 70 ? 'text-emerald-400' : pct >= 55 ? 'text-yellow-400' : 'text-destructive';
          return (
            <div key={day.day} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase">{day.subject}</span>
                {pct !== null && <span className={`text-lg font-mono font-bold ${color}`}>{pct}%</span>}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-muted-foreground block mb-1">Correct</label>
                  <input
                    type="number" min="0" max="300"
                    value={inp.raw}
                    onChange={e => setInputs(prev => ({ ...prev, [day.day]: { ...inp, raw: e.target.value } }))}
                    placeholder="e.g. 148"
                    className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-muted-foreground block mb-1">Total Qs</label>
                  <input
                    type="number" min="1" max="300"
                    value={inp.total}
                    onChange={e => setInputs(prev => ({ ...prev, [day.day]: { ...inp, total: e.target.value } }))}
                    placeholder="200"
                    className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={() => handleSave(day.day)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-mono rounded-md hover:opacity-90 transition-opacity"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-mono text-muted-foreground uppercase mb-4">Performance trend</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.6} label={{ value: "70%", position: "right", fontSize: 9, fill: "#22c55e" }} />
              <Line
                type="monotone" dataKey="pct" stroke="hsl(var(--primary))"
                strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
