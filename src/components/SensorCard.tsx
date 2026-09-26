import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Status } from "@/lib/health-status";

export type SensorMetric = { value: string; unit?: string; label?: string };

export function SensorCard({
  title,
  source,
  icon: Icon,
  status,
  metrics,
  footnote,
}: {
  title: string;
  source: string;
  icon: LucideIcon;
  status: Status;
  metrics: SensorMetric[];
  footnote?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Icon className="size-4.5" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{source}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
        {metrics.map((m) => (
          <div key={m.label ?? m.value}>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {m.value}
              </span>
              {m.unit ? (
                <span className="text-sm text-muted-foreground">{m.unit}</span>
              ) : null}
            </div>
            {m.label ? (
              <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
            ) : null}
          </div>
        ))}
      </div>

      {footnote ? (
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {footnote}
        </p>
      ) : null}
    </div>
  );
}
