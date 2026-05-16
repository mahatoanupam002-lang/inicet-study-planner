import { useState, useMemo } from "react";
import { MessageSquare, ThumbsUp, Plus, X, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { safeLoad, safeSave } from "@/lib/storage";

interface QAPost {
  id: number;
  question: string;
  subject: string;
  author: string;
  createdAt: string;
  upvotes: number;
  answers: QAAnswer[];
  isSeeded?: boolean;
}

interface QAAnswer {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  upvotes: number;
  isExpert?: boolean;
}

const SEEDED_QA: QAPost[] = [
  {
    id: 1, isSeeded: true,
    question: "What is the most efficient way to revise pharmacology DOC (Drug of Choice) in 2 days?",
    subject: "Pharmacology",
    author: "Priya_AIIMS",
    createdAt: "2 days ago",
    upvotes: 47,
    answers: [
      {
        id: 1, isExpert: true,
        text: "Best approach: Make a master table with 3 columns — condition / DOC / alternative. Cover all subjects (not just Pharma) since DOC questions cross-pollinate. Revise in order: Cardiology DOCs → Neuro DOCs → Infection DOCs → Endocrine DOCs → Psychiatric DOCs. Don't read explanations at this stage — pure muscle memory. 2 rounds of the table per day.",
        author: "Zainab_Strategy",
        createdAt: "2 days ago",
        upvotes: 38,
      },
      {
        id: 2,
        text: "Also add the DOC questions from AIIMS PYQ (2015-2023) — many are repeated verbatim. Bhatia's book has all of them compiled. That's a guaranteed 8-10 marks if you know all DOCs.",
        author: "RahulAIR3",
        createdAt: "1 day ago",
        upvotes: 22,
      },
    ],
  },
  {
    id: 2, isSeeded: true,
    question: "How do I stop forgetting what I studied the day before? My retention is terrible.",
    subject: "Strategy",
    author: "MedStudent_Mum",
    createdAt: "3 days ago",
    upvotes: 63,
    answers: [
      {
        id: 3, isExpert: true,
        text: "This is a VERY common problem and has a specific fix: active recall + spaced repetition. The issue isn't retention capacity — it's that reading passively never stores the memory deeply. Solution: after each study block, close the book and write 5 things you remember from memory. This is called the 'testing effect' and it works. The notes section in this app uses SM-2 algorithm — use it every evening.",
        author: "Zainab_Strategy",
        createdAt: "3 days ago",
        upvotes: 51,
      },
      {
        id: 4,
        text: "Also important: sleep 7 hours minimum. Memory consolidation happens during slow-wave sleep. Staying awake until 2 AM to study is destroying your own retention — the opposite of what you want.",
        author: "NeurologyTopper",
        createdAt: "2 days ago",
        upvotes: 29,
      },
    ],
  },
  {
    id: 3, isSeeded: true,
    question: "NEET PG 2026 — key changes from previous years and what to expect?",
    subject: "General",
    author: "FirstAttemptDoc",
    createdAt: "5 days ago",
    upvotes: 89,
    answers: [
      {
        id: 5, isExpert: true,
        text: "NEET PG 2026 key things to know: (1) Conducted by NBEMS, 200 MCQs in 210 minutes, -0.25 negative marking; (2) Clinical vignette-style questions are increasing — expect more 'next best step' than pure recall; (3) Syllabus mirrors MCI/NMC graduate curriculum — all 19 subjects; (4) ~2 lakh candidates compete for ~45,000 PG seats; (5) Cutoff for government MD seats typically around AIR <5000 (75%+ score). Preparation approach: Marrow + DAMS test series + PYQ analysis + strong India-specific content.",
        author: "PriyaMenon_AIR7",
        createdAt: "5 days ago",
        upvotes: 72,
      },
    ],
  },
  {
    id: 4, isSeeded: true,
    question: "Is Marrow alone sufficient for NEET PG preparation? Do I need additional resources?",
    subject: "Strategy",
    author: "BudgetPrepper",
    createdAt: "4 days ago",
    upvotes: 55,
    answers: [
      {
        id: 6, isExpert: true,
        text: "Yes, Marrow alone is sufficient for NEET PG — most top rankers used it as their primary platform. What matters more than the platform is: (1) completing it fully, (2) doing all Reflex MCQs on the same day, (3) revising topics 3 times minimum. Additions most toppers make: Park's for PSM (textbook depth matters for PSM), DAMS grand test series for mock practice, and PYQ analysis books for pattern recognition.",
        author: "RahulAIR3",
        createdAt: "4 days ago",
        upvotes: 43,
      },
      {
        id: 7,
        text: "Additionally, AIIMS PYQ books (Bhatia's) are worth having for pattern analysis. Marrow + Park + Bhatia PYQ = complete preparation for most people.",
        author: "AIIMSPrep2024",
        createdAt: "3 days ago",
        upvotes: 18,
      },
    ],
  },
  {
    id: 5, isSeeded: true,
    question: "How to handle the India-specific questions in NEET PG? I always lose marks there.",
    subject: "PSM",
    author: "IndiaSpecificGap",
    createdAt: "6 days ago",
    upvotes: 44,
    answers: [
      {
        id: 8, isExpert: true,
        text: "India-specific content is actually the easiest place to gain marks — unlike clinical reasoning which requires understanding, India stats are pure memorisation and available 100% from known sources. Strategy: (1) Make a 2-page 'India cheat sheet' with NFHS-5 key stats (MMR, IMR, TFR, stunting, institutional delivery), NTEP regimens, NVBDCP data, acts (NDPS, MHCA, POCSO, MTP, PNDT). (2) Read it every day for 5 minutes. (3) Do 10 India-specific MCQs daily. In 28 days you'll have reviewed it 28 times — it'll be effortless.",
        author: "Zainab_Strategy",
        createdAt: "6 days ago",
        upvotes: 38,
      },
    ],
  },
  {
    id: 6, isSeeded: true,
    question: "What should I do if I'm consistently scoring below 60% in mocks at Day 15?",
    subject: "Strategy",
    author: "LowMockScorer",
    createdAt: "1 day ago",
    upvotes: 71,
    answers: [
      {
        id: 9, isExpert: true,
        text: "60% at Day 15 is absolutely okay — don't panic. The score curve is exponential in the last 2 weeks. What matters now: (1) Analyse the mock — which subjects had the most wrong answers? These get emergency attention. (2) Switch from 'new topic learning' mode to 'revision mode' faster — spend 60% of time revising, 40% learning new topics. (3) Focus on your top 3 subjects and make them bulletproof — guaranteed marks there protect your rank even if other subjects are weak. Most toppers saw 15-20 point jumps in accuracy in the final 2 weeks.",
        author: "PriyaMenon_AIR7",
        createdAt: "1 day ago",
        upvotes: 55,
      },
    ],
  },
  {
    id: 7, isSeeded: true,
    question: "Which government colleges have the highest cutoff in NEET PG and what are the seat counts?",
    subject: "General",
    author: "SeatHunter",
    createdAt: "7 days ago",
    upvotes: 38,
    answers: [
      {
        id: 10, isExpert: true,
        text: "Top government PG seats are fiercely competitive. Rough cutoffs: MAMC/Maulana Azad Delhi: AIR <500; Government Medical College state seats: AIR <5000-10000 (state-dependent). Total NEET PG seats ~45,000+, of which ~22,000 are government. Key insight: for desirable government MD in Medicine/Surgery/OBG: target AIR <3000 (score ~80%+). For any government PG seat: AIR <15000 (score ~70%+). State quota vs all-India quota (50/50 split) affects your effective rank.",
        author: "RankAnalyst",
        createdAt: "7 days ago",
        upvotes: 31,
      },
    ],
  },
];

const SUBJECTS_FOR_QA = [
  "All", "Strategy", "General", "Medicine", "Surgery", "Pathology",
  "Pharmacology", "OBG", "Paediatrics", "PSM", "Microbiology", "Forensic",
];

function loadUserQA(): QAPost[] {
  return safeLoad<QAPost[]>("neetpg_community_qa", []);
}
function saveUserQA(posts: QAPost[]) {
  safeSave("neetpg_community_qa", posts);
}
function loadVotes(): Record<string, boolean> {
  return safeLoad<Record<string, boolean>>("neetpg_qa_votes", {});
}
function saveVotes(v: Record<string, boolean>) {
  safeSave("neetpg_qa_votes", v);
}

export function CommunityQA() {
  const [userPosts, setUserPosts] = useState<QAPost[]>(loadUserQA);
  const [votes, setVotes] = useState<Record<string, boolean>>(loadVotes);
  const [filterSubject, setFilterSubject] = useState("All");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newSubject, setNewSubject] = useState("Strategy");
  const [newAuthor, setNewAuthor] = useState("");
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [showAnswerForm, setShowAnswerForm] = useState<number | null>(null);

  const allPosts = useMemo(() => {
    const combined = [...SEEDED_QA, ...userPosts];
    if (filterSubject === "All") return combined;
    return combined.filter(p => p.subject === filterSubject);
  }, [userPosts, filterSubject]);

  const votePost = (postId: number) => {
    const key = `post_${postId}`;
    if (votes[key]) return;
    const newVotes = { ...votes, [key]: true };
    setVotes(newVotes);
    saveVotes(newVotes);
    setUserPosts(prev => {
      const updated = prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p);
      saveUserQA(updated);
      return updated;
    });
  };

  const voteAnswer = (postId: number, answerId: number) => {
    const key = `ans_${postId}_${answerId}`;
    if (votes[key]) return;
    const newVotes = { ...votes, [key]: true };
    setVotes(newVotes);
    saveVotes(newVotes);
    const allPosts_ = [...SEEDED_QA, ...userPosts];
    const isSeeded = SEEDED_QA.some(p => p.id === postId);
    if (!isSeeded) {
      setUserPosts(prev => {
        const updated = prev.map(p => p.id === postId
          ? { ...p, answers: p.answers.map(a => a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a) }
          : p);
        saveUserQA(updated);
        return updated;
      });
    }
    void allPosts_;
  };

  const submitQuestion = () => {
    if (!newQuestion.trim()) return;
    const post: QAPost = {
      id: Date.now(),
      question: newQuestion.trim(),
      subject: newSubject,
      author: newAuthor.trim() || "Anonymous",
      createdAt: "Just now",
      upvotes: 0,
      answers: [],
    };
    const updated = [...userPosts, post];
    setUserPosts(updated);
    saveUserQA(updated);
    setNewQuestion("");
    setNewAuthor("");
    setShowAskForm(false);
    setExpandedPost(post.id);
  };

  const submitAnswer = (postId: number) => {
    const text = answerText[postId]?.trim();
    if (!text) return;
    const answer: QAAnswer = {
      id: Date.now(),
      text,
      author: "You",
      createdAt: "Just now",
      upvotes: 0,
    };
    setUserPosts(prev => {
      const updated = prev.map(p => p.id === postId ? { ...p, answers: [...p.answers, answer] } : p);
      saveUserQA(updated);
      return updated;
    });
    setAnswerText(prev => ({ ...prev, [postId]: "" }));
    setShowAnswerForm(null);
  };

  const getUpvoteKey = (type: "post" | "ans", postId: number, answerId?: number) =>
    type === "post" ? `post_${postId}` : `ans_${postId}_${answerId}`;

  const getAnswers = (post: QAPost): QAAnswer[] => {
    const userPostMatch = userPosts.find(p => p.id === post.id);
    return userPostMatch ? userPostMatch.answers : post.answers;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-violet-500/20 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-foreground uppercase tracking-wider text-sm">Community Q&A</h2>
            <p className="text-xs text-muted-foreground font-mono">Ask questions, share answers</p>
          </div>
        </div>
        <button
          onClick={() => setShowAskForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-mono rounded-lg hover:opacity-90 transition-opacity"
        >
          {showAskForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAskForm ? "Cancel" : "Ask Question"}
        </button>
      </div>

      {/* Ask form */}
      {showAskForm && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 space-y-3">
          <p className="text-xs font-mono text-primary uppercase font-bold">New Question</p>
          <textarea
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="What do you want to ask the community?"
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex gap-3 flex-wrap">
            <input
              value={newAuthor}
              onChange={e => setNewAuthor(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 min-w-32 bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
            />
            <select
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary"
            >
              {SUBJECTS_FOR_QA.filter(s => s !== "All").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            onClick={submitQuestion}
            disabled={!newQuestion.trim()}
            className="px-5 py-2 bg-primary text-primary-foreground text-xs font-mono rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Post Question
          </button>
        </div>
      )}

      {/* Subject filter */}
      <div className="flex flex-wrap gap-1.5">
        {SUBJECTS_FOR_QA.map(s => (
          <button
            key={s}
            onClick={() => setFilterSubject(s)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-full border transition-colors ${
              filterSubject === s
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground border-border hover:border-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Q&A posts */}
      <div className="space-y-3">
        {allPosts.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-mono text-muted-foreground">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          allPosts
            .sort((a, b) => b.upvotes - a.upvotes)
            .map(post => {
              const isExpanded = expandedPost === post.id;
              const answers = getAnswers(post);
              const postVoted = !!votes[getUpvoteKey("post", post.id)];

              return (
                <div key={post.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
                  <div className="px-5 pt-4 pb-3">
                    <div className="flex items-start gap-3">
                      {/* Upvote */}
                      <button
                        onClick={() => votePost(post.id)}
                        className={`flex flex-col items-center gap-0.5 shrink-0 transition-colors ${
                          postVoted ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono">{post.upvotes + (postVoted && post.isSeeded ? 1 : 0)}</span>
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            <Tag className="w-2.5 h-2.5 inline mr-1" />{post.subject}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">{post.author}</span>
                          <span className="text-[10px] font-mono text-muted-foreground/50">{post.createdAt}</span>
                        </div>
                        <p className="text-sm font-mono text-foreground leading-relaxed">{post.question}</p>
                      </div>
                    </div>

                    {/* Toggle expand */}
                    <button
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors ml-8"
                    >
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {answers.length} answer{answers.length !== 1 ? "s" : ""}
                    </button>
                  </div>

                  {/* Answers */}
                  {isExpanded && (
                    <div className="border-t border-border/50 divide-y divide-border/30">
                      {answers.map(ans => {
                        const ansVoted = !!votes[getUpvoteKey("ans", post.id, ans.id)];
                        return (
                          <div key={ans.id} className={`px-5 py-4 ${ans.isExpert ? "bg-primary/3" : ""}`}>
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => voteAnswer(post.id, ans.id)}
                                className={`flex flex-col items-center gap-0.5 shrink-0 transition-colors ${
                                  ansVoted ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span className="text-[10px] font-mono">{ans.upvotes}</span>
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className={`text-[10px] font-mono font-bold ${ans.isExpert ? "text-primary" : "text-muted-foreground"}`}>
                                    {ans.author}
                                  </span>
                                  {ans.isExpert && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-primary/15 text-primary rounded border border-primary/20">
                                      TOPPER
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono text-muted-foreground/50">{ans.createdAt}</span>
                                </div>
                                <p className="text-xs font-mono text-foreground/80 leading-relaxed">{ans.text}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add answer */}
                      {showAnswerForm === post.id ? (
                        <div className="px-5 py-4 space-y-3">
                          <textarea
                            value={answerText[post.id] || ""}
                            onChange={e => setAnswerText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write your answer..."
                            rows={3}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => submitAnswer(post.id)}
                              disabled={!answerText[post.id]?.trim()}
                              className="px-4 py-1.5 bg-primary text-primary-foreground text-[11px] font-mono rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity"
                            >
                              Post Answer
                            </button>
                            <button
                              onClick={() => setShowAnswerForm(null)}
                              className="px-4 py-1.5 text-[11px] font-mono border border-border rounded-lg text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-5 py-3">
                          <button
                            onClick={() => setShowAnswerForm(post.id)}
                            className="text-[11px] font-mono text-primary hover:text-primary/80 transition-colors"
                          >
                            + Add your answer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
