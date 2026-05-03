import { useState } from "react";
import { Clock, ShieldAlert, CheckSquare, Square } from "lucide-react";
import { DAILY_BLOCKS } from "@/data/schedule";
import { safeLoad, safeSave } from "@/lib/storage";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadChecked(): Set<number> {
  const data = safeLoad<{ date: string; checked: number[] }>('inicet_daily_checklist', { date: '', checked: [] });
  if (data.date === getTodayKey()) return new Set(data.checked);
  return new Set(); // new day → fresh checklist
}

export function DailyScheduleView() {
  const [checked, setChecked] = useState<Set<number>>(loadChecked);

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      safeSave('inicet_daily_checklist', { date: getTodayKey(), checked: [...next] });
      return next;
    });
  };

  const pct = Math.round((checked.size / DAILY_BLOCKS.length) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-foreground">
              Today's Schedule
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-24 bg-background rounded-full overflow-hidden border border-border">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono text-muted-foreground">{checked.size}/{DAILY_BLOCKS.length}</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {DAILY_BLOCKS.map((block, i) => {
            const done = checked.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                aria-pressed={done}
                className={`w-full flex flex-col sm:flex-row sm:items-center p-4 hover:bg-muted/30 transition-colors text-left gap-3 ${done ? 'opacity-60' : ''}`}
              >
                {done
                  ? <CheckSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  : <Square     className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5 sm:mt-0" />
                }
                <div className="w-40 font-mono text-sm font-bold text-primary shrink-0">
                  {block.time}
                </div>
                <div className={`font-serif text-foreground/90 ${done ? 'line-through' : ''}`}>
                  {block.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
          <h3 className="font-mono text-destructive font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> NON-NEGOTIABLES
          </h3>
          <ul className="space-y-4 font-serif text-sm">
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> No new resources after Day 18</li>
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> 1 full mock required from Day 22</li>
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Skip question if &lt;60% confident</li>
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Anatomy/Physio via MCQs only</li>
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Sleep strictly at 10 PM on exam eve</li>
            <li className="flex gap-3"><span className="text-destructive font-bold block">•</span> Creatine 5g daily for cognitive stamina</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
