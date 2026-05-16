import { useState, useMemo } from "react";
import {
  ChevronDown, ChevronUp, Flame, Calendar, TrendingDown,
  Zap, BookOpen, Target, AlertTriangle,
} from "lucide-react";
import { QUESTION_SUBJECTS } from "@/data/questions";

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

  const urgencyColor = getUrgencyColor(daysLeft);
  const urgencyBg    = getUrgencyBg(daysLeft);

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
