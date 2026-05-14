import { SCHEDULE } from "@/data/schedule";

interface McqScore { attempted: number; correct: number; }

export interface SubjectStrength {
  subject: string;
  days: number[];
  attempted: number;
  accuracy: number | null;
  status: "weak" | "borderline" | "strong" | "untouched";
}

export interface RevisionRecommendation {
  dayId: number;
  originalFocus: string;
  recommendedFocus: string;
  reason: string;
  urgency: "high" | "medium" | "low";
}

export interface AdaptivePlan {
  subjectStrengths: SubjectStrength[];
  missedBlitzDays: number[];
  urgentRemainingDays: number[];
  revisionRecommendations: RevisionRecommendation[];
  riskLevel: "low" | "medium" | "high";
  summary: string;
}

// Blitz days per subject
const SUBJECT_DAYS: Record<string, number[]> = {
  Medicine:    [1, 2, 3, 4],
  Surgery:     [5, 6],
  Pathology:   [7, 8],
  Pharmacology:[9, 10],
  OBG:         [11, 12],
  Paediatrics: [13],
  PSM:         [14, 15],
  Microbiology:[16, 17],
  Forensic:    [18],
};

export function computeAdaptivePlan(
  mcqScores: Record<number, McqScore>,
  completedDays: number[],
): AdaptivePlan {
  const completedSet = new Set(completedDays);
  const lastCompleted = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const remainingDays = SCHEDULE.filter(d => !completedSet.has(d.day));

  // 1. Subject strength — only from completed days
  const subjectStrengths: SubjectStrength[] = Object.entries(SUBJECT_DAYS).map(
    ([subject, days]) => {
      let attempted = 0, correct = 0;
      days.filter(d => completedSet.has(d)).forEach(dayId => {
        const s = mcqScores[dayId];
        if (s?.attempted > 0) { attempted += s.attempted; correct += s.correct; }
      });
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : null;
      const status =
        accuracy === null ? "untouched" :
        accuracy < 60    ? "weak"       :
        accuracy < 78    ? "borderline" : "strong";
      return { subject, days, attempted, accuracy, status };
    }
  );

  // 2. Missed blitz days — blitz day with number < lastCompleted but not completed
  const missedBlitzDays = SCHEDULE
    .filter(d => d.phase === "blitz" && d.day < lastCompleted && !completedSet.has(d.day))
    .map(d => d.day);

  // 3. Urgent remaining blitz days — remaining days belonging to weak subjects
  const weakSubjects = new Set(
    subjectStrengths.filter(s => s.status === "weak").map(s => s.subject)
  );
  const urgentRemainingDays = remainingDays
    .filter(d => d.phase === "blitz" && weakSubjects.has(d.subject))
    .map(d => d.day);

  // 4. Revision day recommendations — redistribute remaining revision days toward weaknesses
  const weakOrBorderline = subjectStrengths
    .filter(s => s.status === "weak" || s.status === "borderline")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "weak" ? -1 : 1;
      return (a.accuracy ?? 0) - (b.accuracy ?? 0);
    });

  const remainingRevision = remainingDays.filter(d => d.phase === "revision");
  const revisionRecommendations: RevisionRecommendation[] = remainingRevision.map((day, i) => {
    const target = weakOrBorderline[i % Math.max(1, weakOrBorderline.length)];
    if (!target) {
      return {
        dayId: day.day,
        originalFocus: day.focus,
        recommendedFocus: day.focus,
        reason: "All subjects on track — follow the original focus",
        urgency: "low" as const,
      };
    }
    const accuracyStr =
      target.accuracy !== null ? `${target.accuracy.toFixed(0)}% accuracy` : "not yet tested";
    return {
      dayId: day.day,
      originalFocus: day.focus,
      recommendedFocus: `${target.subject} — Targeted Revision`,
      reason: `${target.subject} is ${accuracyStr}. Redirect this slot to close the gap.`,
      urgency: (target.status === "weak" ? "high" : "medium") as "high" | "medium",
    };
  });

  // 5. Risk level
  const weakCount = subjectStrengths.filter(s => s.status === "weak").length;
  const riskLevel: AdaptivePlan["riskLevel"] =
    weakCount >= 3 || missedBlitzDays.length >= 4 ? "high" :
    weakCount >= 1 || missedBlitzDays.length >= 2 ? "medium" : "low";

  const summary =
    riskLevel === "high"
      ? `${weakCount} weak subject${weakCount !== 1 ? "s" : ""} + ${missedBlitzDays.length} skipped day${missedBlitzDays.length !== 1 ? "s" : ""} — plan restructured`
      : riskLevel === "medium"
      ? weakOrBorderline.length > 0
        ? `${weakOrBorderline.length} subject${weakOrBorderline.length !== 1 ? "s" : ""} below threshold — revision plan adjusted`
        : `${missedBlitzDays.length} skipped day${missedBlitzDays.length !== 1 ? "s" : ""} — recovery slots identified`
      : "All completed subjects on track — maintain current pace";

  return {
    subjectStrengths,
    missedBlitzDays,
    urgentRemainingDays,
    revisionRecommendations,
    riskLevel,
    summary,
  };
}
