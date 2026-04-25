"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  useIsLocal(setIsLocal);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["about", "certificates", "projects", "testimonials"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
      if (window.scrollY < 200) setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Certificates", href: "#certificates" },
    { label: "Projects", href: "#projects" },
  ];

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-5 px-4">
      {/* Floating pill nav */}
      <nav
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
          scrolled
            ? "bg-card/90 backdrop-blur-md border-border/60 shadow-[0_8px_32px_oklch(0.12_0.04_245_/_0.45)]"
            : "bg-card/60 backdrop-blur-sm border-border/30"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group mr-1">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold font-display text-sm ring-1 ring-primary/30 group-hover:ring-primary/60 group-hover:scale-110 transition-all duration-300">
            V
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0.5 font-display text-sm font-medium">
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Desktop Right Controls */}
        <div className="hidden md:flex items-center gap-2 ml-2">
          {isLocal && (
            <Link
              href="/cms"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 text-sm font-medium font-display"
            >
              <Settings size={13} />
              CMS
            </Link>
          )}
          <button
            aria-label="Toggle theme"
            title="Toggle light / dark"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border/50 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun size={14} />
              ) : (
                <Moon size={14} />
              ))}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2 ml-2">
          <button
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border/50 hover:border-primary/50 transition-all duration-200"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun size={14} />
              ) : (
                <Moon size={14} />
              ))}
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border/50 hover:border-primary/50 text-foreground transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden w-full max-w-sm mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-border/60 p-3 space-y-1 shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200 font-display"
            >
              {item.label}
            </a>
          ))}
          {isLocal && (
            <Link
              href="/cms"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-muted/50 rounded-xl transition-all duration-200 font-display font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={13} />
              CMS
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function useIsLocal(setIsLocal: (v: boolean) => void) {
  useEffect(() => {
    try {
      const host = window?.location?.hostname;
      setIsLocal(host === "localhost" || host === "127.0.0.1");
    } catch {
      setIsLocal(false);
    }
  }, [setIsLocal]);
}
