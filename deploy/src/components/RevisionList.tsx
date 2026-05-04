import { Flag, X, BookOpen } from "lucide-react";
import { SCHEDULE } from "@/data/schedule";

export interface FlaggedTopic { dayId: number; topicIdx: number; }

interface Props {
  flagged: FlaggedTopic[];
  onUnflag: (dayId: number, topicIdx: number) => void;
  onGoToDay: (dayId: number) => void;
}

export function RevisionList({ flagged, onUnflag, onGoToDay }: Props) {
  if (flagged.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <Flag className="w-10 h-10 text-muted-foreground/30" />
        <p className="text-muted-foreground font-mono text-sm">No flagged topics yet.</p>
        <p className="text-muted-foreground/60 font-serif text-xs max-w-xs">
          Click the flag icon next to any topic bullet in the TOPICS tab to add it here for targeted revision.
        </p>
      </div>
    );
  }

  // Group by subject
  const groups: Record<string, { dayId: number; topicIdx: number; topic: string; subject: string; color: string }[]> = {};
  for (const f of flagged) {
    const day = SCHEDULE.find(d => d.day === f.dayId);
    if (!day) continue;
    const topic = day.topics[f.topicIdx];
    if (!topic) continue;
    if (!groups[day.subject]) groups[day.subject] = [];
    groups[day.subject].push({ dayId: f.dayId, topicIdx: f.topicIdx, topic, subject: day.subject, color: day.color });
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase text-muted-foreground flex items-center gap-2">
          <Flag className="w-4 h-4 text-orange-400" />
          Flagged for revision — {flagged.length} topic{flagged.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {Object.entries(groups).map(([subject, items]) => (
        <div key={subject} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: items[0].color }}
            />
            <span className="text-xs font-mono uppercase text-muted-foreground">{subject}</span>
          </div>
          <ul className="divide-y divide-border">
            {items.map(({ dayId, topicIdx, topic }) => (
              <li key={`${dayId}-${topicIdx}`} className="flex items-start gap-3 px-4 py-3 group hover:bg-muted/20 transition-colors">
                <button
                  onClick={() => { onGoToDay(dayId); }}
                  aria-label={`Go to Day ${dayId}`}
                  className="flex-shrink-0 mt-0.5 flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  D{dayId}
                </button>
                <p className="flex-1 font-serif text-sm text-foreground/90 leading-relaxed">{topic}</p>
                <button
                  onClick={() => onUnflag(dayId, topicIdx)}
                  aria-label="Remove flag"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
