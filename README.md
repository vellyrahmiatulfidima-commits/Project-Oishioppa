# OishiOppa — Japanese & Korean Resto

Website resmi restoran **OishiOppa**, resto bertema masakan Jepang & Korea. Project ini
dibuat sebagai media informasi, pemesanan, reservasi, sekaligus manajemen operasional
restoran secara digital.

## Apa yang Dilakukan Project Ini

OishiOppa adalah aplikasi web (HTML, CSS, JavaScript) dengan dua sisi utama:

**Sisi Pelanggan**
- Beranda dengan video profil restoran (`index.html`)
- Halaman **Tentang** restoran (`about.html`)
- **Daftar Menu** makanan & minuman khas Jepang dan Korea, lengkap dengan filter
  kategori dan asal kuliner, serta fitur pemesanan langsung (`menu.html`)
- **Reservasi meja / Kontak** restoran (`kontak.html`)
- **Login & Daftar** akun pelanggan (`login-user.html`)
- **Pesanan Saya** untuk memantau status pesanan yang sudah dibuat (`pesanan-user.html`)
- Mode gelap/terang (dark mode) yang tersimpan otomatis di browser

**Sisi Admin / Dapur**
- **Login Admin** (`login.html`)
- **Dashboard Admin** untuk mengelola data menu — tambah, lihat, dan hapus menu
  beserta ringkasan statistik restoran (`admin.html`)
- **Live Status Pesanan** untuk memantau pesanan pelanggan secara real-time dan
  mengubah status pesanan dari dapur/kasir (`live-orders.html`)

Data menu diambil dari **Firebase Realtime Database**, dengan data cadangan (fallback)
lokal apabila koneksi ke Firebase gagal.

## Mengapa Project Ini Berguna

- Memudahkan calon pelanggan melihat menu, harga, dan melakukan reservasi tanpa
  harus datang atau menelepon langsung.
- Memudahkan pihak restoran (admin & dapur) mengelola menu dan memantau pesanan
  yang masuk secara real-time dari satu dashboard.
- Dibangun dengan HTML, CSS, dan JavaScript murni (tanpa framework), sehingga ringan
  dan mudah dipelajari maupun dikembangkan lebih lanjut.

## Daftar Halaman

| Halaman     | Deskripsi                                             | File                    |
| -------------------- | ------------------------------------------------------ | ------------------------ |
| Beranda              | Halaman utama dengan video profil restoran              | `index.html`             |
| Tentang               | Profil dan cerita singkat restoran                       | `html/about.html`        |
| Menu                 | Daftar menu, filter kategori/asal, dan pemesanan         | `html/menu.html`         |
| Kontak & Reservasi   | Formulir reservasi meja                                  | `html/kontak.html`       |
| Login Pelanggan       | Masuk & daftar akun pelanggan                            | `html/login-user.html`   |
| Pesanan Saya          | Riwayat & status pesanan pelanggan                        | `html/pesanan-user.html` |
| Login Admin           | Autentikasi masuk untuk admin                             | `html/login.html`        |
| Dashboard Admin       | Kelola data menu & ringkasan statistik                    | `html/admin.html`        |
| Live Status Pesanan   | Monitoring pesanan real-time untuk dapur/kasir            | `html/live-orders.html`  |

## Struktur Folder

```
velly_rahmiatul_fidima/
├── index.html          # Halaman beranda
├── html/                # Halaman-halaman lain (menu, kontak, admin, login, dll.)
├── css/                  # File-file styling
├── js/                   # Logika JavaScript (menu, pesanan, login, tema, dll.)
└── assets/               # Gambar, logo, dan video
```

## Bagaimana Cara Memulai / Menjalankan Project

1. Clone repository ini:
   ```
   git clone https://github.com/vellyrahmiatulfidima-commits/Project-Oishioppa.git
   ```
2. Masuk ke folder project:
   ```
   cd Project-Oishioppa
   ```
3. Buka file `index.html` langsung di browser, atau jalankan dengan live server
   (misalnya ekstensi **Live Server** di Visual Studio Code) agar fitur JavaScript
   berjalan optimal.

Untuk mengakses sisi admin, buka `html/login.html`.

## Teknologi yang Digunakan

- HTML5 & CSS3
- JavaScript (Vanilla)
- Firebase Realtime Database (data menu)
- LocalStorage (data pesanan, status login, dan preferensi tema)

## Di Mana Mendapatkan Bantuan

Jika menemukan kendala atau bug, silakan buka **Issues** pada repository GitHub ini.

## Siapa yang Mengembangkan Project Ini

Dikembangkan oleh **Velly Rahmiatul Fidima** sebagai bagian dari project pembelajaran
pengembangan web front-end.

---
