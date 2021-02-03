# Migration `20210127181419-removed-compound-address-symbol-unique`

This migration has been generated by maotora at 1/27/2021, 9:14:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."AccountType" AS ENUM ('BLOCKCHAIN_WALLET', 'TRADITIONAL_BANK', 'TRADITIONAL_BROKERAGE', 'TRADITIONAL_CREDIT', 'CRYPTO_EXCHANGE', 'CRYPTO_SERVICE', 'UNKNOWN')

CREATE TABLE "User" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT E'user',
    "zaboUserId" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "Session" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "userId" INTEGER,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "Institution" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "authType" TEXT NOT NULL DEFAULT E'none',
    "shortName" TEXT NOT NULL,
    "logoURL" TEXT,
    "type" "AccountType" NOT NULL DEFAULT E'UNKNOWN',

    PRIMARY KEY ("id")
)

CREATE TABLE "Account" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "plaidToken" TEXT,
    "type" "AccountType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "zaboAccountId" TEXT,
    "lastSync" TIMESTAMP(3),
    "lastSyncEnd" TIMESTAMP(3),
    "syncStatus" TEXT NOT NULL DEFAULT E'inactive',
    "institutionId" INTEGER,

    PRIMARY KEY ("id")
)

CREATE TABLE "Wallet" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "symbol" TEXT NOT NULL,
    "xpub" TEXT,
    "address" TEXT,
    "accountId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "SubAccount" (
"id" SERIAL,
    "clientAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Holding" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "subAccountId" INTEGER NOT NULL,

    PRIMARY KEY ("assetId","subAccountId")
)

CREATE TABLE "Asset" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT E'0',

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "User.zaboUserId_unique" ON "User"("zaboUserId")

CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle")

CREATE UNIQUE INDEX "Institution.shortName_unique" ON "Institution"("shortName")

CREATE UNIQUE INDEX "Account.zaboAccountId_unique" ON "Account"("zaboAccountId")

CREATE UNIQUE INDEX "Wallet_accountId_unique" ON "Wallet"("accountId")

CREATE UNIQUE INDEX "Asset.symbol_unique" ON "Asset"("symbol")

CREATE UNIQUE INDEX "Asset.address_unique" ON "Asset"("address")

ALTER TABLE "Session" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("institutionId")REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Wallet" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "SubAccount" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("assetId")REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("subAccountId")REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210127163434-removing-zabo..20210127181419-removed-compound-address-symbol-unique
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgres"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -101,16 +101,18 @@
   subAccountId  Int 
   @@id([assetId, subAccountId])
 }
+//- Removed the compound unique on [address, symbol]
+//- It was impossible to use connectOrCreate
+
 model Asset {
   id        Int      @default(autoincrement()) @id
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   name      String   
-  symbol    String
-  address   String  @default("0")
-  @@unique([symbol, address])
+  symbol    String  @unique
+  address   String  @default("0") @unique
 }
 enum AccountType {
   BLOCKCHAIN_WALLET      // Zabo
```

