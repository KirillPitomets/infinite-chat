-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "system_content" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'USER';
