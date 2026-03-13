import { ActionsBar } from "@/components/actions-bar";
import { CodeInput } from "@/components/code-input";
import { FooterStats } from "@/components/footer-stats";
import { LeaderboardPreview } from "@/components/leaderboard-preview";

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

      <CodeInput />

      <ActionsBar />

      <FooterStats />

      <LeaderboardPreview />
    </div>
  );
}
