import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CodeBlock } from "@/components/ui/code-block";

const MOCK_RESULT = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  score: "3.5",
  verdict: "needs_serious_help",
  feedback:
    "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lines: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`,
  improvements: [
    {
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
      type: "error",
    },
    {
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
      type: "error",
    },
    {
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
      type: "success",
    },
    {
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
      type: "success",
    },
  ],
  suggestedFix: `function calculateTotal(items) {
-   var total = 0;
-   for (var i = 0; i < items.length; i++) {
-     total = total + items[i].price;
-   }
-   if (total > 100) {
-     console.log("discount applied");
-     total = total * 0.9;
-   }
-   return total;
+   return items.reduce((sum, item) => sum + item.price, 0);
}`,
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: _id } = await params;

  return (
    <div className="min-h-screen bg-bg-page">
      <Navbar />

      <main className="mx-auto max-w-4xl px-10 py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-text-tertiary hover:text-text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          back
        </Link>

        <div className="space-y-10">
          <ScoreSection result={MOCK_RESULT} />

          <div className="h-px w-full bg-border-primary" />

          <CodeSection
            code={MOCK_RESULT.code}
            language={MOCK_RESULT.language}
          />

          <div className="h-px w-full bg-border-primary" />

          <AnalysisSection improvements={MOCK_RESULT.improvements} />

          <div className="h-px w-full bg-border-primary" />

          <DiffSection suggestedFix={MOCK_RESULT.suggestedFix} />
        </div>
      </main>
    </div>
  );
}

function ScoreSection({ result }: { result: typeof MOCK_RESULT }) {
  const scoreNumber = parseFloat(result.score);

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes("serious_help") || scoreNumber < 4) {
      return "text-accent-red";
    }
    if (scoreNumber < 7) {
      return "text-accent-amber";
    }
    return "text-accent-green";
  };

  const getBadgeColor = (verdict: string) => {
    if (verdict.includes("serious_help") || scoreNumber < 4) {
      return "bg-accent-red";
    }
    if (scoreNumber < 7) {
      return "bg-accent-amber";
    }
    return "bg-accent-green";
  };

  return (
    <div className="flex items-center gap-12">
      <ScoreRing score={result.score} />
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${getBadgeColor(result.verdict)}`}
          />
          <span
            className={`font-mono text-sm font-medium ${getVerdictColor(result.verdict)}`}
          >
            verdict: {result.verdict}
          </span>
        </div>
        <p className="font-mono text-xl leading-relaxed text-text-primary">
          &quot;{result.feedback}&quot;
        </p>
        <div className="flex items-center gap-4 text-text-tertiary">
          <span className="font-mono text-xs">lang: {result.language}</span>
          <span className="font-mono text-xs">·</span>
          <span className="font-mono text-xs">{result.lines} lines</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-border-primary px-4 py-2 font-mono text-xs text-text-primary hover:bg-bg-elevated"
        >
          $ share_roast
        </button>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: string }) {
  const scoreNumber = parseFloat(score);

  const getScoreColor = () => {
    if (scoreNumber < 4) return "text-accent-red";
    if (scoreNumber < 7) return "text-accent-amber";
    return "text-accent-green";
  };

  return (
    <div className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full border-4 border-border-primary">
      <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-accent-red via-accent-amber to-accent-green opacity-50" />
      <div className="flex flex-col items-center">
        <span className={`font-mono text-5xl font-bold ${getScoreColor()}`}>
          {score}
        </span>
        <span className="font-mono text-base text-text-tertiary">/10</span>
      </div>
    </div>
  );
}

function CodeSection({ code, language }: { code: string; language: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-accent-green">
          {"//"}
        </span>
        <h2 className="font-mono text-sm font-bold text-text-primary">
          your_submission
        </h2>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-input">
        <CodeBlock code={code} language={language} />
      </div>
    </div>
  );
}

function AnalysisSection({
  improvements,
}: {
  improvements: (typeof MOCK_RESULT)["improvements"];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-accent-green">
          {"//"}
        </span>
        <h2 className="font-mono text-sm font-bold text-text-primary">
          detailed_analysis
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {improvements.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-border-primary p-5"
          >
            <div className="flex items-center gap-2">
              {item.type === "error" ? (
                <span className="h-2 w-2 rounded-full bg-accent-red" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-accent-green" />
              )}
              <span className="font-mono text-sm font-medium text-text-primary">
                {item.title}
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed text-text-secondary">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffSection({ suggestedFix }: { suggestedFix: string }) {
  const lines = suggestedFix.split("\n");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-accent-green">
          {"//"}
        </span>
        <h2 className="font-mono text-sm font-bold text-text-primary">
          suggested_fix
        </h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-input">
        <div className="flex h-10 items-center border-b border-border-primary px-4 font-mono text-xs text-text-secondary">
          your_code.ts → improved_code.ts
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {lines.map((line, index) => {
            const isRemoval = line.startsWith("-");
            const isAddition = line.startsWith("+");

            let bgClass = "";
            let textClass = "text-text-primary";

            if (isRemoval) {
              bgClass = "bg-accent-red/10";
              textClass = "text-accent-red";
            } else if (isAddition) {
              bgClass = "bg-accent-green/10";
              textClass = "text-accent-green";
            }

            const displayLine = line.replace(/^[+-]\s?/, "");

            return (
              <div key={index} className={`flex font-mono text-xs ${bgClass}`}>
                <span className="w-6 shrink-0 text-right pr-2 text-text-tertiary">
                  {index + 1}
                </span>
                <span className={`${textClass} whitespace-pre-wrap`}>
                  {displayLine}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
