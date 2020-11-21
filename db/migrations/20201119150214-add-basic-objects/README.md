# Migration `20201119150214-add-basic-objects`

This migration has been generated at 11/19/2020, 10:02:14 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Institution" (
"id" SERIAL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

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

CREATE UNIQUE INDEX "Institution.name_unique" ON "Institution"("name")

ALTER TABLE "Account" ADD FOREIGN KEY("institutionId")REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Account" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Wallet" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Address" ADD FOREIGN KEY("walletId")REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Holding" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201117012434-change_to_postgres..20201119150214-add-basic-objects
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
@@ -35,4 +35,59 @@
   antiCSRFToken      String?
   publicData         String?
   privateData        String?
 }
+
+model Institution {
+  id        Int      @default(autoincrement()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  name      String   @unique
+}
+
+model Account {
+  id          Int          @default(autoincrement()) @id
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @updatedAt
+  name        String       
+  apiKey      String?      
+  apiSecret   String?      
+  institution Institution? 
+  type        String       
+  wallets     Wallet[]     
+  holdings    Holding[]    
+  user        User         @relation(fields: [userId], references: [id])
+  userId      Int          
+}
+
+model Wallet {
+  id        Int       @default(autoincrement()) @id
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @updatedAt
+  name      String    
+  type      String    
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


