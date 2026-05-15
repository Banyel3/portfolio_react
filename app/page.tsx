import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Certificates from "@/components/certificates";
import Badges from "@/components/badges";
import Projects from "@/components/projects";
import Footer from "@/components/footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function loadPortfolioData() {
  const safe = <T,>(p: Promise<T>, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error("[page] data load error:", err);
      return fallback;
    });

  const [experiences, certificates, badges, projects] = await Promise.all([
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
  ]);

  return { experiences, certificates, badges, projects };
}

export default async function Home() {
  const { experiences, certificates, badges, projects } =
    await loadPortfolioData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Experience initialExperiences={JSON.parse(JSON.stringify(experiences))} />
      <About />
      <Certificates
        initialCertificates={JSON.parse(JSON.stringify(certificates))}
      />
      <Badges initialBadges={JSON.parse(JSON.stringify(badges))} />
      <Projects initialProjects={JSON.parse(JSON.stringify(projects))} />
      <Footer />
    </main>
  );
}
