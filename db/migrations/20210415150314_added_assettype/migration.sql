-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('CRYPTO', 'FIAT', 'STOCK', 'OTHER');

-- AlterTable
ALTER TABLE "asset" ADD COLUMN     "type" "AssetType" NOT NULL DEFAULT E'OTHER';

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
