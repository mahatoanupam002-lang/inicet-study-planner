/**
 * Storage keys — single source of truth.
 * All localStorage and Supabase column names derive from this enum.
 */
export const enum StorageKey {
  CompletedDays = "neetpg_completed_days",
  Notes         = "neetpg_notes",
  McqScores     = "neetpg_mcq_scores",
  Flagged       = "neetpg_flagged",
  SrCards       = "neetpg_sr_cards",
  Streak        = "neetpg_streak",
  ExamDate      = "neetpg_exam_date",
  PomodoroSessions = "neetpg_pomodoro_sessions",
  ChatHistory   = "neetpg_chat_history",
  AiKey         = "neetpg_ai_key",
}

// ─── LocalStorage helpers ────────────────────────────────────────────────────

export function safeLoad<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeSave(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked — notify if possible
    console.warn(`[storage] Failed to save "${key}" — storage may be full or blocked.`);
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
