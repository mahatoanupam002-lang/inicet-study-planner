import React from "react";
import {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Trophy,
  Clock,
  Target,
} from "lucide-react";
import { generateTestReport, getComparativeStats, MockTest } from "@/lib/mockAnalytics";

interface TestAnalyticsDashboardProps {
  test: MockTest;
  previousTests?: MockTest[];
}

export function TestAnalyticsDashboard({
  test,
  previousTests = [],
}: TestAnalyticsDashboardProps) {
  const report = generateTestReport(test, previousTests);
  const comparativeStats = getComparativeStats(report.overallAccuracy);

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-900">Test Results</h3>
          <span className="text-3xl font-bold text-blue-600">{report.overallScore}/200</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-700 mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-blue-900">{Math.round(report.overallAccuracy)}%</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 mb-1">Percentile</p>
            <p className="text-2xl font-bold text-blue-900">{Math.round(report.percentile)}%</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 mb-1">Rank Estimate</p>
            <p className="text-lg font-bold text-blue-900">{comparativeStats.rankEstimate}</p>
          </div>
        </div>
      </div>

      {/* Comparative Analysis */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">How You Compare</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-800">vs Peer Average ({comparativeStats.peerAverageAccuracy}%)</span>
            <span className={`font-semibold ${comparativeStats.userVsPeer >= 0 ? "text-green-600" : "text-red-600"}`}>
              {comparativeStats.userVsPeer > 0 ? "+" : ""}{comparativeStats.userVsPeer}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-800">vs Topper ({comparativeStats.topperAccuracy}%)</span>
            <span className={`font-semibold ${comparativeStats.userVsTopper >= 0 ? "text-green-600" : "text-red-600"}`}>
              {comparativeStats.userVsTopper > 0 ? "+" : ""}{comparativeStats.userVsTopper}%
            </span>
          </div>
        </div>
      </div>

      {/* Weak Areas */}
      {report.weakAreas.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Weak Areas</h3>
          </div>
          <div className="space-y-2">
            {report.weakAreas.slice(0, 5).map(area => (
              <div
                key={area.concept}
                className="p-2 bg-white rounded border border-red-200 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-900">{area.concept}</span>
                  <span className="text-red-700 font-semibold">{Math.round(area.accuracy)}%</span>
                </div>
                <div className="text-xs text-red-600 mt-1">
                  {area.questionsWrong} wrong • {area.priority.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {report.strengths.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Strengths</h3>
          </div>
          <div className="space-y-2">
            {report.strengths.slice(0, 3).map(strength => (
              <div key={strength.concept} className="p-2 bg-white rounded border border-green-200 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-900">{strength.concept}</span>
                  <span className="text-green-700 font-semibold">{Math.round(strength.accuracy)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Management */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Time Management</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-orange-800 font-medium mb-1">Average: {report.timeManagement.avgTimePerQuestion}s/question</p>
          </div>
          {report.timeManagement.timeWasters.length > 0 && (
            <div>
              <p className="text-orange-800 font-medium mb-1">⏱️ Time Wasters (too slow):</p>
              <div className="space-y-1">
                {report.timeManagement.timeWasters.map(item => (
                  <div key={item.concept} className="text-orange-700">
                    {item.concept}: {item.avgTime}s/q
                  </div>
                ))}
              </div>
            </div>
          )}
          {report.timeManagement.speedAreas.length > 0 && (
            <div>
              <p className="text-orange-800 font-medium mb-1">⚡ Speed Areas (too fast):</p>
              <div className="space-y-1">
                {report.timeManagement.speedAreas.map(item => (
                  <div key={item.concept} className="text-orange-700">
                    {item.concept}: {item.avgTime}s/q
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Concept-wise Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Concept-wise Performance</h3>
        </div>
        <div className="space-y-2">
          {report.conceptAnalysis.slice(0, 8).map(concept => (
            <div key={concept.concept}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{concept.concept}</span>
                <span className="text-xs font-semibold text-gray-600">
                  {Math.round(concept.accuracy)}% ({concept.correctAnswers}/{concept.totalQuestions})
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    concept.accuracy >= 85
                      ? "bg-green-500"
                      : concept.accuracy >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${concept.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marks Lost Analysis */}
      {report.marksLost.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-900">Marks Lost Analysis</h3>
          </div>
          <div className="space-y-2">
            {report.marksLost.slice(0, 5).map(item => (
              <div key={item.concept} className="p-2 bg-white rounded border border-indigo-200 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-indigo-900">{item.concept}</span>
                  <span className="text-indigo-700 font-semibold">
                    -{item.marksLostOnThis} marks
                  </span>
                </div>
                <p className="text-xs text-indigo-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Trend */}
      {previousTests.length > 0 && (
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-teal-900">Performance Trend</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-teal-800">Momentum:</span>
              <span className={`ml-2 font-semibold capitalize ${
                report.trends.momentum === "improving"
                  ? "text-green-600"
                  : report.trends.momentum === "declining"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
                {report.trends.momentum}
              </span>
            </div>
            <div>
              <span className="text-teal-800">Improvement Rate:</span>
              <span className="ml-2 font-semibold text-teal-900">
                {report.trends.improvementRate.toFixed(1)}% per test
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
