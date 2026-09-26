import { useSyncExternalStore } from "react";
import { generateSeries, initialReading, type SensorReading } from "./sensor-feed";
import {
  aggregate,
  airQualityStatus,
  audioStatus,
  explain,
  temperatureStatus,
  vitalsStatus,
  type OverallStatus,
} from "./health-status";

export type ScanSession = {
  id: string;
  subject: string;
  timestamp: number;
  overall: OverallStatus;
  summary: string;
  series: SensorReading[];
};

export function summarize(series: SensorReading[]) {
  const last = series[series.length - 1]!;
  const parts = [
    { label: "Body Temperature", status: temperatureStatus(last.temperatureC) },
    { label: "Air Quality", status: airQualityStatus(last.airQuality) },
    { label: "Vitals", status: vitalsStatus(last.heartRate, last.respiration) },
    { label: "Audio Monitor", status: audioStatus(last.coughEvents, last.soundLevelDb) },
  ];
  return {
    parts,
    overall: aggregate(parts.map((p) => p.status)),
    summary: explain(parts),
  };
}

function makeSession(subject: string, timestamp: number, seedBias = 0): ScanSession {
  const seed = initialReading();
  seed.temperatureC += seedBias * 0.6;
  seed.airQuality += seedBias * 35;
  seed.heartRate += seedBias * 14;
  seed.coughEvents += seedBias > 1 ? 3 : 0;
  const series = generateSeries(18, seed);
  const { overall, summary } = summarize(series);
  return {
    id: Math.random().toString(36).slice(2, 10),
    subject,
    timestamp,
    overall,
    summary,
    series,
  };
}

const HOUR = 3_600_000;
const base = Date.parse("2026-09-26T13:00:00Z");

let sessions: ScanSession[] = [
  makeSession("A. Nguyen — EMP-2041", base - 1 * HOUR, 0),
  makeSession("R. Okafor — EMP-1188", base - 3 * HOUR, 1),
  makeSession("M. Dubois — EMP-3307", base - 5 * HOUR, 0),
  makeSession("S. Patel — EMP-0925", base - 26 * HOUR, 2),
  makeSession("L. Tremblay — EMP-2760", base - 29 * HOUR, 0),
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function addSession(subject: string, timestamp: number): ScanSession {
  const session = makeSession(subject, timestamp);
  sessions = [session, ...sessions];
  emit();
  return session;
}

export function getSession(id: string) {
  return sessions.find((s) => s.id === id);
}

export function useSessions() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => sessions,
    () => sessions,
  );
}
