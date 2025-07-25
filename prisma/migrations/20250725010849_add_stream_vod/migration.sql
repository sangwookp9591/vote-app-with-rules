-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "vodDuration" INTEGER,
ADD COLUMN     "vodUrl" TEXT,
ADD COLUMN     "vodVisible" BOOLEAN NOT NULL DEFAULT true;
