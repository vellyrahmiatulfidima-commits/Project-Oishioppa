// ini file buat modal "Pesan Sekarang" di halaman menu
// isinya: form pemesanan (nama, jumlah, metode bayar) + struk hasil pesanan
// dulu pake prompt() sama alert(), sekarang diganti form beneran biar gak jelek

// nama resto yang muncul di struk
const restoNameModal = "OishiOppa'lyy";

// daftar diskon, urut dari yang paling besar minimalnya
// nanti dicek dari atas, yang kena duluan itu yang dipake
const daftarDiskonModal = [
    { minimal: 100000, potong: 10000 },
    { minimal: 50000, potong: 5000 }
];

// nyimpen menu apa yang lagi dipesan (nama sama harganya)
// ini keisi pas tombol "Pesan Sekarang" diklik, dari fungsi openOrderModal di bawah
let pesananAktif = { nama: null, harga: null };

// hitung biaya tambahan sesuai metode bayar yang dipilih
// CASH gratis, transfer sama e-wallet ada biaya admin/layanan
function hitungBiayaMetodeModal(metode) {
    let biaya = 0;
    let ket = "";
    switch ((metode || "").toUpperCase()) {
        case "CASH":
            biaya = 0;
            ket = "Tunai (Cash)";
            break;
        case "TRANSFER":
            biaya = 2500;
            ket = "Transfer Bank (+Rp 2.500 Admin)";
            break;
        case "E-WALLET":
            biaya = 1000;
            ket = "E-Wallet (+Rp 1.000 Layanan)";
            break;
        default:
            biaya = 0;
            ket = "Tunai / Standard";
            break;
    }
    return { biaya: biaya, keterangan: ket };
}

// cek subtotal masuk potongan diskon yang mana (kalau ada)
function hitungDiskonModal(subtotal) {
    let potong = 0;
    for (let i = 0; i < daftarDiskonModal.length; i++) {
        if (subtotal >= daftarDiskonModal[i].minimal) {
            potong = daftarDiskonModal[i].potong;
            break; // udah ketemu, gak usah lanjut cek yang lain
        }
    }
    return potong;
}

// biar angka jadi format duit indo, contoh: 50000 -> "Rp 50.000"
function formatRupiah(angka) {
    return "Rp " + Number(angka || 0).toLocaleString('id-ID');
}

// ambil radio button metode bayar yang lagi dicentang
// kalo somehow gak ada yang kepilih, default-in ke CASH aja
function getMetodeTerpilih() {
    const checked = document.querySelector('#payment-options input[name="metode"]:checked');
    return checked ? checked.value : 'CASH';
}

// ini yang bikin kotak "ringkasan biaya" di form ke-update otomatis
// dipanggil tiap kali user ganti jumlah pesanan atau ganti metode bayar
function updateOrderFormSummary() {
    const summaryBox = document.getElementById('order-form-summary');
    if (!summaryBox || !pesananAktif.harga) return; // belum ada menu yg dipilih, gak usah lanjut

    const jumlahInput = document.getElementById('order-jumlah');
    let jumlah = Number(jumlahInput.value);
    if (isNaN(jumlah) || jumlah <= 0) jumlah = 0; // biar gak error kalo user ngetik aneh-aneh

    const metode = getMetodeTerpilih();
    const dataMetode = hitungBiayaMetodeModal(metode);
    const subtotal = pesananAktif.harga * jumlah;
    const diskon = hitungDiskonModal(subtotal);
    const total = Math.max(subtotal + dataMetode.biaya - diskon, 0);

    // bersihin dulu isi lama di summaryBox
    // gak pake innerHTML = '' karena itu dilarang, jadi hapus manual satu-satu
    while (summaryBox.firstChild) {
        summaryBox.removeChild(summaryBox.firstChild);
    }

    // fungsi kecil buat bikin 1 baris ringkasan (label kiri, nilai kanan)
    // pake createElement + appendChild semua, sesuai ketentuan (gak boleh innerHTML)
    const buatBarisSummary = (label, nilai, extraClass = '') => {
        const row = document.createElement('div');
        row.className = extraClass ? `summary-row ${extraClass}` : 'summary-row';

        const spanLabel = document.createElement('span');
        spanLabel.textContent = label;

        const spanNilai = document.createElement('span');
        spanNilai.textContent = nilai;

        row.appendChild(spanLabel);
        row.appendChild(spanNilai);
        return row;
    };

    // baris subtotal, selalu muncul
    summaryBox.appendChild(buatBarisSummary(`Subtotal (${jumlah}x)`, formatRupiah(subtotal)));

    // baris biaya admin/layanan, cuma muncul kalo metodenya bukan cash
    if (dataMetode.biaya > 0) {
        const labelBiaya = metode === 'TRANSFER' ? 'Biaya Admin' : 'Biaya Layanan';
        summaryBox.appendChild(buatBarisSummary(labelBiaya, `+${formatRupiah(dataMetode.biaya)}`));
    }

    // baris diskon, cuma muncul kalo emang dapet diskon
    if (diskon > 0) {
        summaryBox.appendChild(buatBarisSummary('Diskon', `-${formatRupiah(diskon)}`, 'summary-discount'));
    }

    // baris total, paling bawah biar keliatan jelas
    summaryBox.appendChild(buatBarisSummary('Total Bayar', formatRupiah(total), 'summary-total'));
}

// buat ngosongin semua pesan error di form (dipanggil pas modal dibuka ulang / mau submit lagi)
function clearFormErrors() {
    ['error-nama', 'error-jumlah', 'error-form-general'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    ['order-nama', 'order-jumlah'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('input-error'); // ilangin border merah juga
    });
}

// nampilin pesan error di bawah salah satu input, sekalian kasih border merah
function showFieldError(inputId, errorId, pesan) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add('input-error');
    if (errorEl) errorEl.textContent = pesan;
}

// INI FUNGSI UTAMA, dipanggil dari get-menu.js pas tombol "Pesan Sekarang" diklik
// tugasnya: buka modal, tampilin form (bukan prompt/alert kayak dulu)
function openOrderModal(namaMenu, hargaMenu) {
    const modal = document.getElementById('detail-modal');
    const formView = document.getElementById('order-form-view');
    const receiptView = document.getElementById('order-receipt-view');
    if (!modal || !formView || !receiptView) return; // elemen ga ketemu, jangan lanjut

    if (!namaMenu || !hargaMenu) {
        return; // data menu kosong, gak usah buka modal
    }

    // simpen menu yang lagi dipesan biar bisa dipake di fungsi lain (submit, dll)
    pesananAktif = { nama: namaMenu, harga: hargaMenu };

    // tulis nama menu + harga di sub-judul form, biar user tau lagi pesan apa
    const subtitle = document.getElementById('order-form-menu-name');
    if (subtitle) subtitle.textContent = `${namaMenu} — ${formatRupiah(hargaMenu)} / porsi`;

    // kalo user udah login, nama pemesan langsung keisi otomatis dari akunnya
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const inputNama = document.getElementById('order-nama');
    if (inputNama) {
        inputNama.value = currentUser ? currentUser.nama : '';
    }

    // tiap buka modal baru, jumlah balik ke 1 & metode bayar balik ke cash
    const inputJumlah = document.getElementById('order-jumlah');
    if (inputJumlah) inputJumlah.value = 1;
    const radioCash = document.querySelector('#payment-options input[value="CASH"]');
    if (radioCash) radioCash.checked = true;

    clearFormErrors();
    updateOrderFormSummary(); // langsung tampilin ringkasan awal (jumlah 1, cash)

    // pastiin yang keliatan itu tahap FORM dulu, bukan struk (jaga-jaga kalo user
    // sebelumnya sempet sampe di struk terus buka modal lagi buat menu lain)
    formView.classList.remove('hidden');
    receiptView.classList.add('hidden');

    modal.classList.add('active');

    if (inputNama) inputNama.focus(); // biar kursor langsung di kolom nama
}

// dipanggil pas form di-submit (klik tombol "Konfirmasi Pesanan")
// alurnya: validasi dulu -> kalo lolos baru diproses & disimpen -> tampilin struk
function submitOrderForm(event) {
    event.preventDefault(); // biar halaman gak reload kayak submit form biasa
    clearFormErrors();

    const inputNama = document.getElementById('order-nama');
    const inputJumlah = document.getElementById('order-jumlah');

    const namaPemesan = (inputNama.value || '').trim();
    const jumlah = Number(inputJumlah.value);

    let valid = true;

    // nama gak boleh kosong
    if (!namaPemesan) {
        showFieldError('order-nama', 'error-nama', 'Nama pemesan wajib diisi.');
        valid = false;
    }

    // jumlah harus angka bulat positif
    if (isNaN(jumlah) || jumlah <= 0 || !Number.isInteger(jumlah)) {
        showFieldError('order-jumlah', 'error-jumlah', 'Jumlah pesanan harus angka bulat lebih dari 0.');
        valid = false;
    }

    // jaga-jaga kalo data menu somehow ilang/belum kepilih
    if (!pesananAktif.nama || !pesananAktif.harga) {
        const generalError = document.getElementById('error-form-general');
        if (generalError) generalError.textContent = 'Belum ada data menu. Silakan pilih menu terlebih dahulu.';
        valid = false;
    }

    if (!valid) return; // ada yang error, stop di sini, jangan lanjut ke bawah

    // hitung semua biaya buat disimpen & ditampilin di struk
    const metodeBayar = getMetodeTerpilih();
    const dataMetode = hitungBiayaMetodeModal(metodeBayar);
    const subtotal = pesananAktif.harga * jumlah;
    const diskon = hitungDiskonModal(subtotal);
    const totalBayar = (subtotal + dataMetode.biaya) - diskon;
    const statusPelanggan = (totalBayar >= 100000) ? "Pelanggan VIP" : "Pelanggan Reguler";

    // ambil pesanan yang udah ada dulu, terus tambahin pesanan baru ini
    // ini yang dipake juga sama halaman admin & pesanan-user buat nampilin data
    let existingOrders = JSON.parse(localStorage.getItem('customer_orders')) || [];
    const newOrder = {
        id: "#ORD-" + String(existingOrders.length + 1).padStart(3, '0'), // contoh: #ORD-004
        nama: namaPemesan,
        item: pesananAktif.nama,
        jumlah: jumlah,
        total: totalBayar,
        status: "Sedang Dimasak"
    };
    existingOrders.push(newOrder);
    localStorage.setItem('customer_orders', JSON.stringify(existingOrders));

    // udah kesimpen, sekarang tampilin struknya
    renderReceipt(newOrder, namaPemesan, jumlah, dataMetode, subtotal, diskon, totalBayar, statusPelanggan);
}

// bikin tampilan struk dari data pesanan yang baru aja masuk,
// terus modal-nya pindah dari tahap FORM ke tahap STRUK
function renderReceipt(newOrder, namaPemesan, jumlah, dataMetode, subtotal, diskon, totalBayar, statusPelanggan) {
    const formView = document.getElementById('order-form-view');
    const receiptView = document.getElementById('order-receipt-view');
    const receiptContainer = document.getElementById('modal-receipt-box');
    const successBanner = document.getElementById('order-success-banner');
    if (!receiptContainer) return;

    receiptContainer.textContent = ''; // bersihin struk lama sebelum diisi yang baru

    // fungsi kecil buat 1 baris di struk (label kiri, value kanan)
    const createRow = (label, value, extraClass = '') => {
        const row = document.createElement('div');
        row.className = `receipt-row ${extraClass}`;

        const spanLabel = document.createElement('span');
        spanLabel.className = 'receipt-label';
        spanLabel.textContent = label;

        const spanValue = document.createElement('span');
        spanValue.className = 'receipt-value';
        spanValue.textContent = value;

        row.appendChild(spanLabel);
        row.appendChild(spanValue);
        return row;
    };

    // susun baris-baris struknya dari atas ke bawah
    receiptContainer.appendChild(createRow('Restoran', restoNameModal));
    receiptContainer.appendChild(createRow('No. Pesanan', newOrder.id));
    receiptContainer.appendChild(createRow('Nama Pemesan', namaPemesan));
    receiptContainer.appendChild(createRow('Item Pesanan', `${pesananAktif.nama} (x${jumlah})`));
    receiptContainer.appendChild(createRow('Harga Satuan', formatRupiah(pesananAktif.harga)));
    receiptContainer.appendChild(createRow('Subtotal', formatRupiah(subtotal)));
    receiptContainer.appendChild(createRow('Metode Pembayaran', dataMetode.keterangan));

    // baris diskon cuma muncul kalo emang ada potongan
    if (diskon > 0) {
        receiptContainer.appendChild(createRow('Diskon Potongan', `-${formatRupiah(diskon)}`, 'row-discount'));
    }

    // garis pemisah sebelum total, biar keliatan jelas mana yang final
    const hr = document.createElement('hr');
    hr.className = 'receipt-divider';
    receiptContainer.appendChild(hr);

    receiptContainer.appendChild(createRow('Total Bayar', formatRupiah(totalBayar), 'row-total'));
    receiptContainer.appendChild(createRow('Status Pelanggan', statusPelanggan, 'row-status'));

    // ucapan terima kasih, ini yang gantiin alert() dulu
    if (successBanner) {
        successBanner.textContent = `Terima kasih ${namaPemesan}! Pesanan Anda telah diteruskan ke dapur admin.`;
    }

    // sembunyiin form, munculin struk
    if (formView) formView.classList.add('hidden');
    if (receiptView) receiptView.classList.remove('hidden');
}

// pasang semua event listener setelah halaman selesai kebuka
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('detail-modal');

    // tombol close (×) ada 2, satu nempel di header form, satu di header struk
    // (yang keliatan cuma satu sesuai tahap aktif), jadi ambil semuanya pake class
    const closeButtons = document.querySelectorAll('#detail-modal .close-btn');
    const btnCloseFooter = document.getElementById('btn-close-receipt'); // tombol "Pesan Lagi"
    const orderForm = document.getElementById('order-form');
    const inputJumlah = document.getElementById('order-jumlah');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const paymentOptions = document.getElementById('payment-options');

    function closeDetailModal() {
        if (modal) modal.classList.remove('active');
    }

    // klik tombol × di manapun, atau klik "Pesan Lagi" -> modal ketutup
    closeButtons.forEach((btn) => btn.addEventListener('click', closeDetailModal));
    if (btnCloseFooter) btnCloseFooter.addEventListener('click', closeDetailModal);

    // klik di area gelap luar kartu juga nutup modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeDetailModal();
    });

    // pas form disubmit, jalanin proses validasi & simpen pesanan
    if (orderForm) orderForm.addEventListener('submit', submitOrderForm);

    // tiap jumlah/metode bayar diubah, ringkasan biaya ikut ke-update
    if (inputJumlah) inputJumlah.addEventListener('input', updateOrderFormSummary);
    if (paymentOptions) paymentOptions.addEventListener('change', updateOrderFormSummary);

    // tombol minus buat ngurangin jumlah, gak boleh sampe di bawah 1
    if (qtyMinus) qtyMinus.addEventListener('click', () => {
        const val = Math.max(1, (Number(inputJumlah.value) || 1) - 1);
        inputJumlah.value = val;
        updateOrderFormSummary();
    });

    // tombol plus buat nambahin jumlah
    if (qtyPlus) qtyPlus.addEventListener('click', () => {
        const val = (Number(inputJumlah.value) || 0) + 1;
        inputJumlah.value = val;
        updateOrderFormSummary();
    });
});
