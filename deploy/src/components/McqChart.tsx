import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell,
} from "recharts";
import { SCHEDULE } from "@/data/schedule";

export interface McqScore { attempted: number; correct: number; }

interface Props {
  scores: Record<number, McqScore>;
  activeDayId: number;
  onSelectDay: (day: number) => void;
}

interface TooltipPayload {
  payload?: { day: number; accuracy: number; correct: number; attempted: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <div className="text-muted-foreground mb-1">Day {d.day}</div>
      <div className="text-foreground font-bold">{d.accuracy}% accuracy</div>
      <div className="text-muted-foreground">{d.correct}/{d.attempted} correct</div>
    </div>
  );
}

export function McqChart({ scores, activeDayId, onSelectDay }: Props) {
  const data = SCHEDULE.map(day => {
    const s = scores[day.day];
    const accuracy = s && s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : null;
    return { day: day.day, accuracy, correct: s?.correct ?? 0, attempted: s?.attempted ?? 0 };
  }).filter(d => d.accuracy !== null) as { day: number; accuracy: number; correct: number; attempted: number }[];

  if (data.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-mono text-center py-4">
        Log your first MCQ score above to see your accuracy trend here.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-xs font-mono text-muted-foreground uppercase mb-2">Accuracy trend (all logged days)</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} onClick={(e) => e?.activePayload?.[0] && onSelectDay(e.activePayload[0].payload.day)}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 100]} hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 2" strokeOpacity={0.5} />
          <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 2" strokeOpacity={0.5} />
          <Bar dataKey="accuracy" radius={[3, 3, 0, 0]}>
            {data.map(d => (
              <Cell
                key={d.day}
                fill={
                  d.day === activeDayId ? "hsl(var(--primary))" :
                  d.accuracy >= 80 ? "#22c55e" :
                  d.accuracy >= 60 ? "#f59e0b" : "#ef4444"
                }
                opacity={d.day === activeDayId ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-1 justify-end">
        {[["#22c55e", "≥80%"], ["#f59e0b", "60–79%"], ["#ef4444", "<60%"]].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
