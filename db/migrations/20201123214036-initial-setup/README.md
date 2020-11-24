# Migration `20201123214036-initial-setup`

This migration has been generated at 11/23/2020, 4:40:36 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
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
    "type" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastSync" TIMESTAMP(3),
    "institutionId" INTEGER,

    PRIMARY KEY ("id")
)

CREATE TABLE "Wallet" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "xpub" TEXT,
    "accountId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Address" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "address" TEXT NOT NULL,
    "walletId" INTEGER,

    PRIMARY KEY ("id")
)

CREATE TABLE "Holding" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle")

CREATE UNIQUE INDEX "Institution.name_unique" ON "Institution"("name")

ALTER TABLE "Session" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("institutionId")REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Wallet" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Address" ADD FOREIGN KEY("walletId")REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201123214036-initial-setup
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,97 @@
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
+  institution Institution? 
+  type        String       //manual, blockchain_wallet, institution, defi ENUM
+  wallets     Wallet[]     
+  holdings    Holding[]    
+  user        User         @relation(fields: [userId], references: [id])
+  userId      Int          
+  lastSync    DateTime?
+}
+
+model Wallet {
+  id        Int       @default(autoincrement()) @id
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  name      String    
+  type      String   // 
+  symbol    String    
+  xpub      String?   
+  addresses Address[] 
+  account   Account   @relation(fields: [accountId], references: [id])
+  accountId Int       
+  amount Int 
+}
+
+model Address {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String?  
+  address   String   
+}
+
+model Holding {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String   
+  symbol    String   
+  amount    Int      
+  account   Account  @relation(fields: [accountId], references: [id])
+  accountId Int      
+}
```


