import { Download } from "lucide-react";
import { SCHEDULE, DayEntry } from "@/data/schedule";

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

export function NotesView({ selectedDayId, selectedDay, onSelectDay, notes, onUpdateNote }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
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
