# 📚 REST API Peminjaman Buku Perpustakaan

REST API sederhana untuk layanan pencatatan peminjaman buku perpustakaan yang dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** sebagai database.

> **Responsi Pengembangan Perangkat Bergerak (PPB) — Modul 1**

## 🎯 Deskripsi & Tujuan Proyek

API ini menyediakan layanan backend untuk mengelola data peminjaman buku perpustakaan. Fitur utama meliputi:

- **Create** — Menambahkan data peminjaman baru
- **Read** — Mengambil seluruh atau detail data peminjaman
- **Update** — Memperbarui data peminjaman yang sudah ada
- **Delete** — Menghapus data peminjaman
- **Filter Query** — Memfilter data berdasarkan `status`, `nama_peminjam`, atau `judul_buku`

## 🏗️ Struktur Proyek

```
responsi_PPb_mod_1/
├── api/
│   └── index.js          # Entry point Express (Vercel Serverless)
├── lib/
│   └── supabase.js       # Konfigurasi client Supabase
├── routes/
│   └── loans.js          # Routes CRUD peminjaman buku
├── server.js             # Server untuk development lokal
├── vercel.json           # Konfigurasi deployment Vercel
├── .env.example          # Template environment variables
├── .gitignore            # File yang diabaikan Git
├── package.json          # Dependensi proyek
└── README.md             # Dokumentasi
```

## 📊 Struktur Data / Schema

### Tabel: `loans`

| Kolom             | Tipe Data     | Keterangan                                      |
| ----------------- | ------------- | ----------------------------------------------- |
| `id`              | `int8` (PK)   | Primary key, auto-increment                     |
| `nama_peminjam`   | `varchar`     | Nama anggota yang meminjam buku                 |
| `judul_buku`      | `varchar`     | Judul buku yang dipinjam                        |
| `tanggal_pinjam`  | `date`        | Tanggal mulai peminjaman                        |
| `tanggal_kembali` | `date`        | Tanggal batas pengembalian                      |
| `status`          | `varchar`     | Status peminjaman: `Dipinjam`, `Dikembalikan`, `Terlambat` |
| `created_at`      | `timestamptz` | Waktu data dibuat (default: `now()`)            |

### SQL untuk Membuat Tabel di Supabase

Buka **SQL Editor** di dashboard Supabase, lalu jalankan query berikut:

```sql
CREATE TABLE loans (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama_peminjam VARCHAR NOT NULL,
  judul_buku VARCHAR NOT NULL,
  tanggal_pinjam DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'Dipinjam',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert data contoh
INSERT INTO loans (nama_peminjam, judul_buku, tanggal_pinjam, tanggal_kembali, status)
VALUES
  ('Arya Putra', 'Laskar Pelangi', '2026-10-01', '2026-10-15', 'Dipinjam'),
  ('Budi Santoso', 'Bumi Manusia', '2026-09-20', '2026-10-04', 'Terlambat'),
  ('Citra Dewi', 'Filosofi Teras', '2026-09-15', '2026-09-29', 'Dikembalikan');
```

> ⚠️ Pastikan **Row Level Security (RLS)** di-disable atau dikonfigurasi dengan policy yang sesuai agar API dapat mengakses data.

## 🔗 Base URL

| Environment  | URL                                               |
| ------------ | ------------------------------------------------- |
| **Lokal**    | `http://localhost:3000`                            |
| **Vercel**   | `https://responsi-p-pb-mod-1.vercel.app`           |

> Sesuaikan link Vercel di atas setelah deployment berhasil.

## 📡 API Endpoints

### 1. `GET /api/loans` — Ambil Semua Data Peminjaman

Mendukung filter query melalui query parameters.

**Query Parameters (opsional):**

| Parameter       | Tipe     | Keterangan                        |
| --------------- | -------- | --------------------------------- |
| `status`        | `string` | Filter berdasarkan status         |
| `nama_peminjam` | `string` | Filter berdasarkan nama (partial) |
| `judul_buku`    | `string` | Filter berdasarkan judul (partial) |

**Contoh Request:**

```bash
# Ambil semua data
curl -X GET https://responsi-p-pb-mod-1.vercel.app/api/loans

# Filter berdasarkan status
curl -X GET "https://responsi-p-pb-mod-1.vercel.app/api/loans?status=Terlambat"

# Filter berdasarkan nama peminjam
curl -X GET "https://responsi-p-pb-mod-1.vercel.app/api/loans?nama_peminjam=Arya"
```

**Contoh Response:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_peminjam": "Arya Putra",
      "judul_buku": "Laskar Pelangi",
      "tanggal_pinjam": "2026-10-01",
      "tanggal_kembali": "2026-10-15",
      "status": "Dipinjam",
      "created_at": "2026-10-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. `GET /api/loans/:id` — Ambil Detail Peminjaman

**Contoh Request:**

```bash
curl -X GET https://responsi-p-pb-mod-1.vercel.app/api/loans/1
```

**Contoh Response:**

```json
{
  "success": true,
  "message": "Detail peminjaman berhasil diambil",
  "data": {
    "id": 1,
    "nama_peminjam": "Arya Putra",
    "judul_buku": "Laskar Pelangi",
    "tanggal_pinjam": "2026-10-01",
    "tanggal_kembali": "2026-10-15",
    "status": "Dipinjam",
    "created_at": "2026-10-01T10:00:00.000Z"
  }
}
```

---

### 3. `POST /api/loans` — Tambah Data Peminjaman

**Request Body (JSON):**

| Field             | Tipe     | Wajib  | Keterangan                                       |
| ----------------- | -------- | ------ | ------------------------------------------------ |
| `nama_peminjam`   | `string` | ✅ Ya  | Nama peminjam                                    |
| `judul_buku`      | `string` | ✅ Ya  | Judul buku yang dipinjam                         |
| `tanggal_pinjam`  | `string` | ✅ Ya  | Format: `YYYY-MM-DD`                             |
| `tanggal_kembali` | `string` | ✅ Ya  | Format: `YYYY-MM-DD`                             |
| `status`          | `string` | ❌ Tidak | Default: `Dipinjam`. Opsi: `Dipinjam`, `Dikembalikan`, `Terlambat` |

**Contoh Request:**

```bash
curl -X POST https://responsi-p-pb-mod-1.vercel.app/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "nama_peminjam": "Dina Rahmawati",
    "judul_buku": "Atomic Habits",
    "tanggal_pinjam": "2026-10-10",
    "tanggal_kembali": "2026-10-24"
  }'
```

**Contoh Response (201 Created):**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil ditambahkan",
  "data": {
    "id": 4,
    "nama_peminjam": "Dina Rahmawati",
    "judul_buku": "Atomic Habits",
    "tanggal_pinjam": "2026-10-10",
    "tanggal_kembali": "2026-10-24",
    "status": "Dipinjam",
    "created_at": "2026-10-10T12:00:00.000Z"
  }
}
```

---

### 4. `PUT /api/loans/:id` — Update Data Peminjaman

Hanya kirim field yang ingin diupdate (partial update).

**Contoh Request:**

```bash
curl -X PUT https://responsi-p-pb-mod-1.vercel.app/api/loans/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Dikembalikan"
  }'
```

**Contoh Response:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil diupdate",
  "data": {
    "id": 1,
    "nama_peminjam": "Arya Putra",
    "judul_buku": "Laskar Pelangi",
    "tanggal_pinjam": "2026-10-01",
    "tanggal_kembali": "2026-10-15",
    "status": "Dikembalikan",
    "created_at": "2026-10-01T10:00:00.000Z"
  }
}
```

---

### 5. `DELETE /api/loans/:id` — Hapus Data Peminjaman

**Contoh Request:**

```bash
curl -X DELETE https://responsi-p-pb-mod-1.vercel.app/api/loans/1
```

**Contoh Response:**

```json
{
  "success": true,
  "message": "Data peminjaman berhasil dihapus",
  "data": {
    "id": 1,
    "nama_peminjam": "Arya Putra",
    "judul_buku": "Laskar Pelangi",
    "tanggal_pinjam": "2026-10-01",
    "tanggal_kembali": "2026-10-15",
    "status": "Dikembalikan",
    "created_at": "2026-10-01T10:00:00.000Z"
  }
}
```

## ❌ Contoh Error Response

```json
{
  "success": false,
  "message": "Field nama_peminjam, judul_buku, tanggal_pinjam, dan tanggal_kembali wajib diisi"
}
```

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) (v18 ke atas)
- Akun [Supabase](https://supabase.com/) (gratis)
- [Git](https://git-scm.com/)

### Langkah-langkah

1. **Clone repository:**

   ```bash
   git clone https://github.com/aryaputra1911/responsi_PPb_mod_1.git
   cd responsi_PPb_mod_1
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Setup database Supabase:**

   - Buat proyek baru di [Supabase Dashboard](https://app.supabase.com/)
   - Buka **SQL Editor** dan jalankan query SQL di bagian [Struktur Data](#-struktur-data--schema)
   - Disable **RLS** pada tabel `loans` (atau buat policy yang sesuai)

4. **Konfigurasi environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit file `.env` dan isi dengan kredensial Supabase:

   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-key
   ```

   > Kredensial bisa ditemukan di **Supabase Dashboard → Settings → API**

5. **Jalankan server:**

   ```bash
   npm run dev
   ```

   Server akan berjalan di `http://localhost:3000`.

6. **Test API:**

   ```bash
   curl http://localhost:3000/api/loans
   ```

## 🚀 Deployment ke Vercel

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login dan deploy:

   ```bash
   vercel login
   vercel
   ```

3. Set environment variables di Vercel Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

4. Deploy ke production:

   ```bash
   vercel --prod
   ```

## 🔗 Link Deployment

> **Vercel**: [https://responsi-p-pb-mod-1.vercel.app](https://responsi-p-pb-mod-1.vercel.app)
>
> _(Sesuaikan link setelah deployment berhasil)_

## 📦 Tech Stack

| Teknologi    | Kegunaan                  |
| ------------ | ------------------------- |
| Node.js      | Runtime JavaScript        |
| Express.js   | Web framework             |
| Supabase     | Database (PostgreSQL)     |
| Vercel       | Deployment & hosting      |
| CORS         | Cross-Origin Resource Sharing |
| dotenv       | Environment variables     |
