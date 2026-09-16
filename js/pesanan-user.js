// ==========================================================================
// KODE MANAJEMEN STATUS PESANAN PELANGGAN (js/pesanan-user.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('user-orders-list');
    if (!tableBody) return;

    // Tambahkan header 'Aksi' secara dinamis tanpa innerHTML
    const tableHeader = tableBody.closest('table')?.querySelector('thead tr');
    if (tableHeader && tableHeader.children.length === 4) {
        const thAksi = document.createElement('th');
        thAksi.textContent = 'Aksi';
        thAksi.className = 'text-center';
        tableHeader.appendChild(thAksi);
    }

    // Fungsi render data menggunakan DOM Manipulation (createElement & appendChild)
    function renderOrders() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const allOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');

        // Menyaring pesanan milik pengguna yang sedang aktif
        const userOrders = allOrders.filter(order => order.nama === currentUser.nama);

        // Kosongkan isi tabel
        tableBody.textContent = '';

        // Jika tidak ada pesanan aktif
        if (userOrders.length === 0) {
            const trEmpty = document.createElement('tr');
            const tdEmpty = document.createElement('td');
            tdEmpty.colSpan = 5;
            tdEmpty.className = 'empty-orders-msg text-center';
            tdEmpty.textContent = 'Belum ada pesanan aktif. Silakan pilih menu favoritmu terlebih dahulu.';
            
            trEmpty.appendChild(tdEmpty);
            tableBody.appendChild(trEmpty);
            return;
        }

        // Render setiap pesanan dari urutan terbaru
        const reversedOrders = userOrders.slice().reverse();
        reversedOrders.forEach(order => {
            const tr = document.createElement('tr');

            // 1. Kolom ID
            const tdId = document.createElement('td');
            const strongId = document.createElement('strong');
            strongId.className = 'order-id-text';
            strongId.textContent = order.id || '#ORD-001';
            tdId.appendChild(strongId);

            // 2. Kolom Item / Menu
            const tdItem = document.createElement('td');
            const strongItem = document.createElement('strong');
            const jumlahTeks = order.jumlah ? ` (x${order.jumlah})` : '';
            strongItem.textContent = `${order.item || 'Pesanan Makanan'}${jumlahTeks}`;
            tdItem.appendChild(strongItem);

            // 3. Kolom Total Harga
            const tdTotal = document.createElement('td');
            const totalAngka = order.total || 0;
            tdTotal.textContent = `Rp ${totalAngka.toLocaleString('id-ID')}`;

            // 4. Kolom Status
            const tdStatus = document.createElement('td');
            const spanStatus = document.createElement('span');
            const isSelesai = order.status === 'Selesai';
            spanStatus.className = `badge-status ${isSelesai ? 'badge-selesai' : 'badge-pending'}`;
            spanStatus.textContent = isSelesai ? '✅ Selesai' : '⏳ Pending / Diproses';
            tdStatus.appendChild(spanStatus);

            // 5. Kolom Aksi (Tombol Batalkan)
            const tdAksi = document.createElement('td');
            tdAksi.className = 'text-center';

            if (!isSelesai) {
                const btnBatal = document.createElement('button');
                btnBatal.className = 'btn-cancel-order';
                btnBatal.textContent = 'Batalkan';
                btnBatal.setAttribute('data-id', order.id);
                
                // Event Listener Pembatalan
                btnBatal.addEventListener('click', () => {
                    if (confirm(`Apakah Anda yakin ingin membatalkan pesanan ${order.id}?`)) {
                        let updatedOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
                        updatedOrders = updatedOrders.filter(item => item.id !== order.id);
                        localStorage.setItem('customer_orders', JSON.stringify(updatedOrders));

                        alert(`Pesanan ${order.id} berhasil dibatalkan!`);
                        renderOrders();
                    }
                });
                tdAksi.appendChild(btnBatal);
            } else {
                const spanMuted = document.createElement('span');
                spanMuted.className = 'text-muted';
                spanMuted.textContent = '-';
                tdAksi.appendChild(spanMuted);
            }

            // Masukkan seluruh kolom ke dalam baris tabel
            tr.appendChild(tdId);
            tr.appendChild(tdItem);
            tr.appendChild(tdTotal);
            tr.appendChild(tdStatus);
            tr.appendChild(tdAksi);

            tableBody.appendChild(tr);
        });
    }

    renderOrders();
});