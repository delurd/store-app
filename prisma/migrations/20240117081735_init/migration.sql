/*
  Warnings:

  - You are about to drop the column `productId` on the `CustomerReview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productTransactionId]` on the table `CustomerReview` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productTransactionId` to the `CustomerReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductsImages" DROP CONSTRAINT "ProductsImages_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductsTransaction" DROP CONSTRAINT "ProductsTransaction_storeTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "StoreTransaction" DROP CONSTRAINT "StoreTransaction_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "UserCart" DROP CONSTRAINT "UserCart_productId_fkey";

-- AlterTable
ALTER TABLE "CustomerReview" DROP COLUMN "productId",
ADD COLUMN     "productTransactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StoreTransaction" ADD COLUMN     "shippingCourier" TEXT DEFAULT 'jne reg';

-- CreateTable
CREATE TABLE "FinancialHistory" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "FinancialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentTotal" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentCode" TEXT,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerReview_productTransactionId_key" ON "CustomerReview"("productTransactionId");

-- AddForeignKey
ALTER TABLE "FinancialHistory" ADD CONSTRAINT "FinancialHistory_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsImages" ADD CONSTRAINT "ProductsImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCart" ADD CONSTRAINT "UserCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreTransaction" ADD CONSTRAINT "StoreTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsTransaction" ADD CONSTRAINT "ProductsTransaction_storeTransactionId_fkey" FOREIGN KEY ("storeTransactionId") REFERENCES "StoreTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_productTransactionId_fkey" FOREIGN KEY ("productTransactionId") REFERENCES "ProductsTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
