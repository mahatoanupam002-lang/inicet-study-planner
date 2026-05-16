import { useState, useRef, useCallback } from "react";
import Anthropic from "@anthropic-ai/sdk";
import ReactMarkdown from "react-markdown";
import {
  Upload, FileText, Sparkles, Copy, Check, BookOpen,
  Brain, AlertTriangle, Layers, Globe, Trash2, ChevronDown,
  ChevronUp, Loader2, Key, X,
} from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";
import { NEW_CARD, sm2Update } from "@/lib/sr";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PDFSRCard {
  id: string;
  question: string;
  answer: string;
  source: string;
  ef: number;
  interval: number;
  repetitions: number;
  dueDate: string;
}

interface Extraction {
  id: string;
  filename: string;
  pages: number;
  date: string;
  result: string;
}

interface Flashcard { q: string; a: string; }

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_HISTORY = "neetpg_pdf_history";
const STORAGE_KEY_PDF_CARDS = "neetpg_pdf_sr_cards";
const MAX_TEXT_CHARS = 80_000;

const SYSTEM_PROMPT = `You are an expert NEET PG exam tutor analyzing uploaded study material for an Indian medical PG aspirant. Extract ONLY what matters for MCQ-based entrance exams.

Respond in exactly this format — use these exact section headers:

## HIGH-YIELD POINTS
Number 10-15 most important exam-relevant facts. Each must be a standalone MCQ-ready fact.

## KEY MNEMONICS
5-8 memory hooks. Format: **MNEMONIC**: explanation of what it covers.

## MCQ TRAPS
5-8 classic examiner tricks or common mistakes from this material. Start each with ⚠.

## FLASHCARDS
10-12 pairs. Format strictly as:
Q: [question]
A: [answer]

## INDIA-SPECIFIC FACTS
Any India-specific stats, national programmes, guidelines, legal acts, or epidemiology from this material. If none, write "None found in this material."

Be exam-focused. Every point must be directly useful for MCQ preparation. No waffle.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateText(text: string): string {
  if (text.length <= MAX_TEXT_CHARS) return text;
  const head = text.slice(0, MAX_TEXT_CHARS * 0.65);
  const tail = text.slice(text.length - MAX_TEXT_CHARS * 0.35);
  return `${head}\n\n[...content trimmed to fit context window...]\n\n${tail}`;
}

function parseSections(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /## ([A-Z -]+)\n([\s\S]*?)(?=\n## |$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

function parseFlashcards(text: string): Flashcard[] {
  const cards: Flashcard[] = [];
  let q = "";
  for (const line of text.split("\n")) {
    if (line.startsWith("Q:")) q = line.slice(2).trim();
    else if (line.startsWith("A:") && q) { cards.push({ q, a: line.slice(2).trim() }); q = ""; }
  }
  return cards;
}

async function extractTextFromPDF(file: File): Promise<{ text: string; pages: number }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const total = pdf.numPages;
  let text = "";
  for (let i = 1; i <= Math.min(total, 60); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => ('str' in it ? it.str : "")).join(" ") + "\n\n";
  }
  return { text, pages: total };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors px-2 py-1 border border-border rounded-md">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({
  icon: Icon, title, color, content, extra,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  color: string;
  content: string;
  extra?: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  if (!content) return null;
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-mono font-bold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={content} />
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 text-[13px] font-mono leading-relaxed text-foreground/90 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
          {extra}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PDFLearningExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [rawText, setRawText] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "analyzing" | "done">("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [apiKey] = useState(() => safeLoad<string>("neetpg_ai_key", ""));
  const [history, setHistory] = useState<Extraction[]>(() => safeLoad(STORAGE_KEY_HISTORY, []));
  const [savedCount, setSavedCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [dragging, setDragging] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sections = phase === "done" ? parseSections(result) : {};
  const flashcards = sections["FLASHCARDS"] ? parseFlashcards(sections["FLASHCARDS"]) : [];

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".pdf")) { setError("Please upload a PDF file."); return; }
    setError("");
    setFile(f);
    setPhase("loading");
    setResult("");
    setSavedCount(0);
    try {
      const { text, pages: p } = await extractTextFromPDF(f);
      setRawText(text);
      setPages(p);
      setPhase("ready");
    } catch (e) {
      setError("Could not read PDF. Make sure it contains selectable text (not a scanned image).");
      setPhase("idle");
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const reset = () => {
    abortRef.current?.abort();
    setFile(null); setRawText(""); setPages(0);
    setResult(""); setError(""); setSavedCount(0);
    setPhase("idle");
  };

  // ── Analysis ──────────────────────────────────────────────────────────────

  const analyse = async () => {
    if (!apiKey) { setError("Set your Anthropic API key in the AI Tutor tab first."); return; }
    if (!rawText) return;
    setPhase("analyzing");
    setResult("");
    setError("");
    abortRef.current = new AbortController();

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const stream = client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Here is the study material extracted from "${file?.name}":\n\n${truncateText(rawText)}\n\nExtract everything important for NEET PG exam preparation.`,
        }],
      });

      let accumulated = "";
      for await (const event of stream) {
        if (abortRef.current?.signal.aborted) break;
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          accumulated += event.delta.text;
          setResult(accumulated);
        }
      }

      setPhase("done");

      const entry: Extraction = {
        id: Date.now().toString(),
        filename: file?.name ?? "unknown.pdf",
        pages,
        date: new Date().toLocaleDateString("en-IN"),
        result: accumulated,
      };
      setHistory(prev => {
        const updated = [entry, ...prev].slice(0, 10);
        safeSave(STORAGE_KEY_HISTORY, updated);
        return updated;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes("abort")) setError(msg.includes("401") ? "Invalid API key." : msg);
      setPhase("ready");
    }
  };

  // ── Save flashcards to SR deck ─────────────────────────────────────────────

  const saveFlashcards = () => {
    if (!flashcards.length) return;
    const existing = safeLoad<PDFSRCard[]>(STORAGE_KEY_PDF_CARDS, []);
    const newCards: PDFSRCard[] = flashcards.map((fc, i) => ({
      id: `${Date.now()}-${i}`,
      question: fc.q,
      answer: fc.a,
      source: file?.name ?? "PDF",
      ...NEW_CARD,
    }));
    safeSave(STORAGE_KEY_PDF_CARDS, [...existing, ...newCards]);
    setSavedCount(newCards.length);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">PDF Smart Extractor</h2>
            <p className="text-xs text-muted-foreground font-mono">Upload any study material → get exam-ready key points instantly</p>
          </div>
        </div>
        {history.length > 0 && (
          <button onClick={() => setShowHistory(v => !v)} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1.5 transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            {history.length} past extraction{history.length !== 1 ? "s" : ""}
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* No API key warning */}
      {!apiKey && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-[11px] font-mono text-yellow-400">
          <Key className="w-3.5 h-3.5 shrink-0" />
          Set your Anthropic API key in the <strong>AI Tutor</strong> tab first — the extractor uses the same key.
        </div>
      )}

      {/* Upload zone */}
      {phase === "idle" && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-colors ${
            dragging ? "border-violet-500 bg-violet-500/10" : "border-border hover:border-violet-500/50 hover:bg-violet-500/5"
          }`}
        >
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={onInputChange} />
          <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center">
            <Upload className="w-7 h-7 text-violet-400" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-mono font-bold text-foreground">Drop your PDF here</p>
            <p className="text-xs font-mono text-muted-foreground">Textbook chapters, Marrow notes, PYQ compilations, guidelines — anything</p>
            <p className="text-[10px] font-mono text-muted-foreground/60">PDF must contain selectable text (not a scanned image)</p>
          </div>
          <div className="flex gap-3 mt-2">
            {["Marrow PDF", "Harrison chapter", "NTEP guidelines", "PSM notes"].map(l => (
              <span key={l} className="text-[10px] font-mono px-2 py-1 bg-card border border-border rounded-full text-muted-foreground">{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Loading PDF */}
      {phase === "loading" && (
        <div className="border border-border rounded-xl p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-sm font-mono text-muted-foreground">Reading PDF — {file?.name}</p>
        </div>
      )}

      {/* Ready to analyse */}
      {(phase === "ready" || phase === "analyzing") && file && (
        <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-violet-500/10 p-2.5 rounded-lg">
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-foreground truncate max-w-xs">{file.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground">
                {pages} page{pages !== 1 ? "s" : ""} · {Math.round(rawText.length / 1000)}k characters extracted
                {pages > 60 && " · analysing first 60 pages"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={reset} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
            {phase === "ready" ? (
              <button
                onClick={analyse}
                disabled={!apiKey}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-sm font-mono rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Extract Key Points
              </button>
            ) : (
              <button onClick={() => abortRef.current?.abort()} className="flex items-center gap-2 px-4 py-2 bg-destructive/20 text-destructive text-sm font-mono rounded-lg hover:bg-destructive/30 transition-colors">
                <span className="w-3 h-3 rounded-sm bg-destructive" /> Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl text-[11px] font-mono text-destructive">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Streaming / done results */}
      {(phase === "analyzing" || phase === "done") && result && (
        <div className="flex flex-col gap-4">
          {phase === "analyzing" && (
            <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Analysing with Claude — extracting exam-critical content…
            </div>
          )}

          <Section icon={Brain} title="High-Yield Points" color="text-primary" content={sections["HIGH-YIELD POINTS"] ?? ""} />
          <Section icon={Sparkles} title="Key Mnemonics" color="text-violet-400" content={sections["KEY MNEMONICS"] ?? ""} />
          <Section icon={AlertTriangle} title="MCQ Traps" color="text-orange-400" content={sections["MCQ TRAPS"] ?? ""} />

          {/* Flashcards with save action */}
          {(sections["FLASHCARDS"]) && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-mono font-bold text-foreground">Flashcards</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{flashcards.length} cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={sections["FLASHCARDS"]} />
                  {savedCount > 0 ? (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {savedCount} saved to deck
                    </span>
                  ) : (
                    <button
                      onClick={saveFlashcards}
                      disabled={flashcards.length === 0}
                      className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-500/30 disabled:opacity-40 transition-colors"
                    >
                      <Layers className="w-3 h-3" /> Save to Study Deck
                    </button>
                  )}
                </div>
              </div>
              <div className="divide-y divide-border">
                {flashcards.map((fc, i) => (
                  <div key={i} className="px-4 py-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-mono uppercase text-muted-foreground mb-1">Question</p>
                      <p className="text-[12px] font-mono text-foreground">{fc.q}</p>
                    </div>
                    <div className="border-l border-border pl-4">
                      <p className="text-[9px] font-mono uppercase text-muted-foreground mb-1">Answer</p>
                      <p className="text-[12px] font-mono text-emerald-400">{fc.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Section icon={Globe} title="India-Specific Facts" color="text-blue-400" content={sections["INDIA-SPECIFIC FACTS"] ?? ""} />

          {/* Analyse another */}
          {phase === "done" && (
            <button
              onClick={reset}
              className="self-start flex items-center gap-2 px-4 py-2 border border-border text-sm font-mono text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload another PDF
            </button>
          )}
        </div>
      )}

      {/* PDF Flashcard Deck viewer */}
      <PDFDeckViewer />

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-mono uppercase text-muted-foreground">Past Extractions</p>
          {history.map(entry => (
            <HistoryEntry key={entry.id} entry={entry} onDelete={id => {
              setHistory(prev => {
                const updated = prev.filter(e => e.id !== id);
                safeSave(STORAGE_KEY_HISTORY, updated);
                return updated;
              });
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PDF Flashcard Deck Viewer ────────────────────────────────────────────────

function PDFDeckViewer() {
  const [cards, setCards] = useState<PDFSRCard[]>(() => safeLoad(STORAGE_KEY_PDF_CARDS, []));
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  if (cards.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  const dueCards = cards.filter(c => c.dueDate <= today);

  const rate = (id: string, quality: 1 | 3 | 5) => {
    setCards(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        const { ef, interval, repetitions, dueDate } = sm2Update(c, quality);
        return { ...c, ef, interval, repetitions, dueDate };
      });
      safeSave(STORAGE_KEY_PDF_CARDS, updated);
      return updated;
    });
    setFlipped(f => { const n = new Set(f); n.delete(id); return n; });
  };

  const removeCard = (id: string) => {
    setCards(prev => {
      const updated = prev.filter(c => c.id !== id);
      safeSave(STORAGE_KEY_PDF_CARDS, updated);
      return updated;
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-mono font-bold text-foreground">PDF Flashcard Deck</span>
          <span className="text-[10px] font-mono text-muted-foreground">{cards.length} cards</span>
          {dueCards.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
              {dueCards.length} due
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="divide-y divide-border border-t border-border">
          {(dueCards.length > 0 ? dueCards : cards).map(card => {
            const isFlipped = flipped.has(card.id);
            return (
              <div key={card.id} className="px-4 py-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[12px] font-mono text-foreground flex-1">{card.question}</p>
                  <button onClick={() => removeCard(card.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!isFlipped ? (
                  <button
                    onClick={() => setFlipped(f => new Set([...f, card.id]))}
                    className="text-[10px] font-mono text-primary underline underline-offset-2"
                  >
                    Show answer →
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[12px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                      {card.answer}
                    </p>
                    <div className="flex gap-2">
                      {([["Forgot", 1, "text-destructive border-destructive/30 bg-destructive/10"], ["Hard", 3, "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"], ["Easy", 5, "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"]] as const).map(([label, q, cls]) => (
                        <button
                          key={label}
                          onClick={() => rate(card.id, q)}
                          className={`text-[10px] font-mono px-2.5 py-1 border rounded-md transition-colors ${cls}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[9px] font-mono text-muted-foreground/50">from: {card.source}</p>
              </div>
            );
          })}
          {dueCards.length === 0 && (
            <p className="px-4 py-3 text-[11px] font-mono text-muted-foreground">
              All caught up — no cards due today. Next review: {cards.reduce((min, c) => c.dueDate < min ? c.dueDate : min, "9999").slice(5)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── History entry ─────────────────────────────────────────────────────────────

function HistoryEntry({ entry, onDelete }: { entry: Extraction; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2.5 flex-1 text-left">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[12px] font-mono text-foreground truncate max-w-xs">{entry.filename}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{entry.pages}pp · {entry.date}</span>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />}
        </button>
        <button onClick={() => onDelete(entry.id)} className="ml-3 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 text-[12px] font-mono text-foreground/80 prose prose-invert prose-sm max-w-none border-t border-border pt-3">
          <ReactMarkdown>{entry.result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
