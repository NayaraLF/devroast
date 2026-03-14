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

const MAX_CODE_LENGTH = 2000;

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
  code: string;
  language: string;
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
      className={twMerge(
        "relative flex min-h-[360px] w-full max-h-[500px] overflow-y-auto bg-bg-input",
        className,
      )}
      style={{ zIndex: 0 }}
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
      style={{ zIndex: 0 }}
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
        "flex-1 w-full min-h-[300px] resize-none bg-transparent p-4 font-mono text-sm text-text-primary outline-none focus:outline-none",
        className,
      )}
      style={{ zIndex: 1, position: "relative" }}
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
  const lines = result.code.split("\n");
  const lineCount = lines.length;

  const getScoreColor = () => {
    if (scoreNumber >= 7) return "text-accent-green";
    if (scoreNumber >= 4) return "text-accent-amber";
    return "text-accent-red";
  };

  const getVerdict = () => {
    if (scoreNumber >= 8) return "excellent_code";
    if (scoreNumber >= 6) return "decent_work";
    if (scoreNumber >= 4) return "needs_work";
    if (scoreNumber >= 2) return "needs_serious_help";
    return "code_disaster";
  };

  const getVerdictColor = () => {
    if (scoreNumber >= 7) return "text-accent-green";
    if (scoreNumber >= 4) return "text-accent-amber";
    return "text-accent-red";
  };

  return (
    <div
      className={twMerge(
        "animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border-primary bg-bg-page",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-primary px-6 py-4">
        <h3 className="font-mono text-lg font-bold text-text-primary">
          Roast Result
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

      <div className="p-6">
        <div className="mb-8 flex gap-12">
          <div className="flex flex-col items-center">
            <div
              className={twMerge(
                "relative flex h-[140px] w-[140px] items-center justify-center rounded-full border-4",
                scoreNumber >= 7 && "border-accent-green",
                scoreNumber >= 4 && scoreNumber < 7 && "border-accent-amber",
                scoreNumber < 4 && "border-accent-red",
              )}
              style={{
                background: `conic-gradient(${
                  scoreNumber >= 7
                    ? "#10b981"
                    : scoreNumber >= 4
                      ? "#f59e0b 0% 60%, #10b981 60%"
                      : "#ef4444 0% 40%, #f59e0b 40%"
                } ${scoreNumber * 10}%, transparent ${scoreNumber * 10}%)`,
              }}
            >
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-bg-page">
                <span
                  className={twMerge(
                    "font-mono text-4xl font-bold",
                    getScoreColor(),
                  )}
                >
                  {result.score}
                </span>
              </div>
            </div>
            <p className="mt-2 font-mono text-sm text-text-tertiary">/ 10</p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={twMerge("h-2 w-2 rounded-full", getVerdictColor())}
              />
              <span
                className={twMerge(
                  "font-mono text-sm font-medium",
                  getVerdictColor(),
                )}
              >
                verdict: {getVerdict()}
              </span>
            </div>

            <blockquote className="border-l-2 border-border-primary pl-4">
              <p className="font-mono text-lg text-text-primary italic">
                "{result.feedback}"
              </p>
            </blockquote>

            <div className="flex items-center gap-4 font-mono text-xs text-text-tertiary">
              <span>lang: {result.language}</span>
              <span>·</span>
              <span>{lineCount} lines</span>
            </div>
          </div>
        </div>

        <div className="mb-8 border-b border-border-primary" />

        <div className="mb-6">
          <h4 className="mb-4 flex items-center gap-2 font-mono text-sm font-bold text-text-primary">
            {"//"} your_submission
          </h4>

          <div className="overflow-hidden rounded-lg border border-border-primary bg-bg-input">
            <div className="flex">
              <div className="flex w-12 flex-col border-r border-border-primary bg-bg-surface px-3 py-4 text-right font-mono text-xs text-text-tertiary">
                {lines.map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <pre className="flex-1 overflow-x-auto p-4 font-mono text-xs text-text-primary">
                <code>{result.code}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="border-b border-border-primary" />

        <div className="mt-6">
          <h4 className="mb-4 flex items-center gap-2 font-mono text-sm font-bold text-text-primary">
            {"//"} detailed_analysis
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            {result.improvements.map((improvement, index) => (
              <div
                key={index}
                className="rounded-lg border border-border-primary bg-bg-surface p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={twMerge(
                      "h-2 w-2 rounded-full",
                      index === 0 ? "bg-accent-red" : "bg-accent-amber",
                    )}
                  />
                  <span
                    className={twMerge(
                      "font-mono text-xs font-medium",
                      index === 0 ? "text-accent-red" : "text-accent-amber",
                    )}
                  >
                    {index === 0 ? "critical" : "medium"}
                  </span>
                </div>
                <p className="font-mono text-sm text-text-primary">
                  {improvement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CodeInputSection() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [roastMode, setRoastMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);

  const codeLength = code.length;
  const isOverLimit = codeLength > MAX_CODE_LENGTH;
  const canSubmit = code.trim().length > 0 && !isOverLimit;

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
        code,
        language,
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
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CODE_LENGTH) {
                    setCode(e.target.value);
                  }
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData("text");
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const before = code.substring(0, start);
                  const after = code.substring(end);
                  const newValue = before + text + after;
                  if (newValue.length <= MAX_CODE_LENGTH) {
                    setCode(newValue);
                  }
                }}
                spellCheck={false}
                placeholder="Paste your code here..."
              />
              <div className="absolute bottom-2 right-2 font-mono text-xs text-text-tertiary">
                <span className={isOverLimit ? "text-accent-red" : ""}>
                  {codeLength}
                </span>
                /{MAX_CODE_LENGTH}
              </div>
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
              disabled={loading || !canSubmit}
            >
              {loading
                ? "Roasting..."
                : isOverLimit
                  ? "$ code_too_long"
                  : "$ roast_my_code"}
            </ActionsBarButton>
          </ActionsBarRoot>
        </>
      )}
    </div>
  );
}
