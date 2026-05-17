import { Trophy, Flame, Sun, Moon, LogOut, LogIn, Target } from "lucide-react";
import { StudyReminderBanner, StudyReminderBell } from "@/components/StudyReminder";
import { CountdownTimer } from "@/components/CountdownTimer";

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
  userInitial: string;
  userLabel: string;
  hasUser: boolean;
  onSignOut: () => Promise<void>;
  onGoToRewards: () => void;
  examDateLabel: string;
  isPostExam: boolean;
}

export function AppHeader({
  totalXP, streak, timeLeft, isLightMode, onToggleTheme,
  studiedToday, userInitial, userLabel, hasUser, onSignOut,
  onGoToRewards, examDateLabel, isPostExam,
}: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <StudyReminderBanner studiedToday={studiedToday} />
      <div className="px-4 md:px-6 py-3 flex justify-between items-center gap-4">

        <div className="flex items-center gap-3">
          <div className="bg-destructive p-2 rounded-md shrink-0" aria-hidden="true">
            <Target className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-primary leading-none">
              NEET PG War Plan
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono">
              {examDateLabel} // {isPostExam ? "POST-EXAM" : "COMMAND CENTER"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onGoToRewards}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full hover:bg-violet-500/20 transition-colors"
            title="View Rewards"
          >
            <Trophy className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
            <span className="text-xs font-mono text-violet-400 font-bold">
              {totalXP.toLocaleString()} XP
            </span>
          </button>

          {streak.count > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full"
              title={`${streak.count}-day streak (best: ${streak.longest})`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
              <span className="text-xs font-mono text-orange-400 font-bold">{streak.count}</span>
              {streak.longest > 1 && (
                <span className="text-[10px] font-mono text-orange-400/60">
                  / {streak.longest} best
                </span>
              )}
            </div>
          )}

          <CountdownTimer timeLeft={timeLeft} />

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

          <div className="flex items-center gap-1.5 border-l border-border pl-2 md:pl-3">
            <div
              className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <span className="text-[10px] font-mono font-bold text-primary">{userInitial}</span>
            </div>
            <span className="hidden lg:block text-[11px] font-mono text-muted-foreground max-w-[130px] truncate">
              {userLabel}
            </span>
            <button
              onClick={onSignOut}
              title={hasUser ? "Sign out" : "Switch account"}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
              aria-label={hasUser ? "Sign out" : "Switch account"}
            >
              {hasUser
                ? <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                : <LogIn  className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
