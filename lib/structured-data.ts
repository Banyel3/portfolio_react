import {
  SITE_URL,
  PERSON,
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  INFRA,
} from "@/lib/constants";

// JSON-LD builders. Everything here must be true and verifiable on the page —
// structured data that claims more than the page shows is what earns manual
// actions, not rich results.

const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;

/** Person + WebSite: how Google (and AI search) resolve "Vaniel Cornelio" to an entity. */
export function personAndSiteSchema(skills: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: PERSON.name,
        jobTitle: PERSON.jobTitle,
        description:
          "Backend developer and cloud engineer building and operating self-hosted cloud infrastructure.",
        url: SITE_URL,
        image: `${SITE_URL}/profile.png`,
        email: `mailto:${CONTACT_EMAIL}`,
        address: { "@type": "PostalAddress", addressCountry: "PH" },
        // sameAs is the strongest entity-resolution signal available here.
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        ...(skills.length > 0 ? { knowsAbout: skills } : {}),
        worksFor: { "@type": "Organization", name: "Independent / contract" },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: `${PERSON.name} — ${PERSON.jobTitle}`,
        publisher: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": SITE_ID },
      },
    ],
  };
}

type CaseStudyLd = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  updatedAt: Date;
  createdAt: Date;
};

/** CreativeWork + breadcrumbs for a case study page. */
export function caseStudySchema(cs: CaseStudyLd) {
  const url = `${SITE_URL}/work/${cs.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: cs.title,
        headline: cs.title,
        description: cs.summary,
        url,
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        dateCreated: cs.createdAt.toISOString(),
        dateModified: cs.updatedAt.toISOString(),
        inLanguage: "en",
        ...(cs.stack.length > 0 ? { keywords: cs.stack.join(", ") } : {}),
        // Only assert a live artifact when one actually exists.
        ...(cs.liveUrl || cs.repoUrl
          ? { workExample: [cs.liveUrl, cs.repoUrl].filter(Boolean).map((u) => ({ "@type": "WebSite", url: u })) }
          : {}),
        isPartOf: { "@id": SITE_ID },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#work` },
          { "@type": "ListItem", position: 3, name: cs.title, item: url },
        ],
      },
    ],
  };
}

/** The self-hosted demo, described as the software it is. */
export function infraSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${INFRA.url}/#demo`,
    url: INFRA.url,
    name: "Self-hosted infrastructure demo",
    description: `Self-hosted platform running on ${INFRA.stack.join(", ")}.`,
    author: { "@id": PERSON_ID },
  };
}
