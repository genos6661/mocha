/**
 * Laporan umur piutang / hutang (Accounting Reports). Data dari GET /debt/aging; ekspor memakai js/export/*.
 */
(function () {
  const state = { tipe: 'AR', tanggal: new Date().toISOString().slice(0, 10), cabang: '', kontak: '' };
  let report = null, namaPT = '';
  const headers = () => ({ 'X-Client-Domain': myDomain, 'Authorization': `Bearer ${window.token}` });
  const esc = s => $('<div>').text(s ?? '').html();
  const fmt = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const angka = v => (v ? fmt.format(v) : '-');
  const COLS = ['belum', 'h30', 'h60', 'h90', 'h90plus', 'tanpa', 'total'];
  const HEAD = ['Party', 'Docs', 'Not Yet Due', '1-30 Days', '31-60 Days', '61-90 Days', '> 90 Days', 'No Due Date', 'Total (Rp)'];

  const rowCells = r => [r.pihak, r.jumlah, ...COLS.map(c => angka(r[c]))];
  const totalCells = (label, t, docs) => [label, docs, ...COLS.map(c => angka(t[c]))];

  function render() {
    const ar = state.tipe === 'AR';
    $('#judul').text(ar ? 'Receivable Aging' : 'Payable Aging');
    $('#subjudul').text(ar ? 'Umur Piutang' : 'Umur Hutang');
    $('#asOf').text('As of ' + new Date(report.tanggal + 'T00:00:00').toLocaleDateString('en-ID', { year: 'numeric', month: 'long', day: 'numeric' }));
    const filters = [$('#cabangFilter').find('option:selected').text() && 'Branch: ' + $('#cabangFilter').find('option:selected').text(),
      $('#kontakFilter').find('option:selected').text() && 'Contact: ' + $('#kontakFilter').find('option:selected').text()].filter(Boolean);
    $('#infoFilter').toggleClass('d-none', !filters.length).text(filters.join(' | '));

    const draw = (tableId, rows, total, label) => {
      const $b = $(`#${tableId} tbody`).empty(), $f = $(`#${tableId} tfoot`).empty();
      if (!rows.length) $b.html('<tr><td colspan="9" class="text-center text-muted">No outstanding balances</td></tr>');
      rows.forEach(r => $b.append('<tr>' + rowCells(r).map((c, i) => `<td class="${i ? 'text-end' : ''}">${esc(c)}</td>`).join('') + '</tr>'));
      if (rows.length) {
        $f.append('<tr class="table-light fw-semibold">' + totalCells(label, total, rows.reduce((s, r) => s + r.jumlah, 0))
          .map((c, i) => `<td class="${i ? 'text-end' : ''}">${esc(c)}</td>`).join('') + '</tr>');
      }
    };
    const company = report.data.filter(r => !r.antar_cabang), inter = report.data.filter(r => r.antar_cabang);
    draw('tabelAging', company, report.total.perusahaan, 'Total');
    $('#boxAntarCabang').toggleClass('d-none', !inter.length);
    draw('tabelAntarCabang', inter, report.total.antar_cabang, 'Total inter-branch');
  }

  function load() {
    $.ajax({
      url: url_api + '/debt/aging', headers: headers(), data: state,
      success: res => { report = res; render(); },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load report' })
    });
  }

  function sections() {
    const company = report.data.filter(r => !r.antar_cabang), inter = report.data.filter(r => r.antar_cabang);
    const numeric = { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } };
    const make = (heading, rows, total, label) => ({
      heading, body: rows.map(rowCells), columnStyles: numeric,
      foot: totalCells(label, total, rows.reduce((s, r) => s + r.jumlah, 0))
    });
    const out = [make(state.tipe === 'AR' ? 'Receivables' : 'Payables', company, report.total.perusahaan, 'Total')];
    if (inter.length) out.push(make('Inter-branch (not included in the total above)', inter, report.total.antar_cabang, 'Total inter-branch'));
    return out;
  }

  const title = () => `${state.tipe === 'AR' ? 'Receivable' : 'Payable'} Aging as of ${report.tanggal}`;
  const guard = () => {
    if (!report || !report.data.length) { notif.fire({ icon: 'error', title: 'Tidak ada data untuk diekspor' }); return false; }
    return true;
  };

  $(function () {
    const remote = (selector, url, placeholder) => $(selector).select2({
      dropdownParent: '#modalFilter', allowClear: true, placeholder,
      ajax: {
        url: url_api + url, dataType: 'json', headers: headers(), delay: 300,
        data: p => ({ search: p.term || '', page: p.page || 1 }),
        processResults: (data, p) => { p.page = p.page || 1; return { results: data.results, pagination: data.pagination }; }
      }
    });
    remote('#cabangFilter', '/cabang/select2/limit', 'All branches');
    remote('#kontakFilter', '/profile/select2', 'All contacts');

    $.ajax({
      url: url_api + '/setting', headers: headers(),
      success: res => { namaPT = res.NamaPT?.strval || ''; $('#namaPT').text(namaPT); }
    });

    $('#tabTipe').on('change', 'input[name="tipeDebt"]', function () {
      state.tipe = this.value;
      load();
    });
    $('#sbmFilter').on('click', () => {
      state.tanggal = $('#tanggalFilter').val() || new Date().toISOString().slice(0, 10);
      state.cabang = $('#cabangFilter').val() || '';
      state.kontak = $('#kontakFilter').val() || '';
      $('#modalFilter').modal('hide');
      load();
    });
    $('#resetFilter').on('click', () => {
      $('#tanggalFilter').val(new Date().toISOString().slice(0, 10));
      $('#cabangFilter, #kontakFilter').val(null).trigger('change');
    });
    $('#export-pdf').on('click', () => guard() && exportToPDF({
      sections: sections(), headers: HEAD, filename: `${title().replace(/ /g, '_')}.pdf`, title: title(), nama_pt: namaPT, cabang: $('#infoFilter').text()
    }));
    $('#export-excel').on('click', () => guard() && exportToExcel({ sections: sections(), headers: HEAD, filename: `${title().replace(/ /g, '_')}.xlsx` }));
    $('#print').on('click', () => printReport('cardData'));

    $.ajax({
      url: url_api + '/role/role-permissions', headers: headers(), traditional: true, data: { kode: ['debt'] },
      success: perms => {
        if (!perms.includes('debt')) {
          notif.fire({ icon: 'error', text: 'Insufficient Permission to load data' });
          return $('#tabelAging tbody').html('<tr><td colspan="9" class="text-center">Data Not Available</td></tr>');
        }
        load();
      },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to check permissions' })
    });
  });
})();
