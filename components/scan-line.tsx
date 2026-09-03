"use client";
import { useEffect, useRef, useState } from "react";

// Looping cyan sweep across a thumbnail. Runs only while the card is in the
// viewport (IntersectionObserver toggles `visible`), fades out while the parent
// `.group` is hovered so the revealed screenshot is clean. State lives in React,
// so server and client markup always match.
export default function ScanLine() {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`scan pointer-events-none absolute inset-x-0 bottom-0 top-7 z-40 overflow-hidden rounded-b-xl transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 ${
        visible ? "visible" : ""
      }`}
    >
      <i className="block h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
    </span>
  );
}
