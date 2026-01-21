-- AlterTable
ALTER TABLE "PredictionHistory" RENAME CONSTRAINT "PredicionHistory_pkey" TO "PredictionHistory_pkey";

-- RenameForeignKey
ALTER TABLE "PredictionHistory" RENAME CONSTRAINT "PredicionHistory_deckId_fkey" TO "PredictionHistory_deckId_fkey";

-- RenameForeignKey
ALTER TABLE "PredictionHistory" RENAME CONSTRAINT "PredicionHistory_fortuneTellerId_fkey" TO "PredictionHistory_fortuneTellerId_fkey";

-- RenameForeignKey
ALTER TABLE "PredictionHistory" RENAME CONSTRAINT "PredicionHistory_userId_fkey" TO "PredictionHistory_userId_fkey";
