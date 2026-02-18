-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "tweeted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "votes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Release_votes_idx" ON "Release"("votes");
