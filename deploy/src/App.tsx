import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Target, Calendar, Clock, StickyNote, Flag, Bot, Flame, Download, Upload,
  BookOpen, Award, MessageSquare, ExternalLink, Sun, Moon, LogOut, LogIn,
  BarChart2, FlaskConical, FileText, Crosshair, Zap, Layers, Home, Trophy,
  Users, GraduationCap, Brain,
} from "lucide-react";
import { StudyReminderBanner, StudyReminderBell } from "@/components/StudyReminder";
import { EXAM_DATE, SCHEDULE } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";
import { SRCard } from "@/lib/sr";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DayGrid } from "@/components/DayGrid";
import { DayDetail, DetailTab } from "@/components/DayDetail";
import { DailyScheduleView } from "@/components/DailyScheduleView";
import { NotesView } from "@/components/NotesView";
import { RevisionList, FlaggedTopic } from "@/components/RevisionList";
import { MockScoreTracker } from "@/components/MockScoreTracker";
import { ChatPanel } from "@/components/ChatPanel";
import { PYQBank } from "@/components/PYQBank";
import { TopperInsights } from "@/components/TopperInsights";
import { RankPredictor } from "@/components/RankPredictor";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ResourceHub } from "@/components/ResourceHub";
import { CommunityQA } from "@/components/CommunityQA";
import { AdaptiveSuggestions } from "@/components/AdaptiveSuggestions";
import { AdaptivePlanPanel } from "@/components/AdaptivePlanPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { ExamSimulation } from "@/components/ExamSimulation";
import { ExamDateConfig } from "@/components/ExamDateConfig";
import { PDFLearningExtractor } from "@/components/PDFLearningExtractor";
import { SubjectDrill } from "@/components/SubjectDrill";
import { RapidRevision } from "@/components/RapidRevision";
import { OneLinerBank } from "@/components/OneLinerBank";
import { DailyBriefing } from "@/components/DailyBriefing";
import { ErrorAnalysis } from "@/components/ErrorAnalysis";
import { GamificationPanel } from "@/components/GamificationPanel";
import { MnemonicsBank } from "@/components/MnemonicsBank";
import { NEETPGPaperAnalysis } from "@/components/NEETPGPaperAnalysis";
import { XPToastLayer, makeToastItem, type XPToastItem } from "@/components/XPToast";
import { computeAdaptivePlan } from "@/lib/adaptive";
import { LoginScreen } from "@/components/LoginScreen";
import { useAuth } from "@/lib/auth";
import { useCloudSync } from "@/lib/cloud";
import { computeBaseXP, XP_VALUES, getRank } from "@/lib/xp";
import { checkAchievements } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MainTab =
  | 'planner' | 'schedule' | 'notes' | 'revision' | 'ai' | 'pyq'
  | 'toppers' | 'resources' | 'community' | 'analytics' | 'simulation'
  | 'pdf' | 'drills' | 'rapid' | 'oneliners' | 'rewards'
  | 'mnemonics' | 'analysis';

type NavGroup = 'home' | 'practice' | 'learn' | 'insights' | 'rewards';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }
interface StreakData { count: number; longest: number; lastDate: string; }

// ─── Nav config ────────────────────────────────────────────────────────────────

const NAV_GROUPS: {
  id: NavGroup;
  label: string;
  Icon: React.FC<{ className?: string }>;
  tabs: { id: MainTab; label: string; Icon: React.FC<{ className?: string }> }[];
}[] = [
  {
    id: 'home',
    label: 'Home',
    Icon: Home,
    tabs: [
      { id: 'planner',  label: 'Planner',  Icon: Calendar },
      { id: 'schedule', label: 'Schedule', Icon: Clock    },
    ],
  },
  {
    id: 'practice',
    label: 'Practice',
    Icon: Zap,
    tabs: [
      { id: 'pyq',        label: 'PYQ',        Icon: BookOpen    },
      { id: 'drills',     label: 'Drills',     Icon: Crosshair   },
      { id: 'rapid',      label: 'Rapid',      Icon: Zap         },
      { id: 'oneliners',  label: 'One-liners', Icon: Layers      },
      { id: 'simulation', label: 'Simulate',   Icon: FlaskConical},
      { id: 'revision',   label: 'Revision',   Icon: Flag        },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    Icon: GraduationCap,
    tabs: [
      { id: 'notes',      label: 'Notes',      Icon: StickyNote },
      { id: 'pdf',        label: 'PDF',        Icon: FileText   },
      { id: 'ai',         label: 'AI Tutor',   Icon: Bot        },
      { id: 'mnemonics',  label: 'Mnemonics',  Icon: Brain      },
      { id: 'analysis',   label: 'Analysis',   Icon: BarChart2  },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    Icon: BarChart2,
    tabs: [
      { id: 'analytics',  label: 'Analytics',  Icon: BarChart2    },
      { id: 'toppers',    label: 'Toppers',    Icon: Award        },
      { id: 'resources',  label: 'Resources',  Icon: ExternalLink },
      { id: 'community',  label: 'Community',  Icon: MessageSquare},
    ],
  },
  {
    id: 'rewards',
    label: 'Rewards',
    Icon: Trophy,
    tabs: [
      { id: 'rewards', label: 'Rewards', Icon: Trophy },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcTimeLeft(examDate: Date): TimeLeft {
  const distance = examDate.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

function exportAllData(prefix: string) {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
  const data: Record<string, unknown> = {};
  keys.forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(k)!); }
    catch { data[k] = localStorage.getItem(k); }
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `neetpg-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── StudyApp ──────────────────────────────────────────────────────────────────

interface StudyAppProps {
  prefix: string;
  user: User | null;
  onSignOut: () => Promise<void>;
}

function StudyApp({ prefix, user, onSignOut }: StudyAppProps) {

  // ── Core study state ──────────────────────────────────────────
  const [completedDays, setCompletedDays] = useState<number[]>(() =>
    safeLoad<number[]>(`${prefix}completed_days`, [])
  );
  const [notes, setNotes] = useState<Record<number, string>>(() =>
    safeLoad<Record<number, string>>(`${prefix}notes`, {})
  );
  const [mcqScores, setMcqScores] = useState<Record<number, { attempted: number; correct: number }>>(() =>
    safeLoad(`${prefix}mcq_scores`, {})
  );
  const [flagged, setFlagged] = useState<FlaggedTopic[]>(() =>
    safeLoad(`${prefix}flagged`, [])
  );
  const [srCards, setSrCards] = useState<Record<number, SRCard>>(() =>
    safeLoad(`${prefix}sr_cards`, {})
  );
  const [streak, setStreak] = useState<StreakData>(() =>
    safeLoad(`${prefix}streak`, { count: 0, longest: 0, lastDate: '' })
  );
  const [pyqAttempts, setPyqAttempts] = useState<Record<number, { selected: number; correct: boolean }>>(() =>
    safeLoad('neetpg_pyq_attempts', {})
  );
  const [examDate, setExamDate] = useState<Date>(() => {
    const saved = safeLoad<string>(`${prefix}exam_date`, '');
    return saved ? new Date(saved) : EXAM_DATE;
  });

  // ── Gamification state ─────────────────────────────────────────
  const [bonusXP,        setBonusXP]        = useState<number>(() => safeLoad('neetpg_bonus_xp', 0));
  const [unlockedIds,    setUnlockedIds]    = useState<string[]>(() => safeLoad('neetpg_achievements', []));
  const [drillsCompleted, setDrillsCompleted] = useState<number>(() => safeLoad('neetpg_drills_count', 0));
  const [simCompleted,   setSimCompleted]   = useState<boolean>(() => safeLoad('neetpg_sim_done', false));
  const [xpToasts,       setXpToasts]       = useState<XPToastItem[]>([]);

  // ── Nav state ──────────────────────────────────────────────────
  const [activeGroup,      setActiveGroup]      = useState<NavGroup>('home');
  const [activeTab,        setActiveTab]        = useState<MainTab>('planner');
  const [selectedSubject,  setSelectedSubject]  = useState<string>('All');
  const [selectedDayId,    setSelectedDayId]    = useState<number>(1);
  const [detailTab,        setDetailTab]        = useState<DetailTab>('TOPICS');
  const [timeLeft,         setTimeLeft]         = useState<TimeLeft>(() => calcTimeLeft(examDate));
  const [showOnboarding,   setShowOnboarding]   = useState<boolean>(() => !localStorage.getItem(`${prefix}onboarded`));
  const [isLightMode,      setIsLightMode]      = useState<boolean>(() => safeLoad('neetpg_light_mode', false));

  const importRef = useRef<HTMLInputElement>(null);

  // ── Derived XP ────────────────────────────────────────────────
  const baseXP = useMemo(
    () => computeBaseXP(completedDays, mcqScores, notes, streak),
    [completedDays, mcqScores, notes, streak]
  );
  const totalXP = baseXP + bonusXP;

  // ── Achievement check ─────────────────────────────────────────
  useEffect(() => {
    const mcqCorrect   = Object.values(mcqScores).reduce((s, v) => s + (v.correct ?? 0), 0);
    const mcqAttempted = Object.values(mcqScores).reduce((s, v) => s + (v.attempted ?? 0), 0);
    const pyqAttempted = Object.values(pyqAttempts).length;
    const notesCount   = Object.values(notes).filter(n => n?.trim()).length;

    const newly = checkAchievements(
      { completedDays, streak, mcqCorrect, mcqAttempted, pyqAttempted, notesCount, drillsCompleted, simulationCompleted: simCompleted },
      totalXP,
      unlockedIds,
    );

    if (newly.length > 0) {
      const newIds = newly.map(a => a.id);
      const bonusFromAchievements = newly.reduce((s, a) => s + a.xpReward, 0);
      setUnlockedIds(prev => [...prev, ...newIds]);
      setBonusXP(prev => prev + bonusFromAchievements);
      // Each achievement also shows as a toast
      newly.forEach(a => {
        setXpToasts(prev => [...prev, makeToastItem(a.xpReward, `${a.emoji} ${a.title}`)]);
      });
    }
  }, [completedDays, streak, mcqScores, pyqAttempts, notes, drillsCompleted, simCompleted, totalXP, unlockedIds]);

  // ── Leaderboard sync ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    supabase.from("leaderboard").upsert({
      user_id:      user.id,
      display_name: user.email ?? 'Aspirant',
      xp:           totalXP,
      rank_title:   getRank(totalXP).title,
      streak:       streak.count,
      completed:    completedDays.length,
      updated_at:   new Date().toISOString(),
    }, { onConflict: 'user_id' }).then(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalXP]);

  // ── Cloud sync (now actually wired up) ───────────────────────
  const syncReady = !!user;
  useCloudSync('completed_days', completedDays as never, syncReady);
  useCloudSync('notes',           notes        as never, syncReady);
  useCloudSync('mcq_scores',      mcqScores    as never, syncReady);
  useCloudSync('flagged',         flagged      as never, syncReady);
  useCloudSync('sr_cards',        srCards      as never, syncReady);
  useCloudSync('streak',          streak       as never, syncReady);
  useCloudSync('exam_date',       examDate.toISOString() as never, syncReady);

  // ── Theme ─────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('light', isLightMode);
    safeSave('neetpg_light_mode', isLightMode);
  }, [isLightMode]);

  // ── localStorage persistence ──────────────────────────────────
  useEffect(() => { safeSave(`${prefix}completed_days`, completedDays); }, [completedDays, prefix]);
  useEffect(() => { safeSave(`${prefix}notes`,          notes);          }, [notes, prefix]);
  useEffect(() => { safeSave(`${prefix}mcq_scores`,     mcqScores);      }, [mcqScores, prefix]);
  useEffect(() => { safeSave(`${prefix}flagged`,        flagged);         }, [flagged, prefix]);
  useEffect(() => { safeSave(`${prefix}sr_cards`,       srCards);         }, [srCards, prefix]);
  useEffect(() => { safeSave(`${prefix}streak`,         streak);          }, [streak, prefix]);
  useEffect(() => { safeSave(`${prefix}exam_date`,      examDate.toISOString()); }, [examDate, prefix]);
  useEffect(() => { safeSave('neetpg_bonus_xp',         bonusXP);         }, [bonusXP]);
  useEffect(() => { safeSave('neetpg_achievements',     unlockedIds);     }, [unlockedIds]);
  useEffect(() => { safeSave('neetpg_drills_count',     drillsCompleted); }, [drillsCompleted]);
  useEffect(() => { safeSave('neetpg_sim_done',         simCompleted);    }, [simCompleted]);

  // ── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft(examDate)), 1000);
    return () => clearInterval(t);
  }, [examDate]);

  useEffect(() => {
    const handler = () => setPyqAttempts(safeLoad('neetpg_pyq_attempts', {}));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ── XP gain callback ──────────────────────────────────────────
  const gainXP = useCallback((amount: number, label: string) => {
    setBonusXP(prev => prev + amount);
    setXpToasts(prev => [...prev, makeToastItem(amount, label)]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Study logic ───────────────────────────────────────────────
  const toggleDayCompletion = (day: number) => {
    const isCompleting = !completedDays.includes(day);
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    if (isCompleting) {
      gainXP(XP_VALUES.day_complete, `Day ${day} complete`);
      const today = new Date().toISOString().slice(0, 10);
      setStreak(s => {
        if (s.lastDate === today) return s;
        const prev = new Date(); prev.setDate(prev.getDate() - 1);
        const newCount = s.lastDate === prev.toISOString().slice(0, 10) ? s.count + 1 : 1;
        return { count: newCount, longest: Math.max(s.longest, newCount), lastDate: today };
      });
    }
  };

  const updateNote = (day: number, text: string) =>
    setNotes(prev => ({ ...prev, [day]: text }));

  const saveMcqScore = (day: number, attempted: number, correct: number) => {
    const prev = mcqScores[day] ?? { attempted: 0, correct: 0 };
    const newCorrect = correct - (prev.correct ?? 0);
    const newWrong   = (attempted - correct) - (Math.max(0, (prev.attempted ?? 0) - (prev.correct ?? 0)));
    setMcqScores(p => ({ ...p, [day]: { attempted, correct } }));
    if (newCorrect > 0) gainXP(newCorrect * XP_VALUES.mcq_correct, 'MCQ correct');
    if (newWrong   > 0) gainXP(newWrong   * XP_VALUES.mcq_wrong,   'MCQ attempt');
  };

  const toggleFlag = (dayId: number, topicIdx: number) =>
    setFlagged(prev =>
      prev.some(f => f.dayId === dayId && f.topicIdx === topicIdx)
        ? prev.filter(f => !(f.dayId === dayId && f.topicIdx === topicIdx))
        : [...prev, { dayId, topicIdx }]
    );

  const updateSrCard = (dayId: number, card: SRCard) =>
    setSrCards(prev => ({ ...prev, [dayId]: card }));

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target!.result as string) as Record<string, unknown>;
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
        window.location.reload();
      } catch { alert('Invalid backup file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrillComplete = useCallback(() => {
    setDrillsCompleted(prev => prev + 1);
    gainXP(XP_VALUES.drill_complete, 'Drill complete');
  }, [gainXP]);

  const handleRapidComplete = useCallback(() => {
    setDrillsCompleted(prev => prev + 1);
    gainXP(XP_VALUES.rapid_complete, 'Rapid revision');
  }, [gainXP]);

  const handleSimComplete = useCallback(() => {
    setSimCompleted(true);
    gainXP(XP_VALUES.simulation_complete, 'Exam simulation');
  }, [gainXP]);

  const handlePYQCorrect = useCallback(() => gainXP(XP_VALUES.pyq_correct, 'PYQ correct'), [gainXP]);
  const handlePYQWrong   = useCallback(() => gainXP(XP_VALUES.pyq_wrong,   'PYQ attempt'), [gainXP]);
  const handleAIChat     = useCallback(() => gainXP(XP_VALUES.ai_chat,     'AI tutor'),    [gainXP]);

  // ── Nav helpers ───────────────────────────────────────────────
  const handleGroupClick = (gid: NavGroup) => {
    setActiveGroup(gid);
    const group = NAV_GROUPS.find(g => g.id === gid);
    if (group?.tabs.length === 1) setActiveTab(group.tabs[0].id);
    else if (gid === 'home') setActiveTab('planner');
  };

  const handleOnboardingDone = () => {
    localStorage.setItem(`${prefix}onboarded`, '1');
    setShowOnboarding(false);
  };

  const adaptivePlan = useMemo(
    () => computeAdaptivePlan(mcqScores, completedDays),
    [mcqScores, completedDays]
  );

  const filteredSchedule = useMemo(() => {
    if (selectedSubject === 'All') return SCHEDULE;
    if (selectedSubject === 'Full Mock') return SCHEDULE.filter(s => s.phase === 'mock');
    return SCHEDULE.filter(s => s.subject === selectedSubject);
  }, [selectedSubject]);

  const selectedDay  = SCHEDULE.find(s => s.day === selectedDayId) ?? SCHEDULE[0];
  const studiedToday = streak.lastDate === new Date().toISOString().slice(0, 10);
  const isPostExam   = examDate.getTime() <= Date.now();
  const userInitial  = user?.email?.[0]?.toUpperCase() ?? 'G';
  const userLabel    = user?.email ?? 'Guest';

  const studyContext = useMemo(() => ({
    completedDays,
    mcqScores,
    flaggedCount: flagged.length,
    currentDayFocus: selectedDay ? `Day ${selectedDay.day} — ${selectedDay.subject}: ${selectedDay.focus}` : '',
    examDate,
  }), [completedDays, mcqScores, flagged.length, selectedDay, examDate]);

  const activeGroupData = NAV_GROUPS.find(g => g.id === activeGroup) ?? NAV_GROUPS[0];
  const showSubNav      = activeGroupData.tabs.length > 1;
  const flagBadge       = flagged.length || undefined;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
      <XPToastLayer items={xpToasts} onDismiss={dismissToast} />

      {/* ── Header ── */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <StudyReminderBanner studiedToday={studiedToday} />
        <div className="px-4 md:px-6 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-destructive p-2 rounded-md shrink-0">
              <Target className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-primary leading-none">NEET PG War Plan</h1>
              <p className="text-[10px] text-muted-foreground font-mono">MAY 16, 2026 // COMMAND CENTER</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* XP badge */}
            <button
              onClick={() => { setActiveGroup('rewards'); setActiveTab('rewards'); }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full hover:bg-violet-500/20 transition-colors"
              title="View Rewards"
            >
              <Trophy className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-mono text-violet-400 font-bold">{totalXP.toLocaleString()} XP</span>
            </button>

            {/* Streak */}
            {streak.count > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-mono text-orange-400 font-bold">{streak.count}</span>
                {streak.longest > 1 && (
                  <span className="text-[10px] font-mono text-orange-400/60">/ {streak.longest} best</span>
                )}
              </div>
            )}

            <CountdownTimer timeLeft={timeLeft} />
            <button
              onClick={() => setIsLightMode(m => !m)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
              aria-label="Toggle theme"
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <StudyReminderBell studiedToday={studiedToday} />

            {/* User */}
            <div className="flex items-center gap-1.5 border-l border-border pl-2 md:pl-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-bold text-primary">{userInitial}</span>
              </div>
              <span className="hidden lg:block text-[11px] font-mono text-muted-foreground max-w-[130px] truncate">{userLabel}</span>
              <button
                onClick={onSignOut}
                title={user ? "Sign out" : "Switch account"}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
                aria-label={user ? "Sign out" : "Switch account"}
              >
                {user ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Primary nav (5 groups) ── */}
      <div className="sticky top-[57px] z-[9] bg-background border-b border-border/50">
        <div className="px-4 md:px-6 py-2 flex items-center justify-between gap-3">
          {/* Group tabs */}
          <nav className="flex gap-1 bg-card border border-border rounded-lg p-1 overflow-x-auto no-scrollbar" aria-label="Navigation groups">
            {NAV_GROUPS.map(({ id, label, Icon }) => {
              const isActive = activeGroup === id;
              const hasBadge = id === 'practice' && flagBadge;
              return (
                <button
                  key={id}
                  onClick={() => handleGroupClick(id)}
                  className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {hasBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center">
                      {flagBadge > 99 ? '99' : flagBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Progress + export */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-muted-foreground whitespace-nowrap hidden sm:block">
              {completedDays.length}/28
            </span>
            <div
              className="h-2 w-20 sm:w-32 bg-card rounded-full overflow-hidden border border-border"
              role="progressbar"
              aria-valuenow={completedDays.length}
              aria-valuemin={0}
              aria-valuemax={28}
              aria-label="Study progress"
            >
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(completedDays.length / 28) * 100}%` }}
              />
            </div>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <button onClick={() => exportAllData(prefix)} title="Export backup" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => importRef.current?.click()} title="Import backup" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border">
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-nav (only for multi-tab groups) */}
        {showSubNav && (
          <div className="px-4 md:px-6 pb-2">
            <div className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label={`${activeGroupData.label} sections`}>
              {activeGroupData.tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-colors ${
                    activeTab === id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {id === 'revision' && flagBadge ? (
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center">
                      {flagBadge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">

        {/* HOME group */}
        <div hidden={activeGroup !== 'home' || activeTab !== 'planner'}>
          <div className="flex flex-col gap-6">
            <DailyBriefing
              completedDays={completedDays}
              mcqScores={mcqScores}
              streak={streak}
              examDate={examDate}
              onGoToTab={(tab) => { setActiveTab(tab as MainTab); }}
            />
            <div className="flex flex-col lg:flex-row gap-6">
              <DayGrid
                schedule={SCHEDULE}
                filteredSchedule={filteredSchedule}
                completedDays={completedDays}
                notes={notes}
                selectedDayId={selectedDayId}
                onSelectDay={setSelectedDayId}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                urgentDays={adaptivePlan.urgentRemainingDays}
                missedDays={adaptivePlan.missedBlitzDays}
              />
              <DayDetail
                day={selectedDay}
                detailTab={detailTab}
                onSetDetailTab={setDetailTab}
                completedDays={completedDays}
                onToggleCompletion={toggleDayCompletion}
                notes={notes}
                onUpdateNote={updateNote}
                mcqScores={mcqScores}
                onSaveMcqScore={saveMcqScore}
                onSelectDay={setSelectedDayId}
                flagged={flagged}
                onToggleFlag={toggleFlag}
                onPrevDay={() => setSelectedDayId(prev => prev - 1)}
                onNextDay={() => setSelectedDayId(prev => prev + 1)}
                canGoPrev={selectedDayId > 1}
                canGoNext={selectedDayId < 28}
              />
            </div>
            <AdaptivePlanPanel
              mcqScores={mcqScores}
              completedDays={completedDays}
              onSelectDay={(day) => setSelectedDayId(day)}
            />
          </div>
        </div>

        <div hidden={activeGroup !== 'home' || activeTab !== 'schedule'}>
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <DailyScheduleView />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <MockScoreTracker />
              </div>
              <RankPredictor />
            </div>
            <AdaptiveSuggestions
              pyqAttempts={pyqAttempts}
              mcqScores={mcqScores}
              completedDays={completedDays}
              onGoToTab={(tab) => setActiveTab(tab as MainTab)}
            />
            <ExamDateConfig
              currentExamDate={examDate}
              onSave={setExamDate}
              isPostExam={isPostExam}
            />
          </div>
        </div>

        {/* PRACTICE group */}
        <div hidden={activeGroup !== 'practice' || activeTab !== 'pyq'}>
          <PYQBank onCorrect={handlePYQCorrect} onWrong={handlePYQWrong} />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'drills'}>
          <SubjectDrill onComplete={handleDrillComplete} />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'rapid'}>
          <RapidRevision onComplete={handleRapidComplete} />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'oneliners'}>
          <OneLinerBank />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'simulation'}>
          <ExamSimulation onComplete={handleSimComplete} />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'revision'}>
          <RevisionList
            flagged={flagged}
            onUnflag={toggleFlag}
            onGoToDay={(day) => { setSelectedDayId(day); setActiveGroup('home'); setActiveTab('planner'); }}
          />
        </div>

        {/* LEARN group */}
        <div hidden={activeGroup !== 'learn' || activeTab !== 'notes'}>
          <NotesView
            selectedDayId={selectedDayId}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDayId}
            notes={notes}
            onUpdateNote={updateNote}
            srCards={srCards}
            onUpdateSrCard={updateSrCard}
          />
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'pdf'}>
          <PDFLearningExtractor />
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'ai'}>
          <ChatPanel studyContext={studyContext} onFirstMessage={handleAIChat} />
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'mnemonics'}>
          <MnemonicsBank />
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'analysis'}>
          <NEETPGPaperAnalysis />
        </div>

        {/* INSIGHTS group */}
        <div hidden={activeGroup !== 'insights' || activeTab !== 'analytics'}>
          <div className="flex flex-col gap-6">
            <AnalyticsPanel mcqScores={mcqScores} completedDays={completedDays} streak={streak} examDate={examDate} />
            <ErrorAnalysis mcqScores={mcqScores} />
          </div>
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'toppers'}>
          <TopperInsights />
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'resources'}>
          <ResourceHub />
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'community'}>
          <CommunityQA />
        </div>

        {/* REWARDS group */}
        <div hidden={activeGroup !== 'rewards'}>
          <GamificationPanel
            xp={totalXP}
            unlockedIds={unlockedIds}
            completedDays={completedDays.length}
            streak={streak.longest}
            displayName={user?.email ?? 'Aspirant'}
          />
        </div>

      </main>
    </div>
  );
}

// ─── App (Auth Gate) ──────────────────────────────────────────────

export default function App() {
  const { user, loading, isGuest, storagePrefix, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-destructive p-3 rounded-xl animate-pulse">
            <Target className="w-8 h-8 text-destructive-foreground" />
          </div>
          <p className="text-sm font-mono text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) return <LoginScreen />;

  return (
    <StudyApp
      key={storagePrefix}
      prefix={storagePrefix}
      user={user}
      onSignOut={signOut}
    />
  );
}
