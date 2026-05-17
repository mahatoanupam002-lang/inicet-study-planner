import { describe, it, expect } from "vitest";
import { sm2Update, isDue, daysUntilDue, NEW_CARD } from "../sr";

describe("sm2Update", () => {
  it("resets interval to 1 and repetitions to 0 when quality < 3", () => {
    const card = sm2Update(NEW_CARD, 1);
    expect(card.interval).toBe(1);
    expect(card.repetitions).toBe(0);
  });

  it("sets interval to 1 after the first correct review", () => {
    const card = sm2Update(NEW_CARD, 4);
    expect(card.interval).toBe(1);
    expect(card.repetitions).toBe(1);
  });

  it("sets interval to 6 after the second correct review", () => {
    const card1 = sm2Update(NEW_CARD, 5);
    const card2 = sm2Update(card1, 5);
    expect(card2.interval).toBe(6);
    expect(card2.repetitions).toBe(2);
  });

  it("multiplies interval by ef after the third+ correct review", () => {
    const c1 = sm2Update(NEW_CARD, 5);
    const c2 = sm2Update(c1, 5);
    const c3 = sm2Update(c2, 5);
    expect(c3.interval).toBeCloseTo(c2.interval * c2.ef, 0);
    expect(c3.repetitions).toBe(3);
  });

  it("decreases ef for low quality", () => {
    const card = sm2Update(NEW_CARD, 1);
    expect(card.ef).toBeLessThan(NEW_CARD.ef);
  });

  it("increases ef for quality 5", () => {
    const card = sm2Update(NEW_CARD, 5);
    expect(card.ef).toBeGreaterThan(NEW_CARD.ef);
  });

  it("ef never drops below 1.3", () => {
    let card = NEW_CARD;
    for (let i = 0; i < 30; i++) card = sm2Update(card, 1);
    expect(card.ef).toBeGreaterThanOrEqual(1.3);
  });

  it("sets a dueDate on or after today", () => {
    const today = new Date().toISOString().slice(0, 10);
    const card  = sm2Update(NEW_CARD, 5);
    expect(card.dueDate >= today).toBe(true);
  });
});

describe("isDue", () => {
  it("returns true for undefined (never reviewed)", () => {
    expect(isDue(undefined)).toBe(true);
  });

  it("returns true for a past due date", () => {
    const card = { ...NEW_CARD, dueDate: "2000-01-01" };
    expect(isDue(card)).toBe(true);
  });

  it("returns false for a far-future due date", () => {
    const card = { ...NEW_CARD, dueDate: "2099-12-31" };
    expect(isDue(card)).toBe(false);
  });
});

describe("daysUntilDue", () => {
  it("returns 0 for a past due date", () => {
    const card = { ...NEW_CARD, dueDate: "2000-01-01" };
    expect(daysUntilDue(card)).toBe(0);
  });

  it("returns a positive number for a future due date", () => {
    const card = { ...NEW_CARD, dueDate: "2099-12-31" };
    expect(daysUntilDue(card)).toBeGreaterThan(0);
  });
});
