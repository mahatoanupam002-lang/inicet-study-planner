export type OfflineMode = "online" | "offline" | "slow-connection";

export interface OfflineState {
  mode: OfflineMode;
  lastOnlineTime: number | null;
  isOnline: boolean;
  effectiveType?: "4g" | "3g" | "2g" | "slow-4g";
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Detect current network status
 */
export function detectNetworkStatus(): OfflineState {
  if (typeof window === "undefined") {
    return {
      mode: "online",
      lastOnlineTime: Date.now(),
      isOnline: true,
    };
  }

  const isOnline = navigator.onLine;
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  let mode: OfflineMode = "online";
  let effectiveType: OfflineState["effectiveType"] = "4g";
  let downlink: number | undefined;
  let rtt: number | undefined;
  let saveData = false;

  if (!isOnline) {
    mode = "offline";
  } else if (connection) {
    effectiveType = connection.effectiveType || "4g";
    downlink = connection.downlink;
    rtt = connection.rtt;
    saveData = connection.saveData || false;

    // Detect slow connection
    if (effectiveType === "2g" || effectiveType === "3g" || effectiveType === "slow-4g") {
      mode = "slow-connection";
    }
  }

  return {
    mode,
    lastOnlineTime: isOnline ? Date.now() : null,
    isOnline,
    effectiveType,
    downlink,
    rtt,
    saveData,
  };
}

/**
 * Create an offline state detector with listener
 */
export function createOfflineDetector(
  onStatusChange?: (status: OfflineState) => void
): {
  getStatus: () => OfflineState;
  destroy: () => void;
} {
  let lastStatus = detectNetworkStatus();

  const handleOnline = () => {
    lastStatus = detectNetworkStatus();
    onStatusChange?.(lastStatus);
  };

  const handleOffline = () => {
    lastStatus = detectNetworkStatus();
    onStatusChange?.(lastStatus);
  };

  const handleConnectionChange = () => {
    const newStatus = detectNetworkStatus();
    if (newStatus.mode !== lastStatus.mode) {
      lastStatus = newStatus;
      onStatusChange?.(lastStatus);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener("change", handleConnectionChange);
    }
  }

  return {
    getStatus: () => detectNetworkStatus(),
    destroy: () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);

        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          connection.removeEventListener("change", handleConnectionChange);
        }
      }
    },
  };
}

/**
 * Check if browser supports service workers
 */
export function supportsServiceWorkers(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

/**
 * Check if browser supports background sync
 */
export function supportsBackgroundSync(): boolean {
  return supportsServiceWorkers() && "SyncManager" in window;
}

/**
 * Check if browser supports offline storage
 */
export function supportsOfflineStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__offline_storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if user prefers saving data
 */
export function userPrefersSaveData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.saveData ?? false;
  } catch {
    return false;
  }
}

/**
 * Get effective data saver mode
 */
export function getDataSaverMode(): "lite" | "normal" {
  return userPrefersSaveData() || detectNetworkStatus().mode === "slow-connection" ? "lite" : "normal";
}

/**
 * Estimate if operation should be deferred (for slow connections)
 */
export function shouldDeferOperation(operationSize: number = 1000): boolean {
  const status = detectNetworkStatus();

  // Always defer on slow/offline
  if (status.mode !== "online") return true;

  // Check if downlink is available and slow
  if (status.downlink !== undefined && status.downlink < 1) {
    return true;
  }

  // Check if RTT is high
  if (status.rtt !== undefined && status.rtt > 1000) {
    return true;
  }

  return false;
}
