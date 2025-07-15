-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "maxViewers" INTEGER,
ADD COLUMN     "totalViewers" INTEGER;

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamerVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamerVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follower_userId_streamerId_key" ON "Follower"("userId", "streamerId");

-- CreateIndex
CREATE UNIQUE INDEX "StreamerVote_userId_streamerId_key" ON "StreamerVote"("userId", "streamerId");

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamerVote" ADD CONSTRAINT "StreamerVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamerVote" ADD CONSTRAINT "StreamerVote_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
