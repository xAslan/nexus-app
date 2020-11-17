# Migration `20201117012434-change_to_postgres`

This migration has been generated at 11/16/2020, 8:24:34 PM.
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

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle")

ALTER TABLE "Session" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201117010009-initial-migration..20201117012434-change_to_postgres
--- datamodel.dml
+++ datamodel.dml
@@ -1,10 +1,10 @@
 // This is your Prisma schema file,
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
-  provider = "sqlite"
-  url = "***"
+  provider = "postgres"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
```


