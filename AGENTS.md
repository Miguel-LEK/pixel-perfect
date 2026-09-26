<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Sensor data
- All simulated sensor readings come from `src/lib/sensor-feed.ts` (data) and `src/hooks/use-sensor-feed.ts` (live subscription); swap these two for the real Arduino/websocket feed without touching components.
- Scan session history lives in `src/lib/scan-store.ts` (in-memory store with `useSyncExternalStore`); replace with API calls when the backend exists.
- Status thresholds are centralized in `src/lib/health-status.ts` so dashboard and reports classify readings identically.
