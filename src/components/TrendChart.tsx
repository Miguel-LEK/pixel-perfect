import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export function TrendChart({
  data,
  domain,
  unit,
}: {
  data: { t: string; v: number }[];
  domain?: [number, number];
  unit?: string;
}) {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
          <YAxis
            hide
            domain={domain ?? ["dataMin - 2", "dataMax + 2"]}
            allowDecimals
          />
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              fontSize: 12,
              color: "var(--color-foreground)",
              boxShadow: "var(--shadow-card)",
            }}
            labelFormatter={(l) => `Time ${l}`}
            formatter={(v: number) => [`${v}${unit ? ` ${unit}` : ""}`, "Reading"]}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
