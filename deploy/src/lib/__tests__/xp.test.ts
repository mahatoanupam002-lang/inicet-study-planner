import { describe, it, expect } from "vitest";
import { getRank, getNextRank, getRankProgress, computeBaseXP, RANKS, XP_VALUES } from "../xp";

describe("getRank", () => {
  it("returns Intern for 0 XP", () => {
    expect(getRank(0).title).toBe("Intern");
  });

  it("returns AIIMS Topper for the minimum threshold", () => {
    expect(getRank(15000).title).toBe("AIIMS Topper");
  });

  it("returns AIIMS Topper well above the threshold", () => {
    expect(getRank(99999).title).toBe("AIIMS Topper");
  });

  it("respects lower boundaries correctly", () => {
    expect(getRank(99).title).toBe("Intern");
    expect(getRank(100).title).toBe("House Officer");
    expect(getRank(249).title).toBe("House Officer");
    expect(getRank(250).title).toBe("Junior Resident");
  });

  it("covers all defined ranks without gaps", () => {
    for (const rank of RANKS) {
      expect(getRank(rank.min).title).toBe(rank.title);
    }
  });
});

describe("getNextRank", () => {
  it("returns null for the highest rank (AIIMS Topper)", () => {
    expect(getNextRank(15000)).toBeNull();
  });

  it("returns the next rank for lower XP values", () => {
    expect(getNextRank(0)?.title).toBe("House Officer");
    expect(getNextRank(100)?.title).toBe("Junior Resident");
  });
});

describe("getRankProgress", () => {
  it("returns 100 for the maximum rank", () => {
    expect(getRankProgress(15000)).toBe(100);
  });

  it("returns 0 at the minimum XP of a rank", () => {
    expect(getRankProgress(0)).toBe(0);
    expect(getRankProgress(100)).toBe(0);
  });

  it("returns ~50 at the midpoint of a rank range", () => {
    // House Officer: 100–249; next starts at 250; range = 150; midpoint = 175
    expect(getRankProgress(175)).toBeCloseTo(50, 0);
  });
});

describe("computeBaseXP", () => {
  it("returns 0 for an empty state", () => {
    expect(computeBaseXP([], {}, {}, { count: 0, longest: 0 })).toBe(0);
  });

  it("awards XP_VALUES.day_complete per completed day", () => {
    const xp = computeBaseXP([1, 2, 3], {}, {}, { count: 0, longest: 0 });
    expect(xp).toBe(3 * XP_VALUES.day_complete);
  });

  it("awards correct + wrong MCQ XP", () => {
    const scores = { 1: { attempted: 10, correct: 8 } };
    const xp = computeBaseXP([], scores, {}, { count: 0, longest: 0 });
    expect(xp).toBe(8 * XP_VALUES.mcq_correct + 2 * XP_VALUES.mcq_wrong);
  });

  it("counts only non-empty notes", () => {
    const notes = { 1: "Some note", 2: "Another", 3: "  ", 4: "" };
    const xp = computeBaseXP([], {}, notes, { count: 0, longest: 0 });
    expect(xp).toBe(2 * XP_VALUES.note_added);
  });

  it("awards streak_14 bonus for longest streak >= 14", () => {
    const xp = computeBaseXP([], {}, {}, { count: 0, longest: 14 });
    expect(xp).toBe(XP_VALUES.streak_14);
  });

  it("awards streak_7 bonus for longest streak 7–13", () => {
    const xp = computeBaseXP([], {}, {}, { count: 0, longest: 7 });
    expect(xp).toBe(XP_VALUES.streak_7);
  });

  it("awards streak_3 bonus for longest streak 3–6", () => {
    const xp = computeBaseXP([], {}, {}, { count: 0, longest: 3 });
    expect(xp).toBe(XP_VALUES.streak_3);
  });

  it("combines days + MCQs + notes correctly", () => {
    const expected =
      2 * XP_VALUES.day_complete +
      5 * XP_VALUES.mcq_correct  +
      1 * XP_VALUES.mcq_wrong    +
      1 * XP_VALUES.note_added;
    const xp = computeBaseXP(
      [1, 2],
      { 1: { attempted: 6, correct: 5 } },
      { 1: "hi", 2: "" },
      { count: 0, longest: 0 },
    );
    expect(xp).toBe(expected);
  });
});
