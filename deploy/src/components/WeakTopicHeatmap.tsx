import { useMemo } from "react";
import { safeLoad } from "@/lib/storage";
import { QUESTIONS } from "@/data/questions";
import { LayoutGrid, AlertTriangle } from "lucide-react";

interface PyqAttempts {
  [id: number]: { selected: number; correct: boolean };
}

interface WeakTopicHeatmapProps {
  onGoToSubject?: (subject: string) => void;
}

const SUBJECT_COLORS = {
  red:   { bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400", bar: "bg-rose-500" },
  amber: { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400", bar: "bg-amber-500" },
  green: { bg: "bg-green-500/20", border: "border-green-500/40", text: "text-green-400", bar: "bg-green-500" },
};

function getColor(acc: number) {
  if (acc < 0.5) return SUBJECT_COLORS.red;
  if (acc < 0.7) return SUBJECT_COLORS.amber;
  return SUBJECT_COLORS.green;
}

export function WeakTopicHeatmap({ onGoToSubject }: WeakTopicHeatmapProps) {
  const pyqAttempts = useMemo(() => safeLoad<PyqAttempts>("neetpg_pyq_attempts", {}), []);

  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {};
    for (const q of QUESTIONS) {
      const attempt = pyqAttempts[q.id];
      if (!attempt) continue;
      if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0 };
      map[q.subject].total++;
      if (attempt.correct) map[q.subject].correct++;
    }
    return Object.entries(map)
      .map(([subject, stats]) => ({
        subject,
        total: stats.total,
        correct: stats.correct,
        accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [pyqAttempts]);

  const overall = useMemo(() => {
    const total = subjectStats.reduce((s, v) => s + v.total, 0);
    const correct = subjectStats.reduce((s, v) => s + v.correct, 0);
    return { total, correct, accuracy: total > 0 ? correct / total : 0 };
  }, [subjectStats]);

  const maxAttempted = useMemo(() => Math.max(...subjectStats.map(s => s.total), 1), [subjectStats]);

  if (subjectStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <LayoutGrid className="w-12 h-12 text-muted-foreground" />
        <div className="text-lg font-bold text-foreground">No Data Yet</div>
        <p className="text-sm text-muted-foreground text-center max-w-sm">Complete some PYQ questions to see your weak areas. Your performance will be visualised here.</p>
      </div>
    );
  }

  const weakest = subjectStats.slice(0, 3);
  const best = subjectStats[subjectStats.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <LayoutGrid className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-bold text-foreground">Weak Topic Heatmap</h2>
          <p className="text-sm text-muted-foreground font-mono">Based on your PYQ performance</p>
        </div>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-foreground">{overall.total}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Attempted</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className={`text-2xl font-bold font-mono ${overall.accuracy >= 0.7 ? "text-green-400" : overall.accuracy >= 0.5 ? "text-amber-400" : "text-rose-400"}`}>
            {Math.round(overall.accuracy * 100)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Overall Accuracy</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-green-400 truncate">{best?.subject ?? "—"}</div>
          <div className="text-xs text-muted-foreground mt-1">Best Subject</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-sm font-bold text-rose-400 truncate">{weakest[0]?.subject ?? "—"}</div>
          <div className="text-xs text-muted-foreground mt-1">Needs Work</div>
        </div>
      </div>

      {/* Subject grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Subject Performance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {subjectStats.map(s => {
            const color = getColor(s.accuracy);
            const relSize = s.total / maxAttempted;
            return (
              <button
                key={s.subject}
                onClick={() => onGoToSubject?.(s.subject)}
                className={`${color.bg} border ${color.border} rounded-xl p-4 flex flex-col gap-2 text-left hover:opacity-90 transition-opacity`}
                style={{ opacity: 0.5 + relSize * 0.5 }}
              >
                <div className="text-xs font-medium text-foreground truncate">{s.subject}</div>
                <div className={`text-xl font-bold font-mono ${color.text}`}>{Math.round(s.accuracy * 100)}%</div>
                <div className="text-[10px] font-mono text-muted-foreground">{s.correct}/{s.total} correct</div>
                <div className="w-full bg-background/50 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${color.bar}`} style={{ width: `${s.accuracy * 100}%` }} />
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-mono text-muted-foreground mt-2">Click a subject to go to PYQ filtered by that subject</p>
      </div>

      {/* Weakest subjects panel */}
      {weakest.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-rose-400">Focus Areas</span>
          </div>
          <div className="flex flex-col gap-3">
            {weakest.map(s => (
              <div key={s.subject} className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{s.subject}</span>
                  <span className="text-rose-400 text-xs font-mono">{Math.round(s.accuracy * 100)}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.total} questions attempted, {s.total - s.correct} wrong. Aim for 70%+ accuracy.
                </div>
                <button onClick={() => onGoToSubject?.(s.subject)} className="mt-2 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors">
                  Practice {s.subject} MCQs →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span>Accuracy:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500 inline-block" /> &lt;50% weak</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> 50-70% ok</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> &gt;70% good</span>
      </div>
    </div>
  );
}
