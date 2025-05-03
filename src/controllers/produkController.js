const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all
exports.getAllProduk = async (req, res) => {
  try {
    const produk = await prisma.produk.findMany({
      include: {
        kategori: true,
        supplier: true,
      },
    });
    res.json(produk);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar produk', error });
  }
};

// Get single 
exports.getProdukById = async (req, res) => {
  const { id } = req.params;
  try {
    const produk = await prisma.produk.findUnique({
      where: { id: parseInt(id) },
      include: {
        kategori: true,
        supplier: true,
      },
    });

    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json(produk);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk', error });
  }
};

// Create
exports.createProduk = async (req, res) => {
  const { nama, harga, stok, kategoriId, supplierId } = req.body;

  try {
    const newProduk = await prisma.produk.create({
      data: {
        nama,
        harga: parseFloat(harga),
        stok: parseInt(stok),
        kategori: { connect: { id: kategoriId } },
        supplier: { connect: { id: supplierId } },
      },
    });
    res.status(201).json(newProduk);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan produk', error });
  }
};

// Update
exports.updateProduk = async (req, res) => {
  const { id } = req.params;
  const { nama, harga, stok, kategoriId, supplierId } = req.body;

  try {
    const updatedProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        harga: parseFloat(harga),
        stok: parseInt(stok),
        kategori: { connect: { id: kategoriId } },
        supplier: { connect: { id: supplierId } },
      },
    });
    res.json(updatedProduk);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk', error });
  }
};

// Delete
exports.deleteProduk = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.produk.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error });
  }
};

