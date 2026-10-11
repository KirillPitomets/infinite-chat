/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdByUserId` on the `Room` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('VIDEO', 'IMAGE', 'AUDIO', 'FILE');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "type",
ADD COLUMN     "type" "AttachmentType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "createdByUserId",
ADD COLUMN     "created_by_user_id" TEXT;

-- AlterTable
ALTER TABLE "RoomMember" ADD COLUMN     "left_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Message_reply_to_message_id_idx" ON "Message"("reply_to_message_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
