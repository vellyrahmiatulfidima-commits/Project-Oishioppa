let dataMenu = [];
let kategoriAktif = 'semua';
let asalAktif = 'semua';

// Data menu cadangan (dipakai kalau Firebase gagal diakses / datanya kosong)
const fallbackMenu = [
    { id: 'fb1', nama: 'Salmon Sashimi', kategori: 'makanan', asal: 'jepang', harga: 'Rp 85.000 / ¥ 850', image: '' },
    { id: 'fb2', nama: 'Chicken Katsu', kategori: 'makanan', asal: 'jepang', harga: 'Rp 45.000 / ¥ 450', image: '' },
    { id: 'fb3', nama: 'Bibimbap', kategori: 'makanan', asal: 'korea', harga: 'Rp 55.000 / ₩ 550', image: '' },
    { id: 'fb4', nama: 'Tteokbokki', kategori: 'makanan', asal: 'korea', harga: 'Rp 40.000 / ₩ 400', image: '' }
];

// 1. Ambil Data Menu dari Firebase Realtime Database
async function fetchMenuFromFirebase() {
    try {
        const response = await fetch('https://api--menu-ly-default-rtdb.firebaseio.com/.json');
        const data = await response.json();

        if (!data) return fallbackMenu;

        let items = [];
        if (Array.isArray(data)) {
            items = data.filter(Boolean);
        } else {
            items = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        }

        return items.length > 0 ? items : fallbackMenu;
    } catch (error) {
        console.error('Gagal mengambil data dari Firebase, menggunakan data fallback:', error);
        return fallbackMenu;
    }
}

function getImageUrl(item) {
    return item.image || item.gambar || item.foto || 'https://via.placeholder.com/500x350?text=No+Image';
}

// 2. Render Tampilan Preview
async function renderRegionalPreview() {
    const previewContainer = document.getElementById('regional-preview-container');
    if (!previewContainer) return;

    previewContainer.textContent = '';
    const pLoading = document.createElement('p');
    pLoading.className = 'text-center full-width';
    pLoading.textContent = 'Memuat menu...';
    previewContainer.appendChild(pLoading);

    dataMenu = await fetchMenuFromFirebase();

    const menuJepang = dataMenu.find(item => item.asal && item.asal.toLowerCase() === 'jepang');
    const menuKorea = dataMenu.find(item => item.asal && item.asal.toLowerCase() === 'korea');
    const previewItems = [menuJepang, menuKorea].filter(Boolean);

    previewContainer.textContent = '';

    if (previewItems.length === 0) {
        const pEmpty = document.createElement('p');
        pEmpty.className = 'text-center full-width';
        pEmpty.textContent = 'Menu preview tidak tersedia.';
        previewContainer.appendChild(pEmpty);
        return;
    }

    previewItems.forEach(item => {
        const isJepang = item.asal.toLowerCase() === 'jepang';

        const card = document.createElement('div');
        card.className = 'regional-card scroll-reveal';

        const header = document.createElement('div');
        header.className = 'regional-header';
        const h3 = document.createElement('h3');
        h3.textContent = isJepang ? '🍱 Kuliner Khas Jepang' : '🥘 Kuliner Khas Korea';
        header.appendChild(h3);

        const body = document.createElement('div');
        body.className = 'regional-body';

        const img = document.createElement('img');
        img.src = getImageUrl(item);
        img.alt = item.nama;

        const h4 = document.createElement('h4');
        h4.textContent = item.nama;

        const pPrice = document.createElement('p');
        pPrice.className = 'price';
        pPrice.textContent = item.harga;

        const btnLink = document.createElement('a');
        btnLink.href = `menu.html?view=all&asal=${item.asal.toLowerCase()}`;
        btnLink.className = 'btn-show-full btn-block-text';
        btnLink.textContent = `Tekan ini untuk lihat menu lengkap ${isJepang ? 'Jepang' : 'Korea'} ➔`;

        body.appendChild(img);
        body.appendChild(h4);
        body.appendChild(pPrice);
        body.appendChild(btnLink);

        card.appendChild(header);
        card.appendChild(body);

        previewContainer.appendChild(card);
    });

    checkScroll();
}

// 3. Render Semua Menu Lengkap
async function renderMenu() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    if (dataMenu.length === 0) {
        menuGrid.textContent = '';
        const pLoading = document.createElement('p');
        pLoading.className = 'text-center full-width pad-2';
        pLoading.textContent = 'Memuat daftar menu...';
        menuGrid.appendChild(pLoading);
        dataMenu = await fetchMenuFromFirebase();
    }

    const searchInput = document.getElementById('search-input')?.value.toLowerCase() || '';

    const filteredMenu = dataMenu.filter(item => {
        const itemKategori = (item.kategori || '').toLowerCase();
        const itemAsal = (item.asal || '').toLowerCase();
        const itemNama = (item.nama || '').toLowerCase();

        const cocokKategori = kategoriAktif === 'semua' || itemKategori === kategoriAktif;
        const cocokAsal = asalAktif === 'semua' || itemAsal === asalAktif;
        const cocokSearch = itemNama.includes(searchInput);

        return cocokKategori && cocokAsal && cocokSearch;
    });

    menuGrid.textContent = '';

    if (filteredMenu.length === 0) {
        const pEmpty = document.createElement('p');
        pEmpty.className = 'empty text-center full-width pad-2';
        pEmpty.textContent = 'Menu tidak ditemukan.';
        menuGrid.appendChild(pEmpty);
        return;
    }

    filteredMenu.forEach(item => {
        const hargaStr = String(item.harga || '');
        const hargaMurni = parseInt(hargaStr.split('/')[0].replace(/[^0-9]/g, '')) || 0;
        const asalFormatted = (item.asal || '').toLowerCase();

        const card = document.createElement('div');
        card.className = 'menu-card scroll-reveal';
        card.setAttribute('data-category', item.kategori);
        card.setAttribute('data-asal', item.asal);

        const cardImg = document.createElement('div');
        cardImg.className = 'card-img';
        const img = document.createElement('img');
        img.src = getImageUrl(item);
        img.alt = item.nama;
        img.loading = 'lazy';
        cardImg.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const badge = document.createElement('span');
        badge.className = `badge-region ${asalFormatted}`;
        badge.textContent = asalFormatted === 'jepang' ? '🇯🇵 Jepang' : '🇰🇷 Korea';

        const h3 = document.createElement('h3');
        h3.textContent = item.nama;

        const pPrice = document.createElement('p');
        pPrice.className = 'price';
        pPrice.textContent = item.harga;

        const btnOrder = document.createElement('button');
        btnOrder.type = 'button';
        btnOrder.className = 'btn-order';
        btnOrder.textContent = 'Pesan Sekarang';

        // Event Listener dengan Pemeriksaan Status Login Pelanggan
        btnOrder.addEventListener('click', () => {
            const isUserLoggedIn = localStorage.getItem('isUserLoggedIn');

            // 1. Jika Pelanggan Belum Login
            if (isUserLoggedIn !== 'true') {
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.add('active');
                } return;
            }

            // 2. Jika Pelanggan Sudah Login -> buka modal struk (tanpa pindah halaman)
            openOrderModal(item.nama, hargaMurni);
        });
        cardBody.appendChild(badge);
        cardBody.appendChild(h3);
        cardBody.appendChild(pPrice);
        cardBody.appendChild(btnOrder);

        card.appendChild(cardImg);
        card.appendChild(cardBody);

        menuGrid.appendChild(card);
    });

    checkScroll();
}

function debounce(func, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

function checkScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - 50) {
            reveal.classList.add('active');
        }
    });
}

// Inisialisasi Event Listener & Tampilan Halaman
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isFullView = urlParams.has('view') || urlParams.has('asal');

    const previewSection = document.getElementById('preview-section');
    const fullMenuSection = document.getElementById('full-menu-section');
    const restoSection = document.getElementById('resto-ambiance-section');

    if (isFullView) {
        if (previewSection) previewSection.classList.add('is-hidden');
        if (restoSection) restoSection.classList.add('is-hidden');
        if (fullMenuSection) {
            fullMenuSection.classList.remove('is-hidden');
            fullMenuSection.classList.remove('full-menu-hidden');
        }

        const asalParam = urlParams.get('asal');
        if (asalParam) {
            asalAktif = asalParam.toLowerCase();
            const btnAsal = document.getElementById(`btn-asal-${asalParam.toLowerCase()}`);
            if (btnAsal) {
                document.querySelectorAll('.region-buttons .btn-filter').forEach(btn => btn.classList.remove('active'));
                btnAsal.classList.add('active');
            }
        }

        renderMenu();
    } else {
        if (fullMenuSection) fullMenuSection.classList.add('is-hidden');
        if (previewSection) previewSection.classList.remove('is-hidden');
        if (restoSection) restoSection.classList.remove('is-hidden');

        renderRegionalPreview();
    }

    // Event Listener untuk Tombol Filter Daerah (Jepang / Korea / Semua)
    document.querySelectorAll('.region-buttons .btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            asalAktif = target.getAttribute('data-asal') || 'semua';
            document.querySelectorAll('.region-buttons .btn-filter').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            renderMenu();
        });
    });

    // Event Listener untuk Tombol Filter Kategori (Makanan / Minuman / Semua)
    document.querySelectorAll('.category-buttons .btn-filter').forEach(btn => {
        if (!btn.hasAttribute('data-asal')) {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                kategoriAktif = target.getAttribute('data-kategori') || 'semua';
                document.querySelectorAll('.category-buttons .btn-filter:not([data-asal])').forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                renderMenu();
            });
        }
    });

    // Event Listener untuk Pencarian
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            renderMenu();
        }, 300));
    }

    setTimeout(checkScroll, 100);
});

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);