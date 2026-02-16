-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "tldr" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "breakingChange" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT,
    "improvements" TEXT,
    "bugFixes" TEXT,
    "breakingChanges" TEXT,
    "officialUrl" TEXT,
    "tags" TEXT,
    "stack" TEXT,
    "category" TEXT,
    "previousVersion" TEXT,
    "estimatedMigrationTime" INTEGER,
    "migrationComplexity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Release_stack_idx" ON "Release"("stack");

-- CreateIndex
CREATE INDEX "Release_category_idx" ON "Release"("category");

-- CreateIndex
CREATE INDEX "Release_releaseDate_idx" ON "Release"("releaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "Release_technology_version_key" ON "Release"("technology", "version");
