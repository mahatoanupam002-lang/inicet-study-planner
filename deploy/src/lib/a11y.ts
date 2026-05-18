/**
 * Accessibility utilities for ARIA attributes and keyboard navigation
 */

export interface AriaLiveRegionConfig {
  politeness: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: string;
}

/**
 * Generate ARIA attributes for live regions
 */
export function createAriaLiveRegion(
  message: string,
  config: AriaLiveRegionConfig = { politeness: "polite" }
): Record<string, string | boolean> {
  return {
    role: "status",
    "aria-live": config.politeness,
    "aria-atomic": config.atomic ?? false,
    "aria-relevant": config.relevant ?? "additions text",
  };
}

/**
 * Create ARIA attributes for loading state
 */
export function createAriaLoading(isLoading: boolean): Record<string, string | boolean> {
  return {
    "aria-busy": isLoading,
    "aria-disabled": isLoading,
  };
}

/**
 * Create ARIA attributes for error/alert state
 */
export function createAriaAlert(error: string | null): Record<string, string | boolean | undefined> {
  if (!error) return {};

  return {
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": true,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

/**
 * Check if device has touch capability
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0 ||
    "ontouchstart" in window
  );
}

/**
 * Create ARIA attributes for expandable section
 */
export function createAriaExpandable(
  isExpanded: boolean,
  controlId: string
): Record<string, string | boolean> {
  return {
    "aria-expanded": isExpanded,
    "aria-controls": controlId,
  };
}

/**
 * Create ARIA attributes for dismissable element
 */
export function createAriaDismissable(): Record<string, string | boolean> {
  return {
    "aria-hidden": "false",
  };
}

/**
 * List of keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
} as const;

/**
 * Check if a key event matches a specific keyboard shortcut
 */
export function matchesKeyboardShortcut(
  event: KeyboardEvent,
  shortcut: keyof typeof KEYBOARD_SHORTCUTS,
  options: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}
): boolean {
  return (
    event.key === KEYBOARD_SHORTCUTS[shortcut] &&
    event.ctrlKey === (options.ctrlKey ?? false) &&
    event.shiftKey === (options.shiftKey ?? false) &&
    event.altKey === (options.altKey ?? false)
  );
}

/**
 * Focus trap helper for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];

  const focusableElements = container.querySelectorAll<HTMLElement>(
    focusableSelectors.join(", ")
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  return {
    activate: () => {
      container.addEventListener("keydown", handleKeyDown);
      firstElement?.focus();
    },
    deactivate: () => {
      container.removeEventListener("keydown", handleKeyDown);
    },
  };
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(
  message: string,
  politeness: "polite" | "assertive" = "polite"
): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", politeness);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.position = "absolute";
  announcement.style.left = "-9999px";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get visible text for element (useful for testing)
 */
export function getVisibleText(element: HTMLElement): string {
  return element.textContent?.trim() ?? "";
}

/**
 * Check if element is visible to user
 */
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetParent ||
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}
