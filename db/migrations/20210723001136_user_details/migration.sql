-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profile_img_url" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "secondary_currency" TEXT NOT NULL DEFAULT E'GBP';
