import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import CaseStudyGrid from "@/components/case-study-grid";
import About from "@/components/about";
import Experience from "@/components/experience";
import Credentials from "@/components/credentials";
import OtherProjects from "@/components/other-projects";
import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { personAndSiteSchema } from "@/lib/structured-data";

export const revalidate = 60;

// Neon suspends idle computes. The first connection after a wake can take
// several seconds, and six queries racing for fresh connections at that moment
// hit Prisma's connect/pool timeouts (P1001 / P2024). So: open ONE connection
// first to absorb the wake, then run the queries, retrying a connection error
// once. In production a query that still fails throws, so ISR serves the last
// good page instead of caching an empty section for 60 s.
const CONNECTION_ERRORS = new Set(["P1001", "P1002", "P1017", "P2024"]);
const isConnectionError = (err: unknown) =>
  typeof err === "object" && err !== null && CONNECTION_ERRORS.has((err as { code?: string }).code ?? "");

async function loadPortfolioData() {
  await prisma.$connect().catch((err) => console.error("[page] warm-up connect failed:", err?.code ?? err));

  const safe = async <T,>(query: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await query();
    } catch (err) {
      if (isConnectionError(err)) {
        await new Promise((r) => setTimeout(r, 1500));
        try {
          return await query();
        } catch (retryErr) {
          err = retryErr;
        }
      }
      console.error("[page] data load error:", err);
      if (process.env.NODE_ENV === "production") throw err;
      return fallback;
    }
  };

  const [experiences, certificates, badges, projects, caseStudies, skills] = await Promise.all([
    safe(
      () => prisma.experience.findMany({
        include: {
          testimonials: {
            select: {
              id: true,
              authorName: true,
              authorRole: true,
              quote: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { startDate: "desc" },
      }),
      [],
    ),
    safe(
      () => prisma.certificate.findMany({ orderBy: { createdAt: "desc" } }),
      [],
    ),
    safe(
      () => prisma.badge.findMany({ orderBy: { createdAt: "desc" } }),
      [],
    ),
    safe(
      () => prisma.project.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          technologies: true,
          githubLink: true,
          liveLink: true,
          imageUrl: true,
          images: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      [],
    ),
    safe(
      () => prisma.caseStudy.findMany({
        where: { featured: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          role: true,
          summary: true,
          stack: true,
          architecture: true,
          status: true,
          projectId: true,
          project: { select: { images: true, category: true } },
        },
      }),
      [],
    ),
    safe(
      () => prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
      [],
    ),
  ]);

  // Projects with a featured case study are shown there; the rest are "Other projects".
  const featuredProjectIds = new Set(caseStudies.map((cs) => cs.projectId).filter(Boolean));
  const otherProjects = projects.filter((p) => !featuredProjectIds.has(p.id));

  return { experiences, certificates, badges, otherProjects, caseStudies, skills };
}

export default async function Home() {
  const { experiences, certificates, badges, otherProjects, caseStudies, skills } =
    await loadPortfolioData();

  const jsonLd = personAndSiteSchema(skills.map((s) => s.name));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        // Server-rendered, no user input in the payload.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <Hero />
      <Experience initialExperiences={JSON.parse(JSON.stringify(experiences))} />
      <CaseStudyGrid caseStudies={JSON.parse(JSON.stringify(caseStudies))} />
      <Credentials
        certificates={JSON.parse(JSON.stringify(certificates))}
        badges={JSON.parse(JSON.stringify(badges))}
        skills={JSON.parse(JSON.stringify(skills))}
      />
      <About />
      <OtherProjects projects={JSON.parse(JSON.stringify(otherProjects))} />
      <ContactCta />
      <Footer />
    </main>
  );
}
