/**
 * GUIDE - perlakuan guide di sisi form (pilihan guide + penyesuaian rate)
 *
 * Dipakai New Transaction, Edit Transaction dan Edit Order. Mode & aturan komisi dibaca dari
 * GET /guide/treatment (mode: off | commission | rate). Hanya mode "rate" yang mengubah rate:
 * Sell dinaikkan, Buy diturunkan sesuai aturan per valas (valas 0 = aturan bawaan).
 */
const GuideRate = (() => {
  let cache = null;

  const headers = () => ({ 'X-Client-Domain': myDomain, Authorization: `Bearer ${window.token}` });
  const round2 = value => Math.round((value + Number.EPSILON) * 100) / 100;

  function load(force = false) {
    if (!cache || force) {
      cache = Promise.resolve($.ajax({ url: url_api + '/guide/treatment', headers: headers() }))
        .catch(() => ({ mode: 'off', rules: [], can_assign: false }));
    }
    return cache;
  }

  function findRule(rules, valas) {
    const list = rules || [];
    return list.find(r => Number(r.valas) === Number(valas)) || list.find(r => Number(r.valas) === 0) || null;
  }

  /** Rate setelah penyesuaian guide. Selain mode "rate" atau tanpa aturan: rate dasar apa adanya. */
  function adjust(treatment, base, valas, tipe) {
    base = Number(base) || 0;
    if (!treatment || treatment.mode !== 'rate') return base;

    const rule = findRule(treatment.rules, valas);
    if (!rule || rule.tipe === 'flat') return base;

    const step = rule.tipe === 'percent' ? base * Number(rule.nilai) / 100 : Number(rule.nilai);
    return round2(tipe === 'buy' ? Math.max(base - step, 0) : base + step);
  }

  /**
   * Pasang pilihan guide pada $select. $field (pembungkus) hanya tampil bila mode bukan "off" dan
   * pengguna boleh menetapkan guide. onChange dipanggil setelah pilihan berubah; hint menggantikan teks petunjuk bawaan. Mengembalikan treatment.
   */
  async function bind($select, $field, { parent, onChange, hint } = {}) {
    const treatment = await load();
    const active = treatment.mode !== 'off' && treatment.can_assign;
    $field.toggleClass('d-none', !active);
    if (!active) return treatment;

    $field.find('.guide-mode-hint').text(
      hint ? hint : treatment.mode === 'rate'
        ? 'Rates are adjusted for this guide: higher for Sell, lower for Buy.'
        : 'Rates are unchanged; the commission is paid by the company.'
    );

    if (!$select.hasClass('select2-hidden-accessible')) {
      $select.select2({
        placeholder: 'No guide',
        allowClear: true,
        dropdownParent: parent,
        ajax: {
          url: url_api + '/guide/select2',
          dataType: 'json',
          headers: headers(),
          delay: 250,
          data: params => ({ search: params.term }),
          processResults: data => ({ results: data.results })
        }
      });
      $select.on('change', () => onChange && onChange($select.val() || null));
    }
    return treatment;
  }

  /**
   * Sesuaikan ulang rate semua baris tabel detail (mode "rate"). Rate dasar baris disimpan di
   * data('base') pada input .rate; tanpa guide rate kembali ke rate dasar.
   * formatter: Intl.NumberFormat tampilan angka halaman.
   */
  async function reapplyRows($tbody, { tipe, guide, formatter }) {
    const treatment = await load();
    if (treatment.mode !== 'rate') return false;

    $tbody.find('tr').each(function () {
      const $rate = $(this).find('.rate');
      const base = $rate.data('base');
      const valas = $(this).find('select.valas').val();
      if (base === undefined || !valas) return;

      const rate = guide ? adjust(treatment, base, valas, tipe) : base;
      const jumlah = parseFloat(($(this).find('.jumlah').val() || '').replace(/\./g, '').replace(/,/g, '.')) || 0;
      $rate.val(formatter.format(rate));
      $(this).find('.subtotal').val(formatter.format(jumlah * rate));
    });
    return true;
  }

  /** Isi pilihan guide yang sudah tersimpan (id + teks) tanpa memicu perubahan rate. */
  function setValue($select, id, text) {
    $select.empty();
    if (id) $select.append(new Option(text || String(id), id, true, true));
    $select.trigger('change.select2');
  }

  return { load, adjust, bind, reapplyRows, setValue };
})();
