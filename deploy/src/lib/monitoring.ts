import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

export interface MetricsData {
  lcp?: number; // Largest Contentful Paint (ms)
  inp?: number; // Interaction to Next Paint (ms)
  cls?: number; // Cumulative Layout Shift (0-1)
  ttfb?: number; // Time to First Byte (ms)
  timestamp: number;
}

export interface SyncMetrics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalRetries: number;
  averageLatency: number;
  lastSyncTime: number | null;
}

const metrics: MetricsData = {
  timestamp: Date.now(),
};

const syncMetrics: SyncMetrics = {
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  totalRetries: 0,
  averageLatency: 0,
  lastSyncTime: null,
};

// Track individual sync operations for latency calculation
const syncLatencies: number[] = [];

/**
 * Initialize Web Vitals monitoring
 */
export function initializeWebVitals(): void {
  onCLS((metric: Metric) => {
    metrics.cls = metric.value;
    reportMetric("CLS", metric.value);
  });

  onINP((metric: Metric) => {
    metrics.inp = metric.value;
    reportMetric("INP", metric.value);
  });

  onLCP((metric: Metric) => {
    metrics.lcp = metric.value;
    reportMetric("LCP", metric.value);
  });

  onTTFB((metric: Metric) => {
    metrics.ttfb = metric.value;
    reportMetric("TTFB", metric.value);
  });
}

/**
 * Report a sync operation to metrics
 */
export function reportSyncMetrics(
  status: "success" | "failure",
  latency: number,
  retryCount: number = 0
): void {
  syncMetrics.totalSyncs++;

  if (status === "success") {
    syncMetrics.successfulSyncs++;
  } else {
    syncMetrics.failedSyncs++;
  }

  syncMetrics.totalRetries += retryCount;
  syncMetrics.lastSyncTime = Date.now();

  // Track latency for average calculation
  syncLatencies.push(latency);
  syncMetrics.averageLatency =
    syncLatencies.reduce((a, b) => a + b, 0) / syncLatencies.length;
}

/**
 * Get current metrics snapshot
 */
export function getMetrics(): { webVitals: MetricsData; sync: SyncMetrics } {
  return {
    webVitals: { ...metrics, timestamp: Date.now() },
    sync: { ...syncMetrics },
  };
}

/**
 * Reset sync metrics (useful for periodic reporting)
 */
export function resetSyncMetrics(): void {
  syncMetrics.totalSyncs = 0;
  syncMetrics.successfulSyncs = 0;
  syncMetrics.failedSyncs = 0;
  syncMetrics.totalRetries = 0;
  syncMetrics.averageLatency = 0;
  syncMetrics.lastSyncTime = null;
  syncLatencies.length = 0;
}

/**
 * Internal function to report individual metrics
 */
function reportMetric(name: string, value: number): void {
  // In production, this would send to an analytics service
  if (process.env.NODE_ENV === "development") {
    console.debug(`[metrics] ${name}: ${value.toFixed(2)}`);
  }
}

/**
 * Calculate sync success rate percentage
 */
export function getSyncSuccessRate(): number {
  if (syncMetrics.totalSyncs === 0) return 100;
  return (syncMetrics.successfulSyncs / syncMetrics.totalSyncs) * 100;
}

/**
 * Check if metrics indicate good performance
 */
export function isPerformanceHealthy(): boolean {
  return (
    (metrics.lcp === undefined || metrics.lcp < 2500) && // Good LCP: < 2.5s
    (metrics.inp === undefined || metrics.inp < 200) && // Good INP: < 200ms
    (metrics.cls === undefined || metrics.cls < 0.1) && // Good CLS: < 0.1
    getSyncSuccessRate() > 95 // Good sync: > 95% success
  );
}
