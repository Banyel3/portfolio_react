export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
          {/* Left: text/content */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
                Computer Science Student
              </h1>
              <p className="text-lg sm:text-xl text-accent">
                Cybersecurity • Software Engineering • AI/ML
              </p>
            </div>
            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Passionate about building secure systems, crafting elegant
              software solutions, and exploring the frontiers of artificial
              intelligence. Showcasing my journey through certifications,
              projects, and continuous learning.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                View My Work
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right: profile image - replace src with your picture */}
          <div className="shrink-0">
            <img
              src="/profile.jpg"
              alt="Your name"
              className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full object-cover ring-2 ring-border shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
