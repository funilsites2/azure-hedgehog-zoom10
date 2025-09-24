import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-neutral-700",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-green-500 transition-all duration-300"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };