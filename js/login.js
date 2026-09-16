// ==========================================================================
// KODE LOGIKA OTENTIKASI LOGIN ADMIN
// ==========================================================================

// Memastikan struktur DOM siap sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function () {
    const formLoginAdmin = document.getElementById('form-login-admin');
    const errorMessage = document.getElementById('error-message');

    if (formLoginAdmin) {
        formLoginAdmin.addEventListener('submit', function (event) {
            event.preventDefault(); // Mencegah form melakukan refresh otomatis

            // Penggunaan const untuk variabel lokal (mencegah pelanggaran var)
            const usernameInput = document.getElementById('admin-username').value;
            const passwordInput = document.getElementById('admin-password').value;

            // Kredensial rahasia pemilik restoran
            const adminUser = "velly";
            const adminPass = "admin1412";

            // Validasi input akun
            if (usernameInput === adminUser && passwordInput === adminPass) {
                // Menyimpan status login di browser via localStorage
                localStorage.setItem("isAdminLoggedIn", "true");
                
                // Pindah ke halaman dashboard admin
                window.location.href = "admin.html";
            } else {
                // Manipulasi DOM pesan error menggunakan textContent (bukan innerHTML)
                errorMessage.textContent = "Username atau password yang Anda masukkan salah!";
            }
        });
    }
});