/**
 * Mock Test Deep Analytics
 * Comprehensive performance breakdown by concept, question type, difficulty, and trends
 */

export interface TestResponse {
  questionId: string;
  answered: boolean;
  correct: boolean;
  timeSpent: number; // milliseconds
  confidence: number; // 0-5 (user's self-rated confidence)
}

export interface Question {
  id: string;
  concept: string;
  topic: string;
  difficulty: number; // 1-5
  type: "single-answer" | "multi-answer" | "matching" | "case-study";
  correctAnswer: string;
}

export interface MockTest {
  id: string;
  date: number; // timestamp
  totalQuestions: number;
  questionsAttempted: number;
  correctAnswers: number;
  score: number; // 0-200 for INICET
  duration: number; // milliseconds
  responses: TestResponse[];
  questions: Question[];
}

export interface ConceptAnalysis {
  concept: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0-100%
  avgTimeSpent: number; // milliseconds per question
  avgConfidence: number; // 0-5
  mastery: "excellent" | "good" | "fair" | "weak" | "untouched";
  confidenceScore: number; // statistical confidence 0-1
}

export interface QuestionTypeAnalysis {
  type: "single-answer" | "multi-answer" | "matching" | "case-study";
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  avgTimeSpent: number;
  difficulty: number; // avg difficulty
}

export interface DifficultyAnalysis {
  difficulty: number; // 1-5
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  avgTimeSpent: number;
}

export interface TestReport {
  testId: string;
  date: string;
  overallScore: number; // 0-200
  overallAccuracy: number; // 0-100%
  percentile: number; // 0-100 (estimated vs average)
  conceptAnalysis: ConceptAnalysis[];
  typeAnalysis: QuestionTypeAnalysis[];
  difficultyAnalysis: DifficultyAnalysis[];
  weakAreas: {
    concept: string;
    accuracy: number;
    questionsWrong: number;
    priority: "critical" | "high" | "medium";
  }[];
  strengths: {
    concept: string;
    accuracy: number;
  }[];
  marksLost: {
    concept: string;
    marksLostOnThis: number;
    totalMarksForConcept: number;
    reason: string;
  }[];
  timeManagement: {
    avgTimePerQuestion: number;
    timeWasters: { concept: string; avgTime: number }[];
    speedAreas: { concept: string; avgTime: number }[];
  };
  trends: {
    performanceVsTime: { test: number; score: number }[];
    improvementRate: number; // % per test
    momentum: "improving" | "stable" | "declining";
  };
}

export interface ComparativeStats {
  userPercentile: number; // where user ranks vs typical test-takers
  userAccuracy: number;
  peerAverageAccuracy: number; // estimated peer average
  topperAccuracy: number; // estimated top performer
  userVsPeer: number; // percentage points ahead/behind
  userVsTopper: number; // percentage points ahead/behind
  rankEstimate: string; // e.g., "Top 5%" or "Below Average"
}

/**
 * Analyze concept-wise performance
 */
export function analyzeByConceptt(test: MockTest): ConceptAnalysis[] {
  const conceptMap: Record<string, TestResponse[]> = {};

  test.questions.forEach((q, idx) => {
    if (!conceptMap[q.concept]) {
      conceptMap[q.concept] = [];
    }
    const response = test.responses[idx];
    if (response) {
      conceptMap[q.concept].push(response);
    }
  });

  return Object.entries(conceptMap).map(([concept, responses]) => {
    const correctCount = responses.filter(r => r.correct).length;
    const accuracy = (correctCount / responses.length) * 100;
    const avgTime = responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length;
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;

    // Confidence score: higher for consistent responses
    const variance = responses.reduce((sum, r) => {
      const expectedCorrect = r.confidence > 3 ? 1 : 0;
      return sum + (r.correct === (expectedCorrect === 1) ? 1 : 0);
    }, 0) / responses.length;
    const confidenceScore = variance;

    let mastery: "excellent" | "good" | "fair" | "weak" | "untouched";
    if (responses.length === 0) {
      mastery = "untouched";
    } else if (accuracy >= 85) {
      mastery = "excellent";
    } else if (accuracy >= 70) {
      mastery = "good";
    } else if (accuracy >= 50) {
      mastery = "fair";
    } else {
      mastery = "weak";
    }

    return {
      concept,
      totalQuestions: responses.length,
      correctAnswers: correctCount,
      accuracy,
      avgTimeSpent: avgTime,
      avgConfidence,
      mastery,
      confidenceScore,
    };
  });
}

/**
 * Analyze performance by question type
 */
export function analyzeByQuestionType(test: MockTest): QuestionTypeAnalysis[] {
  const typeMap: Record<string, { q: Question; r: TestResponse }[]> = {};

  test.questions.forEach((q, idx) => {
    if (!typeMap[q.type]) {
      typeMap[q.type] = [];
    }
    const response = test.responses[idx];
    if (response) {
      typeMap[q.type].push({ q, r: response });
    }
  });

  return Object.entries(typeMap).map(([type, items]) => {
    const correctCount = items.filter(item => item.r.correct).length;
    const accuracy = (correctCount / items.length) * 100;
    const avgTime = items.reduce((sum, item) => sum + item.r.timeSpent, 0) / items.length;
    const avgDifficulty = items.reduce((sum, item) => sum + item.q.difficulty, 0) / items.length;

    return {
      type: type as QuestionTypeAnalysis["type"],
      totalQuestions: items.length,
      correctAnswers: correctCount,
      accuracy,
      avgTimeSpent: avgTime,
      difficulty: Math.round(avgDifficulty * 10) / 10,
    };
  });
}

/**
 * Analyze performance by difficulty level
 */
export function analyzeByDifficulty(test: MockTest): DifficultyAnalysis[] {
  const diffMap: Record<number, TestResponse[]> = {};

  test.questions.forEach((q, idx) => {
    if (!diffMap[q.difficulty]) {
      diffMap[q.difficulty] = [];
    }
    const response = test.responses[idx];
    if (response) {
      diffMap[q.difficulty].push(response);
    }
  });

  return Object.entries(diffMap)
    .map(([diff, responses]) => {
      const difficulty = parseInt(diff);
      const correctCount = responses.filter(r => r.correct).length;
      const accuracy = (correctCount / responses.length) * 100;
      const avgTime = responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length;

      return {
        difficulty,
        totalQuestions: responses.length,
        correctAnswers: correctCount,
        accuracy,
        avgTimeSpent: avgTime,
      };
    })
    .sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Identify weak areas and priority order
 */
export function identifyWeakAreas(conceptAnalysis: ConceptAnalysis[]): Array<{
  concept: string;
  accuracy: number;
  questionsWrong: number;
  priority: "critical" | "high" | "medium";
}> {
  return conceptAnalysis
    .filter(c => c.mastery === "weak" || c.mastery === "fair")
    .map(c => {
      let priority: "critical" | "high" | "medium";
      if (c.mastery === "weak") {
        priority = "critical";
      } else if (c.accuracy < 60) {
        priority = "high";
      } else {
        priority = "medium";
      }

      return {
        concept: c.concept,
        accuracy: c.accuracy,
        questionsWrong: c.totalQuestions - c.correctAnswers,
        priority,
      };
    })
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

/**
 * Calculate marks lost per concept
 */
export function calculateMarksLost(test: MockTest, marksPerQuestion: number = 1): Array<{
  concept: string;
  marksLostOnThis: number;
  totalMarksForConcept: number;
  reason: string;
}> {
  const conceptAnalysis = analyzeByConceptt(test);

  return conceptAnalysis
    .filter(c => c.accuracy < 100)
    .map(c => {
      const wrongCount = c.totalQuestions - c.correctAnswers;
      const marksLost = wrongCount * marksPerQuestion;
      const totalMarks = c.totalQuestions * marksPerQuestion;

      let reason = "";
      if (c.avgConfidence < 2) {
        reason = "Low confidence on these questions";
      } else if (c.avgTimeSpent < 30000) {
        reason = "Rushed through these questions";
      } else if (c.accuracy < 40) {
        reason = "Poor concept understanding";
      } else {
        reason = "Careless mistakes";
      }

      return {
        concept: c.concept,
        marksLostOnThis: marksLost,
        totalMarksForConcept: totalMarks,
        reason,
      };
    })
    .sort((a, b) => b.marksLostOnThis - a.marksLostOnThis);
}

/**
 * Analyze time management
 */
export function analyzeTimeManagement(test: MockTest): {
  avgTimePerQuestion: number;
  timeWasters: { concept: string; avgTime: number }[];
  speedAreas: { concept: string; avgTime: number }[];
} {
  const conceptAnalysis = analyzeByConceptt(test);
  const avgTime = test.duration / test.questionsAttempted;

  const timeWasters = conceptAnalysis
    .filter(c => c.avgTimeSpent > avgTime * 1.5)
    .sort((a, b) => b.avgTimeSpent - a.avgTimeSpent)
    .slice(0, 3)
    .map(c => ({
      concept: c.concept,
      avgTime: Math.round(c.avgTimeSpent / 1000), // convert to seconds
    }));

  const speedAreas = conceptAnalysis
    .filter(c => c.avgTimeSpent < avgTime * 0.5 && c.accuracy < 60)
    .sort((a, b) => a.avgTimeSpent - b.avgTimeSpent)
    .slice(0, 3)
    .map(c => ({
      concept: c.concept,
      avgTime: Math.round(c.avgTimeSpent / 1000),
    }));

  return {
    avgTimePerQuestion: Math.round(avgTime / 1000),
    timeWasters,
    speedAreas,
  };
}

/**
 * Generate comprehensive test report
 */
export function generateTestReport(
  test: MockTest,
  previousTests: MockTest[] = []
): TestReport {
  const overallAccuracy = (test.correctAnswers / test.questionsAttempted) * 100;
  const conceptAnalysis = analyzeByConceptt(test);
  const typeAnalysis = analyzeByQuestionType(test);
  const difficultyAnalysis = analyzeByDifficulty(test);

  // Estimate percentile (vs typical test-taker: ~50% accuracy)
  const percentile = Math.min(100, Math.max(0, (overallAccuracy / 100) * 100));

  // Performance trends
  const performanceVsTime = previousTests
    .concat(test)
    .map((t, idx) => ({
      test: idx + 1,
      score: (t.correctAnswers / t.questionsAttempted) * 200,
    }));

  const improvementRate =
    previousTests.length > 0
      ? ((overallAccuracy - (previousTests[previousTests.length - 1].correctAnswers /
          previousTests[previousTests.length - 1].questionsAttempted) * 100) /
          previousTests.length) * 100
      : 0;

  const momentum =
    improvementRate > 2 ? "improving" : improvementRate < -2 ? "declining" : "stable";

  return {
    testId: test.id,
    date: new Date(test.date).toISOString().split("T")[0],
    overallScore: test.score,
    overallAccuracy,
    percentile,
    conceptAnalysis,
    typeAnalysis,
    difficultyAnalysis,
    weakAreas: identifyWeakAreas(conceptAnalysis),
    strengths: conceptAnalysis
      .filter(c => c.mastery === "excellent" || c.mastery === "good")
      .map(c => ({ concept: c.concept, accuracy: c.accuracy }))
      .sort((a, b) => b.accuracy - a.accuracy),
    marksLost: calculateMarksLost(test),
    timeManagement: analyzeTimeManagement(test),
    trends: {
      performanceVsTime,
      improvementRate,
      momentum,
    },
  };
}

/**
 * Compare with peers (estimated statistics)
 */
export function getComparativeStats(
  userAccuracy: number,
  peerAverageAccuracy: number = 55, // typical
  topperAccuracy: number = 85 // top 5%
): ComparativeStats {
  const userPercentile = Math.min(100, Math.max(0, (userAccuracy / 100) * 100));

  let rankEstimate = "";
  if (userAccuracy >= topperAccuracy) {
    rankEstimate = "Top 5%";
  } else if (userAccuracy >= 75) {
    rankEstimate = "Top 15%";
  } else if (userAccuracy >= 65) {
    rankEstimate = "Top 35%";
  } else if (userAccuracy >= peerAverageAccuracy) {
    rankEstimate = "Above Average";
  } else {
    rankEstimate = "Below Average";
  }

  return {
    userPercentile,
    userAccuracy: Math.round(userAccuracy),
    peerAverageAccuracy,
    topperAccuracy,
    userVsPeer: Math.round(userAccuracy - peerAverageAccuracy),
    userVsTopper: Math.round(userAccuracy - topperAccuracy),
    rankEstimate,
  };
}
