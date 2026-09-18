import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseStudyPage, {
  type CaseStudyPageProps,
} from "@/components/case-study-page";
import { caseStudySchema } from "@/lib/structured-data";
import type { Metadata } from "next";

export const revalidate = 60;

// Neon suspends idle computes; the first connection after a wake can take
// several seconds and fail with P1001/P2024. generateStaticParams runs at build
// time, so an unlucky cold start would fail the whole deploy — returning [] instead
// just defers those pages to on-demand rendering, which the revalidate above
// already supports.
const CONNECTION_ERRORS = new Set(["P1001", "P1002", "P1017", "P2024"]);
const isConnectionError = (err: unknown) =>
  typeof err === "object" && err !== null && CONNECTION_ERRORS.has((err as { code?: string }).code ?? "");

async function findCaseStudy(slug: string) {
  try {
    return await prisma.caseStudy.findUnique({ where: { slug } });
  } catch (err) {
    if (isConnectionError(err)) {
      await new Promise((r) => setTimeout(r, 1500));
      return prisma.caseStudy.findUnique({ where: { slug } });
    }
    throw err;
  }
}

export async function generateStaticParams() {
  try {
    const studies = await prisma.caseStudy.findMany({
      where: { featured: true },
      select: { slug: true },
    });
    return studies.map((s) => ({ slug: s.slug }));
  } catch (err) {
    console.error("[work] generateStaticParams failed, deferring to on-demand:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await findCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found" };

  const url = `/work/${cs.slug}`;
  // Fall back to the site-wide OG card when a case study has no architecture
  // image — most don't, and an imageless card is a wasted share.
  const images = cs.architecture ? [cs.architecture] : undefined;

  return {
    // layout.tsx's title.template appends the brand suffix.
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: cs.title,
      description: cs.summary,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: cs.title,
      description: cs.summary,
      ...(images ? { images } : {}),
    },
  };
}

export default async function WorkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await findCaseStudy(slug);
  if (!cs) notFound();

  const decisions = Array.isArray(cs.decisions)
    ? (cs.decisions as CaseStudyPageProps["decisions"])
    : [];

  const jsonLd = caseStudySchema({
    slug: cs.slug,
    title: cs.title,
    summary: cs.summary,
    stack: cs.stack,
    liveUrl: cs.liveUrl,
    repoUrl: cs.repoUrl,
    createdAt: cs.createdAt,
    updatedAt: cs.updatedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyPage
        title={cs.title}
        slug={cs.slug}
        role={cs.role}
        status={cs.status}
        summary={cs.summary}
        problem={cs.problem}
        decisions={decisions}
        architecture={cs.architecture}
        ops={cs.ops}
        reflections={cs.reflections}
        liveUrl={cs.liveUrl}
        repoUrl={cs.repoUrl}
        stack={cs.stack}
      />
    </>
  );
}
