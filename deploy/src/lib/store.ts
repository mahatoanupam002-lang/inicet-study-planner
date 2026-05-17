import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLoad } from "@/lib/storage";
import type { SRCard } from "@/lib/sr";
import type { FlaggedTopic } from "@/components/RevisionList";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StreakData { count: number; longest: number; lastDate: string; }

interface StudyState {
  completedDays: number[];
  notes: Record<number, string>;
  mcqScores: Record<number, { attempted: number; correct: number }>;
  flagged: FlaggedTopic[];
  srCards: Record<number, SRCard>;
  streak: StreakData;
  examDateIso: string;

  setCompletedDays: (days: number[]) => void;
  toggleDayCompletion: (day: number) => void;
  updateNote: (day: number, text: string) => void;
  saveMcqScore: (day: number, attempted: number, correct: number) => void;
  toggleFlag: (dayId: number, topicIdx: number) => void;
  updateSrCard: (dayId: number, card: SRCard) => void;
  setStreak: (fn: (s: StreakData) => StreakData) => void;
  setExamDateIso: (iso: string) => void;
}

interface GamificationState {
  bonusXP: number;
  unlockedIds: string[];
  drillsCompleted: number;
  simCompleted: boolean;

  addBonusXP: (amount: number) => void;
  unlockAchievement: (id: string, xpReward: number) => void;
  incrementDrills: () => void;
  setSimCompleted: (v: boolean) => void;
}

export type AppStore = StudyState & GamificationState;

// ── Per-prefix store factory ──────────────────────────────────────────────────
// Each auth prefix (guest = "neetpg_", user = "neetpg_u_{id}_") gets its own
// persisted store so users on the same device don't share localStorage data.

function buildStore(prefix: string) {
  return create<AppStore>()(
    persist(
      (set) => ({
        // Initial values read from the old individual keys as a one-time migration.
        // Once the new store key exists in localStorage, persist rehydrates from it
        // and these safeLoad calls are skipped entirely.
        completedDays:   safeLoad<number[]>(`${prefix}completed_days`, []),
        notes:           safeLoad<Record<number, string>>(`${prefix}notes`, {}),
        mcqScores:       safeLoad<Record<number, { attempted: number; correct: number }>>(`${prefix}mcq_scores`, {}),
        flagged:         safeLoad<FlaggedTopic[]>(`${prefix}flagged`, []),
        srCards:         safeLoad<Record<number, SRCard>>(`${prefix}sr_cards`, {}),
        streak:          safeLoad<StreakData>(`${prefix}streak`, { count: 0, longest: 0, lastDate: "" }),
        examDateIso:     safeLoad<string>(`${prefix}exam_date`, "2026-05-16T00:00:00.000Z"),

        setCompletedDays: (days) => set({ completedDays: days }),

        toggleDayCompletion: (day) =>
          set((s) => ({
            completedDays: s.completedDays.includes(day)
              ? s.completedDays.filter((d) => d !== day)
              : [...s.completedDays, day],
          })),

        updateNote: (day, text) =>
          set((s) => ({ notes: { ...s.notes, [day]: text } })),

        saveMcqScore: (day, attempted, correct) =>
          set((s) => ({ mcqScores: { ...s.mcqScores, [day]: { attempted, correct } } })),

        toggleFlag: (dayId, topicIdx) =>
          set((s) => ({
            flagged: s.flagged.some((f) => f.dayId === dayId && f.topicIdx === topicIdx)
              ? s.flagged.filter((f) => !(f.dayId === dayId && f.topicIdx === topicIdx))
              : [...s.flagged, { dayId, topicIdx }],
          })),

        updateSrCard: (dayId, card) =>
          set((s) => ({ srCards: { ...s.srCards, [dayId]: card } })),

        setStreak: (fn) => set((s) => ({ streak: fn(s.streak) })),

        setExamDateIso: (iso) => set({ examDateIso: iso }),

        // Gamification — global keys (not prefixed) since they track device-wide progress
        bonusXP:         safeLoad<number>("neetpg_bonus_xp", 0),
        unlockedIds:     safeLoad<string[]>("neetpg_achievements", []),
        drillsCompleted: safeLoad<number>("neetpg_drills_count", 0),
        simCompleted:    safeLoad<boolean>("neetpg_sim_done", false),

        addBonusXP: (amount) => set((s) => ({ bonusXP: s.bonusXP + amount })),

        unlockAchievement: (id, xpReward) =>
          set((s) => ({
            unlockedIds: s.unlockedIds.includes(id) ? s.unlockedIds : [...s.unlockedIds, id],
            bonusXP:     s.unlockedIds.includes(id) ? s.bonusXP : s.bonusXP + xpReward,
          })),

        incrementDrills: () => set((s) => ({ drillsCompleted: s.drillsCompleted + 1 })),

        setSimCompleted: (v) => set({ simCompleted: v }),
      }),
      {
        name: `neetpg_store_${prefix}`,
        partialize: (s) => ({
          completedDays:   s.completedDays,
          notes:           s.notes,
          mcqScores:       s.mcqScores,
          flagged:         s.flagged,
          srCards:         s.srCards,
          streak:          s.streak,
          examDateIso:     s.examDateIso,
          bonusXP:         s.bonusXP,
          unlockedIds:     s.unlockedIds,
          drillsCompleted: s.drillsCompleted,
          simCompleted:    s.simCompleted,
        }),
      }
    )
  );
}

// Cache stores by prefix so each user/guest gets exactly one store instance.
const storeCache = new Map<string, ReturnType<typeof buildStore>>();

export function getAppStore(prefix: string): ReturnType<typeof buildStore> {
  if (!storeCache.has(prefix)) storeCache.set(prefix, buildStore(prefix));
  return storeCache.get(prefix)!;
}

// ── Selectors ─────────────────────────────────────────────────────────────────

export const sel = {
  completedDays:   (s: AppStore) => s.completedDays,
  notes:           (s: AppStore) => s.notes,
  mcqScores:       (s: AppStore) => s.mcqScores,
  flagged:         (s: AppStore) => s.flagged,
  srCards:         (s: AppStore) => s.srCards,
  streak:          (s: AppStore) => s.streak,
  examDateIso:     (s: AppStore) => s.examDateIso,
  bonusXP:         (s: AppStore) => s.bonusXP,
  unlockedIds:     (s: AppStore) => s.unlockedIds,
  drillsCompleted: (s: AppStore) => s.drillsCompleted,
  simCompleted:    (s: AppStore) => s.simCompleted,
};
