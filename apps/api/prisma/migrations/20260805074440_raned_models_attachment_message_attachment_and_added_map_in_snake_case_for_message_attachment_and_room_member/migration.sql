/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageAttachmentType" AS ENUM ('VIDEO', 'IMAGE', 'AUDIO', 'FILE');

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_message_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_room_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomMember" DROP CONSTRAINT "RoomMember_user_id_fkey";

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "RoomMember";

-- DropEnum
DROP TYPE "AttachmentType";

-- CreateTable
CREATE TABLE "room_member" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),
    "role" "RoomMemberRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "room_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_attachment" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "MessageAttachmentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_member_user_id_room_id_key" ON "room_member"("user_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_attachment_key_key" ON "message_attachment"("key");

-- AddForeignKey
ALTER TABLE "room_member" ADD CONSTRAINT "room_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_member" ADD CONSTRAINT "room_member_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
