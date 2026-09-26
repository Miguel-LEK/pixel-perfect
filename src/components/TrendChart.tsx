/**
 * Lightweight SVG sparkline for session trends — no chart dependency needed.
 */
export function TrendChart({
  data,
  unit,
}: {
  data: { t: string; v: number }[];
  unit?: string;
}) {
  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 100;
  const h = 32;
  const pad = 3;

  const points = values.map((v, i) => {
    const x = values.length > 1 ? (i / (values.length - 1)) * w : w / 2;
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-24 w-full"
        role="img"
        aria-label={`Trend from ${min} to ${max}${unit ? ` ${unit}` : ""}`}
      >
        <path d={area} fill="var(--color-primary)" opacity="0.08" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{data[0]?.t}</span>
        <span>
          min {min} · max {max}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>{data[data.length - 1]?.t}</span>
      </div>
    </div>
  );
}
