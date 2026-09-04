// The "V + pulse" mark: a chevron V with a dot at the vertex, echoing the
// live-status dot used across the site (hero panel, experience timeline).
// Colors come from the theme tokens so it never drifts from the palette
// again (see public/favicon.svg for the static, non-theme-aware export).
export default function LogoMark({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <path
        d="M17 16 L32 45 L47 16"
        fill="none"
        strokeWidth="10.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
      <circle cx="32" cy="48" r="5.5" className="fill-primary-foreground" />
    </svg>
  );
}
