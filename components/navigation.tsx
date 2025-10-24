"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  useIsLocal(setIsLocal);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Certificates", href: "#certificates" },
    { label: "Projects", href: "#projects" },
  ];

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            {"<CS Portfolio />"}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            {isLocal && (
              <Link
                href="/cms"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <Settings size={16} />
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
              className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-colors"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <Moon size={16} />
                ))}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {isLocal && (
              <Link
                href="/cms"
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-card rounded transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                CMS
              </Link>
            )}
            <div className="px-4">
              <button
                aria-label="Toggle theme"
                title="Toggle light / dark"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border hover:bg-muted transition-colors text-sm w-full justify-center"
              >
                {mounted &&
                  (resolvedTheme === "dark" ? (
                    <Sun size={16} />
                  ) : (
                    <Moon size={16} />
                  ))}
                <span>
                  {mounted
                    ? resolvedTheme === "dark"
                      ? "Light"
                      : "Dark"
                    : "Theme"}
                </span>
              </button>
            </div>
          </div>
        )}
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
