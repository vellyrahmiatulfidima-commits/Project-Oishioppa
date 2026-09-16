// ==========================================================================
// LOGIKA LIVE MONITORING PESANAN DAPUR (js/live-orders.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    renderLiveOrders();

    const btnReset = document.getElementById('btn-reset-orders');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pesanan?')) {
                localStorage.removeItem('customer_orders');
                renderLiveOrders();
            }
        });
    }
});

function renderLiveOrders() {
    const tableBody = document.getElementById('live-order-list');
    if (!tableBody) return;

    const orders = JSON.parse(localStorage.getItem('customer_orders')) || [];
    tableBody.textContent = '';

    if (orders.length === 0) {
        const trEmpty = document.createElement('tr');
        const tdEmpty = document.createElement('td');
        tdEmpty.colSpan = 6;
        tdEmpty.style.textAlign = 'center';
        tdEmpty.textContent = 'Belum ada pesanan masuk.';
        trEmpty.appendChild(tdEmpty);
        tableBody.appendChild(trEmpty);
        return;
    }

    orders.forEach((order, index) => {
        const tr = document.createElement('tr');

        const tdNo = document.createElement('td');
        tdNo.textContent = order.id || `#ORD-${index + 1}`;

        const tdPemesan = document.createElement('td');
        tdPemesan.textContent = order.nama || 'Pelanggan';

        const tdItem = document.createElement('td');
        tdItem.textContent = order.item || '-';

        const tdTotal = document.createElement('td');
        const totalHarga = Number(order.total) || 0;
        tdTotal.textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;

        const tdStatus = document.createElement('td');
        const spanStatus = document.createElement('span');
        spanStatus.className = `status-badge ${getBadgeClass(order.status)}`;
        spanStatus.textContent = order.status || 'Pending';
        tdStatus.appendChild(spanStatus);

        const tdAksi = document.createElement('td');
        const selectStatus = document.createElement('select');
        selectStatus.className = 'admin-select';

        const statuses = ['Memasak', 'Siap Disajikan', 'Selesai'];
        statuses.forEach(st => {
            const opt = document.createElement('option');
            opt.value = st;
            opt.textContent = st;
            if (order.status === st) opt.selected = true;
            selectStatus.appendChild(opt);
        });

        selectStatus.addEventListener('change', (e) => {
            updateOrderStatus(index, e.target.value);
        });

        tdAksi.appendChild(selectStatus);

        tr.appendChild(tdNo);
        tr.appendChild(tdPemesan);
        tr.appendChild(tdItem);
        tr.appendChild(tdTotal);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAksi);

        tableBody.appendChild(tr);
    });
}

function updateOrderStatus(index, newStatus) {
    const orders = JSON.parse(localStorage.getItem('customer_orders')) || [];
    if (orders[index]) {
        orders[index].status = newStatus;
        localStorage.setItem('customer_orders', JSON.stringify(orders));
        renderLiveOrders();
    }
}

function getBadgeClass(status) {
    switch (status) {
        case 'Memasak': return 'badge-cooking';
        case 'Siap Disajikan': return 'badge-ready';
        case 'Selesai': return 'badge-done';
        default: return 'badge-pending';
    }
}