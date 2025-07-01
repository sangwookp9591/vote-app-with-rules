/*
  Warnings:

  - Added the required column `gameType` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('LOL', 'PUBG', 'OVERWATCH', 'VALORANT', 'ETC');

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "formSchema" JSONB,
ADD COLUMN     "gameType" "GameType" NOT NULL;

-- CreateTable
CREATE TABLE "tournament_applications" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameData" JSONB NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournament_applications" ADD CONSTRAINT "tournament_applications_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_applications" ADD CONSTRAINT "tournament_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
