/**
 * PWA (installable app): pendaftaran service worker + tombol "Install App".
 * Dimuat oleh index.php, login.php, dan order-form.php.
 *
 * Browser menampilkan tawaran install sendiri (mis. Chrome Android) bila manifest, ikon, dan
 * service worker memenuhi syarat dan situs berjalan di HTTPS. Event beforeinstallprompt juga
 * ditangkap supaya menu profil -> "Install App" (#btnInstallApp) bisa memicunya kapan saja.
 */
(function () {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (error) {
        console.warn('Service worker tidak terdaftar:', error);
      });
    });
  }

  let installEvent = null;

  function toggleInstallButton(visible) {
    document.querySelectorAll('#btnInstallApp').forEach(function (el) {
      el.classList.toggle('d-none', !visible);
    });
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();     // simpan; ditampilkan lewat tombol "Install App"
    installEvent = event;
    toggleInstallButton(true);
  });

  window.addEventListener('appinstalled', function () {
    installEvent = null;
    toggleInstallButton(false);
  });

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('#btnInstallApp');
    if (!trigger || !installEvent) return;

    event.preventDefault();
    installEvent.prompt();
    installEvent.userChoice.finally(function () {
      installEvent = null;
      toggleInstallButton(false);
    });
  });
})();
