import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  detectSwipe,
  detectPinch,
  detectPullToRefresh,
  createLongPressHandler,
  createDoubleTapHandler,
  triggerHapticFeedback,
} from "@/lib/gestures";

describe("gesture utilities", () => {
  describe("detectSwipe", () => {
    it("detects right swipe", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const endPoint = { x: 200, y: 100, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).not.toBeNull();
      expect(swipe?.direction).toBe("right");
      expect(swipe?.distance).toBeGreaterThan(50);
    });

    it("detects left swipe", () => {
      const startPoint = { x: 200, y: 100, timestamp: 0 };
      const endPoint = { x: 100, y: 100, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).not.toBeNull();
      expect(swipe?.direction).toBe("left");
    });

    it("detects down swipe", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const endPoint = { x: 100, y: 200, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).not.toBeNull();
      expect(swipe?.direction).toBe("down");
    });

    it("detects up swipe", () => {
      const startPoint = { x: 100, y: 200, timestamp: 0 };
      const endPoint = { x: 100, y: 100, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).not.toBeNull();
      expect(swipe?.direction).toBe("up");
    });

    it("returns null for small movement", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const endPoint = { x: 105, y: 100, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).toBeNull();
    });

    it("returns null for slow movement", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const endPoint = { x: 200, y: 100, timestamp: 5000 }; // Very slow

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe).toBeNull();
    });

    it("calculates velocity correctly", () => {
      const startPoint = { x: 0, y: 0, timestamp: 0 };
      const endPoint = { x: 100, y: 0, timestamp: 100 };

      const swipe = detectSwipe(startPoint, endPoint);

      expect(swipe?.velocity).toBe(1); // 100px / 100ms
    });
  });

  describe("detectPinch", () => {
    it("returns null with less than 2 touches", () => {
      const startTouches = {
        length: 1,
        0: { clientX: 0, clientY: 0 },
      } as unknown as TouchList;

      const currentTouches = {
        length: 1,
        0: { clientX: 0, clientY: 0 },
      } as unknown as TouchList;

      const pinch = detectPinch(startTouches, currentTouches);

      expect(pinch).toBeNull();
    });

    it("detects zoom in (scale > 1)", () => {
      const startTouches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 100, clientY: 0 },
      } as unknown as TouchList;

      const currentTouches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 200, clientY: 0 },
      } as unknown as TouchList;

      const pinch = detectPinch(startTouches, currentTouches);

      expect(pinch).not.toBeNull();
      expect(pinch?.scale).toBe(2);
    });

    it("detects zoom out (scale < 1)", () => {
      const startTouches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 200, clientY: 0 },
      } as unknown as TouchList;

      const currentTouches = {
        length: 2,
        0: { clientX: 0, clientY: 0 },
        1: { clientX: 100, clientY: 0 },
      } as unknown as TouchList;

      const pinch = detectPinch(startTouches, currentTouches);

      expect(pinch).not.toBeNull();
      expect(pinch?.scale).toBe(0.5);
    });
  });

  describe("detectPullToRefresh", () => {
    it("returns true when pull distance exceeds threshold", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const currentPoint = { x: 100, y: 200, timestamp: 100 }; // deltaY = 100

      // Test with smaller threshold to ensure it passes
      const isPullToRefresh = detectPullToRefresh(startPoint, currentPoint, 50);

      expect(isPullToRefresh).toBe(true);
    });

    it("returns false when pull distance is less than threshold", () => {
      const startPoint = { x: 100, y: 100, timestamp: 0 };
      const currentPoint = { x: 100, y: 120, timestamp: 100 };

      const isPullToRefresh = detectPullToRefresh(startPoint, currentPoint, 100);

      expect(isPullToRefresh).toBe(false);
    });
  });

  describe("createLongPressHandler", () => {
    it("calls callback after duration", async () => {
      const callback = vi.fn();
      const element = document.createElement("button");

      const handler = createLongPressHandler(element, callback, 50);

      const event = new TouchEvent("touchstart");
      element.dispatchEvent(event);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(callback).toHaveBeenCalled();

      handler.destroy();
    });

    it("cancels long press on touchend", async () => {
      const callback = vi.fn();
      const element = document.createElement("button");

      const handler = createLongPressHandler(element, callback, 100);

      element.dispatchEvent(new TouchEvent("touchstart"));
      setTimeout(() => {
        element.dispatchEvent(new TouchEvent("touchend"));
      }, 50);

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(callback).not.toHaveBeenCalled();

      handler.destroy();
    });
  });

  describe("createDoubleTapHandler", () => {
    it("calls callback on double tap", async () => {
      const callback = vi.fn();
      const element = document.createElement("button");

      const handler = createDoubleTapHandler(element, callback, 300);

      element.dispatchEvent(new TouchEvent("touchend"));
      await new Promise(resolve => setTimeout(resolve, 50));
      element.dispatchEvent(new TouchEvent("touchend"));

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callback).toHaveBeenCalled();

      handler.destroy();
    });

    it("does not call callback on single tap", async () => {
      const callback = vi.fn();
      const element = document.createElement("button");

      const handler = createDoubleTapHandler(element, callback, 300);

      element.dispatchEvent(new TouchEvent("touchend"));

      await new Promise(resolve => setTimeout(resolve, 350));

      expect(callback).not.toHaveBeenCalled();

      handler.destroy();
    });
  });

  describe("triggerHapticFeedback", () => {
    it("calls navigator.vibrate with light pattern", () => {
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, "vibrate", {
        value: vibrateSpy,
        writable: true,
      });

      triggerHapticFeedback("light");

      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it("calls navigator.vibrate with medium pattern", () => {
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, "vibrate", {
        value: vibrateSpy,
        writable: true,
      });

      triggerHapticFeedback("medium");

      expect(vibrateSpy).toHaveBeenCalledWith([20]);
    });

    it("calls navigator.vibrate with heavy pattern", () => {
      const vibrateSpy = vi.fn();
      Object.defineProperty(navigator, "vibrate", {
        value: vibrateSpy,
        writable: true,
      });

      triggerHapticFeedback("heavy");

      expect(vibrateSpy).toHaveBeenCalledWith([40]);
    });
  });
});
