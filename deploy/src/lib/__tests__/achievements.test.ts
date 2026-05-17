import { describe, it, expect } from "vitest";
import { checkAchievements, ACHIEVEMENTS } from "../achievements";
import type { AchievementState } from "../achievements";

const empty: AchievementState = {
  completedDays:       [],
  streak:              { count: 0, longest: 0 },
  mcqCorrect:          0,
  mcqAttempted:        0,
  pyqAttempted:        0,
  notesCount:          0,
  drillsCompleted:     0,
  simulationCompleted: false,
};

describe("checkAchievements", () => {
  it("unlocks first_step when 1+ days completed", () => {
    const newly = checkAchievements({ ...empty, completedDays: [1] }, 0, []);
    expect(newly.map(a => a.id)).toContain("first_step");
  });

  it("does NOT re-unlock already unlocked achievements", () => {
    const newly = checkAchievements({ ...empty, completedDays: [1] }, 0, ["first_step"]);
    expect(newly.map(a => a.id)).not.toContain("first_step");
  });

  it("unlocks on_a_roll for streak longest >= 3", () => {
    const newly = checkAchievements({ ...empty, streak: { count: 3, longest: 3 } }, 0, []);
    expect(newly.map(a => a.id)).toContain("on_a_roll");
  });

  it("unlocks week_warrior for streak longest >= 7", () => {
    const newly = checkAchievements({ ...empty, streak: { count: 7, longest: 7 } }, 0, []);
    expect(newly.map(a => a.id)).toContain("week_warrior");
  });

  it("unlocks halfway when 14 days completed", () => {
    const days = Array.from({ length: 14 }, (_, i) => i + 1);
    const newly = checkAchievements({ ...empty, completedDays: days }, 0, []);
    expect(newly.map(a => a.id)).toContain("halfway");
  });

  it("unlocks war_plan when 28 days completed", () => {
    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const newly = checkAchievements({ ...empty, completedDays: days }, 0, []);
    expect(newly.map(a => a.id)).toContain("war_plan");
  });

  it("unlocks mock_master when simulation completed", () => {
    const newly = checkAchievements({ ...empty, simulationCompleted: true }, 0, []);
    expect(newly.map(a => a.id)).toContain("mock_master");
  });

  it("unlocks aiims_aspirant at 1000 XP", () => {
    const newly = checkAchievements(empty, 1000, []);
    expect(newly.map(a => a.id)).toContain("aiims_aspirant");
  });

  it("does NOT unlock aiims_aspirant below 1000 XP", () => {
    const newly = checkAchievements(empty, 999, []);
    expect(newly.map(a => a.id)).not.toContain("aiims_aspirant");
  });

  it("unlocks high_performer with 90%+ accuracy and 50+ attempts", () => {
    const newly = checkAchievements({ ...empty, mcqAttempted: 50, mcqCorrect: 46 }, 0, []);
    expect(newly.map(a => a.id)).toContain("high_performer");
  });

  it("does NOT unlock high_performer below 50 attempts even at 100%", () => {
    const newly = checkAchievements({ ...empty, mcqAttempted: 10, mcqCorrect: 10 }, 0, []);
    expect(newly.map(a => a.id)).not.toContain("high_performer");
  });

  it("unlocks drill_sergeant after 5 drills", () => {
    const newly = checkAchievements({ ...empty, drillsCompleted: 5 }, 0, []);
    expect(newly.map(a => a.id)).toContain("drill_sergeant");
  });

  it("unlocks speed_demon after 1 drill", () => {
    const newly = checkAchievements({ ...empty, drillsCompleted: 1 }, 0, []);
    expect(newly.map(a => a.id)).toContain("speed_demon");
  });

  it("returns empty array when all achievements already unlocked", () => {
    const allIds = ACHIEVEMENTS.map(a => a.id);
    const state: AchievementState = {
      completedDays:       Array.from({ length: 28 }, (_, i) => i + 1),
      streak:              { count: 14, longest: 14 },
      mcqCorrect:          600,
      mcqAttempted:        600,
      pyqAttempted:        60,
      notesCount:          15,
      drillsCompleted:     10,
      simulationCompleted: true,
    };
    const newly = checkAchievements(state, 20000, allIds);
    expect(newly).toHaveLength(0);
  });

  it("each unlocked achievement carries an xpReward > 0", () => {
    const newly = checkAchievements({ ...empty, completedDays: [1] }, 1000, []);
    for (const a of newly) {
      expect(a.xpReward).toBeGreaterThan(0);
    }
  });
});
