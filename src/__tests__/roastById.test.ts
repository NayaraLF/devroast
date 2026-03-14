import { getRoastById } from "@/app/actions";

// @ts-nocheck
// Mock the DB module to avoid hitting a real database during unit tests
jest.mock("@/db", () => {
  return {
    db: {
      execute: jest.fn().mockResolvedValue([
        {
          id: "roast-1",
          score: 6.5,
          feedback: "ok",
          improvements: ["improve1", "improve2"],
          language: "javascript",
          code: 'console.log("hi")',
          lines: 2,
        },
      ]),
    },
  };
});

describe("getRoastById", () => {
  it("returns a roast object when found", async () => {
    const roast = await getRoastById("roast-1");
    expect(roast).toBeTruthy();
    expect(roast?.id).toBe("roast-1");
    expect(roast?.score).toBe("6.5");
    expect(roast?.language).toBe("javascript");
  });
});
