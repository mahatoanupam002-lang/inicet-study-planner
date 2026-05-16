import { useState, useMemo } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { SCHEDULE } from "@/data/schedule";
import { CalendarCheck, Plus, Trash2, CheckCircle } from "lucide-react";

interface ScheduledTopic {
  id: string;
  subject: string;
  topicName: string;
  studiedDate: string;
  nextReviewDate: string;
  reviewCount: number;
  notes?: string;
}

const STORAGE_KEY = "neetpg_revision_schedule";
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function subDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function getNextReviewDate(studiedDate: string, reviewCount: number): string {
  const intervalIdx = Math.min(reviewCount, REVIEW_INTERVALS.length - 1);
  const interval = REVIEW_INTERVALS[intervalIdx];
  return addDays(studiedDate, interval);
}

function buildInitialTopics(): ScheduledTopic[] {
  const today = new Date().toISOString().slice(0, 10);
  return SCHEDULE.map(day => {
    const daysAgo = 28 - day.day;
    const studiedDate = daysAgo > 0 ? subDays(daysAgo) : today;
    const reviewCount = 0;
    return {
      id: `schedule_day_${day.day}`,
      subject: day.subject,
      topicName: `Day ${day.day}: ${day.focus}`,
      studiedDate,
      nextReviewDate: getNextReviewDate(studiedDate, reviewCount),
      reviewCount,
    };
  });
}

const TODAY = new Date().toISOString().slice(0, 10);
const IN7 = addDays(TODAY, 7);

const SUBJECTS = ["Medicine","Surgery","Pharmacology","Physiology","Biochemistry","Pathology","Anatomy","Microbiology","OBG","Paediatrics","PSM","Forensic","ENT/Ophth/Derm","Revision","Full Mock"];

const SUBJECT_COLORS: Record<string, string> = {
  Medicine:"text-blue-400",Pharmacology:"text-violet-400",Microbiology:"text-green-400",
  OBG:"text-pink-400",Paediatrics:"text-cyan-400",PSM:"text-amber-400",
  Surgery:"text-orange-400",Pathology:"text-rose-400",Forensic:"text-gray-400",
  Anatomy:"text-yellow-400",Physiology:"text-teal-400",Biochemistry:"text-indigo-400",
  "ENT/Ophth/Derm":"text-lime-400",Revision:"text-amber-400","Full Mock":"text-cyan-400",
};

type ViewMode = "due" | "upcoming" | "completed" | "calendar";

export function RevisionScheduler() {
  const [topics, setTopics] = useState<ScheduledTopic[]>(() => {
    const saved = safeLoad<ScheduledTopic[]>(STORAGE_KEY, []);
    if (saved.length === 0) {
      const initial = buildInitialTopics();
      safeSave(STORAGE_KEY, initial);
      return initial;
    }
    return saved;
  });

  const [viewMode, setViewMode] = useState<ViewMode>("due");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: SUBJECTS[0], topicName: "", studiedDate: TODAY, notes: "" });

  const saveTopics = (updated: ScheduledTopic[]) => {
    setTopics(updated);
    safeSave(STORAGE_KEY, updated);
  };

  const markReviewed = (id: string) => {
    saveTopics(topics.map(t => {
      if (t.id !== id) return t;
      const newCount = t.reviewCount + 1;
      return {
        ...t,
        reviewCount: newCount,
        studiedDate: TODAY,
        nextReviewDate: getNextReviewDate(TODAY, newCount),
      };
    }));
  };

  const deleteTopic = (id: string) => {
    saveTopics(topics.filter(t => t.id !== id));
    setDeleteId(null);
  };

  const addTopic = () => {
    if (!form.topicName) return;
    const topic: ScheduledTopic = {
      id: Date.now().toString(),
      subject: form.subject,
      topicName: form.topicName,
      studiedDate: form.studiedDate,
      nextReviewDate: getNextReviewDate(form.studiedDate, 0),
      reviewCount: 0,
      notes: form.notes || undefined,
    };
    saveTopics([...topics, topic]);
    setForm({ subject: SUBJECTS[0], topicName: "", studiedDate: TODAY, notes: "" });
    setShowForm(false);
  };

  const due = useMemo(() => topics.filter(t => t.nextReviewDate <= TODAY).sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate)), [topics]);
  const upcoming = useMemo(() => topics.filter(t => t.nextReviewDate > TODAY && t.nextReviewDate <= IN7).sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate)), [topics]);
  const completed = useMemo(() => topics.filter(t => t.nextReviewDate > IN7).sort((a, b) => b.nextReviewDate.localeCompare(a.nextReviewDate)), [topics]);

  // Calendar: next 7 days
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }), topics: topics.filter(t => t.nextReviewDate === key) });
    }
    return days;
  }, [topics]);

  const renderTopic = (t: ScheduledTopic) => (
    <div key={t.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-mono ${SUBJECT_COLORS[t.subject] ?? "text-muted-foreground"}`}>{t.subject}</span>
          <span className="text-sm font-medium text-foreground">{t.topicName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {deleteId === t.id ? (
            <div className="flex gap-1">
              <button onClick={() => deleteTopic(t.id)} className="px-2 py-0.5 text-[10px] bg-rose-600 text-white rounded">Yes</button>
              <button onClick={() => setDeleteId(null)} className="px-2 py-0.5 text-[10px] bg-card border border-border text-muted-foreground rounded">No</button>
            </div>
          ) : (
            <button onClick={() => setDeleteId(t.id)} className="p-1 text-muted-foreground hover:text-rose-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
        <span>Studied: {t.studiedDate}</span>
        <span>Review: {t.nextReviewDate}</span>
        <span>Rep #{t.reviewCount}</span>
        <span>Next interval: {REVIEW_INTERVALS[Math.min(t.reviewCount, REVIEW_INTERVALS.length - 1)]}d</span>
      </div>
      {t.notes && <div className="text-xs text-muted-foreground italic">{t.notes}</div>}
      {t.nextReviewDate <= TODAY && (
        <button onClick={() => markReviewed(t.id)} className="self-start flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-mono hover:bg-green-500/30 transition-colors">
          <CheckCircle className="w-3.5 h-3.5" /> Mark Reviewed
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Revision Scheduler</h2>
          <p className="text-sm text-muted-foreground font-mono">Ebbinghaus spaced repetition for topics</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
          <Plus className="w-4 h-4" /> Add Topic
        </button>
      </div>

      {/* Stats badges */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-rose-400">{due.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Due Today</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-amber-400">{upcoming.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Upcoming (7d)</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-green-400">{completed.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Well Spaced</div>
        </div>
      </div>

      {/* Revision intervals */}
      <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 text-xs font-mono text-muted-foreground flex-wrap">
        <span className="text-foreground">Intervals:</span>
        {REVIEW_INTERVALS.map((d, i) => (
          <span key={i}><span className="text-primary">R{i+1}</span>: {d}d</span>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-semibold text-foreground text-sm">Add Custom Topic</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">Subject</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-1">Date Studied</label>
              <input type="date" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none" value={form.studiedDate} onChange={e => setForm(p => ({ ...p, studiedDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Topic Name</label>
            <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none" placeholder="e.g. Cardiac pharmacology — anti-arrhythmics" value={form.topicName} onChange={e => setForm(p => ({ ...p, topicName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground block mb-1">Notes (optional)</label>
            <input className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none" placeholder="Any notes about this topic" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={addTopic} disabled={!form.topicName} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50">Add</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-card border border-border text-muted-foreground rounded-lg text-sm hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* View mode tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-lg p-1 overflow-x-auto">
        {([["due", `Due (${due.length})`], ["upcoming", `Upcoming (${upcoming.length})`], ["completed", `Spaced (${completed.length})`], ["calendar", "Calendar"]] as [ViewMode, string][]).map(([v, label]) => (
          <button key={v} onClick={() => setViewMode(v)} className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-mono transition-colors ${viewMode === v ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {viewMode === "due" && (
        <div className="flex flex-col gap-3">
          {due.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No topics due today.</div>
          ) : (
            <>
              <div className="text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg">{due.length} topic(s) due for review today</div>
              {due.map(renderTopic)}
            </>
          )}
        </div>
      )}

      {viewMode === "upcoming" && (
        <div className="flex flex-col gap-3">
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No topics due in the next 7 days.</div>
          ) : upcoming.map(renderTopic)}
        </div>
      )}

      {viewMode === "completed" && (
        <div className="flex flex-col gap-3">
          {completed.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No topics well-spaced yet.</div>
          ) : completed.map(renderTopic)}
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-semibold text-foreground">Next 7 Days</div>
          {calendarDays.map(day => (
            <div key={day.key} className={`bg-card border rounded-xl p-3 ${day.key === TODAY ? "border-primary/50" : "border-border"}`}>
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                <span className={`text-xs font-mono font-semibold ${day.key === TODAY ? "text-primary" : "text-muted-foreground"}`}>
                  {day.label} {day.key === TODAY ? "(Today)" : ""}
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">{day.topics.length} topic(s)</span>
              </div>
              {day.topics.length === 0 ? (
                <div className="text-[10px] text-muted-foreground italic">No reviews scheduled</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {day.topics.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-xs">
                      <span className={`text-[10px] font-mono ${SUBJECT_COLORS[t.subject] ?? "text-muted-foreground"}`}>{t.subject}</span>
                      <span className="text-muted-foreground">{t.topicName}</span>
                      <span className="ml-auto text-[10px] font-mono text-muted-foreground">R{t.reviewCount + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
