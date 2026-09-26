import { Link, createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowLeft, AudioLines, Thermometer, Wind } from "lucide-react";
import { OverallBadge, StatusBadge } from "@/components/StatusBadge";
import { TrendChart } from "@/components/TrendChart";
import { getSession, summarize } from "@/lib/scan-store";
import type { SensorReading } from "@/lib/sensor-feed";

export const Route = createFileRoute("/reports/$scanId")({
  head: () => ({
    meta: [
      { title: "Scan Report — Viralense" },
      {
        name: "description",
        content:
          "Full sensor breakdown for a single Viralense screening session with trends and reviewer notes.",
      },
      { property: "og:title", content: "Scan Report — Viralense" },
      {
        property: "og:description",
        content: "Sensor-by-sensor breakdown for one screening session.",
      },
    ],
  }),
  component: ScanReport,
});

function series(readings: SensorReading[], pick: (r: SensorReading) => number) {
  return readings.map((r) => ({
    t: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    v: pick(r),
  }));
}

function ScanReport() {
  const { scanId } = Route.useParams();
  const session = getSession(scanId);

  if (!session) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <h1 className="text-lg font-semibold text-foreground">Report not available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This session isn't in the current record set.
        </p>
        <Link to="/reports" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to scan reports
        </Link>
      </div>
    );
  }

  const { parts, overall, summary } = summarize(session.series);
  const last = session.series[session.series.length - 1]!;

  const panels = [
    {
      title: "Body Temperature",
      source: "Infrared temperature scanner",
      icon: Thermometer,
      status: parts[0]!.status,
      value: `${last.temperatureC.toFixed(1)} °C`,
      data: series(session.series, (r) => r.temperatureC),
      unit: "°C",
    },
    {
      title: "Air Quality",
      source: "Arduino air purity sensor",
      icon: Wind,
      status: parts[1]!.status,
      value: `${last.airQuality} AQI`,
      data: series(session.series, (r) => r.airQuality),
      unit: "AQI",
    },
    {
      title: "Vitals",
      source: "Webcam · Presage SDK",
      icon: Activity,
      status: parts[2]!.status,
      value: `${last.heartRate} bpm · ${last.respiration} br/min`,
      data: series(session.series, (r) => r.heartRate),
      unit: "bpm",
    },
    {
      title: "Audio Monitor",
      source: "Microphone array",
      icon: AudioLines,
      status: parts[3]!.status,
      value: `${last.soundLevelDb} dB · ${last.coughEvents} events`,
      data: series(session.series, (r) => r.soundLevelDb),
      unit: "dB",
    },
  ];

  const notes = parts.filter((p) => p.status !== "normal");

  return (
    <div className="space-y-6">
      <Link
        to="/reports"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Scan Reports
      </Link>

      <section className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-panel)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {session.subject}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Session {session.id} · {new Date(session.timestamp).toLocaleString()}
            </p>
            <p className="mt-3 max-w-2xl text-sm text-foreground">{summary}</p>
          </div>
          <OverallBadge status={overall} />
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((p) => (
          <div
            key={p.title}
            className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <p.icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{p.title}</h2>
                  <p className="text-xs text-muted-foreground">{p.source}</p>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {p.value}
            </p>
            <div className="mt-2">
              <TrendChart data={p.data} unit={p.unit} />
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-foreground">Notes</h2>
        {notes.length ? (
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {notes.map((n) => (
              <li key={n.label} className="flex items-start gap-3">
                <StatusBadge status={n.status} />
                <span className="pt-0.5">
                  {n.label} fell outside the expected range during this session and should be
                  reviewed by the on-site health officer.
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No flagged readings. No follow-up required for this session.
          </p>
        )}
      </section>
    </div>
  );
}
