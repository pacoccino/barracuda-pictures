-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TagsOnImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "TagsOnImage_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagsOnImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TagsOnImage" ("id", "imageId", "tagId") SELECT "id", "imageId", "tagId" FROM "TagsOnImage";
DROP TABLE "TagsOnImage";
ALTER TABLE "new_TagsOnImage" RENAME TO "TagsOnImage";
CREATE UNIQUE INDEX "TagsOnImage_tagId_imageId_key" ON "TagsOnImage"("tagId", "imageId");
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tagGroupId" INTEGER NOT NULL,
    CONSTRAINT "Tag_tagGroupId_fkey" FOREIGN KEY ("tagGroupId") REFERENCES "TagGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("id", "name", "tagGroupId") SELECT "id", "name", "tagGroupId" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
