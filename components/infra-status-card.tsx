import { INFRA } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

type Status = "up" | "down" | "unknown";
type Probe = { status: Status; ms: number | null; code: number | null };

async function probeOrigin(): Promise<Probe> {
  const t0 = Date.now();
  try {
    // GET, not HEAD: pondo (FastAPI) answers HEAD with 405.
    const res = await fetch(INFRA.probeUrl, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    return { status: res.ok ? "up" : "down", ms: Date.now() - t0, code: res.status };
  } catch {
    return { status: "unknown", ms: null, code: null };
  }
}

// A failed read leaves the rows as "—" rather than failing the whole page.
async function loadStats() {
  try {
    return await prisma.infraStats.findUnique({ where: { id: 1 } });
  } catch (err) {
    console.error("[infra] stats read failed:", err);
    return null;
  }
}

function ago(date: Date | null | undefined) {
  if (!date) return null;
  const min = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (min < 60) return `${min}m ago`;
  if (min < 1440) return `${Math.round(min / 60)}h ago`;
  return `${Math.round(min / 1440)}d ago`;
}

const TONE: Record<Status, { dot: string; text: string; label: string }> = {
  up: { dot: "bg-emerald-400", text: "text-emerald-400", label: "UP" },
  down: { dot: "bg-red-500", text: "text-red-400", label: "DOWN" },
  unknown: { dot: "bg-zinc-400", text: "text-muted-foreground", label: "NO SIGNAL" },
};

const fmt = (v: number | string | null, unit?: string) =>
  v === null ? (
    <span className="text-muted-foreground">—</span>
  ) : (
    <>
      {v}
      {unit && <small className="ml-1 font-mono text-[13px] font-medium text-muted-foreground">{unit}</small>}
    </>
  );

export default async function InfraStatusCard() {
  const [probe, stats] = await Promise.all([probeOrigin(), loadStats()]);
  const tone = TONE[probe.status];

  return (
    <aside
      aria-label={`Self-hosted infrastructure status: ${tone.label.toLowerCase()}`}
      className="overflow-hidden rounded-[14px] border border-border bg-gradient-to-b from-card to-card/80 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8),inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_8%,transparent)]"
    >
      <div className="flex h-11 items-center justify-between border-b border-border bg-background/40 px-4">
        <span className="flex items-center gap-2.5 font-mono text-[13px] font-medium">
          <i className={`h-2 w-2 rounded-full ${tone.dot} animate-pulse-dot`} />
          {INFRA.host}
        </span>
        <span className={`rounded-[5px] px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.08em] ${tone.text} bg-current/10`}>
          {probe.status === "up" ? "LIVE" : tone.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        <Row label="Status">
          <span className={tone.text}>{tone.label}</span>
          {probe.ms !== null && (
            <small className="ml-1 font-mono text-[13px] font-medium text-muted-foreground">
              {probe.code} · {probe.ms} ms
            </small>
          )}
        </Row>
        <Row label="Uptime · 30d">{fmt(stats?.uptime30d == null ? null : stats.uptime30d.toFixed(1), "%")}</Row>
        <Row label="Services hosted">{fmt(stats?.services ?? null)}</Row>
        <Row label="Last deploy">{fmt(ago(stats?.lastDeploy))}</Row>
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border bg-card px-4 py-3.5">
        {INFRA.stack.map((s) => (
          <span key={s} className="rounded-md border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-background/40 px-4 py-3 text-xs text-muted-foreground">
        <span>Probes {INFRA.probeHost} via tunnel · 60 s</span>
        <a
          href={INFRA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-medium text-accent hover:text-foreground"
        >
          Open the demo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-card px-4 py-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-display text-[26px] font-semibold leading-none tracking-[-0.02em]">{children}</div>
    </div>
  );
}
