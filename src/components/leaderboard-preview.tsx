import Link from "next/link";
import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { getShameLeaderboard } from "@/app/actions";
import { LeaderboardEntry } from "./leaderboard-entries";

export function LeaderboardPreviewRoot({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function LeaderboardPreviewHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeaderboardPreviewTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={twMerge(
        "font-mono text-sm font-bold text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function LeaderboardPreviewLink({
  className,
  href,
  children,
  ...props
}: HTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={twMerge(
        "rounded border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary hover:bg-bg-elevated",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export async function LeaderboardPreview() {
  const shameData = await getShameLeaderboard();

  return (
    <LeaderboardPreviewRoot>
      <LeaderboardPreviewHeader>
        <LeaderboardPreviewTitle>
          {"//"} shame_leaderboard
        </LeaderboardPreviewTitle>
        <LeaderboardPreviewLink href="/leaderboard">
          view_all &gt;&gt;
        </LeaderboardPreviewLink>
      </LeaderboardPreviewHeader>

      <div className="space-y-4">
        {shameData.map((row) => (
          <LeaderboardEntry key={row.rank} entry={row} />
        ))}
      </div>
    </LeaderboardPreviewRoot>
  );
}
