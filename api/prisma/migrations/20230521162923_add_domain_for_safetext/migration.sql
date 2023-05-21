/*
  Warnings:

  - Added the required column `domain` to the `SafeText` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SafeText" ADD COLUMN     "domain" TEXT NOT NULL;
