-- CreateEnum
CREATE TYPE "AvatarBackgroundColor" AS ENUM ('LIGTH_BLUE', 'THISTLE', 'LAVENDER', 'MISTYROSE', 'PEACH', 'LIME');

-- CreateEnum
CREATE TYPE "ColorTheme" AS ENUM ('DEFAULT', 'GREEN', 'VIOLET');

-- CreateEnum
CREATE TYPE "MaintenanceMode" AS ENUM ('OPEN', 'VERIFIED', 'ADMIN', 'LOCKED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateTable
CREATE TABLE "EmailVerificationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmailVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandleBlacklist" (
    "handle" TEXT NOT NULL,

    CONSTRAINT "HandleBlacklist_pkey" PRIMARY KEY ("handle")
);

-- CreateTable
CREATE TABLE "InterfaceSettings" (
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "colorTheme" "ColorTheme" NOT NULL DEFAULT 'DEFAULT',
    "profileId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Like" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "twiddleId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PrivacySettings" (
    "private" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatarBackgroundColor" "AvatarBackgroundColor",
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "maintenanceMode" "MaintenanceMode" NOT NULL DEFAULT 'OPEN'
);

-- CreateTable
CREATE TABLE "Twiddle" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" TIMESTAMP(3),
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Twiddle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationCode_userId_key" ON "EmailVerificationCode"("userId");

-- CreateIndex
CREATE INDEX "EmailVerificationCode_userId_idx" ON "EmailVerificationCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HandleBlacklist_handle_key" ON "HandleBlacklist"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "InterfaceSettings_profileId_key" ON "InterfaceSettings"("profileId");

-- CreateIndex
CREATE INDEX "InterfaceSettings_profileId_idx" ON "InterfaceSettings"("profileId");

-- CreateIndex
CREATE INDEX "Like_twiddleId_profileId_idx" ON "Like"("twiddleId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_twiddleId_profileId_key" ON "Like"("twiddleId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacySettings_profileId_key" ON "PrivacySettings"("profileId");

-- CreateIndex
CREATE INDEX "PrivacySettings_profileId_idx" ON "PrivacySettings"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");

-- CreateIndex
CREATE INDEX "Profile_handle_idx" ON "Profile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_maintenanceMode_key" ON "SiteSettings"("maintenanceMode");

-- CreateIndex
CREATE INDEX "Twiddle_authorId_deletedAt_idx" ON "Twiddle"("authorId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_deletedAt_idx" ON "User"("email", "deletedAt");

-- AddForeignKey
ALTER TABLE "EmailVerificationCode" ADD CONSTRAINT "EmailVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterfaceSettings" ADD CONSTRAINT "InterfaceSettings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_twiddleId_fkey" FOREIGN KEY ("twiddleId") REFERENCES "Twiddle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacySettings" ADD CONSTRAINT "PrivacySettings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twiddle" ADD CONSTRAINT "Twiddle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twiddle" ADD CONSTRAINT "Twiddle_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Twiddle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
