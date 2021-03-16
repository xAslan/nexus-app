/*
  Warnings:

  - You are about to drop the column `plaidToken` on the `Account` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[zaboAccountId,userId]` on the table `Account`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "Account.zaboAccountId_unique";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "plaidToken",
ADD COLUMN     "plaidItemId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plaidToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account.zaboAccountId_userId_unique" ON "Account"("zaboAccountId", "userId");
