-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GAME', 'RADIO', 'SPORTS');

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "categoryDetail" TEXT NOT NULL DEFAULT 'ETC',
ADD COLUMN     "categoryType" "CategoryType" NOT NULL DEFAULT 'GAME';
