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
