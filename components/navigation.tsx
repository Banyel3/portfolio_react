"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { RESUME_PATH } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#work" },
  { label: "Credentials", href: "#credentials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
const SECTION_IDS = NAV_ITEMS.map((i) => i.href.slice(1));

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const linksRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    setIsLocal(host === "localhost" || host === "127.0.0.1");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 200) return setActiveSection("");
      // Bottom of page: the last section can never reach the top threshold, so
      // treat "scrolled to the end" as the last section (Contact) being active.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) return setActiveSection(SECTION_IDS[SECTION_IDS.length - 1]);
      for (const id of [...SECTION_IDS].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) return setActiveSection(id);
      }
      setActiveSection("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // One underline element slides between links (FLIP by measured rects).
  useLayoutEffect(() => {
    const wrap = linksRef.current;
    if (!wrap) return;
    const el = wrap.querySelector<HTMLAnchorElement>(`a[href="#${activeSection}"]`);
    if (!el) return setUnderline(null);
    const a = el.getBoundingClientRect();
    const b = wrap.getBoundingClientRect();
    setUnderline({ x: a.left - b.left, w: a.width });
  }, [activeSection]);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    setIsOpen(false);
  };

  const ThemeIcon = resolvedTheme === "dark" ? Sun : Moon;

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || isOpen
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 md:px-12">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground transition-transform group-hover:scale-105">
            V
          </span>
          <span className="hidden font-display text-sm font-medium tracking-[0.01em] text-foreground sm:inline">
            Vaniel Cornelio
          </span>
        </Link>

        <div ref={linksRef} className="relative hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => smoothScroll(e, item.href)}
                className={`py-1.5 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-accent transition-[transform,width,opacity] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: underline?.w ?? 0,
              transform: `translateX(${underline?.x ?? 0}px)`,
              opacity: underline ? 1 : 0,
            }}
          />
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          {isLocal && (
            <Link
              href="/cms"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <Settings size={14} />
              CMS
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            {mounted && <ThemeIcon size={15} className="transition-transform duration-300 group-hover:rotate-90" />}
          </button>
          <a
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            Résumé
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border text-foreground md:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="space-y-1 px-6 pb-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => smoothScroll(e, item.href)}
                className="block rounded-lg px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <a
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
              >
                Résumé
              </a>
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="grid h-11 w-11 place-items-center rounded-lg border border-border text-muted-foreground"
              >
                {mounted && <ThemeIcon size={16} />}
              </button>
              {isLocal && (
                <Link
                  href="/cms"
                  onClick={() => setIsOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"
                  aria-label="CMS"
                >
                  <Settings size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
