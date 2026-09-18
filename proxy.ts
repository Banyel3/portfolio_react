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

// Unknown URLs are redirected home. Doing it here rather than from a page is
// what makes it a real 307: a redirect() inside a page renders through the
// streaming root layout, and Next can only emit 200 + <meta refresh> once the
// stream has started — which would serve homepage content under a success
// status at every junk URL.
//
// MAINTENANCE: adding a new top-level PAGE route means adding it here, or it
// will redirect home. Files are matched generically by extension, so assets and
// metadata routes (/sitemap.xml, /robots.txt, /llms.txt, the PDF, favicons)
// need no upkeep.
const PAGE_ROUTES = ["/work/", "/cms"];
const EXACT_ROUTES = new Set(["/", "/og"]);
// Asset extensions only — a bare /\.\w+$/ would treat probes like
// /wp-login.php as real routes and let them through instead of redirecting.
const ASSET_FILE = /\.(pdf|svg|png|jpe?g|webp|avif|ico|txt|xml|json|webmanifest|woff2?)$/i;

function isKnownRoute(pathname: string) {
  return (
    EXACT_ROUTES.has(pathname) ||
    PAGE_ROUTES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/") ||
    ASSET_FILE.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unknown URL: home, in every environment, before anything renders.
  if (!isKnownRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  if (PUBLIC_API.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // /cms is a page a person could land on, so send them home like any other
  // route they are not allowed to see. /api/* stays a 404: those are machine
  // endpoints, and redirecting a fetch to an HTML page just turns a clean
  // failure into a confusing parse error.
  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/api/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Everything else is a real page: let it render. (This matcher covers the
  // whole site, so anything that falls through to here must pass through —
  // returning 404 here would blank the entire site.)
  return NextResponse.next();
}

export const config = {
  // Everything except Next's own build output, so the unknown-route check above
  // sees all real requests. isKnownRoute() lets public/ files through.
  matcher: ["/((?!_next).*)"],
};
