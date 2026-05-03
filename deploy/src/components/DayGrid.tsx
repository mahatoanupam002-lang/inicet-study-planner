import { Calendar, ListChecks, CheckCircle } from "lucide-react";
import { PHASES, SUBJECTS, DayEntry } from "@/data/schedule";

interface Props {
  schedule: DayEntry[];
  filteredSchedule: DayEntry[];
  completedDays: number[];
  notes: Record<number, string>;
  selectedDayId: number;
  onSelectDay: (day: number) => void;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export function DayGrid({
  schedule,
  filteredSchedule,
  completedDays,
  notes,
  selectedDayId,
  onSelectDay,
  selectedSubject,
  onSelectSubject,
}: Props) {
  const visibleDayIds = new Set(filteredSchedule.map(s => s.day));

  return (
    <div className="w-full lg:w-1/3 flex flex-col gap-6">
      {/* Subject Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
          <ListChecks className="w-3.5 h-3.5" /> Subject Filter
        </h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter days by subject">
          {SUBJECTS.map(subj => (
            <button
              key={subj}
              onClick={() => onSelectSubject(subj)}
              aria-pressed={selectedSubject === subj}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedSubject === subj
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* 28-Day Grid */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> 28-Day Grid
          </h3>
          <div className="flex gap-3 text-[10px] uppercase font-mono">
            {PHASES.map(p => (
              <div key={p.id} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2" role="grid" aria-label="28-day study plan">
          {[...schedule].reverse().map((day) => {
            const isSelected  = day.day === selectedDayId;
            const isCompleted = completedDays.includes(day.day);
            const hasNotes    = !!notes[day.day]?.trim();
            const isVisible   = visibleDayIds.has(day.day);

            return (
              <button
                key={day.day}
                onClick={() => onSelectDay(day.day)}
                role="gridcell"
                aria-label={`Day ${day.day}: ${day.focus}${isCompleted ? ' (completed)' : ''}`}
                aria-selected={isSelected}
                style={{
                  borderColor: isSelected ? day.color : isCompleted ? '#1f1f2e' : 'var(--border)',
                  backgroundColor: isSelected ? `${day.color}15` : isCompleted ? 'var(--card)' : 'transparent',
                  opacity: isVisible ? 1 : 0.2,
                  ...(isSelected && { '--tw-ring-color': day.color } as React.CSSProperties),
                }}
                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all duration-200 hover:brightness-125 ${
                  isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <span className={`text-sm font-mono font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>

                {isCompleted && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                )}

                {hasNotes && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
