/*
  Warnings:

  - You are about to drop the column `plaid_account_id` on the `sub_account` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'DIGITAL';
ALTER TYPE "TransactionType" ADD VALUE 'PLACE';
ALTER TYPE "TransactionType" ADD VALUE 'SPECIAL';

-- AlterTable
ALTER TABLE "sub_account" DROP COLUMN "plaid_account_id";
