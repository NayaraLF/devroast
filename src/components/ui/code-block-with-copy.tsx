"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface CodeBlockWithCopyProps {
  code: string;
  language: string;
  html: string;
}

export function CodeBlockWithCopy({
  code,
  language,
  html,
}: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="relative overflow-hidden rounded-lg border border-border-primary bg-bg-page">
      <div className="flex items-center justify-between border-b border-border-primary px-4 py-2">
        <span className="font-mono text-xs text-text-tertiary">{language}</span>
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
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
