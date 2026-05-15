import BootPanel from "@/components/boot-panel";

const FALLBACK_LINES = [
  "POST  cold boot",
  "OK    kernel 6.10 ready",
  "OK    mount /var/portfolio",
  "OK    cloudflare tunnel ready",
  "OK    fetching content…",
];

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading site"
      className="fixed inset-0 z-[150] grid place-items-center bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] text-foreground"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, currentColor 3px, transparent 4px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
      />
      <BootPanel
        lines={FALLBACK_LINES}
        progress={45}
        showCursor
        status="fetching content from db…"
      />
    </div>
  );
}
