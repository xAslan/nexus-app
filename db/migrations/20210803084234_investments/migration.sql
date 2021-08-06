-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('WITHDRAWAL', 'TRADE', 'DEPOSIT', 'DIGITAL', 'PLACE', 'SPECIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('CRYPTO', 'FIAT', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BLOCKCHAIN_WALLET', 'TRADITIONAL_BANK', 'TRADITIONAL_BROKERAGE', 'TRADITIONAL_CREDIT', 'CRYPTO_EXCHANGE', 'CRYPTO_SERVICE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT,
    "role" TEXT NOT NULL DEFAULT E'user',
    "profile_img_url" TEXT,
    "plaid_token" TEXT,
    "zabo_user_obj" JSONB,
    "address" TEXT,
    "phone" TEXT,
    "primary_currency" TEXT NOT NULL DEFAULT E'USD',
    "secondary_currency" TEXT NOT NULL DEFAULT E'GBP',

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
    "userId" INTEGER,
    "zabo_account_id" TEXT,
    "last_sync" TIMESTAMP(3),
    "sync_status" TEXT NOT NULL DEFAULT E'inactive',
    "institutionId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balanceDate" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountId" INTEGER NOT NULL,

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
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "sub_account_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AssetType" NOT NULL DEFAULT E'OTHER',
    "sub_type" TEXT,
    "symbol" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT E'0',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcation" (
    "id" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" INTEGER NOT NULL,
    "amount_received" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount_sent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency_received" TEXT,
    "currency_sent" TEXT,
    "trx_type" "TransactionType" NOT NULL DEFAULT E'OTHER',
    "parties" JSONB,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session.handle_unique" ON "session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "institution.short_name_unique" ON "institution"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "dateAccountIdBalance" ON "Balance"("balanceDate", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_account_id_unique" ON "wallet"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "subAccountUniqAsset" ON "holding"("asset_id", "sub_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "symbolAddress" ON "asset"("symbol", "address");

-- AddForeignKey
ALTER TABLE "session" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_account" ADD FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holding" ADD FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holding" ADD FOREIGN KEY ("sub_account_id") REFERENCES "sub_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcation" ADD FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
