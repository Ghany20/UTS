const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all
exports.getAllPembelian = async (req, res) => {
  try {
    const pembelian = await prisma.pembelian.findMany({
      include: {
        produk: {
          include: {
            supplier: true,  // Menampilkan data supplier terkait
          }
        }
      }
    });
    res.json(pembelian);
  } catch (error) {
    console.error('Gagal mengambil data pembelian:', error);
    res.status(500).json({
      message: 'Gagal mengambil data pembelian',
      error: error.message
    });
  }
};

// get single
exports.getPembelianById = async (req, res) => {
  const { id } = req.params;
  try {
    const pembelian = await prisma.pembelian.findUnique({
      where: { id: parseInt(id) },
      include: {
        produk: {
          include: {
            supplier: true,
          }
        }
      }
    });
    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian tidak ditemukan' });
    }
    res.json(pembelian);
  } catch (error) {
    console.error('Gagal mengambil data pembelian:', error);
    res.status(500).json({
      message: 'Gagal mengambil data pembelian',
      error: error.message
    });
  }
};

// create
exports.createPembelian = async (req, res) => {
  const { produkId, supplierId, jumlah, hargaBeli, tanggal } = req.body;
  try {
    // Cek apakah produk ada
    const produk = await prisma.produk.findUnique({
      where: { id: produkId }
    });

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Membuat data pembelian baru
    const pembelian = await prisma.pembelian.create({
      data: {
        produkId,
        supplierId,
        jumlah,
        hargaBeli,
        tanggal: new Date(tanggal),
      }
    });

    // Update stok produk
    await prisma.produk.update({
      where: { id: produkId },
      data: { stok: produk.stok + jumlah }
    });

    res.status(201).json(pembelian);
  } catch (error) {
    console.error('Gagal menambahkan pembelian:', error);
    res.status(500).json({
      message: 'Gagal menambahkan pembelian',
      error: error.message
    });
  }
};

// update
exports.updatePembelian = async (req, res) => {
  const { id } = req.params;
  const { produkId, jumlah, tanggal } = req.body;

  try {
    const pembelianLama = await prisma.pembelian.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pembelianLama) {
      return res.status(404).json({ message: 'Pembelian tidak ditemukan' });
    }

    // Hitung selisih jumlah pembelian
    const selisih = jumlah - pembelianLama.jumlah;

    // Update data pembelian
    const pembelian = await prisma.pembelian.update({
      where: { id: parseInt(id) },
      data: {
        produkId,
        jumlah,
        tanggal: tanggal ? new Date(tanggal) : undefined,
      }
    });

    // Update stok produk
    await prisma.produk.update({
      where: { id: produkId },
      data: { stok: { increment: selisih } }
    });

    res.json(pembelian);
  } catch (error) {
    console.error('Gagal memperbarui pembelian:', error);
    res.status(500).json({
      message: 'Gagal memperbarui pembelian',
      error: error.message
    });
  }
};

// delete
exports.deletePembelian = async (req, res) => {
  const { id } = req.params;
  try {
    const pembelian = await prisma.pembelian.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pembelian) {
      return res.status(404).json({ message: 'Pembelian tidak ditemukan' });
    }

    // Kurangi stok produk terkait
    await prisma.produk.update({
      where: { id: pembelian.produkId },
      data: { stok: { decrement: pembelian.jumlah } }
    });

    // Hapus data pembelian
    await prisma.pembelian.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Pembelian berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus pembelian:', error);
    res.status(500).json({
      message: 'Gagal menghapus pembelian',
      error: error.message
    });
  }
};

