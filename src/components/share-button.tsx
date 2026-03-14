"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  resultId: string;
}

export function ShareButton({ resultId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/result/${resultId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-md border border-border-primary px-4 py-2 font-mono text-xs text-text-primary hover:bg-bg-elevated"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-accent-green" />
          <span className="text-accent-green">copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>$ share_roast</span>
        </>
      )}
    </button>
  );
}
