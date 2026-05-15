import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollRevealInit from "@/components/scroll-reveal-init";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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

export const metadata: Metadata = {
  title: "Vaniel Cornelio — Backend Developer & Cloud Engineer",
  description:
    "Backend developer and cloud engineer building and operating self-hosted cloud infrastructure — Linux, Docker, Nginx, Cloudflare Tunnel, and secure deployments.",
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
        className={`${spaceGrotesk.variable} ${inter.variable} font-body antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollRevealInit />
        <Analytics />
      </body>
    </html>
  );
}
