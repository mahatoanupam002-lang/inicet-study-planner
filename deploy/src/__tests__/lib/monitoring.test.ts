import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  reportSyncMetrics,
  getMetrics,
  resetSyncMetrics,
  getSyncSuccessRate,
  isPerformanceHealthy,
} from "@/lib/monitoring";

describe("monitoring service", () => {
  beforeEach(() => {
    resetSyncMetrics();
  });

  describe("reportSyncMetrics", () => {
    it("tracks successful sync", () => {
      reportSyncMetrics("success", 500, 0);

      const { sync } = getMetrics();
      expect(sync.totalSyncs).toBe(1);
      expect(sync.successfulSyncs).toBe(1);
      expect(sync.failedSyncs).toBe(0);
      expect(sync.averageLatency).toBe(500);
    });

    it("tracks failed sync", () => {
      reportSyncMetrics("failure", 1000, 2);

      const { sync } = getMetrics();
      expect(sync.totalSyncs).toBe(1);
      expect(sync.successfulSyncs).toBe(0);
      expect(sync.failedSyncs).toBe(1);
      expect(sync.totalRetries).toBe(2);
    });

    it("calculates average latency correctly", () => {
      reportSyncMetrics("success", 100);
      reportSyncMetrics("success", 200);
      reportSyncMetrics("success", 300);

      const { sync } = getMetrics();
      expect(sync.averageLatency).toBe(200);
    });

    it("updates lastSyncTime on each sync", () => {
      const before = Date.now();
      reportSyncMetrics("success", 100);
      const after = Date.now();

      const { sync } = getMetrics();
      expect(sync.lastSyncTime).toBeGreaterThanOrEqual(before);
      expect(sync.lastSyncTime).toBeLessThanOrEqual(after);
    });
  });

  describe("getSyncSuccessRate", () => {
    it("returns 100% for no syncs", () => {
      expect(getSyncSuccessRate()).toBe(100);
    });

    it("calculates success rate correctly", () => {
      reportSyncMetrics("success", 100);
      reportSyncMetrics("success", 100);
      reportSyncMetrics("failure", 100);

      expect(getSyncSuccessRate()).toBeCloseTo(66.67, 1);
    });

    it("returns 0% when all syncs fail", () => {
      reportSyncMetrics("failure", 100);
      reportSyncMetrics("failure", 100);
      reportSyncMetrics("failure", 100);

      expect(getSyncSuccessRate()).toBe(0);
    });

    it("returns 100% when all syncs succeed", () => {
      reportSyncMetrics("success", 100);
      reportSyncMetrics("success", 100);

      expect(getSyncSuccessRate()).toBe(100);
    });
  });

  describe("isPerformanceHealthy", () => {
    it("returns true when all metrics are healthy", () => {
      reportSyncMetrics("success", 100);

      expect(isPerformanceHealthy()).toBe(true);
    });

    it("returns false when sync success rate is low", () => {
      for (let i = 0; i < 20; i++) {
        reportSyncMetrics("failure", 100);
      }

      expect(isPerformanceHealthy()).toBe(false);
    });
  });

  describe("resetSyncMetrics", () => {
    it("resets all sync metrics to zero", () => {
      reportSyncMetrics("success", 500, 1);
      reportSyncMetrics("failure", 1000, 2);

      resetSyncMetrics();

      const { sync } = getMetrics();
      expect(sync.totalSyncs).toBe(0);
      expect(sync.successfulSyncs).toBe(0);
      expect(sync.failedSyncs).toBe(0);
      expect(sync.totalRetries).toBe(0);
      expect(sync.averageLatency).toBe(0);
      expect(sync.lastSyncTime).toBeNull();
    });
  });

  describe("getMetrics", () => {
    it("returns current metrics snapshot", () => {
      reportSyncMetrics("success", 500);

      const metrics = getMetrics();
      expect(metrics).toHaveProperty("webVitals");
      expect(metrics).toHaveProperty("sync");
      expect(metrics.webVitals).toHaveProperty("timestamp");
      expect(metrics.sync.successfulSyncs).toBe(1);
    });

    it("returns separate objects on each call", () => {
      const metrics1 = getMetrics();
      const metrics2 = getMetrics();

      expect(metrics1).not.toBe(metrics2);
      expect(metrics1.sync).not.toBe(metrics2.sync);
    });
  });
});
