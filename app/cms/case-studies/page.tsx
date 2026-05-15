import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function CaseStudiesCmsPage() {
  const items = await prisma.caseStudy.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/cms" className="text-sm text-muted-foreground hover:underline">
            ← Back to CMS
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Case Studies</h1>
        </div>
        <Link
          href="/cms/case-studies/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + New Case Study
        </Link>
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border">
        {items.length === 0 && (
          <li className="p-6 text-sm text-muted-foreground">No case studies yet.</li>
        )}
        {items.map((cs) => (
          <li key={cs.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">
                {cs.title}{" "}
                {cs.featured && (
                  <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    featured
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">/{cs.slug}</div>
            </div>
            <Link href={`/cms/case-studies/${cs.id}`} className="text-sm hover:underline">
              Edit →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
