import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CodeBlock } from "@/components/ui/code-block";

const MOCK_LEADERBOARD = [
  {
    rank: 1,
    score: "9.8",
    language: "javascript",
    lines: 3,
    code: "async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}",
  },
  {
    rank: 2,
    score: "9.5",
    language: "typescript",
    lines: 3,
    code: "const validateEmail = (email: string): boolean => {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email);\n};",
  },
  {
    rank: 3,
    score: "9.2",
    language: "python",
    lines: 3,
    code: "def calculate_metrics(data):\n    total = sum(data)\n    return total / len(data)",
  },
  {
    rank: 4,
    score: "8.9",
    language: "rust",
    lines: 3,
    code: "fn process_data(items: Vec<i32>) -> i32 {\n    items.iter().sum()\n}",
  },
  {
    rank: 5,
    score: "8.7",
    language: "go",
    lines: 3,
    code: 'func handleRequest(w http.ResponseWriter, r *http.Request) {\n    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})\n}',
  },
];

export default async function LeaderboardPage() {
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
                2,847 submissions
              </span>
              <span className="font-mono text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                avg score: 4.2/10
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {MOCK_LEADERBOARD.map((entry) => (
              <LeaderboardEntry key={entry.rank} entry={entry} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function LeaderboardEntry({
  entry,
}: {
  entry: (typeof MOCK_LEADERBOARD)[number];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-primary">
      <div className="flex h-12 items-center justify-between border-b border-border-primary bg-bg-surface px-5">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-text-tertiary">
            #{entry.rank}
          </span>
          <span className="font-mono text-sm text-accent-green">
            {entry.score}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {entry.language}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {entry.lines} lines
          </span>
        </div>
      </div>

      <div className="bg-bg-input">
        <CodeBlock code={entry.code} language={entry.language} />
      </div>
    </div>
  );
}
