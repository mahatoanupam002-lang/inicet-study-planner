import { useRef, type ChangeEvent } from "react";
import { Download, Upload, Search } from "lucide-react";
import { NAV_GROUPS, type NavGroup, type MainTab } from "@/lib/nav-config";

interface AppNavProps {
  activeGroup: NavGroup;
  activeTab: MainTab;
  flagBadge?: number;
  completedCount: number;
  totalDays: number;
  onGroupClick: (id: NavGroup) => void;
  onTabClick: (id: MainTab) => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchOpen: () => void;
}

export function AppNav({
  activeGroup, activeTab, flagBadge, completedCount, totalDays,
  onGroupClick, onTabClick, onExport, onImport, onSearchOpen,
}: AppNavProps) {
  const importRef = useRef<HTMLInputElement>(null);
  const activeGroupData = NAV_GROUPS.find(g => g.id === activeGroup) ?? NAV_GROUPS[0];
  const showSubNav = activeGroupData.tabs.length > 1;

  return (
    <div className="sticky top-[57px] z-[9] bg-background border-b border-border/50">
      <div className="px-4 md:px-6 py-2 flex items-center justify-between gap-3">

        <nav
          className="flex gap-1 bg-card border border-border rounded-lg p-1 overflow-x-auto no-scrollbar"
          aria-label="Navigation groups"
        >
          {NAV_GROUPS.map(({ id, label, Icon }) => {
            const isActive = activeGroup === id;
            const hasBadge = id === 'practice' && flagBadge;
            return (
              <button
                key={id}
                onClick={() => onGroupClick(id)}
                className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
                {hasBadge && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center"
                    aria-label={`${flagBadge} flagged`}
                  >
                    {flagBadge > 99 ? '99' : flagBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap hidden sm:block">
            {completedCount}/{totalDays}
          </span>
          <div
            className="h-2 w-20 sm:w-32 bg-card rounded-full overflow-hidden border border-border"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalDays}
            aria-label={`Study progress: ${completedCount} of ${totalDays} days`}
          >
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / totalDays) * 100}%` }}
            />
          </div>
          <button
            onClick={onSearchOpen}
            title="Search / Command palette (Ctrl+K)"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
            aria-label="Open command palette"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={onImport}
            aria-hidden="true"
          />
          <button
            onClick={onExport}
            title="Export backup"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
            aria-label="Export progress backup"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={() => importRef.current?.click()}
            title="Import backup"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded border border-transparent hover:border-border"
            aria-label="Import progress backup"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {showSubNav && (
        <div className="px-4 md:px-6 pb-2">
          <div
            className="flex gap-1 overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label={`${activeGroupData.label} sections`}
          >
            {activeGroupData.tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => onTabClick(id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-colors ${
                  activeTab === id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
                {id === 'revision' && flagBadge ? (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-mono flex items-center justify-center">
                    {flagBadge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
