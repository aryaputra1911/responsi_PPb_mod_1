const express = require("express");
const cors = require("cors");
const supabase = require("../lib/supabase");

const router = express.Router();

// ============================================================
// GET /loans — Ambil semua data peminjaman (+ filter query)
// Query params: status, nama_peminjam, judul_buku
// ============================================================
router.get("/", async (req, res) => {
  try {
    const { status, nama_peminjam, judul_buku } = req.query;

    let query = supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter berdasarkan status (contoh: ?status=Terlambat)
    if (status) {
      query = query.eq("status", status);
    }

    // Filter berdasarkan nama peminjam (partial match, case-insensitive)
    if (nama_peminjam) {
      query = query.ilike("nama_peminjam", `%${nama_peminjam}%`);
    }

    // Filter berdasarkan judul buku (partial match, case-insensitive)
    if (judul_buku) {
      query = query.ilike("judul_buku", `%${judul_buku}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Data peminjaman berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// GET /loans/:id — Ambil detail satu peminjaman
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Detail peminjaman berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Data peminjaman tidak ditemukan",
      error: error.message,
    });
  }
});

// ============================================================
// POST /loans — Tambah data peminjaman baru
// ============================================================
router.post("/", async (req, res) => {
  try {
    const { nama_peminjam, judul_buku, tanggal_pinjam, tanggal_kembali, status } =
      req.body;

    // Validasi input
    if (!nama_peminjam || !judul_buku || !tanggal_pinjam || !tanggal_kembali) {
      return res.status(400).json({
        success: false,
        message:
          "Field nama_peminjam, judul_buku, tanggal_pinjam, dan tanggal_kembali wajib diisi",
      });
    }

    const validStatuses = ["Dipinjam", "Dikembalikan", "Terlambat"];
    const loanStatus = status || "Dipinjam";

    if (!validStatuses.includes(loanStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
      });
    }

    const { data, error } = await supabase
      .from("loans")
      .insert([
        {
          nama_peminjam,
          judul_buku,
          tanggal_pinjam,
          tanggal_kembali,
          status: loanStatus,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Data peminjaman berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /loans/:id — Update data peminjaman
// ============================================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_peminjam, judul_buku, tanggal_pinjam, tanggal_kembali, status } =
      req.body;

    // Validasi status jika dikirim
    if (status) {
      const validStatuses = ["Dipinjam", "Dikembalikan", "Terlambat"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status harus salah satu dari: ${validStatuses.join(", ")}`,
        });
      }
    }

    // Buat objek update hanya dengan field yang dikirim
    const updateData = {};
    if (nama_peminjam !== undefined) updateData.nama_peminjam = nama_peminjam;
    if (judul_buku !== undefined) updateData.judul_buku = judul_buku;
    if (tanggal_pinjam !== undefined) updateData.tanggal_pinjam = tanggal_pinjam;
    if (tanggal_kembali !== undefined) updateData.tanggal_kembali = tanggal_kembali;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Minimal satu field harus dikirim untuk diupdate",
      });
    }

    const { data, error } = await supabase
      .from("loans")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Data peminjaman berhasil diupdate",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// DELETE /loans/:id — Hapus data peminjaman
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Data peminjaman berhasil dihapus",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus data peminjaman",
      error: error.message,
    });
  }
});

module.exports = router;
