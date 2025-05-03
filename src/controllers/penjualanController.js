const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mengambil semua data penjualan
exports.getAllPenjualan = async (req, res) => {
  try {
    const penjualans = await prisma.penjualan.findMany({
      include: {
        produk: true,  // Menambahkan data produk terkait
      }
    });
    res.status(200).json(penjualans);
  } catch (error) {
    console.error('Gagal mengambil data penjualan:', error);
    res.status(500).json({ message: 'Gagal mengambil data penjualan', error: error.message });
  }
};

// Fungsi untuk mengambil penjualan berdasarkan ID
exports.getPenjualanById = async (req, res) => {
  const { id } = req.params;
  try {
    const penjualan = await prisma.penjualan.findUnique({
      where: { id: parseInt(id) },
      include: { produk: true },  // Menambahkan produk terkait
    });
    if (!penjualan) {
      return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
    }
    res.status(200).json(penjualan);
  } catch (error) {
    console.error('Gagal mengambil data penjualan:', error);
    res.status(500).json({ message: 'Gagal mengambil data penjualan', error: error.message });
  }
};

// Fungsi untuk menambahkan data penjualan
exports.createPenjualan = async (req, res) => {
  const { produkId, jumlah, tanggal } = req.body;
  try {
    const produk = await prisma.produk.findUnique({
      where: { id: produkId },
    });

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Membuat data penjualan baru
    const penjualan = await prisma.penjualan.create({
      data: {
        produkId,
        jumlah,
        tanggal: new Date(tanggal),
      },
    });

    // Mengurangi stok produk setelah penjualan
    await prisma.produk.update({
      where: { id: produkId },
      data: { stok: produk.stok - jumlah },
    });

    res.status(201).json(penjualan);
  } catch (error) {
    console.error('Gagal menambahkan penjualan:', error);
    res.status(500).json({ message: 'Gagal menambahkan penjualan', error: error.message });
  }
};

// Fungsi untuk memperbarui data penjualan
exports.updatePenjualan = async (req, res) => {
  const { id } = req.params;
  const { produkId, jumlah, tanggal } = req.body;
  try {
    const penjualan = await prisma.penjualan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!penjualan) {
      return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
    }

    const produk = await prisma.produk.findUnique({
      where: { id: produkId },
    });

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Update penjualan
    const updatedPenjualan = await prisma.penjualan.update({
      where: { id: parseInt(id) },
      data: {
        produkId,
        jumlah,
        tanggal: new Date(tanggal),
      },
    });

    // Update stok produk setelah penjualan
    await prisma.produk.update({
      where: { id: produkId },
      data: { stok: produk.stok - jumlah },
    });

    res.status(200).json(updatedPenjualan);
  } catch (error) {
    console.error('Gagal memperbarui penjualan:', error);
    res.status(500).json({ message: 'Gagal memperbarui penjualan', error: error.message });
  }
};

// Fungsi untuk menghapus data penjualan
exports.deletePenjualan = async (req, res) => {
  const { id } = req.params;
  try {
    const penjualan = await prisma.penjualan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!penjualan) {
      return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
    }

    // Menghapus data penjualan
    await prisma.penjualan.delete({
      where: { id: parseInt(id) },
    });

    // Menambah stok produk setelah penghapusan penjualan
    const produk = await prisma.produk.findUnique({
      where: { id: penjualan.produkId },
    });

    await prisma.produk.update({
      where: { id: produk.id },
      data: { stok: produk.stok + penjualan.jumlah },
    });

    res.status(200).json({ message: 'Penjualan berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus penjualan:', error);
    res.status(500).json({ message: 'Gagal menghapus penjualan', error: error.message });
  }
};

