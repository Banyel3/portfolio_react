import { ImageResponse } from "next/og";
import { PERSON, INFRA } from "@/lib/constants";

// Social preview card, served at /og.
//
// Deliberately a plain route rather than the app/opengraph-image.tsx file
// convention: that convention resolves its own URL against the *runtime*
// origin and overrides metadata.openGraph.images, which would pin the card to
// whatever host rendered it (a Vercel deployment URL) instead of the canonical
// domain. As a route, layout.tsx owns the URL.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

// Hex rather than oklch: satori (the renderer behind ImageResponse) does not
// support oklch(). These are the sRGB equivalents of the dark theme tokens.
const BG = "#0b0f1a";
const CARD = "#141b2b";
const BORDER = "#22304a";
const PRIMARY = "#0099e8";
const FG = "#fafafa";
const MUTED = "#9aa7bd";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* top: logo mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={PRIMARY} />
            <path
              d="M17 16 L32 45 L47 16"
              fill="none"
              stroke={BG}
              strokeWidth="10.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="48" r="5.5" fill={BG} />
          </svg>
          <div style={{ display: "flex", fontSize: 26, color: MUTED, letterSpacing: "0.02em" }}>
            vancornelio.dev
          </div>
        </div>

        {/* middle: name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              color: FG,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {PERSON.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              color: FG,
              marginTop: 20,
              letterSpacing: "-0.01em",
            }}
          >
            Backend Developer <span style={{ color: "#3fd0d4", margin: "0 12px" }}>&</span> Cloud
            Engineer
          </div>
          <div style={{ display: "flex", fontSize: 27, color: MUTED, marginTop: 22, maxWidth: 940 }}>
            I ship and run production backends. Postgres, Docker, Nginx, Cloudflare Tunnel.
          </div>
        </div>

        {/* bottom: the live-infra proof, the thing only this portfolio has */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: "18px 24px",
            alignSelf: "flex-start",
          }}
        >
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
          <div style={{ display: "flex", fontSize: 25, color: FG }}>{INFRA.host}</div>
          <div style={{ display: "flex", fontSize: 25, color: MUTED }}>— self-hosted, live</div>
        </div>
      </div>
    ),
    size,
  );
}
