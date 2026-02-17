-- CreateTable
CREATE TABLE "Digest" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "releaseCount" INTEGER NOT NULL DEFAULT 0,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Digest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Digest_period_idx" ON "Digest"("period");

-- CreateIndex
CREATE INDEX "Digest_endDate_idx" ON "Digest"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Digest_period_startDate_key" ON "Digest"("period", "startDate");
