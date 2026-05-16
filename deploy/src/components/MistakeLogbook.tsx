import { useState, useMemo } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { Plus, Trash2, Eye, EyeOff, CheckCircle, Download, BookOpen } from "lucide-react";

interface MistakeEntry {
  id: string;
  date: string;
  subject: string;
  topic: string;
  question: string;
  correctAnswer: string;
  myAnswer: string;
  whyWrong: string;
  reviewed: boolean;
}

const SUBJECTS = ["Medicine","Surgery","Pharmacology","Physiology","Biochemistry","Pathology","Anatomy","Microbiology","OBG","Paediatrics","PSM","Forensic","ENT/Ophth/Derm"];
const STORAGE_KEY = "neetpg_mistake_logbook";

const SUBJECT_COLORS: Record<string, string> = {
  Medicine:"bg-blue-500/20 text-blue-400",Pharmacology:"bg-violet-500/20 text-violet-400",
  Microbiology:"bg-green-500/20 text-green-400",OBG:"bg-pink-500/20 text-pink-400",
  Paediatrics:"bg-cyan-500/20 text-cyan-400",PSM:"bg-amber-500/20 text-amber-400",
  Surgery:"bg-orange-500/20 text-orange-400",Pathology:"bg-rose-500/20 text-rose-400",
  Forensic:"bg-gray-500/20 text-gray-400",Anatomy:"bg-yellow-500/20 text-yellow-400",
  Physiology:"bg-teal-500/20 text-teal-400",Biochemistry:"bg-indigo-500/20 text-indigo-400",
  "ENT/Ophth/Derm":"bg-lime-500/20 text-lime-400",
};

function getWeekKey(date: string): string {
  const d = new Date(date);
  const startOfWeek = new Date(d);
  startOfWeek.setDate(d.getDate() - d.getDay());
  return startOfWeek.toISOString().slice(0, 10);
}

function isThisWeek(date: string): boolean {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}

type ReviewStep = "question" | "revealed";

export function MistakeLogbook() {
  const [entries, setEntries] = useState<MistakeEntry[]>(() => safeLoad<MistakeEntry[]>(STORAGE_KEY, []));
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewStep, setReviewStep] = useState<ReviewStep>("question");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: SUBJECTS[0], topic: "", question: "", correctAnswer: "", myAnswer: "", whyWrong: "" });

  const save = (updated: MistakeEntry[]) => {
    setEntries(updated);
    safeSave(STORAGE_KEY, updated);
  };

  const addEntry = () => {
    if (!form.topic || !form.question || !form.correctAnswer) return;
    const entry: MistakeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...form,
      reviewed: false,
    };
    save([entry, ...entries]);
    setForm({ subject: SUBJECTS[0], topic: "", question: "", correctAnswer: "", myAnswer: "", whyWrong: "" });
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    save(entries.filter(e => e.id !== id));
    setDeleteId(null);
  };

  const markReviewed = (id: string) => {
    save(entries.map(e => e.id === id ? { ...e, reviewed: true } : e));
  };

  const filtered = useMemo(() => {
    return entries.filter(e => subjectFilter === "All" || e.subject === subjectFilter).sort((a, b) => b.date.localeCompare(a.date));
  }, [entries, subjectFilter]);

  const thisWeek = useMemo(() => filtered.filter(e => isThisWeek(e.date)), [filtered]);
  const reviewEntries = thisWeek.filter(e => !e.reviewed);

  // Grouped by week
  const grouped = useMemo(() => {
    const map: Record<string, MistakeEntry[]> = {};
    for (const e of filtered) {
      const wk = getWeekKey(e.date);
      (map[wk] = map[wk] ?? []).push(e);
    }
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const reviewedPct = entries.length > 0 ? Math.round(entries.filter(e => e.reviewed).length / entries.length * 100) : 0;

  const exportTxt = () => {
    const lines = entries.map(e => `[${e.date.slice(0,10)}] ${e.subject} — ${e.topic}\nQ: ${e.question}\nCorrect: ${e.correctAnswer}\nMy answer: ${e.myAnswer}\nWhy wrong: ${e.whyWrong}\n`);
    const blob = new Blob([lines.join("\n---\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mistake-logbook.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  if (reviewMode) {
    const card = reviewEntries[reviewIdx];
    if (!card) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <div className="text-lg font-bold text-foreground">All this week's mistakes reviewed!</div>
          <button onClick={() => { setReviewMode(false); setReviewIdx(0); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">Back to Logbook</button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Weekly Review</h2>
          <button onClick={() => setReviewMode(false)} className="text-sm text-muted-foreground hover:text-foreground">Exit</button>
        </div>
        <div className="text-xs font-mono text-muted-foreground">{reviewIdx + 1} / {reviewEntries.length} cards</div>
        <div className="w-full bg-card border border-border rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(reviewIdx / reviewEntries.length) * 100}%` }} />
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
          <span className={`self-start px-2 py-0.5 rounded text-xs font-mono ${SUBJECT_COLORS[card.subject] ?? ""}`}>{card.subject}</span>
          <div className="text-xs text-muted-foreground font-mono">Topic: {card.topic}</div>
          <div className="text-foreground font-medium">{card.question}</div>
          {reviewStep === "revealed" && (
            <div className="flex flex-col gap-2 mt-2 border-t border-border pt-4">
              <div className="text-green-400 text-sm"><span className="font-mono text-xs text-muted-foreground">Correct: </span>{card.correctAnswer}</div>
              <div className="text-rose-400 text-sm"><span className="font-mono text-xs text-muted-foreground">My answer: </span>{card.myAnswer}</div>
              <div className="text-muted-foreground text-sm"><span className="font-mono text-xs">Why wrong: </span>{card.whyWrong}</div>
            </div>
          )}
          <div className="flex gap-3 mt-2">
            {reviewStep === "question" ? (
              <button onClick={() => setReviewStep("revealed")} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-mono">Reveal Answer</button>
            ) : (
              <>
                <button onClick={() => { markReviewed(card.id); setReviewIdx(i => i + 1); setReviewStep("question"); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Mark Reviewed</button>
                <button onClick={() => { setReviewIdx(i => i + 1); setReviewStep("question"); }} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">Skip</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mistake Logbook</h2>
          <p className="text-sm text-muted-foreground font-mono">Track and review your wrong answers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportTxt} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-foreground">{entries.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Total Entries</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-green-400">{reviewedPct}%</div>
          <div className="text-xs text-muted-foreground mt-1">Reviewed</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-amber-400">{thisWeek.length}</div>
          <div className="text-xs text-muted-foreground mt-1">This Week</div>
        </div>
      </div>

      {/* Weekly Review Button */}
      {reviewEntries.length > 0 && (
        <button onClick={() => { setReviewMode(true); setReviewIdx(0); setReviewStep("question"); }} className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-mono hover:bg-amber-500/20 transition-colors">
          <BookOpen className="w-4 h-4" /> Review This Week ({reviewEntries.length} unreviewed)
        </button>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-foreground text-sm">Add Mistake Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">Subject</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">Topic</label>
              <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" placeholder="e.g. DOC for absence seizures" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Question (brief description)</label>
            <textarea className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary resize-none" rows={2} placeholder="Describe the question..." value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">Correct Answer</label>
              <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Correct answer" value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">My Answer</label>
              <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" placeholder="What I chose" value={form.myAnswer} onChange={e => setForm(p => ({ ...p, myAnswer: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Why Wrong</label>
            <textarea className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary resize-none" rows={2} placeholder="Reason for mistake / concept to remember" value={form.whyWrong} onChange={e => setForm(p => ({ ...p, whyWrong: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={addEntry} disabled={!form.topic || !form.question || !form.correctAnswer} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">Save Entry</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Subject Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...SUBJECTS].map(s => (
          <button key={s} onClick={() => setSubjectFilter(s)} className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${subjectFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Grouped Entry List */}
      {grouped.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No entries yet. Add your first mistake to start tracking!</div>
      )}
      {grouped.map(([wk, weekEntries]) => (
        <div key={wk} className="flex flex-col gap-2">
          <div className="text-xs font-mono text-muted-foreground border-b border-border pb-1">
            Week of {new Date(wk).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {weekEntries.map(entry => (
            <div key={entry.id} className={`bg-card border rounded-xl p-4 flex flex-col gap-2 transition-opacity ${entry.reviewed ? "opacity-60" : ""}`} style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${SUBJECT_COLORS[entry.subject] ?? "bg-card text-muted-foreground"}`}>{entry.subject}</span>
                  <span className="text-sm font-medium text-foreground">{entry.topic}</span>
                  {entry.reviewed && <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Reviewed</span>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground">{entry.date.slice(0,10)}</span>
                  {!entry.reviewed && (
                    <button onClick={() => markReviewed(entry.id)} title="Mark as reviewed" className="p-1 text-muted-foreground hover:text-green-400 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {deleteId === entry.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => deleteEntry(entry.id)} className="px-2 py-0.5 text-[10px] bg-rose-600 text-white rounded">Yes</button>
                      <button onClick={() => setDeleteId(null)} className="px-2 py-0.5 text-[10px] bg-card border border-border text-muted-foreground rounded">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteId(entry.id)} className="p-1 text-muted-foreground hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{entry.question}</div>
              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <span className="text-green-400">Correct: {entry.correctAnswer}</span>
                {entry.myAnswer && <span className="text-rose-400">Mine: {entry.myAnswer}</span>}
              </div>
              {entry.whyWrong && <div className="text-xs text-muted-foreground italic">{entry.whyWrong}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
