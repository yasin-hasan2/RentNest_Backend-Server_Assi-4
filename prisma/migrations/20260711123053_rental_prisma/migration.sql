/*
  Warnings:

  - Added the required column `duration` to the `RentalRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalRequest" ADD COLUMN     "duration" INTEGER NOT NULL;
