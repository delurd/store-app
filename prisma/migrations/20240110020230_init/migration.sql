/*
  Warnings:

  - Added the required column `quantity` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerAddress1` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerAddress2` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerCity` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerCountry` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerName` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerPhone` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerPostalCode` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerProvice` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "buyerAddress1" TEXT NOT NULL,
ADD COLUMN     "buyerAddress2" TEXT NOT NULL,
ADD COLUMN     "buyerCity" TEXT NOT NULL,
ADD COLUMN     "buyerCountry" TEXT NOT NULL,
ADD COLUMN     "buyerName" TEXT NOT NULL,
ADD COLUMN     "buyerPhone" TEXT NOT NULL,
ADD COLUMN     "buyerPostalCode" TEXT NOT NULL,
ADD COLUMN     "buyerProvice" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "proviceId" TEXT;
