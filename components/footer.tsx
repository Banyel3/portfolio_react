import { BIR_SEAL, INFRA, PERSON } from "@/lib/constants";

const SEAL_ALT = `BIR Registration Seal Badge: registered with the Bureau of Internal Revenue, 2026. RSN ${BIR_SEAL.rsn}.`;

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 pb-10 pt-8 md:px-12">
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

      {/* BIR Registration Seal Badge (RMC 38-2026). A quiet line in the footer:
          the badge as a small thumbnail, full size one click away. The image is
          never restyled or themed (it has to stay as issued), so it always sits
          on white. The full-size view is a native popover: no client JS. */}
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground md:justify-start">
        <button
          type="button"
          popoverTarget="bir-seal"
          aria-label="Show the BIR Registration Seal Badge at full size"
          className="cursor-zoom-in rounded-md bg-white p-1 ring-1 ring-border transition-shadow hover:ring-2 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BIR_SEAL.image}
            width={BIR_SEAL.width}
            height={BIR_SEAL.height}
            alt={SEAL_ALT}
            loading="lazy"
            className="h-9 w-auto"
          />
        </button>
        <span>BIR registered</span>
        <span className="font-mono">RSN {BIR_SEAL.rsn}</span>
        <a
          href={BIR_SEAL.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:text-foreground"
        >
          Verify ↗
        </a>
      </div>

      <div
        id="bir-seal"
        popover="auto"
        className="m-auto w-[min(92vw,620px)] rounded-xl border border-border bg-card p-3 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="rounded-lg bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BIR_SEAL.image}
            width={BIR_SEAL.width}
            height={BIR_SEAL.height}
            alt={SEAL_ALT}
            className="h-auto w-full"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
          <span>BIR Registration Seal Badge. Scan the code to verify.</span>
          <a
            href={BIR_SEAL.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:text-foreground"
          >
            Open verification page ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
