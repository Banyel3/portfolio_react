"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings, Sun, Moon, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  useIsLocal(setIsLocal);

  // Scroll detection for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
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
    { label: "Testimonials", href: "#testimonials" },
  ];

  // Smooth scroll handler
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
    <nav
      className={`fixed w-full z-50 top-0 left-0 px-6 py-4 md:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-lg border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold font-display text-lg group-hover:scale-110 transition-transform">
            V
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-display text-sm font-medium">
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`relative transition-colors duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </a>
            );
          })}
          <a
            href="https://demo.vancornelio.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 text-sm font-medium"
            aria-label="Open demo infrastructure platform in new tab"
          >
            Demo Platform
            <ExternalLink size={14} />
          </a>
          {isLocal && (
            <Link
              href="/cms"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 text-sm font-medium"
            >
              <Settings size={14} />
              CMS
            </Link>
          )}
          {/* Theme toggle */}
          <button
            aria-label="Toggle theme"
            title="Toggle light / dark"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-200"
          >
            {mounted &&
              (resolvedTheme === "dark" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              ))}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 space-y-1 bg-card/90 backdrop-blur-md rounded-lg p-4 border border-border">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-all duration-200 font-display"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://demo.vancornelio.dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-primary-foreground bg-primary rounded transition-all duration-200 font-display font-medium"
            aria-label="Open demo infrastructure platform in new tab"
          >
            <span>Demo Platform</span>
            <ExternalLink size={14} />
          </a>
          {isLocal && (
            <Link
              href="/cms"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-muted rounded transition-all duration-200 font-display font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={14} />
              CMS
            </Link>
          )}
          <div className="px-4 pt-2">
            <button
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted border border-border text-sm w-full justify-center font-display"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun size={14} />
                ) : (
                  <Moon size={14} />
                ))}
              <span>
                {mounted
                  ? resolvedTheme === "dark"
                    ? "Light Mode"
                    : "Dark Mode"
                  : "Theme"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Detect localhost on the client
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
