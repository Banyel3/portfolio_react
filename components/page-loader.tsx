"use client";
import { useEffect, useState } from "react";
import BootPanel from "@/components/boot-panel";

const BOOT_LINES = [
  "POST  cold boot",
  "OK    kernel 6.10 ready",
  "OK    mount /var/portfolio",
  "OK    docker daemon up",
  "OK    nginx reverse proxy",
  "OK    cloudflare tunnel ready",
  "OK    tls handshake complete",
  "OK    case-studies hydrated",
  "OK    experiences hydrated",
  "OK    credentials hydrated",
  "READY portfolio.service active",
];

const MIN_MS = 1400;
const TICK_MS = 130;
const FADE_MS = 600;

export default function PageLoader() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduced ? 0 : MIN_MS;
    const start = performance.now();

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minMs - elapsed);
      window.setTimeout(() => setDone(true), wait);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    const tick = window.setInterval(() => {
      setVisible((n) => (n < BOOT_LINES.length ? n + 1 : n));
    }, TICK_MS);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (done) {
      const t = window.setTimeout(() => setRemoved(true), FADE_MS);
      return () => window.clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done]);

  if (removed) return null;

  const progress = (visible / BOOT_LINES.length) * 100;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={done ? "Loaded" : "Loading site"}
      className={`fixed inset-0 z-[200] grid place-items-center bg-background transition-[clip-path] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        done ? "pointer-events-none [clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0)]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] text-foreground"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, currentColor 3px, transparent 4px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
      />
      <BootPanel
        lines={BOOT_LINES.slice(0, visible)}
        progress={progress}
        showCursor={visible < BOOT_LINES.length}
        status={
          done
            ? "ready — booting ui"
            : visible < BOOT_LINES.length
            ? "warming up… don't unplug"
            : "ready — booting ui"
        }
      />
    </div>
  );
}
