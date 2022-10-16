/*
  Warnings:

  - You are about to drop the column `userId` on the `favs` table. All the data in the column will be lost.
  - Added the required column `listId` to the `favs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "favs" DROP CONSTRAINT "favs_userId_fkey";

-- AlterTable
ALTER TABLE "favs" DROP COLUMN "userId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playlist_name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favs" ADD CONSTRAINT "favs_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
