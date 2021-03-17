/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Holding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Institution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_subAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubAccount" DROP CONSTRAINT "SubAccount_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_accountId_fkey";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT,
    "role" TEXT NOT NULL DEFAULT E'user',
    "plaid_token" TEXT,
    "zabo_user_obj" JSONB,
    "primary_currency" TEXT NOT NULL DEFAULT E'USD',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "userId" INTEGER,
    "hashed_session_token" TEXT,
    "anti_csrf_token" TEXT,
    "pulic_data" TEXT,
    "private_data" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "auth_type" TEXT NOT NULL DEFAULT E'none',
    "short_name" TEXT NOT NULL,
    "logo_url" TEXT,
    "type" "AccountType" NOT NULL DEFAULT E'UNKNOWN',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "zabo_token" TEXT,
    "plaid_item_id" TEXT,
    "type" "AccountType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "zabo_account_id" TEXT,
    "last_sync" TIMESTAMP(3),
    "last_sync_end" TIMESTAMP(3),
    "sync_status" TEXT NOT NULL DEFAULT E'inactive',
    "institutionId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "symbol" TEXT NOT NULL,
    "xpub" TEXT,
    "address" TEXT,
    "account_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_account" (
    "id" SERIAL NOT NULL,
    "client_account_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holding" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fiat_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sub_account_id" INTEGER NOT NULL,

    PRIMARY KEY ("asset_id","sub_account_id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT E'0',

    PRIMARY KEY ("id")
);

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "Holding";

-- DropTable
DROP TABLE "Institution";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SubAccount";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Wallet";

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session.handle_unique" ON "session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "institution.short_name_unique" ON "institution"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "account.zabo_account_id_userId_unique" ON "account"("zabo_account_id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_account_id_unique" ON "wallet"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "symbolAddress" ON "asset"("symbol", "address");

-- AddForeignKey
ALTER TABLE "session" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_account" ADD FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holding" ADD FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holding" ADD FOREIGN KEY ("sub_account_id") REFERENCES "sub_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
