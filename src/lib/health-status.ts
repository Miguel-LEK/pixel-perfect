export type Status = "normal" | "elevated" | "flagged";
export type OverallStatus = "normal" | "monitor" | "flagged";

export const statusLabel: Record<Status, string> = {
  normal: "Normal",
  elevated: "Elevated",
  flagged: "Flagged",
};

export const overallLabel: Record<OverallStatus, string> = {
  normal: "Normal",
  monitor: "Monitor",
  flagged: "Flagged",
};

/** Body temperature in °C */
export function temperatureStatus(c: number): Status {
  if (c >= 38) return "flagged";
  if (c >= 37.5) return "elevated";
  return "normal";
}

/** Air quality index-style value (ppm equivalent) */
export function airQualityStatus(aqi: number): Status {
  if (aqi >= 150) return "flagged";
  if (aqi >= 100) return "elevated";
  return "normal";
}

export function vitalsStatus(heartRate: number, respiration: number): Status {
  if (heartRate >= 110 || heartRate < 50 || respiration >= 24 || respiration < 10) return "flagged";
  if (heartRate >= 95 || respiration >= 20) return "elevated";
  return "normal";
}

export function audioStatus(coughEvents: number, level: number): Status {
  if (coughEvents >= 4) return "flagged";
  if (coughEvents >= 1 || level >= 75) return "elevated";
  return "normal";
}

export function aggregate(statuses: Status[]): OverallStatus {
  if (statuses.includes("flagged")) return "flagged";
  if (statuses.includes("elevated")) return "monitor";
  return "normal";
}

export function explain(
  statuses: { label: string; status: Status }[],
): string {
  const flagged = statuses.filter((s) => s.status === "flagged").map((s) => s.label);
  const elevated = statuses.filter((s) => s.status === "elevated").map((s) => s.label);
  if (flagged.length) return `Outside safe range: ${flagged.join(", ")}. Subject should be reviewed.`;
  if (elevated.length) return `Borderline readings on ${elevated.join(", ")}. Continue monitoring.`;
  return "All sensors within expected ranges for this subject.";
}
