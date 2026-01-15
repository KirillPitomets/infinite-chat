/*
  Warnings:

  - Made the column `name` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Group Chat';
