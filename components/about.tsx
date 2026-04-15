import CoreSkills from "./core-skills";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left: Contact & Intro */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            — About
          </span>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Backend Developer.
            <br />
            Cloud Engineer.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            I build backend systems and operate self-hosted cloud
            infrastructure. I don&apos;t just write applications — I deploy and
            run them on real infrastructure I own and manage, using the same
            tools and practices cloud engineers use professionally.
          </p>
          <a
            href="mailto:cornelio.vaniel38@gmail.com"
            className="inline-flex items-center gap-2 text-primary font-display font-medium text-lg mt-4 group"
          >
            cornelio.vaniel38@gmail.com
            <span className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
              ↗
            </span>
          </a>
        </div>

        {/* Right: Philosophy + Stats */}
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Real infrastructure. Not a tutorial. Not a sandbox.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            My self-hosted platform runs on Ubuntu Server with Docker for
            containerization, Nginx for reverse proxying, Cloudflare Tunnel
            for secure public exposure, and Portainer and Cockpit for system
            management — the same technology stack used in cloud and DevOps
            environments.
          </p>

          {/* Skills Quick View */}
          <div className="pt-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
              Core Technologies
            </h4>
            <CoreSkills />
          </div>
        </div>
      </div>
    </section>
  );
}
