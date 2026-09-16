// Menunggu seluruh DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    // File ini dipakai bersama oleh index.html (root) dan halaman lain (folder html/),
    // sehingga path redirect ke index.html/menu.html perlu disesuaikan posisinya
    const inHtmlFolder = window.location.pathname.includes("/html/");

    // ================== Pengambilan Elemen DOM ==================
    const loginModal = document.getElementById("login-modal");
    const closeBtn = document.getElementById("close-login-btn");
    const formAuth = document.getElementById("form-user-auth");
    const btnUserTrigger = document.getElementById("btn-login-user-trigger");

    const userContainer = document.getElementById("user-status-container");
    const userNameSpan = document.getElementById("user-display-name");
    const bannerActionGroup = document.getElementById("banner-action-group");

    // Elemen khusus Login / Registrasi
    const authTitle = document.getElementById("auth-title");
    const authSubtitle = document.getElementById("auth-subtitle");
    const authMessageContainer = document.getElementById("auth-message-container");

    const groupNama = document.getElementById("group-nama");
    const groupConfirmPassword = document.getElementById("group-confirm-password");
    const loginOptions = document.getElementById("login-options");

    const inputNama = document.getElementById("user-nama");
    const inputUsername = document.getElementById("user-username");
    const inputPassword = document.getElementById("user-password");
    const inputConfirmPassword = document.getElementById("user-confirm-password");

    const btnSubmitAuth = document.getElementById("btn-submit-auth");
    const switcherText = document.getElementById("switcher-text");
    const toggleAuthMode = document.getElementById("toggle-auth-mode");

    // Mode saat ini: "login" atau "register"
    let authMode = "login";

    // ================== Helper: Tampilkan Pesan (DOM Manipulation) ==================
    function showMessage(text, type) {
        if (!authMessageContainer) return;
        clearMessage();

        const pesan = document.createElement("p");
        pesan.className = "auth-message " + (type || "error");
        pesan.textContent = text;
        authMessageContainer.appendChild(pesan);
    }

    function clearMessage() {
        if (!authMessageContainer) return;
        while (authMessageContainer.firstChild) {
            authMessageContainer.removeChild(authMessageContainer.firstChild);
        }
    }

    // ================== Helper: Data Pengguna Terdaftar ==================
    function getRegisteredUsers() {
        return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    }

    function saveRegisteredUsers(users) {
        localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    // ================== Ganti Mode Login <-> Register ==================
    function setAuthMode(mode) {
        authMode = mode;
        clearMessage();
        if (formAuth) formAuth.reset();

        if (mode === "register") {
            if (authTitle) authTitle.textContent = "Daftar Akun Baru";
            if (authSubtitle) authSubtitle.textContent = "Lengkapi data di bawah untuk membuat akun.";
            if (groupNama) groupNama.classList.remove("hidden");
            if (groupConfirmPassword) groupConfirmPassword.classList.remove("hidden");
            if (loginOptions) loginOptions.classList.add("hidden");
            if (btnSubmitAuth) btnSubmitAuth.textContent = "Daftar Sekarang 📝";
            if (switcherText) switcherText.textContent = "Sudah punya akun?";
            if (toggleAuthMode) toggleAuthMode.textContent = "Masuk di sini";
            if (inputNama) inputNama.setAttribute("required", "required");
            if (inputConfirmPassword) inputConfirmPassword.setAttribute("required", "required");
        } else {
            if (authTitle) authTitle.textContent = "Akun Pelanggan";
            if (authSubtitle) authSubtitle.textContent = "Silakan masuk untuk melanjutkan pemesanan.";
            if (groupNama) groupNama.classList.add("hidden");
            if (groupConfirmPassword) groupConfirmPassword.classList.add("hidden");
            if (loginOptions) loginOptions.classList.remove("hidden");
            if (btnSubmitAuth) btnSubmitAuth.textContent = "Masuk Sekarang 🥢";
            if (switcherText) switcherText.textContent = "Belum punya akun?";
            if (toggleAuthMode) toggleAuthMode.textContent = "Daftar Sekarang";
            if (inputNama) inputNama.removeAttribute("required");
            if (inputConfirmPassword) inputConfirmPassword.removeAttribute("required");
        }
    }

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener("click", function (e) {
            e.preventDefault();
            setAuthMode(authMode === "login" ? "register" : "login");
        });
    }

    if (formAuth) {
        setAuthMode("login");
    }

    // ================== Fungsi Cek Status Login ==================
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

        if (isLoggedIn && userContainer && userNameSpan) {
            userNameSpan.textContent = "👤 " + (currentUser.nama || "Pelanggan");
            userContainer.classList.remove("hidden");
            userContainer.style.removeProperty("display");
        } else {
            if (userContainer) {
                userContainer.classList.add("hidden");
                userContainer.style.setProperty("display", "none", "important");
            }
        }

        if (bannerActionGroup) {
            bannerActionGroup.classList.remove("hidden");
            bannerActionGroup.style.removeProperty("display");
        }
    }

    checkLoginStatus();

    // ================== Fungsi Modal ==================
    function openModal() {
        if (loginModal) {
            setAuthMode("login");
            loginModal.classList.add("active");
        }
    }

    function closeModal() {
        if (loginModal) {
            loginModal.classList.remove("active");
        }
    }

    if (btnUserTrigger) {
        btnUserTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
            if (isLoggedIn) {
                window.location.href = inHtmlFolder ? "menu.html" : "html/menu.html";
            } else {
                openModal();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    window.addEventListener("click", function (e) {
        if (e.target === loginModal) {
            closeModal();
        }
    });

    document.addEventListener("click", function (e) {
        const isOrderBtn = e.target.closest(".btn-order") ||
                           (e.target.tagName === "BUTTON" && e.target.textContent.includes("Pesan Sekarang")) ||
                           e.target.closest(".btn-require-login");

        if (isOrderBtn) {
            const isLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
            if (!isLoggedIn) {
                e.preventDefault();
                e.stopPropagation();
                openModal();
            }
        }

        if (e.target.id === "btn-logout") {
            e.preventDefault();
            if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
                localStorage.removeItem("isUserLoggedIn");
                localStorage.removeItem("currentUser");
                alert("Anda telah keluar.");
                window.location.href = inHtmlFolder ? "../index.html" : "index.html";
            }
        }
    });

    // ================== Handler Pengiriman Form Login / Registrasi ==================
    if (formAuth) {
        formAuth.addEventListener("submit", function (e) {
            e.preventDefault();
            clearMessage();

            const username = inputUsername ? inputUsername.value.trim() : "";
            const password = inputPassword ? inputPassword.value : "";

            if (!username || !password) {
                showMessage("Mohon lengkapi username/email dan password!", "error");
                return;
            }

            if (authMode === "register") {
                // ---------- PROSES REGISTRASI ----------
                const nama = inputNama ? inputNama.value.trim() : "";
                const confirmPassword = inputConfirmPassword ? inputConfirmPassword.value : "";

                if (!nama) {
                    showMessage("Mohon lengkapi nama lengkap!", "error");
                    return;
                }
                if (password.length < 6) {
                    showMessage("Password minimal 6 karakter!", "error");
                    return;
                }
                if (password !== confirmPassword) {
                    showMessage("Konfirmasi password tidak cocok!", "error");
                    return;
                }

                const users = getRegisteredUsers();

                let alreadyExists = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username.toLowerCase() === username.toLowerCase()) {
                        alreadyExists = true;
                        break;
                    }
                }

                if (alreadyExists) {
                    showMessage("Username/email sudah terdaftar. Silakan masuk.", "error");
                    return;
                }

                const newUser = { nama: nama, username: username, password: password, role: "customer" };
                users.push(newUser);
                saveRegisteredUsers(users);

                showMessage("Registrasi berhasil! Silakan masuk dengan akun Anda.", "success");

                setTimeout(function () {
                    setAuthMode("login");
                    if (inputUsername) inputUsername.value = username;
                    showMessage("Registrasi berhasil! Silakan masuk dengan akun Anda.", "success");
                }, 900);

            } else {
                // ---------- PROSES LOGIN ----------
                const users = getRegisteredUsers();

                let foundUser = null;
                let userExists = false;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username.toLowerCase() === username.toLowerCase()) {
                        userExists = true;
                        if (users[i].password === password) {
                            foundUser = users[i];
                            break;
                        }
                    }
                }

                if (!foundUser) {
                    if (userExists) {
                        showMessage("Password salah. Silakan coba lagi.", "error");
                    } else {
                        showMessage("Akun belum terdaftar. Silakan daftar terlebih dahulu.", "error");
                    }
                    return;
                }

                localStorage.setItem("currentUser", JSON.stringify({
                    nama: foundUser.nama,
                    username: foundUser.username,
                    role: foundUser.role || "customer"
                }));
                localStorage.setItem("isUserLoggedIn", "true");

                showMessage("Selamat datang kembali, " + foundUser.nama + "!", "success");

                // =========================================================================
                // DIUBAH DI SINI: Langsung diarahkan ke halaman menu.html setelah login sukses
                // =========================================================================
                setTimeout(function () {
                    closeModal();
                    window.location.href = inHtmlFolder ? "menu.html" : "html/menu.html";
                }, 700);
            }
        });
    }
});