/**
 * Script para traducir retroactivamente noticias sin titleEs/summaryEs.
 * Uso: npx tsx scripts/translate-news.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { translateNewsArticle } from "../lib/ai/translateNews";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY no configurada");
    process.exit(1);
  }

  const articles = await prisma.newsArticle.findMany({
    where: { titleEs: null },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  console.log(`Artículos sin traducción: ${articles.length}`);

  let translated = 0;
  for (const article of articles) {
    try {
      const { titleEs, summaryEs } = await translateNewsArticle(
        article.title,
        article.summary,
        apiKey
      );
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { titleEs, summaryEs },
      });
      translated++;
      console.log(`[${translated}/${articles.length}] ✓ ${article.title.slice(0, 60)}`);
    } catch (err) {
      console.error(`✗ ${article.title.slice(0, 60)}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nTraducidos: ${translated}/${articles.length}`);
  await prisma.$disconnect();
}

main();
