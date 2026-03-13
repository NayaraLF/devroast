export function FooterStatsSkeleton() {
  return (
    <div className="flex justify-center gap-6 font-mono text-sm">
      <div className="h-4 w-24 animate-pulse rounded bg-border-secondary" />
      <div className="h-4 w-2 animate-pulse rounded bg-border-secondary" />
      <div className="h-4 w-20 animate-pulse rounded bg-border-secondary" />
    </div>
  );
}
