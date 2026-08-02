/*
  Warnings:

  - You are about to drop the column `image_url` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "image_url",
ADD COLUMN     "avatar_public_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "avatar_url" TEXT NOT NULL DEFAULT '';
