import type React from "react";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import PageLoader from "@/components/page-loader";
import { SITE_URL, PERSON } from "@/lib/constants";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const TITLE = "Vaniel Cornelio — Backend Developer & Cloud Engineer";
const DESCRIPTION =
  "Backend developer and cloud engineer building and operating self-hosted cloud infrastructure — Linux, Docker, Nginx, Cloudflare Tunnel, and secure deployments.";

export const metadata: Metadata = {
  // metadataBase resolves every relative OG/Twitter image URL below. Without it
  // Next emits relative paths that no social crawler can fetch.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Case studies set their own title; this keeps the brand suffix consistent.
    template: "%s — Vaniel Cornelio",
  },
  description: DESCRIPTION,
  applicationName: "Vaniel Cornelio",
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Vaniel Cornelio",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    // app/og/route.tsx renders the card. It is a plain route, not the
    // opengraph-image file convention: that convention overrides these fields
    // and resolves against the runtime origin, which would pin the card to a
    // Vercel deployment URL instead of the canonical domain.
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} font-body antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider>
          <PageLoader />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
