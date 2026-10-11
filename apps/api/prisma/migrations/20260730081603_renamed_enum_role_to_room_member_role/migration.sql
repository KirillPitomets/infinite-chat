/*
  Warnings:

  - The `role` column on the `RoomMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "RoomMember" DROP COLUMN "role",
ADD COLUMN     "role" "RoomMemberRole" NOT NULL DEFAULT 'MEMBER';

-- DropEnum
DROP TYPE "Role";
