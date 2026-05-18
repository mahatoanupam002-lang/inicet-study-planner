export type EventType =
  | "sync_started"
  | "sync_completed"
  | "sync_failed"
  | "auth_login"
  | "auth_logout"
  | "error_occurred"
  | "feature_used";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  error?: Error;
  context?: Record<string, unknown>;
}

// Store analytics events in memory (would be sent to backend in production)
const analyticsBuffer: AnalyticsEvent[] = [];
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Track an analytics event
 */
export function trackEvent(
  type: EventType,
  metadata?: Record<string, unknown>,
  userId?: string
): void {
  const event: AnalyticsEvent = {
    type,
    timestamp: Date.now(),
    userId,
    metadata,
  };

  analyticsBuffer.push(event);

  // Maintain buffer size limit
  if (analyticsBuffer.length > MAX_BUFFER_SIZE) {
    analyticsBuffer.shift();
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${type}`, metadata);
  }
}

/**
 * Log a message with optional context
 */
export function logMessage(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: Date.now(),
    error,
    context,
  };

  logBuffer.push(entry);

  // Maintain buffer size limit
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const prefix = `[${level.toUpperCase()}]`;
    if (level === "error") {
      console.error(prefix, message, context, error);
    } else if (level === "warn") {
      console.warn(prefix, message, context);
    } else if (level === "info") {
      console.info(prefix, message, context);
    } else {
      console.debug(prefix, message, context);
    }
  }
}

/**
 * Track sync operation metrics
 */
export function trackSyncEvent(
  status: "started" | "completed" | "failed",
  metadata?: Record<string, unknown>
): void {
  const typeMap = {
    started: "sync_started" as const,
    completed: "sync_completed" as const,
    failed: "sync_failed" as const,
  };

  trackEvent(typeMap[status], metadata);
}

/**
 * Track authentication events
 */
export function trackAuthEvent(
  action: "login" | "logout",
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  const typeMap = {
    login: "auth_login" as const,
    logout: "auth_logout" as const,
  };

  trackEvent(typeMap[action], metadata, userId);
}

/**
 * Track error occurrence
 */
export function trackError(
  error: Error,
  context?: Record<string, unknown>
): void {
  logMessage("error", error.message, context, error);
  trackEvent("error_occurred", {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  feature: string,
  metadata?: Record<string, unknown>
): void {
  trackEvent("feature_used", { feature, ...metadata });
}

/**
 * Get analytics buffer for reporting
 */
export function getAnalyticsBuffer(): AnalyticsEvent[] {
  return [...analyticsBuffer];
}

/**
 * Get log buffer for debugging
 */
export function getLogBuffer(): LogEntry[] {
  return [...logBuffer];
}

/**
 * Clear buffers (useful after sending to backend)
 */
export function clearBuffers(): void {
  analyticsBuffer.length = 0;
  logBuffer.length = 0;
}

/**
 * Export analytics for sending to backend
 */
export function exportAnalytics(): {
  events: AnalyticsEvent[];
  logs: LogEntry[];
  exportedAt: number;
} {
  return {
    events: getAnalyticsBuffer(),
    logs: getLogBuffer(),
    exportedAt: Date.now(),
  };
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary(): {
  totalEvents: number;
  eventTypes: Record<EventType, number>;
  logLevels: Record<LogLevel, number>;
  errorCount: number;
  timeRange: { start: number; end: number };
} {
  const eventTypes = {} as Record<EventType, number>;
  const logLevels = {} as Record<LogLevel, number>;

  analyticsBuffer.forEach(event => {
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });

  logBuffer.forEach(log => {
    logLevels[log.level] = (logLevels[log.level] || 0) + 1;
  });

  const errorCount = logBuffer.filter(log => log.level === "error").length;
  const allTimestamps = [
    ...analyticsBuffer.map(e => e.timestamp),
    ...logBuffer.map(l => l.timestamp),
  ];

  return {
    totalEvents: analyticsBuffer.length + logBuffer.length,
    eventTypes,
    logLevels,
    errorCount,
    timeRange: {
      start: Math.min(...allTimestamps, Date.now()),
      end: Math.max(...allTimestamps, Date.now()),
    },
  };
}
