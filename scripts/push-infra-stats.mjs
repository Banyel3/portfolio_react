// Runs on the self-hosted box (user crontab, every 5 min) and pushes the
// hero panel's facts to Neon, so the site needs no public endpoint into the
// server. Every value is measured here; anything that can't be measured is
// written as NULL and the site shows "—".
//
//   */5 * * * * cd ~/dev/projects/portfolio_react && node --dns-result-order=ipv4first --env-file=.env scripts/push-infra-stats.mjs
import { execFileSync } from "node:child_process";
import { neon } from "@neondatabase/serverless";

// Origins behind Cloudflare Tunnel (/etc/cloudflared/config.yml), checked
// locally so a service counts only if its own process answers — the public
// hostnames sit behind Cloudflare Access, which replies even when the origin
// is down.
const SERVICES = {
  pondo: "http://127.0.0.1:8321",
  files: "http://127.0.0.1:8081",
  portainer: "http://127.0.0.1:9000",
  cockpit: "http://127.0.0.1:8088",
};

// Share of the last 30 days, per minute, in which netdata recorded the host
// as up. A minute with no sample means the machine was down.
async function uptime30d() {
  const res = await fetch(
    "http://127.0.0.1:19999/api/v1/data?chart=system.uptime&after=-2592000&points=43200&group=max&format=json&options=null2zero",
    { signal: AbortSignal.timeout(15000) },
  );
  const rows = (await res.json()).data;
  return rows.length ? (100 * rows.filter((r) => r[1] > 0).length) / rows.length : null;
}

async function services() {
  const up = await Promise.all(
    Object.values(SERVICES).map((url) =>
      fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5000) })
        .then((r) => r.status < 500)
        .catch(() => false),
    ),
  );
  return up.filter(Boolean).length;
}

// Newest container creation among running containers, skipping the local
// Supabase dev stack (client work, not hosted services). Recreating a
// container is what a deploy does here; a restart keeps the creation time.
function lastDeploy() {
  const ids = execFileSync("docker", ["ps", "-q", "--filter", "status=running"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  if (!ids.length) return null;
  const rows = execFileSync("docker", ["inspect", "-f", "{{.Name}} {{.Created}}", ...ids], { encoding: "utf8" })
    .split("\n")
    .filter((l) => l && !l.startsWith("/supabase_"))
    .map((l) => new Date(l.split(" ")[1]));
  return rows.length ? new Date(Math.max(...rows)) : null;
}

const settle = (p) => Promise.resolve().then(p).catch((e) => (console.error(e.message), null));
const [u, s, d] = await Promise.all([settle(uptime30d), settle(services), settle(lastDeploy)]);

const sql = neon(process.env.DATABASE_URL);
await sql`
  INSERT INTO infra_stats (id, "uptime30d", services, "lastDeploy", "updatedAt")
  VALUES (1, ${u}, ${s}, ${d}, now())
  ON CONFLICT (id) DO UPDATE SET "uptime30d" = EXCLUDED."uptime30d", services = EXCLUDED.services,
    "lastDeploy" = EXCLUDED."lastDeploy", "updatedAt" = EXCLUDED."updatedAt"`;
console.log(new Date().toISOString(), { uptime30d: u, services: s, lastDeploy: d });
