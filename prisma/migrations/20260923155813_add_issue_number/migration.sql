/*
  Warnings:

  - A unique constraint covering the columns `[projectId,number]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Issue_projectId_number_key" ON "Issue"("projectId", "number");
