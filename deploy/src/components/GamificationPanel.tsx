import { useEffect, useRef, useState } from "react";
import { Trophy, Star, Lock, Share2, Crown, Zap, Users, Medal, ChevronUp } from "lucide-react";
import { getRank, getNextRank, getRankProgress, RANKS } from "@/lib/xp";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Props {
  xp: number;
  unlockedIds: string[];
  completedDays: number;
  streak: number;
  displayName?: string;
}

interface LeaderEntry {
  display_name: string | null;
  xp: number;
  rank_title: string;
  streak: number;
  completed: number;
  user_id: string;
}

const RARITY_STYLE: Record<string, string> = {
  common:    'border-slate-700 bg-slate-800/40',
  rare:      'border-blue-700/60 bg-blue-900/20',
  epic:      'border-violet-600/60 bg-violet-900/20',
  legendary: 'border-yellow-500/60 bg-yellow-900/20',
};

const RARITY_LABEL: Record<string, string> = {
  common:    'text-slate-400',
  rare:      'text-blue-400',
  epic:      'text-violet-400',
  legendary: 'text-yellow-400',
};

function ShareCard({ xp, rank, streak, completed, displayName }: {
  xp: number; rank: ReturnType<typeof getRank>; streak: number; completed: number; displayName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 600, H = 315;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a0e1a");
    bg.addColorStop(1, "#0f1629");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Border glow
    ctx.strokeStyle = "rgba(139,92,246,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

    // Top accent line
    const accent = ctx.createLinearGradient(0, 0, W, 0);
    accent.addColorStop(0, "transparent");
    accent.addColorStop(0.3, "#8b5cf6");
    accent.addColorStop(0.7, "#3b82f6");
    accent.addColorStop(1, "transparent");
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(W, 2);
    ctx.stroke();

    // Title
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillText("NEET PG WAR PLAN // PROGRESS REPORT", 24, 32);

    // Rank emoji + title
    ctx.font = "bold 40px serif";
    ctx.fillText(rank.emoji, 24, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px 'Courier New', monospace";
    ctx.fillText(rank.title.toUpperCase(), 76, 82);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillText(displayName || "Aspirant", 76, 102);

    // XP
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "bold 48px 'Courier New', monospace";
    ctx.fillText(xp.toLocaleString(), 24, 165);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "13px 'Courier New', monospace";
    ctx.fillText("TOTAL XP", 24, 185);

    // Stats row
    const stats = [
      { label: "DAYS DONE", value: `${completed}/28` },
      { label: "STREAK",    value: `${streak} days`  },
    ];
    stats.forEach((s, i) => {
      const x = 24 + i * 180;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.fillText(s.value, x, 235);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "11px 'Courier New', monospace";
      ctx.fillText(s.label, x, 255);
    });

    // Bottom tag
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px 'Courier New', monospace";
    ctx.fillText("Nov 16, 2026 • NEET PG", W - 180, H - 16);
  }, [xp, rank, streak, completed, displayName]);

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async blob => {
      if (!blob) return;
      try {
        if (navigator.share && navigator.canShare({ files: [new File([blob], "progress.png", { type: "image/png" })] })) {
          await navigator.share({
            title: "My NEET PG Progress",
            files: [new File([blob], "progress.png", { type: "image/png" })],
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `neetpg-progress-${new Date().toISOString().slice(0, 10)}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* user cancelled */ }
    }, "image/png");
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <canvas
        ref={canvasRef}
        className="rounded-xl border border-border w-full max-w-[480px] shadow-lg"
        style={{ aspectRatio: "600/315" }}
      />
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-mono text-sm transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {copied ? "Saved!" : "Download / Share"}
      </button>
    </div>
  );
}

function Leaderboard({ currentUserId }: { currentUserId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("leaderboard")
      .select("user_id,display_name,xp,rank_title,streak,completed")
      .order("xp", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setEntries((data as LeaderEntry[]) ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono text-sm">
        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p>No entries yet. Complete days to appear on the leaderboard!</p>
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex flex-col gap-1">
      {entries.map((e, i) => {
        const isMe = e.user_id === currentUserId;
        return (
          <div
            key={e.user_id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
              isMe
                ? "border-violet-500/50 bg-violet-500/10"
                : "border-border bg-card/60"
            }`}
          >
            <span className="w-6 text-center font-mono text-sm">
              {i < 3 ? medals[i] : `${i + 1}`}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold truncate">
                  {e.display_name ?? "Aspirant"}
                  {isMe && <span className="ml-1 text-[10px] text-violet-400">(you)</span>}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">{e.rank_title}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-muted-foreground font-mono">{e.completed}/28 days</span>
                <span className="text-[10px] text-orange-400 font-mono">🔥 {e.streak}</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-violet-400 tabular-nums">{e.xp.toLocaleString()} XP</span>
          </div>
        );
      })}
    </div>
  );
}

type PanelTab = 'rank' | 'achievements' | 'leaderboard' | 'share';

export function GamificationPanel({ xp, unlockedIds, completedDays, streak, displayName }: Props) {
  const { user } = useAuth();
  const [tab, setTab] = useState<PanelTab>('rank');
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const progress = getRankProgress(xp);

  const tabs: { id: PanelTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'rank',         label: 'My Rank',      Icon: Crown       },
    { id: 'achievements', label: 'Achievements',  Icon: Trophy      },
    { id: 'leaderboard',  label: 'Leaderboard',   Icon: Users       },
    { id: 'share',        label: 'Share',         Icon: Share2      },
  ];

  const unlockedAchievements = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
  const lockedAchievements   = ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">

      {/* XP Hero Card */}
      <div className={`rounded-2xl border p-6 ${rank.bg} border-opacity-60`} style={{ borderColor: 'currentColor' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`text-5xl select-none`}>{rank.emoji}</div>
            <div>
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Current Rank</p>
              <h2 className={`text-2xl font-mono font-bold ${rank.color}`}>{rank.title}</h2>
              <p className="text-3xl font-mono font-black text-foreground mt-1">
                {xp.toLocaleString()} <span className="text-base font-normal text-muted-foreground">XP</span>
              </p>
            </div>
          </div>

          {nextRank && (
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                <span>{rank.title}</span>
                <span>{nextRank.title} {nextRank.emoji}</span>
              </div>
              <div className="h-2.5 bg-background/60 rounded-full overflow-hidden border border-border">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, #8b5cf6, #3b82f6)`,
                  }}
                />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mt-1 text-right">
                {nextRank.min - xp} XP to next rank
              </p>
            </div>
          )}
        </div>

        {/* Rank ladder */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {RANKS.map(r => {
            const isActive = r.title === rank.title;
            const isPast   = xp >= r.min;
            return (
              <div
                key={r.title}
                title={`${r.emoji} ${r.title} (${r.min.toLocaleString()} XP)`}
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-base transition-all ${
                  isActive
                    ? 'ring-2 ring-white/50 scale-110'
                    : isPast
                    ? 'opacity-60'
                    : 'opacity-20 grayscale'
                }`}
              >
                {r.emoji}
              </div>
            );
          })}
        </div>
      </div>

      {/* Inner tabs */}
      <div className="flex bg-card border border-border rounded-lg p-1 gap-1">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-mono font-medium transition-colors ${
              tab === id
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'rank' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total XP',      value: xp.toLocaleString(),    Icon: Zap,   color: 'text-violet-400' },
            { label: 'Days Complete', value: `${completedDays}/28`,  Icon: Medal, color: 'text-green-400'  },
            { label: 'Best Streak',   value: `${streak} days`,       Icon: Star,  color: 'text-orange-400' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <p className="text-2xl font-mono font-bold">{value}</p>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
            </div>
          ))}

          <div className="sm:col-span-3 bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">XP Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {[
                { label: 'Study day',   value: '50 XP' },
                { label: 'MCQ correct', value: '5 XP'  },
                { label: 'PYQ correct', value: '8 XP'  },
                { label: 'Drill done',  value: '25 XP' },
                { label: 'Simulation',  value: '100 XP' },
                { label: 'Note added',  value: '10 XP' },
                { label: '7-day streak','value': '200 XP' },
                { label: 'AI chat',     value: '5 XP'  },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-border/40 pb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-violet-400 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'achievements' && (
        <div className="flex flex-col gap-4">
          {unlockedAchievements.length > 0 && (
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                Unlocked ({unlockedAchievements.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unlockedAchievements.map(a => (
                  <AchievementCard key={a.id} a={a} unlocked />
                ))}
              </div>
            </div>
          )}
          {lockedAchievements.length > 0 && (
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                Locked ({lockedAchievements.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lockedAchievements.map(a => (
                  <AchievementCard key={a.id} a={a} unlocked={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChevronUp className="w-4 h-4 text-violet-400" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Top Aspirants</p>
          </div>
          <Leaderboard currentUserId={user?.id} />
        </div>
      )}

      {tab === 'share' && (
        <ShareCard
          xp={xp}
          rank={rank}
          streak={streak}
          completed={completedDays}
          displayName={displayName ?? user?.email ?? 'Aspirant'}
        />
      )}
    </div>
  );
}

function AchievementCard({ a, unlocked }: { a: Achievement; unlocked: boolean }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
      unlocked
        ? RARITY_STYLE[a.rarity]
        : 'border-border/40 bg-card/30 opacity-50'
    }`}>
      <span className={`text-2xl select-none ${unlocked ? '' : 'grayscale'}`}>
        {unlocked ? a.emoji : <Lock className="w-6 h-6 text-muted-foreground" />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold truncate">{a.title}</span>
          <span className={`text-[9px] font-mono uppercase font-bold ${RARITY_LABEL[a.rarity]}`}>
            {a.rarity}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{a.description}</p>
        {unlocked && (
          <span className="text-[10px] text-violet-400 font-mono">+{a.xpReward} XP</span>
        )}
      </div>
    </div>
  );
}
