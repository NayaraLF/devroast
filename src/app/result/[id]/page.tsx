import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoastById } from "@/app/actions";
import { Navbar } from "@/components/navbar";
import { ShareButton } from "@/components/share-button";
import { CodeBlock } from "@/components/ui/code-block";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return {
    openGraph: {
      images: [`/result/${id}/image`],
    },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getRoastById(id);

  if (!result) {
    notFound();
  }

  const scoreNumber = parseFloat(result.score);

  const getVerdict = () => {
    if (scoreNumber >= 8) return "excellent_code";
    if (scoreNumber >= 6) return "decent_work";
    if (scoreNumber >= 4) return "needs_work";
    if (scoreNumber >= 2) return "needs_serious_help";
    return "code_disaster";
  };

  const getScoreColor = () => {
    if (scoreNumber < 4) return "text-accent-red";
    if (scoreNumber < 7) return "text-accent-amber";
    return "text-accent-green";
  };

  const getBadgeColor = () => {
    if (scoreNumber < 4) return "bg-accent-red";
    if (scoreNumber < 7) return "bg-accent-amber";
    return "bg-accent-green";
  };

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
          <div className="flex items-center gap-12">
            <div className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full border-4 border-border-primary">
              <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-accent-red via-accent-amber to-accent-green opacity-50" />
              <div className="flex flex-col items-center">
                <span
                  className={`font-mono text-5xl font-bold ${getScoreColor()}`}
                >
                  {result.score}
                </span>
                <span className="font-mono text-base text-text-tertiary">
                  /10
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${getBadgeColor()}`} />
                <span
                  className={`font-mono text-sm font-medium ${getScoreColor()}`}
                >
                  verdict: {getVerdict()}
                </span>
              </div>
              <p className="font-mono text-xl leading-relaxed text-text-primary">
                &quot;{result.feedback}&quot;
              </p>
              <div className="flex items-center gap-4 text-text-tertiary">
                <span className="font-mono text-xs">
                  lang: {result.language}
                </span>
                <span className="font-mono text-xs">·</span>
                <span className="font-mono text-xs">{result.lines} lines</span>
              </div>
              <ShareButton resultId={result.id} />
            </div>
          </div>

          <div className="h-px w-full bg-border-primary" />

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
              <CodeBlock code={result.code} language={result.language} />
            </div>
          </div>

          <div className="h-px w-full bg-border-primary" />

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
              {result.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-lg border border-border-primary p-5"
                >
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <span className="h-2 w-2 rounded-full bg-accent-red" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-accent-amber" />
                    )}
                    <span className="font-mono text-sm font-medium text-text-primary">
                      {index === 0 ? "critical" : "suggestion"}
                    </span>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-text-secondary">
                    {improvement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
