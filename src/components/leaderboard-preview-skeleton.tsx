export function LeaderboardPreviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-border-secondary" />
        <div className="h-4 w-20 animate-pulse rounded bg-border-secondary" />
      </div>

      <div className="overflow-hidden rounded-lg border border-border-primary">
        <div className="flex bg-bg-surface px-5 py-2.5">
          <div className="w-12">
            <div className="h-3 w-6 animate-pulse rounded bg-border-secondary" />
          </div>
          <div className="w-16">
            <div className="h-3 w-10 animate-pulse rounded bg-border-secondary" />
          </div>
          <div className="flex-1">
            <div className="h-3 w-16 animate-pulse rounded bg-border-secondary" />
          </div>
        </div>

        <div className="divide-y divide-border-primary">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex px-5 py-3">
              <div className="w-12">
                <div className="h-3 w-4 animate-pulse rounded bg-border-secondary" />
              </div>
              <div className="w-16">
                <div className="h-3 w-8 animate-pulse rounded bg-border-secondary" />
              </div>
              <div className="flex-1">
                <div className="h-3 w-20 animate-pulse rounded bg-border-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
