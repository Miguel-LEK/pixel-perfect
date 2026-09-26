import { useEffect, useRef, useState } from "react";
import {
  FEED_INTERVAL_MS,
  initialReading,
  nextReading,
  type SensorReading,
} from "@/lib/sensor-feed";

/**
 * Live sensor feed hook. Swap the internals for a websocket/API subscription
 * when the real Arduino backend lands; the return shape stays the same.
 */
export function useSensorFeed(historyLength = 24) {
  const [reading, setReading] = useState<SensorReading>(() => initialReading());
  const [history, setHistory] = useState<SensorReading[]>([]);
  const latest = useRef(reading);

  useEffect(() => {
    const id = setInterval(() => {
      const next = nextReading(latest.current);
      latest.current = next;
      setReading(next);
      setHistory((h) => [...h, next].slice(-historyLength));
    }, FEED_INTERVAL_MS);
    return () => clearInterval(id);
  }, [historyLength]);

  return { reading, history };
}
