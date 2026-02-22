import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainbranch.cl";

export const metadata: Metadata = {
  title: "Noticias AI",
  description:
    "Las últimas noticias de inteligencia artificial: OpenAI, Claude, Gemini, DeepSeek, Grok y más. Curadas de TechCrunch, VentureBeat y AI News.",
  openGraph: {
    title: "Noticias AI — Main Branch",
    description:
      "Noticias de inteligencia artificial curadas de los principales medios tech.",
    url: `${SITE_URL}/noticias`,
  },
  alternates: { canonical: `${SITE_URL}/noticias` },
};

export const revalidate = 3600;

import { Suspense } from "react";
import { getNews } from "@/lib/data/news";
import NewsClient from "./NewsClient";

export default async function NoticiasPage() {
  const articles = await getNews();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center bg-gray-50 dark:bg-gray-950">
          <p className="text-gray-600 dark:text-gray-400">Cargando noticias...</p>
        </div>
      }
    >
      <NewsClient initialArticles={articles} />
    </Suspense>
  );
}
