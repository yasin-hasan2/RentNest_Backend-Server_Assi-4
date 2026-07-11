/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentIntentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paymentMethod",
ADD COLUMN     "method" TEXT,
ADD COLUMN     "paymentIntentId" TEXT,
ALTER COLUMN "transactionId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentIntentId_key" ON "Payment"("paymentIntentId");
