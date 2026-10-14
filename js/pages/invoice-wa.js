/**
 * KIRIM INVOICE VIA WHATSAPP
 * ------------------------------------------------------------------
 * Pakai: beri elemen class "btnSendWa" dan atribut data-nomor="<nomor transaksi>".
 * Klik elemen itu -> alur di bawah dijalankan (handler delegasi, jadi tombol
 * yang dibuat dinamis oleh DataTables juga ikut jalan).
 *
 * Butuh (dimuat sebelum file ini): country-dial-codes.js
 * Modal isian nomor (#modalWa) dibuat otomatis oleh file ini — tidak perlu
 * menambah markup apa pun di halaman.
 *
 * Alur:
 *   1. Ambil data transaksi (nama, telepon, cabang) berdasarkan nomor.
 *   2. Kalau pelanggan sudah punya nomor telepon valid -> langsung buka wa.me.
 *   3. Kalau belum -> modal: pilih kode negara + isi nomor, simpan ke data
 *      pelanggan (PATCH /profile/:id/telepon), lalu buka wa.me.
 *
 * Link yang dikirim ke pelanggan: halaman publik /transaction-preview.
 * Teks pesan ada di buildWaMessage() — edit di situ kalau mau ganti kalimat.
 */
(function () {
  const MODAL_ID = 'modalWa';
  const DEFAULT_COUNTRY = 'ID';

  let isBusy = false;
  let pending = null;   // { trx, previousModal }

  // ---------- format nomor ----------

  // Ubah nomor telepon (format bebas: 0812-xxx, +62 812..., 62812...) menjadi
  // format wa.me (hanya digit, dengan kode negara). Return null kalau tidak valid.
  function toWaNumber(raw) {
    let digits = String(raw || '').replace(/\D/g, '');
    if (!digits) return null;

    if (digits.startsWith('00')) {
      digits = digits.slice(2);            // 0061... -> 61...
    } else if (digits.startsWith('0')) {
      digits = '62' + digits.slice(1);     // 0812... -> 62812...
    } else if (digits.startsWith('8')) {
      digits = '62' + digits;              // 812...  -> 62812...
    }

    return digits.length >= 8 && digits.length <= 15 ? digits : null;
  }

  function dialOf(iso) {
    const country = COUNTRY_DIAL_CODES.find(c => c.iso === iso);
    return country ? country.dial : '';
  }

  // Gabungkan kode negara + nomor lokal (angka 0 di depan dibuang) -> "+62812...".
  function buildInternationalNumber(iso, nationalRaw) {
    const national = String(nationalRaw || '').replace(/\D/g, '').replace(/^0+/, '');
    const digits = dialOf(iso) + national;

    return national && digits.length >= 8 && digits.length <= 15 ? '+' + digits : null;
  }

  // ---------- pesan & link ----------

  function invoiceLink(nomor) {
    return `${window.location.origin}/transaction-preview?transaction=${encodeURIComponent(nomor)}`;
  }

  // Nomor berkode negara Indonesia (62) -> pesan Bahasa Indonesia;
  // nomor negara lain -> pesan Bahasa Inggris.
  function buildWaMessage(trx, waNumber) {
    const link = invoiceLink(trx.nomor);
    const nama = trx.nama_pelanggan || '';
    const perusahaan = trx.judul_nota || '';   // judul invoice / nama perusahaan
    const cabang = trx.nama_cabang || '';

    if (String(waNumber).startsWith('62')) {
      const tempat = perusahaan && cabang ? `${perusahaan} cabang ${cabang}` : (perusahaan || cabang || 'kami');

      return [
        `Halo ${nama}, terima kasih telah bertransaksi di ${tempat}.`,
        '',
        `Berikut invoice transaksi ${trx.nomor}:`,
        link
      ].join('\n');
    }

    const place = perusahaan && cabang ? `${perusahaan}, ${cabang} branch` : (perusahaan || cabang || 'us');

    return [
      `Hello ${nama}, thank you for transacting at ${place}.`,
      '',
      `Here is your invoice for transaction ${trx.nomor}:`,
      link
    ].join('\n');
  }

  // ---------- API ----------

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    };
  }

  function fetchTransaction(nomor) {
    return $.ajax({
      url: url_api + '/transaction/nomor/' + encodeURIComponent(nomor),
      method: 'GET',
      headers: authHeaders()
    });
  }

  function savePhone(profileId, telepon) {
    return $.ajax({
      url: url_api + `/profile/${profileId}/telepon`,
      method: 'PATCH',
      contentType: 'application/json',
      headers: authHeaders(),
      data: JSON.stringify({ telepon })
    });
  }

  function openWhatsApp(waNumber, message) {
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    const win = window.open(url, '_blank');

    // Popup diblokir browser -> beri link manual.
    if (!win) {
      Swal.fire({
        icon: 'info',
        title: 'Open WhatsApp',
        html: `<a href="${url}" target="_blank" rel="noopener">Click here to open WhatsApp</a>`,
        confirmButtonText: 'Close',
        customClass: { confirmButton: 'btn btn-secondary' }
      });
    }
  }

  // ---------- modal isian nomor ----------

  // Pencarian kode negara: ketik nama (Inggris / Indonesia), kode ISO, atau
  // angka kode telepon (mis. "62" atau "+62").
  function countryMatcher(params, data) {
    const term = (params.term || '').trim().toLowerCase().replace(/^\+/, '');
    if (!term) return data;
    if (!data.element) return null;

    const { dial, alt, iso } = data.element.dataset;

    if (/^\d+$/.test(term)) {
      return dial.startsWith(term) ? data : null;
    }

    const haystack = `${data.text} ${alt} ${iso}`.toLowerCase();
    return haystack.includes(term) ? data : null;
  }

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;

    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="${MODAL_ID}" data-bs-backdrop="static" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Send Invoice via WhatsApp</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="mb-4">
                <span class="fw-medium" id="waCustomerName"></span> has no phone number yet.
                Enter it below to send the invoice via WhatsApp — the number will also be saved to the customer's data.
              </p>
              <div class="row g-2">
                <div class="col-5">
                  <label for="waCountry" class="form-label">Country code</label>
                  <select id="waCountry" class="form-select"></select>
                </div>
                <div class="col-7">
                  <label for="waNumber" class="form-label">Phone number</label>
                  <input type="tel" id="waNumber" class="form-control" placeholder="812xxxxxxxx" autocomplete="off" />
                  <div class="invalid-feedback" id="waError">Please enter a valid phone number</div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="waSubmit">Save &amp; Send</button>
            </div>
          </div>
        </div>
      </div>
    `);

    const $country = $('#waCountry');
    COUNTRY_DIAL_CODES.forEach(c => {
      const option = new Option(`${c.name} (+${c.dial})`, c.iso);
      option.dataset.dial = c.dial;
      option.dataset.alt = c.alt;
      option.dataset.iso = c.iso;
      $country.append(option);
    });

    $country.select2({
      dropdownParent: $('#' + MODAL_ID),
      width: '100%',
      matcher: countryMatcher,
      dropdownCssClass: 'wa-country-dropdown',   // daftar negara lebih lebar dari kolomnya (lihat demo.css)
      placeholder: 'Search country or code',
      templateSelection: (item) => item.element ? '+' + item.element.dataset.dial : item.text
    });

    $('#waSubmit').on('click', submitPhone);
    $('#waNumber').on('keydown', (e) => { if (e.key === 'Enter') submitPhone(); })
                  .on('input', () => $('#waNumber').removeClass('is-invalid'));

    // Selesai (simpan / batal) -> kembalikan modal yang tadi terbuka (mis. detail transaksi).
    document.getElementById(MODAL_ID).addEventListener('hidden.bs.modal', () => {
      const previous = pending && pending.previousModal;
      pending = null;
      if (previous) bootstrap.Modal.getOrCreateInstance(previous).show();
    });
  }

  // Bootstrap tidak mendukung dua modal sekaligus (focus trap modal pertama
  // merebut fokus dari yang kedua, sehingga input tidak bisa diketik).
  // Tutup dulu modal yang sedang terbuka, baru buka modal tujuan.
  function showModalExclusive(modalEl) {
    const open = document.querySelector('.modal.show');
    const target = bootstrap.Modal.getOrCreateInstance(modalEl);

    if (!open || open === modalEl) {
      target.show();
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      open.addEventListener('hidden.bs.modal', () => {
        target.show();
        resolve(open);
      }, { once: true });
      bootstrap.Modal.getInstance(open).hide();
    });
  }

  async function openPhoneModal(trx) {
    ensureModal();

    const modalEl = document.getElementById(MODAL_ID);
    const countryIso = COUNTRY_DIAL_CODES.some(c => c.iso === trx.negara) ? trx.negara : DEFAULT_COUNTRY;

    $('#waCustomerName').text(trx.nama_pelanggan || 'This customer');
    $('#waCountry').val(countryIso).trigger('change');
    $('#waNumber').val('').removeClass('is-invalid');
    $('#waSubmit').prop('disabled', false);

    pending = { trx, previousModal: null };
    pending.previousModal = await showModalExclusive(modalEl);

    modalEl.addEventListener('shown.bs.modal', () => $('#waNumber').trigger('focus'), { once: true });
  }

  async function submitPhone() {
    if (!pending) return;

    const full = buildInternationalNumber($('#waCountry').val(), $('#waNumber').val());
    if (!full) {
      $('#waNumber').addClass('is-invalid');
      return;
    }

    const { trx } = pending;
    $('#waSubmit').prop('disabled', true);

    try {
      await savePhone(trx.kontak, full);
    } catch (xhr) {
      $('#waSubmit').prop('disabled', false);
      notif.fire({
        icon: 'error',
        text: xhr?.responseJSON?.message || 'Terjadi kesalahan pada server'
      });
      return;
    }

    const waNumber = toWaNumber(full);
    openWhatsApp(waNumber, buildWaMessage(trx, waNumber));
    bootstrap.Modal.getInstance(document.getElementById(MODAL_ID)).hide();
  }

  // ---------- entry point ----------

  async function sendInvoiceViaWhatsApp(nomor) {
    if (isBusy) return;
    isBusy = true;

    try {
      const trx = await fetchTransaction(nomor);
      const waNumber = toWaNumber(trx.telepon);

      if (waNumber) {
        openWhatsApp(waNumber, buildWaMessage(trx, waNumber));
      } else {
        await openPhoneModal(trx);
      }
    } catch (xhr) {
      notif.fire({
        icon: 'error',
        text: xhr?.responseJSON?.message || 'Terjadi kesalahan pada server'
      });
    } finally {
      isBusy = false;
    }
  }

  // Dipakai dialog sukses transaksi (Swal) yang menutup dirinya sendiri sebelum
  // memanggil ini, sehingga modal isian nomor tidak berebut fokus dengan Swal.
  window.sendInvoiceViaWhatsApp = sendInvoiceViaWhatsApp;

  $(document).on('click', '.btnSendWa', function (e) {
    e.preventDefault();
    const nomor = $(this).attr('data-nomor');
    if (nomor) sendInvoiceViaWhatsApp(nomor);
  });
})();
