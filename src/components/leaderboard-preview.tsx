import Link from "next/link";
import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { getLeaderboard } from "@/app/actions";

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

export function LeaderboardPreviewTable({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-lg border border-border-primary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeaderboardPreviewTableHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("flex bg-bg-surface px-5 py-2.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeaderboardPreviewTableHeaderCell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-xs text-text-tertiary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function LeaderboardPreviewTableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("divide-y divide-border-primary", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeaderboardPreviewTableRow({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("flex px-5 py-3 font-mono text-xs", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function LeaderboardPreviewTableCell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={twMerge(className)} {...props}>
      {children}
    </span>
  );
}

export async function LeaderboardPreview() {
  const leaderboardData = await getLeaderboard();

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

      <LeaderboardPreviewTable>
        <LeaderboardPreviewTableHeader>
          <LeaderboardPreviewTableHeaderCell className="w-12">
            rank
          </LeaderboardPreviewTableHeaderCell>
          <LeaderboardPreviewTableHeaderCell className="w-16">
            score
          </LeaderboardPreviewTableHeaderCell>
          <LeaderboardPreviewTableHeaderCell className="w-20">
            subs
          </LeaderboardPreviewTableHeaderCell>
          <LeaderboardPreviewTableHeaderCell className="w-20">
            best
          </LeaderboardPreviewTableHeaderCell>
        </LeaderboardPreviewTableHeader>

        <LeaderboardPreviewTableBody>
          {leaderboardData.map((row) => (
            <LeaderboardPreviewTableRow key={row.rank}>
              <LeaderboardPreviewTableCell className="w-12 text-text-secondary">
                #{row.rank}
              </LeaderboardPreviewTableCell>
              <LeaderboardPreviewTableCell className="w-16 text-accent-green">
                {Number(row.score).toFixed(1)}
              </LeaderboardPreviewTableCell>
              <LeaderboardPreviewTableCell className="w-20 text-text-tertiary">
                {row.totalSubmissions}
              </LeaderboardPreviewTableCell>
              <LeaderboardPreviewTableCell className="w-20 text-accent-amber">
                {Number(row.bestScore).toFixed(1)}
              </LeaderboardPreviewTableCell>
            </LeaderboardPreviewTableRow>
          ))}
        </LeaderboardPreviewTableBody>
      </LeaderboardPreviewTable>
    </LeaderboardPreviewRoot>
  );
}

LeaderboardPreview.displayName = "LeaderboardPreview";
