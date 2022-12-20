/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `TagCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TagCategoryType" AS ENUM ('PERSON');

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "meta" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "TagCategory" ADD COLUMN     "type" "TagCategoryType";

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonsOnImage" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "PersonsOnImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonsOnImage_personId_imageId_key" ON "PersonsOnImage"("personId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "TagCategory_type_key" ON "TagCategory"("type");

-- AddForeignKey
ALTER TABLE "PersonsOnImage" ADD CONSTRAINT "PersonsOnImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonsOnImage" ADD CONSTRAINT "PersonsOnImage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
