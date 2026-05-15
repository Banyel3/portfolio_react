import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import HighlightsStrip from "@/components/highlights-strip";
import CaseStudyGrid from "@/components/case-study-grid";
import About from "@/components/about";
import Experience from "@/components/experience";
import Credentials from "@/components/credentials";
import Projects from "@/components/projects";
import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function loadPortfolioData() {
  const safe = <T,>(p: Promise<T>, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error("[page] data load error:", err);
      return fallback;
    });

  const [experiences, certificates, badges, projects, caseStudies, skills] = await Promise.all([
    safe(
      prisma.experience.findMany({
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
      prisma.certificate.findMany({ orderBy: { createdAt: "desc" } }),
      [],
    ),
    safe(
      prisma.badge.findMany({ orderBy: { createdAt: "desc" } }),
      [],
    ),
    safe(
      prisma.project.findMany({
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
      prisma.caseStudy.findMany({
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
        },
      }),
      [],
    ),
    safe(
      prisma.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
      [],
    ),
  ]);

  return { experiences, certificates, badges, projects, caseStudies, skills };
}

export default async function Home() {
  const { experiences, certificates, badges, projects, caseStudies, skills } =
    await loadPortfolioData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <HighlightsStrip />
      <CaseStudyGrid caseStudies={JSON.parse(JSON.stringify(caseStudies))} />
      <Experience initialExperiences={JSON.parse(JSON.stringify(experiences))} />
      <Credentials
        certificates={JSON.parse(JSON.stringify(certificates))}
        badges={JSON.parse(JSON.stringify(badges))}
        skills={JSON.parse(JSON.stringify(skills))}
      />
      <About />
      <Projects initialProjects={JSON.parse(JSON.stringify(projects))} variant="overflow" />
      <ContactCta />
      <Footer />
    </main>
  );
}
