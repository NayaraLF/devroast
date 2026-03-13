import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { FooterStatsContent } from "./footer-stats-content";

export async function FooterStats() {
  prefetch(trpc.stats.queryOptions());

  return (
    <HydrateClient>
      <FooterStatsContent />
    </HydrateClient>
  );
}
