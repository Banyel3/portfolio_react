import CoreSkills from "./core-skills";

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">About Me</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a Computer Science student with a deep passion for
                cybersecurity, software engineering, and artificial
                intelligence. My academic journey has equipped me with strong
                fundamentals in algorithms, data structures, and system design.
              </p>
              <p>
                Through hands-on projects and certifications, I've developed
                expertise in secure coding practices, network security, machine
                learning applications, and full-stack development. I believe in
                continuous learning and staying updated with the latest
                technologies and security practices.
              </p>
              <p>
                When I'm not coding or studying, you'll find me exploring new
                security vulnerabilities, contributing to open-source projects,
                or experimenting with new AI/ML frameworks.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-accent mb-3">Core Skills</h3>
              <CoreSkills />
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="font-semibold text-accent mb-3">
                Specializations
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>Network Security & Penetration Testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>Full-Stack Web Development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>Machine Learning & Data Science</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
