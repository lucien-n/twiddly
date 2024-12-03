/*
  Warnings:

  - Added the required column `status` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "status" "FollowStatus" NOT NULL;
