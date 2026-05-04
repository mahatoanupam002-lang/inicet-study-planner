import { useState, useEffect, useMemo, useRef } from "react";
import { Target, Calendar, Clock, StickyNote, Flag, Bot, Flame, Download, Upload } from "lucide-react";
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

type MainTab = 'planner' | 'schedule' | 'notes' | 'revision' | 'ai';

interface TimeLeft   { days: number; hours: number; minutes: number; seconds: number; }
interface StreakData  { count: number; longest: number; lastDate: string; }

function calcTimeLeft(): TimeLeft {
  const distance = EXAM_DATE.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

function exportAllData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('inicet_'));
  const data: Record<string, unknown> = {};
  keys.forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(k)!); }
    catch { data[k] = localStorage.getItem(k); }
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `inicet-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [completedDays, setCompletedDays] = useState<number[]>(() =>
    safeLoad<number[]>('inicet_completed_days', [])
  );
  const [notes, setNotes] = useState<Record<number, string>>(() =>
    safeLoad<Record<number, string>>('inicet_notes', {})
  );
  const [mcqScores, setMcqScores] = useState<Record<number, { attempted: number; correct: number }>>(() =>
    safeLoad('inicet_mcq_scores', {})
  );
  const [flagged, setFlagged] = useState<FlaggedTopic[]>(() =>
    safeLoad('inicet_flagged', [])
  );
  const [srCards, setSrCards] = useState<Record<number, SRCard>>(() =>
    safeLoad('inicet_sr_cards', {})
  );
  const [streak, setStreak] = useState<StreakData>(() =>
    safeLoad('inicet_streak', { count: 0, longest: 0, lastDate: '' })
  );
  const [activeTab,       setActiveTab]       = useState<MainTab>('planner');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDayId,   setSelectedDayId]   = useState<number>(1);
  const [detailTab,       setDetailTab]       = useState<DetailTab>('TOPICS');
  const [timeLeft,        setTimeLeft]        = useState<TimeLeft>(calcTimeLeft);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => { safeSave('inicet_completed_days', completedDays); }, [completedDays]);
  useEffect(() => { safeSave('inicet_notes', notes); },                 [notes]);
  useEffect(() => { safeSave('inicet_mcq_scores', mcqScores); },       [mcqScores]);
  useEffect(() => { safeSave('inicet_flagged', flagged); },             [flagged]);
  useEffect(() => { safeSave('inicet_sr_cards', srCards); },            [srCards]);
  useEffect(() => { safeSave('inicet_streak', streak); },               [streak]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDayCompletion = (day: number) => {
    const isCompleting = !completedDays.includes(day);
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
    if (isCompleting) {
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

  const saveMcqScore = (day: number, attempted: number, correct: number) =>
    setMcqScores(prev => ({ ...prev, [day]: { attempted, correct } }));

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

  const filteredSchedule = useMemo(() => {
    if (selectedSubject === 'All') return SCHEDULE;
    if (selectedSubject === 'Full Mock') return SCHEDULE.filter(s => s.phase === 'mock');
    return SCHEDULE.filter(s => s.subject === selectedSubject);
  }, [selectedSubject]);

  const selectedDay   = SCHEDULE.find(s => s.day === selectedDayId) ?? SCHEDULE[0];
  const studiedToday  = streak.lastDate === new Date().toISOString().slice(0, 10);

  const NAV_TABS: { id: MainTab; label: string; Icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'planner',  label: 'Planner',  Icon: Calendar                               },
    { id: 'schedule', label: 'Schedule', Icon: Clock                                  },
    { id: 'notes',    label: 'Notes',    Icon: StickyNote                             },
    { id: 'revision', label: 'Revision', Icon: Flag, badge: flagged.length || undefined },
    { id: 'ai',       label: 'AI Tutor', Icon: Bot                                    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <StudyReminderBanner studiedToday={studiedToday} />
        <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-destructive p-2 rounded-md shrink-0">
              <Target className="w-5 h-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold uppercase tracking-wider text-primary leading-none">INI-CET War Plan</h1>
              <p className="text-[10px] text-muted-foreground font-mono">MAY 16, 2026 // COMMAND CENTER</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
            <StudyReminderBell studiedToday={studiedToday} />
          </div>
        </div>
      </header>

      {/* Nav + Progress */}
      <div className="px-4 md:px-6 py-3 border-b border-border/50 bg-background flex flex-col md:flex-row justify-between items-center gap-3">
        <nav
          className="flex bg-card p-1 rounded-lg border border-border w-full md:w-auto overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Main sections"
        >
          {NAV_TABS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`main-panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={`flex-shrink-0 md:flex-none px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 relative ${
                activeTab === id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {badge ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center">
                  {badge > 99 ? '99' : badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
            {completedDays.length}/28
          </div>
          <div
            className="h-2 flex-1 md:w-40 bg-card rounded-full overflow-hidden border border-border"
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
          {/* Backup/restore */}
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={exportAllData}
            title="Export backup"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => importRef.current?.click()}
            title="Import backup"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">

        <div id="main-panel-planner" role="tabpanel" aria-label="Planner" hidden={activeTab !== 'planner'}>
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
        </div>

        <div id="main-panel-schedule" role="tabpanel" aria-label="Daily Schedule" hidden={activeTab !== 'schedule'}>
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <DailyScheduleView />
            <div className="bg-card border border-border rounded-xl p-6">
              <MockScoreTracker />
            </div>
          </div>
        </div>

        <div id="main-panel-notes" role="tabpanel" aria-label="My Notes" hidden={activeTab !== 'notes'}>
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

        <div id="main-panel-revision" role="tabpanel" aria-label="Revision List" hidden={activeTab !== 'revision'}>
          <RevisionList
            flagged={flagged}
            onUnflag={toggleFlag}
            onGoToDay={(day) => { setSelectedDayId(day); setActiveTab('planner'); }}
          />
        </div>

        <div id="main-panel-ai" role="tabpanel" aria-label="AI Tutor" hidden={activeTab !== 'ai'}>
          <ChatPanel />
        </div>

      </main>
    </div>
  );
}
