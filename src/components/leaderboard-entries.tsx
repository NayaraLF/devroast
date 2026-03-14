"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type ShameEntry = {
  rank: number;
  score: string;
  language: string;
  code: string;
  html: string;
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
        <CodeBlockDisplay html={entry.html} code={entry.code} />
      </div>
    </div>
  );
}

function CodeBlockDisplay({ html, code }: { html: string; code: string }) {
  const lines = code.split("\n");

  return (
    <div className="relative overflow-hidden">
      <div className="flex">
        <div className="flex flex-col border-r border-border-primary bg-bg-elevated px-3 py-4 text-right font-mono text-xs text-text-tertiary">
          {lines.map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <div
          className="overflow-x-auto px-4 py-4 font-mono text-xs"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
