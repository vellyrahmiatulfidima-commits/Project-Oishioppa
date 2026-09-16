// ==========================================================================
// KODE MANAJEMEN DASHBOARD ADMIN RESTORAN (js/admin.js)
// ==========================================================================

// Variabel State Pagination
let currentPage = 1;
const itemsPerPage = 4;

// 1. Pengecekan status login admin
const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

if (isLoggedIn !== "true") {
    alert("Akses ditolak! Anda harus login terlebih dahulu.");
    window.location.href = "login.html";
}

// 2. Inisialisasi utama saat struktur DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    initAdminData();
    renderAdminMenuList();
    updateAdminStats();

    // Event Listener Navigasi Pagination Prev & Next
    const btnPrev = document.getElementById('btn-prev-menu');
    const btnNext = document.getElementById('btn-next-menu');

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderAdminMenuList();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            let storedMenu = JSON.parse(localStorage.getItem('custom_menu_list')) || [];
            const totalPages = Math.ceil(storedMenu.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderAdminMenuList();
            }
        });
    }

    // Event handler Form Tambah Menu
    const formAdd = document.getElementById('form-add-menu');
    if (formAdd) {
        formAdd.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('add-nama').value;
            const kategori = document.getElementById('add-kategori').value;
            const asal = document.getElementById('add-asal').value;
            const hargaNum = parseInt(document.getElementById('add-harga').value);

            // Validasi: harga wajib berupa angka dan minimal Rp 10.000
            if (isNaN(hargaNum) || hargaNum < 10000) {
                alert('Harga tidak valid! Harga minimal adalah Rp 10.000.');
                return;
            }

            const symbol = asal === 'jepang' ? '¥' : '₩';
            const converted = Math.round(hargaNum / 100);
            const hargaFormatted = `Rp ${hargaNum.toLocaleString('id-ID')} / ${symbol} ${converted.toLocaleString('id-ID')}`;

            let storedMenu = JSON.parse(localStorage.getItem('custom_menu_list')) || [];
            const maxId = storedMenu.reduce((max, item) => (item.id > max ? item.id : max), 0);
            const nextId = maxId > 0 ? maxId + 1 : 1;

            const newItem = {
                id: nextId,
                nama: nama,
                kategori: kategori,
                asal: asal,
                harga: hargaFormatted,
                query: nama.toLowerCase()
            };

            storedMenu.push(newItem);
            localStorage.setItem('custom_menu_list', JSON.stringify(storedMenu));

            alert(`Menu "${nama}" dengan ID #${nextId} berhasil ditambahkan!`);
            formAdd.reset();

            // Pindah otomatis ke halaman terakhir untuk melihat menu baru
            currentPage = Math.ceil(storedMenu.length / itemsPerPage) || 1;
            renderAdminMenuList();
        });
    }

    // Event Handler Tombol Logout Admin
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar dari Dashboard Admin?')) {
                localStorage.removeItem("isAdminLoggedIn");
                window.location.href = "../index.html";
            }
        });
    }
});

async function initAdminData() {
    if (!localStorage.getItem('custom_menu_list')) {
        let initialData = [];
        if (typeof fetchMenuFromFirebase === 'function') {
            initialData = await fetchMenuFromFirebase();
        }
        localStorage.setItem('custom_menu_list', JSON.stringify(initialData));
        renderAdminMenuList();
    }
}

// 3. Render Daftar Menu dengan Sistem Pagination
function renderAdminMenuList() {
    const tableBody = document.getElementById('admin-menu-list');
    const statTotal = document.getElementById('stat-total-menu');
    const pageInfo = document.getElementById('menu-page-info');
    const btnPrev = document.getElementById('btn-prev-menu');
    const btnNext = document.getElementById('btn-next-menu');

    let storedMenu = JSON.parse(localStorage.getItem('custom_menu_list')) || [];

    if (!tableBody) return;
    if (statTotal) statTotal.textContent = storedMenu.length;

    tableBody.textContent = '';

    // Jika menu kosong
    if (storedMenu.length === 0) {
        const trEmpty = document.createElement('tr');
        const tdEmpty = document.createElement('td');
        tdEmpty.colSpan = 6;
        tdEmpty.style.textAlign = 'center';
        tdEmpty.textContent = 'Belum ada data menu.';
        trEmpty.appendChild(tdEmpty);
        tableBody.appendChild(trEmpty);

        if (pageInfo) pageInfo.textContent = 'Halaman 0 dari 0';
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        return;
    }

    // Hitung pembagian halaman
    const totalPages = Math.ceil(storedMenu.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMenu = storedMenu.slice(startIndex, endIndex);

    // Render baris data yang dislice
    paginatedMenu.forEach((item) => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = `#${item.id}`;

        const tdNama = document.createElement('td');
        const strongNama = document.createElement('strong');
        strongNama.textContent = item.nama;
        tdNama.appendChild(strongNama);

        const tdKategori = document.createElement('td');
        tdKategori.textContent = item.kategori;
        tdKategori.style.textTransform = 'capitalize';

        const tdAsal = document.createElement('td');
        tdAsal.textContent = item.asal === 'jepang' ? '🇯🇵 Jepang' : '🇰🇷 Korea';

        const tdHarga = document.createElement('td');
        tdHarga.textContent = item.harga;

        const tdAksi = document.createElement('td');
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Hapus';
        btnDelete.addEventListener('click', () => deleteMenuItem(item.id));
        tdAksi.appendChild(btnDelete);

        tr.appendChild(tdId);
        tr.appendChild(tdNama);
        tr.appendChild(tdKategori);
        tr.appendChild(tdAsal);
        tr.appendChild(tdHarga);
        tr.appendChild(tdAksi);

        tableBody.appendChild(tr);
    });

    // Update Teks & Status Tombol Prev/Next
    if (pageInfo) pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
}

function deleteMenuItem(id) {
    let storedMenu = JSON.parse(localStorage.getItem('custom_menu_list')) || [];
    const targetItem = storedMenu.find(item => item.id === id);

    if (targetItem && confirm(`Apakah Anda yakin ingin menghapus "${targetItem.nama}"?`)) {
        storedMenu = storedMenu.filter(item => item.id !== id);
        localStorage.setItem('custom_menu_list', JSON.stringify(storedMenu));

        // Penyesuaian halaman saat item di hapus
        const totalPages = Math.ceil(storedMenu.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        renderAdminMenuList();
    }
}



function updateAdminStats() {
    const orders = JSON.parse(localStorage.getItem('customer_orders')) || [];

    const statPesanan = document.getElementById('stat-total-orders');
    const statPendapatan = document.getElementById('stat-total-revenue');

    const totalPesanan = orders.length;
    const totalPendapatan = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

    if (statPesanan) {
        statPesanan.textContent = `${totalPesanan} Pesanan`;
    }
    if (statPendapatan) {
        statPendapatan.textContent = `Rp ${totalPendapatan.toLocaleString('id-ID')}`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Menutup menu otomatis ketika salah satu tautan diklik di HP
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }
});