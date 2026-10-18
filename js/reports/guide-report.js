/**
 * LAPORAN KOMISI GUIDE + PEMBAYARAN (/guide-report)
 * API: GET /guide/report, POST /guide/pay (lihat mocha_api/routes/pages/guide.js)
 *
 * Komisi yang dipilih untuk dibayar harus milik satu guide dan satu cabang: begitu satu baris dipilih,
 * baris guide/cabang lain dinonaktifkan sampai pilihan dikosongkan.
 */
$(document).ready(function () {
  const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  const headers = () => ({ 'Content-Type': 'application/json', 'X-Client-Domain': myDomain, Authorization: `Bearer ${window.token}` });
  const money = value => rupiah.format(Number(value) || 0);
  const esc = value => $('<div>').text(value ?? '').html();
  const dateText = value => (value ? String(value).slice(0, 10) : '');

  let report = { rows: [], summary: [], can_pay: false, defaults: {} };
  const selected = new Set();

  // ---------- filter ----------
  function isoDate(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 10);
  }

  function applyRange() {
    const range = $('#grRange').val();
    const now = new Date();
    const first = (y, m) => new Date(y, m, 1);
    const last = (y, m) => new Date(y, m + 1, 0);
    let from = '';
    let to = '';

    if (range === 'month') { from = isoDate(first(now.getFullYear(), now.getMonth())); to = isoDate(last(now.getFullYear(), now.getMonth())); }
    else if (range === 'lastMonth') { from = isoDate(first(now.getFullYear(), now.getMonth() - 1)); to = isoDate(last(now.getFullYear(), now.getMonth() - 1)); }
    else if (range === 'year') { from = `${now.getFullYear()}-01-01`; to = `${now.getFullYear()}-12-31`; }

    if (range !== 'custom') $('#grStart').val(from);
    if (range !== 'custom') $('#grEnd').val(to);
  }

  function select2Filter($el, url, placeholder, parent) {
    $el.select2({
      placeholder, allowClear: !parent, dropdownParent: parent,
      ajax: {
        url: url_api + url, dataType: 'json', delay: 250,
        headers: { 'X-Client-Domain': myDomain, Authorization: `Bearer ${window.token}` },
        data: params => ({ search: params.term }),
        processResults: data => ({ results: data.results })
      }
    });
  }

  // ---------- data ----------
  function load() {
    selected.clear();
    const params = {
      start_date: $('#grStart').val(), end_date: $('#grEnd').val(),
      guide: $('#grGuide').val() || '', cabang: $('#grCabang').val() || '', status: $('#grStatus').val()
    };
    if (!params.start_date || !params.end_date) { delete params.start_date; delete params.end_date; }

    $.ajax({ url: url_api + '/guide/report', headers: headers(), data: params })
      .done(data => { report = data; render(); })
      .fail(xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load the report' }));
  }

  // ---------- tampilan ----------
  function render() {
    const t = report.totals || {};
    $('#grTotal').text(money(t.komisi));
    $('#grPaid').text(money(t.dibayar));
    $('#grUnpaid').text(money(t.belum));
    $('#grCount').text(`${number.format(t.transaksi || 0)} transaction${t.transaksi === 1 ? '' : 's'}`);

    const $summary = $('#tabelGuideSummary tbody').empty();
    if (report.summary.length === 0) {
      $summary.append('<tr class="gr-empty"><td colspan="7" class="text-center text-body-secondary py-4">No commission found for this filter.</td></tr>');
    }
    report.summary.forEach(s => {
      const action = report.can_pay && s.belum > 0
        ? `<button type="button" class="btn btn-sm btn-outline-primary gr-pick" data-guide="${s.guide}">Select unpaid</button>` : '';
      $summary.append(`
        <tr>
          <td><span class="fw-semibold">${esc(s.nama_guide)}</span> <span class="badge bg-label-primary ms-1">${esc(s.kode_guide)}</span></td>
          <td class="text-end">${number.format(s.transaksi)}</td>
          <td class="text-end">${money(s.nilai_transaksi)}</td>
          <td class="text-end fw-semibold">${money(s.komisi)}</td>
          <td class="text-end text-success">${money(s.dibayar)}</td>
          <td class="text-end ${s.belum > 0 ? 'text-warning fw-semibold' : ''}">${money(s.belum)}</td>
          <td class="text-end">${action}</td>
        </tr>`);
    });

    const $rows = $('#tabelGuideRows tbody').empty();
    if (report.rows.length === 0) {
      $rows.append('<tr class="gr-empty"><td colspan="10" class="text-center text-body-secondary py-4">No transactions.</td></tr>');
    }
    report.rows.forEach(r => {
      const paid = Number(r.status) === 1;
      const check = report.can_pay && !paid && r.komisi > 0
        ? `<input type="checkbox" class="form-check-input gr-check" value="${r.noindex}" data-guide="${r.guide}" data-cabang="${r.cabang}">` : '';
      const status = paid
        ? `<span class="badge bg-label-success">Paid</span> <small class="text-body-secondary">${esc(r.nomor_kas || '')}</small>`
        : '<span class="badge bg-label-warning">Unpaid</span>';
      $rows.append(`
        <tr>
          <td>${check}</td>
          <td>${dateText(r.tanggal)}</td>
          <td>${esc(r.nomor)}</td>
          <td><span class="badge ${r.tipe === 'buy' ? 'bg-label-success' : 'bg-label-danger'}">${r.tipe === 'buy' ? 'BUY' : 'SELL'}</span></td>
          <td>${esc(r.nama_cabang)}</td>
          <td>${esc(r.nama_pelanggan)}</td>
          <td>${esc(r.nama_guide)} <small class="text-body-secondary">${esc(r.kode_guide)}</small></td>
          <td class="text-end">${money(r.nilai_transaksi)}</td>
          <td class="text-end fw-semibold">${money(r.komisi)}</td>
          <td>${status}</td>
        </tr>`);
    });

    refreshSelection();
  }

  // ---------- pilihan ----------
  function rowOf(id) { return report.rows.find(r => r.noindex === Number(id)); }

  function refreshSelection() {
    const first = selected.size ? rowOf([...selected][0]) : null;

    $('#tabelGuideRows .gr-check').each(function () {
      const checked = selected.has(Number(this.value));
      const other = first && !(String($(this).data('guide')) === String(first.guide) && String($(this).data('cabang')) === String(first.cabang));
      $(this).prop('checked', checked).prop('disabled', !!other);
      $(this).closest('tr').toggleClass('gr-selected', checked).toggleClass('gr-muted', !!other);
    });

    const total = [...selected].reduce((sum, id) => sum + (rowOf(id)?.komisi || 0), 0);
    $('#grSelCount').text(selected.size);
    $('#grSelTotal').text(money(total));
    $('#grPayBar').toggleClass('d-none', selected.size === 0);
  }

  $('#tabelGuideRows').on('change', '.gr-check', function () {
    const id = Number(this.value);
    if (this.checked) selected.add(id); else selected.delete(id);
    refreshSelection();
  });

  $('#tabelGuideSummary').on('click', '.gr-pick', function () {
    const guide = String($(this).data('guide'));
    const unpaid = report.rows.filter(r => String(r.guide) === guide && Number(r.status) === 0 && r.komisi > 0);
    if (unpaid.length === 0) return;

    selected.clear();
    const cabang = unpaid[0].cabang;
    unpaid.filter(r => r.cabang === cabang).forEach(r => selected.add(r.noindex));
    refreshSelection();

    if (unpaid.some(r => r.cabang !== cabang)) {
      notif.fire({ icon: 'info', text: `Selected the unpaid commissions of ${unpaid[0].nama_cabang}. Commissions of other branches are paid separately.` });
    }
    document.querySelector('#tabelGuideRows').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#grClear').on('click', () => { selected.clear(); refreshSelection(); });

  // ---------- pembayaran ----------
  function fillSelect($el, item) {
    $el.empty();
    if (item) $el.append(new Option(item.text, item.id, true, true));
    $el.trigger('change');
  }

  $('#grPay').on('click', function () {
    const first = rowOf([...selected][0]);
    if (!first) return;

    const total = [...selected].reduce((sum, id) => sum + (rowOf(id)?.komisi || 0), 0);
    $('#payGuide').text(`${first.nama_guide} (${first.kode_guide})`);
    $('#payCabang').text(first.nama_cabang);
    $('#payCount').text(selected.size);
    $('#payTotal').text(money(total));
    $('#payTanggal').val(isoDate(new Date()));
    $('#payDeskripsi').val('');
    fillSelect($('#payKas'), report.defaults?.kas);
    fillSelect($('#payBeban'), report.defaults?.akun_komisi);
    $('#modalPay').modal('show');
  });

  $('#payConfirm').on('click', function () {
    const first = rowOf([...selected][0]);
    if (!first) return;
    if (!$('#payKas').val() || !$('#payBeban').val() || !$('#payTanggal').val()) {
      return notif.fire({ icon: 'warning', text: 'Choose the date, cash/bank account and expense account.' });
    }

    const $btn = $(this).prop('disabled', true);
    $.ajax({
      url: url_api + '/guide/pay', type: 'POST', headers: headers(),
      data: JSON.stringify({
        guide: first.guide, ids: [...selected], tanggal: $('#payTanggal').val(),
        akunKas: $('#payKas').val(), akunLawan: $('#payBeban').val(), deskripsi: $('#payDeskripsi').val()
      })
    })
      .done(res => {
        $('#modalPay').modal('hide');
        Swal.fire({
          icon: 'success', title: 'Commission paid',
          html: `${money(res.total)} was recorded as Cash Transaction <b>${esc(res.nomor)}</b>.`,
          confirmButtonText: 'Okay', customClass: { confirmButton: 'btn btn-primary' }
        });
        load();
      })
      .fail(xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to pay the commission' }))
      .always(() => $btn.prop('disabled', false));
  });

  // ---------- init ----------
  select2Filter($('#grGuide'), '/guide/select2', 'All guides');
  select2Filter($('#grCabang'), '/cabang/select2/limit', 'All branches');
  select2Filter($('#payKas'), '/akun/kas/select2', 'Choose cash/bank account', $('#modalPay'));
  select2Filter($('#payBeban'), '/akun/non-kas/select2', 'Choose expense account', $('#modalPay'));

  $('#grRange').on('change', () => { applyRange(); load(); });
  $('#grStart, #grEnd').on('change', () => { $('#grRange').val('custom'); load(); });
  $('#grGuide, #grCabang, #grStatus').on('change', load);

  applyRange();
  load();
});
