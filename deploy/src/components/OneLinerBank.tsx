import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Zap, Search, CheckCircle, Lightbulb, RefreshCw, BookOpen,
} from "lucide-react";
import { QUESTION_SUBJECTS } from "@/data/questions";
import { safeLoad, safeSave } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OneLiner {
  id: string;
  subject: string;
  topic: string;
  fact: string;
  mnemonic: string | null;
  category: string; // DOC | mechanism | side-effect | value | classification
  batch_date: string;
}

type CategoryFilter = "all" | "DOC" | "mechanism" | "side-effect" | "value" | "classification";
type KnownFilter = "all" | "unknown" | "known";

const KNOWN_KEY = "neetpg_known_oneliners";

function loadKnown(): Set<string> {
  const arr = safeLoad<string[]>(KNOWN_KEY, []);
  return new Set(arr);
}

function saveKnown(s: Set<string>) {
  safeSave(KNOWN_KEY, Array.from(s));
}

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All",
  DOC: "DOC",
  mechanism: "Mechanism",
  "side-effect": "Side-effect",
  value: "Value",
  classification: "Classification",
};

const CATEGORY_COLORS: Record<string, string> = {
  DOC:            "text-violet-400 border-violet-500/40 bg-violet-500/10",
  mechanism:      "text-blue-400   border-blue-500/40   bg-blue-500/10",
  "side-effect":  "text-destructive border-destructive/40 bg-destructive/10",
  value:          "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  classification: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CATEGORY_COLORS[cat] ?? "text-muted-foreground border-border bg-card";
  return (
    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${cls}`}>
      {cat}
    </span>
  );
}

function MnemonicBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/25 rounded-xl px-4 py-3 mt-3">
      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider mb-1">Mnemonic</p>
        <p className="text-sm font-mono text-yellow-200 font-semibold leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ─── Main OneLinerBank ────────────────────────────────────────────────────────

export function OneLinerBank() {
  const [oneLiners, setOneLiners] = useState<OneLiner[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [notFound, setNotFound]   = useState<boolean>(false);

  const [known, setKnown]           = useState<Set<string>>(loadKnown);
  const [subject, setSubject]       = useState<string>("All");
  const [category, setCategory]     = useState<CategoryFilter>("all");
  const [knownFilter, setKnownFilter] = useState<KnownFilter>("all");
  const [search, setSearch]         = useState<string>("");

  const fetchOneLiners = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/oneliners.json?v=${Date.now()}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setOneLiners((data.oneliners ?? data) as OneLiner[]);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOneLiners(); }, [fetchOneLiners]);

  const toggleKnown = (id: string) => {
    setKnown(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveKnown(next);
      return next;
    });
  };

  const filtered = useMemo<OneLiner[]>(() => {
    let list = oneLiners;

    if (subject !== "All")    list = list.filter(o => o.subject === subject);
    if (category !== "all")   list = list.filter(o => o.category === category);
    if (knownFilter === "known")   list = list.filter(o => known.has(o.id));
    if (knownFilter === "unknown") list = list.filter(o => !known.has(o.id));

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        o =>
          o.fact.toLowerCase().includes(s) ||
          o.subject.toLowerCase().includes(s) ||
          o.topic.toLowerCase().includes(s) ||
          (o.mnemonic?.toLowerCase().includes(s) ?? false)
      );
    }
    return list;
  }, [oneLiners, subject, category, knownFilter, known, search]);

  const totalKnown = useMemo(
    () => oneLiners.filter(o => known.has(o.id)).length,
    [oneLiners, known]
  );

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">One-Liner Bank</h2>
            <p className="text-xs text-muted-foreground font-mono">
              {loading
                ? "Loading…"
                : notFound
                ? "Awaiting first batch"
                : `${totalKnown} known / ${oneLiners.length} total`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchOneLiners}
          title="Refresh"
          className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Empty / not found state */}
      {!loading && notFound && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="bg-yellow-500/10 p-5 rounded-2xl border border-yellow-500/20">
            <BookOpen className="w-10 h-10 text-yellow-400/60 mx-auto" />
          </div>
          <div>
            <p className="font-mono font-bold text-foreground mb-1">No one-liners yet</p>
            <p className="text-sm font-mono text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Daily one-liners generate automatically each night. Check back tomorrow!
            </p>
          </div>
        </div>
      )}

      {/* Filters (only when data is available) */}
      {!notFound && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search facts, topics, mnemonics…"
              className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Subject chips */}
          <div className="flex flex-wrap gap-1.5">
            {["All", ...QUESTION_SUBJECTS].map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                  subject === s
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "text-muted-foreground border-border hover:border-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category + known filter row */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground border-border hover:border-muted-foreground"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
            <div className="w-px h-5 bg-border self-center mx-1" />
            {(["all", "unknown", "known"] as KnownFilter[]).map(k => (
              <button
                key={k}
                onClick={() => setKnownFilter(k)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors capitalize ${
                  knownFilter === k
                    ? k === "known"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : k === "unknown"
                      ? "bg-background text-foreground border-border"
                      : "bg-secondary text-secondary-foreground border-secondary"
                    : "text-muted-foreground border-border/50 hover:border-muted-foreground"
                }`}
              >
                {k === "all" ? "All" : k === "unknown" ? "Unknown only" : "Known"}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          {oneLiners.length > 0 && (
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="text-foreground font-bold">{filtered.length}</span>
              <span>showing</span>
              <span className="ml-auto text-emerald-400 font-bold">{totalKnown}</span>
              <span>/ {oneLiners.length} known</span>
            </div>
          )}
        </>
      )}

      {/* Cards */}
      {!loading && !notFound && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400/40" />
          <p className="text-sm font-mono text-muted-foreground">No one-liners match the current filters.</p>
          <button
            onClick={() => { setSubject("All"); setCategory("all"); setKnownFilter("all"); setSearch(""); }}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono rounded-md"
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map(ol => {
          const isKnown = known.has(ol.id);
          return (
            <div
              key={ol.id}
              className={`bg-card border rounded-xl p-5 transition-all ${
                isKnown ? "border-emerald-500/30 opacity-70" : "border-border"
              }`}
            >
              {/* Card header */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                    {ol.subject}
                  </span>
                  {ol.topic && (
                    <span className="text-[10px] font-mono text-muted-foreground/70">{ol.topic}</span>
                  )}
                  <CategoryBadge cat={ol.category} />
                </div>
                <button
                  onClick={() => toggleKnown(ol.id)}
                  title={isKnown ? "Mark as unknown" : "Mark as known"}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
                    isKnown
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/5"
                      : "text-muted-foreground border-border hover:border-emerald-500/40 hover:text-emerald-400"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {isKnown ? "Known" : "Mark known"}
                </button>
              </div>

              {/* Fact */}
              <p className="font-mono text-sm text-foreground leading-relaxed font-medium">{ol.fact}</p>

              {/* Mnemonic */}
              {ol.mnemonic && <MnemonicBox text={ol.mnemonic} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
