import { useState, useMemo } from "react";
import { Activity, Plus, Minus } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

// ── Types ─────────────────────────────────────────────────────────────────────

type IntensityLevel = 1 | 2 | 3;
type MealQuality = 1 | 2 | 3 | 4 | 5;
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type ExerciseType = "walk" | "run" | "yoga" | "gym" | "cycling" | "hiit" | "other";
type WellnessTab = "overview" | "exercise" | "nutrition" | "vitals";

interface ExerciseEntry {
  id: string;
  type: ExerciseType;
  durationMins: number;
  intensity: IntensityLevel;
}

interface MealEntry {
  id: string;
  mealType: MealType;
  quality: MealQuality;
}

interface WellnessDay {
  exercises: ExerciseEntry[];
  meals: MealEntry[];
  waterGlasses: number;
  sleepHours: number;
}

type WellnessLog = Record<string, WellnessDay>;

// ── Constants ─────────────────────────────────────────────────────────────────

const EXERCISE_TYPES: Array<{ id: ExerciseType; label: string; emoji: string }> = [
  { id: "walk",    label: "Walk",    emoji: "🚶" },
  { id: "run",     label: "Run",     emoji: "🏃" },
  { id: "yoga",    label: "Yoga",    emoji: "🧘" },
  { id: "gym",     label: "Gym",     emoji: "🏋️" },
  { id: "cycling", label: "Cycling", emoji: "🚴" },
  { id: "hiit",    label: "HIIT",    emoji: "⚡" },
  { id: "other",   label: "Other",   emoji: "🤸" },
];

const DURATIONS = [15, 20, 30, 45, 60];

const INTENSITIES: Array<{ level: IntensityLevel; label: string; color: string; border: string }> = [
  { level: 1, label: "Light",    color: "text-blue-400",   border: "border-blue-400"   },
  { level: 2, label: "Moderate", color: "text-yellow-400", border: "border-yellow-400" },
  { level: 3, label: "Intense",  color: "text-red-400",    border: "border-red-400"    },
];

const MEAL_TYPES: Array<{ id: MealType; label: string; emoji: string }> = [
  { id: "breakfast", label: "Breakfast", emoji: "🌅" },
  { id: "lunch",     label: "Lunch",     emoji: "🌤️" },
  { id: "dinner",    label: "Dinner",    emoji: "🌙" },
  { id: "snack",     label: "Snack",     emoji: "🍎" },
];

const QUALITY_OPTIONS: Array<{ level: MealQuality; label: string; emoji: string; color: string }> = [
  { level: 1, label: "Junk",      emoji: "🍔", color: "text-red-400"    },
  { level: 2, label: "Processed", emoji: "🥡", color: "text-orange-400" },
  { level: 3, label: "Okay",      emoji: "🌯", color: "text-yellow-400" },
  { level: 4, label: "Healthy",   emoji: "🥗", color: "text-lime-400"   },
  { level: 5, label: "Excellent", emoji: "🥦", color: "text-emerald-400"},
];

const SLEEP_OPTIONS = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// ── Score helpers ─────────────────────────────────────────────────────────────

function calcExerciseScore(exercises: ExerciseEntry[]): number {
  if (exercises.length === 0) return 0;
  const totalMins = exercises.reduce((s, e) => s + e.durationMins, 0);
  const avgIntensity = exercises.reduce((s, e) => s + e.intensity, 0) / exercises.length;
  const base = Math.min(9, (totalMins / 45) * 8);
  return Math.min(10, base + (avgIntensity - 1) * 0.8);
}

function calcFoodScore(meals: MealEntry[]): number | null {
  if (meals.length === 0) return null;
  return (meals.reduce((s, m) => s + m.quality, 0) / meals.length) * 2;
}

function calcHydrationScore(glasses: number): number {
  return Math.min(10, (glasses / 8) * 10);
}

function calcSleepScore(hours: number): number {
  if (hours <= 0) return 0;
  if (hours < 5) return 3;
  if (hours < 6) return 5;
  if (hours < 7) return 7;
  if (hours <= 8.5) return 10;
  if (hours <= 9.5) return 8;
  return 6;
}

function calcHolistic(day: WellnessDay): { score: number; components: number } {
  const scores: number[] = [];
  if (day.exercises.length > 0) scores.push(calcExerciseScore(day.exercises));
  const fs = calcFoodScore(day.meals);
  if (fs !== null) scores.push(fs);
  if (day.waterGlasses > 0) scores.push(calcHydrationScore(day.waterGlasses));
  if (day.sleepHours > 0) scores.push(calcSleepScore(day.sleepHours));
  if (scores.length === 0) return { score: 0, components: 0 };
  return { score: scores.reduce((a, b) => a + b, 0) / scores.length, components: scores.length };
}

function scoreColor(s: number): string {
  if (s < 4) return "text-red-400";
  if (s < 6) return "text-orange-400";
  if (s < 8) return "text-yellow-400";
  return "text-emerald-400";
}

function scoreBg(s: number): string {
  if (s < 4) return "bg-red-500";
  if (s < 6) return "bg-orange-500";
  if (s < 8) return "bg-yellow-400";
  return "bg-emerald-500";
}

function emptyDay(): WellnessDay {
  return { exercises: [], meals: [], waterGlasses: 0, sleepHours: 0 };
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLast7(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function getDayLabel(iso: string): string {
  return DAY_LABELS[new Date(iso + "T12:00:00").getDay()];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WellnessTrackerProps {
  onGainXP?: (amount: number, label: string) => void;
}

export function WellnessTracker({ onGainXP }: WellnessTrackerProps) {
  const [log, setLog] = useState<WellnessLog>(
    () => safeLoad<WellnessLog>("wellness_daily_log", {})
  );
  const [tab, setTab] = useState<WellnessTab>("overview");

  const [exType, setExType]         = useState<ExerciseType>("walk");
  const [exDuration, setExDuration] = useState<number>(30);
  const [exIntensity, setExIntensity] = useState<IntensityLevel>(2);

  const [mealType, setMealType]       = useState<MealType>("lunch");
  const [mealQuality, setMealQuality] = useState<MealQuality>(3);

  const todayKey = getTodayKey();
  const today = log[todayKey] ?? emptyDay();

  function updateToday(fn: (d: WellnessDay) => WellnessDay) {
    const updated = { ...log, [todayKey]: fn(today) };
    setLog(updated);
    safeSave("wellness_daily_log", updated);
  }

  function addExercise() {
    const entry: ExerciseEntry = { id: Date.now().toString(), type: exType, durationMins: exDuration, intensity: exIntensity };
    updateToday(d => ({ ...d, exercises: [...d.exercises, entry] }));
    onGainXP?.(15, "Exercise logged 💪");
  }

  function addMeal() {
    const entry: MealEntry = { id: Date.now().toString(), mealType, quality: mealQuality };
    updateToday(d => ({ ...d, meals: [...d.meals, entry] }));
    onGainXP?.(mealQuality >= 4 ? 10 : 5, mealQuality >= 4 ? "Healthy meal 🥗" : "Meal logged 🍽️");
  }

  function setWater(n: number) {
    const clamped = Math.max(0, Math.min(12, n));
    const prev = today.waterGlasses;
    updateToday(d => ({ ...d, waterGlasses: clamped }));
    if (clamped >= 8 && prev < 8) onGainXP?.(10, "Hydration goal 💧");
  }

  function setSleep(h: number) {
    updateToday(d => ({ ...d, sleepHours: h }));
  }

  const last7 = useMemo(() => getLast7(), []);
  const { score: holisticScore, components } = useMemo(() => calcHolistic(today), [today]);
  const exerciseScore  = useMemo(() => calcExerciseScore(today.exercises), [today.exercises]);
  const foodScore      = useMemo(() => calcFoodScore(today.meals), [today.meals]);
  const hydrationScore = useMemo(() => calcHydrationScore(today.waterGlasses), [today.waterGlasses]);
  const sleepScore     = useMemo(() => calcSleepScore(today.sleepHours), [today.sleepHours]);

  const weekEntries = last7.map(k => {
    const d = log[k] ?? emptyDay();
    const { score } = calcHolistic(d);
    return { key: k, label: getDayLabel(k), score, isToday: k === todayKey };
  });

  const TABS: Array<{ id: WellnessTab; label: string; icon: string }> = [
    { id: "overview",  label: "Overview",   icon: "📊" },
    { id: "exercise",  label: "Exercise",   icon: "💪" },
    { id: "nutrition", label: "Nutrition",  icon: "🥗" },
    { id: "vitals",    label: "Vitals",     icon: "💧" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500/20 p-1.5 rounded-lg">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-mono font-bold text-foreground">Holistic Wellness</p>
            <p className="text-[10px] font-mono text-muted-foreground">Exercise · Nutrition · Hydration · Sleep</p>
          </div>
        </div>
        {components > 0 && (
          <div className="text-right">
            <span className={`text-xl font-mono font-bold ${scoreColor(holisticScore)}`}>
              {holisticScore.toFixed(1)}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">/10</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-[10px] font-mono font-semibold transition-colors ${
              tab === t.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="p-5">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Exercise",   score: exerciseScore,  icon: "💪", logged: today.exercises.length > 0 },
                { label: "Nutrition",  score: foodScore ?? 0, icon: "🥗", logged: today.meals.length > 0 },
                { label: "Hydration",  score: hydrationScore, icon: "💧", logged: today.waterGlasses > 0 },
                { label: "Sleep",      score: sleepScore,     icon: "🌙", logged: today.sleepHours > 0 },
              ].map(item => (
                <div
                  key={item.label}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-1 ${
                    item.logged ? "border-border bg-muted/10" : "border-dashed border-border/40 opacity-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{item.label}</span>
                  {item.logged ? (
                    <span className={`text-sm font-mono font-bold ${scoreColor(item.score)}`}>
                      {item.score.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-muted-foreground/40">tap to log</span>
                  )}
                </div>
              ))}
            </div>

            {components >= 2 && (
              <div className={`border-l-4 rounded-r-xl px-4 py-3 ${
                holisticScore >= 8
                  ? "border-l-emerald-400 bg-emerald-500/5"
                  : holisticScore >= 6
                  ? "border-l-yellow-400 bg-yellow-500/5"
                  : "border-l-orange-400 bg-orange-500/5"
              }`}>
                <p className={`text-[11px] font-mono font-semibold ${scoreColor(holisticScore)}`}>
                  {holisticScore >= 8
                    ? "Peak wellness — your brain is primed for deep learning today."
                    : holisticScore >= 6
                    ? "Solid balance — keep it up for optimal memory retention."
                    : holisticScore >= 4
                    ? "Room to improve — small habits compound over weeks."
                    : "Nurture your body to maximise study output."}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  Exercise + good nutrition improve MCQ recall by up to 20% (cognitive research)
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">7-day wellness trend</p>
              <div className="flex items-end gap-1.5">
                {weekEntries.map(e => (
                  <div key={e.key} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="w-full h-12 bg-muted/20 rounded overflow-hidden flex items-end">
                      {e.score > 0 ? (
                        <div
                          className={`w-full rounded transition-all ${scoreBg(e.score)} ${e.isToday ? "opacity-100" : "opacity-60"}`}
                          style={{ height: `${(e.score / 10) * 100}%` }}
                        />
                      ) : (
                        <div className="w-full h-1 bg-muted/30 rounded" />
                      )}
                    </div>
                    <span className={`text-[9px] font-mono ${e.isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      {e.isToday ? "●" : e.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {components === 0 && (
              <p className="text-[11px] font-mono text-muted-foreground text-center py-2">
                Log exercise, meals, water and sleep to see your holistic wellness score.
              </p>
            )}
          </div>
        )}

        {/* ── EXERCISE ── */}
        {tab === "exercise" && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">Exercise type</p>
              <div className="flex flex-wrap gap-1.5">
                {EXERCISE_TYPES.map(et => (
                  <button
                    key={et.id}
                    onClick={() => setExType(et.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                      exType === et.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {et.emoji} {et.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">Duration (minutes)</p>
              <div className="flex gap-1.5">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setExDuration(d)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                      exDuration === d
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">Intensity</p>
              <div className="flex gap-2">
                {INTENSITIES.map(i => (
                  <button
                    key={i.level}
                    onClick={() => setExIntensity(i.level)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                      exIntensity === i.level
                        ? `${i.border} bg-current/5 ${i.color}`
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addExercise}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[12px] font-mono font-semibold hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Exercise (+15 XP)
            </button>

            {today.exercises.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-muted-foreground">Today's exercises</p>
                {today.exercises.map(e => {
                  const et = EXERCISE_TYPES.find(t => t.id === e.type);
                  const intensity = INTENSITIES.find(i => i.level === e.intensity);
                  return (
                    <div key={e.id} className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{et?.emoji}</span>
                        <span className="text-[11px] font-mono font-semibold text-foreground">{et?.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{e.durationMins} min</span>
                        <span className={`text-[10px] font-mono ${intensity?.color}`}>{intensity?.label}</span>
                      </div>
                      <button
                        onClick={() => updateToday(d => ({ ...d, exercises: d.exercises.filter(x => x.id !== e.id) }))}
                        className="text-muted-foreground hover:text-destructive transition-colors text-[11px]"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Total: {today.exercises.reduce((s, e) => s + e.durationMins, 0)} min
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${scoreColor(exerciseScore)}`}>
                    Score: {exerciseScore.toFixed(1)}/10
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">
                <p>No exercise logged yet</p>
                <p className="text-[10px] mt-1 opacity-60">Even 20 min of walking improves memory consolidation</p>
              </div>
            )}
          </div>
        )}

        {/* ── NUTRITION ── */}
        {tab === "nutrition" && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">Meal</p>
              <div className="flex gap-1.5">
                {MEAL_TYPES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMealType(m.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-[10px] font-mono transition-all ${
                      mealType === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-muted-foreground mb-2">Quality</p>
              <div className="flex gap-1">
                {QUALITY_OPTIONS.map(q => (
                  <button
                    key={q.level}
                    onClick={() => setMealQuality(q.level)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] font-mono transition-all ${
                      mealQuality === q.level
                        ? `border-current bg-current/10 ${q.color}`
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="text-lg">{q.emoji}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addMeal}
              className="w-full py-2.5 rounded-xl bg-lime-500/20 border border-lime-500/40 text-lime-400 text-[12px] font-mono font-semibold hover:bg-lime-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Meal ({mealQuality >= 4 ? "+10" : "+5"} XP)
            </button>

            {today.meals.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-muted-foreground">Today's meals</p>
                {today.meals.map(m => {
                  const mt = MEAL_TYPES.find(t => t.id === m.mealType);
                  const q  = QUALITY_OPTIONS.find(o => o.level === m.quality);
                  return (
                    <div key={m.id} className="flex items-center justify-between bg-muted/10 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{mt?.emoji}</span>
                        <span className="text-[11px] font-mono font-semibold text-foreground">{mt?.label}</span>
                        <span className="text-base">{q?.emoji}</span>
                        <span className={`text-[10px] font-mono ${q?.color}`}>{q?.label}</span>
                      </div>
                      <button
                        onClick={() => updateToday(d => ({ ...d, meals: d.meals.filter(x => x.id !== m.id) }))}
                        className="text-muted-foreground hover:text-destructive transition-colors text-[11px]"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
                {foodScore !== null && (
                  <div className="flex justify-end px-1">
                    <span className={`text-[11px] font-mono font-bold ${scoreColor(foodScore)}`}>
                      Nutrition score: {foodScore.toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">
                <p>No meals logged yet</p>
                <p className="text-[10px] mt-1 opacity-60">Omega-3s, berries and green tea support brain health</p>
              </div>
            )}
          </div>
        )}

        {/* ── VITALS ── */}
        {tab === "vitals" && (
          <div className="space-y-5">

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <div>
                    <p className="text-[12px] font-mono font-semibold text-foreground">Hydration</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Target: 8 glasses (2 L)</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold ${today.waterGlasses > 0 ? scoreColor(hydrationScore) : "text-muted-foreground"}`}>
                  {today.waterGlasses}/8 glasses
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWater(today.waterGlasses - 1)}
                  disabled={today.waterGlasses <= 0}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setWater(i + 1)}
                      title={`${i + 1} glasses`}
                      className={`flex-1 h-6 rounded transition-all ${
                        i < today.waterGlasses
                          ? i < 8 ? "bg-blue-400" : "bg-cyan-400"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setWater(today.waterGlasses + 1)}
                  disabled={today.waterGlasses >= 12}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className={`text-[10px] font-mono mt-2 ${today.waterGlasses >= 8 ? "text-emerald-400" : "text-muted-foreground"}`}>
                {today.waterGlasses >= 8
                  ? "✓ Hydration goal reached! Earns +10 XP."
                  : today.waterGlasses > 0
                  ? `${8 - today.waterGlasses} more glass${8 - today.waterGlasses === 1 ? "" : "es"} to reach goal`
                  : "Even mild dehydration (1-2%) impairs cognitive performance"}
              </p>
            </div>

            {/* Sleep */}
            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌙</span>
                  <div>
                    <p className="text-[12px] font-mono font-semibold text-foreground">Last night's sleep</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Optimal: 7 – 8.5 hours</p>
                  </div>
                </div>
                <span className={`text-[14px] font-mono font-bold ${today.sleepHours > 0 ? scoreColor(sleepScore) : "text-muted-foreground"}`}>
                  {today.sleepHours > 0 ? `${today.sleepHours}h` : "—"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SLEEP_OPTIONS.map(h => {
                  const isOptimal = h >= 7 && h <= 8.5;
                  const isSelected = today.sleepHours === h;
                  return (
                    <button
                      key={h}
                      onClick={() => setSleep(h)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                        isSelected
                          ? "border-violet-400 bg-violet-400/20 text-violet-300 font-bold"
                          : isOptimal
                          ? "border-emerald-500/40 text-emerald-400/70 hover:border-emerald-400"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {h}h{isOptimal && !isSelected ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>

              {today.sleepHours > 0 && (
                <p className={`text-[10px] font-mono mt-2 ${scoreColor(sleepScore)}`}>
                  {sleepScore >= 9
                    ? "Optimal — memory consolidation is at its best after 7-8h."
                    : sleepScore >= 7
                    ? "Good sleep. Your brain is ready to absorb new material."
                    : sleepScore >= 5
                    ? "Adequate rest, but more sleep would improve retention."
                    : "Short sleep impairs recall — try to rest more tonight."}
                </p>
              )}
            </div>

            <div className="border border-dashed border-border/50 rounded-xl p-3">
              <p className="text-[10px] font-mono text-muted-foreground leading-relaxed text-center">
                🧠 INICET toppers sleep 7-8h, exercise 3-5×/week, drink 2L+ daily.
                <br />These habits compound — track them for consistent performance.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
