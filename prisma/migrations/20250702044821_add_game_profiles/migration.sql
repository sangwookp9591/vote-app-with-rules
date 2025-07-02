-- CreateEnum
CREATE TYPE "ValorantTier" AS ENUM ('IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ASCENDANT', 'IMMORTAL', 'RADIANT');

-- CreateEnum
CREATE TYPE "ValorantPosition" AS ENUM ('DUELIST', 'SENTINEL', 'INITIATOR', 'CONTROLLER');

-- CreateTable
CREATE TABLE "LolProfile" (
    "id" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "tier" "LolTier" NOT NULL,
    "rank" INTEGER NOT NULL,
    "position" "LolPosition" NOT NULL,
    "mainChampions" JSONB NOT NULL,
    "winRate" DOUBLE PRECISION,
    "gamesPlayed" INTEGER,

    CONSTRAINT "LolProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValorantProfile" (
    "id" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "tier" "ValorantTier" NOT NULL,
    "position" "ValorantPosition" NOT NULL,
    "mainAgents" JSONB NOT NULL,
    "role" TEXT,
    "winRate" DOUBLE PRECISION,
    "gamesPlayed" INTEGER,

    CONSTRAINT "ValorantProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LolProfile_streamerId_key" ON "LolProfile"("streamerId");

-- CreateIndex
CREATE UNIQUE INDEX "ValorantProfile_streamerId_key" ON "ValorantProfile"("streamerId");

-- AddForeignKey
ALTER TABLE "LolProfile" ADD CONSTRAINT "LolProfile_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "streamers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValorantProfile" ADD CONSTRAINT "ValorantProfile_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "streamers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
