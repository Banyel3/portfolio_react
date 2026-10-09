import { SITE_URL } from "@/lib/constants";

// The notification email the contact form sends to me. Email clients ignore
// <style> blocks and modern CSS (Gmail strips most of it), so this is
// table layout with inline styles only — the boring markup that renders the
// same in Gmail, Outlook and Apple Mail.

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const BRAND = "#0099e8";
const INK = "#0f172a";
const MUTED = "#64748b";
const LINE = "#e2e8f0";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

export function renderContactEmail({
  name,
  email,
  message,
  receivedAt = new Date(),
}: {
  name: string;
  email: string;
  message: string;
  receivedAt?: Date;
}) {
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
  const subject = `[vancornelio.dev] Message from ${oneLine(name)}`;
  const first = oneLine(name).split(" ")[0];
  const when = receivedAt.toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: your message on vancornelio.dev")}`;
  const preheader = escape(oneLine(message).slice(0, 110));
  const host = new URL(SITE_URL).host.replace(/^www\./, "");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escape(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

    <tr><td style="padding:0 4px 16px;font-family:${FONT};">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:28px;height:28px;background:${BRAND};border-radius:7px;text-align:center;vertical-align:middle;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;">V</td>
        <td style="padding-left:10px;font-family:${FONT};font-size:13px;color:${MUTED};">${escape(host)} &middot; contact form</td>
      </tr></table>
    </td></tr>

    <tr><td style="background:#ffffff;border:1px solid ${LINE};border-radius:12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

        <tr><td style="padding:28px 28px 0;font-family:${FONT};">
          <div style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND};">New message</div>
          <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;font-weight:600;color:${INK};">${escape(name)}</h1>
          <a href="${replyHref}" style="display:inline-block;margin-top:4px;font-family:${MONO};font-size:14px;color:${BRAND};text-decoration:none;">${escape(email)}</a>
        </td></tr>

        <tr><td style="padding:20px 28px 0;">
          <div style="border-left:3px solid ${BRAND};background:#f8fafc;border-radius:0 8px 8px 0;padding:16px 18px;font-family:${FONT};font-size:15px;line-height:1.65;color:${INK};white-space:pre-wrap;word-break:break-word;">${escape(message)}</div>
        </td></tr>

        <tr><td style="padding:24px 28px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:${BRAND};border-radius:8px;">
              <a href="${replyHref}" style="display:inline-block;padding:12px 20px;font-family:${FONT};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Reply to ${escape(first)} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="border-top:1px solid ${LINE};padding:14px 28px;font-family:${FONT};font-size:12px;color:${MUTED};">
          Received ${escape(when)} (PHT)
        </td></tr>

      </table>
    </td></tr>

    <tr><td style="padding:16px 4px 0;font-family:${FONT};font-size:12px;line-height:1.5;color:${MUTED};">
      Sent from the contact form on <a href="${SITE_URL}" style="color:${MUTED};">${escape(host)}</a>. Hitting reply in your mail app also goes to ${escape(email)}.
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `New message from ${oneLine(name)} <${email}>
Received ${when} (PHT)

${message}

--
Sent from the contact form on ${host}. Reply to this email to answer ${first}.`;

  return { subject, html, text };
}
