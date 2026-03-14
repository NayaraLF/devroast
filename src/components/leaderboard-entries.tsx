"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { CodeBlock } from "@/components/ui/code-block";

export type ShameEntry = {
  rank: number;
  score: string;
  language: string;
  code: string;
};

export function LeaderboardEntry({ entry }: { entry: ShameEntry }) {
  const [isOpen, setIsOpen] = useState(false);
  const lines = entry.code.split("\n");
  const isLong = lines.length > 5;

  return (
    <div className="overflow-hidden rounded-lg border border-border-primary">
      <div className="flex items-center justify-between border-b border-border-primary bg-bg-surface px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-text-tertiary">
            #{entry.rank}
          </span>
          <span className="font-mono text-sm text-accent-red">
            {Number(entry.score).toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {entry.language}
          </span>
          {isLong && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 font-mono text-xs text-text-tertiary hover:text-text-primary"
            >
              <span className="text-[10px] uppercase">
                {isOpen ? "Collapse" : "Expand"}
              </span>
              {isOpen ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={twMerge(
          "bg-bg-input",
          !isOpen && isLong && "max-h-[200px] overflow-hidden",
        )}
      >
        <CodeBlock code={entry.code} language={entry.language} />
      </div>
    </div>
  );
}
