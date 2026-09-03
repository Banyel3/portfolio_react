import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CONTACT_EMAIL } from "@/lib/constants";

// Sends the contact form to CONTACT_TO (defaults to CONTACT_EMAIL) through the
// Resend REST API. No SDK: one fetch. Needs RESEND_API_KEY; RESEND_FROM is
// optional (defaults to Resend's shared onboarding sender, which can only
// deliver to the Resend account owner's address; verify a domain to change it).
//
// Rate limits (protect Resend credits): 3 per IP per hour, 20 total per day.
// Counted from the contact_messages table so limits hold across serverless
// instances and cold starts; every attempt is stored, so a Resend outage
// never loses a message.
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

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
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

  try {
    const [perIp, global] = await Promise.all([
      prisma.contactMessage.count({ where: { ip, createdAt: { gte: new Date(now - HOUR) } } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: new Date(now - DAY) } } }),
    ]);
    if (perIp >= PER_IP_PER_HOUR) {
      return limited("Too many messages from this connection. Try again in an hour, or email me directly.", 3600);
    }
    if (global >= GLOBAL_PER_DAY) {
      return limited("The form is paused for today. Email me directly and I will reply.", 6 * 3600);
    }
  } catch (err) {
    console.error("[contact] rate-limit lookup failed", err);
    return NextResponse.json({ error: "Could not send right now. Email me directly instead." }, { status: 503 });
  }

  // Record first so the attempt counts toward the limit even if Resend fails.
  const record = await prisma.contactMessage.create({ data: { name, email, message, ip } });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? CONTACT_EMAIL],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escape(name)}</strong> &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Could not send right now. Email me directly instead." }, { status: 502 });
  }

  await prisma.contactMessage.update({ where: { id: record.id }, data: { sent: true } });
  return NextResponse.json({ ok: true });
}
