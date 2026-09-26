import { createFileRoute } from "@tanstack/react-router";
import { Activity, Thermometer, Wind, AudioLines, Cpu, RefreshCw } from "lucide-react";
import { useSensorFeed } from "@/hooks/use-sensor-feed";
import { SensorCard } from "@/components/SensorCard";
import { OverallBadge } from "@/components/StatusBadge";
import {
  aggregate,
  airQualityStatus,
  audioStatus,
  explain,
  temperatureStatus,
  vitalsStatus,
} from "@/lib/health-status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live Dashboard — Viralense" },
      {
        name: "description",
        content:
          "Real-time screening readings from the Viralense rig: body temperature, air quality, webcam vitals and audio monitoring.",
      },
      { property: "og:title", content: "Live Dashboard — Viralense" },
      {
        property: "og:description",
        content: "Real-time screening readings for the person currently at the rig.",
      },
    ],
  }),
  component: LiveDashboard,
});

function LiveDashboard() {
  const { reading } = useSensorFeed();

  const tempStatus = temperatureStatus(reading.temperatureC);
  const airStatus = airQualityStatus(reading.airQuality);
  const vitals = vitalsStatus(reading.heartRate, reading.respiration);
  const audio = audioStatus(reading.coughEvents, reading.soundLevelDb);

  const parts = [
    { label: "Body Temperature", status: tempStatus },
    { label: "Air Quality", status: airStatus },
    { label: "Vitals", status: vitals },
    { label: "Audio Monitor", status: audio },
  ];
  const overall = aggregate(parts.map((p) => p.status));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Live Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Screening one subject at a time from the connected scanning rig.
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-panel)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Overall Status
            </p>
            <p className="mt-2 max-w-2xl text-base text-foreground">{explain(parts)}</p>
          </div>
          <OverallBadge status={overall} />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-3 text-sm shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-foreground">
            Arduino {reading.connected ? "Connected" : "Disconnected"}
          </span>
          <span
            className={
              reading.connected
                ? "size-2 rounded-full bg-success"
                : "size-2 rounded-full bg-danger"
            }
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="size-3.5" strokeWidth={1.75} />
          Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SensorCard
          title="Body Temperature"
          source="Infrared temperature scanner"
          icon={Thermometer}
          status={tempStatus}
          metrics={[{ value: reading.temperatureC.toFixed(1), unit: "°C", label: "Surface-corrected" }]}
          footnote="Elevated above 37.5 °C · Flagged above 38.0 °C"
        />
        <SensorCard
          title="Air Quality"
          source="Arduino air purity sensor"
          icon={Wind}
          status={airStatus}
          metrics={[{ value: String(reading.airQuality), unit: "AQI", label: "Booth air index" }]}
          footnote="Elevated above 100 · Flagged above 150"
        />
        <SensorCard
          title="Vitals"
          source="Webcam · Presage SDK"
          icon={Activity}
          status={vitals}
          metrics={[
            { value: String(reading.heartRate), unit: "bpm", label: "Heart rate" },
            { value: String(reading.respiration), unit: "br/min", label: "Respiration" },
          ]}
          footnote="Normal ranges 50–95 bpm · 10–20 breaths/min"
        />
        <SensorCard
          title="Audio Monitor"
          source="Microphone array"
          icon={AudioLines}
          status={audio}
          metrics={[
            { value: String(reading.soundLevelDb), unit: "dB", label: "Sound level" },
            { value: String(reading.coughEvents), label: "Cough / abnormal events" },
          ]}
          footnote="Flagged at 4 or more detected events in a session"
        />
      </div>
    </div>
  );
}
