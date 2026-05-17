import { useState, useEffect, useRef } from "react";
import { Search, Command } from "lucide-react";
import { NAV_GROUPS, type NavGroup, type MainTab } from "@/lib/nav-config";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (group: NavGroup, tab: MainTab) => void;
}

interface CommandItem {
  id: MainTab;
  label: string;
  groupId: NavGroup;
  groupLabel: string;
}

const ALL_COMMANDS: CommandItem[] = NAV_GROUPS.flatMap(g =>
  g.tabs.map(t => ({
    id: t.id,
    label: t.label,
    groupId: g.id,
    groupLabel: g.label,
  }))
);

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery]             = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef                      = useRef<HTMLInputElement>(null);
  const listRef                       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.groupLabel.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS;

  useEffect(() => { setSelectedIdx(0); }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = filtered[selectedIdx];
      if (item) { onNavigate(item.groupId, item.id); onClose(); }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden">

        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tabs…"
            className="flex-1 bg-transparent text-sm font-mono focus:outline-none placeholder:text-muted-foreground/50"
            aria-label="Search tabs"
            aria-autocomplete="list"
            aria-controls="cmd-results"
            aria-activedescendant={filtered[selectedIdx] ? `cmd-${filtered[selectedIdx].id}` : undefined}
          />
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-muted-foreground/50 px-1.5 py-0.5 border border-border rounded">
            ESC
          </kbd>
        </div>

        <div
          id="cmd-results"
          ref={listRef}
          className="max-h-72 overflow-y-auto py-2"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground text-center py-6">No results</p>
          ) : (
            filtered.map((item, idx) => {
              const group = NAV_GROUPS.find(g => g.id === item.groupId);
              const tab   = group?.tabs.find(t => t.id === item.id);
              const Icon  = tab?.Icon;
              return (
                <button
                  key={item.id}
                  id={`cmd-${item.id}`}
                  role="option"
                  aria-selected={idx === selectedIdx}
                  onClick={() => { onNavigate(item.groupId, item.id); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                    idx === selectedIdx
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  <span className="font-mono flex-1">{item.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/50">{item.groupLabel}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/50">
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>Esc close</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40">
            <Command className="w-3 h-3" aria-hidden="true" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
