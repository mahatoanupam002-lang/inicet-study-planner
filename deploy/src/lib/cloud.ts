import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { safeSave, safeLoad } from "@/lib/storage";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

/**
 * Debounce helper — waits `ms` milliseconds after the last call before invoking fn.
 */
function useDebounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  ) as T;
}

interface UserData {
  completed_days: number[];
  notes: Record<number, string>;
  mcq_scores: Record<number, { attempted: number; correct: number }>;
  flagged: { dayId: number; topicIdx: number }[];
  sr_cards: Record<number, { ef: number; interval: number; repetitions: number; dueDate: string }>;
  streak: { count: number; longest: number; lastDate: string };
  exam_date: string | null;
}

/**
 * Fetch the user's data row from Supabase.
 * Returns null if the row doesn't exist yet.
 */
export async function fetchCloudData(userId: string): Promise<UserData | null> {
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found — that's fine on first login
    console.error("[cloud] fetchCloudData error:", error.message);
    return null;
  }
  return data ?? null;
}

/**
 * Upsert (insert or update) the user's data row in Supabase.
 * localStorage is always written first so the UI never waits for the network.
 */
export async function upsertCloudData(userId: string, patch: Partial<UserData>): Promise<void> {
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

  if (error) {
    console.warn("[cloud] upsertCloudData error:", error.message);
  }
}

/**
 * Merge cloud data into localStorage on first login / reconnect.
 * Cloud wins for everything except streaks where we take the larger value.
 */
export function mergeCloudIntoLocal(cloud: UserData): void {
  if (cloud.completed_days)  safeSave("neetpg_completed_days", cloud.completed_days);
  if (cloud.notes)           safeSave("neetpg_notes", cloud.notes);
  if (cloud.mcq_scores)      safeSave("neetpg_mcq_scores", cloud.mcq_scores);
  if (cloud.flagged)         safeSave("neetpg_flagged", cloud.flagged);
  if (cloud.sr_cards)        safeSave("neetpg_sr_cards", cloud.sr_cards);
  if (cloud.exam_date)       safeSave("neetpg_exam_date", cloud.exam_date);

  // Streak: take the longer streak to avoid punishing users who switch devices
  if (cloud.streak) {
    const local = safeLoad<{ count: number; longest: number; lastDate: string }>(
      "neetpg_streak",
      { count: 0, longest: 0, lastDate: "" }
    );
    const merged = {
      count:    Math.max(local.count, cloud.streak.count),
      longest:  Math.max(local.longest, cloud.streak.longest),
      lastDate: local.lastDate > cloud.streak.lastDate ? local.lastDate : cloud.streak.lastDate,
    };
    safeSave("neetpg_streak", merged);
  }
}

/**
 * Hook that syncs a single state slice to Supabase with a debounced write.
 * Call this once per state slice in App.tsx.
 */
export function useCloudSync<T extends JsonValue>(
  key: keyof UserData,
  value: T,
  ready: boolean   // only sync when user is logged in and initial load is done
): void {
  const { user } = useAuth();

  const syncToCloud = useCallback(
    async (v: T) => {
      if (!user) return;
      await upsertCloudData(user.id, { [key]: v } as Partial<UserData>);
    },
    [user, key]
  );

  const debouncedSync = useDebounce(syncToCloud, 1500);

  useEffect(() => {
    if (!ready || !user) return;
    debouncedSync(value);
  }, [value, ready, user, debouncedSync]);
}
