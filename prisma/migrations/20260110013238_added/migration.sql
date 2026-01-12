/*
  Warnings:

  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatTpye" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" "ChatTpye" NOT NULL;
