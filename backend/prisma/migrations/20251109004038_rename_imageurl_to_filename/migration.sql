/*
  Warnings:

  - You are about to drop the column `image_url` on the `general_foods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "general_foods" DROP COLUMN "image_url",
ADD COLUMN     "image_filename" TEXT;
