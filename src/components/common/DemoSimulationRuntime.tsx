"use client";

import { useEffect } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";

/** Runs once above both /app and /driver, independent of the map component.
 * The authoritative clock is persisted in each trip, so refresh resumes it.
 * No network communication, GPS telemetry, or background dispatch. */
export function DemoSimulationRuntime() {
  useEffect(() => {
    const sync = () => useTrobosStore.getState().tickDemoTimeline();
    const start = () => {
      sync();
      return window.setInterval(sync, 400);
    };
    let interval: number | undefined;
    if (useTrobosStore.persist.hasHydrated()) interval = start();
    const unsub = useTrobosStore.persist.onFinishHydration(() => {
      if (interval !== undefined) window.clearInterval(interval);
      interval = start();
    });
    return () => {
      unsub();
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);
  return null;
}
