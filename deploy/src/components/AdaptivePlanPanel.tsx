import { useMemo } from "react";
import { Zap, AlertTriangle, CheckCircle, TrendingUp, SkipForward, RefreshCw } from "lucide-react";
import { computeAdaptivePlan } from "@/lib/adaptive";
import { SCHEDULE } from "@/data/schedule";

interface McqScore { attempted: number; correct: number; }

interface Props {
  mcqScores: Record<number, McqScore>;
  completedDays: number[];
  onSelectDay: (day: number) => void;
}

const RISK_CONFIG = {
  high:   { label: "High Risk",   color: "text-red-400",     bg: "bg-red-500/10",    border: "border-red-500/30"    },
  medium: { label: "On Watch",    color: "text-yellow-400",  bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  low:    { label: "On Track",    color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/30"},
};

const STATUS_BAR_COLOR: Record<string, string> = {
  weak:       "#ef4444",
  borderline: "#f97316",
  strong:     "#22c55e",
  untouched:  "#6b7280",
};

const STATUS_LABEL: Record<string, string> = {
  weak:       "Weak",
  borderline: "Watch",
  strong:     "Strong",
  untouched:  "Untested",
};

const URGENCY_COLOR: Record<string, string> = {
  high:   "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low:    "text-muted-foreground bg-muted/30 border-border",
};

export function AdaptivePlanPanel({ mcqScores, completedDays, onSelectDay }: Props) {
  const plan = useMemo(
    () => computeAdaptivePlan(mcqScores, completedDays),
    [mcqScores, completedDays]
  );

  const risk = RISK_CONFIG[plan.riskLevel];
  const hasRevisionChanges = plan.revisionRecommendations.some(r => r.urgency !== "low");
  const hasMissed = plan.missedBlitzDays.length > 0;
  const hasUrgent = plan.urgentRemainingDays.length > 0;
  const anyActivity = completedDays.length > 0 || Object.keys(mcqScores).length > 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`px-5 py-4 border-b border-border flex items-center justify-between ${risk.bg}`}>
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">Adaptive War Plan</p>
            <p className="text-[10px] font-mono text-muted-foreground">Auto-adjusts based on your MCQ performance</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${risk.color} ${risk.bg} ${risk.border}`}>
          {risk.label}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary */}
        <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${risk.border} ${risk.bg}`}>
          {plan.riskLevel === "high"
            ? <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${risk.color}`} />
            : plan.riskLevel === "medium"
            ? <TrendingUp className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${risk.color}`} />
            : <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${risk.color}`} />}
          <p className={`text-[11px] font-mono leading-relaxed ${risk.color}`}>{plan.summary}</p>
        </div>

        {/* No data state */}
        {!anyActivity && (
          <p className="text-[11px] font-mono text-muted-foreground text-center py-2">
            Complete study days and log MCQ scores to get your personalized adaptive plan.
          </p>
        )}

        {/* Subject strength bars */}
        {anyActivity && (
          <div>
            <p className="text-[10px] font-mono uppercase text-muted-foreground mb-3">Subject Performance</p>
            <div className="space-y-2">
              {plan.subjectStrengths.map(({ subject, accuracy, status }) => (
                <div key={subject} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground w-28 truncate shrink-0">{subject}</span>
                  <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: accuracy !== null ? `${Math.min(100, accuracy)}%` : "0%",
                        backgroundColor: STATUS_BAR_COLOR[status],
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono w-12 text-right shrink-0" style={{ color: STATUS_BAR_COLOR[status] }}>
                    {accuracy !== null ? `${accuracy.toFixed(0)}%` : "—"}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                    style={{
                      color: STATUS_BAR_COLOR[status],
                      backgroundColor: `${STATUS_BAR_COLOR[status]}15`,
                      borderColor: `${STATUS_BAR_COLOR[status]}40`,
                    }}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revised revision week */}
        {hasRevisionChanges && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-3 h-3 text-primary" />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Revised Revision Days</p>
            </div>
            <div className="space-y-2">
              {plan.revisionRecommendations
                .filter(r => r.urgency !== "low")
                .map(rec => (
                  <div
                    key={rec.dayId}
                    className={`rounded-lg border px-3 py-2.5 space-y-1.5 ${URGENCY_COLOR[rec.urgency]
                      .split(" ")
                      .slice(1)
                      .join(" ")}`}
                    style={{
                      borderColor:
                        rec.urgency === "high" ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${URGENCY_COLOR[rec.urgency]}`}
                      >
                        Day {rec.dayId}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground line-through truncate">
                        {rec.originalFocus}
                      </span>
                      <span className="text-[10px] font-mono text-foreground font-semibold truncate">
                        → {rec.recommendedFocus}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-foreground/60 leading-relaxed">{rec.reason}</p>
                    <button
                      onClick={() => onSelectDay(rec.dayId)}
                      className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                    >
                      Go to Day {rec.dayId} →
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Urgent remaining blitz days */}
        {hasUrgent && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">
                Urgent Remaining Days
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.urgentRemainingDays.map(dayId => {
                const entry = SCHEDULE.find(d => d.day === dayId);
                return (
                  <button
                    key={dayId}
                    onClick={() => onSelectDay(dayId)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <span className="text-[10px] font-mono font-bold text-red-400">Day {dayId}</span>
                    {entry && (
                      <span className="text-[10px] font-mono text-red-400/70 truncate max-w-[120px]">
                        {entry.subject}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Skipped blitz days */}
        {hasMissed && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <SkipForward className="w-3 h-3 text-yellow-400" />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">
                Skipped Days — Recover During Revision
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.missedBlitzDays.map(dayId => {
                const entry = SCHEDULE.find(d => d.day === dayId);
                return (
                  <button
                    key={dayId}
                    onClick={() => onSelectDay(dayId)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                  >
                    <span className="text-[10px] font-mono font-bold text-yellow-400">Day {dayId}</span>
                    {entry && (
                      <span className="text-[10px] font-mono text-yellow-400/70 truncate max-w-[120px]">
                        {entry.focus}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-mono text-muted-foreground mt-2 leading-relaxed">
              Add these topics to your nearest revision day. Prioritise high-yield one-liners only — don't attempt full depth at this stage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
