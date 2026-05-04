import { Download, RotateCcw } from "lucide-react";
import { SCHEDULE, DayEntry } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";

interface Props {
  selectedDayId: number;
  selectedDay: DayEntry;
  onSelectDay: (day: number) => void;
  notes: Record<number, string>;
  onUpdateNote: (day: number, text: string) => void;
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

function getDismissedKey() {
  return `inicet_sr_dismissed_${new Date().toISOString().slice(0, 10)}`;
}

function getSpacedRepetitionDay(completedDays: number[]): number | null {
  // Surface notes from the day completed closest to 7 days ago
  const target = completedDays.find(d => {
    const dismissed: number[] = safeLoad(getDismissedKey(), []);
    return !dismissed.includes(d);
  });
  return target ?? null;
}

export function NotesView({ selectedDayId, selectedDay, onSelectDay, notes, onUpdateNote }: Props) {
  // Derive completed days from notes (days that have notes = likely studied)
  const daysWithNotes = SCHEDULE.filter(d => notes[d.day]?.trim()).map(d => d.day);
  const srDay = daysWithNotes.length > 0 ? daysWithNotes[Math.floor(daysWithNotes.length / 2)] : null;
  const srDayEntry = srDay ? SCHEDULE.find(d => d.day === srDay) : null;
  const dismissed: number[] = safeLoad(getDismissedKey(), []);
  const showSr = srDay !== null && notes[srDay]?.trim() && !dismissed.includes(srDay);

  const dismissSr = () => {
    if (srDay === null) return;
    safeSave(getDismissedKey(), [...dismissed, srDay]);
    // Force re-render by navigating away and back — use a simple trick
    onSelectDay(selectedDayId);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
      {/* Spaced repetition banner */}
      {showSr && srDayEntry && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 flex items-start gap-4 shrink-0">
          <RotateCcw className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-violet-400 uppercase mb-1">Spaced Repetition — Review Now</p>
            <p className="text-sm font-serif text-foreground/90 truncate">
              Day {srDayEntry.day}: {srDayEntry.focus}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notes[srDay!]?.slice(0, 120)}…</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onSelectDay(srDayEntry.day)}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-md transition-colors"
            >
              Review
            </button>
            <button
              onClick={dismissSr}
              className="px-3 py-1.5 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* Day picker */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-2 shrink-0">
        {SCHEDULE.map(day => {
          const hasNotes  = !!notes[day.day]?.trim();
          const isActive  = selectedDayId === day.day;
          return (
            <button
              key={day.day}
              onClick={() => onSelectDay(day.day)}
              aria-label={`Day ${day.day}${hasNotes ? ' (has notes)' : ''}`}
              aria-pressed={isActive}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : hasNotes
                  ? 'bg-accent text-accent-foreground border-border'
                  : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
              }`}
            >
              Day {day.day}
              {hasNotes && (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-foreground' : 'bg-primary'}`} />
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
            <span className="font-mono font-bold text-lg" style={{ color: selectedDay.color }}>
              DAY {selectedDay.day}
            </span>
            <span className="font-serif text-foreground/80 hidden sm:inline">— {selectedDay.focus}</span>
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
