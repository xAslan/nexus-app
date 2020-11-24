# Migration `20201124005122-update-account-sync`

This migration has been generated at 11/23/2020, 7:51:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "Account" ADD COLUMN     "lastSyncEnd" TIMESTAMP(3),
ADD COLUMN     "syncStatus" TEXT NOT NULL DEFAULT E'inactive'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201123214036-initial-setup..20201124005122-update-account-sync
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
@@ -60,8 +60,10 @@
   holdings    Holding[]    
   user        User         @relation(fields: [userId], references: [id])
   userId      Int          
   lastSync    DateTime?
+  lastSyncEnd DateTime?
+  syncStatus  String       @default("inactive")
 }
 model Wallet {
   id        Int       @default(autoincrement()) @id
```


