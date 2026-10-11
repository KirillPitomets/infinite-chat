/*
  Warnings:

  - You are about to drop the `roomUser` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('DIRECT', 'GROUP');

-- DropForeignKey
ALTER TABLE "roomUser" DROP CONSTRAINT "roomUser_room_id_fkey";

-- DropForeignKey
ALTER TABLE "roomUser" DROP CONSTRAINT "roomUser_user_id_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "type",
ADD COLUMN     "type" "RoomType" NOT NULL;

-- DropTable
DROP TABLE "roomUser";

-- DropEnum
DROP TYPE "roomType";

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_user_id_room_id_key" ON "RoomUser"("user_id", "room_id");

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
