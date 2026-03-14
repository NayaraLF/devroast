// @ts-nocheck
import type { RoastROG } from "@/utils/ogImage";
import { roastToOg, scoreToColor, verdictForScore } from "@/utils/ogImage";

describe("scoreToColor", () => {
  test("maps low score to red", () => {
    expect(scoreToColor(3.5)).toBe("#ef4444");
  });
  test("maps mid score to amber", () => {
    expect(scoreToColor(5)).toBe("#f59e0b");
  });
  test("maps high score to green", () => {
    expect(scoreToColor(8)).toBe("#10b981");
  });
});

describe("verdictForScore", () => {
  test("low score verdict", () => {
    expect(verdictForScore(3.5)).toBe("needs_serious_help");
  });
  test("mid score verdict", () => {
    expect(verdictForScore(6.5)).toBe("room_for_improvement");
  });
  test("high score verdict", () => {
    expect(verdictForScore(8.5)).toBe("decent_code");
  });
});

describe("roastToOg", () => {
  test("maps roast to og payload with color", () => {
    const roast: RoastROG = {
      score: "6.50",
      verdict: "room_for_improvement",
      feedback: "ok",
      language: "ts",
      lines: 10,
    } as any;
    const og = roastToOg(roast);
    expect(og.score).toBe("6.50");
    expect(og.language).toBe("ts");
    expect(og.color).toBe("#f59e0b");
  });
});
