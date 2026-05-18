import { toast } from "sonner";

export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncState {
  status: SyncStatus;
  lastSynced: Date | null;
  error: string | null;
  retryCount: number;
}

export interface SyncError extends Error {
  code?: string;
  status?: number;
  isNetworkError?: boolean;
  isRetryable?: boolean;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Exponential backoff retry strategy
 * Delays: 1s, 2s, 4s
 */
export function getRetryDelay(attemptNumber: number): number {
  return BASE_DELAY_MS * Math.pow(2, attemptNumber);
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const syncError = error as SyncError;
    // Network errors are always retryable
    if (syncError.isNetworkError) return true;
    // Specific HTTP status codes are retryable
    if (syncError.status && [408, 429, 500, 502, 503, 504].includes(syncError.status)) {
      return true;
    }
  }
  return false;
}

/**
 * Execute a function with automatic retry logic
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    onRetry?: (attempt: number, error: Error) => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = getRetryDelay(attempt);
        options.onRetry?.(attempt + 1, lastError);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      options.onError?.(lastError);
      throw lastError;
    }
  }

  throw new Error("Retry loop exhausted without result");
}

/**
 * Format time since last sync for display
 */
export function formatLastSynced(date: Date | null): string {
  if (!date) return "Never";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Get a user-friendly error message
 */
export function getSyncErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const syncError = error as SyncError;

    // Network errors
    if (syncError.isNetworkError) {
      return "Network connection issue. Data will sync when connection is restored.";
    }

    // Supabase/auth errors
    if (syncError.code === "PGRST301") {
      return "Please sign in to sync data.";
    }
    if (syncError.message?.includes("fetch")) {
      return "Connection failed. Retrying...";
    }

    // Generic message fallback
    if (syncError.message) {
      return syncError.message;
    }
  }

  return "Sync failed. Please try again.";
}
