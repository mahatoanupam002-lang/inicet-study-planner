import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

const WORK_SECS  = 25 * 60;
const BREAK_SECS =  5 * 60;

export function PomodoroTimer() {
  const [mode,     setMode]     = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_SECS);
  const [running,  setRunning]  = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t > 1) return t - 1;
        // timer finished
        setRunning(false);
        if (mode === 'work') {
          setSessions(s => s + 1);
          setMode('break');
          setTimeLeft(BREAK_SECS);
          if (Notification.permission === 'granted')
            new Notification('Pomodoro done!', { body: 'Take a 5-min break.' });
        } else {
          setMode('work');
          setTimeLeft(WORK_SECS);
          if (Notification.permission === 'granted')
            new Notification('Break over!', { body: 'Back to work.' });
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const toggle = () => {
    if (!running && 'Notification' in window && Notification.permission === 'default')
      Notification.requestPermission();
    setRunning(r => !r);
  };

  const reset = () => { setRunning(false); setMode('work'); setTimeLeft(WORK_SECS); };

  const total  = mode === 'work' ? WORK_SECS : BREAK_SECS;
  const pct    = ((total - timeLeft) / total) * 100;
  const mins   = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs   = String(timeLeft % 60).padStart(2, '0');
  const C      = 2 * Math.PI * 50;
  const accent = mode === 'work' ? 'hsl(var(--primary))' : '#22c55e';

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {mode === 'work'
          ? <Brain  className="w-4 h-4 text-primary" />
          : <Coffee className="w-4 h-4 text-emerald-400" />}
        <h3 className="text-xs font-mono uppercase text-muted-foreground">
          {mode === 'work' ? 'Focus Session' : 'Break Time'}
        </h3>
        {sessions > 0 && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">
            {sessions} session{sessions !== 1 ? 's' : ''} today
          </span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold">{mins}:{secs}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-mono transition-colors"
          style={{ backgroundColor: accent, color: '#fff' }}
        >
          {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          title="Reset"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
