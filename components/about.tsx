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
            Passionate About
            <br />
            Code &amp; Innovation.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            I&apos;m a Computer Science student with a deep passion for software
            engineering, artificial intelligence, and building automations. My
            academic journey has equipped me with strong fundamentals in
            algorithms, data structures, and system design.
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
            Building robust backends, exploring AI frontiers, and automating the
            mundane.
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Through hands-on projects and certifications, I&apos;ve developed
            expertise in secure coding practices, machine learning applications,
            and full-stack development. I believe in continuous learning and
            staying updated with the latest technologies.
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
