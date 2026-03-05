import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";
const SITE_DESCRIPTION =
  "Tu fuente centralizada de noticias, releases y tendencias en tecnología. Changelogs, breaking changes, noticias AI y guías de migración en un solo lugar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Main Branch — Hub de Tecnología",
    template: "%s — Main Branch",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "releases",
    "changelogs",
    "next.js",
    "react",
    "typescript",
    "node.js",
    "ai",
    "llm",
    "noticias ai",
    "hub tecnología",
    "breaking changes",
    "tech updates",
    "developer news",
  ],
  authors: [{ name: "Main Branch", url: SITE_URL }],
  creator: "Main Branch",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "Main Branch",
    title: "Main Branch — Hub de Tecnología",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Main Branch — Hub de Tecnología",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Main Branch — Hub de Tecnología",
    description: SITE_DESCRIPTION,
    creator: "@mainbranch_dev",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Main Branch — Todos los Releases" },
        { url: "/feed/breaking", title: "Main Branch — Breaking Changes" },
        { url: "/feed/high-impact", title: "Main Branch — Alto Impacto" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NotificationProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
