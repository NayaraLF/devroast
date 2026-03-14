import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getLeaderboard, getStats } from "@/app/actions";
import {
  LeaderboardEntry,
  type ShameEntry,
} from "@/components/leaderboard-entries";
import { Navbar } from "@/components/navbar";

export const revalidate = 3600;

function LeaderboardSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border-primary"
        >
          <div className="flex h-12 items-center justify-between border-b border-border-primary bg-bg-surface px-5">
            <div className="flex items-center gap-4">
              <div className="h-4 w-8 animate-pulse rounded bg-border-secondary" />
              <div className="h-4 w-12 animate-pulse rounded bg-border-secondary" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 animate-pulse rounded bg-border-secondary" />
              <div className="h-3 w-12 animate-pulse rounded bg-border-secondary" />
            </div>
          </div>
          <div className="h-32 bg-bg-input animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default async function LeaderboardPage() {
  const [leaderboardData, stats] = await Promise.all([
    getLeaderboard(),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-bg-page">
      <Navbar />

      <main className="mx-auto max-w-4xl px-10 py-10">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-tertiary hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            back
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-bold text-accent-green">
                &gt;
              </span>
              <h1 className="font-mono text-3xl font-bold text-text-primary">
                shame_leaderboard
              </h1>
            </div>

            <p className="font-mono text-sm text-text-secondary">
              {"//"} the most roasted code on the internet
            </p>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-tertiary">
                {stats.totalCodes.toLocaleString()} submissions
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                avg score: {stats.avgScore}/10
              </span>
            </div>
          </div>

          <Suspense fallback={<LeaderboardSkeleton />}>
            <div className="mt-8 space-y-5">
              {leaderboardData.map((entry) => (
                <LeaderboardEntry
                  key={entry.rank}
                  entry={entry as ShameEntry}
                />
              ))}
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
