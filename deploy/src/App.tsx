import { useState, useEffect, useMemo } from "react";
import { Target, Calendar, Clock, StickyNote, Flag } from "lucide-react";
import { EXAM_DATE, SCHEDULE } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DayGrid } from "@/components/DayGrid";
import { DayDetail, DetailTab } from "@/components/DayDetail";
import { DailyScheduleView } from "@/components/DailyScheduleView";
import { NotesView } from "@/components/NotesView";
import { RevisionList, FlaggedTopic } from "@/components/RevisionList";

type MainTab = 'planner' | 'schedule' | 'notes' | 'revision';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

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
  const [activeTab,      setActiveTab]      = useState<MainTab>('planner');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDayId,  setSelectedDayId]  = useState<number>(1);
  const [detailTab,      setDetailTab]      = useState<DetailTab>('TOPICS');
  const [timeLeft,       setTimeLeft]       = useState<TimeLeft>(calcTimeLeft);

  useEffect(() => { safeSave('inicet_completed_days', completedDays); }, [completedDays]);
  useEffect(() => { safeSave('inicet_notes', notes); }, [notes]);
  useEffect(() => { safeSave('inicet_mcq_scores', mcqScores); }, [mcqScores]);
  useEffect(() => { safeSave('inicet_flagged', flagged); }, [flagged]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDayCompletion = (day: number) =>
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );

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

  const filteredSchedule = useMemo(() => {
    if (selectedSubject === 'All') return SCHEDULE;
    if (selectedSubject === 'Full Mock') return SCHEDULE.filter(s => s.phase === 'mock');
    return SCHEDULE.filter(s => s.subject === selectedSubject);
  }, [selectedSubject]);

  const selectedDay = SCHEDULE.find(s => s.day === selectedDayId) ?? SCHEDULE[0];

  const NAV_TABS: { id: MainTab; label: string; Icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'planner',  label: 'Planner',       Icon: Calendar                              },
    { id: 'schedule', label: 'Schedule',       Icon: Clock                                 },
    { id: 'notes',    label: 'Notes',          Icon: StickyNote                            },
    { id: 'revision', label: 'Revision',       Icon: Flag, badge: flagged.length || undefined },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card p-4 md:p-6 sticky top-0 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-destructive p-2 rounded-md">
            <Target className="w-6 h-6 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-primary">INI-CET War Plan</h1>
            <p className="text-xs text-muted-foreground font-mono">MAY 16, 2026 // COMMAND CENTER</p>
          </div>
        </div>
        <CountdownTimer timeLeft={timeLeft} />
      </header>

      {/* Nav + Progress */}
      <div className="px-4 md:px-6 py-4 border-b border-border/50 bg-background flex flex-col md:flex-row justify-between items-center gap-4">
        <nav
          className="flex bg-card p-1 rounded-lg border border-border w-full md:w-auto"
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
              className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 relative ${
                activeTab === id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
              {badge ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center">
                  {badge > 99 ? '99' : badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
            PROGRESS: {completedDays.length}/28 DAYS
          </div>
          <div
            className="h-2 w-full md:w-48 bg-card rounded-full overflow-hidden border border-border"
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
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">

        <div
          id="main-panel-planner"
          role="tabpanel"
          aria-label="Planner"
          hidden={activeTab !== 'planner'}
        >
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

        <div
          id="main-panel-schedule"
          role="tabpanel"
          aria-label="Daily Schedule"
          hidden={activeTab !== 'schedule'}
        >
          <DailyScheduleView />
        </div>

        <div
          id="main-panel-notes"
          role="tabpanel"
          aria-label="My Notes"
          hidden={activeTab !== 'notes'}
        >
          <NotesView
            selectedDayId={selectedDayId}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDayId}
            notes={notes}
            onUpdateNote={updateNote}
          />
        </div>

        <div
          id="main-panel-revision"
          role="tabpanel"
          aria-label="Revision List"
          hidden={activeTab !== 'revision'}
        >
          <RevisionList
            flagged={flagged}
            onUnflag={toggleFlag}
            onGoToDay={(day) => { setSelectedDayId(day); setActiveTab('planner'); }}
          />
        </div>

      </main>
    </div>
  );
}
