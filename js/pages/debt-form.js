/**
 * Bagian "Piutang / Hutang" pada form transaksi (Cash Transaction, Adjustment, Forex Transfer).
 * HTML-nya dari pages/other-transaction/_debt-section.php; tiap halaman memanggil DebtForm.create(cfg)
 * dengan aturan khususnya, lalu memakai collect / fill / reset / showDetail.
 *
 * cfg:
 *   sfx        akhiran id elemen ('' atau 'Edit')
 *   modal      selector modal (untuk dropdown pilihan kontak)
 *   kontak     true bila bagian ini punya pilihan kontak sendiri (Adjustment)
 *   available  () => boolean, bagian disembunyikan bila false (Transfer tipe Both)
 *   exclude    () => id transaksi yang sedang diedit (pelunasan lamanya tidak dihitung)
 *   open       () => parameter /debt/open, atau null bila form belum lengkap
 *   docFilter  (doc) => boolean, dokumen yang boleh dipilih
 *   rate       (doc) => boolean, tampilkan kolom kurs untuk dokumen ini
 *   hint       (bayar) => teks petunjuk
 *   summary    (rows) => html ringkasan; rows = [{id, valas, tipe, kode, sisa, jumlah, kurs}]
 *   autoFill   (rows) => Map id -> jumlah (opsional, tombol "Fill from total/lines")
 *   watch      selector elemen yang memuat ulang dokumen saat berubah
 *   refresh    selector elemen yang menghitung ulang ringkasan saat diisi
 */
(function () {
  const fmt = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  const esc = s => $('<div>').text(s ?? '').html();
  const headers = () => ({ 'X-Client-Domain': myDomain, 'Authorization': `Bearer ${window.token}` });
  const num = v => parseFloat(String(v ?? '').replace(',', '.')) || 0;
  // tanggal dari API berbentuk ISO UTC; ambil tanggal lokal (WIB) seperti halaman lain
  const ymd = v => {
    if (!v) return '';
    const d = new Date(v);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const badge = ok => `<span class="badge ${ok ? 'bg-label-success' : 'bg-label-danger'}">${ok ? 'Match' : 'Not equal'}</span>`;
  const tipeText = t => (t === 'AR' ? 'Receivable' : 'Payable');

  function create(cfg) {
    const sfx = cfg.sfx;
    const el = name => $('#' + name + sfx);
    let loadToken = 0;
    let pendingSelect = null;
    const isOn = () => el('utangCek').is(':checked');
    const isBayar = () => el('utangModeBayar').is(':checked');

    function rows() {
      return el('utangDocs').find('tbody tr[data-id]').map(function () {
        const $r = $(this);
        return {
          id: Number($r.data('id')), valas: Number($r.data('valas')), tipe: $r.data('tipe'), kode: $r.data('kode'),
          sisa: Number($r.data('sisa')), jumlah: num($r.find('.u-jumlah').val()), kurs: num($r.find('.u-kurs').val()), $r
        };
      }).get();
    }

    const summary = () => el('utangSum').html(cfg.summary(rows()));

    function panels() {
      const show = !cfg.available || cfg.available();
      el('utangSection').toggleClass('d-none', !show);
      const on = show && isOn();
      el('utangBody').toggleClass('d-none', !on);
      el('utangKontakRow').toggleClass('d-none', !on);
      el('utangPanelBaru').toggleClass('d-none', isBayar());
      el('utangPanelBayar').toggleClass('d-none', !isBayar());
      el('utangAuto').toggleClass('d-none', !cfg.autoFill);
      el('utangHint').text(cfg.hint(isBayar()));
      if (on && isBayar()) loadOpen();
    }

    /** Muat dokumen terbuka; angka yang sudah diketik dipertahankan, `prefill` mengisi dokumen yang belum diisi. */
    function loadOpen(prefill = []) {
      const $tbody = el('utangDocs').find('tbody');
      const typed = {};
      rows().forEach(r => { typed[r.id] = { jumlah: r.$r.find('.u-jumlah').val(), kurs: r.$r.find('.u-kurs').val() }; });
      prefill.forEach(p => { if (!typed[p.dokumen]) typed[p.dokumen] = { jumlah: p.jumlah, kurs: p.kurs }; });

      const params = cfg.open();
      if (!params) {
        $tbody.html('<tr><td colspan="7" class="text-center text-muted">Complete the form first (branch, contact or type)</td></tr>');
        return summary();
      }
      const myToken = ++loadToken;
      $.ajax({
        url: url_api + '/debt/open', method: 'GET', headers: headers(),
        data: { ...params, exclude: cfg.exclude() },
        success: function (docs) {
          if (myToken !== loadToken) return;
          docs = docs.filter(d => !cfg.docFilter || cfg.docFilter(d));
          if (!docs.length) {
            $tbody.html('<tr><td colspan="7" class="text-center text-muted">No open documents</td></tr>');
            return summary();
          }
          $tbody.empty();
          docs.forEach(d => {
            const t = typed[d.noindex] || {};
            const showRate = cfg.rate && cfg.rate(d);
            $tbody.append(`
              <tr data-id="${d.noindex}" data-valas="${d.valas}" data-tipe="${d.tipe}" data-kode="${esc(d.kode_valas || 'Rp')}" data-sisa="${d.sisa}">
                <td>${esc(d.nomor)}</td>
                <td>${tipeText(d.tipe)}</td>
                <td>${d.jatuh_tempo ? ymd(d.jatuh_tempo) : '-'}</td>
                <td>${esc(d.kode_valas || 'Rp')}</td>
                <td class="text-end">${fmt.format(d.sisa)}</td>
                <td><input type="number" step="any" min="0" max="${d.sisa}" class="form-control text-end u-jumlah" value="${esc(t.jumlah ?? '')}"></td>
                <td>${showRate ? `<input type="number" step="any" min="0" class="form-control text-end u-kurs" value="${esc(t.kurs ?? '')}">` : '<span class="text-muted">-</span>'}</td>
              </tr>`);
          });
          if (pendingSelect) {
            const $r = $tbody.find(`tr[data-id="${pendingSelect}"]`);
            if ($r.length && !$r.find('.u-jumlah').val()) $r.find('.u-jumlah').val($r.data('sisa'));
            pendingSelect = null;
          }
          summary();
        },
        error: function (xhr) {
          $tbody.html('<tr><td colspan="7" class="text-center text-danger">Failed to load documents</td></tr>');
          notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load documents' });
        }
      });
    }

    function reset() {
      el('utangCek').prop('checked', false);
      el('utangModeBaru').prop('checked', true);
      el('utangModeBayar').prop('checked', false);
      el('utangDue').val('');
      if (cfg.kontak) el('utangKontak').val(null).trigger('change');
      el('utangDocs').find('tbody').empty();
      panels();
    }

    el('utangCek').on('change', panels);
    $(`input[name="utangMode${sfx}"]`).on('change', panels);
    el('utangDocs').on('input', '.u-jumlah, .u-kurs', summary);
    el('utangAuto').on('click', () => {
      const alloc = cfg.autoFill(rows());
      rows().forEach(r => r.$r.find('.u-jumlah').val(alloc.get(r.id) || ''));
      summary();
    });
    if (cfg.watch) $(cfg.watch).on('change', () => { panels(); });
    if (cfg.refresh) $(document).on('input change', cfg.refresh, () => { if (isOn() && isBayar()) summary(); });
    if (cfg.kontak) {
      // plugin select2 baru termuat setelah skrip halaman, seperti inisialisasi select2 di halaman lain
      $(() => el('utangKontak').select2({
        dropdownParent: $(cfg.modal),
        ajax: {
          url: url_api + '/profile/select2', dataType: 'json', headers: headers(), delay: 500,
          data: params => ({ search: params.term || '', page: params.page || 1 }),
          processResults: (data, params) => { params.page = params.page || 1; return { results: data.results, pagination: { more: data.pagination.more } }; }
        },
        placeholder: 'Choose Contact', minimumInputLength: 0
      }));
      el('utangKontak').on('change', () => { if (isOn() && isBayar()) loadOpen(); });
    }
    panels();

    return {
      kontak: () => (cfg.kontak ? el('utangKontak').val() : undefined),
      refresh: panels,

      /** Dari tombol di halaman Utang Piutang: nyalakan checkbox, mode Settlement, dan isi dokumen yang dipilih dengan sisanya. */
      startSettlement(docId) {
        pendingSelect = docId;
        el('utangCek').prop('checked', true);
        el('utangModeBayar').prop('checked', true);
        el('utangModeBaru').prop('checked', false);
        panels();
      },
      startNew() {
        el('utangCek').prop('checked', true);
        panels();
      },

      /** undefined = checkbox mati, objek `utang` untuk dikirim, false = isian salah (pesan sudah ditampilkan). */
      collect() {
        if (!isOn() || (cfg.available && !cfg.available())) return undefined;
        const fail = text => { notif.fire({ icon: 'error', text }); return false; };
        if (cfg.kontak && !el('utangKontak').val()) return fail('Choose the contact of this payable/receivable');
        if (!isBayar()) return { mode: 'baru', jatuh_tempo: el('utangDue').val() || null };
        const alokasi = [];
        for (const r of rows()) {
          if (!r.jumlah) continue;
          const needRate = r.$r.find('.u-kurs').length > 0;
          if (r.jumlah > r.sisa + 0.005) return fail('Settlement exceeds the remaining balance');
          if (needRate && !(r.kurs > 0)) return fail('Enter the rate for every foreign currency document you settle');
          alokasi.push({ dokumen: r.id, jumlah: r.jumlah, kurs: needRate ? r.kurs : undefined });
        }
        if (!alokasi.length) return fail('Choose at least one document to settle');
        return { mode: 'bayar', alokasi };
      },

      reset,

      /** Isi dari response.utang saat membuka modal Edit. `kontak` = { id, text } untuk Adjustment. */
      fill(utang, kontak) {
        reset();
        if (!utang) return;
        el('utangCek').prop('checked', true);
        if (cfg.kontak && kontak?.id) el('utangKontak').append(new Option(kontak.text, kontak.id, true, true)).trigger('change');
        if (utang.mode === 'baru') {
          el('utangDue').val(ymd(utang.jatuh_tempo));
          return panels();
        }
        el('utangModeBayar').prop('checked', true);
        el('utangModeBaru').prop('checked', false);
        panels();
        loadOpen(utang.alokasi.map(a => ({ dokumen: a.dokumen, jumlah: a.jumlah, kurs: a.valas ? a.kurs : '' })));
      },

      /** Ringkasan di modal detail (butuh #utangDetailSection dan #utangDetail di halaman). */
      showDetail(utang) {
        const $sec = $('#utangDetailSection');
        if (!utang) return $sec.addClass('d-none');
        const amount = (jumlah, kode, kurs) => (kode
          ? `${fmt.format(jumlah)} ${esc(kode)}${kurs ? ' @ ' + fmt.format(kurs) : ''}`
          : `Rp ${fmt.format(jumlah)}`);
        let html;
        if (utang.mode === 'baru') {
          html = '<ul class="mb-0 list-unstyled">' + utang.dokumen.map(d =>
            `<li><span class="badge ${d.tipe === 'AR' ? 'bg-label-success' : 'bg-label-warning'}">${tipeText(d.tipe)}</span> `
            + `${amount(d.jumlah, d.valas ? d.kode_valas : '', d.valas ? d.kurs : 0)}${d.jatuh_tempo ? ', due ' + ymd(d.jatuh_tempo) : ''}</li>`).join('') + '</ul>';
        } else {
          html = '<span class="badge bg-label-info">Settlement</span><ul class="mb-0 mt-2">' + utang.alokasi.map(a =>
            `<li>${esc(a.nomor)}: ${amount(a.jumlah, a.valas ? a.kode_valas : '', a.valas ? a.kurs : 0)}</li>`).join('') + '</ul>';
        }
        $('#utangDetail').html(html);
        $sec.removeClass('d-none');
      }
    };
  }

  /**
   * Peluncuran dari halaman Utang Piutang lewat ?debt=baru|bayar&tipe=AR|AP&doc=ID. `fill(doc, q)` dipanggil setelah
   * modal New terbuka; `doc` = dokumen dari /debt/:id (hanya untuk bayar). Berjalan sekali setelah halaman siap.
   */
  function launch(buttonSelector, modalSelector, fill) {
    const q = Object.fromEntries(new URLSearchParams(location.search));
    if (q.debt !== 'baru' && q.debt !== 'bayar') return;
    const start = doc => {
      const btn = document.querySelector(buttonSelector);
      if (!btn || btn.disabled) return notif.fire({ icon: 'error', text: 'You do not have permission to add this transaction' });
      $(modalSelector).one('shown.bs.modal', () => fill(doc, q));
      btn.click();
    };
    // beri waktu skrip halaman menyelesaikan inisialisasi select2 dan pengecekan hak akses
    setTimeout(() => {
      if (q.debt === 'baru') return start(null);
      $.ajax({
        url: url_api + '/debt/' + encodeURIComponent(q.doc), method: 'GET', headers: headers(),
        success: start,
        error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Document not found' })
      });
    }, 900);
    history.replaceState(null, '', location.pathname);
  }

  /** Pilihan select2 dengan nilai awal (id, teks). */
  const setSelect = (selector, id, text) => {
    if (!id) return;
    $(selector).append(new Option(text, id, true, true));
    $(selector)[0].dispatchEvent(new Event('change', { bubbles: true }));
  };

  window.DebtForm = { create, fmt, num, badge, ymd, launch, setSelect };
})();
