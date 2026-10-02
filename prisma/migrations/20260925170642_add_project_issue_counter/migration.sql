-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "nextIssueNumber" INTEGER NOT NULL DEFAULT 1;
UPDATE "Project" AS p
SET "nextIssueNumber" = COALESCE(
  (
    SELECT MAX(i."number") + 1
    FROM "Issue" AS i
    WHERE i."projectId" = p."id"
  ),
  1
);
