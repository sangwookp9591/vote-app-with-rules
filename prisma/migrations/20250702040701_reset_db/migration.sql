/*
  Warnings:

  - You are about to drop the column `streamerId` on the `tournaments` table. All the data in the column will be lost.
  - Added the required column `hostId` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tournaments" DROP CONSTRAINT "tournaments_streamerId_fkey";

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "streamerId",
ADD COLUMN     "hostId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
