/*
  Warnings:

  - You are about to drop the column `author` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatUser" ADD COLUMN     "lastReadAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "author",
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Message_chatId_createdAt_idx" ON "Message"("chatId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
