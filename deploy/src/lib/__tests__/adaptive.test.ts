import { describe, it, expect } from "vitest";
import { computeAdaptivePlan } from "../adaptive";

describe("computeAdaptivePlan", () => {
  it("returns low risk and empty arrays for an untouched state", () => {
    const plan = computeAdaptivePlan({}, []);
    expect(plan.riskLevel).toBe("low");
    expect(plan.missedBlitzDays).toHaveLength(0);
    expect(plan.urgentRemainingDays).toHaveLength(0);
  });

  it("identifies blitz days before the last completed day as missed", () => {
    // Complete day 5 while skipping days 1–4 (all blitz days in the Medicine block)
    const plan = computeAdaptivePlan({}, [5]);
    expect(plan.missedBlitzDays.length).toBeGreaterThan(0);
    plan.missedBlitzDays.forEach(d => expect(d).toBeLessThan(5));
  });

  it("does NOT report missed days when no days are completed", () => {
    const plan = computeAdaptivePlan({}, []);
    expect(plan.missedBlitzDays).toHaveLength(0);
  });

  it("marks a subject as 'weak' when accuracy < 60%", () => {
    // Day 1 belongs to Medicine (SUBJECT_DAYS.Medicine = [1,2,3,4])
    const plan = computeAdaptivePlan({ 1: { attempted: 10, correct: 5 } }, [1]);
    const med  = plan.subjectStrengths.find(s => s.subject === "Medicine");
    expect(med?.status).toBe("weak");
  });

  it("marks a subject as 'borderline' when accuracy is 60–77%", () => {
    const plan = computeAdaptivePlan({ 1: { attempted: 10, correct: 7 } }, [1]);
    const med  = plan.subjectStrengths.find(s => s.subject === "Medicine");
    expect(med?.status).toBe("borderline");
  });

  it("marks a subject as 'strong' when accuracy >= 78%", () => {
    const plan = computeAdaptivePlan({ 1: { attempted: 10, correct: 8 } }, [1]);
    const med  = plan.subjectStrengths.find(s => s.subject === "Medicine");
    expect(med?.status).toBe("strong");
  });

  it("marks a subject as 'untouched' when its day is completed but no MCQ data", () => {
    const plan = computeAdaptivePlan({}, [1]);
    const med  = plan.subjectStrengths.find(s => s.subject === "Medicine");
    expect(med?.status).toBe("untouched");
  });

  it("computes accuracy correctly from multiple days of the same subject", () => {
    // Days 1 and 2 are both Medicine; combine their scores
    const plan = computeAdaptivePlan(
      { 1: { attempted: 5, correct: 4 }, 2: { attempted: 5, correct: 3 } },
      [1, 2],
    );
    const med = plan.subjectStrengths.find(s => s.subject === "Medicine");
    expect(med?.accuracy).toBeCloseTo(70, 0); // (4+3)/(5+5) = 70%
    expect(med?.status).toBe("borderline");
  });

  it("escalates riskLevel to 'high' with 3+ weak subjects", () => {
    // Make Medicine, Surgery, Pathology all weak
    const scores: Record<number, { attempted: number; correct: number }> = {};
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(d => {
      scores[d] = { attempted: 10, correct: 4 }; // 40% — weak
    });
    const plan = computeAdaptivePlan(scores, [1, 2, 3, 4, 5, 6, 7, 8]);
    expect(plan.riskLevel).toBe("high");
  });

  it("escalates riskLevel to 'medium' with 1–2 weak subjects", () => {
    const scores = { 1: { attempted: 10, correct: 4 } }; // Medicine weak
    const plan   = computeAdaptivePlan(scores, [1]);
    expect(["medium", "high"]).toContain(plan.riskLevel);
  });

  it("provides a non-empty summary string", () => {
    const plan = computeAdaptivePlan({}, []);
    expect(typeof plan.summary).toBe("string");
    expect(plan.summary.length).toBeGreaterThan(0);
  });

  it("returns only remaining days in urgentRemainingDays", () => {
    // Make Medicine weak by completing days 1–4 with low accuracy
    const scores: Record<number, { attempted: number; correct: number }> = {};
    [1, 2, 3, 4].forEach(d => { scores[d] = { attempted: 10, correct: 4 }; });
    const plan = computeAdaptivePlan(scores, [1, 2, 3, 4]);
    // Urgent days must be days NOT in completedDays
    plan.urgentRemainingDays.forEach(d => {
      expect([1, 2, 3, 4]).not.toContain(d);
    });
  });
});
