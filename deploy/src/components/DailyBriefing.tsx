import { useState, useMemo } from "react";
import {
  ChevronDown, ChevronUp, Flame, Calendar, TrendingDown,
  Zap, BookOpen, Target, AlertTriangle, Clock,
} from "lucide-react";
import { QUESTION_SUBJECTS } from "@/data/questions";
import { safeLoad } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface McqScore { attempted: number; correct: number; }

export interface DailyBriefingProps {
  completedDays: number[];
  mcqScores: Record<number, McqScore>;
  streak: { count: number; longest: number; lastDate: string };
  examDate: Date;
  onGoToTab: (tab: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY_ISO = new Date().toISOString().slice(0, 10);

function getDaysToExam(examDate: Date): number {
  return Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function getUrgencyColor(daysLeft: number): string {
  if (daysLeft > 14) return "text-emerald-400";
  if (daysLeft >= 7) return "text-yellow-400";
  return "text-destructive";
}

function getUrgencyBg(daysLeft: number): string {
  if (daysLeft > 14) return "bg-emerald-500/10 border-emerald-500/25";
  if (daysLeft >= 7) return "bg-yellow-500/10 border-yellow-500/25";
  return "bg-destructive/10 border-destructive/25";
}

// Subject → which plan days map to it (mirrors ChatPanel's SUBJECT_DAYS)
const SUBJECT_DAYS: Record<string, number[]> = {
  Medicine:      [1, 2, 3, 4],
  Surgery:       [5, 6],
  Pathology:     [7, 8],
  Pharmacology:  [9, 10],
  OBG:           [11, 12],
  Paediatrics:   [13],
  "PSM/Community Medicine": [14, 15],
  Microbiology:  [16, 17],
  "Forensic Medicine": [18],
  Physiology:    [19],
  Biochemistry:  [20],
  Anatomy:       [21],
  "ENT/Ophthalmology": [22],
};

interface SubjectAccuracy { subject: string; attempted: number; accuracy: number; }

function computeWeakSubjects(
  completedDays: number[],
  mcqScores: Record<number, McqScore>
): SubjectAccuracy[] {
  const results: SubjectAccuracy[] = [];

  for (const [subj, days] of Object.entries(SUBJECT_DAYS)) {
    let attempted = 0, correct = 0;
    days
      .filter(d => completedDays.includes(d))
      .forEach(d => {
        const s = mcqScores[d];
        if (s?.attempted) { attempted += s.attempted; correct += s.correct; }
      });
    if (attempted > 0) {
      results.push({ subject: subj, attempted, accuracy: Math.round((correct / attempted) * 100) });
    }
  }

  // Sort ascending by accuracy — weakest first
  return results.sort((a, b) => a.accuracy - b.accuracy);
}

function getPlanDay(completedDays: number[]): number {
  // The current plan day is the next uncompleted day, min 1, max 28
  for (let d = 1; d <= 28; d++) {
    if (!completedDays.includes(d)) return d;
  }
  return 28;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayMood(): number | null {
  const log = safeLoad<Record<string, number>>("stress_log", {});
  const today = new Date().toISOString().slice(0, 10);
  return log[today] ?? null;
}

interface DayPlan {
  blocks: Array<{ mins: number; label: string; action: string; tab: string }>;
}

function buildDayPlan(
  weakSubjs: SubjectAccuracy[],
  daysLeft: number,
  mood: number | null,
  planDay: number,
): DayPlan {
  const moodFactor = mood === null ? 1 : mood <= 2 ? 0.4 : mood === 3 ? 0.7 : 1;
  const isRevPhase = planDay >= 19;
  const isMockPhase = planDay >= 25;

  const base = moodFactor < 0.5 ? "light" : moodFactor < 0.8 ? "normal" : "full";

  const weakest = weakSubjs[0]?.subject ?? "your weakest subject";
  const second  = weakSubjs[1]?.subject ?? weakest;

  if (isMockPhase) {
    return {
      blocks: [
        { mins: base === "light" ? 30 : 60, label: "Mock Test",       action: "Full 100-Q timed simulation", tab: "simulation" },
        { mins: base === "light" ? 15 : 30, label: "Review wrongs",   action: "Go through mistake logbook",  tab: "mistakelogbook" },
        { mins: base === "light" ? 10 : 20, label: "One-liners",      action: "High-yield rapid revision",   tab: "oneliners" },
      ],
    };
  }

  if (isRevPhase || daysLeft <= 7) {
    return {
      blocks: [
        { mins: base === "light" ? 20 : 45, label: weakest,    action: `Drill 25 ${weakest} MCQs`,   tab: "drills" },
        { mins: base === "light" ? 15 : 30, label: "PYQ Bank",  action: "20 PYQs from weak subjects", tab: "pyq"   },
        { mins: base === "light" ? 10 : 20, label: "One-liners",action: "Quick revision sweep",       tab: "oneliners" },
      ],
    };
  }

  return {
    blocks: [
      { mins: base === "light" ? 15 : 45, label: "Today's chapter",  action: `Day ${planDay} topic blocks`,          tab: "planner"       },
      { mins: base === "light" ? 15 : 30, label: weakest,            action: `25 ${weakest} MCQs (weak area)`,       tab: "drills"        },
      { mins: base === "light" ?  5 : 20, label: second,             action: `10 ${second} rapid questions`,         tab: "rapid"         },
      ...(base === "full"
        ? [{ mins: 15, label: "One-liners", action: "5-min one-liner sweep", tab: "oneliners" }]
        : []),
    ],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DailyBriefing({
  completedDays,
  mcqScores,
  streak,
  examDate,
  onGoToTab,
}: DailyBriefingProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const daysLeft   = useMemo(() => getDaysToExam(examDate), [examDate]);
  const planDay    = useMemo(() => getPlanDay(completedDays), [completedDays]);
  const weakSubjs  = useMemo(() => computeWeakSubjects(completedDays, mcqScores), [completedDays, mcqScores]);
  const top2Weak   = weakSubjs.slice(0, 2);
  const isBehind   = completedDays.length < planDay - 1;
  const studiedToday = streak.lastDate === TODAY_ISO;
  const todayMood  = useMemo(() => getTodayMood(), []);
  const dayPlan    = useMemo(
    () => buildDayPlan(weakSubjs, daysLeft, todayMood, planDay),
    [weakSubjs, daysLeft, todayMood, planDay],
  );
  const totalPlanMins = dayPlan.blocks.reduce((s, b) => s + b.mins, 0);

  const urgencyColor = getUrgencyColor(daysLeft);
  const urgencyBg    = getUrgencyBg(daysLeft);

  const moodLabel = todayMood === null ? null
    : todayMood <= 2 ? "😴 Low energy — light plan active"
    : todayMood === 3 ? "😐 Normal mode"
    : todayMood === 4 ? "🙂 Focused mode"
    : "🚀 Peak mode — push hard today";

  const greeting = isBehind
    ? `You're behind — catch up today!`
    : `Good morning! Day ${planDay} of your 28-day plan`;

  const streakActive = studiedToday && streak.count > 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-background/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isBehind ? (
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
          ) : (
            <Target className="w-4 h-4 text-primary shrink-0" />
          )}
          <p className="text-xs font-mono text-foreground font-semibold truncate">{greeting}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Streak pill */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono ${
            streakActive
              ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
              : "bg-card border-border text-muted-foreground"
          }`}>
            <Flame className="w-3 h-3" />
            {streak.count}d
          </div>

          {/* Days left pill */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-mono ${urgencyBg} ${urgencyColor}`}>
            <Calendar className="w-3 h-3" />
            {daysLeft}d left
          </div>

          {/* Mood pill (when low) */}
          {todayMood !== null && todayMood <= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/30 text-amber-400 text-[11px] font-mono">
              😴 Light
            </div>
          )}

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-border/50 px-5 py-4 flex flex-col gap-4">

          {/* 0 — Mood banner */}
          {moodLabel && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-mono ${
              todayMood! <= 2
                ? "bg-amber-500/8 border-amber-500/25 text-amber-400"
                : todayMood === 3
                ? "bg-muted/20 border-border text-muted-foreground"
                : todayMood === 4
                ? "bg-blue-500/8 border-blue-500/25 text-blue-400"
                : "bg-emerald-500/8 border-emerald-500/25 text-emerald-400"
            }`}>
              {moodLabel}
              {todayMood! <= 2 && (
                <span className="ml-auto text-[10px] opacity-70">targets reduced — prioritise rest</span>
              )}
            </div>
          )}

          {/* 1 — Today's priority */}
          {top2Weak.length > 0 ? (
            <div className="bg-background border border-border/60 rounded-xl px-4 py-3">
              <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3 text-destructive" />
                Today's priority — weakest subjects
              </p>
              <div className="flex flex-col gap-1.5">
                {top2Weak.map(s => (
                  <div key={s.subject} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-foreground flex-1 truncate">{s.subject}</span>
                    <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden border border-border max-w-[100px]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.accuracy}%`,
                          backgroundColor: s.accuracy < 60 ? "#ef4444" : s.accuracy < 75 ? "#eab308" : "#22c55e",
                        }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-bold shrink-0 ${
                      s.accuracy < 60 ? "text-destructive" : s.accuracy < 75 ? "text-yellow-400" : "text-emerald-400"
                    }`}>
                      {s.accuracy}%
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      ({s.attempted} Qs)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border/60 rounded-xl px-4 py-3">
              <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">Today's priority</p>
              <p className="text-xs font-mono text-foreground">
                Complete MCQs after each subject to see your weak areas highlighted here.
              </p>
            </div>
          )}

          {/* 1b — Personalized today's plan */}
          <div className="bg-background border border-border/60 rounded-xl px-4 py-3">
            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-primary" />
              Today's plan
              <span className="ml-auto text-primary font-bold">{totalPlanMins} min</span>
              {todayMood !== null && todayMood <= 2 && (
                <span className="text-amber-400 text-[9px]">light mode (mood low)</span>
              )}
            </p>
            <ol className="flex flex-col gap-1.5">
              {dayPlan.blocks.map((block, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => onGoToTab(block.tab)}
                    className="flex-1 flex items-center justify-between text-left hover:text-primary transition-colors"
                  >
                    <span className="text-foreground/80">{block.action}</span>
                    <span className="text-muted-foreground shrink-0 ml-2">{block.mins}m →</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* 2 — Streak status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            streakActive
              ? "bg-orange-500/8 border-orange-500/25"
              : "bg-background border-border/60"
          }`}>
            <Flame className={`w-5 h-5 shrink-0 ${streakActive ? "text-orange-400" : "text-muted-foreground"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-foreground font-semibold">
                {streakActive
                  ? `${streak.count}-day streak — keep it going!`
                  : streak.count > 0
                  ? `Streak broken — restart today`
                  : "Start your streak today"}
              </p>
              {streak.longest > 0 && (
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  Longest streak: {streak.longest} days
                </p>
              )}
            </div>
          </div>

          {/* 3 — Days to exam (expanded detail) */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${urgencyBg}`}>
            <Calendar className={`w-5 h-5 shrink-0 ${urgencyColor}`} />
            <div>
              <p className={`text-xs font-mono font-bold ${urgencyColor}`}>
                {daysLeft === 0 ? "Exam day!" : `${daysLeft} days until NEET PG`}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                {daysLeft > 14
                  ? "Plenty of time — stay consistent."
                  : daysLeft >= 7
                  ? "Final stretch — revise high-yield topics."
                  : "Last lap — focus on rapid revision only!"}
              </p>
            </div>
          </div>

          {/* 4 — Quick actions */}
          <div>
            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-2">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onGoToTab("pyq")}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/30 text-primary text-xs font-mono rounded-lg hover:bg-primary/20 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Today's 500 Qs →
              </button>
              <button
                onClick={() => onGoToTab("oneliners")}
                className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono rounded-lg hover:bg-yellow-500/20 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Rapid Revision →
              </button>
              <button
                onClick={() => onGoToTab("chat")}
                className="flex items-center gap-1.5 px-3 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono rounded-lg hover:bg-violet-500/20 transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                Start Subject Drill →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
