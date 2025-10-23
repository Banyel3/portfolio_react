"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  useIsLocal(setIsLocal);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Certificates", href: "#certificates" },
    { label: "Projects", href: "#projects" },
  ];

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
