"use client";

import { type HTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";

export function ActionsBarRoot({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "flex w-[780px] items-center justify-between",
        className,
      )}
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
}: HTMLAttributes<HTMLDivElement>) {
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
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
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
      className={twMerge(
        "relative flex h-[22px] w-10 items-center rounded-full bg-accent-green px-0.5",
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

ActionsBarToggle.displayName = "ActionsBarToggle";

export function ActionsBarLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-sm text-accent-green", className)}
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
}: HTMLAttributes<HTMLSpanElement>) {
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
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={twMerge(
        "flex items-center gap-2 rounded-md bg-accent-green px-6 py-2.5 font-mono text-sm font-medium text-bg-page",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ActionsBar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <ActionsBarRoot className={className} {...props}>
      <ActionsBarLeft>
        <ActionsBarToggle />
        <ActionsBarLabel>roast mode</ActionsBarLabel>
        <ActionsBarHint>{"//"} maximum sarcasm enabled</ActionsBarHint>
      </ActionsBarLeft>
      <ActionsBarButton>$ roast_my_code</ActionsBarButton>
    </ActionsBarRoot>
  );
}

ActionsBar.displayName = "ActionsBar";
