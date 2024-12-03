-- DropIndex
DROP INDEX "Like_twiddleId_profileId_idx";

-- DropIndex
DROP INDEX "Twiddle_authorId_deletedAt_idx";

-- DropIndex
DROP INDEX "User_email_deletedAt_idx";

-- CreateIndex
CREATE INDEX "Like_twiddleId_idx" ON "Like"("twiddleId");

-- CreateIndex
CREATE INDEX "Like_profileId_idx" ON "Like"("profileId");

-- CreateIndex
CREATE INDEX "Twiddle_authorId_idx" ON "Twiddle"("authorId");

-- CreateIndex
CREATE INDEX "Twiddle_deletedAt_idx" ON "Twiddle"("deletedAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
