/*
  Warnings:

  - Changed the type of `type` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'FILE');

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "type",
ADD COLUMN     "type" "AttachmentType" NOT NULL;
