/*
  Warnings:

  - You are about to drop the column `category` on the `Competence` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Competence` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Competence` table. All the data in the column will be lost.
  - Added the required column `level` to the `Competence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Competence` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "level" INTEGER NOT NULL
);
INSERT INTO "new_Competence" ("id", "imageUrl") SELECT "id", "imageUrl" FROM "Competence";
DROP TABLE "Competence";
ALTER TABLE "new_Competence" RENAME TO "Competence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
