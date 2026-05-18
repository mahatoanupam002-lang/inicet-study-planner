import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { executeWithRetry, getSyncErrorMessage, formatLastSynced, type SyncState } from "@/lib/sync";

interface UseSyncOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export interface UseSyncResult extends SyncState {
  sync: () => Promise<void>;
  isOnline: boolean;
  lastSyncedText: string;
}

/**
 * Hook that manages sync operations with retry logic and status tracking.
 * Automatically syncs when coming back online.
 */
export function useSync<T>(
  operation: () => Promise<T>,
  options: UseSyncOptions = {}
): UseSyncResult {
  const [state, setState] = useState<SyncState>({
    status: "idle",
    lastSynced: null,
    error: null,
    retryCount: 0,
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const sync = useCallback(async () => {
    setState(prev => ({ ...prev, status: "syncing" }));

    try {
      await executeWithRetry(operation, {
        onRetry: (attempt, error) => {
          setState(prev => ({ ...prev, retryCount: attempt }));
          if (options.showToast !== false) {
            toast.loading(`Retrying... (attempt ${attempt})`, { id: "sync-retry" });
          }
        },
        onError: (error) => {
          const message = getSyncErrorMessage(error);
          setState(prev => ({
            ...prev,
            status: "error",
            error: message,
          }));
          if (options.showToast !== false) {
            toast.error(message, { id: "sync-error" });
          }
          options.onError?.(error);
        },
      });

      setState(prev => ({
        ...prev,
        status: "success",
        lastSynced: new Date(),
        error: null,
        retryCount: 0,
      }));

      if (options.showToast !== false) {
        toast.success("Data synced", { id: "sync-success" });
      }
      options.onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const message = getSyncErrorMessage(err);

      setState(prev => ({
        ...prev,
        status: "error",
        error: message,
      }));

      if (options.showToast !== false) {
        toast.error(message, { id: "sync-error" });
      }
      options.onError?.(err);
    }

    // Reset status to idle after a short delay
    setTimeout(() => {
      setState(prev => ({ ...prev, status: prev.error ? "error" : "idle" }));
    }, 2000);
  }, [operation, options]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && state.status !== "syncing") {
      void sync();
    }
  }, [isOnline, sync, state.status]);

  return {
    status: state.status,
    lastSynced: state.lastSynced,
    error: state.error,
    retryCount: state.retryCount,
    sync,
    isOnline,
    lastSyncedText: formatLastSynced(state.lastSynced),
  };
}
