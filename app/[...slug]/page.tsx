import { redirect } from "next/navigation";

// Catch-all for URLs that match no real route: send the visitor home instead of
// showing a dead end. More specific routes (/work/[slug], /cms/*, /og,
// /sitemap.xml, /robots.txt) and files in public/ all win over this, so it only
// ever sees genuinely unknown paths.
//
// SEO note: this trades a 404 for a redirect, which Google reports as a "soft
// 404" for any unknown URL it happens to crawl. That is the deliberate choice
// here (visitor experience over crawl semantics). Swapping this file for a
// styled 404 page that keeps the 404 status is the alternative.
export default function CatchAll() {
  redirect("/");
}
