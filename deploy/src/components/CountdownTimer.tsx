import React from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Props {
  timeLeft: TimeLeft;
}

export function CountdownTimer({ timeLeft }: Props) {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const segments: { value: string; label: string; accent?: boolean }[] = [
    { value: pad(timeLeft.days),    label: "Days" },
    { value: pad(timeLeft.hours),   label: "Hrs" },
    { value: pad(timeLeft.minutes), label: "Min" },
    { value: pad(timeLeft.seconds), label: "Sec", accent: true },
  ];

  return (
    <div
      className="flex items-center gap-6 bg-background border border-border px-6 py-3 rounded-lg font-mono"
      role="timer"
      aria-label="Time remaining until exam"
      aria-live="off"
    >
      {segments.map((seg, i) => (
        <React.Fragment key={seg.label}>
          <div className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${seg.accent ? 'text-accent-foreground' : 'text-primary'}`}>
              {seg.value}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{seg.label}</span>
          </div>
          {i < segments.length - 1 && (
            <span className="text-border font-light">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
