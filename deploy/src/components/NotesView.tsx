import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { SCHEDULE, DayEntry } from "@/data/schedule";
import { SRCard, sm2Update, isDue, daysUntilDue } from "@/lib/sr";

interface Props {
  selectedDayId: number;
  selectedDay: DayEntry;
  onSelectDay: (day: number) => void;
  notes: Record<number, string>;
  onUpdateNote: (day: number, text: string) => void;
  srCards: Record<number, SRCard>;
  onUpdateSrCard: (dayId: number, card: SRCard) => void;
}

function exportNotes(notes: Record<number, string>) {
  const lines = SCHEDULE
    .filter(day => notes[day.day]?.trim())
    .map(day => `=== Day ${day.day}: ${day.focus} ===\n${notes[day.day].trim()}`)
    .join('\n\n');
  if (!lines) return;
  const blob = new Blob([lines], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'inicet-notes.txt';
  a.click();
  URL.revokeObjectURL(url);
}

export function NotesView({ selectedDayId, selectedDay, onSelectDay, notes, onUpdateNote, srCards, onUpdateSrCard }: Props) {
  const [reviewIdx, setReviewIdx] = useState<number | null>(null);

  const dueQueue = SCHEDULE
    .filter(d => notes[d.day]?.trim() && isDue(srCards[d.day]))
    .map(d => d.day);

  const isInReviewMode = reviewIdx !== null;
  const reviewDayId    = isInReviewMode ? dueQueue[reviewIdx] : null;
  const reviewDay      = reviewDayId != null ? SCHEDULE.find(d => d.day === reviewDayId) : null;

  const startReview = () => { setReviewIdx(0); onSelectDay(dueQueue[0]); };

  const rateAndAdvance = (quality: number) => {
    if (reviewDayId == null) return;
    const existing = srCards[reviewDayId];
    const updated  = sm2Update(
      existing ?? { ef: 2.5, interval: 1, repetitions: 0, dueDate: new Date().toISOString().slice(0, 10) },
      quality,
    );
    onUpdateSrCard(reviewDayId, updated);
    const next = (reviewIdx ?? 0) + 1;
    if (next < dueQueue.length) { setReviewIdx(next); onSelectDay(dueQueue[next]); }
    else setReviewIdx(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
      {/* SM-2 due banner */}
      {dueQueue.length > 0 && !isInReviewMode && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex items-start gap-4 shrink-0">
          <RotateCcw className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-violet-400 uppercase mb-1">
              Spaced Repetition — {dueQueue.length} topic{dueQueue.length !== 1 ? 's' : ''} due today
            </p>
            <p className="text-sm text-foreground/70 truncate">
              {dueQueue.map(id => `Day ${id}`).join(' · ')}
            </p>
          </div>
          <button
            onClick={startReview}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-md transition-colors flex-shrink-0"
          >
            Start Review
          </button>
        </div>
      )}

      {/* Active review rating strip */}
      {isInReviewMode && reviewDay && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex items-center gap-3 shrink-0 flex-wrap">
          <RotateCcw className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="text-xs font-mono text-violet-400 flex-1 min-w-0">
            Day {reviewDay.day}: {reviewDay.focus}
            <span className="text-muted-foreground ml-2">({(reviewIdx ?? 0) + 1}/{dueQueue.length})</span>
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => rateAndAdvance(1)} className="px-3 py-1.5 bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs font-mono rounded-md">Forgot</button>
            <button onClick={() => rateAndAdvance(3)} className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-mono rounded-md">Hard</button>
            <button onClick={() => rateAndAdvance(5)} className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-mono rounded-md">Easy</button>
            <button onClick={() => setReviewIdx(null)} className="px-3 py-1.5 border border-border text-muted-foreground text-xs font-mono rounded-md hover:text-foreground">Done</button>
          </div>
        </div>
      )}

      {/* Day picker */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2 shrink-0">
        {SCHEDULE.map(day => {
          const hasNotes = !!notes[day.day]?.trim();
          const isActive = selectedDayId === day.day;
          const card     = srCards[day.day];
          const due      = hasNotes && isDue(card);
          const dl       = hasNotes && card ? daysUntilDue(card) : null;
          return (
            <button
              key={day.day}
              onClick={() => onSelectDay(day.day)}
              aria-label={`Day ${day.day}${hasNotes ? ' (has notes)' : ''}`}
              aria-pressed={isActive}
              title={dl !== null ? `Review in ${dl}d` : undefined}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors flex items-center gap-2 ${
                isActive   ? 'bg-primary text-primary-foreground border-primary'
                : due      ? 'bg-violet-500/10 text-violet-300 border-violet-500/40'
                : hasNotes ? 'bg-accent text-accent-foreground border-border'
                           : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
              }`}
            >
              Day {day.day}
              {hasNotes && (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-foreground' : due ? 'bg-violet-400' : 'bg-primary'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: selectedDay.color }} />
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg" style={{ color: selectedDay.color }}>DAY {selectedDay.day}</span>
            <span className="font-serif text-foreground/80 hidden sm:inline">— {selectedDay.focus}</span>
            {srCards[selectedDayId] && !isDue(srCards[selectedDayId]) && (
              <span className="text-[10px] font-mono text-violet-400/60 hidden md:inline">
                review in {daysUntilDue(srCards[selectedDayId])}d
              </span>
            )}
          </div>
          <button
            onClick={() => exportNotes(notes)}
            title="Export all notes as .txt"
            aria-label="Export all notes as text file"
            className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-transparent hover:border-border"
          >
            <Download className="w-3.5 h-3.5" /> Export notes
          </button>
        </div>
        <textarea
          className="w-full flex-1 bg-background p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-muted-foreground/30 leading-relaxed"
          placeholder={`No notes for Day ${selectedDay.day} yet. Use this space for high-yield pointers, missed MCQs, or memory hooks...`}
          value={notes[selectedDayId] || ''}
          onChange={(e) => onUpdateNote(selectedDayId, e.target.value)}
        />
      </div>
    </div>
  );
}
