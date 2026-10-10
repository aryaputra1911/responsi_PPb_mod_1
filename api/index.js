const express = require("express");
const cors = require("cors");
require("dotenv").config();

const loanRoutes = require("../routes/loans");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Peminjaman Buku Perpustakaan",
    version: "1.0.0",
    endpoints: {
      "GET /api/loans": "Ambil semua data peminjaman (support filter: ?status=, ?nama_peminjam=, ?judul_buku=)",
      "GET /api/loans/:id": "Ambil detail peminjaman berdasarkan ID",
      "POST /api/loans": "Tambah data peminjaman baru",
      "PUT /api/loans/:id": "Update data peminjaman",
      "DELETE /api/loans/:id": "Hapus data peminjaman",
    },
  });
});

// Routes
app.use("/api/loans", loanRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Export untuk Vercel
module.exports = app;
