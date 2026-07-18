/*
  Warnings:

  - The primary key for the `ChatUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,chatId]` on the table `ChatUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `ChatUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "authId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_userId_chatId_key" ON "ChatUser"("userId", "chatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");
