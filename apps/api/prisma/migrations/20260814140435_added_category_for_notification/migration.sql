/*
  Warnings:

  - Added the required column `category` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('CHAT', 'EVENTS');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "category" "NotificationCategory" NOT NULL;
