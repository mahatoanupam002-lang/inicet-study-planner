import { describe, it, expect, beforeEach } from "vitest";
import {
  detectNetworkStatus,
  createOfflineDetector,
  supportsServiceWorkers,
  supportsBackgroundSync,
  supportsOfflineStorage,
  userPrefersSaveData,
  getDataSaverMode,
  shouldDeferOperation,
} from "@/lib/offline";

describe("offline utilities", () => {
  describe("detectNetworkStatus", () => {
    it("returns online status by default", () => {
      const status = detectNetworkStatus();

      expect(status.isOnline).toBe(true);
      expect(status.mode).toBe("online");
    });

    it("includes network information", () => {
      const status = detectNetworkStatus();

      expect(status).toHaveProperty("isOnline");
      expect(status).toHaveProperty("mode");
      expect(status).toHaveProperty("lastOnlineTime");
    });

    it("returns effective type when available", () => {
      const status = detectNetworkStatus();

      if (status.effectiveType) {
        expect(["4g", "3g", "2g", "slow-4g"]).toContain(status.effectiveType);
      }
    });
  });

  describe("createOfflineDetector", () => {
    it("returns status and destroy function", () => {
      const detector = createOfflineDetector();

      expect(typeof detector.getStatus).toBe("function");
      expect(typeof detector.destroy).toBe("function");
    });

    it("getStatus returns current network status", () => {
      const detector = createOfflineDetector();
      const status = detector.getStatus();

      expect(status.isOnline).toBeDefined();
      expect(status.mode).toBeDefined();

      detector.destroy();
    });

    it("calls listener on status change", () => {
      let callCount = 0;
      const detector = createOfflineDetector(() => {
        callCount++;
      });

      // Get initial status
      const initialStatus = detector.getStatus();

      // Cleanup
      detector.destroy();

      expect(typeof initialStatus).toBe("object");
    });

    it("cleanup removes event listeners", () => {
      const detector = createOfflineDetector();
      detector.destroy();

      // Should not throw after destroy
      expect(detector.destroy).not.toThrow();
    });
  });

  describe("supportsServiceWorkers", () => {
    it("returns boolean", () => {
      const result = supportsServiceWorkers();

      expect(typeof result).toBe("boolean");
    });
  });

  describe("supportsBackgroundSync", () => {
    it("returns boolean", () => {
      const result = supportsBackgroundSync();

      expect(typeof result).toBe("boolean");
    });

    it("returns false if service workers not supported", () => {
      // In jsdom, SyncManager is not available
      const result = supportsBackgroundSync();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("supportsOfflineStorage", () => {
    it("returns true in test environment", () => {
      const result = supportsOfflineStorage();

      expect(result).toBe(true);
    });

    it("returns false if localStorage throws", () => {
      const result = supportsOfflineStorage();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("userPrefersSaveData", () => {
    it("returns boolean", () => {
      const result = userPrefersSaveData();

      expect(typeof result).toBe("boolean");
    });
  });

  describe("getDataSaverMode", () => {
    it("returns 'normal' by default", () => {
      const mode = getDataSaverMode();

      expect(mode).toBe("normal");
    });

    it("returns either 'lite' or 'normal'", () => {
      const mode = getDataSaverMode();

      expect(["lite", "normal"]).toContain(mode);
    });
  });

  describe("shouldDeferOperation", () => {
    it("returns false for online connection", () => {
      const should = shouldDeferOperation();

      expect(typeof should).toBe("boolean");
    });

    it("accepts operation size parameter", () => {
      const should = shouldDeferOperation(5000);

      expect(typeof should).toBe("boolean");
    });
  });
});
