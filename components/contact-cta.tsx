import ContactForm from "@/components/contact-form";

export default function ContactCta() {
  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-6 pb-28 pt-32 text-center md:pb-32 md:pt-36">
      <span
        aria-hidden
        className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-accent"
      />
      <h2 className="reveal font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[64px]">
        Let&apos;s build something
        <br />
        <span className="text-muted-foreground/60">that stays up.</span>
      </h2>
      <p className="mx-auto mt-[18px] max-w-[520px] text-[17px] leading-relaxed text-muted-foreground">
        Backend systems, cloud infra, internal tooling. Tell me about your stack and I will reply
        within a day.
      </p>
      <div className="mt-9">
        <ContactForm />
      </div>
    </section>
  );
}
