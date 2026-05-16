import { useState, useMemo } from "react";
import Anthropic from "@anthropic-ai/sdk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Brain, Loader2, AlertCircle, RefreshCw, Key, Sparkles,
} from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface McqScore { attempted: number; correct: number; }

export interface ErrorAnalysisProps {
  mcqScores: Record<number, McqScore>;
}

interface AttemptRecord { selected: number; correct: boolean; }

interface CachedAnalysis { date: string; text: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const CACHE_KEY    = "neetpg_error_analysis_cache";
const ATTEMPTS_KEY = "neetpg_pyq_attempts";
const AI_KEY_KEY   = "neetpg_ai_key";

const TODAY_ISO = new Date().toISOString().slice(0, 10);

// Questions are prefixed: "local-{id}" for classic PYQs, raw id for AI questions.
// We tag subject by matching against known subject ids embedded in question ids.
// For the analysis we rely on mcqScores (day-keyed) merged with attempt records.

const SUBJECT_DAYS: Record<string, number[]> = {
  Medicine:      [1, 2, 3, 4],
  Surgery:       [5, 6],
  Pathology:     [7, 8],
  Pharmacology:  [9, 10],
  OBG:           [11, 12],
  Paediatrics:   [13],
  "PSM/Community Medicine": [14, 15],
  Microbiology:  [16, 17],
  "Forensic Medicine": [18],
  Physiology:    [19],
  Biochemistry:  [20],
  Anatomy:       [21],
  "ENT/Ophthalmology": [22],
};

const SYSTEM_PROMPT = `You are a NEET PG expert. Analyze the student's MCQ performance data and identify: 1) Top 3 subject weaknesses with specific % 2) Common error patterns (e.g. always misses mechanism questions) 3) Personalized 3-point action plan for next 7 days. Be specific and actionable.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface SubjectStats {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

function buildSubjectStats(
  mcqScores: Record<number, McqScore>,
  attempts: Record<string, AttemptRecord>
): SubjectStats[] {
  const stats: SubjectStats[] = [];

  // Day-keyed MCQ scores (logged manually by the student)
  for (const [subj, days] of Object.entries(SUBJECT_DAYS)) {
    let attempted = 0, correct = 0;
    for (const d of days) {
      const s = mcqScores[d];
      if (s?.attempted) { attempted += s.attempted; correct += s.correct; }
    }
    if (attempted > 0) {
      stats.push({ subject: subj, attempted, correct, accuracy: Math.round((correct / attempted) * 100) });
    }
  }

  // AI question attempts — subject encoded in id prefix (e.g. "Pharmacology_2024-01-01_0")
  const aiSubjectMap: Record<string, { attempted: number; correct: number }> = {};
  for (const [id, rec] of Object.entries(attempts)) {
    if (id.startsWith("local-")) continue; // classic PYQs already covered above
    // AI question ids often start with subject name separated by underscore or dash
    const parts = id.split("_");
    if (parts.length >= 2) {
      const subj = parts[0];
      if (!aiSubjectMap[subj]) aiSubjectMap[subj] = { attempted: 0, correct: 0 };
      aiSubjectMap[subj].attempted += 1;
      if (rec.correct) aiSubjectMap[subj].correct += 1;
    }
  }

  for (const [subj, data] of Object.entries(aiSubjectMap)) {
    if (data.attempted < 3) continue; // too few to be meaningful
    const existing = stats.find(s => s.subject === subj);
    if (existing) {
      existing.attempted += data.attempted;
      existing.correct += data.correct;
      existing.accuracy = Math.round((existing.correct / existing.attempted) * 100);
    } else {
      stats.push({
        subject: subj,
        attempted: data.attempted,
        correct: data.correct,
        accuracy: Math.round((data.correct / data.attempted) * 100),
      });
    }
  }

  return stats.sort((a, b) => a.accuracy - b.accuracy);
}

function buildUserMessage(stats: SubjectStats[], attempts: Record<string, AttemptRecord>): string {
  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect   = Object.values(attempts).filter(a => a.correct).length;
  const overallAcc     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const lines = [
    `Overall: ${totalAttempted} questions attempted, ${overallAcc}% accuracy`,
    "",
    "Subject-wise performance:",
    ...stats.map(s => `  ${s.subject}: ${s.accuracy}% (${s.attempted} attempted, ${s.correct} correct)`),
    "",
    `Total unique questions attempted in PYQ bank: ${totalAttempted}`,
  ];

  return lines.join("\n");
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ErrorAnalysis({ mcqScores }: ErrorAnalysisProps) {
  const cachedRaw = safeLoad<CachedAnalysis | null>(CACHE_KEY, null);
  const validCache = cachedRaw?.date === TODAY_ISO ? cachedRaw : null;

  const [analysis, setAnalysis]   = useState<string>(validCache?.text ?? "");
  const [streaming, setStreaming] = useState<boolean>(false);
  const [error, setError]         = useState<string>("");

  const apiKey = safeLoad<string>(AI_KEY_KEY, "");

  const attempts = useMemo<Record<string, AttemptRecord>>(
    () => safeLoad<Record<string, AttemptRecord>>(ATTEMPTS_KEY, {}),
    []
  );

  const subjectStats = useMemo(
    () => buildSubjectStats(mcqScores, attempts),
    [mcqScores, attempts]
  );

  const totalAttempted = Object.keys(attempts).length;
  const totalCorrect   = Object.values(attempts).filter(a => a.correct).length;
  const overallAcc     = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const analyze = async () => {
    if (streaming) return;
    setError("");
    setAnalysis("");
    setStreaming(true);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const userMsg = buildUserMessage(subjectStats, attempts);

      const stream = client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMsg }],
      });

      let accumulated = "";
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          accumulated += event.delta.text;
          setAnalysis(accumulated);
        }
      }

      // Cache the result for today
      safeSave(CACHE_KEY, { date: TODAY_ISO, text: accumulated } satisfies CachedAnalysis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes("401") ? "Invalid API key. Please re-enter in the AI Tutor tab." : msg);
    } finally {
      setStreaming(false);
    }
  };

  const clearCache = () => {
    safeSave(CACHE_KEY, null);
    setAnalysis("");
    setError("");
  };

  const hasSufficientData = totalAttempted >= 10;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="bg-violet-500/20 p-1.5 rounded-lg">
            <Brain className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">Error Analysis</h3>
            <p className="text-[10px] font-mono text-muted-foreground">AI-powered MCQ pattern analysis</p>
          </div>
        </div>

        {/* Stats summary */}
        {overallAcc !== null && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">{totalAttempted} Qs</span>
            <span className={`font-bold ${
              overallAcc >= 75 ? "text-emerald-400" : overallAcc >= 60 ? "text-yellow-400" : "text-destructive"
            }`}>
              {overallAcc}% acc
            </span>
          </div>
        )}
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">

        {/* No API key state */}
        {!apiKey && (
          <div className="flex items-start gap-3 bg-violet-500/8 border border-violet-500/25 rounded-xl px-4 py-3">
            <Key className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-mono text-foreground font-semibold mb-0.5">API key required</p>
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                Set your Anthropic API key in the <span className="text-violet-400">AI Tutor</span> tab to enable AI error analysis.
              </p>
            </div>
          </div>
        )}

        {/* Insufficient data warning */}
        {apiKey && !hasSufficientData && (
          <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/25 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-mono text-foreground font-semibold mb-0.5">Not enough data yet</p>
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                Attempt at least 10 questions in the PYQ Bank to get meaningful analysis.
                Currently at {totalAttempted} questions.
              </p>
            </div>
          </div>
        )}

        {/* Subject stats mini table */}
        {subjectStats.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">Performance by subject</p>
            {subjectStats.map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-muted-foreground w-44 truncate shrink-0">{s.subject}</span>
                <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${s.accuracy}%`,
                      backgroundColor: s.accuracy < 60 ? "#ef4444" : s.accuracy < 75 ? "#eab308" : "#22c55e",
                    }}
                  />
                </div>
                <span className={`text-[11px] font-mono font-bold w-10 text-right shrink-0 ${
                  s.accuracy < 60 ? "text-destructive" : s.accuracy < 75 ? "text-yellow-400" : "text-emerald-400"
                }`}>
                  {s.accuracy}%
                </span>
                <span className="text-[10px] font-mono text-muted-foreground w-14 text-right shrink-0">
                  {s.attempted} Qs
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {apiKey && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={analyze}
              disabled={streaming || !hasSufficientData}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-mono rounded-lg transition-colors"
            >
              {streaming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {streaming ? "Analyzing…" : analysis ? "Re-analyze" : "Analyze My Errors"}
            </button>

            {analysis && !streaming && (
              <button
                onClick={clearCache}
                className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear
              </button>
            )}

            {validCache && !streaming && (
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                Cached for today
              </span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Streaming / result */}
        {analysis && (
          <div className="bg-background border border-border/60 rounded-xl px-5 py-4">
            <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-1.5">
              <Brain className="w-3 h-3 text-violet-400" />
              AI Analysis
              {streaming && <Loader2 className="w-3 h-3 animate-spin ml-1 text-violet-400" />}
            </p>
            <div className="prose prose-sm prose-invert max-w-none font-mono text-xs leading-relaxed
              prose-headings:font-mono prose-headings:text-foreground prose-headings:text-sm
              prose-p:text-foreground/85 prose-p:leading-relaxed
              prose-li:text-foreground/85 prose-li:marker:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-bold
              prose-code:text-primary prose-code:bg-primary/10 prose-code:rounded prose-code:px-1
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
