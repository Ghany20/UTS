const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all
exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await prisma.kategori.findMany();
    res.json(kategori);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kategori', error });
  }
};

// get single
exports.getKategoriById = async (req, res) => {
  const { id } = req.params;
  try {
    const kategori = await prisma.kategori.findUnique({
      where: { id: parseInt(id) },
    });

    if (!kategori) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }

    res.json(kategori);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kategori', error });
  }
};

// Create
exports.createKategori = async (req, res) => {
  const { nama } = req.body;
  try {
    const newKategori = await prisma.kategori.create({
      data: { nama },
    });
    res.status(201).json(newKategori);
  } catch (error) {
    res.status(500).json({ message: 'Error creating kategori', error });
  }
};

// Update
exports.updateKategori = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  try {
    const updatedKategori = await prisma.kategori.update({
      where: { id: parseInt(id) },
      data: { nama },
    });

    res.json(updatedKategori);
  } catch (error) {
    res.status(500).json({ message: 'Error updating kategori', error });
  }
};

// Delete
exports.deleteKategori = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.kategori.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting kategori', error });
  }
};

