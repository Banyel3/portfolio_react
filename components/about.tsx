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
            Backend Developer,
            <br />
            Building Beyond Code.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            I am a backend developer focused on building reliable systems and
            deploying them in real-world environments. Alongside developing
            applications, I design and operate self-hosted infrastructure that
            runs multiple services securely on a Linux server.
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
            Designing systems that deploy, operate, and stay secure in the real
            world.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            This includes reverse proxying with Nginx, secure exposure through
            Cloudflare Tunnel, containerized services using Docker, and system
            management tools like Portainer and Cockpit. Through this, I&apos;ve
            developed practical experience not just in writing backend logic,
            but also in system design, networking, and infrastructure
            management.
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
