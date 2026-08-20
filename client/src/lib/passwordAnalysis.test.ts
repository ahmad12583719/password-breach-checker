import { describe, expect, it } from "vitest";
import { analyzePassword } from "./passwordAnalysis";

describe("analyzePassword", () => {
  it("rates a bundled common password as weak", () => {
    const result = analyzePassword("password");
    expect(result.rating).toBe("Weak");
    expect(result.issues.some((issue) => issue.code === "common")).toBe(true);
  });

  it("rates a long mixed password as very strong", () => {
    const result = analyzePassword("Cedar!Orbit7#Violet");
    expect(result.rating).toBe("Very Strong");
    expect(result.score).toBeGreaterThanOrEqual(78);
  });

  it("handles empty input without throwing", () => {
    expect(analyzePassword("")).toMatchObject({ rating: "Weak", score: 0, entropy: 0 });
  });

  it("handles very long and unicode passwords", () => {
    const password = `${"Āß9!".repeat(80)}終`;
    const result = analyzePassword(password);
    expect(result.entropy).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(70);
  });
});

