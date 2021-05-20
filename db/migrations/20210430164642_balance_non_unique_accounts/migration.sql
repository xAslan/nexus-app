/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[balanceDate,accountId]` on the table `Balance`. If there are existing duplicate values, the migration will fail.
  - Added the required column `balanceDate` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "zaboAccountIdUserId";

-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "balanceDate" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dateAccountIdBalance" ON "Balance"("balanceDate", "accountId");
