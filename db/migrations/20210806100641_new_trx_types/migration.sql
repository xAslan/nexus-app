/*
  Warnings:

  - The values [WITHDRAWAL,TRADE,DIGITAL,PLACE,SPECIAL] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('DEPOSIT', 'FEE', 'ONLINE', 'STORE', 'OTHER');
ALTER TABLE "transcation" ALTER COLUMN "trx_type" DROP DEFAULT;
ALTER TABLE "transcation" ALTER COLUMN "trx_type" TYPE "TransactionType_new" USING ("trx_type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
ALTER TABLE "transcation" ALTER COLUMN "trx_type" SET DEFAULT 'OTHER';
COMMIT;
