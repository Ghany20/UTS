const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSupplier = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data supplier', error });
  }
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: Number(id) } });
    if (!supplier) return res.status(404).json({ message: 'Supplier tidak ditemukan' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data supplier', error });
  }
};

exports.createSupplier = async (req, res) => {
  const { nama } = req.body;
  try {
    const newSupplier = await prisma.supplier.create({ data: { nama } });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan supplier', error });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;
  try {
    const updated = await prisma.supplier.update({
      where: { id: Number(id) },
      data: { nama },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah supplier', error });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({ where: { id: Number(id) } });
    res.json({ message: 'Supplier berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus supplier', error });
  }
};

