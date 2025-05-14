import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3 border-[1.5px]",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  );
}
