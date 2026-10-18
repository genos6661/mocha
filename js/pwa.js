/**
 * PWA (installable app): pendaftaran service worker + tombol "Install App".
 * Dimuat oleh index.php dan login.php (TIDAK oleh order-form.php: form booking pelanggan dikecualikan).
 *
 * Browser menampilkan tawaran install sendiri (mis. Chrome Android) bila manifest, ikon, dan
 * service worker memenuhi syarat dan situs berjalan di HTTPS. Event beforeinstallprompt tidak selalu
 * dikirim (hanya Chrome/Edge/Samsung, hanya di HTTPS, tidak bila aplikasi sudah terpasang, dan
 * Chrome menahannya beberapa waktu setelah tawaran ditutup). Karena itu menu profil -> "Install App"
 * (#btnInstallApp) selalu tampil selama aplikasi belum dibuka sebagai aplikasi terpasang:
 *   - ada event install  -> klik membuka dialog install bawaan browser;
 *   - tidak ada          -> klik menampilkan petunjuk memasang manual sesuai browser perangkat.
 */
(function () {
  const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  if ('serviceWorker' in navigator && secure) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (error) {
        console.warn('Service worker tidak terdaftar:', error);
      });
    });
  } else if (!secure) {
    console.info('PWA: browser hanya menawarkan install di HTTPS (atau localhost).');
  }

  let installEvent = null;

  const isInstalled = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function toggleInstallButton(visible) {
    document.querySelectorAll('#btnInstallApp').forEach(function (el) {
      el.classList.toggle('d-none', !visible);
    });
  }

  // Tampilkan tombol selama aplikasi belum terpasang / belum dibuka sebagai aplikasi.
  document.addEventListener('DOMContentLoaded', function () {
    toggleInstallButton(!isInstalled());
  });

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();     // simpan; ditampilkan lewat tombol "Install App"
    installEvent = event;
    toggleInstallButton(true);
  });

  window.addEventListener('appinstalled', function () {
    installEvent = null;
    toggleInstallButton(false);
  });

  function manualSteps() {
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);

    if (!secure) {
      return 'This site must be opened over <b>HTTPS</b> before the browser can install it as an app.';
    }
    if (ios) {
      return 'In <b>Safari</b>, tap the <b>Share</b> button, then choose <b>Add to Home Screen</b>.';
    }
    if (/android/i.test(ua)) {
      return 'In <b>Chrome</b>, tap the <b>&#8942; menu</b> at the top right, then choose <b>Install app</b> '
        + '(or <b>Add to Home screen</b>).<br><small class="text-body-secondary">If the option is missing, the app may already be installed.</small>';
    }
    return 'In <b>Chrome</b> or <b>Edge</b>, click the <b>install icon</b> at the right end of the address bar, '
      + 'or open the browser menu and choose <b>Install BERES Mocha</b>.';
  }

  function showSteps() {
    const html = manualSteps();
    if (window.Swal) {
      Swal.fire({
        icon: 'info',
        title: 'Install BERES Mocha',
        html: html,
        confirmButtonText: 'Got it',
        customClass: { confirmButton: 'btn btn-primary' },
        buttonsStyling: false
      });
    } else {
      window.alert(html.replace(/<[^>]+>/g, ''));
    }
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('#btnInstallApp');
    if (!trigger) return;

    event.preventDefault();

    if (!installEvent) { showSteps(); return; }

    installEvent.prompt();
    installEvent.userChoice.finally(function () {
      installEvent = null;
    });
  });
})();
