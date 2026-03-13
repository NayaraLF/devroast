"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { submitCode } from "@/app/actions";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "ruby",
  "php",
  "csharp",
  "html",
  "css",
  "sql",
];

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

interface RoastResult {
  score: string;
  feedback: string;
  improvements: string[];
}

export function LanguageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="relative flex items-center gap-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent font-mono text-xs text-text-tertiary outline-none cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3 w-3 text-text-tertiary" />
    </div>
  );
}

export function CodeInputRoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center justify-between border-b border-border-primary bg-bg-surface px-4",
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
}: React.HTMLAttributes<HTMLDivElement>) {
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
}: React.HTMLAttributes<HTMLDivElement>) {
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
}: React.HTMLAttributes<HTMLDivElement> & { lineCount: number }) {
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

export function CodeInputTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={twMerge(
        "flex-1 resize-none bg-transparent p-4 font-mono text-sm text-text-primary outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function ActionsBarRoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ActionsBarLeft({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ActionsBarToggle({
  className,
  pressed,
  onPressedChange,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}) {
  const [internalPressed, setInternalPressed] = useState(true);
  const isControlled = pressed !== undefined;
  const isActive = isControlled ? pressed : internalPressed;

  const handleToggle = () => {
    const newValue = !isActive;
    if (!isControlled) {
      setInternalPressed(newValue);
    }
    onPressedChange?.(newValue);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={twMerge(
        "relative flex h-[22px] w-10 items-center rounded-full bg-accent-green px-0.5 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        isActive && "bg-accent-green",
        !isActive && "bg-accent-red",
        className,
      )}
      {...props}
    >
      <span
        className={`h-4 w-4 rounded-full bg-bg-page transition-transform duration-200 ${
          isActive ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ActionsBarLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-sm text-text-primary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function ActionsBarHint({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-xs text-text-tertiary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function ActionsBarButton({
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={twMerge(
        "flex items-center gap-2 rounded-md bg-accent-green px-6 py-2.5 font-mono text-sm font-medium text-bg-page transition-opacity hover:opacity-90",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function RoastResultCard({
  className,
  result,
  onClose,
}: React.HTMLAttributes<HTMLDivElement> & {
  result: RoastResult;
  onClose: () => void;
}) {
  const scoreNumber = parseFloat(result.score);

  return (
    <div
      className={twMerge(
        "animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border-primary bg-bg-surface p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-lg font-bold text-text-primary">
          Your Code Score
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary"
          aria-label="Close result"
        >
          ✕
        </button>
      </div>

      <div className="mb-6 text-center">
        <div
          className={twMerge(
            "inline-block rounded-lg px-6 py-4 font-mono text-5xl font-bold",
            scoreNumber >= 7 && "text-accent-green",
            scoreNumber >= 4 && scoreNumber < 7 && "text-accent-amber",
            scoreNumber < 4 && "text-accent-red",
          )}
        >
          {result.score}
        </div>
        <p className="mt-2 font-mono text-sm text-text-tertiary">/ 10</p>
      </div>

      <div className="mb-4">
        <p className="font-mono text-sm text-text-secondary">
          {result.feedback}
        </p>
      </div>

      {result.improvements.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-xs font-bold text-text-tertiary uppercase">
            Suggestions
          </p>
          <ul className="space-y-1">
            {result.improvements.map((improvement, index) => (
              <li
                key={index}
                className="flex items-start gap-2 font-mono text-xs text-text-secondary"
              >
                <span className="text-accent-green">→</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CodeInputSection() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [roastMode, setRoastMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);

  const lines = code.split("\n");

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await submitCode({
        code,
        language,
        roastMode,
      });
      setResult({
        score: response.score,
        feedback: response.feedback,
        improvements: response.improvements,
      });
    } catch (error) {
      console.error("Failed to submit code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCode = () => {
    setResult(null);
    setCode("");
  };

  return (
    <div className="space-y-4">
      {result && <RoastResultCard result={result} onClose={handleNewCode} />}

      {!result && (
        <>
          <CodeInputRoot>
            <CodeInputHeader>
              <CodeInputDots />
              <LanguageSelector value={language} onChange={setLanguage} />
            </CodeInputHeader>
            <CodeInputBody>
              <CodeInputLineNumbers lineCount={Math.max(lines.length, 10)} />
              <CodeInputTextarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="Paste your code here..."
              />
            </CodeInputBody>
          </CodeInputRoot>

          <ActionsBarRoot>
            <ActionsBarLeft>
              <ActionsBarToggle
                pressed={roastMode}
                onPressedChange={setRoastMode}
                disabled={loading}
              />
              <ActionsBarLabel>
                {roastMode ? "🔥 Roast Mode" : "💡 Constructive Mode"}
              </ActionsBarLabel>
              <ActionsBarHint>
                {roastMode
                  ? "// maximum sarcasm enabled"
                  : "// friendly feedback"}
              </ActionsBarHint>
            </ActionsBarLeft>
            <ActionsBarButton
              onClick={handleSubmit}
              disabled={loading || !code.trim()}
            >
              {loading ? "Roasting..." : "$ roast_my_code"}
            </ActionsBarButton>
          </ActionsBarRoot>
        </>
      )}
    </div>
  );
}
