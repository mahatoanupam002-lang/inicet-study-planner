import { useAuth } from "@/lib/auth";
import { useSync } from "@/lib/useSync";
import { fetchCloudData } from "@/lib/cloud";
import { Check, AlertCircle, Wifi, WifiOff, RotateCw } from "lucide-react";

export function SyncStatus() {
  const { user } = useAuth();

  // Only show sync status if user is logged in
  if (!user) return null;

  const { status, lastSyncedText, error, isOnline, sync, retryCount } = useSync(
    () => fetchCloudData(user.id),
    { showToast: false }
  );

  const isOffline = !isOnline;
  const isSyncing = status === "syncing";
  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {/* Status Indicator */}
      <div className="flex items-center">
        {isSyncing && (
          <RotateCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
        )}
        {isError && (
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
        )}
        {isSuccess && (
          <Check className="w-3.5 h-3.5 text-green-400" />
        )}
        {!isSyncing && !isError && !isSuccess && (
          isOffline ? (
            <WifiOff className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <Wifi className="w-3.5 h-3.5 text-gray-500" />
          )
        )}
      </div>

      {/* Status Text */}
      <div className="hidden sm:block">
        {isSyncing && "Syncing..."}
        {isError && (
          <button
            onClick={() => void sync()}
            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            title={error || "Sync failed"}
          >
            <span>Retry</span>
            {retryCount > 0 && <span className="text-xs">({retryCount})</span>}
          </button>
        )}
        {!isSyncing && !isError && (
          <span>{lastSyncedText}</span>
        )}
      </div>

      {/* Manual Sync for Offline */}
      {isOffline && !isSyncing && (
        <button
          onClick={() => void sync()}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          title="Try syncing now"
        >
          Sync
        </button>
      )}
    </div>
  );
}
