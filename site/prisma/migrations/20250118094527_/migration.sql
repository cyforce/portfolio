-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Competence" ("description", "id", "imageUrl", "level", "name") SELECT "description", "id", "imageUrl", "level", "name" FROM "Competence";
DROP TABLE "Competence";
ALTER TABLE "new_Competence" RENAME TO "Competence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
