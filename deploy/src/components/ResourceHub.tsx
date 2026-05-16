import { useState } from "react";
import { BookOpen, Youtube, Monitor, FileText, Star, ExternalLink } from "lucide-react";

type Category = "books" | "videos" | "platforms" | "notes";

interface Resource {
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  rating: number;
  note: string;
  priority?: "must" | "recommended" | "optional";
}

const RESOURCES: Record<Category, Resource[]> = {
  books: [
    {
      title: "Harrison's Principles of Internal Medicine",
      subtitle: "Kasper, Fauci et al. — 22nd Edition",
      tag: "Medicine",
      tagColor: "#ff4d4d",
      rating: 5,
      note: "Reference only — do NOT read cover to cover for NEET PG. Use for clinical vignette understanding after Marrow.",
      priority: "recommended",
    },
    {
      title: "Robbins & Cotran Pathologic Basis of Disease",
      subtitle: "Kumar, Abbas, Aster — 10th Edition",
      tag: "Pathology",
      tagColor: "#fb8500",
      rating: 5,
      note: "Gold standard for conceptual Pathology. Read chapters on Cell Injury, Neoplasia, and any system you're weak in.",
      priority: "recommended",
    },
    {
      title: "Park's Textbook of Preventive & Social Medicine",
      subtitle: "K. Park — 27th Edition",
      tag: "PSM",
      tagColor: "#8338ec",
      rating: 5,
      note: "Must-read for PSM. National programmes, epidemiology, biostatistics. Chapters 2 (Epidemiology) and 6 (National Programmes) are most tested.",
      priority: "must",
    },
    {
      title: "DC Dutta's Textbook of Obstetrics",
      subtitle: "Hiralal Konar — 10th Edition",
      tag: "OBG",
      tagColor: "#f72585",
      rating: 5,
      note: "Standard OBG textbook for Indian PG exams. Complete and exam-oriented. Read alongside Gynaecology by Novak or Shaw.",
      priority: "must",
    },
    {
      title: "Bailey & Love's Short Practice of Surgery",
      subtitle: "Norman Williams — 28th Edition",
      tag: "Surgery",
      tagColor: "#c77dff",
      rating: 4,
      note: "Use for major surgical topics (hernia, thyroid, GI surgery). Marrow is sufficient for most NEET PG surgery questions.",
      priority: "recommended",
    },
    {
      title: "Nelson Textbook of Pediatrics",
      subtitle: "Kliegman — 21st Edition",
      tag: "Paediatrics",
      tagColor: "#4cc9f0",
      rating: 4,
      note: "Reference for complex Paediatrics questions. OP Ghai (Indian textbook) is better aligned with exam patterns.",
      priority: "optional",
    },
    {
      title: "OP Ghai Essential Paediatrics",
      subtitle: "Arvind Bagga — 10th Edition",
      tag: "Paediatrics",
      tagColor: "#4cc9f0",
      rating: 5,
      note: "Must for Indian exam-oriented Paediatrics. National programmes, immunisation schedule, malnutrition — far better than Nelson for exams.",
      priority: "must",
    },
    {
      title: "Tripathi's Essentials of Medical Pharmacology",
      subtitle: "KD Tripathi — 8th Edition",
      tag: "Pharmacology",
      tagColor: "#06d6a0",
      rating: 4,
      note: "Best Indian Pharmacology textbook. Chapter-by-chapter DOC tables and mechanism tables are exam goldmines.",
      priority: "recommended",
    },
    {
      title: "Ananthanarayan & Paniker's Textbook of Microbiology",
      subtitle: "Radhakrishnan Ananthanarayan — 11th Edition",
      tag: "Microbiology",
      tagColor: "#ffb703",
      rating: 4,
      note: "Standard Indian Microbiology text. Bacteriology and serology chapters are most tested. Don't read mycology in depth — high-yield only.",
      priority: "recommended",
    },
    {
      title: "Modi's Medical Jurisprudence & Toxicology",
      subtitle: "B.V. Subramanyam — 25th Edition",
      tag: "Forensic",
      tagColor: "#adb5bd",
      rating: 4,
      note: "Standard Forensic reference. Focus on wounds, thanatology, legal acts (NDPS, MHCA, POCSO, MTP, IPC sections).",
      priority: "recommended",
    },
  ],
  videos: [
    {
      title: "Marrow by PrepLadder — Video Lectures",
      subtitle: "Platform — marrow.in",
      tag: "All Subjects",
      tagColor: "#4361ee",
      rating: 5,
      note: "The #1 video platform for NEET PG. Used by Zainab Vora (AIR 1) and most top rankers. High-yield, exam-focused, Indian context.",
      priority: "must",
    },
    {
      title: "Cardiology Lectures by Dr. Sumer Sethi",
      subtitle: "YouTube Channel",
      tag: "Medicine",
      tagColor: "#ff4d4d",
      rating: 5,
      note: "Best free Cardiology lectures on YouTube. ECG interpretation, heart failure, STEMI management — taught in clinical context.",
      priority: "recommended",
    },
    {
      title: "Pathology Made Easy — Dr. Harsh Mohan",
      subtitle: "YouTube Channel",
      tag: "Pathology",
      tagColor: "#fb8500",
      rating: 5,
      note: "Author of 'Harsh Mohan Textbook of Pathology' himself teaches. Histopathology images explained systematically.",
      priority: "recommended",
    },
    {
      title: "PSM/Community Medicine — Dr. Vivek Jain",
      subtitle: "YouTube + PrepLadder",
      tag: "PSM",
      tagColor: "#8338ec",
      rating: 5,
      note: "Most comprehensive PSM videos for PG exams. Park's textbook made visual. NFHS, national programmes explained with mnemonics.",
      priority: "must",
    },
    {
      title: "Surgery Mnemonics — DravidMD",
      subtitle: "YouTube Channel",
      tag: "Surgery",
      tagColor: "#c77dff",
      rating: 4,
      note: "Quick surgical mnemonics for PG exams. Especially good for trauma, surgical anatomy, and investigations. Short videos ideal for revision.",
      priority: "recommended",
    },
    {
      title: "Pharmacology — Dr. Gobind Rai Garg",
      subtitle: "YouTube Channel",
      tag: "Pharmacology",
      tagColor: "#06d6a0",
      rating: 5,
      note: "The best free Pharmacology lectures. Drug mechanisms explained with animations. DOC tables, receptor selectivity — exam-gold content.",
      priority: "recommended",
    },
    {
      title: "AIIMS PYQ Discussion — Bhatia's",
      subtitle: "YouTube / Offline Classes",
      tag: "All Subjects",
      tagColor: "#4361ee",
      rating: 4,
      note: "Delhi-based institution with decades of PYQ analysis. Their AIIMS PYQ discussion books (2010–2024) are essential for pattern recognition.",
      priority: "recommended",
    },
    {
      title: "Microbiology Video Lectures — Dr. Apurba Sankar Sastry",
      subtitle: "Marrow / YouTube",
      tag: "Microbiology",
      tagColor: "#ffb703",
      rating: 5,
      note: "Author of 'Essentials of Medical Microbiology'. His videos cover serology, bacteriology, parasitology in exam-focused format.",
      priority: "recommended",
    },
  ],
  platforms: [
    {
      title: "Marrow (PrepLadder)",
      subtitle: "marrow.in — Primary exam prep platform",
      tag: "All-in-One",
      tagColor: "#4361ee",
      rating: 5,
      note: "Most recommended platform by NEET PG toppers. Includes video lectures, Reflex MCQs, flashcards, and grand tests. Paid but worth it.",
      priority: "must",
    },
    {
      title: "DAMS (Delhi Academy of Medical Sciences)",
      subtitle: "damsindia.com",
      tag: "PSM / Surgery",
      tagColor: "#8338ec",
      rating: 4,
      note: "Especially strong for PSM and Surgery notes. DAMS handouts are widely used for India-specific content revision.",
      priority: "recommended",
    },
    {
      title: "Bhatia's PYQ Books",
      subtitle: "Available offline / select bookstores",
      tag: "PYQ Analysis",
      tagColor: "#fb8500",
      rating: 5,
      note: "AIIMS PYQ books (subject-wise) with detailed explanations. Pattern analysis by year is invaluable for understanding examiner preferences.",
      priority: "recommended",
    },
    {
      title: "Across (Annamalai)",
      subtitle: "across.edu.in — Question bank",
      tag: "MCQ Practice",
      tagColor: "#06d6a0",
      rating: 4,
      note: "Large question bank aligned with NEET PG pattern. Good for daily MCQ practice after completing topics.",
      priority: "recommended",
    },
    {
      title: "NEET PG Official Website",
      subtitle: "natboard.edu.in",
      tag: "Official",
      tagColor: "#ff4d4d",
      rating: 5,
      note: "Always check official site for exam schedule, eligibility, syllabus updates, and result notifications. Bookmark this.",
      priority: "must",
    },
    {
      title: "DoctorAdda / DBMCI",
      subtitle: "doctorsadda.com",
      tag: "Test Series",
      tagColor: "#c77dff",
      rating: 4,
      note: "Additional mock test series for practice. Good for accessing varied question styles outside Marrow's ecosystem.",
      priority: "optional",
    },
  ],
  notes: [
    {
      title: "'The World of Medicine' — Anoop Kumar",
      subtitle: "Revision notes format",
      tag: "Medicine",
      tagColor: "#ff4d4d",
      rating: 5,
      note: "The gold-standard Medicine revision notes used by most toppers. Covers all clinically relevant topics in point format. Mandatory for the last 2 weeks.",
      priority: "must",
    },
    {
      title: "One-liner Notes Format (Self-made)",
      subtitle: "Handwritten or typed",
      tag: "Strategy",
      tagColor: "#4361ee",
      rating: 5,
      note: "Make your own one-liner notes per subject from Day 1 — 10 bullet points maximum per topic. This becomes your last-week cheat sheet. No substitute.",
      priority: "must",
    },
    {
      title: "NEET PG India One-pager",
      subtitle: "All India-specific stats on 2 pages",
      tag: "PSM / India",
      tagColor: "#8338ec",
      rating: 5,
      note: "Compile all NFHS-5 data, national programme stats, acts, cutoffs onto 2 A4 pages. Review daily for 5 minutes. This alone can add 8-10 marks.",
      priority: "must",
    },
    {
      title: "Autoantibody Master Table",
      subtitle: "Disease → antibody → complement → Rx",
      tag: "Medicine / Pathology",
      tagColor: "#fb8500",
      rating: 5,
      note: "Single table covering SLE, RA, Sjögren's, GPA, MPA, MCGN, anti-GBM, Myasthenia, etc. with antibodies. Saves 5-7 marks guaranteed.",
      priority: "must",
    },
    {
      title: "DOC (Drug of Choice) Compilation",
      subtitle: "All subjects, one document",
      tag: "Pharmacology",
      tagColor: "#06d6a0",
      rating: 5,
      note: "Compile all drug-of-choice questions across subjects. 60-70% of Pharmacology marks are DOC questions. This compilation alone is worth 10 marks.",
      priority: "must",
    },
    {
      title: "Image Logbook (Personal)",
      subtitle: "Visual flashcards for wrongly identified images",
      tag: "Images",
      tagColor: "#4cc9f0",
      rating: 5,
      note: "Zainab Vora's strategy: every image you got wrong → write in a logbook with correct identification. Review nightly. 8-10 image questions per exam.",
      priority: "must",
    },
  ],
};

const CATEGORY_ICONS = {
  books: BookOpen,
  videos: Youtube,
  platforms: Monitor,
  notes: FileText,
};

const CATEGORY_LABELS = {
  books: "Textbooks",
  videos: "Video Resources",
  platforms: "Test Platforms",
  notes: "Notes & Strategy",
};

const PRIORITY_COLORS = {
  must: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "MUST" },
  recommended: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", label: "RECOMMENDED" },
  optional: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border", label: "OPTIONAL" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export function ResourceHub() {
  const [activeCategory, setActiveCategory] = useState<Category>("books");
  const resources = RESOURCES[activeCategory];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/20 p-2 rounded-lg">
          <ExternalLink className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">Resource Hub</h2>
          <p className="text-xs text-muted-foreground font-mono">Books, videos, platforms & study notes rated by toppers</p>
        </div>
      </div>

      {/* Priority legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRIORITY_COLORS).map(([key, val]) => (
          <div key={key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${val.bg} ${val.border}`}>
            <span className={`text-[10px] font-mono font-bold ${val.text}`}>{val.label}</span>
          </div>
        ))}
        <span className="text-[10px] font-mono text-muted-foreground self-center ml-1">— priority level for NEET PG</span>
      </div>

      {/* Category tabs */}
      <div className="flex bg-card p-1 rounded-lg border border-border gap-1">
        {(Object.keys(RESOURCES) as Category[]).map(cat => {
          const Icon = CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded-md transition-colors ${
                activeCategory === cat
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{CATEGORY_LABELS[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((r, i) => {
          const priority = r.priority ? PRIORITY_COLORS[r.priority] : PRIORITY_COLORS.optional;
          return (
            <div
              key={i}
              className={`bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/30 transition-colors ${
                r.priority === "must" ? "ring-1 ring-red-500/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: r.tagColor + "25", color: r.tagColor }}
                    >
                      {r.tag}
                    </span>
                    {r.priority && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${priority.bg} ${priority.text} ${priority.border}`}>
                        {priority.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono font-bold text-foreground leading-tight">{r.title}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{r.subtitle}</p>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-[11px] font-mono text-foreground/70 leading-relaxed border-t border-border/50 pt-2">
                {r.note}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pro tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
        <p className="text-xs font-mono text-primary uppercase font-bold">Resource Strategy From Toppers</p>
        <ul className="space-y-2">
          {[
            "Don't buy multiple books — master one book per subject. Switching is the #1 time killer.",
            "Marrow videos are the backbone. Everything else supplements. Don't use 3 platforms in parallel.",
            "After each Marrow lecture, immediately do 20 Reflex MCQs on that topic. Same-day MCQs = best retention.",
            "Self-made notes beat all published notes. Your own words stick better. Invest time to make them.",
            "Park's textbook for PSM is non-negotiable — no shortcut. 40-50 marks depend on it.",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-[10px] font-mono text-primary mt-0.5 shrink-0">{i + 1}.</span>
              <p className="text-xs font-mono text-foreground/80 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
