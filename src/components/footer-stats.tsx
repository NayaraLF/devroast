import { getStats } from "@/app/actions";

export async function FooterStats() {
  const stats = await getStats();

  return (
    <div className="flex justify-center gap-6 font-mono text-sm text-text-tertiary">
      <span>{stats.totalCodes.toLocaleString()} codes roasted</span>
      <span>·</span>
      <span>avg score: {stats.avgScore}/10</span>
    </div>
  );
}
