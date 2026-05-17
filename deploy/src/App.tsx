import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { useStore } from "zustand";
import type { User } from "@supabase/supabase-js";
import {
  Target, Calendar, Clock, StickyNote, Flag, Flame, Download, Upload,
  BookOpen, Award, MessageSquare, ExternalLink, Sun, Moon, LogOut, LogIn,
  BarChart2, FlaskConical, FileText, Crosshair, Zap, Layers, Home, Trophy,
  Users, GraduationCap, Brain, TrendingUp,
  Pill, Calculator, BookMarked, XCircle, LayoutGrid, ScrollText, Stethoscope, Sliders, Eye, CalendarCheck,
} from "lucide-react";
import { StudyReminderBanner, StudyReminderBell } from "@/components/StudyReminder";
import { SCHEDULE } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";
import { SRCard } from "@/lib/sr";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DayGrid } from "@/components/DayGrid";
import { DayDetail, DetailTab } from "@/components/DayDetail";
import { DailyScheduleView } from "@/components/DailyScheduleView";
import { NotesView } from "@/components/NotesView";
import { RevisionList } from "@/components/RevisionList";
import { MockScoreTracker } from "@/components/MockScoreTracker";
import { RankPredictor } from "@/components/RankPredictor";
import { OnboardingModal } from "@/components/OnboardingModal";
import { AdaptiveSuggestions } from "@/components/AdaptiveSuggestions";
import { AdaptivePlanPanel } from "@/components/AdaptivePlanPanel";
import { ExamDateConfig } from "@/components/ExamDateConfig";
import { DailyBriefing } from "@/components/DailyBriefing";
import { XPToastLayer, makeToastItem, type XPToastItem } from "@/components/XPToast";
import { computeAdaptivePlan } from "@/lib/adaptive";
import { LoginScreen } from "@/components/LoginScreen";

// ── Lazy-loaded tab components (split into separate JS chunks) ────────────────
// Each component is fetched from the network only on the first visit to its tab.
// After that it stays mounted (behind `hidden`) so in-session state is preserved.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mk = <T extends Record<string, unknown>>(fn: () => Promise<T>, name: keyof T) =>
  lazy(() => fn().then(m => ({ default: m[name] as any })));

const PYQBank           = mk(() => import("@/components/PYQBank"),           "PYQBank");
const SubjectDrill      = mk(() => import("@/components/SubjectDrill"),      "SubjectDrill");
const RapidRevision     = mk(() => import("@/components/RapidRevision"),     "RapidRevision");
const OneLinerBank      = mk(() => import("@/components/OneLinerBank"),      "OneLinerBank");
const ExamSimulation    = mk(() => import("@/components/ExamSimulation"),    "ExamSimulation");
const DailyQuiz         = mk(() => import("@/components/DailyQuiz"),         "DailyQuiz");
const CustomMockGenerator = mk(() => import("@/components/CustomMockGenerator"), "CustomMockGenerator");
const PSMCalculator     = mk(() => import("@/components/PSMCalculator"),     "PSMCalculator");
const ImageBank         = mk(() => import("@/components/ImageBank"),         "ImageBank");
const PDFLearningExtractor = mk(() => import("@/components/PDFLearningExtractor"), "PDFLearningExtractor");
const HighYieldReference = mk(() => import("@/components/HighYieldReference"), "HighYieldReference");
const MnemonicsBank     = mk(() => import("@/components/MnemonicsBank"),     "MnemonicsBank");
const NEETPGPaperAnalysis = mk(() => import("@/components/NEETPGPaperAnalysis"), "NEETPGPaperAnalysis");
const FlashcardDeck     = mk(() => import("@/components/FlashcardDeck"),     "FlashcardDeck");
const DOCTable          = mk(() => import("@/components/DOCTable"),          "DOCTable");
const RevisionScheduler = mk(() => import("@/components/RevisionScheduler"), "RevisionScheduler");
const MistakeLogbook    = mk(() => import("@/components/MistakeLogbook"),    "MistakeLogbook");
const AnalyticsPanel    = mk(() => import("@/components/AnalyticsPanel"),    "AnalyticsPanel");
const ErrorAnalysis     = mk(() => import("@/components/ErrorAnalysis"),     "ErrorAnalysis");
const TopperInsights    = mk(() => import("@/components/TopperInsights"),    "TopperInsights");
const ResourceHub       = mk(() => import("@/components/ResourceHub"),       "ResourceHub");
const CommunityQA       = mk(() => import("@/components/CommunityQA"),       "CommunityQA");
const WeakTopicHeatmap  = mk(() => import("@/components/WeakTopicHeatmap"),  "WeakTopicHeatmap");
const CutoffHistory     = mk(() => import("@/components/CutoffHistory"),     "CutoffHistory");
const SpecialtySeatTracker = mk(() => import("@/components/SpecialtySeatTracker"), "SpecialtySeatTracker");
const GuidelinesFeed    = mk(() => import("@/components/GuidelinesFeed"),    "GuidelinesFeed");
const GamificationPanel = mk(() => import("@/components/GamificationPanel"), "GamificationPanel");
import { useAuth } from "@/lib/auth";
import { useCloudSync } from "@/lib/cloud";
import { getAppStore, sel } from "@/lib/store";
import type { StreakData } from "@/lib/store";
import { computeBaseXP, XP_VALUES, getRank } from "@/lib/xp";
import { checkAchievements } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MainTab =
  | 'planner' | 'schedule' | 'notes' | 'revision' | 'ai' | 'pyq'
  | 'toppers' | 'resources' | 'community' | 'analytics' | 'simulation'
  | 'pdf' | 'drills' | 'rapid' | 'oneliners' | 'rewards'
  | 'mnemonics' | 'analysis'
  | 'dailyquiz' | 'custommock' | 'imagequiz' | 'psmcalc'
  | 'flashcards' | 'doctable' | 'revschedule' | 'mistakelogbook'
  | 'weakheatmap' | 'cutoffhistory' | 'specialtyseats' | 'guidelines';

type NavGroup = 'home' | 'practice' | 'learn' | 'insights' | 'rewards';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

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
      { id: 'dailyquiz',  label: 'Daily Quiz', Icon: CalendarCheck},
      { id: 'custommock', label: 'Custom Mock',Icon: Sliders     },
      { id: 'psmcalc',    label: 'PSM Calc',   Icon: Calculator  },
      { id: 'imagequiz',  label: 'Image Bank', Icon: Eye         },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    Icon: GraduationCap,
    tabs: [
      { id: 'notes',        label: 'Notes',      Icon: StickyNote  },
      { id: 'pdf',          label: 'PDF',        Icon: FileText    },
      { id: 'ai',           label: 'HY Ref',     Icon: BookOpen    },
      { id: 'mnemonics',    label: 'Mnemonics',  Icon: Brain       },
      { id: 'analysis',     label: 'Analysis',   Icon: BarChart2   },
      { id: 'flashcards',   label: 'Flashcards', Icon: BookMarked  },
      { id: 'doctable',     label: 'DOC Table',  Icon: Pill        },
      { id: 'revschedule',  label: 'Rev Sched',  Icon: CalendarCheck},
      { id: 'mistakelogbook', label: 'Logbook',  Icon: XCircle     },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    Icon: BarChart2,
    tabs: [
      { id: 'analytics',      label: 'Analytics',  Icon: BarChart2    },
      { id: 'toppers',        label: 'Toppers',    Icon: Award        },
      { id: 'resources',      label: 'Resources',  Icon: ExternalLink },
      { id: 'community',      label: 'Community',  Icon: MessageSquare},
      { id: 'weakheatmap',    label: 'Weak Areas', Icon: LayoutGrid   },
      { id: 'cutoffhistory',  label: 'Cutoffs',    Icon: TrendingUp   },
      { id: 'specialtyseats', label: 'Specialties',Icon: Stethoscope  },
      { id: 'guidelines',     label: 'Guidelines', Icon: ScrollText   },
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

function TabFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

interface StudyAppProps {
  prefix: string;
  user: User | null;
  onSignOut: () => Promise<void>;
}

function StudyApp({ prefix, user, onSignOut }: StudyAppProps) {

  // ── Persistent store (Zustand, per auth-prefix) ───────────────
  const appStore = getAppStore(prefix);
  const completedDays  = useStore(appStore, sel.completedDays);
  const notes          = useStore(appStore, sel.notes);
  const mcqScores      = useStore(appStore, sel.mcqScores);
  const flagged        = useStore(appStore, sel.flagged);
  const srCards        = useStore(appStore, sel.srCards);
  const streak         = useStore(appStore, sel.streak);
  const examDateIso    = useStore(appStore, sel.examDateIso);
  const bonusXP        = useStore(appStore, sel.bonusXP);
  const unlockedIds    = useStore(appStore, sel.unlockedIds);
  const drillsCompleted = useStore(appStore, sel.drillsCompleted);
  const simCompleted   = useStore(appStore, sel.simCompleted);

  // examDate is derived from the ISO string stored in the store
  const examDate = useMemo(() => new Date(examDateIso), [examDateIso]);

  // ── Session-only state ────────────────────────────────────────
  const [pyqAttempts, setPyqAttempts] = useState<Record<number, { selected: number; correct: boolean }>>(() =>
    safeLoad('neetpg_pyq_attempts', {})
  );
  const [xpToasts, setXpToasts] = useState<XPToastItem[]>([]);

  // ── Nav state ──────────────────────────────────────────────────
  const [activeGroup,      setActiveGroup]      = useState<NavGroup>('home');
  const [activeTab,        setActiveTab]        = useState<MainTab>('planner');
  const [selectedSubject,  setSelectedSubject]  = useState<string>('All');
  const [selectedDayId,    setSelectedDayId]    = useState<number>(1);
  const [detailTab,        setDetailTab]        = useState<DetailTab>('TOPICS');
  const [timeLeft,         setTimeLeft]         = useState<TimeLeft>(() => calcTimeLeft(examDate));
  const [showOnboarding,   setShowOnboarding]   = useState<boolean>(() => !localStorage.getItem(`${prefix}onboarded`));
  const [isLightMode,      setIsLightMode]      = useState<boolean>(() => safeLoad('neetpg_light_mode', false));

  // Tracks which tabs have ever been visited this session so lazy components
  // mount on first visit and stay mounted (state-preserving) on subsequent ones.
  const [visitedTabs, setVisitedTabs] = useState<Set<MainTab>>(() => new Set<MainTab>(['planner', 'schedule']));
  useEffect(() => {
    setVisitedTabs(prev => prev.has(activeTab) ? prev : new Set([...prev, activeTab]));
  }, [activeTab]);

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
      const { unlockAchievement } = appStore.getState();
      newly.forEach(a => {
        unlockAchievement(a.id, a.xpReward);
        setXpToasts(prev => [...prev, makeToastItem(a.xpReward, `${a.emoji} ${a.title}`)]);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }, { onConflict: 'user_id' }).then(({ error }) => {
      if (error) console.warn('[leaderboard] sync failed:', error.message);
    });
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
  useCloudSync('exam_date',       examDateIso as never, syncReady);

  // ── Theme ─────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('light', isLightMode);
    safeSave('neetpg_light_mode', isLightMode);
  }, [isLightMode]);

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
    appStore.getState().addBonusXP(amount);
    setXpToasts(prev => [...prev, makeToastItem(amount, label)]);
  }, [appStore]);

  const dismissToast = useCallback((id: number) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Study logic ───────────────────────────────────────────────
  const toggleDayCompletion = useCallback((day: number) => {
    const { completedDays: days, toggleDayCompletion: toggle, setStreak } = appStore.getState();
    const isCompleting = !days.includes(day);
    toggle(day);
    if (isCompleting) {
      gainXP(XP_VALUES.day_complete, `Day ${day} complete`);
      const today = new Date().toISOString().slice(0, 10);
      setStreak(s => {
        if (s.lastDate === today) return s;
        const prevDay = new Date(); prevDay.setDate(prevDay.getDate() - 1);
        const newCount = s.lastDate === prevDay.toISOString().slice(0, 10) ? s.count + 1 : 1;
        return { count: newCount, longest: Math.max(s.longest, newCount), lastDate: today };
      });
    }
  }, [appStore, gainXP]);

  const updateNote = useCallback((day: number, text: string) => {
    appStore.getState().updateNote(day, text);
  }, [appStore]);

  const saveMcqScore = useCallback((day: number, attempted: number, correct: number) => {
    const prev = mcqScores[day] ?? { attempted: 0, correct: 0 };
    const newCorrect = correct - (prev.correct ?? 0);
    const newWrong   = (attempted - correct) - (Math.max(0, (prev.attempted ?? 0) - (prev.correct ?? 0)));
    appStore.getState().saveMcqScore(day, attempted, correct);
    if (newCorrect > 0) gainXP(newCorrect * XP_VALUES.mcq_correct, 'MCQ correct');
    if (newWrong   > 0) gainXP(newWrong   * XP_VALUES.mcq_wrong,   'MCQ attempt');
  }, [appStore, mcqScores, gainXP]);

  const toggleFlag = useCallback((dayId: number, topicIdx: number) => {
    appStore.getState().toggleFlag(dayId, topicIdx);
  }, [appStore]);

  const updateSrCard = useCallback((dayId: number, card: SRCard) => {
    appStore.getState().updateSrCard(dayId, card);
  }, [appStore]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const raw = JSON.parse(ev.target!.result as string);
        if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
          alert('Invalid backup file: expected a JSON object.');
          return;
        }
        const data = raw as Record<string, unknown>;
        const keys = Object.keys(data);
        if (!keys.some(k => k.startsWith('neetpg_'))) {
          alert('Invalid backup file: no NEET PG study data found.');
          return;
        }
        keys.forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
        window.location.reload();
      } catch { alert('Invalid backup file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrillComplete = useCallback(() => {
    appStore.getState().incrementDrills();
    gainXP(XP_VALUES.drill_complete, 'Drill complete');
  }, [appStore, gainXP]);

  const handleRapidComplete = useCallback(() => {
    appStore.getState().incrementDrills();
    gainXP(XP_VALUES.rapid_complete, 'Rapid revision');
  }, [appStore, gainXP]);

  const handleSimComplete = useCallback(() => {
    appStore.getState().setSimCompleted(true);
    gainXP(XP_VALUES.simulation_complete, 'Exam simulation');
  }, [appStore, gainXP]);

  const handleExamDateSave = useCallback((date: Date) => {
    appStore.getState().setExamDateIso(date.toISOString());
  }, [appStore]);

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
              onSave={handleExamDateSave}
              isPostExam={isPostExam}
            />
          </div>
        </div>

        {/* PRACTICE group — lazy: JS chunk loads on first tab visit, stays mounted after */}
        <div hidden={activeGroup !== 'practice' || activeTab !== 'pyq'}>
          {visitedTabs.has('pyq') && <Suspense fallback={<TabFallback />}>
            <PYQBank onCorrect={handlePYQCorrect} onWrong={handlePYQWrong} />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'drills'}>
          {visitedTabs.has('drills') && <Suspense fallback={<TabFallback />}>
            <SubjectDrill onComplete={handleDrillComplete} />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'rapid'}>
          {visitedTabs.has('rapid') && <Suspense fallback={<TabFallback />}>
            <RapidRevision onComplete={handleRapidComplete} />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'oneliners'}>
          {visitedTabs.has('oneliners') && <Suspense fallback={<TabFallback />}>
            <OneLinerBank />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'simulation'}>
          {visitedTabs.has('simulation') && <Suspense fallback={<TabFallback />}>
            <ExamSimulation onComplete={handleSimComplete} />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'revision'}>
          <RevisionList
            flagged={flagged}
            onUnflag={toggleFlag}
            onGoToDay={(day) => { setSelectedDayId(day); setActiveGroup('home'); setActiveTab('planner'); }}
          />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'dailyquiz'}>
          {visitedTabs.has('dailyquiz') && <Suspense fallback={<TabFallback />}>
            <DailyQuiz />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'custommock'}>
          {visitedTabs.has('custommock') && <Suspense fallback={<TabFallback />}>
            <CustomMockGenerator />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'psmcalc'}>
          {visitedTabs.has('psmcalc') && <Suspense fallback={<TabFallback />}>
            <PSMCalculator />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'imagequiz'}>
          {visitedTabs.has('imagequiz') && <Suspense fallback={<TabFallback />}>
            <ImageBank />
          </Suspense>}
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
          {visitedTabs.has('pdf') && <Suspense fallback={<TabFallback />}>
            <PDFLearningExtractor />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'ai'}>
          {visitedTabs.has('ai') && <Suspense fallback={<TabFallback />}>
            <HighYieldReference />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'mnemonics'}>
          {visitedTabs.has('mnemonics') && <Suspense fallback={<TabFallback />}>
            <MnemonicsBank />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'analysis'}>
          {visitedTabs.has('analysis') && <Suspense fallback={<TabFallback />}>
            <NEETPGPaperAnalysis />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'flashcards'}>
          {visitedTabs.has('flashcards') && <Suspense fallback={<TabFallback />}>
            <FlashcardDeck />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'doctable'}>
          {visitedTabs.has('doctable') && <Suspense fallback={<TabFallback />}>
            <DOCTable />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'revschedule'}>
          {visitedTabs.has('revschedule') && <Suspense fallback={<TabFallback />}>
            <RevisionScheduler />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'learn' || activeTab !== 'mistakelogbook'}>
          {visitedTabs.has('mistakelogbook') && <Suspense fallback={<TabFallback />}>
            <MistakeLogbook />
          </Suspense>}
        </div>

        {/* INSIGHTS group */}
        <div hidden={activeGroup !== 'insights' || activeTab !== 'analytics'}>
          {visitedTabs.has('analytics') && <Suspense fallback={<TabFallback />}>
            <div className="flex flex-col gap-6">
              <AnalyticsPanel mcqScores={mcqScores} completedDays={completedDays} streak={streak} examDate={examDate} />
              <ErrorAnalysis mcqScores={mcqScores} />
            </div>
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'toppers'}>
          {visitedTabs.has('toppers') && <Suspense fallback={<TabFallback />}>
            <TopperInsights />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'resources'}>
          {visitedTabs.has('resources') && <Suspense fallback={<TabFallback />}>
            <ResourceHub />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'community'}>
          {visitedTabs.has('community') && <Suspense fallback={<TabFallback />}>
            <CommunityQA />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'weakheatmap'}>
          {visitedTabs.has('weakheatmap') && <Suspense fallback={<TabFallback />}>
            <WeakTopicHeatmap onGoToSubject={() => { setActiveGroup('practice'); setActiveTab('pyq'); }} />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'cutoffhistory'}>
          {visitedTabs.has('cutoffhistory') && <Suspense fallback={<TabFallback />}>
            <CutoffHistory />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'specialtyseats'}>
          {visitedTabs.has('specialtyseats') && <Suspense fallback={<TabFallback />}>
            <SpecialtySeatTracker />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'guidelines'}>
          {visitedTabs.has('guidelines') && <Suspense fallback={<TabFallback />}>
            <GuidelinesFeed />
          </Suspense>}
        </div>

        {/* REWARDS group */}
        <div hidden={activeGroup !== 'rewards'}>
          {visitedTabs.has('rewards') && <Suspense fallback={<TabFallback />}>
            <GamificationPanel
              xp={totalXP}
              unlockedIds={unlockedIds}
              completedDays={completedDays.length}
              streak={streak.longest}
              displayName={user?.email ?? 'Aspirant'}
            />
          </Suspense>}
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
