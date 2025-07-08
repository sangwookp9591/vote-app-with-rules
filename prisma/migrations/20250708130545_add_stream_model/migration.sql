-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "streamerId" TEXT NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "viewers" INTEGER NOT NULL DEFAULT 0,
    "streamKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stream_streamKey_key" ON "Stream"("streamKey");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
