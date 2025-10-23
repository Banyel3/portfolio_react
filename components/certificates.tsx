import type { Certificate } from "@prisma/client";

async function getCertificates(): Promise<Certificate[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined) ??
      "http://localhost:3000";
    const res = await fetch(`${base}/api/certificates`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

export default async function Certificates() {
  const certificates = await getCertificates();

  return (
    <section
      id="certificates"
      className="py-20 sm:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Certifications
          </h2>
          <p className="text-muted-foreground">
            Professional certifications demonstrating expertise and commitment
            to continuous learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-accent">{cert.issuer}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {cert.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {cert.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 rounded bg-primary/5 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
