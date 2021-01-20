# Migration `20210120103401-init-migration`

This migration has been generated at 1/20/2021, 10:34:01 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."AccountType" AS ENUM ('BLOCKCHAIN_WALLET', 'TRADITIONAL_BANK', 'TRADITIONAL_BROKERAGE', 'TRADITIONAL_CREDIT', 'CRYPTO_EXCHANGE', 'CRYPTO_SERVICE')

CREATE TABLE "User" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT E'user',

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
    "type" TEXT NOT NULL DEFAULT E'unknown',

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
    "addressId" INTEGER,
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

CREATE TABLE "Address" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Holding" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbolId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "subAccountId" INTEGER NOT NULL,

    PRIMARY KEY ("symbolId","subAccountId")
)

CREATE TABLE "Symbol" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "address" TEXT,

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle")

CREATE UNIQUE INDEX "Institution.name_unique" ON "Institution"("name")

CREATE UNIQUE INDEX "Wallet_addressId_unique" ON "Wallet"("addressId")

CREATE UNIQUE INDEX "Wallet_accountId_unique" ON "Wallet"("accountId")

CREATE UNIQUE INDEX "Symbol.symbol_address_unique" ON "Symbol"("symbol", "address")

ALTER TABLE "Session" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("institutionId")REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Wallet" ADD FOREIGN KEY("addressId")REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Wallet" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "SubAccount" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("symbolId")REFERENCES "Symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("subAccountId")REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20210120103401-init-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,130 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgres"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+// --------------------------------------
+
+model User {
+  id             Int       @default(autoincrement()) @id
+  createdAt      DateTime  @default(now())
+  updatedAt      DateTime  @updatedAt
+  name           String?
+  email          String    @unique
+  hashedPassword String?
+  role           String    @default("user")
+  sessions       Session[]
+}
+
+model Session {
+  id                 Int       @default(autoincrement()) @id
+  createdAt          DateTime  @default(now())
+  updatedAt          DateTime  @updatedAt
+  expiresAt          DateTime?
+  handle             String    @unique
+  user               User?     @relation(fields: [userId], references: [id])
+  userId             Int?
+  hashedSessionToken String?
+  antiCSRFToken      String?
+  publicData         String?
+  privateData        String?
+}
+
+model Institution {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String   @unique // display name
+  authType  String   @default("none")
+  shortName String   // shortcode for institution make into enum and save in DB
+  type      String   @default("unknown") // traditional, brokerage, bank, crypto_exchange, etc. make this into an ENUM and save in DB
+}
+
+model Account {
+  id          Int          @default(autoincrement()) @id
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @updatedAt
+  name        String       // display name for account
+  apiKey      String?      
+  apiSecret   String?
+  plaidToken  String?      
+  institution Institution? 
+  type        AccountType       //manual, blockchain_wallet, institution, defi ENUM
+  wallet      Wallet?
+  subAccounts SubAccount[]    
+  user        User         @relation(fields: [userId], references: [id])
+  userId      Int          
+  lastSync    DateTime?
+  lastSyncEnd DateTime?
+  syncStatus  String       @default("inactive")
+}
+
+model Wallet {
+  id        Int       @default(autoincrement()) @id
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  symbol    String    
+  xpub      String?   
+  address   Address?  @relation(fields: [addressId], references: [id])
+  addressId Int?
+  account   Account   @relation(fields: [accountId], references: [id])
+  accountId Int       
+}
+
+model SubAccount {
+  id        Int       @default(autoincrement()) @id
+  clientAccountId  String?  // the clients account number
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  name      String
+  holdings  Holding[]
+  account   Account   @relation(fields: [accountId], references: [id])
+  accountId Int
+}
+
+model Address {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  address   String
+  symbol    String
+  wallet    Wallet?
+}
+
+model Holding {
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String   
+  symbol    Symbol  @relation(fields: [symbolId], references: [id])
+  symbolId  Int
+  amount    Float
+  subAccount    SubAccount  @relation(fields: [subAccountId], references: [id])
+  subAccountId Int 
+  @@id([symbolId, subAccountId])
+}
+
+model Symbol {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String   
+  symbol    String
+  address   String?
+  @@unique([symbol, address])
+}
+
+enum AccountType {
+  BLOCKCHAIN_WALLET      // Zabo
+  TRADITIONAL_BANK       // Plaid
+  TRADITIONAL_BROKERAGE  // Plaid
+  TRADITIONAL_CREDIT     // Plaid
+  CRYPTO_EXCHANGE        // Zabo
+  CRYPTO_SERVICE         // Zabo
+}
```


