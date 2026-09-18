import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

// Regenerated on the same cadence as the pages it lists.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  // Neon suspends idle computes, so a build that happens to run against a cold
  // database would otherwise fail here and take the whole deploy with it. A
  // sitemap missing its case studies is recoverable (next revalidate fixes it);
  // a failed deploy is not.
  try {
    const studies = await prisma.caseStudy.findMany({
      where: { featured: true },
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    });

    return [
      ...home,
      ...studies.map((s) => ({
        url: `${SITE_URL}/work/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    console.error("[sitemap] case study lookup failed, serving homepage only:", err);
    return home;
  }
}
