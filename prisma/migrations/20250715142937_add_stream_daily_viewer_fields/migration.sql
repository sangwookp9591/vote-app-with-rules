-- CreateTable
CREATE TABLE "StreamDailyViewers" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "StreamDailyViewers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StreamDailyViewers_streamId_date_key" ON "StreamDailyViewers"("streamId", "date");

-- AddForeignKey
ALTER TABLE "StreamDailyViewers" ADD CONSTRAINT "StreamDailyViewers_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
