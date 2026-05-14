import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, Calendar, Flame, Trophy, Target, Clock } from "lucide-react";
import { SCHEDULE } from "@/data/schedule";

export interface McqScore {
  attempted: number;
  correct: number;
}

interface Props {
  mcqScores: Record<number, McqScore>;
  completedDays: number[];
  streak: { count: number; longest: number; lastDate: string };
  examDate: Date;
}

// ─── Stat Chip ────────────────────────────────────────────────────────────────

interface StatChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

function StatChip({ icon, label, value, sub }: StatChipProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1 font-mono">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

// ─── Accuracy Trend Tooltip ───────────────────────────────────────────────────

interface TrendDatum {
  day: number;
  subject: string;
  accuracy: number;
  attempted: number;
  correct: number;
}

function AccuracyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TrendDatum }[];
}) {
  if (!active || !payload?.[0]?.payload) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <div className="font-bold text-foreground mb-0.5">
        Day {d.day} — {d.subject}
      </div>
      <div className="text-primary">Accuracy: {d.accuracy}%</div>
      <div className="text-muted-foreground">Attempted: {d.attempted}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AnalyticsPanel({ mcqScores, completedDays, streak, examDate }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDay = new Date(examDate);
  examDay.setHours(0, 0, 0, 0);
  const daysToExam = Math.max(0, Math.ceil((examDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // ── Section 1: stat values ──────────────────────────────────────────────────

  const mcqSessionsLogged = useMemo(
    () => Object.values(mcqScores).filter((s) => s.attempted > 0).length,
    [mcqScores]
  );

  // ── Section 2: MCQ accuracy trend data ─────────────────────────────────────

  const trendData = useMemo<TrendDatum[]>(() => {
    return SCHEDULE.filter((day) => {
      const score = mcqScores[day.day];
      return completedDays.includes(day.day) && score && score.attempted > 0;
    }).map((day) => {
      const score = mcqScores[day.day];
      const accuracy = Math.round((score.correct / score.attempted) * 100);
      return {
        day: day.day,
        subject: day.subject,
        accuracy,
        attempted: score.attempted,
        correct: score.correct,
      };
    });
  }, [mcqScores, completedDays]);

  // ── Section 3: subject performance ─────────────────────────────────────────

  interface SubjectStat {
    subject: string;
    attempted: number;
    correct: number;
    accuracy: number;
  }

  const subjectStats = useMemo<SubjectStat[]>(() => {
    const map: Record<string, { attempted: number; correct: number }> = {};
    SCHEDULE.forEach((day) => {
      const score = mcqScores[day.day];
      if (!score || score.attempted === 0) return;
      if (!map[day.subject]) map[day.subject] = { attempted: 0, correct: 0 };
      map[day.subject].attempted += score.attempted;
      map[day.subject].correct += score.correct;
    });
    return Object.entries(map)
      .filter(([, s]) => s.attempted > 0)
      .map(([subject, s]) => ({
        subject,
        attempted: s.attempted,
        correct: s.correct,
        accuracy: Math.round((s.correct / s.attempted) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [mcqScores]);

  // ── Section 4: heatmap data ─────────────────────────────────────────────────

  interface HeatmapCell {
    dateStr: string;
    completed: boolean;
    hasScore: boolean;
    dayNum: number | null;
    label: string;
  }

  const heatmapCells = useMemo<HeatmapCell[]>(() => {
    const cells: HeatmapCell[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      // Find if any SCHEDULE day matches this calendar date
      // We approximate: schedule day = (total - daysToExam + (28 - i)) but we
      // don't have calendar↔day mapping, so we just track by index offset.
      // Heatmap shows "last 28 calendar days"; completed days are by schedule
      // day number, not calendar date. We map index 27 = today, 0 = 27 days ago.
      // Schedule day 1..28 may or may not correspond — we show completedDays
      // and score presence based on schedule day position matching cell index.
      const scheduleDay = SCHEDULE[27 - i]; // rough 1:1 mapping
      const dayNum = scheduleDay ? scheduleDay.day : null;
      const completed = dayNum !== null && completedDays.includes(dayNum);
      const score = dayNum !== null ? mcqScores[dayNum] : undefined;
      const hasScore = !!score && score.attempted > 0;

      cells.push({
        dateStr,
        completed,
        hasScore,
        dayNum,
        label: dayNum !== null ? `Day ${dayNum} — ${d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}` : dateStr,
      });
    }
    return cells;
  }, [completedDays, mcqScores, today]);

  // ── Section 5: pace indicator ───────────────────────────────────────────────

  const expectedCompleted = Math.min(28, Math.max(0, 28 - daysToExam));
  const actualCompleted = completedDays.length;
  const diff = actualCompleted - expectedCompleted;

  let paceLabel: string;
  let paceColor: string;

  if (diff >= 1) {
    paceLabel = "Ahead of schedule";
    paceColor = "text-green-400";
  } else if (diff >= -1) {
    paceLabel = "On pace";
    paceColor = "text-yellow-400";
  } else {
    const catchUp = Math.abs(diff);
    paceLabel = `Behind — ${catchUp} day${catchUp > 1 ? "s" : ""} to catch up`;
    paceColor = "text-red-400";
  }

  const remainingDays = Math.max(0, 28 - actualCompleted);
  const paceDetail =
    daysToExam > 0 && remainingDays > 0
      ? `${remainingDays} more day${remainingDays > 1 ? "s" : ""} to complete in ${daysToExam} remaining`
      : remainingDays === 0
      ? "Plan complete — all 28 days done!"
      : "Exam is here — good luck!";

  const progressPct = Math.round((actualCompleted / 28) * 100);

  // ── Accuracy bar color helper ───────────────────────────────────────────────

  function accuracyColor(acc: number): string {
    if (acc >= 75) return "bg-green-500";
    if (acc >= 60) return "bg-orange-400";
    return "bg-red-500";
  }

  function accuracyTextColor(acc: number): string {
    if (acc >= 75) return "text-green-400";
    if (acc >= 60) return "text-orange-400";
    return "text-red-400";
  }

  return (
    <div className="flex flex-col gap-6 font-mono">

      {/* ── Section 1: Stat Chips ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatChip
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Days Completed"
          value={`${actualCompleted}/28`}
          sub={`${progressPct}% of plan`}
        />
        <StatChip
          icon={<Activity className="w-3.5 h-3.5" />}
          label="MCQ Sessions"
          value={String(mcqSessionsLogged)}
          sub="days with scores logged"
        />
        <StatChip
          icon={<Flame className="w-3.5 h-3.5" />}
          label="Current Streak"
          value={`${streak.count}d`}
          sub="consecutive days"
        />
        <StatChip
          icon={<Trophy className="w-3.5 h-3.5" />}
          label="Best Streak"
          value={`${streak.longest}d`}
          sub="personal best"
        />
      </div>

      {/* ── Section 2: MCQ Accuracy Trend ─────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase text-muted-foreground font-mono">MCQ Accuracy Trend</h3>
        </div>

        {trendData.length < 2 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Log MCQ scores on completed days to see your accuracy trend.
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) => `D${v}`}
                  tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                  width={38}
                />
                <Tooltip content={<AccuracyTooltip />} />
                <ReferenceLine
                  y={65}
                  stroke="#f97316"
                  strokeDasharray="4 2"
                  label={{
                    value: "min target",
                    position: "insideTopRight",
                    fontSize: 9,
                    fontFamily: "monospace",
                    fill: "#f97316",
                  }}
                />
                <ReferenceLine
                  y={75}
                  stroke="#22c55e"
                  strokeDasharray="4 2"
                  label={{
                    value: "competitive",
                    position: "insideTopRight",
                    fontSize: 9,
                    fontFamily: "monospace",
                    fill: "#22c55e",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-end">
              {([
                ["#f97316", "65% min target"],
                ["#22c55e", "75% competitive"],
              ] as [string, string][]).map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span
                    className="inline-block w-5 h-px"
                    style={{ borderTop: `2px dashed ${color}` }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Section 3: Subject Performance ────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase text-muted-foreground font-mono">Subject Performance</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">(weakest first)</span>
        </div>

        {subjectStats.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Complete study days and log MCQ scores to see subject breakdown.
          </p>
        ) : (
          <div className="space-y-3">
            {subjectStats.map((s) => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground w-28 truncate flex-shrink-0">
                  {s.subject}
                </span>
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${accuracyColor(s.accuracy)}`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <span className={`text-[11px] font-bold w-10 text-right flex-shrink-0 ${accuracyTextColor(s.accuracy)}`}>
                  {s.accuracy}%
                </span>
                <span className="text-[10px] text-muted-foreground w-14 text-right flex-shrink-0">
                  {s.correct}/{s.attempted}
                </span>
              </div>
            ))}
            <div className="flex gap-4 mt-1 pt-2 border-t border-border/40">
              {([
                ["bg-red-500", "< 60%"],
                ["bg-orange-400", "60–74%"],
                ["bg-green-500", "≥ 75%"],
              ] as [string, string][]).map(([cls, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className={`w-2 h-2 rounded-sm inline-block ${cls}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Study Heatmap ───────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase text-muted-foreground font-mono">Study Heatmap — Last 28 Days</h3>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {heatmapCells.map((cell, i) => {
            let cellClass: string;
            let title: string;
            if (cell.completed && cell.hasScore) {
              cellClass = "bg-primary";
              title = `${cell.label} — completed + score logged`;
            } else if (cell.completed) {
              cellClass = "bg-primary/40";
              title = `${cell.label} — completed, no score`;
            } else {
              cellClass = "bg-muted";
              title = `${cell.label} — not completed`;
            }
            return (
              <div
                key={i}
                title={title}
                className={`aspect-square rounded-sm ${cellClass} transition-all duration-200 cursor-default`}
              />
            );
          })}
        </div>

        <div className="flex gap-4 mt-3">
          {([
            ["bg-primary", "Completed + score"],
            ["bg-primary/40", "Completed"],
            ["bg-muted", "Not done"],
          ] as [string, string][]).map(([cls, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className={`w-2.5 h-2.5 rounded-sm inline-block ${cls} border border-border/30`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Days to Exam ────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs uppercase text-muted-foreground font-mono">Days to Exam</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Countdown */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="text-6xl font-bold text-foreground leading-none tabular-nums">
              {daysToExam}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">
              {daysToExam === 1 ? "day left" : "days left"}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {examDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Right column: progress + pace */}
          <div className="flex-1 w-full flex flex-col gap-3">
            {/* Plan progress bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-muted-foreground">Plan Progress</span>
                <span className="text-[11px] text-foreground font-bold">{actualCompleted}/28 days</span>
              </div>
              <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Pace indicator */}
            <div className="flex flex-col gap-0.5">
              <div className={`text-sm font-bold ${paceColor}`}>
                <Target className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                {paceLabel}
              </div>
              <div className="text-xs text-muted-foreground">{paceDetail}</div>
            </div>

            {/* Expected vs actual mini table */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-background border border-border rounded-lg px-3 py-2">
                <div className="text-muted-foreground mb-0.5">Expected</div>
                <div className="font-bold text-foreground">{expectedCompleted} days</div>
              </div>
              <div className="bg-background border border-border rounded-lg px-3 py-2">
                <div className="text-muted-foreground mb-0.5">Actual</div>
                <div className={`font-bold ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {actualCompleted} days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
