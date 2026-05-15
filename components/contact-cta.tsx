import { CONTACT_BOOK_URL } from "@/lib/constants";

export default function ContactCta() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-16 sm:py-24 text-center">
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">
        Let&apos;s build something.
      </h2>
      <p className="mx-auto mt-3 max-w-prose text-muted-foreground">
        Backend systems, cloud infra, internal tooling — happy to talk about your stack.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={CONTACT_BOOK_URL}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Book a call
        </a>
        <a
          href="https://github.com/Banyel3"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
