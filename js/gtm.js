/**
 * GOOGLE TAG MANAGER + CONSENT MODE v2 (form order online)
 * ------------------------------------------------------------------
 * Hanya aktif di host yang terdaftar di GTM_BY_HOST; di host lain file ini
 * tidak melakukan apa-apa (trackOrderSuccess tetap ada tapi kosong, jadi
 * pemanggilnya tidak perlu mengecek host).
 *
 * Cara kerja:
 *   1. Consent Mode v2: semua izin default "denied" (atau mengikuti pilihan
 *      pelanggan yang tersimpan), lalu GTM dimuat. Tag Google di container
 *      menyesuaikan diri otomatis dengan status izin ini.
 *   2. Banner Accept / Decline mengubah izin; pilihan disimpan di
 *      localStorage. Tautan "Cookie settings" membuka banner lagi.
 *   3. trackOrderSuccess() mengirim event "order_success" ke dataLayer SETIAP
 *      order tersimpan. customer_name hanya disertakan bila pelanggan Accept.
 *
 * Tambah klien lain: cukup tambah satu baris di GTM_BY_HOST.
 */
(function () {
  const GTM_BY_HOST = {
    'currencyexchange.beresmocha.id': 'GTM-NG3MK2V8'
  };

  const CONSENT_KEY = 'gtmConsent'; 
  const CONSENT_TYPES = ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization'];

  const gtmId = GTM_BY_HOST[window.location.hostname];
  const sentOrders = new Set();
  let consent = null;                 

  window.trackOrderSuccess = function () {};
  if (!gtmId) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readConsent() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* mode privat: pilihan berlaku untuk sesi ini saja */ }
  }

  function consentState(value) {
    return Object.fromEntries(CONSENT_TYPES.map(type => [type, value]));
  }

  // ---------- Consent Mode + GTM ----------

  consent = readConsent();
  gtag('consent', 'default', { ...consentState(consent === 'granted' ? 'granted' : 'denied'), wait_for_update: 500 });

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const first = d.getElementsByTagName(s)[0];
    const script = d.createElement(s);
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + i;
    first.parentNode.insertBefore(script, first);
  })(window, document, 'script', 'dataLayer', gtmId);

  // ---------- event ----------

  window.trackOrderSuccess = function ({ orderNumber, orderType, branchName, customerName }) {
    if (!orderNumber || sentOrders.has(orderNumber)) return;
    sentOrders.add(orderNumber);

    const payload = {
      event: 'order_success',
      order_number: orderNumber,
      order_type: orderType,
      branch_name: branchName
    };

    // Nama pelanggan = data pribadi: hanya ikut kalau pelanggan sudah Accept.
    if (consent === 'granted') payload.customer_name = customerName;

    window.dataLayer.push(payload);
  };

  // ---------- banner & tautan Cookie settings ----------

  function setConsent(value) {
    consent = value;
    writeConsent(value);
    gtag('consent', 'update', consentState(value));
    hideBanner();
  }

  function hideBanner() {
    document.getElementById('cookieBanner').classList.add('d-none');
    document.getElementById('cookieSettings').classList.remove('d-none');
  }

  function showBanner() {
    document.getElementById('cookieBanner').classList.remove('d-none');
    document.getElementById('cookieSettings').classList.add('d-none');
  }

  function mountBanner() {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cookieBanner" class="position-fixed bottom-0 start-0 end-0 p-3 d-none" style="z-index: 2000;">
        <div class="card shadow-lg mx-auto" style="max-width: 720px;">
          <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
            <p class="mb-0 flex-grow-1">
              We use cookies and analytics tools to understand how this order form is used.
              If you accept, your name is included with your order information; if you decline, it is not.
            </p>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-label-secondary" id="cookieDecline">Decline</button>
              <button type="button" class="btn btn-primary" id="cookieAccept">Accept</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" id="cookieSettings" class="btn btn-link btn-sm position-fixed bottom-0 start-0 m-2 d-none" style="z-index: 1000;">
        Cookie settings
      </button>
    `);

    document.getElementById('cookieAccept').addEventListener('click', () => setConsent('granted'));
    document.getElementById('cookieDecline').addEventListener('click', () => setConsent('denied'));
    document.getElementById('cookieSettings').addEventListener('click', showBanner);

    if (consent === null) showBanner();
    else hideBanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountBanner);
  else mountBanner();
})();
