import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The CMS has no auth gate. Blocking only the /cms UI would be theatre: every
// /api/<entity> route is an unauthenticated create/update/delete, and the
// upload routes hold the Supabase service-role key. So this gates the whole
// admin surface at one choke point that runs before any matched route.
//
// "Local only" is decided by NODE_ENV, not by the Host header — a header is
// attacker-controlled, an env var baked into the build is not. `pnpm dev` is
// development and gets the CMS; every deployed build is production and 404s.
// (An env-var escape hatch for local production builds is not possible here:
// Next inlines process.env into the proxy bundle at build time, so it could
// only be flipped by rebuilding — use `pnpm dev` to reach the CMS instead.)
//
// Blocked requests get 404, not 403 — no reason to advertise that the route
// exists. Real auth is what would let the CMS be reachable in production.

// Public API surface: everything else under /api is CMS-only.
const PUBLIC_API = ["/api/contact", "/api/public"];

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (PUBLIC_API.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/cms", "/cms/:path*", "/api/:path*"],
};
