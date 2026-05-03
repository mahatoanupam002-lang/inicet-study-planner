import { useState, useEffect } from "react";
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight, BookOpen,
  Flag, Target, Crosshair, AlertTriangle, Save,
} from "lucide-react";
import { PHASES, DayEntry } from "@/data/schedule";
import { McqChart, McqScore } from "@/components/McqChart";
import type { FlaggedTopic } from "@/components/RevisionList";

export type DetailTab = 'TOPICS' | 'INDIA' | 'IMAGES' | 'MCQ' | 'NOTE';

interface Props {
  day: DayEntry;
  detailTab: DetailTab;
  onSetDetailTab: (tab: DetailTab) => void;
  completedDays: number[];
  onToggleCompletion: (day: number) => void;
  notes: Record<number, string>;
  onUpdateNote: (day: number, text: string) => void;
  mcqScores: Record<number, McqScore>;
  onSaveMcqScore: (day: number, attempted: number, correct: number) => void;
  onSelectDay: (day: number) => void;
  flagged: FlaggedTopic[];
  onToggleFlag: (dayId: number, topicIdx: number) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const DETAIL_TABS: DetailTab[] = ['TOPICS', 'INDIA', 'IMAGES', 'MCQ', 'NOTE'];

export function DayDetail({
  day,
  detailTab,
  onSetDetailTab,
  completedDays,
  onToggleCompletion,
  notes,
  onUpdateNote,
  mcqScores,
  onSaveMcqScore,
  onSelectDay,
  flagged,
  onToggleFlag,
  onPrevDay,
  onNextDay,
  canGoPrev,
  canGoNext,
}: Props) {
  const existing = mcqScores[day.day];
  const [attempted, setAttempted] = useState(existing?.attempted.toString() ?? '');
  const [correct,   setCorrect]   = useState(existing?.correct.toString()   ?? '');

  // sync inputs when day changes
  useEffect(() => {
    const s = mcqScores[day.day];
    setAttempted(s?.attempted.toString() ?? '');
    setCorrect(s?.correct.toString()   ?? '');
  }, [day.day, mcqScores]);

  const accuracy = (() => {
    const a = parseInt(attempted), c = parseInt(correct);
    if (!a || !c || a === 0) return null;
    return Math.round((c / a) * 100);
  })();

  const accuracyColor =
    accuracy === null ? 'text-muted-foreground' :
    accuracy >= 80    ? 'text-emerald-400' :
    accuracy >= 60    ? 'text-yellow-400'  : 'text-destructive';

  const handleSave = () => {
    const a = parseInt(attempted), c = parseInt(correct);
    if (a > 0 && c >= 0 && c <= a) onSaveMcqScore(day.day, a, c);
  };
  const isCompleted = completedDays.includes(day.day);
  const phase = PHASES.find(p => p.id === day.phase);

  return (
    <div className="w-full lg:w-2/3 flex flex-col h-full min-h-[600px]">
      <div className="bg-card border border-border rounded-xl flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: day.color }} />

        {/* Header */}
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-background border border-border font-mono">
              <span className="text-xs text-muted-foreground">DAY</span>
              <span className="text-xl font-bold" style={{ color: day.color }}>{day.day}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm"
                  style={{ backgroundColor: `${day.color}20`, color: day.color, border: `1px solid ${day.color}40` }}
                >
                  {phase?.label}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{day.subject}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground font-serif tracking-tight">{day.focus}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <button
                onClick={onPrevDay}
                disabled={!canGoPrev}
                aria-label="Previous day"
                className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNextDay}
                disabled={!canGoNext}
                aria-label="Next day"
                className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onToggleCompletion(day.day)}
              aria-pressed={isCompleted}
              className={`px-4 py-2 rounded-md font-mono text-xs uppercase font-bold flex items-center gap-2 transition-colors ${
                isCompleted
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-foreground hover:bg-muted'
              }`}
            >
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              {isCompleted ? 'Completed' : 'Mark Done'}
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-muted/30 border-b border-border flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5" /> Source: {day.marrow}
        </div>

        {/* Inner Tabs */}
        <div
          className="flex border-b border-border overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Day detail sections"
        >
          {DETAIL_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={detailTab === tab}
              aria-controls={`tabpanel-${tab}`}
              onClick={() => onSetDetailTab(tab)}
              className={`px-6 py-3 text-sm font-mono tracking-wider transition-colors whitespace-nowrap relative ${
                detailTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {detailTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: day.color }} />
              )}
              {tab === 'INDIA'  && <Flag   className="w-3 h-3 inline mr-2 text-orange-400" />}
              {tab === 'IMAGES' && <Target className="w-3 h-3 inline mr-2 text-blue-400" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">

          <div
            id="tabpanel-TOPICS"
            role="tabpanel"
            aria-label="Topics"
            hidden={detailTab !== 'TOPICS'}
          >
            <div className="space-y-4">
              {day.topics.map((topic, idx) => {
                const isFlagged = flagged.some(f => f.dayId === day.day && f.topicIdx === idx);
                return (
                  <div key={idx} className="flex gap-3 group">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center font-mono text-sm font-bold mt-0.5"
                      style={{ color: day.color }}
                    >
                      {idx + 1}
                    </div>
                    <div className={`flex-1 bg-background border rounded-lg p-4 transition-colors font-serif leading-relaxed text-foreground/90 ${isFlagged ? 'border-orange-500/50 bg-orange-500/5' : 'border-border group-hover:border-muted-foreground'}`}>
                      {topic}
                    </div>
                    <button
                      onClick={() => onToggleFlag(day.day, idx)}
                      aria-label={isFlagged ? 'Remove flag' : 'Flag for revision'}
                      aria-pressed={isFlagged}
                      className={`flex-shrink-0 mt-1 p-1.5 rounded-md transition-colors ${isFlagged ? 'text-orange-400' : 'text-muted-foreground/30 hover:text-orange-400 opacity-0 group-hover:opacity-100'}`}
                    >
                      <Flag className="w-4 h-4" fill={isFlagged ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            id="tabpanel-INDIA"
            role="tabpanel"
            aria-label="India-specific content"
            hidden={detailTab !== 'INDIA'}
          >
            <div className="h-full flex flex-col">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 relative overflow-hidden flex-1">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-400 font-mono tracking-wide">AIIMS EDGE: INDIA-SPECIFIC</h3>
                </div>
                <div className="font-serif text-lg leading-relaxed text-foreground/90 p-4 bg-background/50 rounded-lg border border-border/50 shadow-inner">
                  {day.india}
                </div>
                <div className="mt-6 flex items-start gap-3 text-sm text-orange-300/70 bg-orange-500/5 p-3 rounded-md border border-orange-500/10">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>These statistics and guidelines are frequently tested directly. Memorize exact values.</p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="tabpanel-IMAGES"
            role="tabpanel"
            aria-label="Image review targets"
            hidden={detailTab !== 'IMAGES'}
          >
            <div className="h-full flex flex-col">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 relative flex-1">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-400 font-mono tracking-wide">IMAGE REVIEW TARGETS</h3>
                </div>
                <div className="font-serif text-lg leading-relaxed text-foreground/90 p-4 bg-background/50 rounded-lg border border-border/50">
                  {day.images}
                </div>
              </div>
            </div>
          </div>

          <div
            id="tabpanel-MCQ"
            role="tabpanel"
            aria-label="Daily MCQ mission"
            hidden={detailTab !== 'MCQ'}
          >
            <div className="flex flex-col gap-4">
              {/* Target */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-500 p-1.5 rounded-md">
                    <Crosshair className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-400 font-mono tracking-wide">TODAY'S TARGET</h3>
                </div>
                <p className="font-serif text-base text-foreground">{day.mcq}</p>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[["#22c55e", "+1", "Correct"], ["#ef4444", "−0.33", "Wrong"], ["hsl(var(--muted-foreground))", "0", "Skip"]].map(([color, val, lbl]) => (
                    <div key={lbl} className="bg-background border border-border p-3 rounded-lg text-center">
                      <span className="block text-xl font-mono font-bold" style={{ color }}>{val}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono">{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score logger */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3">Log today's score</h3>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Attempted</label>
                    <input
                      type="number" min="0" max="300"
                      value={attempted}
                      onChange={e => setAttempted(e.target.value)}
                      placeholder="e.g. 40"
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Correct</label>
                    <input
                      type="number" min="0" max="300"
                      value={correct}
                      onChange={e => setCorrect(e.target.value)}
                      placeholder="e.g. 34"
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 min-w-[64px]">
                    <span className={`text-2xl font-mono font-bold ${accuracyColor}`}>
                      {accuracy !== null ? `${accuracy}%` : '—'}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">accuracy</span>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={!attempted || !correct}
                    aria-label="Save MCQ score"
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono rounded-md transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>

              {/* Accuracy chart */}
              <McqChart scores={mcqScores} activeDayId={day.day} onSelectDay={onSelectDay} />
            </div>
          </div>

          <div
            id="tabpanel-NOTE"
            role="tabpanel"
            aria-label="Personal notes"
            hidden={detailTab !== 'NOTE'}
            className="h-full flex flex-col"
          >
            <textarea
              className="w-full flex-1 bg-background border border-border rounded-xl p-4 font-mono text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-muted-foreground/50"
              placeholder="Write your high-yield points, memory hooks, or weak areas here..."
              value={notes[day.day] || ''}
              onChange={(e) => onUpdateNote(day.day, e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs font-mono text-muted-foreground">
                {notes[day.day]?.length ?? 0} characters (Auto-saved)
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
