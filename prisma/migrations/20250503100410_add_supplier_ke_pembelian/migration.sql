/*
  Warnings:

  - Added the required column `supplierId` to the `Pembelian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pembelian` ADD COLUMN `supplierId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Pembelian` ADD CONSTRAINT `Pembelian_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
