import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { safeSave, safeLoad } from "@/lib/storage";
import { executeWithRetry, type SyncError } from "@/lib/sync";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

// ── Offline mutation queue ────────────────────────────────────────────────────
// Writes that fail while offline are stored here and re-attempted on reconnect.

const QUEUE_KEY = "neetpg_pending_sync";

interface PendingWrite {
  userId: string;
  key: string;
  value: JsonValue;
  ts: number;
}

function loadQueue(): PendingWrite[] {
  return safeLoad<PendingWrite[]>(QUEUE_KEY, []);
}

function saveQueue(q: PendingWrite[]): void {
  safeSave(QUEUE_KEY, q);
}

function enqueue(userId: string, key: string, value: JsonValue): void {
  const q = loadQueue().filter(p => !(p.userId === userId && p.key === key));
  // Keep only the latest write per (userId, key) — older ones are superseded
  q.push({ userId, key, value, ts: Date.now() });
  saveQueue(q);
}

function dequeue(userId: string, key: string): void {
  saveQueue(loadQueue().filter(p => !(p.userId === userId && p.key === key)));
}

// ── Flush pending writes on reconnect ────────────────────────────────────────

let flushInProgress = false;

async function flushQueue(): Promise<void> {
  if (flushInProgress) return;
  flushInProgress = true;
  try {
    const pending = loadQueue();
    if (pending.length === 0) return;
    for (const write of pending) {
      const ok = await upsertCloudData(write.userId, { [write.key]: write.value } as Partial<UserData>);
      if (ok) dequeue(write.userId, write.key);
    }
  } finally {
    flushInProgress = false;
  }
}

// Register a one-time online listener that flushes pending writes when the
// browser reconnects. Safe to call multiple times — listener is idempotent.
let onlineListenerAttached = false;
function ensureOnlineListener(): void {
  if (onlineListenerAttached) return;
  onlineListenerAttached = true;
  window.addEventListener("online", () => {
    void flushQueue();
  });
}

// ── Debounce helper ───────────────────────────────────────────────────────────

function useDebounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): (...args: A) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}

// ── UserData shape (mirrors Supabase user_data columns) ───────────────────────

interface UserData {
  completed_days: number[];
  notes: Record<number, string>;
  mcq_scores: Record<number, { attempted: number; correct: number }>;
  flagged: { dayId: number; topicIdx: number }[];
  sr_cards: Record<number, { ef: number; interval: number; repetitions: number; dueDate: string }>;
  streak: { count: number; longest: number; lastDate: string };
  exam_date: string | null;
}

// ── Cloud read/write ──────────────────────────────────────────────────────────

/**
 * Fetch the user's data row from Supabase with automatic retry.
 * Returns null if the row doesn't exist yet.
 */
export async function fetchCloudData(userId: string): Promise<UserData | null> {
  return executeWithRetry(
    async () => {
      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = row not found — that's fine on first login
        const syncError = new Error(error.message) as SyncError;
        syncError.code = error.code;
        syncError.isNetworkError = true;
        throw syncError;
      }
      return data ?? null;
    },
    {
      maxRetries: 3,
      onError: (error) => {
        console.error("[cloud] fetchCloudData error:", error.message);
      },
    }
  );
}

/**
 * Upsert (insert or update) the user's data row in Supabase with automatic retry.
 * localStorage is always written first so the UI never waits for the network.
 * Returns true on success. On failure, the write is queued for retry on reconnect.
 */
export async function upsertCloudData(userId: string, patch: Partial<UserData>): Promise<boolean> {
  try {
    await executeWithRetry(
      async () => {
        const { error } = await supabase
          .from("user_data")
          .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

        if (error) {
          const syncError = new Error(error.message) as SyncError;
          syncError.code = error.code;
          syncError.isNetworkError = true;
          throw syncError;
        }
      },
      { maxRetries: 3 }
    );
    return true;
  } catch (error) {
    console.warn("[cloud] upsertCloudData error:", error instanceof Error ? error.message : String(error));
    return false;
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
 * Failed writes are queued in localStorage and retried on next online event.
 */
export function useCloudSync<T extends JsonValue>(
  key: keyof UserData,
  value: T,
  ready: boolean   // only sync when user is logged in and initial load is done
): void {
  const { user } = useAuth();

  // Attach the online-reconnect flush listener once per app session
  useEffect(() => { ensureOnlineListener(); }, []);

  const syncToCloud = useCallback(
    async (v: T) => {
      if (!user) return;
      const ok = await upsertCloudData(user.id, { [key]: v } as Partial<UserData>);
      if (!ok) {
        // Queue for retry when connectivity is restored
        enqueue(user.id, key, v as JsonValue);
      } else {
        // Successful write — clear any stale queued entry for this key
        dequeue(user.id, key);
      }
    },
    [user, key]
  );

  const debouncedSync = useDebounce(syncToCloud, 1500);

  useEffect(() => {
    if (!ready || !user) return;
    debouncedSync(value);
  }, [value, ready, user, debouncedSync]);
}
