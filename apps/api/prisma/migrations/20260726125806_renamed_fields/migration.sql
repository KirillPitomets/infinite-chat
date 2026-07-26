/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tag]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tag` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerk_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tag" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ChatType" NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Group Chat',
    "image_url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "content" TEXT,
    "reply_to_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_user_id_chat_id_key" ON "ChatUser"("user_id", "chat_id");

-- CreateIndex
CREATE INDEX "Message_chat_id_created_at_idx" ON "Message"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "Message"("sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_key_key" ON "Attachment"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_tag_key" ON "User"("tag");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_reply_to_message_id_fkey" FOREIGN KEY ("reply_to_message_id") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
