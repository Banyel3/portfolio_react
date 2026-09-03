// Shared section heading: title (clip-reveals on scroll), optional lede or
// right-side controls, then a hairline rule. Server-safe.
export default function SectionHeader({
  title,
  children,
  aside,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={`mb-2 flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
        <h2 className="reveal font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[44px]">
          {title}
        </h2>
        {children && <p className="max-w-[460px] text-[15px] leading-relaxed text-muted-foreground">{children}</p>}
        {aside}
      </div>
      <div className="mb-10 h-px bg-gradient-to-r from-border to-transparent" />
    </>
  );
}
