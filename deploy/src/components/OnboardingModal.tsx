import { useState, type ComponentType } from "react";
import { Target, Calendar, Bot, BookOpen, Award, TrendingUp, ChevronRight, X, type LucideProps } from "lucide-react";

interface Step {
  icon: ComponentType<LucideProps>;
  color: string;
  bg: string;
  title: string;
  body: string;
  tip: string;
}

const STEPS: Step[] = [
  {
    icon: Target,
    color: "text-red-400",
    bg: "bg-red-500/20",
    title: "Welcome to NEET PG War Plan",
    body: "This is your complete 28-day command centre to crack NEET PG. Everything you need — plan, practice, track, and learn — is in one place.",
    tip: "Built by toppers, for toppers. Start with Day 1 and follow the plan exactly.",
  },
  {
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    title: "Your 28-Day Battle Plan",
    body: "The Planner tab has your full 28-day schedule across 3 phases: Blitz (Days 1–18), Rapid Revision (Days 19–24), and Mock & Consolidate (Days 25–28). Each day has topics, India-specific content, image focus, and MCQ targets.",
    tip: "Click any day in the grid to see the full detail. Tick it off when done to build your streak.",
  },
  {
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    title: "Practice with PYQ Bank",
    body: "The PYQ tab has 250+ NEET PG style questions across all subjects. Practice by subject, filter wrong-only answers, and track your accuracy. Aim for >75% before exam day.",
    tip: "Use the 'Wrong' filter daily — it's your most efficient practice mode after the first pass.",
  },
  {
    icon: Bot,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    title: "AI Tutor — Ask Anything",
    body: "Stuck on a concept? The AI Tutor tab is powered by Claude and trained to explain NEET PG topics with mnemonics, clinical reasoning, and MCQ traps. Add your API key once and it works offline.",
    tip: "Try asking: 'Explain the difference between nephrotic and nephritic syndrome with mnemonics'",
  },
  {
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    title: "Learn From Toppers",
    body: "The Toppers tab has detailed strategies from NEET PG AIR 1 toppers and other high rankers — their daily routines, subject-wise tips, resources used, and mental health advice.",
    tip: "The mistake logbook strategy alone can improve your score by 8–12 marks.",
  },
  {
    icon: TrendingUp,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
    title: "Track Your Rank",
    body: "After every mock, enter your score in the Schedule tab's Rank Predictor. You'll see your estimated AIR range based on historical NEET PG cutoff trends — and personalised advice on what to fix.",
    tip: "Aim for 75%+ by Day 20. That puts you in the top 1000 territory going into mocks.",
  },
];

interface OnboardingModalProps {
  onDone: () => void;
}

export function OnboardingModal({ onDone }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Skip */}
        <button
          onClick={onDone}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Skip onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all ${
                i === step ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-8 space-y-5">
          {/* Icon */}
          <div className={`${current.bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto`}>
            <Icon className={`w-7 h-7 ${current.color}`} />
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h2 className="font-mono font-bold text-foreground text-lg leading-tight">{current.title}</h2>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">{current.body}</p>
          </div>

          {/* Tip */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <p className="text-[10px] font-mono text-primary uppercase mb-1">Pro Tip</p>
            <p className="text-xs font-mono text-foreground/80 leading-relaxed">{current.tip}</p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-2.5 text-sm font-mono border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? onDone() : setStep(s => s + 1))}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-mono bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              {isLast ? "Start Planning" : "Next"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Step indicator */}
          <p className="text-center text-[10px] font-mono text-muted-foreground">
            {step + 1} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
