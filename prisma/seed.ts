/**
 * Seed de la base de datos - Pobla con datos mock iniciales
 *
 * Ejecutar: npx prisma db seed
 * o: npm run db:seed
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { mockReleases } from "../lib/mockData";

const SOURCE_ID = "seed";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Iniciando seed...");

  let created = 0;
  const errors: string[] = [];

  for (const release of mockReleases) {
    try {
      await prisma.release.upsert({
        where: {
          technology_version: {
            technology: release.technology,
            version: release.version,
          },
        },
        create: {
          sourceId: SOURCE_ID,
          technology: release.technology,
          version: release.version,
          releaseDate: new Date(release.releaseDate),
          tldr: release.tldr,
          description: release.description ?? "",
          breakingChange: release.breakingChange ?? false,
          features: release.features ? JSON.stringify(release.features) : null,
          improvements: release.improvements ? JSON.stringify(release.improvements) : null,
          bugFixes: release.bugFixes ? JSON.stringify(release.bugFixes) : null,
          breakingChanges: release.breakingChanges ? JSON.stringify(release.breakingChanges) : null,
          officialUrl: release.officialUrl ?? null,
          tags: release.tags ? JSON.stringify(release.tags) : null,
          stack: release.stack ?? null,
          category: release.category ?? null,
          previousVersion: release.previousVersion ?? null,
          estimatedMigrationTime: release.estimatedMigrationTime ?? null,
          migrationComplexity: release.migrationComplexity ?? null,
        },
        update: {
          tldr: release.tldr,
          description: release.description ?? "",
          breakingChange: release.breakingChange ?? false,
          features: release.features ? JSON.stringify(release.features) : null,
          improvements: release.improvements ? JSON.stringify(release.improvements) : null,
          bugFixes: release.bugFixes ? JSON.stringify(release.bugFixes) : null,
          breakingChanges: release.breakingChanges ? JSON.stringify(release.breakingChanges) : null,
          officialUrl: release.officialUrl ?? null,
          tags: release.tags ? JSON.stringify(release.tags) : null,
          stack: release.stack ?? null,
          category: release.category ?? null,
        },
      });
      created++;
      console.log(`  ✓ ${release.technology} ${release.version}`);
    } catch (error) {
      const msg = `${release.technology} ${release.version}: ${error instanceof Error ? error.message : "Error"}`;
      errors.push(msg);
      console.error(`  ✗ ${msg}`);
    }
  }

  await prisma.$disconnect();

  console.log(`\n✅ Seed completado: ${created}/${mockReleases.length} releases`);
  if (errors.length > 0) {
    console.warn(`⚠️ Errores: ${errors.length}`);
  }
}

main().catch((e) => {
  console.error("❌ Error en seed:", e);
  process.exit(1);
});
