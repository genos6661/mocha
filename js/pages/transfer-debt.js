/**
 * Forex Transfer - aturan khusus bagian "Piutang / Hutang" (mesinnya di debt-form.js). Hanya tipe Forex dan Rupiah.
 *   New     : cabang pengirim jadi piutang, cabang penerima jadi hutang (Rupiah: satu pasang; Forex: satu pasang per valas).
 *   Settlement : cabang pengirim (From) melunasi hutangnya ke cabang penerima (To).
 *     Rupiah : melunasi dokumen rupiah, atau dokumen valas dengan kurs; total rupiah harus sama dengan Transfer Amount.
 *     Forex  : hanya dokumen valas; jumlah per valas harus sama dengan baris transfer.
 * Dipakai forex-transfer.js lewat window.transferDebt(sfx): collect, fill, reset, showDetail, refresh.
 */
(function () {
  const { fmt, num, badge } = window.DebtForm;
  const ids = {
    '': { akunFrom: '#akunFrom', akunTo: '#akunTo', from: '#from', to: '#to', tipe: 'input[name="tipeTrans"]:checked', rupiah: '#valRupiah', detail: '#detailBaru', f: '.forex', a: '.amount' },
    'Edit': { akunFrom: '#akunFromEdit', akunTo: '#akunToEdit', from: '#fromEdit', to: '#toEdit', tipe: '#modalEdit input[name="tipeTransEdit"]:checked', rupiah: '#valRupiahEdit', detail: '#detailEdit', f: '.forexEdit', a: '.amountEdit' }
  };
  const forms = {};
  const parse = v => num(String(v ?? '').replace(/\./g, '').replace(/,/g, '.'));

  Object.keys(ids).forEach(sfx => {
    const c = ids[sfx];
    const tipe = () => $(c.tipe).val();
    const rupiahTotal = () => parse($(c.rupiah).val());
    // jumlah per valas dari baris transfer (tipe Forex)
    const lines = () => {
      const m = new Map();
      $(c.detail + ' tbody tr').each(function () {
        const valas = $(this).find('select' + c.f).val(), qty = parse($(this).find(c.a).val());
        if (valas && qty) m.set(valas, (m.get(valas) || 0) + qty);
      });
      return m;
    };
    forms[sfx] = DebtForm.create({
      sfx, modal: sfx ? '#modalEdit' : '#modalTambah',
      available: () => tipe() === 'tipeForex' || tipe() === 'tipeRupiah',
      exclude: () => (sfx ? $('#idEdit').val() : 0),
      open: () => ($(c.from).val() && $(c.to).val() ? { tipe: 'AP', cabang: $(c.from).val(), cabang_pihak: $(c.to).val() } : null),
      docFilter: doc => tipe() === 'tipeRupiah' || doc.valas > 0,
      rate: doc => tipe() === 'tipeRupiah' && doc.valas > 0,
      hint: bayar => (bayar
        ? (tipe() === 'tipeRupiah'
          ? 'The From branch settles what it owes the To branch in rupiah. Foreign currency payables need the rate.'
          : 'The From branch settles foreign currency payables it owes the To branch. Settled amounts must equal the transfer lines for each currency.')
        : 'The From branch gets a receivable and the To branch gets a payable of the transfer value (one pair per currency for Forex).'),
      summary: rows => {
        if (tipe() === 'tipeRupiah') {
          const paid = rows.reduce((s, r) => s + (r.valas ? r.jumlah * r.kurs : r.jumlah), 0);
          return `Settled Rp ${fmt.format(paid)} of Transfer Amount Rp ${fmt.format(rupiahTotal())} ${badge(Math.abs(paid - rupiahTotal()) < 0.01)}`;
        }
        const got = new Map();
        rows.forEach(r => got.set(String(r.valas), (got.get(String(r.valas)) || 0) + r.jumlah));
        const label = new Map(rows.map(r => [String(r.valas), r.kode]));
        const need = lines();
        const keys = new Set([...need.keys(), ...[...got].filter(([, v]) => v).map(([k]) => k)]);
        if (!keys.size) return 'Add forex lines first';
        let ok = true;
        const parts = [...keys].map(k => {
          const same = Math.abs((got.get(k) || 0) - (need.get(k) || 0)) < 0.01;
          ok = ok && same;
          return `${label.get(k) || 'Currency #' + k}: lines ${fmt.format(need.get(k) || 0)} / settled ${fmt.format(got.get(k) || 0)}`;
        });
        return `${parts.join('; ')} ${badge(ok)}`;
      },
      autoFill: rows => {
        const alloc = new Map();
        if (tipe() === 'tipeRupiah') {
          let left = rupiahTotal();
          rows.filter(r => !r.valas).forEach(r => { const take = Math.min(left, r.sisa); if (take > 0) { alloc.set(r.id, take); left -= take; } });
          return alloc;
        }
        const left = new Map(lines());
        rows.forEach(r => {
          const take = Math.min(left.get(String(r.valas)) || 0, r.sisa);
          if (take > 0) { alloc.set(r.id, take); left.set(String(r.valas), left.get(String(r.valas)) - take); }
        });
        return alloc;
      },
      watch: `${c.from}, ${c.to}, ${sfx ? 'input[name="tipeTransEdit"]' : 'input[name="tipeTrans"]'}`,
      refresh: `${c.detail} ${c.a}, ${c.detail} select${c.f}, ${c.rupiah}`
    });

    // checkbox / mode / jenis transfer berubah: pilih akun antar cabang otomatis.
    // New: From berpiutang (Piutang Antar Cabang), To berhutang (Hutang Antar Cabang); Settlement: kebalikannya.
    const setAkun = (selector, kode) => {
      const nama = kode === 210400 ? 'Hutang Antar Cabang' : 'Piutang Antar Cabang';
      $(selector).empty().append(new Option(`${kode} - ${nama}`, kode, true, true)).trigger('change');
    };
    const autoAkun = () => {
      if (!$('#utangCek' + sfx).is(':checked') || !(tipe() === 'tipeForex' || tipe() === 'tipeRupiah')) return;
      const settle = $('#utangModeBayar' + sfx).is(':checked');
      setAkun(c.akunFrom, settle ? 210400 : 150300);
      setAkun(c.akunTo, settle ? 150300 : 210400);
    };
    $(`#utangCek${sfx}, input[name="utangMode${sfx}"], ${sfx ? 'input[name="tipeTransEdit"]' : 'input[name="tipeTrans"]'}`).on('change', autoAkun);
  });

  // dibuka dari halaman Utang Piutang: ?debt=baru atau ?debt=bayar&doc=ID (dokumen hutang cabang pengirim)
  DebtForm.launch('[data-bs-target="#modalTambah"]', '#modalTambah', doc => {
    const idStr = v => String(v).replace('.', ',');
    const row = (kode, valas, amount, rate) => {
      document.querySelector('#tambahBaris').click();
      const r = document.querySelector('#detailBaru tbody tr:last-child');
      $(r).find('select.forex').append(new Option(kode, valas, true, true));
      [['.amount', amount], ['.rate', rate]].forEach(([sel, v]) => { const i = r.querySelector(sel); i.value = idStr(v); i.dispatchEvent(new Event('input', { bubbles: true })); });
    };
    // From = cabang yang berhutang (pengirim pelunasan): akun From = Hutang Antar Cabang, akun To = Piutang Antar Cabang
    const accounts = (from, to) => {
      DebtForm.setSelect('#akunFrom', from, `${from} - ${from === 210400 ? 'Hutang' : 'Piutang'} Antar Cabang`);
      DebtForm.setSelect('#akunTo', to, `${to} - ${to === 210400 ? 'Hutang' : 'Piutang'} Antar Cabang`);
    };
    if (!doc) {
      document.querySelector('#tipeRupiah').click();
      accounts(150300, 210400);
      return forms[''].startNew();
    }
    document.querySelector(doc.valas ? '#tipeForex' : '#tipeRupiah').click();
    DebtForm.setSelect('#from', doc.cabang, doc.nama_cabang);
    DebtForm.setSelect('#to', doc.cabang_pihak, doc.nama_pihak);
    accounts(210400, 150300);
    if (doc.valas) row(doc.kode_valas, doc.valas, doc.sisa, doc.kurs);
    else {
      const v = document.querySelector('#valRupiah');
      v.value = DebtForm.fmt.format(doc.sisa);
      v.dispatchEvent(new Event('input', { bubbles: true }));
    }
    forms[''].startSettlement(doc.noindex);
  });

  window.transferDebt = {
    collect: sfx => forms[sfx].collect(),
    reset: sfx => forms[sfx].reset(),
    fill: (sfx, utang) => forms[sfx].fill(utang),
    refresh: sfx => forms[sfx].refresh(),
    showDetail: utang => forms[''].showDetail(utang)
  };
})();
