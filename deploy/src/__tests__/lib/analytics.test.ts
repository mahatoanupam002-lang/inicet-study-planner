import { describe, it, expect, beforeEach } from "vitest";
import {
  trackEvent,
  logMessage,
  trackSyncEvent,
  trackAuthEvent,
  trackError,
  trackFeatureUsage,
  getAnalyticsBuffer,
  getLogBuffer,
  clearBuffers,
  exportAnalytics,
  getAnalyticsSummary,
} from "@/lib/analytics";

describe("analytics service", () => {
  beforeEach(() => {
    clearBuffers();
  });

  describe("trackEvent", () => {
    it("adds event to analytics buffer", () => {
      trackEvent("auth_login", { method: "google" }, "user123");

      const buffer = getAnalyticsBuffer();
      expect(buffer).toHaveLength(1);
      expect(buffer[0]).toMatchObject({
        type: "auth_login",
        userId: "user123",
        metadata: { method: "google" },
      });
    });

    it("maintains buffer size limit", () => {
      // Add more than MAX_BUFFER_SIZE (100) events
      for (let i = 0; i < 150; i++) {
        trackEvent("feature_used", { feature: `feature_${i}` });
      }

      const buffer = getAnalyticsBuffer();
      expect(buffer.length).toBeLessThanOrEqual(100);
    });

    it("records timestamp for each event", () => {
      const before = Date.now();
      trackEvent("sync_completed");
      const after = Date.now();

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(buffer[0].timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("logMessage", () => {
    it("adds log entry to log buffer", () => {
      logMessage("info", "Test message", { context: "test" });

      const buffer = getLogBuffer();
      expect(buffer).toHaveLength(1);
      expect(buffer[0]).toMatchObject({
        level: "info",
        message: "Test message",
        context: { context: "test" },
      });
    });

    it("includes error in log entry", () => {
      const error = new Error("Test error");
      logMessage("error", "Error occurred", { code: 500 }, error);

      const buffer = getLogBuffer();
      expect(buffer[0].error).toBe(error);
      expect(buffer[0].level).toBe("error");
    });

    it("maintains buffer size limit", () => {
      for (let i = 0; i < 150; i++) {
        logMessage("debug", `Message ${i}`);
      }

      const buffer = getLogBuffer();
      expect(buffer.length).toBeLessThanOrEqual(100);
    });
  });

  describe("trackSyncEvent", () => {
    it("tracks sync started event", () => {
      trackSyncEvent("started", { userId: "123" });

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("sync_started");
    });

    it("tracks sync completed event", () => {
      trackSyncEvent("completed", { duration: 500 });

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("sync_completed");
    });

    it("tracks sync failed event", () => {
      trackSyncEvent("failed", { error: "Network error" });

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("sync_failed");
    });
  });

  describe("trackAuthEvent", () => {
    it("tracks login event", () => {
      trackAuthEvent("login", "user123", { provider: "google" });

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("auth_login");
      expect(buffer[0].userId).toBe("user123");
    });

    it("tracks logout event", () => {
      trackAuthEvent("logout", "user123");

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("auth_logout");
    });
  });

  describe("trackError", () => {
    it("logs error and tracks error event", () => {
      const error = new Error("Test error");
      trackError(error, { component: "SyncStatus" });

      const logs = getLogBuffer();
      const events = getAnalyticsBuffer();

      expect(logs).toHaveLength(1);
      expect(logs[0].error).toBe(error);
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("error_occurred");
    });
  });

  describe("trackFeatureUsage", () => {
    it("tracks feature usage", () => {
      trackFeatureUsage("export_data", { format: "json" });

      const buffer = getAnalyticsBuffer();
      expect(buffer[0].type).toBe("feature_used");
      expect(buffer[0].metadata).toMatchObject({
        feature: "export_data",
        format: "json",
      });
    });
  });

  describe("clearBuffers", () => {
    it("clears both analytics and log buffers", () => {
      trackEvent("sync_completed");
      logMessage("info", "Test");

      clearBuffers();

      expect(getAnalyticsBuffer()).toHaveLength(0);
      expect(getLogBuffer()).toHaveLength(0);
    });
  });

  describe("exportAnalytics", () => {
    it("returns both events and logs", () => {
      trackEvent("sync_completed");
      logMessage("info", "Test");

      const exported = exportAnalytics();

      expect(exported.events).toHaveLength(1);
      expect(exported.logs).toHaveLength(1);
      expect(exported).toHaveProperty("exportedAt");
    });

    it("includes export timestamp", () => {
      const before = Date.now();
      const exported = exportAnalytics();
      const after = Date.now();

      expect(exported.exportedAt).toBeGreaterThanOrEqual(before);
      expect(exported.exportedAt).toBeLessThanOrEqual(after);
    });
  });

  describe("getAnalyticsSummary", () => {
    it("returns summary of analytics", () => {
      trackEvent("sync_completed");
      trackEvent("auth_login");
      logMessage("info", "Test");
      logMessage("error", "Error");

      const summary = getAnalyticsSummary();

      expect(summary.totalEvents).toBeGreaterThan(0);
      expect(summary.errorCount).toBe(1);
      expect(summary.timeRange.start).toBeLessThanOrEqual(summary.timeRange.end);
    });

    it("counts event types correctly", () => {
      trackEvent("sync_completed");
      trackEvent("sync_completed");
      trackEvent("auth_login");

      const summary = getAnalyticsSummary();

      expect(summary.eventTypes.sync_completed).toBe(2);
      expect(summary.eventTypes.auth_login).toBe(1);
    });

    it("counts log levels correctly", () => {
      logMessage("info", "Test");
      logMessage("error", "Error");
      logMessage("error", "Another error");

      const summary = getAnalyticsSummary();

      expect(summary.logLevels.info).toBe(1);
      expect(summary.logLevels.error).toBe(2);
    });
  });
});
