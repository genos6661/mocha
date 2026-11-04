/**
 * Halaman Utang Piutang: daftar piutang (AR) dan hutang (AP), ringkasan, filter, riwayat pelunasan, dan pintasan
 * ke form transaksi sumbernya. Halaman ini hanya membaca; perubahan dilakukan di transaksi sumber.
 */
(function () {
  const { fmt, ymd } = window.DebtForm;
  const LIMIT = 20;
  const headers = () => ({ 'X-Client-Domain': myDomain, 'Authorization': `Bearer ${window.token}` });
  const esc = s => $('<div>').text(s ?? '').html();
  const rp = n => 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n || 0);
  const state = { tipe: 'AR', offset: 0, search: '', status: 'open', cabang: '', kontak: '' };
  let permissions = [];
  let loadSeq = 0;

  const query = () => ({ tipe: state.tipe, status: state.status, cabang: state.cabang, kontak: state.kontak, search: state.search });

  function party(d) {
    return d.cabang_pihak ? `${esc(d.nama_cabang)} ${d.tipe === 'AR' ? '→' : '←'} ${esc(d.nama_pihak)} <span class="badge bg-label-secondary">Inter-branch</span>`
      : esc(d.nama_kontak || '-');
  }
  const dueCell = d => (d.jatuh_tempo ? ymd(d.jatuh_tempo) : '-') + (d.telat ? ' <span class="badge bg-label-danger">Overdue</span>' : '');
  const money = (d, v) => (d.valas ? `${fmt.format(v)}` : fmt.format(v));

  function loadSummary() {
    $.ajax({
      url: url_api + '/debt/summary', headers: headers(), data: query(),
      success: s => {
        const ar = state.tipe === 'AR';
        $('#labelTotal').text(ar ? 'Receivables outstanding' : 'Payables outstanding');
        $('#cardTotal').text(rp(s.perusahaan.total));
        $('#cardTotalNote').text(`${s.perusahaan.jumlah} open document(s), valued at the original rate`);
        $('#cardOverdue').text(rp(s.perusahaan.jatuh_tempo));
        $('#cardOverdueNote').text(s.perusahaan.jatuh_tempo ? 'Past the due date' : 'Nothing overdue');
        // sisi antar cabang saling meniadakan, jadi ditampilkan terpisah dan tidak masuk total di atas
        $('#noteAntarCabang').toggleClass('d-none', !s.antar_cabang.jumlah)
          .text(`Inter-branch ${ar ? 'receivables' : 'payables'} (not included above): ${rp(s.antar_cabang.total)} in ${s.antar_cabang.jumlah} document(s)`);
      },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load summary' })
    });
  }

  function loadList(reset) {
    if (reset) state.offset = 0;
    const seq = ++loadSeq;
    $.ajax({
      url: url_api + '/debt/list', headers: headers(), data: { ...query(), offset: state.offset, limit: LIMIT },
      success: res => {
        if (seq !== loadSeq) return;
        const $tbody = $('#tabelDebt tbody');
        if (reset) $tbody.empty();
        res.data.forEach(d => {
          $tbody.append(`
            <tr class="cursor-pointer" data-id="${d.noindex}">
              <td><div class="fw-medium">${esc(d.nomor)}</div><small class="text-muted">${ymd(d.tanggal)}</small></td>
              <td>${party(d)}</td>
              <td>${dueCell(d)}</td>
              <td>${esc(d.kode_valas || 'Rp')}</td>
              <td class="text-end">${money(d, d.jumlah)}</td>
              <td class="text-end fw-medium">${money(d, d.sisa)}</td>
              <td class="text-end">${fmt.format(d.sisa_rp)}</td>
            </tr>`);
        });
        state.offset += res.data.length;
        if (!$tbody.children().length) $tbody.html('<tr><td colspan="7" class="text-center text-muted">No documents</td></tr>');
        $('#infoDebt').text(`${Math.min(state.offset, res.total)} of ${res.total}`);
        $('#btnMore').toggleClass('d-none', state.offset >= res.total);
      },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load data' })
    });
  }

  const reload = () => { loadSummary(); loadList(true); };

  function actions(d) {
    const $a = $('#detailActions').empty();
    const can = p => permissions.includes(p);
    if (d.sisa > 0.005) {
      const link = (href, text) => $a.append(`<a class="btn btn-primary" href="${href}">${text}</a>`);
      if (d.cabang_pihak) {
        // yang melunasi adalah cabang berhutang: untuk piutang, pakai dokumen hutang pasangannya
        if (can('add_transfer')) link(`/forex-transfer?debt=bayar&doc=${d.tipe === 'AR' ? d.pasangan : d.noindex}`, 'Settle (Forex Transfer)');
      } else {
        if (can('add_cash')) link(`/cash-transaction?debt=bayar&doc=${d.noindex}`, d.valas ? 'Settle in rupiah (Cash)' : 'Settle (Cash)');
        if (d.valas && can('add_adjustment')) link(`/adjustment?debt=bayar&doc=${d.noindex}`, 'Settle in forex (Adjustment)');
      }
    }
    $a.append('<button class="btn btn-label-secondary" data-bs-dismiss="modal">Close</button>');
  }

  function showDetail(id) {
    $.ajax({
      url: url_api + '/debt/' + id, headers: headers(),
      success: d => {
        const ar = d.tipe === 'AR';
        const unit = d.valas ? ' ' + esc(d.kode_valas) : '';
        $('#detailTitle').text(ar ? 'Receivable/Piutang' : 'Payable/Hutang');
        $('#detailNomor').text('#' + d.nomor);
        $('#detailBadge').html(d.sisa <= 0.005 ? '<span class="badge bg-label-success">Settled</span>'
          : (d.jatuh_tempo && new Date(d.jatuh_tempo) < new Date(new Date().toDateString()) ? '<span class="badge bg-label-danger">Overdue</span>' : '<span class="badge bg-label-warning">Open</span>'));
        $('#dParty').html(d.cabang_pihak ? `${esc(d.nama_cabang)} ${ar ? '→' : '←'} ${esc(d.nama_pihak)}` : esc(d.nama_kontak || '-'));
        $('#dCabang').text(d.nama_cabang);
        $('#dTanggal').text(ymd(d.tanggal));
        $('#dJatuhTempo').text(d.jatuh_tempo ? ymd(d.jatuh_tempo) : '-');
        $('#dJumlah').html(`${fmt.format(d.jumlah)}${unit}${d.valas ? ` @ ${fmt.format(d.kurs)} = ${rp(d.jumlah * d.kurs)}` : ''}`);
        $('#dSisa').html(`${fmt.format(d.sisa)}${unit}`);
        $('#dDeskripsi').text(d.deskripsi || '-');
        const $b = $('#tabelBayar tbody').empty();
        if (!d.bayar.length) $b.html('<tr><td colspan="5" class="text-center text-muted">No settlements yet</td></tr>');
        d.bayar.forEach(b => $b.append(`
          <tr>
            <td>${ymd(b.tanggal)}</td>
            <td>${esc(b.nomor)}</td>
            <td class="text-end">${fmt.format(b.jumlah)}${unit}</td>
            <td class="text-end">${d.valas ? fmt.format(b.kurs) : '-'}</td>
            <td class="text-end ${b.selisih < 0 ? 'text-danger' : ''}">${b.selisih ? fmt.format(b.selisih) : '-'}</td>
          </tr>`));
        actions(d);
        $('#modalDetail').modal('show');
      },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to load document' })
    });
  }

  function remoteSelect(selector, url, placeholder) {
    $(selector).select2({
      dropdownParent: $('#modalFilter'), allowClear: true, placeholder,
      ajax: {
        url: url_api + url, dataType: 'json', headers: headers(), delay: 300,
        data: p => ({ search: p.term || '', page: p.page || 1 }),
        processResults: (data, p) => { p.page = p.page || 1; return { results: data.results, pagination: data.pagination }; }
      }
    });
  }

  $(function () {
    remoteSelect('#cabangFilter', '/cabang/select2/limit', 'All branches');
    remoteSelect('#kontakFilter', '/profile/select2', 'All contacts');

    $('#tabTipe').on('change', 'input[name="tipeDebt"]', function () {
      state.tipe = this.value;
      reload();
    });
    let timer;
    $('#searchDebt').on('keyup', function () {
      clearTimeout(timer);
      timer = setTimeout(() => { state.search = this.value.trim(); reload(); }, 400);
    });
    $('#sbmFilter').on('click', () => {
      state.status = $('#statusFilter').val();
      state.cabang = $('#cabangFilter').val() || '';
      state.kontak = $('#kontakFilter').val() || '';
      $('#modalFilter').modal('hide');
      reload();
    });
    $('#resetFilter').on('click', () => {
      $('#statusFilter').val('open');
      $('#cabangFilter, #kontakFilter').val(null).trigger('change');
    });
    $('#btnMore').on('click', () => loadList(false));
    $('#tabelDebt tbody').on('click', 'tr[data-id]', function () { showDetail($(this).data('id')); });
    $('#btnNew').closest('.dropdown').on('click', '[data-href]', function () { location.href = $(this).data('href'); });

    $.ajax({
      url: url_api + '/role/role-permissions', headers: headers(), traditional: true,
      data: { kode: ['debt', 'add_cash', 'add_adjustment', 'add_transfer'] },
      success: perms => {
        permissions = perms;
        // pintasan "New" hanya yang boleh dipakai user
        $('#btnNew').next('.dropdown-menu').find('[data-perm]').each(function () { if (!perms.includes($(this).data('perm'))) $(this).parent().remove(); });
        if (!$('#btnNew').next('.dropdown-menu').children().length) $('#btnNew').remove();
        if (!perms.includes('debt')) {
          notif.fire({ icon: 'error', text: 'Insufficient Permission to load data' });
          return $('#tabelDebt tbody').html('<tr><td colspan="7" class="text-center">Data Not Available</td></tr>');
        }
        reload();
      },
      error: xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to check permissions' })
    });
  });
})();
