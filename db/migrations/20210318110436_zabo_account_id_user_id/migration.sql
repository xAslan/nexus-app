/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[zabo_account_id,userId]` on the table `account`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "account.zabo_account_id_unique";

-- CreateIndex
CREATE UNIQUE INDEX "zaboAccountIdUserId" ON "account"("zabo_account_id", "userId");
