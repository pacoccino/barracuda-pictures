-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "dateTaken" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagCategoryId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnImage" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "TagsOnImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_path_key" ON "Image"("path");

-- CreateIndex
CREATE UNIQUE INDEX "TagCategory_name_key" ON "TagCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_tagCategoryId_key" ON "Tag"("name", "tagCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnImage_tagId_imageId_key" ON "TagsOnImage"("tagId", "imageId");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tagCategoryId_fkey" FOREIGN KEY ("tagCategoryId") REFERENCES "TagCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnImage" ADD CONSTRAINT "TagsOnImage_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnImage" ADD CONSTRAINT "TagsOnImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
