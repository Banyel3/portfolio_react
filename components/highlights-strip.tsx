import { HIGHLIGHTS } from "@/lib/constants";

export default function HighlightsStrip() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      aria-label="Portfolio highlights"
    >
      {HIGHLIGHTS.map((tile, i) => (
        <div
          key={tile.label}
          className="rounded-lg border border-border bg-card/50 p-4 animate-fade-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="text-2xl font-display font-semibold tabular-nums">
            {tile.value}
            {tile.unit && <span className="ml-0.5 text-base text-muted-foreground">{tile.unit}</span>}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {tile.label}
          </div>
        </div>
      ))}
    </div>
  );
}
