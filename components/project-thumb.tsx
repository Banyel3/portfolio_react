// Server-safe (no hooks). One layout for every project surface:
// browser-chrome strip + glyph / category / tech overlay. The screenshot (when
// one exists) sits behind it blurred and dimmed; on parent `.group` hover or
// focus the overlay fades out and the sharp screenshot fades in.
//
// Performance: nothing animates a filter. The blurred copy is static (the
// browser rasterizes it once) and the sharp copy fades in with opacity, which
// runs on the compositor. No backdrop-filter, no drop-shadow filter.

type Props = {
  title: string;
  src?: string | null;
  label?: string | null;
  category?: string | null;
  tech?: string[];
  className?: string;
};

function hueFor(title: string) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 225 + (h % 40); // stays inside the site's blue-cyan band
}

// Two-letter mark from the first two "parts" of the title: words or camelCase
// segments first (Drift|Code → Dc, Med|Buddy → Mb), else a syllable split on a
// single word (Pon|do → Pd, Se|mi|nar → Sm). Exported for the self-check below.
export function glyphFor(title: string) {
  const parts = title
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → separate words
    .split(/[\s\-_./]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  let a = parts[0][0];
  let b = "";
  if (parts.length > 1) {
    b = parts[1][0];
  } else {
    // Syllable heuristic: second syllable starts at the last consonant of the
    // cluster that follows the first vowel group (maximal-onset simplification).
    const w = parts[0].toLowerCase();
    const isVowel = (c: string) => "aeiouy".includes(c);
    let i = 0;
    while (i < w.length && !isVowel(w[i])) i++; // onset
    while (i < w.length && isVowel(w[i])) i++; // first vowel group
    const clusterStart = i;
    while (i < w.length && !isVowel(w[i])) i++; // consonant cluster
    if (i < w.length && i > clusterStart) b = w[i - 1]; // last consonant before next vowel
    else b = w[1] ?? "";
  }
  return `${a.toUpperCase()}${b.toLowerCase()}`;
}

// ponytail: one runnable check for the heuristic; run with `node -e` via tsx if it ever regresses.
if (process.env.NODE_ENV === "test") {
  const cases: [string, string][] = [["Pondo", "Pd"], ["DriftCode", "Dc"], ["MedBuddy", "Mb"], ["iAyos", "Ia"], ["Seminar Attendance", "Sa"], ["Saksi", "Ss"], ["Balangay", "Bl"]];
  for (const [t, want] of cases) if (glyphFor(t) !== want) throw new Error(`glyphFor(${t}) = ${glyphFor(t)}, want ${want}`);
}

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const FADE_OUT = `transition-opacity duration-500 ${EASE} group-hover:opacity-0 group-focus-visible:opacity-0`;

export default function ProjectThumb({
  title,
  src,
  label,
  category,
  tech = [],
  className = "",
}: Props) {
  const hue = hueFor(title);
  const chromeLabel = label ?? title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`@container relative aspect-[16/10] overflow-hidden bg-card ${className}`}>
      <div className="absolute inset-x-0 top-0 z-30 flex h-7 items-center gap-1.5 border-b border-border bg-background/80 px-3">
        <i className="h-2 w-2 rounded-full bg-border" />
        <i className="h-2 w-2 rounded-full bg-border" />
        <i className="h-2 w-2 rounded-full bg-border" />
        <span className="ml-2 truncate font-mono text-[11px] text-muted-foreground">{chromeLabel}</span>
      </div>

      {src ? (
        <>
          {/* Sharp copy underneath: revealed as the layers above fade out */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="absolute inset-x-0 bottom-0 top-7 h-[calc(100%-1.75rem)] w-full object-cover object-top"
          />
          {/* Static blurred copy + scrim: fade out together on hover */}
          <div aria-hidden className={`absolute inset-x-0 bottom-0 top-7 overflow-hidden ${FADE_OUT}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full scale-110 object-cover object-top blur-[6px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
          </div>
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 top-7"
          style={{
            background: `radial-gradient(oklch(0.985 0 0 / 0.08) 1px, transparent 1px) 0 0 / 22px 22px, linear-gradient(160deg, oklch(0.22 0.07 ${hue}), oklch(0.15 0.05 ${hue}))`,
          }}
        />
      )}

      {/* Foreground: same layout for every card; fades away on hover when a screenshot is behind it */}
      <div className={`absolute inset-x-0 bottom-0 top-7 z-20 flex flex-col justify-between p-5 ${src ? FADE_OUT : ""}`}>
        <div
          className="font-display text-[clamp(2.25rem,22cqw,4.5rem)] font-bold leading-[0.8] tracking-[-0.06em] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
          style={{ color: `oklch(0.78 0.16 ${hue} / 0.95)` }}
        >
          {glyphFor(title)}
        </div>
        <div className="flex min-w-0 flex-col items-start gap-2 @md:flex-row @md:items-end @md:justify-between @md:gap-3">
          {category && (
            <span className="max-w-full truncate font-mono text-[11px] uppercase tracking-wider text-white/70">{category}</span>
          )}
          <div className="flex max-h-[26px] flex-wrap gap-1.5 overflow-hidden @md:max-h-none @md:justify-end">
            {tech.slice(0, 3).map((t) => (
              <b
                key={t}
                className="rounded border border-white/20 bg-black/45 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white/90"
              >
                {t}
              </b>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
