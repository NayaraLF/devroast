export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="h-14 border-b border-border-primary bg-bg-surface" />

      <main className="mx-auto max-w-4xl px-10 py-10">
        <div className="space-y-4">
          <div className="h-5 w-20 animate-pulse rounded bg-border-secondary" />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded bg-border-secondary" />
              <div className="h-8 w-48 animate-pulse rounded bg-border-secondary" />
            </div>

            <div className="h-4 w-64 animate-pulse rounded bg-border-secondary" />

            <div className="flex items-center gap-2">
              <div className="h-3 w-24 animate-pulse rounded bg-border-secondary" />
              <div className="h-3 w-4 animate-pulse rounded bg-border-secondary" />
              <div className="h-3 w-20 animate-pulse rounded bg-border-secondary" />
            </div>
          </div>

          <div className="mt-8 space-y-5">
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
        </div>
      </main>
    </div>
  );
}
