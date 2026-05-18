import { Trophy, Flame, Sun, Moon, Target } from "lucide-react";
import { StudyReminderBanner, StudyReminderBell } from "@/components/StudyReminder";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HeaderAuth } from "@/components/HeaderAuth";
import { SyncStatus } from "@/components/SyncStatus";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AppHeaderProps {
  totalXP: number;
  streak: { count: number; longest: number };
  timeLeft: TimeLeft;
  isLightMode: boolean;
  onToggleTheme: () => void;
  studiedToday: boolean;
  onGoToRewards: () => void;
  examDateLabel: string;
  isPostExam: boolean;
}

export function AppHeader({
  totalXP, streak, timeLeft, isLightMode, onToggleTheme,
  studiedToday, onGoToRewards, examDateLabel, isPostExam,
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <StudyReminderBanner studiedToday={studiedToday} />

      {/* ── Row 1: Brand + action icons ────────────────────────────── */}
      <div className="px-3 sm:px-6 pt-2.5 pb-1 flex items-center justify-between gap-2">

        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-destructive p-1.5 rounded-md shrink-0" aria-hidden="true">
            <Target className="w-4 h-4 text-destructive-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-xl font-bold uppercase tracking-wider text-primary leading-none whitespace-nowrap">
              NEET PG War Plan
            </h1>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono truncate">
              {examDateLabel} // {isPostExam ? "POST-EXAM" : "CMD CENTER"}
            </p>
          </div>
        </div>

        {/* Action icons — always visible */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
            aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
          >
            {isLightMode
              ? <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              : <Sun  className="w-3.5 h-3.5" aria-hidden="true" />}
          </button>

          <StudyReminderBell studiedToday={studiedToday} />

          <HeaderAuth />
        </div>
      </div>

      {/* ── Row 2: Countdown + XP + Streak ─────────────────────────── */}
      <div className="px-3 sm:px-6 pb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <CountdownTimer timeLeft={timeLeft} compact />
          <SyncStatus />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onGoToRewards}
            className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 border border-violet-500/30 rounded-full hover:bg-violet-500/20 transition-colors"
            title="View Rewards"
          >
            <Trophy className="w-3 h-3 text-violet-400" aria-hidden="true" />
            <span className="text-[10px] sm:text-xs font-mono text-violet-400 font-bold">
              {totalXP.toLocaleString()} XP
            </span>
          </button>

          {streak.count > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 rounded-full"
              title={`${streak.count}-day streak (best: ${streak.longest})`}
            >
              <Flame className="w-3 h-3 text-orange-400" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-mono text-orange-400 font-bold">{streak.count}</span>
              <span className="hidden sm:inline text-[9px] font-mono text-orange-400/60">
                /{streak.longest}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
