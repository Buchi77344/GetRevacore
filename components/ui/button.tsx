import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50",
        variant === "primary"
          ? "bg-zinc-900 text-white hover:bg-zinc-700"
          : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        className,
      )}
      {...props}
    />
  );
}
