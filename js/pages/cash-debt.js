/**
 * Cash Transaction - aturan khusus bagian "Piutang / Hutang" (mesinnya di debt-form.js).
 *   Cash Out + New = piutang (kita meminjamkan), Cash In + New = hutang (kita meminjam).
 *   Cash In + Settlement melunasi piutang, Cash Out + Settlement melunasi hutang.
 *   Dokumen valas dilunasi dengan rupiah: isi jumlah satuan valas dan kurs.
 * Dipakai cash-transaction.js lewat window.cashDebt(sfx): collect, fill, reset, showDetail.
 */
(function () {
  const { fmt, num, badge } = window.DebtForm;
  const ids = { '': { detail: '#detailBaru', kontak: '#kontak', cabang: '#cabang', out: '#out', in: '#in', id: () => 0 },
                'Edit': { detail: '#detailEdit', kontak: '#kontakEdit', cabang: '#cabangEdit', out: '#outEdit', in: '#inEdit', id: () => $('#idEdit').val() } };
  const forms = {};

  Object.keys(ids).forEach(sfx => {
    const c = ids[sfx];
    const isOut = () => $(c.out).is(':checked');
    const total = () => {
      let sum = 0;
      $(c.detail + ' .jumlah').each(function () { sum += num($(this).val().toString().replace(/\./g, '').replace(/,/g, '.')); });
      return sum;
    };
    forms[sfx] = DebtForm.create({
      sfx, modal: sfx ? '#modalEdit' : '#modalTambah',
      exclude: c.id,
      open: () => ($(c.cabang).val() && $(c.kontak).val() ? { tipe: isOut() ? 'AP' : 'AR', cabang: $(c.cabang).val(), kontak: $(c.kontak).val() } : null),
      rate: doc => !!doc.valas,
      hint: bayar => (bayar
        ? (isOut() ? 'Cash out that pays a payable/hutang owed to this contact.' : 'Cash in that collects a receivable/piutang owed by this contact.')
        : (isOut() ? 'Creates a receivable/piutang: money lent to this contact. Amount = transaction total.' : 'Creates a payable/hutang: money borrowed from this contact. Amount = transaction total.')),
      summary: rows => {
        const paid = rows.reduce((s, r) => s + (r.valas ? r.jumlah * r.kurs : r.jumlah), 0);
        return `Settled Rp ${fmt.format(paid)} of total Rp ${fmt.format(total())} ${badge(Math.abs(paid - total()) < 0.01)}`;
      },
      // dokumen rupiah saja, paling dulu jatuh tempo; dokumen valas butuh kurs sehingga diisi manual
      autoFill: rows => {
        let left = total();
        const alloc = new Map();
        rows.filter(r => !r.valas).forEach(r => { const take = Math.min(left, r.sisa); if (take > 0) { alloc.set(r.id, take); left -= take; } });
        return alloc;
      },
      watch: `${c.kontak}, ${c.cabang}, ${c.out}, ${c.in}`,
      refresh: `${c.detail} .jumlah`
    });
  });

  // Kontak karyawan + piutang (Cash Out New / Cash In Settlement): akun baris detail otomatis Piutang Karyawan (Kasbon).
  // Hanya form New; baris yang akunnya sudah dipilih pengguna tidak ditimpa.
  const KASBON = 150210;
  const karyawan = {}; // id kontak -> true/false, supaya satu kontak cukup dicek sekali
  const isKaryawan = id => (id in karyawan
    ? $.Deferred().resolve(karyawan[id]).promise()
    : $.ajax({ url: url_api + '/profile/id/' + id, headers: { 'X-Client-Domain': myDomain, 'Authorization': `Bearer ${window.token}` } })
        .then(p => (karyawan[id] = Number(p.karyawan) === 1)));
  const autoKasbon = () => {
    const kontak = $('#kontak').val();
    const piutang = $('#out').is(':checked') !== $('#utangModeBayar').is(':checked'); // Out+New atau In+Settlement
    if (!kontak || !piutang || !$('#utangCek').is(':checked')) return;
    isKaryawan(kontak).then(yes => {
      if (!yes || $('#kontak').val() !== kontak) return;
      if (!$('#detailBaru tbody tr').length) document.querySelector('#tambahBaris').click();
      $('#detailBaru .akun').each(function () {
        if (!$(this).val()) $(this).append(new Option(`${KASBON} - Piutang Karyawan (Kasbon)`, KASBON, true, true)).trigger('change');
      });
    });
  };
  // dipasang saat halaman siap: jQuery di sini sudah jQuery yang dipakai select2, yang event change-nya tidak sampai ke jQuery awal
  $(() => $(document).on('change', '#utangCek, input[name="utangMode"], #out, #in, #kontak', autoKasbon));

  // dibuka dari halaman Utang Piutang: ?debt=baru&tipe=AR|AP atau ?debt=bayar&doc=ID
  DebtForm.launch('#btnModalTambah', '#modalTambah', (doc, q) => {
    const tipe = doc ? doc.tipe : q.tipe;
    // piutang baru / pelunasan hutang = uang keluar; hutang baru / pelunasan piutang = uang masuk
    const out = doc ? tipe === 'AP' : tipe === 'AR';
    document.querySelector(out ? '#out' : '#in').click();
    if (!doc) return forms[''].startNew();
    DebtForm.setSelect('#kontak', doc.kontak, `${doc.kode_kontak} - ${doc.nama_kontak}`);
    DebtForm.setSelect('#cabang', doc.cabang, `${doc.kode_cabang} - ${doc.nama_cabang}`);
    if (!doc.valas) { // dokumen rupiah: satu baris dengan jumlah sisa, akunnya dipilih pengguna
      document.querySelector('#tambahBaris').click();
      const input = document.querySelector('#detailBaru tbody tr:last-child .jumlah');
      input.value = String(doc.sisa).replace('.', ',');
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
    forms[''].startSettlement(doc.noindex);
  });

  window.cashDebt = {
    collect: sfx => forms[sfx].collect(),
    reset: sfx => forms[sfx].reset(),
    fill: (sfx, utang) => forms[sfx].fill(utang),
    showDetail: utang => forms[''].showDetail(utang)
  };
})();
