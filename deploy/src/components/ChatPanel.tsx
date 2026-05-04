import { useState, useRef, useEffect } from "react";
import Anthropic from "@anthropic-ai/sdk";
import { Bot, Send, Trash2, Key, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert INI-CET / USMLE-style medical exam tutor helping an Indian postgraduate medical aspirant preparing for INI-CET (All India Institute of Medical Sciences PG entrance exam, May 2026).

Your role:
- Give concise, high-yield exam-focused answers
- Use mnemonics and memory hooks whenever relevant
- Highlight key exam-specific facts (DOC, DOC in pregnancy, classic presentations, exceptions)
- When asked about drug classifications, use standard Indian PG exam format (e.g., Vaughan Williams for antiarrhythmics)
- Point out common MCQ traps and favourite examiners' tricks
- Keep answers ≤300 words unless the topic genuinely demands more
- Use bullet points and bold for scannable reading
- Always mention the most likely exam angle at the end (e.g., "Most likely asked as: identify the drug from its mechanism")

Subjects covered: Anatomy, Physiology, Biochemistry, Pharmacology, Pathology, Microbiology, FMT/Forensics, PSM/Community Medicine, Medicine, Surgery, OBG, Paediatrics, Orthopaedics, Ophthalmology, ENT, Psychiatry, Radiology, Skin.`;

const QUICK_PROMPTS = [
  "What is the DOC for absence seizures?",
  "Vaughan Williams classification of antiarrhythmics",
  "Classic triad of Cushing's syndrome vs Cushing's disease",
  "Mechanism of metformin and why it's used in PCOS",
  "Layers of the cornea in order",
  "Most common cause of surgical jaundice",
];

function loadKey(): string {
  return safeLoad<string>("inicet_ai_key", "");
}

export function ChatPanel() {
  const [apiKey, setApiKey]     = useState<string>(loadKey);
  const [keyInput, setKeyInput] = useState<string>("");
  const [showKeyForm, setShowKeyForm] = useState<boolean>(!loadKey());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState<string>("");
  const [streaming, setStreaming] = useState<boolean>(false);
  const [error, setError]       = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const saveKey = () => {
    const k = keyInput.trim();
    if (!k.startsWith("sk-ant-")) {
      setError("Key must start with sk-ant-");
      return;
    }
    safeSave("inicet_ai_key", k);
    setApiKey(k);
    setShowKeyForm(false);
    setError("");
    setKeyInput("");
  };

  const clearKey = () => {
    safeSave("inicet_ai_key", "");
    setApiKey("");
    setKeyInput("");
    setShowKeyForm(true);
  };

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setError("");

    const userMsg: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");

    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages([...nextMessages, assistantPlaceholder]);
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const stream = client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
      });

      let accumulated = "";
      for await (const event of stream) {
        if (abortRef.current?.signal.aborted) break;
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          accumulated += event.delta.text;
          setMessages([...nextMessages, { role: "assistant", content: accumulated }]);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("abort")) {
        setError(msg.includes("401") ? "Invalid API key. Please re-enter." : msg);
        setMessages(nextMessages); // remove empty assistant bubble
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const clearChat = () => {
    stop();
    setMessages([]);
    setError("");
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto h-[calc(100vh-160px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">AI Doubt Solver</h2>
            <p className="text-xs text-muted-foreground font-mono">Powered by Claude — INI-CET focused</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          {apiKey && (
            <button
              onClick={() => setShowKeyForm(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              {showKeyForm ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* API Key form */}
      {showKeyForm && (
        <div className="bg-card border border-border rounded-xl p-4 shrink-0">
          <p className="text-xs font-mono text-muted-foreground mb-3">
            Enter your <span className="text-violet-400">Anthropic API key</span> to enable AI answers.
            Stored only in your browser's localStorage.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveKey()}
              placeholder="sk-ant-api03-..."
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button
              onClick={saveKey}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-md transition-colors"
            >
              Save
            </button>
            {apiKey && (
              <button
                onClick={clearKey}
                className="px-3 py-2 border border-destructive/50 text-destructive text-xs font-mono rounded-md hover:bg-destructive/10 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs text-destructive font-mono mt-2">{error}</p>}
        </div>
      )}

      {/* No key state */}
      {!apiKey && !showKeyForm && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground font-mono">No API key set.</p>
            <button onClick={() => setShowKeyForm(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono rounded-md transition-colors">
              Add API Key
            </button>
          </div>
        </div>
      )}

      {/* Chat area */}
      {apiKey && (
        <>
          <div className="flex-1 overflow-y-auto bg-card border border-border rounded-xl flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                <Bot className="w-10 h-10 text-violet-400/50" />
                <p className="text-sm text-muted-foreground font-mono text-center max-w-sm">
                  Ask anything about your INI-CET syllabus. Quick-start:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                  {QUICK_PROMPTS.map((p, i) => (
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
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
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
        </>
      )}
    </div>
  );
}
