import { useState, useRef, useEffect } from "react";
import { Bot, Send, Trash2, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface McqScore { attempted: number; correct: number; }

interface StudyContext {
  completedDays: number[];
  mcqScores: Record<number, McqScore>;
  flaggedCount: number;
  currentDayFocus: string;
  examDate: Date;
}

interface Props {
  studyContext?: StudyContext;
  onFirstMessage?: () => void;
}

const SUBJECT_DAYS: Record<string, number[]> = {
  Medicine: [1,2,3,4], Surgery: [5,6], Pathology: [7,8],
  Pharmacology: [9,10], OBG: [11,12], Paediatrics: [13],
  PSM: [14,15], Microbiology: [16,17], Forensic: [18],
};

function buildContext(ctx: StudyContext | undefined): string | undefined {
  if (!ctx) return undefined;
  const daysToExam = Math.max(0, Math.ceil(
    (ctx.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));
  const lines = Object.entries(SUBJECT_DAYS).flatMap(([subj, days]) => {
    let attempted = 0, correct = 0;
    days.filter(d => ctx.completedDays.includes(d)).forEach(d => {
      const s = ctx.mcqScores[d];
      if (s?.attempted) { attempted += s.attempted; correct += s.correct; }
    });
    if (!attempted) return [];
    const acc = Math.round((correct / attempted) * 100);
    const tag = acc < 60 ? "WEAK" : acc < 75 ? "borderline" : "strong";
    return [`${subj}: ${acc}% (${tag})`];
  });
  return [
    `Progress: ${ctx.completedDays.length}/28 days`,
    `Currently: ${ctx.currentDayFocus}`,
    `Days to exam: ${daysToExam}`,
    `Flagged: ${ctx.flaggedCount} topics`,
    ...(lines.length ? [`MCQ accuracy: ${lines.join(', ')}`] : []),
  ].join(' | ');
}

const DEFAULT_PROMPTS = [
  "What is the DOC for absence seizures?",
  "Vaughan Williams classification of antiarrhythmics",
  "Cushing's syndrome vs disease — classic MCQ differences",
  "Mechanism of metformin and why it's used in PCOS",
  "Layers of the cornea in order",
  "Most common cause of surgical jaundice",
];

export function ChatPanel({ studyContext, onFirstMessage }: Props) {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState<string>("");
  const [streaming, setStreaming] = useState<boolean>(false);
  const [error,     setError]     = useState<string>("");
  const firstMsgFired = useRef(false);
  const bottomRef     = useRef<HTMLDivElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const abortRef      = useRef<AbortController | null>(null);

  const quickPrompts = studyContext
    ? [
        "Based on my weak subjects, what should I focus on today?",
        "Give me the top 5 high-yield mnemonics for my weakest subject",
        "What are the most common MCQ traps for my current topic?",
        ...DEFAULT_PROMPTS.slice(0, 3),
      ]
    : DEFAULT_PROMPTS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setError("");

    if (!firstMsgFired.current) {
      firstMsgFired.current = true;
      onFirstMessage?.();
    }

    const userMsg: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          context: buildContext(studyContext),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload) as { text?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages([...nextMessages, { role: "assistant", content: accumulated }]);
            }
          } catch (e) {
            if ((e as Error).message !== "Unexpected end of JSON input") throw e;
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setMessages(nextMessages);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const stop = () => abortRef.current?.abort();

  const clearChat = () => { stop(); setMessages([]); setError(""); };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto h-[calc(100vh-220px)] min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">AI Doubt Solver</h2>
            <p className="text-xs text-muted-foreground font-mono">Powered by Claude · NEET PG focused</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
            <Bot className="w-10 h-10 text-violet-400/50" />
            <p className="text-sm text-muted-foreground font-mono text-center max-w-sm">
              Ask anything about your NEET PG syllabus. Quick-start:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p)}
                  className="text-left px-3 py-2.5 text-xs font-mono bg-background border border-border rounded-lg hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-background border border-border rounded-tl-none text-foreground/90"
                  }`}
                >
                  {msg.content || (
                    streaming && i === messages.length - 1
                      ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      : null
                  )}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-card border border-border rounded-xl p-3 flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask a doubt… (Enter to send, Shift+Enter for newline)"
          disabled={streaming}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none overflow-y-auto placeholder:text-muted-foreground/40 disabled:opacity-50"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
        {streaming ? (
          <button
            onClick={stop}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive flex items-center justify-center transition-colors"
            title="Stop generating"
          >
            <span className="w-3 h-3 rounded-sm bg-destructive" />
          </button>
        ) : (
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white flex items-center justify-center transition-colors"
            title="Send (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
