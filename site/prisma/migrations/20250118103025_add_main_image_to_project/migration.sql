/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Competence` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Project` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProjectImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProjectImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imagePrincId" INTEGER,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Competence_imagePrincId_fkey" FOREIGN KEY ("imagePrincId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Competence" ("description", "id", "level", "name") SELECT "description", "id", "level", "name" FROM "Competence";
DROP TABLE "Competence";
ALTER TABLE "new_Competence" RENAME TO "Competence";
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imagePrincId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Project_imagePrincId_fkey" FOREIGN KEY ("imagePrincId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("category", "createdAt", "description", "id", "templateId", "title") SELECT "category", "createdAt", "description", "id", "templateId", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectImages_AB_unique" ON "_ProjectImages"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectImages_B_index" ON "_ProjectImages"("B");
