// ==========================================================================
// KODE MANAGEMENT THEME /  (js/theme.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const darkToggleBtn = document.getElementById('dark-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme');

    function setIcon(isDark) {
        if (themeIcon) {
            // 'bedtime' = ikon bulan (mode gelap belum aktif -> tampilkan bulan untuk mengaktifkan)
            // 'light_mode' = ikon matahari (mode gelap sedang aktif -> tampilkan matahari untuk kembali ke terang)
            themeIcon.textContent = isDark ? 'light_mode' : 'bedtime';
        }
    }

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        setIcon(true);
    } else {
        setIcon(false);
    }

    if (darkToggleBtn) {
        darkToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');

            setIcon(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
});

const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        // Toggle class 'active' untuk menu dan tombol hamburger sekaligus
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    // Otomatis menutup menu dan mengembalikan ikon saat link di dalam menu diklik
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        });
    });
}