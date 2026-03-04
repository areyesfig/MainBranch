import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mainbranch.cl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/releases`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/timeline`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/digest`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Páginas dinámicas de releases
  let releasePages: MetadataRoute.Sitemap = [];
  try {
    const releases = await prisma.release.findMany({
      select: { id: true, updatedAt: true, breakingChange: true },
      orderBy: { releaseDate: "desc" },
    });

    releasePages = releases.map((r) => ({
      url: `${SITE_URL}/releases/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      // Breaking changes tienen más prioridad
      priority: r.breakingChange ? 0.85 : 0.75,
    }));
  } catch {
    // Si la BD falla, el sitemap sigue funcionando con las páginas estáticas
  }

  return [...staticPages, ...releasePages];
}
