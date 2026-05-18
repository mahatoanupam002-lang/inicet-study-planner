import { useCallback, useEffect } from "react";
import { useSync, type UseSyncResult } from "@/lib/useSync";
import { reportSyncMetrics } from "@/lib/monitoring";
import { trackSyncEvent, trackError } from "@/lib/analytics";

interface UseSyncWithMonitoringOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  trackMetrics?: boolean;
}

/**
 * Enhanced useSync hook that automatically tracks metrics and analytics
 */
export function useSyncWithMonitoring<T>(
  operation: () => Promise<T>,
  options: UseSyncWithMonitoringOptions = {}
): UseSyncResult {
  const { trackMetrics = true, ...syncOptions } = options;

  const handleSuccess = useCallback(() => {
    if (trackMetrics) {
      trackSyncEvent("completed", { duration: "tracked" });
    }
    options.onSuccess?.();
  }, [trackMetrics, options]);

  const handleError = useCallback(
    (error: Error) => {
      if (trackMetrics) {
        trackError(error, { context: "sync_operation" });
        trackSyncEvent("failed", { error: error.message });
      }
      options.onError?.(error);
    },
    [trackMetrics, options]
  );

  const wrappedOperation = useCallback(async () => {
    const startTime = Date.now();
    try {
      if (trackMetrics) {
        trackSyncEvent("started");
      }

      const result = await operation();

      if (trackMetrics) {
        const latency = Date.now() - startTime;
        reportSyncMetrics("success", latency);
      }

      return result;
    } catch (error) {
      if (trackMetrics) {
        const latency = Date.now() - startTime;
        reportSyncMetrics("failure", latency);
      }
      throw error;
    }
  }, [operation, trackMetrics]);

  const result = useSync(wrappedOperation, {
    ...syncOptions,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return result;
}
