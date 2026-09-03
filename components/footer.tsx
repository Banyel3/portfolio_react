import { INFRA } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 pb-10 pt-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-[13px] text-muted-foreground md:flex-row md:text-left">
        <span>
          <b className="font-medium text-foreground">Vaniel Cornelio</b> · Backend Developer &amp; Cloud Engineer
        </span>
        <a
          href={INFRA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs hover:text-foreground"
        >
          {INFRA.host}
        </a>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
