import { useState, useEffect, useMemo, useCallback, lazy, Suspense, type ChangeEvent } from "react";
import { useStore } from "zustand";
import type { User } from "@supabase/supabase-js";
import { Target } from "lucide-react";
import { Toaster, toast } from "sonner";

import { NAV_GROUPS, type NavGroup, type MainTab } from "@/lib/nav-config";
import { AppHeader, type TimeLeft } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import { CommandPalette } from "@/components/CommandPalette";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

import { SCHEDULE, EXAM_DATE } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";
import { SRCard } from "@/lib/sr";
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
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { XPToastLayer, makeToastItem, type XPToastItem } from "@/components/XPToast";
import { computeAdaptivePlan } from "@/lib/adaptive";
import { LoginPanel } from "@/components/LoginPanel";
import { useAuth } from "@/lib/auth";
import { useCloudSync } from "@/lib/cloud";
import { getAppStore, sel } from "@/lib/store";
import type { StreakData } from "@/lib/store";
import { computeBaseXP, XP_VALUES, getRank } from "@/lib/xp";
import { checkAchievements } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";

// ── Lazy-loaded tab components ────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mk = <T extends Record<string, unknown>>(fn: () => Promise<T>, name: keyof T) =>
  lazy(() => fn().then(m => ({ default: m[name] as any })));

const PYQBank             = mk(() => import("@/components/PYQBank"),             "PYQBank");
const SubjectDrill        = mk(() => import("@/components/SubjectDrill"),        "SubjectDrill");
const RapidRevision       = mk(() => import("@/components/RapidRevision"),       "RapidRevision");
const OneLinerBank        = mk(() => import("@/components/OneLinerBank"),        "OneLinerBank");
const ExamSimulation      = mk(() => import("@/components/ExamSimulation"),      "ExamSimulation");
const DailyQuiz           = mk(() => import("@/components/DailyQuiz"),           "DailyQuiz");
const AIPredictedQuiz     = mk(() => import("@/components/AIPredictedQuiz"),     "AIPredictedQuiz");
const CustomMockGenerator = mk(() => import("@/components/CustomMockGenerator"), "CustomMockGenerator");
const PSMCalculator       = mk(() => import("@/components/PSMCalculator"),       "PSMCalculator");
const ImageBank           = mk(() => import("@/components/ImageBank"),           "ImageBank");
const PDFLearningExtractor = mk(() => import("@/components/PDFLearningExtractor"), "PDFLearningExtractor");
const HighYieldReference  = mk(() => import("@/components/HighYieldReference"),  "HighYieldReference");
const MnemonicsBank       = mk(() => import("@/components/MnemonicsBank"),       "MnemonicsBank");
const NEETPGPaperAnalysis = mk(() => import("@/components/NEETPGPaperAnalysis"), "NEETPGPaperAnalysis");
const FlashcardDeck       = mk(() => import("@/components/FlashcardDeck"),       "FlashcardDeck");
const DOCTable            = mk(() => import("@/components/DOCTable"),            "DOCTable");
const RevisionScheduler   = mk(() => import("@/components/RevisionScheduler"),   "RevisionScheduler");
const MistakeLogbook      = mk(() => import("@/components/MistakeLogbook"),      "MistakeLogbook");
const AnalyticsPanel      = mk(() => import("@/components/AnalyticsPanel"),      "AnalyticsPanel");
const ErrorAnalysis       = mk(() => import("@/components/ErrorAnalysis"),       "ErrorAnalysis");
const TopperInsights      = mk(() => import("@/components/TopperInsights"),      "TopperInsights");
const ResourceHub         = mk(() => import("@/components/ResourceHub"),         "ResourceHub");
const CommunityQA         = mk(() => import("@/components/CommunityQA"),         "CommunityQA");
const WeakTopicHeatmap    = mk(() => import("@/components/WeakTopicHeatmap"),    "WeakTopicHeatmap");
const CutoffHistory       = mk(() => import("@/components/CutoffHistory"),       "CutoffHistory");
const SpecialtySeatTracker = mk(() => import("@/components/SpecialtySeatTracker"), "SpecialtySeatTracker");
const GuidelinesFeed      = mk(() => import("@/components/GuidelinesFeed"),      "GuidelinesFeed");
const GamificationPanel   = mk(() => import("@/components/GamificationPanel"),   "GamificationPanel");
const ChatPanel           = mk(() => import("@/components/ChatPanel"),           "ChatPanel");
const MicroBurst          = mk(() => import("@/components/MicroBurst"),          "MicroBurst");
const CircadianPlanner    = mk(() => import("@/components/CircadianPlanner"),    "CircadianPlanner");
const TopicPredictor      = mk(() => import("@/components/TopicPredictor"),      "TopicPredictor");
const StudyRooms          = mk(() => import("@/components/StudyRooms"),          "StudyRooms");
const BuddyMatch          = mk(() => import("@/components/BuddyMatch"),          "BuddyMatch");
const StressAdaptive      = mk(() => import("@/components/StressAdaptive"),      "StressAdaptive");

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function TabFallback() {
  return (
    <div className="flex items-center justify-center py-16" aria-label="Loading…">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden="true" />
        <span className="text-xs font-mono text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

// ── StudyApp ──────────────────────────────────────────────────────────────────

interface StudyAppProps {
  prefix: string;
  user: User | null;
  onSignOut: () => Promise<void>;
}

function StudyApp({ prefix, user, onSignOut }: StudyAppProps) {
  const appStore = getAppStore(prefix);

  // ── Persistent store ──────────────────────────────────────────────────────
  const completedDays   = useStore(appStore, sel.completedDays);
  const notes           = useStore(appStore, sel.notes);
  const mcqScores       = useStore(appStore, sel.mcqScores);
  const flagged         = useStore(appStore, sel.flagged);
  const srCards         = useStore(appStore, sel.srCards);
  const streak          = useStore(appStore, sel.streak);
  const examDateIso     = useStore(appStore, sel.examDateIso);
  const bonusXP         = useStore(appStore, sel.bonusXP);
  const unlockedIds     = useStore(appStore, sel.unlockedIds);
  const drillsCompleted = useStore(appStore, sel.drillsCompleted);
  const simCompleted    = useStore(appStore, sel.simCompleted);

  const examDate = useMemo(() => new Date(examDateIso), [examDateIso]);

  // ── Session-only state ────────────────────────────────────────────────────
  const [pyqAttempts, setPyqAttempts] = useState<Record<number, { selected: number; correct: boolean }>>(() =>
    safeLoad('neetpg_pyq_attempts', {})
  );
  const [xpToasts,      setXpToasts]      = useState<XPToastItem[]>([]);
  const [activeGroup,   setActiveGroup]   = useState<NavGroup>('home');
  const [activeTab,     setActiveTab]     = useState<MainTab>('planner');
  const [selectedSubject,  setSelectedSubject]  = useState<string>('All');
  const [selectedDayId,    setSelectedDayId]    = useState<number>(1);
  const [detailTab,        setDetailTab]        = useState<DetailTab>('TOPICS');
  const [timeLeft,         setTimeLeft]         = useState<TimeLeft>(() => calcTimeLeft(examDate));
  const [showOnboarding,   setShowOnboarding]   = useState<boolean>(() => !localStorage.getItem(`${prefix}onboarded`));
  const [isLightMode,      setIsLightMode]      = useState<boolean>(() => safeLoad('neetpg_light_mode', false));
  const [commandOpen,      setCommandOpen]      = useState(false);

  const [visitedTabs, setVisitedTabs] = useState<Set<MainTab>>(() => new Set<MainTab>(['planner', 'schedule']));
  useEffect(() => {
    setVisitedTabs(prev => prev.has(activeTab) ? prev : new Set([...prev, activeTab]));
  }, [activeTab]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const baseXP  = useMemo(
    () => computeBaseXP(completedDays, mcqScores, notes, streak),
    [completedDays, mcqScores, notes, streak]
  );
  const totalXP = baseXP + bonusXP;

  const examDateLabel = useMemo(() =>
    examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    [examDate]
  );

  const isPostExam   = examDate.getTime() <= Date.now();
  const studiedToday = streak.lastDate === new Date().toISOString().slice(0, 10);
  const userInitial  = user?.email?.[0]?.toUpperCase() ?? 'G';
  const userLabel    = user?.email ?? 'Guest';
  const flagBadge    = flagged.length || undefined;
  const selectedDay  = SCHEDULE.find(s => s.day === selectedDayId) ?? SCHEDULE[0];

  const adaptivePlan = useMemo(
    () => computeAdaptivePlan(mcqScores, completedDays),
    [mcqScores, completedDays]
  );

  const filteredSchedule = useMemo(() => {
    if (selectedSubject === 'All') return SCHEDULE;
    if (selectedSubject === 'Full Mock') return SCHEDULE.filter(s => s.phase === 'mock');
    return SCHEDULE.filter(s => s.subject === selectedSubject);
  }, [selectedSubject]);

  const studyContext = useMemo(() => ({
    completedDays,
    mcqScores,
    flaggedCount: flagged.length,
    currentDayFocus: selectedDay ? `Day ${selectedDay.day} — ${selectedDay.subject}: ${selectedDay.focus}` : '',
    examDate,
  }), [completedDays, mcqScores, flagged.length, selectedDay, examDate]);

  // ── Achievement check ─────────────────────────────────────────────────────
  useEffect(() => {
    const mcqCorrect   = Object.values(mcqScores).reduce((s, v) => s + (v.correct ?? 0), 0);
    const mcqAttempted = Object.values(mcqScores).reduce((s, v) => s + (v.attempted ?? 0), 0);
    const pyqAttempted = Object.values(pyqAttempts).length;
    const notesCount   = Object.values(notes).filter(n => n?.trim()).length;

    const newly = checkAchievements(
      { completedDays, streak, mcqCorrect, mcqAttempted, pyqAttempted, notesCount, drillsCompleted, simulationCompleted: simCompleted },
      totalXP, unlockedIds,
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

  // ── Leaderboard sync ──────────────────────────────────────────────────────
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

  // ── Cloud sync ────────────────────────────────────────────────────────────
  const syncReady = !!user;
  useCloudSync('completed_days', completedDays as never, syncReady);
  useCloudSync('notes',           notes        as never, syncReady);
  useCloudSync('mcq_scores',      mcqScores    as never, syncReady);
  useCloudSync('flagged',         flagged      as never, syncReady);
  useCloudSync('sr_cards',        srCards      as never, syncReady);
  useCloudSync('streak',          streak       as never, syncReady);
  useCloudSync('exam_date',       examDateIso  as never, syncReady);

  // ── Side-effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('light', isLightMode);
    safeSave('neetpg_light_mode', isLightMode);
  }, [isLightMode]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft(examDate)), 1000);
    return () => clearInterval(t);
  }, [examDate]);

  useEffect(() => {
    const handler = () => setPyqAttempts(safeLoad('neetpg_pyq_attempts', {}));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ── XP / study callbacks ──────────────────────────────────────────────────
  const gainXP = useCallback((amount: number, label: string) => {
    appStore.getState().addBonusXP(amount);
    setXpToasts(prev => [...prev, makeToastItem(amount, label)]);
  }, [appStore]);

  const dismissToast = useCallback((id: number) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);

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

  const updateNote    = useCallback((day: number, text: string) => appStore.getState().updateNote(day, text), [appStore]);
  const toggleFlag    = useCallback((dayId: number, topicIdx: number) => appStore.getState().toggleFlag(dayId, topicIdx), [appStore]);
  const updateSrCard  = useCallback((dayId: number, card: SRCard) => appStore.getState().updateSrCard(dayId, card), [appStore]);

  const saveMcqScore = useCallback((day: number, attempted: number, correct: number) => {
    const prev = mcqScores[day] ?? { attempted: 0, correct: 0 };
    const newCorrect = correct - (prev.correct ?? 0);
    const newWrong   = (attempted - correct) - Math.max(0, (prev.attempted ?? 0) - (prev.correct ?? 0));
    appStore.getState().saveMcqScore(day, attempted, correct);
    if (newCorrect > 0) gainXP(newCorrect * XP_VALUES.mcq_correct, 'MCQ correct');
    if (newWrong   > 0) gainXP(newWrong   * XP_VALUES.mcq_wrong,   'MCQ attempt');
  }, [appStore, mcqScores, gainXP]);

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const raw = JSON.parse(ev.target!.result as string);
        if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
          toast.error('Invalid backup file: expected a JSON object.');
          return;
        }
        const data = raw as Record<string, unknown>;
        if (!Object.keys(data).some(k => k.startsWith('neetpg_'))) {
          toast.error('Invalid backup: no NEET PG data found in this file.');
          return;
        }
        Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
        window.location.reload();
      } catch {
        toast.error('Could not parse backup file — make sure it\'s a valid JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDrillComplete  = useCallback(() => { appStore.getState().incrementDrills(); gainXP(XP_VALUES.drill_complete,       'Drill complete');    }, [appStore, gainXP]);
  const handleRapidComplete  = useCallback(() => { appStore.getState().incrementDrills(); gainXP(XP_VALUES.rapid_complete,       'Rapid revision');    }, [appStore, gainXP]);
  const handleSimComplete    = useCallback(() => { appStore.getState().setSimCompleted(true); gainXP(XP_VALUES.simulation_complete, 'Exam simulation'); }, [appStore, gainXP]);
  const handleExamDateSave   = useCallback((date: Date) => appStore.getState().setExamDateIso(date.toISOString()), [appStore]);
  const handlePYQCorrect     = useCallback(() => gainXP(XP_VALUES.pyq_correct, 'PYQ correct'), [gainXP]);
  const handlePYQWrong       = useCallback(() => gainXP(XP_VALUES.pyq_wrong,   'PYQ attempt'), [gainXP]);
  const handleAIChat         = useCallback(() => gainXP(XP_VALUES.ai_chat,     'AI tutor'),    [gainXP]);
  const handleOnboardingDone = () => { localStorage.setItem(`${prefix}onboarded`, '1'); setShowOnboarding(false); };

  // ── Nav helpers ───────────────────────────────────────────────────────────
  const handleGroupClick = (gid: NavGroup) => {
    setActiveGroup(gid);
    const group = NAV_GROUPS.find(g => g.id === gid);
    if (group?.tabs.length === 1) setActiveTab(group.tabs[0].id);
    else if (gid === 'home') setActiveTab('planner');
  };

  const handleNavigate = useCallback((group: NavGroup, tab: MainTab) => {
    setActiveGroup(group);
    setActiveTab(tab);
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useKeyboardShortcuts({
    onCommandPalette: () => setCommandOpen(true),
    onPrevDay: selectedDayId > 1 && activeGroup === 'home' && activeTab === 'planner'
      ? () => setSelectedDayId(d => d - 1) : undefined,
    onNextDay: selectedDayId < 28 && activeGroup === 'home' && activeTab === 'planner'
      ? () => setSelectedDayId(d => d + 1) : undefined,
  });

  return (
    <div className="h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
      <Toaster position="bottom-right" richColors />
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
      <XPToastLayer items={xpToasts} onDismiss={dismissToast} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={handleNavigate} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:font-mono focus:text-sm"
      >
        Skip to main content
      </a>

      <OfflineIndicator />

      <AppHeader
        totalXP={totalXP}
        streak={streak}
        timeLeft={timeLeft}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(m => !m)}
        studiedToday={studiedToday}
        userInitial={userInitial}
        userLabel={userLabel}
        hasUser={!!user}
        onSignOut={onSignOut}
        onGoToRewards={() => handleNavigate('rewards', 'rewards')}
        examDateLabel={examDateLabel}
        isPostExam={isPostExam}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <LoginPanel />

        <div className="pl-12 md:pl-0 flex flex-col flex-1 min-w-0 overflow-hidden">
          <AppNav
            activeGroup={activeGroup}
            activeTab={activeTab}
            flagBadge={flagBadge}
            completedCount={completedDays.length}
            totalDays={28}
            onGroupClick={handleGroupClick}
            onTabClick={setActiveTab}
            onExport={() => exportAllData(prefix)}
            onImport={handleImport}
            onSearchOpen={() => setCommandOpen(true)}
          />

          <main id="main-content" className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">

        {/* HOME — Planner */}
        <div hidden={activeGroup !== 'home' || activeTab !== 'planner'}>
          <div className="flex flex-col gap-6">
            <DailyBriefing
              completedDays={completedDays}
              mcqScores={mcqScores}
              streak={streak}
              examDate={examDate}
              onGoToTab={(tab) => setActiveTab(tab as MainTab)}
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
                onPrevDay={() => setSelectedDayId(d => d - 1)}
                onNextDay={() => setSelectedDayId(d => d + 1)}
                canGoPrev={selectedDayId > 1}
                canGoNext={selectedDayId < 28}
              />
            </div>
            <AdaptivePlanPanel
              mcqScores={mcqScores}
              completedDays={completedDays}
              onSelectDay={setSelectedDayId}
            />
          </div>
        </div>

        {/* HOME — Circadian Planner */}
        <div hidden={activeGroup !== 'home' || activeTab !== 'circadian'}>
          {visitedTabs.has('circadian') && <Suspense fallback={<TabFallback />}>
            <CircadianPlanner />
          </Suspense>}
        </div>

        {/* HOME — Stress / Wellbeing */}
        <div hidden={activeGroup !== 'home' || activeTab !== 'stress'}>
          {visitedTabs.has('stress') && <Suspense fallback={<TabFallback />}>
            <StressAdaptive />
          </Suspense>}
        </div>

        {/* HOME — Schedule */}
        <div hidden={activeGroup !== 'home' || activeTab !== 'schedule'}>
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <DailyScheduleView />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <MockScoreTracker />
              </div>
              <RankPredictor />
              <PomodoroTimer />
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

        {/* PRACTICE */}
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
            onGoToDay={(day) => { setSelectedDayId(day); handleNavigate('home', 'planner'); }}
          />
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'dailyquiz'}>
          {visitedTabs.has('dailyquiz') && <Suspense fallback={<TabFallback />}>
            <DailyQuiz />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'practice' || activeTab !== 'aiquiz'}>
          {visitedTabs.has('aiquiz') && <Suspense fallback={<TabFallback />}>
            <AIPredictedQuiz />
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
        <div hidden={activeGroup !== 'practice' || activeTab !== 'microburst'}>
          {visitedTabs.has('microburst') && <Suspense fallback={<TabFallback />}>
            <MicroBurst />
          </Suspense>}
        </div>

        {/* LEARN */}
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
        <div hidden={activeGroup !== 'learn' || activeTab !== 'aichat'}>
          {visitedTabs.has('aichat') && <Suspense fallback={<TabFallback />}>
            <ChatPanel studyContext={studyContext} onFirstMessage={handleAIChat} />
          </Suspense>}
        </div>

        {/* INSIGHTS */}
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
            <WeakTopicHeatmap onGoToSubject={() => handleNavigate('practice', 'pyq')} />
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
        <div hidden={activeGroup !== 'insights' || activeTab !== 'topicpredict'}>
          {visitedTabs.has('topicpredict') && <Suspense fallback={<TabFallback />}>
            <TopicPredictor />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'studyrooms'}>
          {visitedTabs.has('studyrooms') && <Suspense fallback={<TabFallback />}>
            <StudyRooms />
          </Suspense>}
        </div>
        <div hidden={activeGroup !== 'insights' || activeTab !== 'buddymatch'}>
          {visitedTabs.has('buddymatch') && <Suspense fallback={<TabFallback />}>
            <BuddyMatch />
          </Suspense>}
        </div>

        {/* REWARDS */}
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
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, loading, storagePrefix, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-destructive p-3 rounded-xl animate-pulse" aria-hidden="true">
            <Target className="w-8 h-8 text-destructive-foreground" />
          </div>
          <p className="text-sm font-mono text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <StudyApp
      key={storagePrefix}
      prefix={storagePrefix}
      user={user}
      onSignOut={signOut}
    />
  );
}
