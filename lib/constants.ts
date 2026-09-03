// Centralized project categories for portfolio and CMS
export const PROJECT_CATEGORIES = [
  "Software Engineering",
  "AI/ML",
  "Others",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const AVAILABILITY = {
  open: true,
  text: "Open to backend and cloud roles",
} as const;

// Live infrastructure panel in the hero. Status and latency are probed
// server-side every 60 s (see components/infra-status-card.tsx). The rest are
// hand-maintained facts: leave a value null and the row shows "—" rather than a
// made-up number.
export const INFRA = {
  host: "demo.vancornelio.dev",
  url: "https://demo.vancornelio.dev",
  uptime30d: null as number | null, // e.g. 99.9
  services: null as number | null, // containers running behind nginx
  lastDeploy: null as string | null, // e.g. "2d ago"
  stack: ["Ubuntu Server", "Docker", "Nginx", "Cloudflare Tunnel", "Portainer", "Cockpit"],
} as const;

export const RESUME_PATH = "/resume.pdf";
export const CONTACT_BOOK_URL = "mailto:cornelio.vaniel38@gmail.com?subject=Backend%2FCloud%20opportunity";
export const CONTACT_EMAIL = "cornelio.vaniel38@gmail.com";
export const GITHUB_URL = "https://github.com/Banyel3";
export const LINKEDIN_URL = "https://www.linkedin.com/in/vaniel-john-cornelio-4ba8aa278/";
