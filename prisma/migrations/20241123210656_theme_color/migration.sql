/*
  Warnings:

  - You are about to drop the column `colorTheme` on the `InterfaceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `InterfaceSettings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ThemeColor" AS ENUM ('DEFAULT', 'GREEN', 'VIOLET');

-- AlterTable
ALTER TABLE "InterfaceSettings" DROP COLUMN "colorTheme",
DROP COLUMN "theme",
ADD COLUMN     "themeColor" "ThemeColor" NOT NULL DEFAULT 'DEFAULT',
ADD COLUMN     "themeMode" "ThemeMode" NOT NULL DEFAULT 'SYSTEM';

-- DropEnum
DROP TYPE "ColorTheme";

-- DropEnum
DROP TYPE "Theme";
