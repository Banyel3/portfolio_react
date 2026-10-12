// Centralized project categories for portfolio and CMS
export const PROJECT_CATEGORIES = [
  "Software Engineering",
  "AI/ML",
  "Others",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const AVAILABILITY = {
  open: true,
  text: "Open to backend and infrastructure roles",
} as const;

// Live infrastructure panel in the hero (components/infra-status-card.tsx).
// Status and latency come from probing `probeUrl` server-side every 60 s; the
// other rows come from the infra_stats row the box itself pushes (see
// scripts/push-infra-stats.mjs).
//
// `host`/`url` is the showcase page, which is hosted on Vercel — so it is NOT
// what gets probed. `probeUrl` goes through Cloudflare Tunnel to an app on the
// self-hosted machine, so a dead server reads as DOWN.
export const INFRA = {
  host: "demo.vancornelio.dev",
  url: "https://demo.vancornelio.dev",
  probeHost: "pondo.vancornelio.dev",
  // /login directly: "/" redirects there, which would double the round trip.
  probeUrl: "https://pondo.vancornelio.dev/login",
  stack: ["Ubuntu Server", "Docker", "Nginx", "Cloudflare Tunnel", "Portainer", "Cockpit"],
} as const;

// Canonical origin. Used by metadataBase, robots.ts, sitemap.ts and the JSON-LD
// builders so every absolute URL is derived from one place. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL on deploys; the literal is the fallback.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vancornelio.dev";

export const PERSON = {
  name: "Vaniel Cornelio",
  legalName: "Vaniel John Cornelio",
  jobTitle: "Backend & Infrastructure Developer",
  location: "Philippines",
} as const;

// Shown under the certifications list. A study goal, not a credential — it is
// rendered as "Currently learning", never as a certificate item.
export const CURRENTLY_LEARNING = "AWS Certified Solutions Architect – Associate";

// BIR Registration Seal Badge (RMC 38-2026): registered online businesses and
// professionals must display it on their website. The image in public/ is the
// badge exactly as issued, cropped but otherwise unaltered — the rule requires
// that. `verifyUrl` is what its QR code encodes.
export const BIR_SEAL = {
  image: "/bir-registration-seal.png",
  width: 574,
  height: 196,
  rsn: "93ARC20260000004103",
  verifyUrl: "https://verify.bir.gov.ph/correspondence/54280934a1f445a285827224c79006bb",
} as const;

export const CONTACT_EMAIL = "cornelio.vaniel38@gmail.com";
export const GITHUB_URL = "https://github.com/Banyel3";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vancornelio";
