-- CreateEnum
CREATE TYPE "SnsType" AS ENUM ('INSTA', 'FACEBOOK', 'YOUTUBE');

-- CreateTable
CREATE TABLE "Sns" (
    "id" TEXT NOT NULL,
    "type" "SnsType" NOT NULL,
    "url" TEXT NOT NULL,
    "streamerId" TEXT NOT NULL,

    CONSTRAINT "Sns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sns" ADD CONSTRAINT "Sns_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "streamers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
