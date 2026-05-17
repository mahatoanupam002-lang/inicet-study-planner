import { useEffect } from "react";

interface ShortcutHandlers {
  onCommandPalette: () => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
}

export function useKeyboardShortcuts({
  onCommandPalette,
  onPrevDay,
  onNextDay,
}: ShortcutHandlers): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onCommandPalette();
        return;
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) return;

      if (e.key === "j" && onNextDay) { e.preventDefault(); onNextDay(); }
      if (e.key === "k" && onPrevDay) { e.preventDefault(); onPrevDay(); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCommandPalette, onPrevDay, onNextDay]);
}
