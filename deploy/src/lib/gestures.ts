export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: "left" | "right" | "up" | "down";
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  distance: number;
}

const SWIPE_THRESHOLD = 50; // Minimum distance for swipe
const SWIPE_VELOCITY_THRESHOLD = 0.5; // Minimum velocity (pixels/ms)
const LONG_PRESS_DURATION = 500; // Milliseconds

/**
 * Track touch start position for gesture detection
 */
export function trackTouchStart(): {
  start: GesturePoint | null;
  update: (e: TouchEvent) => void;
} {
  let start: GesturePoint | null = null;

  return {
    start,
    update: (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      start = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };
    },
  };
}

/**
 * Detect swipe gesture from touch events
 */
export function detectSwipe(
  startPoint: GesturePoint,
  endPoint: GesturePoint
): SwipeGesture | null {
  const deltaX = endPoint.x - startPoint.x;
  const deltaY = endPoint.y - startPoint.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const duration = endPoint.timestamp - startPoint.timestamp;
  const velocity = distance / duration;

  // Check if gesture meets swipe criteria
  if (distance < SWIPE_THRESHOLD || velocity < SWIPE_VELOCITY_THRESHOLD) {
    return null;
  }

  // Determine direction based on dominant axis
  const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
  let direction: "left" | "right" | "up" | "down";

  if (isHorizontal) {
    direction = deltaX > 0 ? "right" : "left";
  } else {
    direction = deltaY > 0 ? "down" : "up";
  }

  return {
    direction,
    distance,
    velocity,
    duration,
  };
}

/**
 * Detect pinch gesture from two-finger touch
 */
export function detectPinch(
  startTouches: TouchList,
  currentTouches: TouchList
): PinchGesture | null {
  if (startTouches.length < 2 || currentTouches.length < 2) {
    return null;
  }

  const startDist = calculateTouchDistance(startTouches[0], startTouches[1]);
  const currentDist = calculateTouchDistance(currentTouches[0], currentTouches[1]);

  if (startDist === 0) return null;

  return {
    scale: currentDist / startDist,
    distance: currentDist,
  };
}

/**
 * Calculate distance between two touches
 */
function calculateTouchDistance(touch1: Touch, touch2: Touch): number {
  const deltaX = touch2.clientX - touch1.clientX;
  const deltaY = touch2.clientY - touch1.clientY;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Create a long press handler
 */
export function createLongPressHandler(
  element: HTMLElement,
  onLongPress: () => void,
  duration: number = LONG_PRESS_DURATION
): { destroy: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isLongPress = false;

  const handleTouchStart = () => {
    isLongPress = false;
    timeoutId = setTimeout(() => {
      isLongPress = true;
      onLongPress();
    }, duration);
  };

  const handleTouchEnd = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleMouseDown = () => {
    isLongPress = false;
    timeoutId = setTimeout(() => {
      isLongPress = true;
      onLongPress();
    }, duration);
  };

  const handleMouseUp = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  element.addEventListener("touchstart", handleTouchStart);
  element.addEventListener("touchend", handleTouchEnd);
  element.addEventListener("mousedown", handleMouseDown);
  element.addEventListener("mouseup", handleMouseUp);

  return {
    destroy: () => {
      if (timeoutId) clearTimeout(timeoutId);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
    },
  };
}

/**
 * Create a double-tap handler for mobile
 */
export function createDoubleTapHandler(
  element: HTMLElement,
  onDoubleTap: () => void,
  tapInterval: number = 300
): { destroy: () => void } {
  let lastTapTime = 0;
  let tapCount = 0;

  const handleTouchEnd = () => {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime;

    if (timeSinceLastTap < tapInterval) {
      tapCount++;
      if (tapCount === 2) {
        onDoubleTap();
        tapCount = 0;
      }
    } else {
      tapCount = 1;
    }

    lastTapTime = currentTime;
  };

  element.addEventListener("touchend", handleTouchEnd);

  return {
    destroy: () => {
      element.removeEventListener("touchend", handleTouchEnd);
    },
  };
}

/**
 * Detect pull-to-refresh gesture
 */
export function detectPullToRefresh(
  startPoint: GesturePoint,
  currentPoint: GesturePoint,
  threshold: number = 100
): boolean {
  const deltaY = currentPoint.y - startPoint.y;
  return deltaY > threshold && window.scrollY === 0;
}

/**
 * Haptic feedback for mobile devices (vibration)
 */
export function triggerHapticFeedback(pattern: "light" | "medium" | "heavy" = "medium"): void {
  if (!navigator.vibrate) return;

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [40],
  };

  navigator.vibrate(patterns[pattern]);
}
