/*
  Warnings:

  - Added the required column `teamSize` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GameType" ADD VALUE 'CS2';
ALTER TYPE "GameType" ADD VALUE 'DOTA2';

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "teamSize" INTEGER NOT NULL;
