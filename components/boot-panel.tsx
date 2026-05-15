type Props = {
  lines: string[];
  progress: number;
  showCursor?: boolean;
  status?: string;
};

const ASCII_CLOUD = `      .--.
   .-(    ).
  (___.__)__)`;

export default function BootPanel({ lines, progress, showCursor, status }: Props) {
  const blocks = 24;
  const filled = Math.max(0, Math.min(blocks, Math.round((progress / 100) * blocks)));
  const bar = "█".repeat(filled) + "░".repeat(blocks - filled);
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="relative flex flex-col items-center gap-4">
      <pre
        aria-hidden="true"
        className="m-0 font-mono text-[11px] leading-tight text-primary opacity-80 drop-shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_50%,transparent)]"
      >
        {ASCII_CLOUD}
      </pre>
      <div className="relative w-[min(92vw,640px)] rounded-lg border border-primary/30 bg-card/80 p-6 font-mono text-sm shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-primary/20 pb-2">
          <span className="flex items-center gap-2 text-primary text-xs">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            vancornelio.dev — boot sequence
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">tty1</span>
        </div>
        <pre className="m-0 whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground min-h-[12rem]">
          {lines.map((line, i) => {
            const space = line.indexOf(" ");
            const tag = space === -1 ? line : line.slice(0, space);
            const text = space === -1 ? "" : line.slice(space + 1).trim();
            const tone =
              tag === "OK"
                ? "text-primary"
                : tag === "READY"
                ? "text-foreground font-semibold"
                : "text-accent";
            return (
              <div key={i}>
                <span className={tone}>[{tag.padEnd(5, " ")}]</span> {text}
              </div>
            );
          })}
          {showCursor && (
            <div className="mt-1">
              <span className="text-primary">&gt;</span>{" "}
              <span className="animate-blink text-primary">_</span>
            </div>
          )}
        </pre>
        <div className="mt-5 space-y-1.5">
          <div className="font-mono text-xs text-primary tabular-nums">
            [{bar}] {pct.toString().padStart(3, " ")}%
          </div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {status ?? "warming up… don't unplug"}
          </div>
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        cold start &middot; v2026.5
      </p>
    </div>
  );
}
