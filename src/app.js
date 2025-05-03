const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//routes
const kategoriRoutes = require('./routes/kategoriRoutes');
const produkRoutes = require('./routes/produkRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const pembelianRoutes = require('./routes/pembelianRoutes');
const penjualanRoutes = require('./routes/penjualanRoutes');


app.use(cors());
app.use(express.json());

app.use('/api/kategori', kategoriRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/pembelian', pembelianRoutes);
app.use('/api/penjualan', penjualanRoutes);

module.exports = app;

