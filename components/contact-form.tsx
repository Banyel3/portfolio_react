"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/constants";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-lg border border-border bg-card px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-[border-color,box-shadow] duration-200 focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_20%,transparent)] focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Could not send.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send.");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="animate-rise mx-auto flex max-w-xl items-center gap-3.5 rounded-xl border border-emerald-400/35 bg-emerald-400/10 px-5 py-4 text-left"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-400 text-background">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <div>
          <p className="font-medium text-foreground">Sent. I reply within a day.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-0.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl text-left" noValidate={false}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" className={field} />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="What are you building, and what does the stack look like?"
          className={`${field} resize-y`}
        />
      </label>
      {/* Honeypot: hidden from people, filled by bots, rejected by the API */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex h-[46px] min-w-[150px] items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklch,var(--primary)_60%,transparent)] transition-[transform,filter,opacity] duration-150 hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </>
          )}
        </button>
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-[13px] text-muted-foreground hover:text-foreground">
          or email {CONTACT_EMAIL}
        </a>
      </div>

      {status === "error" && (
        <p role="alert" className="animate-fade-in mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
