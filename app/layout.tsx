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

export const metadata: Metadata = {
  title: "Main Branch",
  description: "Mantente al día con los últimos lanzamientos y actualizaciones de tecnologías",
  alternates: {
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
