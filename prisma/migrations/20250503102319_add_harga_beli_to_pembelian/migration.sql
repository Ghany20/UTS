/*
  Warnings:

  - Added the required column `hargaBeli` to the `Pembelian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pembelian` ADD COLUMN `hargaBeli` DOUBLE NOT NULL;
