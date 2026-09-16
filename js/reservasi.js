/**
 * ==========================================================================
 * KODE PENYIMPANAN & MANAJEMEN RESERVASI MEJA RESTORAN
 * File: js/reservasi.js
 * Deskripsi: Menangani event submit formulir reservasi, menyimpan data ke 
 *            localStorage, dan menampilkan umpan balik tanpa innerHTML/var.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mengambil elemen formulir reservasi berdasarkan ID
    const reservationForm = document.getElementById('reservation-form');

    // Memastikan elemen formulir tersedia di halaman
    if (reservationForm) {
        reservationForm.addEventListener('submit', (event) => {
            // Mencegah perilaku default reload dari form submit
            event.preventDefault();

            // Mengambil elemen-elemen input dari DOM
            const namaInput = document.getElementById('nama');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const outletSelect = document.getElementById('outlet');
            const tanggalInput = document.getElementById('tanggal');
            const waktuInput = document.getElementById('waktu');
            const tamuSelect = document.getElementById('tamu');
            const areaSelect = document.getElementById('area');
            const pesanInput = document.getElementById('pesan');

            // Mengambil nilai input dengan pembersihan spasi (trim)
            const namaPemesan = namaInput ? namaInput.value.trim() : '';
            const nomorHp = phoneInput ? phoneInput.value.trim() : '';
            const emailPemesan = emailInput ? emailInput.value.trim() : '';
            const lokasiOutlet = outletSelect ? outletSelect.value : '';
            const tanggalReservasi = tanggalInput ? tanggalInput.value : '';
            const waktuReservasi = waktuInput ? waktuInput.value : '';
            const jumlahTamu = tamuSelect ? tamuSelect.value : '';
            const areaDuduk = areaSelect ? areaSelect.value : '';
            const catatanKhusus = pesanInput ? pesanInput.value.trim() : '';

            // Membuat objek data reservasi baru
            const dataReservasiBaru = {
                idReservasi: `RSV-${Date.now()}`,
                namaPemesan: namaPemesan,
                nomorHp: nomorHp,
                emailPemesan: emailPemesan,
                lokasiOutlet: lokasiOutlet,
                tanggalReservasi: tanggalReservasi,
                waktuReservasi: waktuReservasi,
                jumlahTamu: jumlahTamu,
                areaDuduk: areaDuduk,
                catatanKhusus: catatanKhusus,
                status: 'Menunggu Konfirmasi',
                waktuDibuat: new Date().toISOString()
            };

            // Mengambil data reservasi lama dari localStorage jika ada
            const dataReservasiLama = JSON.parse(localStorage.getItem('table_reservations')) || [];

            // Menambahkan data baru ke dalam array
            dataReservasiLama.push(dataReservasiBaru);

            // Menyimpan kembali array data yang telah diperbarui ke localStorage
            localStorage.setItem('table_reservations', JSON.stringify(dataReservasiLama));

            // Menampilkan notifikasi sukses kepada pengguna
            alert(`Terima kasih ${namaPemesan}, reservasi meja Anda di OishiOppa berhasil disimpan!`);

            // Memasang / mengosongkan kembali isi formulir
            reservationForm.reset();
        });
    }
});