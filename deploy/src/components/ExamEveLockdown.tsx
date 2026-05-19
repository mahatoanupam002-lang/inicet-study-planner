import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, BookOpen, Brain, Moon, Coffee, ChevronDown, ChevronUp, X } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

interface Props {
  examDate: Date;
  onDismiss?: () => void;
}

interface CheckItem { id: string; label: string; done: boolean; }

const CHECKLIST_KEY = "neetpg_exam_eve_checklist";

const DEFAULT_CHECKLIST: CheckItem[] = [
  { id: "admit",    label: "Admit card printed / downloaded",                    done: false },
  { id: "id",       label: "Original ID proof kept ready",                       done: false },
  { id: "venue",    label: "Exam venue route confirmed",                         done: false },
  { id: "sleep",    label: "Sleep by 10 PM tonight",                            done: false },
  { id: "meal",     label: "Light dinner, no heavy food tonight",                done: false },
  { id: "alarm",    label: "Alarm set 2h before exam",                           done: false },
  { id: "review",   label: "Reviewed high-yield one-liners (30 min only)",       done: false },
  { id: "relax",    label: "10 min deep breathing / relaxation done",            done: false },
  { id: "noNew",    label: "No new topics studied today",                        done: false },
  { id: "phone",    label: "Phone charged, silent mode enabled",                 done: false },
];

const LAST_MINUTE_TIPS = [
  "Trust your preparation — you have done the work.",
  "Read each question TWICE before marking. Speed kills in NEET PG.",
  "Mark & skip if confused. Come back later. Never get stuck.",
  "Negative marking: skip if <40% confident. Attempt if >60% sure.",
  "First instinct is usually right — don't second-guess unless you spot a keyword you missed.",
  "Clinical questions: think 'most common', 'most appropriate', 'first-line'.",
  "If two options look right, pick the one with the specific mechanism/drug.",
  "High-yield: Medicine > Surgery > OBG > Paediatrics > Pharmacology.",
  "Don't check answers mid-exam. Focus only on the current question.",
  "You've solved hundreds of MCQs. This is just another session.",
];

export function ExamEveLockdown({ examDate, onDismiss }: Props) {
  const hoursToExam = (examDate.getTime() - Date.now()) / (1000 * 60 * 60);
  const isExamDay   = hoursToExam >= 0 && hoursToExam < 24;
  const isEveNight  = hoursToExam >= 0 && hoursToExam < 36;

  const [checklist, setChecklist] = useState<CheckItem[]>(() =>
    safeLoad<CheckItem[]>(CHECKLIST_KEY, DEFAULT_CHECKLIST)
  );
  const [expanded, setExpanded] = useState(true);
  const [tipIdx,   setTipIdx]   = useState(0);
  const [dismissed, setDismissed] = useState<boolean>(() =>
    safeLoad<boolean>("neetpg_exam_eve_dismissed", false)
  );

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % LAST_MINUTE_TIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const toggleItem = (id: string) => {
    setChecklist(prev => {
      const next = prev.map(c => c.id === id ? { ...c, done: !c.done } : c);
      safeSave(CHECKLIST_KEY, next);
      return next;
    });
  };

  const handleDismiss = () => {
    safeSave("neetpg_exam_eve_dismissed", true);
    setDismissed(true);
    onDismiss?.();
  };

  if (!isEveNight || dismissed) return null;

  const doneCount = checklist.filter(c => c.done).length;
  const total     = checklist.length;
  const pct       = Math.round((doneCount / total) * 100);

  return (
    <div className={`border rounded-xl overflow-hidden ${
      isExamDay
        ? "border-red-500/40 bg-red-500/5"
        : "border-amber-500/40 bg-amber-500/5"
    }`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${isExamDay ? "bg-red-500/20" : "bg-amber-500/20"}`}>
            <AlertTriangle className={`w-4 h-4 ${isExamDay ? "text-red-400" : "text-amber-400"}`} />
          </div>
          <div>
            <p className={`text-sm font-mono font-bold ${isExamDay ? "text-red-400" : "text-amber-400"}`}>
              {isExamDay ? "EXAM DAY — Calm & Ready" : "Exam Eve Lock-down Mode"}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">
              {isExamDay
                ? `Exam in ${Math.round(hoursToExam)}h`
                : `${Math.round(hoursToExam)}h to exam · Checklist ${doneCount}/${total}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleDismiss(); }}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Rotating tip */}
          <div className="bg-background/50 border border-border rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
              Exam strategy tip
            </p>
            <p className="text-xs font-mono text-foreground/80 leading-relaxed">
              {LAST_MINUTE_TIPS[tipIdx]}
            </p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Pre-exam checklist
              </p>
              <span className={`text-xs font-mono font-bold ${pct === 100 ? "text-emerald-400" : "text-amber-400"}`}>
                {doneCount}/{total}
              </span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {checklist.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors text-xs font-mono ${
                  item.done
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-background border-border text-muted-foreground hover:border-amber-500/40 hover:text-foreground"
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${item.done ? "text-emerald-400" : "text-muted-foreground/40"}`} />
                {item.label}
              </button>
            ))}
          </div>

          {/* What to do / not do */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> DO tonight
              </p>
              <ul className="space-y-1">
                {[
                  "Skim flagged one-liners (30 min max)",
                  "Light walk, hydrate well",
                  "Prepare clothes & documents",
                  "Sleep by 10 PM",
                ].map((t, i) => (
                  <li key={i} className="text-[10px] font-mono text-muted-foreground flex gap-1.5">
                    <span className="text-emerald-400">·</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
              <p className="text-[10px] font-mono text-destructive uppercase font-bold mb-2 flex items-center gap-1">
                <X className="w-3 h-3" /> AVOID tonight
              </p>
              <ul className="space-y-1">
                {[
                  "New topics / chapters",
                  "Full mock test tonight",
                  "Social media doom-scroll",
                  "Heavy meals or caffeine",
                ].map((t, i) => (
                  <li key={i} className="text-[10px] font-mono text-muted-foreground flex gap-1.5">
                    <span className="text-destructive">·</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Icons row */}
          <div className="flex items-center justify-center gap-6 py-1">
            {[
              { Icon: BookOpen, label: "Review flagged only", color: "text-violet-400" },
              { Icon: Brain,    label: "Trust your prep",     color: "text-blue-400"   },
              { Icon: Moon,     label: "Sleep early",         color: "text-indigo-400" },
              { Icon: Coffee,   label: "Light breakfast",     color: "text-amber-400"  },
            ].map(({ Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className={`w-5 h-5 ${color}`} />
                <p className="text-[9px] font-mono text-muted-foreground text-center leading-tight max-w-[60px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
