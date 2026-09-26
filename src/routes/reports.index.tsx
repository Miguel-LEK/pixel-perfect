import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { OverallBadge } from "@/components/StatusBadge";
import { addSession, useSessions } from "@/lib/scan-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Scan Reports — Viralense" },
      {
        name: "description",
        content:
          "History of Viralense screening sessions with subject, timestamp and overall status, plus a new scan flow.",
      },
      { property: "og:title", content: "Scan Reports — Viralense" },
      {
        property: "og:description",
        content: "Browse past screening sessions and start a new scan.",
      },
    ],
  }),
  component: ReportsIndex,
});

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ReportsIndex() {
  const sessions = useSessions();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [when, setWhen] = useState(() => toLocalInput(new Date()));
  const [error, setError] = useState("");

  function startScan(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Enter a subject name or ID.");
      return;
    }
    setError("");
    const session = addSession(subject.trim(), new Date(when).getTime() || Date.now());
    setSubject("");
    navigate({ to: "/reports/$scanId", params: { scanId: session.id } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Scan Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completed screening sessions recorded by the rig.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold text-foreground">Start New Scan</h2>
        <form
          onSubmit={startScan}
          className="mt-4 flex flex-wrap items-end gap-4"
        >
          <div className="min-w-64 flex-1 space-y-1.5">
            <Label htmlFor="subject">Subject name / ID</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. J. Marchand — EMP-4412"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="when">Timestamp</Label>
            <Input
              id="when"
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
            />
          </div>
          <Button type="submit">Run scan</Button>
        </form>
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Subject</th>
              <th className="px-5 py-3 font-medium">Timestamp</th>
              <th className="px-5 py-3 font-medium">Overall status</th>
              <th className="px-5 py-3 font-medium text-right">Report</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="px-5 py-3 font-medium text-foreground">{s.subject}</td>
                <td className="px-5 py-3 text-muted-foreground tabular-nums">
                  {new Date(s.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-3">
                  <OverallBadge status={s.overall} size="sm" />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    to="/reports/$scanId"
                    params={{ scanId: s.id }}
                    className="font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
