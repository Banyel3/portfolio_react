// Centralized project categories for portfolio and CMS
export const PROJECT_CATEGORIES = [
  "Software Engineering",
  "AI/ML",
  "Others",
] as const;

// Categories with "All" option for filtering (used in portfolio display)
export const PROJECT_CATEGORIES_WITH_ALL = [
  "All",
  ...PROJECT_CATEGORIES,
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const AVAILABILITY = {
  open: true,
  text: "Open to roles — available June 2026",
} as const;

export type HighlightTile = {
  label: string;
  value: string;
  unit?: string;
};

// All three tiles MUST be verifiable. Drop a tile rather than fake a number.
export const HIGHLIGHTS: HighlightTile[] = [
  { label: "Demo uptime (30d)", value: "—", unit: "%" },
  { label: "Production deploys", value: "—" },
  { label: "Services self-hosted", value: "—" },
];

export const RESUME_PATH = "/resume.pdf";
export const CONTACT_BOOK_URL = "mailto:gamerofgames76@gmail.com?subject=Backend%2FCloud%20opportunity";
