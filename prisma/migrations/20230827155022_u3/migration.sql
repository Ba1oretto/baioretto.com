/*
  Warnings:

  - You are about to drop the column `created_at` on the `post` table. All the data in the column will be lost.
  - Added the required column `excerpt` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "created_at",
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
