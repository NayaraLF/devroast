"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

const DEFAULT_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  return total;
}`;

export function CodeInputRoot({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-lg border border-border-primary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeInputHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center border-b border-border-primary bg-bg-surface px-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeInputDots({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("flex gap-2", className)} {...props}>
      <span className="h-3 w-3 rounded-full bg-accent-red" />
      <span className="h-3 w-3 rounded-full bg-accent-amber" />
      <span className="h-3 w-3 rounded-full bg-accent-green" />
    </div>
  );
}

export function CodeInputBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("flex min-h-[360px] bg-bg-input", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeInputLineNumbers({
  className,
  lineCount,
  ...props
}: HTMLAttributes<HTMLDivElement> & { lineCount: number }) {
  return (
    <div
      className={twMerge(
        "flex w-12 flex-col border-r border-border-primary bg-bg-surface px-3 py-4 text-right font-mono text-xs text-text-tertiary",
        className,
      )}
      {...props}
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  );
}

export const CodeInputTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={twMerge(
        "flex-1 resize-none bg-transparent p-4 font-mono text-sm text-text-primary outline-none",
        className,
      )}
      {...props}
    />
  );
});

CodeInputTextarea.displayName = "CodeInputTextarea";

export function CodeInput({
  defaultValue = DEFAULT_CODE,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { defaultValue?: string }) {
  const [code, setCode] = useState(defaultValue);
  const lines = code.split("\n");

  return (
    <CodeInputRoot className={className} {...props}>
      <CodeInputHeader>
        <CodeInputDots />
      </CodeInputHeader>
      <CodeInputBody>
        <CodeInputLineNumbers lineCount={lines.length} />
        <CodeInputTextarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </CodeInputBody>
    </CodeInputRoot>
  );
}

CodeInput.displayName = "CodeInput";
