// Utilities for OG image generation data
export function scoreToColor(score: number): string {
  if (score < 4) return "#ef4444"; // red
  if (score < 7) return "#f59e0b"; // amber
  return "#10b981"; // green
}

export function verdictForScore(score: number): string {
  if (score < 4) return "needs_serious_help";
  if (score < 7) return "room_for_improvement";
  return "decent_code";
}

export interface RoastROG {
  // minimal roast object for OG payload
  score: string;
  verdict: string;
  feedback: string;
  language: string;
  lines: number;
  id?: string;
}

export function roastToOg(roast: RoastROG) {
  const scoreNum = parseFloat(roast.score);
  return {
    score: roast.score,
    verdictLabel: roast.verdict,
    feedback: roast.feedback,
    language: roast.language,
    lines: roast.lines,
    color: scoreToColor(scoreNum),
  };
}
