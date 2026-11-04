/**
 * Adjustment - aturan khusus bagian "Piutang / Hutang" (mesinnya di debt-form.js). Pihak lawan = kontak (dipilih
 * di bagian ini). Baris Adjust negatif (valas keluar) = piutang, positif (valas masuk) = hutang. Pelunasan:
 * baris positif melunasi piutang, negatif melunasi hutang; valas dan jumlahnya harus sama persis per mata uang.
 * Dipakai adjustment.js lewat window.adjDebt(sfx): collect, kontak, fill, reset, showDetail.
 */
(function () {
  const { fmt, num, badge } = window.DebtForm;
  const ids = { '': { detail: '#detailBaru', cabang: '#cabang' }, 'Edit': { detail: '#detailEdit', cabang: '#cabangEdit' } };
  const forms = {};
  const parse = v => num(String(v ?? '').replace(/\./g, '').replace(/,/g, '.'));

  Object.keys(ids).forEach(sfx => {
    const c = ids[sfx];
    // baris adjustment -> kebutuhan per (valas, tipe dokumen): positif melunasi AR, negatif melunasi AP
    const need = () => {
      const m = new Map();
      $(c.detail + ' tbody tr').each(function () {
        const valas = $(this).find('select.forex').val(), qty = parse($(this).find('.amount').val());
        if (!valas || !qty) return;
        const key = `${valas}|${qty > 0 ? 'AR' : 'AP'}`;
        m.set(key, (m.get(key) || 0) + Math.abs(qty));
      });
      return m;
    };
    const key = r => `${r.valas}|${r.tipe}`;
    forms[sfx] = DebtForm.create({
      sfx, modal: sfx ? '#modalEdit' : '#modalTambah', kontak: true,
      exclude: () => (sfx ? $('#idEdit').val() : 0),
      open: () => ($(c.cabang).val() && $('#utangKontak' + sfx).val() ? { cabang: $(c.cabang).val(), kontak: $('#utangKontak' + sfx).val() } : null),
      docFilter: doc => doc.valas > 0,
      hint: bayar => (bayar
        ? 'Positive Adjust lines (forex received) settle receivables; negative lines (forex given) settle payables. Settled amounts must equal the lines for each currency.'
        : 'Negative Adjust lines (forex given out) create a receivable; positive lines (forex received) create a payable. Amount and rate come from the lines.'),
      summary: rows => {
        const got = new Map();
        rows.forEach(r => got.set(key(r), (got.get(key(r)) || 0) + r.jumlah));
        const label = new Map(rows.map(r => [key(r), `${r.kode} ${r.tipe === 'AR' ? 'received' : 'given'}`]));
        const keys = new Set([...need().keys(), ...[...got].filter(([, v]) => v).map(([k]) => k)]);
        if (!keys.size) return 'Add forex lines first';
        let ok = true;
        const parts = [...keys].map(k => {
          const same = Math.abs((got.get(k) || 0) - (need().get(k) || 0)) < 0.01;
          ok = ok && same;
          return `${label.get(k) || k}: lines ${fmt.format(need().get(k) || 0)} / settled ${fmt.format(got.get(k) || 0)}`;
        });
        return `${parts.join('; ')} ${badge(ok)}`;
      },
      autoFill: rows => {
        const left = new Map(need());
        const alloc = new Map();
        rows.forEach(r => {
          const take = Math.min(left.get(key(r)) || 0, r.sisa);
          if (take > 0) { alloc.set(r.id, take); left.set(key(r), left.get(key(r)) - take); }
        });
        return alloc;
      },
      watch: c.cabang,
      refresh: `${c.detail} .amount, ${c.detail} .forex`
    });
  });

  // dibuka dari halaman Utang Piutang: ?debt=baru atau ?debt=bayar&doc=ID
  DebtForm.launch('[data-bs-target="#modalTambah"]', '#modalTambah', doc => {
    if (!doc) return forms[''].startNew();
    DebtForm.setSelect('#cabang', doc.cabang, `${doc.kode_cabang} - ${doc.nama_cabang}`);
    DebtForm.setSelect('#utangKontak', doc.kontak, `${doc.kode_kontak} - ${doc.nama_kontak}`);
    // satu baris valas: piutang dilunasi valas masuk (+), hutang dengan valas keluar (-)
    document.querySelector('#tambahBaris').click();
    const row = document.querySelector('#detailBaru tbody tr:last-child');
    $(row).find('select.forex').append(new Option(doc.kode_valas, doc.valas, true, true));
    const set = (sel, v) => { const i = row.querySelector(sel); i.value = String(v).replace('.', ','); i.dispatchEvent(new Event('input', { bubbles: true })); };
    set('.amount', (doc.tipe === 'AR' ? 1 : -1) * doc.sisa);
    set('.rate', doc.kurs);
    forms[''].startSettlement(doc.noindex);
  });

  window.adjDebt = {
    collect: sfx => forms[sfx].collect(),
    kontak: sfx => forms[sfx].kontak(),
    reset: sfx => forms[sfx].reset(),
    fill: (sfx, utang, kontak) => forms[sfx].fill(utang, kontak),
    showDetail: utang => forms[''].showDetail(utang)
  };
})();
