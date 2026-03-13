"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface CodeBlockCopyButtonProps {
  code: string;
}

export function CodeBlockCopyButton({ code }: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button size="sm" variant="ghost" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
