import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  overallLabel,
  statusLabel,
  type OverallStatus,
  type Status,
} from "@/lib/health-status";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      tone: {
        normal: "border-success/25 bg-success-muted text-success",
        elevated: "border-warning/30 bg-warning-muted text-warning",
        flagged: "border-danger/25 bg-danger-muted text-danger",
        neutral: "border-border bg-muted text-muted-foreground",
      },
      size: {
        sm: "",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  },
);

type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

const overallTone: Record<OverallStatus, Tone> = {
  normal: "normal",
  monitor: "elevated",
  flagged: "flagged",
};

export function StatusBadge({
  status,
  size,
  className,
}: {
  status: Status;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <span className={cn(badgeVariants({ tone: status, size }), className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}

export function OverallBadge({
  status,
  size = "lg",
  className,
}: {
  status: OverallStatus;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <span className={cn(badgeVariants({ tone: overallTone[status], size }), className)}>
      <span className="size-2 rounded-full bg-current" />
      {overallLabel[status]}
    </span>
  );
}
