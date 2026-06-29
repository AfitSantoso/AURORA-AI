# Aurora - Prototype Aplikasi Komisi Dealer & Onboarding Rekening

Aurora adalah prototype aplikasi web interaktif berstandar industri yang dirancang untuk mengamankan proses pembayaran komisi dealer di lingkungan perusahaan (e.g. BCA Finance). 

Aplikasi ini mendemonstrasikan integrasi teknologi **Vision AI** dan **Penny Drop (Inquiry Rekening)** dalam melakukan verifikasi rekening secara *multi-layer* untuk menghasilkan tingkat keyakinan (*confidence score*), alih-alih mengandalkan validasi transaksi berulang yang tidak efisien.

---

## 🚀 Fitur Utama Prototype

1. **One-Time Onboarding (Registrasi Sekali)**
   Rekening dealer didaftarkan satu kali ke dalam **Trusted Repository** menggunakan dua metode simulasi:
   - **Opsi 1: Penny Drop / Inquiry Bank**: Sistem melakukan inquiry nama pemilik ke bank tujuan dengan mengirimkan transfer Rp1, lalu menghitung tingkat kecocokan nama secara realtime.
   - **Opsi 2: Vision AI Document Reader**: Dealer mengunggah foto buku tabungan atau rekening koran. Vision AI akan mendeteksi logo, mengekstrak informasi rekening, dan memverifikasi keaslian dokumen menggunakan visual *heatmap overlay*.

2. **Trusted Repository**
   Database penyimpanan lokal berisi seluruh daftar rekening yang telah terverifikasi aman. Pembayaran komisi berikutnya hanya diizinkan untuk dikirim ke rekening tepercaya di dalam repositori ini secara otomatis.

3. **Risk Dashboard (Pemantauan Risiko & Tren)**
   Halaman beranda yang memvisualisasikan volume alert berdasarkan tingkat risiko (High, Medium, Low), grafik tren 6 bulan terakhir berbasis SVG, diagram jenis alert, serta cabang dengan tingkat risiko tertinggi.

4. **Multi-Layer Approval Workspaces (RM & DD Workspaces)**
   Transaksi pembayaran komisi yang dikirim ke rekening di luar *Trusted Repository* (misal rekening baru atau rekening terindikasi anomali) akan memicu status Alert. Status ini harus diproses secara manual melalui persetujuan berjenjang:
   - **Regional Manager (RM)**: Menilai temuan AI (*AI Findings*), memeriksa keaslian dokumen pendukung secara visual, menulis catatan verifikasi, dan meneruskan keputusan.
   - **Deputy Director (DD)**: Meninjau keputusan RM, membaca rekomendasi akhir AI, dan memberikan keputusan akhir (*Setuju*, *Tunda*, *Eskalasi ke Audit*, atau *Tolak*). Jika disetujui, rekening tersebut otomatis terdaftar di *Trusted Repository*.

---

## 🛠️ Persyaratan Sistem & Tech Stack

Prototype ini dibangun menggunakan spesifikasi berikut:
- **Angular CLI** : 21.1.4 (Standalone Component Architecture)
- **Node.js** : 22.13.0
- **Package Manager** : npm 11.7.0
- **Styling** : Vanilla CSS Custom Variables (Aesthetic premium, modern, responsive)
- **State Management** : Local state service terintegrasi dengan `localStorage` (Tanpa database eksternal)

---

## 💻 Cara Menjalankan Aplikasi Secara Lokal

1. Buka PowerShell atau Command Prompt di folder proyek (`c:\Documents\BCAF\AURORA`).
2. Jalankan perintah berikut untuk memulai server pengembangan Angular:
   ```bash
   npm run start
   ```
3. Buka browser Anda dan akses tautan berikut:
   **[http://localhost:4200](http://localhost:4200)**

---

## 🧪 Panduan Skenario Pengujian (Testing Guide)

Silakan ikuti langkah-langkah di bawah ini untuk mensimulasikan seluruh alur bisnis prototype dari awal hingga akhir:

### Skenario 1: Login dan Tinjau Dasbor Risiko
1. Pada halaman login, masukkan **Username:** `admin` dan **Password:** `admin`, lalu klik **Masuk**.
2. Anda akan diarahkan ke halaman **Dashboard**. Perhatikan panel peringatan berwarna merah di atas yang menandakan ada transaksi mencurigakan yang memerlukan tindakan.
3. Tinjau statistik risiko (High, Medium, Low), visualisasi grafik garis tren 6 bulan, diagram donat jenis alert, dan peringkat risiko cabang.

### Skenario 2: Onboarding Rekening Baru (Opsi 1 - Penny Drop)
1. Pilih menu **Onboard Dealer** di sidebar kiri.
2. Pastikan tab **Opsi 1: Validasi Penny Drop / Inquiry** aktif.
3. Anda dapat membiarkan data mock yang sudah terisi (Andi Setiawan, Mandiri, dsb) atau mengisi data baru. Klik checkbox pernyataan kebenaran data, lalu klik **Lanjutkan**.
4. Sistem akan menampilkan animasi loading visual transfer Rp1 (Penny Drop). Tunggu beberapa detik.
5. Setelah transfer berhasil, klik **Lanjutkan ke Validasi AI**.
6. AI akan menampilkan perbandingan nama input dengan nama dari bank dan menghitung skor kemiripan nama (98%). Klik **Simpan ke Repository**.
7. Buka menu **Trusted Repository** untuk memastikan rekening baru telah sukses terdaftar dengan status **Terverifikasi**.

### Skenario 3: Onboarding Rekening Baru (Opsi 2 - Vision AI)
1. Pilih menu **Onboard Dealer** dan klik tab **Opsi 2: Validasi Dokumen (Vision AI)**.
2. Seret (drag & drop) atau klik area upload untuk memilih file gambar/PDF apa saja dari komputer Anda sebagai mock dokumen.
3. Setelah nama file muncul, klik tombol **Proses Dokumen**.
4. AI akan menampilkan animasi garis laser pemindaian (scanning) dokumen tabungan beserta status ceklis pembacaan teks dan logo bank Mandiri secara realtime.
5. Setelah selesai, tinjau **Hasil Ekstraksi & Validasi AI** (Match Score 96% dan Status Keaslian 98%). Tinjau juga **Detail Dokumen & Analisis AI** di sebelah kanan yang menampilkan penyorotan koordinat teks (*Heatmap*) berupa kotak warna-warni pada area Nama, No Rekening, Bank, dan Cabang.
6. Klik **Simpan ke Repository** untuk mendaftarkannya secara permanen ke repositori tepercaya.

### Skenario 4: Proses Persetujuan Berjenjang (RM ke DD)
*Skenario ini mensimulasikan bagaimana pembayaran komisi yang memicu alert ditangani hingga akhirnya disetujui dan masuk ke repository secara aman.*

1. Buka menu **Alert List** dari sidebar kiri.
2. Cari baris alert dengan ID `AL-2505-00124` (Penerima: ANDI SETIAWAN, Risiko: High) dan klik baris tersebut.
3. Anda akan masuk ke halaman **Detail Alert**. Tinjau detail transaksi, skor risiko AI (92/100), alasan alert, serta riwayat timeline-nya.
4. Klik tombol **Lanjutkan ke Workspace Verifikasi RM** di bagian bawah.
5. Pada workspace Regional Manager:
   - Klik tombol **Lihat** di bagian *Dokumen Pendukung* untuk memunculkan modal pop-up pratinjau bukti transfer, data rekening, dan profil dealer.
   - Tulis catatan di kolom verifikasi (misal: *"Data rekening PIC sudah diverifikasi silang dengan dokumen fisik asli"*).
   - Pilih keputusan radio **Investigasi** atau **Approve**, lalu klik **Kirim ke Deputy Director**.
6. Anda akan langsung dialihkan ke workspace Deputy Director (DD):
   - Perhatikan bahwa keputusan dan catatan verifikasi RM yang Anda tulis sebelumnya tampil secara otomatis di sisi kiri.
   - Baca kolom rekomendasi AI.
   - Tulis catatan keputusan akhir DD (misal: *"Setuju untuk dibayarkan. Rekening valid"*).
   - Pilih keputusan akhir **Setuju & Lanjutkan**, lalu klik **Simpan Keputusan**.
7. Sistem akan menyimpan keputusan Anda, menutup tiket alert tersebut, dan secara otomatis memindahkan/mendaftarkan rekening tersebut ke **Trusted Repository**.
8. Buka menu **Trusted Repository** untuk memverifikasi bahwa rekening Andi Setiawan kini telah terdaftar sebagai rekening tepercaya.

### Skenario 5: Reset Data Simulasi
1. Jika Anda ingin mengulang pengujian dari awal dengan data kosong/default, buka menu **Trusted Repository**.
2. Klik tombol **Sembuhkan Data (Reset)** di sudut kanan atas.
3. Konfirmasikan tindakan. Seluruh data di `localStorage` akan diatur ulang ke kondisi default prototype.
