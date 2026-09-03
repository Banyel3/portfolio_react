import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CaseStudyPage, {
  type CaseStudyPageProps,
} from "@/components/case-study-page";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const studies = await prisma.caseStudy.findMany({
    where: { featured: true },
    select: { slug: true },
  });
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.title} — Vaniel Cornelio`,
    description: cs.summary,
    openGraph: {
      title: cs.title,
      description: cs.summary,
      images: cs.architecture ? [cs.architecture] : undefined,
    },
  };
}

export default async function WorkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) notFound();

  const decisions = Array.isArray(cs.decisions)
    ? (cs.decisions as CaseStudyPageProps["decisions"])
    : [];

  return (
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
  );
}
