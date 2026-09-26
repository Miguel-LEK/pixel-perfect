/**
 * Mock sensor feed.
 *
 * This is the ONLY place that fabricates data. To wire in the real Arduino /
 * backend later, replace `subscribe` with a websocket or polling client that
 * emits the same `SensorReading` shape — no component changes required.
 */

export type SensorReading = {
  timestamp: number;
  connected: boolean;
  temperatureC: number;
  airQuality: number;
  heartRate: number;
  respiration: number;
  soundLevelDb: number;
  coughEvents: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const walk = (v: number, step: number, min: number, max: number) =>
  clamp(v + (Math.random() - 0.5) * step * 2, min, max);

export function initialReading(): SensorReading {
  return {
    timestamp: Date.now(),
    connected: true,
    temperatureC: 36.8,
    airQuality: 42,
    heartRate: 74,
    respiration: 15,
    soundLevelDb: 48,
    coughEvents: 0,
  };
}

export function nextReading(prev: SensorReading): SensorReading {
  return {
    timestamp: Date.now(),
    connected: Math.random() > 0.02 ? true : false,
    temperatureC: Number(walk(prev.temperatureC, 0.12, 36.1, 38.6).toFixed(1)),
    airQuality: Math.round(walk(prev.airQuality, 6, 12, 170)),
    heartRate: Math.round(walk(prev.heartRate, 3, 52, 118)),
    respiration: Math.round(walk(prev.respiration, 1, 9, 26)),
    soundLevelDb: Math.round(walk(prev.soundLevelDb, 4, 32, 86)),
    coughEvents: prev.coughEvents + (Math.random() < 0.08 ? 1 : 0),
  };
}

/** Generate a short history series, oldest first. */
export function generateSeries(points = 20, seed = initialReading()): SensorReading[] {
  const out: SensorReading[] = [seed];
  for (let i = 1; i < points; i++) out.push(nextReading(out[i - 1]!));
  return out;
}

export const FEED_INTERVAL_MS = 2000;
