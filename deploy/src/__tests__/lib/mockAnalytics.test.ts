import { describe, it, expect } from "vitest";
import {
  analyzeByConceptt,
  analyzeByQuestionType,
  analyzeByDifficulty,
  identifyWeakAreas,
  calculateMarksLost,
  analyzeTimeManagement,
  generateTestReport,
  getComparativeStats,
  MockTest,
} from "@/lib/mockAnalytics";

const createMockTest = (): MockTest => ({
  id: "test1",
  date: Date.now(),
  totalQuestions: 20,
  questionsAttempted: 20,
  correctAnswers: 14,
  score: 140,
  duration: 3600000, // 1 hour
  questions: [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `q${i}`,
      concept: "Cardiology",
      topic: "Heart",
      difficulty: 3,
      type: "single-answer" as const,
      correctAnswer: "A",
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `q${i + 10}`,
      concept: "Neurology",
      topic: "Brain",
      difficulty: 4,
      type: "multi-answer" as const,
      correctAnswer: "A,B",
    })),
  ],
  responses: [
    ...Array.from({ length: 8 }, (_, i) => ({
      questionId: `q${i}`,
      answered: true,
      correct: true,
      timeSpent: 120000,
      confidence: 4,
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
      questionId: `q${i + 8}`,
      answered: true,
      correct: false,
      timeSpent: 180000,
      confidence: 2,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      questionId: `q${i + 10}`,
      answered: true,
      correct: true,
      timeSpent: 180000,
      confidence: 3,
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      questionId: `q${i + 16}`,
      answered: true,
      correct: false,
      timeSpent: 240000,
      confidence: 1,
    })),
  ],
});

describe("analyzeByConceptt", () => {
  it("groups questions by concept", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);

    expect(analysis.length).toBe(2);
    expect(analysis.map(a => a.concept)).toContain("Cardiology");
    expect(analysis.map(a => a.concept)).toContain("Neurology");
  });

  it("calculates accuracy per concept", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);

    const cardiology = analysis.find(a => a.concept === "Cardiology");
    expect(cardiology?.accuracy).toBe(80); // 8/10
  });

  it("assigns mastery levels", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);

    const cardiology = analysis.find(a => a.concept === "Cardiology");
    expect(cardiology?.mastery).toBe("good"); // 80% = good
  });

  it("calculates average confidence", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);

    const cardiology = analysis.find(a => a.concept === "Cardiology");
    expect(cardiology?.avgConfidence).toBeGreaterThan(0);
  });
});

describe("analyzeByQuestionType", () => {
  it("groups by question type", () => {
    const test = createMockTest();
    const analysis = analyzeByQuestionType(test);

    expect(analysis.length).toBeGreaterThan(0);
    expect(analysis.map(a => a.type)).toContain("single-answer");
  });

  it("calculates accuracy by type", () => {
    const test = createMockTest();
    const analysis = analyzeByQuestionType(test);

    const singleAnswer = analysis.find(a => a.type === "single-answer");
    expect(singleAnswer?.accuracy).toBe(80); // 8/10
  });
});

describe("analyzeByDifficulty", () => {
  it("groups by difficulty level", () => {
    const test = createMockTest();
    const analysis = analyzeByDifficulty(test);

    expect(analysis.length).toBeGreaterThan(0);
    expect(analysis[0].difficulty).toBeGreaterThanOrEqual(1);
    expect(analysis[0].difficulty).toBeLessThanOrEqual(5);
  });

  it("sorts by difficulty ascending", () => {
    const test = createMockTest();
    const analysis = analyzeByDifficulty(test);

    for (let i = 1; i < analysis.length; i++) {
      expect(analysis[i].difficulty).toBeGreaterThanOrEqual(analysis[i - 1].difficulty);
    }
  });
});

describe("identifyWeakAreas", () => {
  it("identifies low accuracy concepts", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);
    const weakAreas = identifyWeakAreas(analysis);

    expect(weakAreas.length).toBeGreaterThan(0);
    expect(weakAreas[0].accuracy).toBeLessThan(70);
  });

  it("prioritizes by severity", () => {
    const test = createMockTest();
    const analysis = analyzeByConceptt(test);
    const weakAreas = identifyWeakAreas(analysis);

    // First item should have highest priority
    if (weakAreas.length > 1) {
      const priorityOrder = { critical: 0, high: 1, medium: 2 };
      expect(
        priorityOrder[weakAreas[0].priority] <=
          priorityOrder[weakAreas[weakAreas.length - 1].priority]
      ).toBe(true);
    }
  });
});

describe("calculateMarksLost", () => {
  it("calculates marks lost per concept", () => {
    const test = createMockTest();
    const marksLost = calculateMarksLost(test, 1);

    expect(marksLost.length).toBeGreaterThan(0);
    expect(marksLost[0]).toHaveProperty("marksLostOnThis");
  });

  it("sorts by marks lost descending", () => {
    const test = createMockTest();
    const marksLost = calculateMarksLost(test, 1);

    for (let i = 1; i < marksLost.length; i++) {
      expect(marksLost[i].marksLostOnThis).toBeLessThanOrEqual(
        marksLost[i - 1].marksLostOnThis
      );
    }
  });

  it("includes reason for marks lost", () => {
    const test = createMockTest();
    const marksLost = calculateMarksLost(test);

    expect(marksLost[0]).toHaveProperty("reason");
    expect(marksLost[0].reason.length).toBeGreaterThan(0);
  });
});

describe("analyzeTimeManagement", () => {
  it("calculates average time per question", () => {
    const test = createMockTest();
    const tm = analyzeTimeManagement(test);

    expect(tm.avgTimePerQuestion).toBeGreaterThan(0);
  });

  it("identifies time wasters", () => {
    const test = createMockTest();
    const tm = analyzeTimeManagement(test);

    expect(tm.timeWasters).toBeDefined();
  });

  it("identifies speed areas", () => {
    const test = createMockTest();
    const tm = analyzeTimeManagement(test);

    expect(tm.speedAreas).toBeDefined();
  });
});

describe("generateTestReport", () => {
  it("generates comprehensive report", () => {
    const test = createMockTest();
    const report = generateTestReport(test);

    expect(report.testId).toBe(test.id);
    expect(report.overallAccuracy).toBeGreaterThan(0);
    expect(report.percentile).toBeGreaterThanOrEqual(0);
  });

  it("includes concept, type, and difficulty analysis", () => {
    const test = createMockTest();
    const report = generateTestReport(test);

    expect(report.conceptAnalysis.length).toBeGreaterThan(0);
    expect(report.typeAnalysis.length).toBeGreaterThan(0);
    expect(report.difficultyAnalysis.length).toBeGreaterThan(0);
  });

  it("identifies weak areas in report", () => {
    const test = createMockTest();
    const report = generateTestReport(test);

    expect(report.weakAreas).toBeDefined();
    expect(Array.isArray(report.weakAreas)).toBe(true);
  });

  it("calculates trends over time", () => {
    const test1 = createMockTest();
    const test2 = createMockTest();
    test2.correctAnswers = 16;
    test2.date = Date.now() + 86400000;

    const report = generateTestReport(test2, [test1]);

    expect(report.trends.performanceVsTime.length).toBeGreaterThan(1);
    expect(report.trends.improvementRate).toBeGreaterThan(0);
  });

  it("determines momentum correctly", () => {
    const test = createMockTest();
    const report = generateTestReport(test);

    expect(["improving", "stable", "declining"]).toContain(report.trends.momentum);
  });
});

describe("getComparativeStats", () => {
  it("calculates user percentile", () => {
    const stats = getComparativeStats(70);

    expect(stats.userPercentile).toBeGreaterThanOrEqual(0);
    expect(stats.userPercentile).toBeLessThanOrEqual(100);
  });

  it("compares with peer average", () => {
    const stats = getComparativeStats(70, 55);

    expect(stats.userVsPeer).toBe(15);
  });

  it("compares with topper", () => {
    const stats = getComparativeStats(70, 55, 85);

    expect(stats.userVsTopper).toBe(-15);
  });

  it("assigns rank estimate", () => {
    const excellent = getComparativeStats(85);
    const average = getComparativeStats(55);
    const poor = getComparativeStats(35);

    expect(excellent.rankEstimate).toContain("Top");
    expect(average.rankEstimate).toContain("Average");
    expect(poor.rankEstimate).toContain("Below");
  });
});
