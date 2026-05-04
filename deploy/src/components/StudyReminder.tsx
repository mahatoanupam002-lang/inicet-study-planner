import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

export interface ReminderConfig { enabled: boolean; time: string; }

const DEFAULT: ReminderConfig = { enabled: false, time: "07:00" };
const CONFIG_KEY  = "inicet_reminder";
const FIRED_KEY   = () => `inicet_reminder_fired_${new Date().toISOString().slice(0, 10)}`;

function msUntil(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  const fire   = new Date();
  fire.setHours(h, m, 0, 0);
  return fire.getTime() - Date.now();
}

/** Full-width banner that appears when the reminder time has passed and user hasn't studied today. */
export function StudyReminderBanner({ studiedToday }: { studiedToday: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cfg   = safeLoad<ReminderConfig>(CONFIG_KEY, DEFAULT);
    if (!cfg.enabled || studiedToday) return;
    const fired = safeLoad<boolean>(FIRED_KEY(), false);
    if (!fired && msUntil(cfg.time) < 0) setVisible(true);
  }, [studiedToday]);

  if (!visible) return null;

  return (
    <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-orange-400 flex-shrink-0" />
        <p className="text-xs font-mono text-orange-300">
          Study reminder — time to study! Open the Planner and mark today's progress.
        </p>
      </div>
      <button
        onClick={() => { safeSave(FIRED_KEY(), true); setVisible(false); }}
        className="text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Bell icon + popover for configuring the reminder. Schedules a browser notification via setTimeout. */
export function StudyReminderBell({ studiedToday }: { studiedToday: boolean }) {
  const [config, setConfig] = useState<ReminderConfig>(() => safeLoad(CONFIG_KEY, DEFAULT));
  const [open,   setOpen]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!config.enabled) return;
    const alreadyFired = safeLoad<boolean>(FIRED_KEY(), false);
    const ms           = msUntil(config.time);
    if (ms > 0 && !alreadyFired) {
      timerRef.current = setTimeout(() => {
        safeSave(FIRED_KEY(), true);
        if (!studiedToday && Notification.permission === "granted") {
          new Notification("INI-CET Study Reminder", {
            body: "Time to study! Keep your streak alive.",
            icon: "/icon-192.png",
          });
        }
      }, ms);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const save = (next: ReminderConfig) => {
    setConfig(next);
    safeSave(CONFIG_KEY, next);
    if (next.enabled && Notification.permission === "default")
      Notification.requestPermission();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        title={config.enabled ? `Reminder at ${config.time}` : "Set daily study reminder"}
        className={`p-1.5 rounded border border-transparent hover:border-border transition-colors ${
          config.enabled ? "text-orange-400" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {config.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl p-4 shadow-xl z-50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono uppercase text-muted-foreground">Daily Reminder</p>
              <button onClick={() => setOpen(false)}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs font-mono text-foreground">Enable</span>
                <button
                  onClick={() => save({ ...config, enabled: !config.enabled })}
                  className={`w-9 h-5 rounded-full transition-colors relative ${config.enabled ? "bg-orange-500" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${config.enabled ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </label>
              <div>
                <label className="text-[10px] font-mono text-muted-foreground block mb-1">Reminder time</label>
                <input
                  type="time"
                  value={config.time}
                  onChange={e => save({ ...config, time: e.target.value })}
                  disabled={!config.enabled}
                  className="w-full bg-background border border-border rounded px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
                />
              </div>
              {config.enabled && Notification.permission === "denied" && (
                <p className="text-[10px] text-destructive font-mono">
                  Browser notifications are blocked. Allow them in site settings for push alerts.
                </p>
              )}
              <p className="text-[10px] text-muted-foreground font-mono">
                A banner appears in-app; a browser notification fires if the tab is open at that time.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
