import { codeToHtml } from "shiki";
import { CodeBlockCopyButton } from "./code-block-copy-button";

export interface CodeBlockProps {
  code: string;
  language: string;
  html?: string;
  showCopyButton?: boolean;
}

export async function CodeBlock({
  code,
  language,
  html: providedHtml,
  showCopyButton = false,
}: CodeBlockProps) {
  const html = providedHtml ?? (await getCodeHtml(code, language));
  const lines = code.split("\n");

  return (
    <div className="relative overflow-hidden rounded-lg border border-border-primary bg-bg-page">
      <div className="flex items-center justify-between border-b border-border-primary px-4 py-2">
        <span className="font-mono text-xs text-text-tertiary">{language}</span>
        {showCopyButton && <CodeBlockCopyButton code={code} />}
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

export async function getCodeHtml(code: string, language: string) {
  return codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });
}
