import { Clock, ShieldAlert } from "lucide-react";
import { DAILY_BLOCKS } from "@/data/schedule";

export function DailyScheduleView() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b border-border flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-foreground">
            Optimal Daily Routine
          </h2>
        </div>
        <div className="divide-y divide-border">
          {DAILY_BLOCKS.map((block, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-muted/30 transition-colors">
              <div className="w-40 font-mono text-sm font-bold text-primary mb-1 sm:mb-0 shrink-0">
                {block.time}
              </div>
              <div className="font-serif text-foreground/90">{block.label}</div>
            </div>
          ))}
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
