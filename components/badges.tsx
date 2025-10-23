import type { Badge } from "@prisma/client";

async function getBadges(): Promise<Badge[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined) ??
      "http://localhost:3000";
    const res = await fetch(`${base}/api/public/badges`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
}

export default async function Badges() {
  const badges = await getBadges();

  return (
    <section id="badges" className="py-12 sm:py-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Badges</h2>
          <p className="text-muted-foreground">
            Credly badges and micro-credentials
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center justify-center">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center justify-center">
              {badge.badgeUrl ? (
                <a
                  href={badge.badgeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  {badge.imageUrl ? (
                    <img
                      src={badge.imageUrl}
                      alt={badge.title}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded transform transition-transform hover:scale-105 hover:shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </a>
              ) : badge.imageUrl ? (
                <img
                  src={badge.imageUrl}
                  alt={badge.title}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded transform transition-transform hover:scale-105 hover:shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
