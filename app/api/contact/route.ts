import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CONTACT_EMAIL } from "@/lib/constants";
import { renderContactEmail } from "@/lib/contact-email";

// Sends the contact form to CONTACT_TO (defaults to CONTACT_EMAIL) through the
// Resend REST API. No SDK: one fetch. Needs RESEND_API_KEY; RESEND_FROM is
// optional (defaults to Resend's shared onboarding sender, which can only
// deliver to the Resend account owner's address; verify a domain to change it).
//
// Rate limits (protect Resend credits): 3 per IP per hour, 20 total per day.
// Counted from the contact_messages table so limits hold across serverless
// instances and cold starts; every accepted attempt is stored, so a Resend
// outage never loses a message. The global cap is the IP-independent backstop:
// rotating IPs still gets at most 20 emails a day.
//
// Insert first, then count including our own row. Counting first would let a
// burst of parallel requests all see "under the limit" before any of them
// inserts. With insert-then-count, the k-th row to commit sees at least k rows,
// so at most LIMIT requests pass however many arrive at once. Rejected rows are
// deleted so a flood cannot fill the table.
// ponytail: two COUNT queries per request; swap for a KV counter if volume ever matters.
const PER_IP_PER_HOUR = 3;
const GLOBAL_PER_DAY = 20;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const Body = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  company: z.string().max(0).optional(), // honeypot: must stay empty
});

// Trusts x-forwarded-for because Vercel overwrites it with the real client IP
// (verified: spoofed X-Forwarded-For / X-Real-IP / X-Vercel-Forwarded-For
// headers were all replaced). Behind any other host this header is
// attacker-controlled; only the global cap would still hold.
//
// IPv6 is bucketed by /64: one subscriber usually owns a whole /64, so
// limiting per address would let them rotate through 2^64 of them.
function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const full = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t];
  return `${full.slice(0, 4).map((g) => g.toLowerCase().replace(/^0+(?=.)/, "")).join(":")}::/64`;
}

const limited = (msg: string, retryAfterSec: number) =>
  NextResponse.json({ error: msg }, { status: 429, headers: { "Retry-After": String(retryAfterSec) } });

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email is not configured on this server." }, { status: 503 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the fields and try again." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;
  const ip = clientIp(req);
  const now = Date.now();

  let record;
  try {
    record = await prisma.contactMessage.create({ data: { name, email, message, ip } });
    const [perIp, global] = await Promise.all([
      prisma.contactMessage.count({ where: { ip, createdAt: { gte: new Date(now - HOUR) } } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: new Date(now - DAY) } } }),
    ]);
    const over =
      perIp > PER_IP_PER_HOUR
        ? limited("Too many messages from this connection. Try again in an hour, or email me directly.", 3600)
        : global > GLOBAL_PER_DAY
          ? limited("The form is paused for today. Email me directly and I will reply.", 6 * 3600)
          : null;
    if (over) {
      await prisma.contactMessage.delete({ where: { id: record.id } });
      return over;
    }
  } catch (err) {
    console.error("[contact] rate-limit check failed", err);
    if (record) await prisma.contactMessage.delete({ where: { id: record.id } }).catch(() => {});
    return NextResponse.json({ error: "Could not send right now. Email me directly instead." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? CONTACT_EMAIL],
      reply_to: email,
      ...renderContactEmail({ name, email, message }),
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Could not send right now. Email me directly instead." }, { status: 502 });
  }

  await prisma.contactMessage.update({ where: { id: record.id }, data: { sent: true } });
  return NextResponse.json({ ok: true });
}
