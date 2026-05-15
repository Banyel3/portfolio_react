const DEMO_URL = "https://demo.vancornelio.dev";

type Status = "up" | "down" | "unknown";

async function probeDemo(): Promise<Status> {
  try {
    const res = await fetch(DEMO_URL, {
      method: "HEAD",
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok ? "up" : "down";
  } catch {
    return "unknown";
  }
}

export default async function InfraStatusCard() {
  const status = await probeDemo();
  const dotColor =
    status === "up" ? "bg-green-500" : status === "down" ? "bg-red-500" : "bg-zinc-400";
  const label =
    status === "up" ? "up" : status === "down" ? "down" : "no signal";

  return (
    <a
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
      aria-label={`Self-hosted infrastructure demo status: ${label}`}
    >
      <span className={`inline-block h-2 w-2 rounded-full ${dotColor} animate-pulse-dot`} />
      <span className="font-medium text-foreground">demo.vancornelio.dev</span>
      <span>—</span>
      <span>{label}</span>
    </a>
  );
}
