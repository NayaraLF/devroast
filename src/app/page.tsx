import { Suspense } from "react";
import { CodeInputSection } from "@/components/code-input";
import { FooterStats } from "@/components/footer-stats";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardPreviewSkeleton } from "@/components/leaderboard-preview-skeleton";

function FooterStatsSkeleton() {
  return (
    <div className="flex justify-center gap-6 font-mono text-sm">
      <div className="h-4 w-24 animate-pulse rounded bg-border-secondary" />
      <div className="h-4 w-2 animate-pulse rounded bg-border-secondary" />
      <div className="h-4 w-20 animate-pulse rounded bg-border-secondary" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[960px] space-y-8 px-10 py-20">
      <div className="space-y-3">
        <h1 className="font-mono text-3xl font-bold text-text-primary">
          Code Input
        </h1>
        <p className="font-mono text-sm text-text-secondary">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </div>

      <CodeInputSection />

      <Suspense fallback={<FooterStatsSkeleton />}>
        <FooterStats />
      </Suspense>

      <Suspense fallback={<LeaderboardPreviewSkeleton />}>
        <LeaderboardPreview />
      </Suspense>
    </div>
  );
}
