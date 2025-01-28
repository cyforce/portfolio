/*
  Warnings:

  - Added the required column `description` to the `Competence` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_CompetenceToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetenceToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Competence" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetenceToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Competence" ("id", "imageUrl", "level", "name") SELECT "id", "imageUrl", "level", "name" FROM "Competence";
DROP TABLE "Competence";
ALTER TABLE "new_Competence" RENAME TO "Competence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CompetenceToProject_AB_unique" ON "_CompetenceToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetenceToProject_B_index" ON "_CompetenceToProject"("B");
