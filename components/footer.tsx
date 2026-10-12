import { BIR_SEAL, INFRA, PERSON } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 pb-10 pt-8 md:px-12">
      {/* Always on white, never themed: the badge has to stay as issued. */}
      <div className="mx-auto mb-8 flex max-w-7xl flex-col items-center gap-2.5 md:items-start">
        <a
          href={BIR_SEAL.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="BIR Registration Seal Badge. Opens the BIR verification page."
          className="block w-full max-w-[460px] rounded-lg border border-border bg-white p-2 transition-shadow hover:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_25%,transparent)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BIR_SEAL.image}
            width={BIR_SEAL.width}
            height={BIR_SEAL.height}
            alt={`BIR Registration Seal Badge: registered with the Bureau of Internal Revenue, 2026. RSN ${BIR_SEAL.rsn}.`}
            loading="lazy"
            className="h-auto w-full"
          />
        </a>
        <p className="text-xs text-muted-foreground">BIR registered. Scan the code or tap the badge to verify.</p>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-[13px] text-muted-foreground md:flex-row md:text-left">
        <span>
          <b className="font-medium text-foreground">Vaniel Cornelio</b> · Backend &amp; Infrastructure Developer
        </span>
        <a
          href={INFRA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs hover:text-foreground"
        >
          {INFRA.host}
        </a>
        <span>© {new Date().getFullYear()} {PERSON.legalName}</span>
      </div>
    </footer>
  );
}
