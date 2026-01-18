"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useIsLocal(setIsLocal);

  // Add scroll detection for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Certificates", href: "#certificates" },
    { label: "Projects", href: "#projects" },
  ];

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className={`sticky top-0 z-50 border-b border-border transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-md shadow-lg" 
        : "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    }`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-bold text-primary transition-transform duration-200 hover:scale-105"
          >
            {"<CS Portfolio />"}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            {isLocal && (
              <Link
                href="/cms"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 text-sm font-medium hover:scale-105"
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
              className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border hover:bg-muted transition-all duration-200 hover:scale-110 hover:rotate-12"
            >
              {mounted &&
                (resolvedTheme === "dark" ? (
                  <Sun size={16} className="transition-transform duration-300" />
                ) : (
                  <Moon size={16} className="transition-transform duration-300" />
                ))}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-transform duration-200 hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${
                  isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              />
              <X 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${
                  isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 space-y-2 animate-in slide-in-from-top">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded transition-all duration-200 hover:translate-x-1"
                style={{
                  animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                {item.label}
              </a>
            ))}
            {isLocal && (
              <Link
                href="/cms"
                className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-card rounded transition-all duration-200 font-medium hover:translate-x-1"
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
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border hover:bg-muted transition-all duration-200 text-sm w-full justify-center hover:scale-105"
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
