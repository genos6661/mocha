let start, end, cabang, user, akun_start, akun_end, show, namaPT, reportData = {};
$(document).ready(function() {
    $('#cabangFilter').select2({
        dropdownParent: '#modalFilter',
        ajax: {
          url: url_api + '/cabang/select2',
          dataType: 'json',
          headers: {
            "X-Client-Domain": myDomain
          },
          delay: 250,
          data: function (params) {
            return {
              search: params.term
            };
          },
          processResults: function (data) {
            return {
              results: data.results
            };
          }
        },
        placeholder: 'All Branchs',
        allowClear: true
    });

    $('#akun_startFilter, #akun_endFilter').select2({
        dropdownParent: '#modalFilter',
        ajax: {
          url: url_api + '/akun/select2',
          dataType: 'json',
          headers: {
            "X-Client-Domain": myDomain,
            "Authorization": `Bearer ${window.token}`
          },
          delay: 250,
          data: function (params) {
            return {
              search: params.term
            };
          },
          processResults: function (data) {
            return {
              results: data.results
            };
          }
        },
        placeholder: 'All Accounts',
        allowClear: true
    });

    $('#rangeFilter').on('change', function () {
        updateDateRangeSelector(this.value);
    });

    $('#showOptionFilter').select2({ dropdownParent: $('#modalFilter') });
    $('#showOptionFilter').val("1").trigger('change');
    $('#rangeFilter').select2({dropdownParent: $('#modalFilter')});

    loadHeader();
    loadData();

    const threshold = 300;

    $(window).on('scroll', function () {
      if ($(this).scrollTop() > threshold) {
        $('#boxSticky').show();
      } else {
        $('#boxSticky').hide();
      }
    });

    $('#akun_startFilter').on('change', function () {
      const val = $(this).val();

      if (!val) {
        $('#akun_endFilter').val(null).trigger('change');
        return;
      }

      const startData = $('#akun_startFilter').select2('data');
      const text = (startData && startData.length) ? startData[0].text : $('#akun_startFilter option:selected').text();

      $('#akun_endFilter').find(`option[value="${val}"]`).remove();

      const newOption = new Option(text, val, true, true); 
      $('#akun_endFilter').append(newOption).trigger('change');
    });
});

// akhir document ready
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        start: params.get("start"),
        end: params.get("end"),
        cabang: params.get("cabang"),
        akun_start: params.get("akun_start"),
        akun_end: params.get("akun_end"),
        show: params.get("show")
    };
}

function getCabang(id, callback) {
  $.ajax({
    url: url_api + '/cabang/id/' + id,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      callback(response.nama); // panggil callback dengan nama cabang
    },
    error: function (xhr) {
      if (xhr.status === 404) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
      } else {
        notif.fire({
          icon: 'error',
          text: 'Terjadi Kesalahan pada server'
        });
      }
      callback(null); // panggil callback dengan null jika error
    }
  });
}

function loadHeader() {
    Loading.standard({
        backgroundColor: 'rgba(' + window.Helpers.getCssVar('black-rgb') + ', 0.5)',
        svgSize: '0px'
    });
    let customSpinnerHTML = `
          <div class="sk-wave mx-auto">
              <div class="sk-rect sk-wave-rect"></div>
              <div class="sk-rect sk-wave-rect"></div>
              <div class="sk-rect sk-wave-rect"></div>
              <div class="sk-rect sk-wave-rect"></div>
              <div class="sk-rect sk-wave-rect"></div>
          </div>
    `;
    let notiflixBlock = document.querySelector('.notiflix-loading');
    notiflixBlock.innerHTML = customSpinnerHTML;
    const params = getUrlParams();
    start = params.start;
    end = params.end;
    cabang = params.cabang;
    akun_start = params.akun_start;
    akun_end = params.akun_end;
    show = params.show;

    const tanggal_awal = new Date(start);
    const tanggal_akhir = new Date(end);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));

    if (cabang && cabang !== '') {
        getCabang(cabang, function (namaCabang) {
            $('#cabang').text(namaCabang || '');
            $('#chipCabang').toggleClass('d-none', !namaCabang);
        });
    } else {
      $('#cabang').text('');
      $('#chipCabang').addClass('d-none');
    }

    if (user && user !== '') {
        $('#user').text('Inputed By : ' + user);
        $('#chipUser').removeClass('d-none');
    } else {
        $('#user').text('');
        $('#chipUser').addClass('d-none');
    }

    $.ajax({
        url: url_api + '/setting',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            namaPT = response.NamaPT.strval;
            $('#namaPT').text(namaPT);
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                notif.fire({
                  icon: 'error',
                  text: xhr.responseJSON.message
                });
                if (document.querySelector(`.notiflix-loading`)) {
                    Loading.remove();
                }
            } else {
                notif.fire({
                  icon: 'error',
                  text: 'Terjadi Kesalahan pada server'
                });
                if (document.querySelector(`.notiflix-loading`)) {
                    Loading.remove();
                }
            }
        },
    });
}

function loadData() {
  Loading.standard({
      backgroundColor: 'rgba(' + window.Helpers.getCssVar('black-rgb') + ', 0.5)',
      svgSize: '0px'
  });
  let customSpinnerHTML = `
        <div class="sk-wave mx-auto">
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
            <div class="sk-rect sk-wave-rect"></div>
        </div>
  `;
  let notiflixBlock = document.querySelector('.notiflix-loading');
  notiflixBlock.innerHTML = customSpinnerHTML;
  const params = new URLSearchParams();
  if (start) params.append("start_date", start);
  if (end) params.append("end_date", end);
  if (cabang) params.append("cabang", cabang);
  if (akun_start) params.append("akun_start", akun_start);
  if (akun_end) params.append("akun_end", akun_end);

  $.ajax({
      url: url_api + `/accounting-report/ledger?${params.toString()}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (response) {
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }

        // Kosongkan container dulu
        $('#card-body').empty();
        reportData = response;
        const jumlahAkun = Object.keys(response).length;
        $('#jmlAkun').text(`${jumlahAkun} account${jumlahAkun === 1 ? '' : 's'}`);
        $('#chipAkun').toggleClass('d-none', !jumlahAkun);

        // Loop setiap akun
        Object.keys(response).forEach(kode => {
            const akun = response[kode];
            let saldo = akun.saldo_awal || 0;
            const saldoAwal = saldo;

            // Tentukan aturan perhitungan berdasarkan kepala akun
            const kepala = parseInt(kode.toString().charAt(0), 10);
            const isDebitNormal = [1, 5, 6, 7, 9].includes(kepala);

            let totalDebit = 0, totalKredit = 0;
            const rows = akun.mutasi.map(m => {
                saldo += isDebitNormal ? (m.debit - m.kredit) : (m.kredit - m.debit);
                totalDebit += m.debit;
                totalKredit += m.kredit;
                return `
                  <tr>
                    <td class="lg-ref">${lgEsc(new Date(m.tanggal).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))}</td>
                    <td><div class="lg-ref">${lgEsc(m.nomor || '-')}</div>${m.prefix ? `<span class="lg-type">${lgEsc(m.prefix)}</span>` : ''}</td>
                    <td><div>${lgEsc(m.kontak || '-')}</div>${m.deskripsi ? `<div class="lg-desc">${lgEsc(m.deskripsi)}</div>` : ''}</td>
                    <td class="lg-num">${lgMoney(m.debit)}</td>
                    <td class="lg-num">${lgMoney(m.kredit)}</td>
                    <td class="lg-num fw-semibold ${saldo < 0 ? 'lg-neg' : ''}">${formatAngka(saldo)}</td>
                  </tr>`;
            }).join('');

            $('#card-body').append(`
              <section class="lg-account">
                <div class="lg-head">
                  <div class="lg-id">
                    <span class="lg-code">${lgEsc(kode)}</span>
                    <div class="min-w-0">
                      <div class="lg-name">${lgEsc(akun.nama_akun)}${akun.alias_akun ? ` <span class="lg-muted fw-normal">- ${lgEsc(akun.alias_akun)}</span>` : ''}</div>
                      <div class="lg-sub">${lgEsc(akun.nama_master)}${akun.alias_subklas ? `<span class="lg-badge">${lgEsc(akun.alias_subklas)}</span>` : ''}</div>
                    </div>
                  </div>
                  <div class="lg-stats">
                    <div class="lg-stat"><small>Opening</small><b>${formatAngka(saldoAwal)}</b></div>
                    <div class="lg-stat"><small>Debit</small><b>${formatAngka(totalDebit)}</b></div>
                    <div class="lg-stat"><small>Credit</small><b>${formatAngka(totalKredit)}</b></div>
                    <div class="lg-stat lg-closing"><small>Closing</small><b class="${saldo < 0 ? 'lg-neg' : ''}">${formatAngka(saldo)}</b></div>
                  </div>
                </div>
                <div class="lg-scroll">
                  <table class="lg-table">
                    <thead>
                      <tr>
                        <th style="width: 11%;">Date</th>
                        <th style="width: 17%;">Reference</th>
                        <th>Contact / Description</th>
                        <th class="lg-num" style="width: 13%;">Debit</th>
                        <th class="lg-num" style="width: 13%;">Credit</th>
                        <th class="lg-num" style="width: 14%;">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="lg-open"><td colspan="5">Opening Balance</td><td class="lg-num">${formatAngka(saldoAwal)}</td></tr>
                      ${rows || '<tr class="lg-empty"><td colspan="6">No transactions in this period</td></tr>'}
                    </tbody>
                    <tfoot>
                      <tr class="lg-total">
                        <td colspan="3">Total</td>
                        <td class="lg-num">${formatAngka(totalDebit)}</td>
                        <td class="lg-num">${formatAngka(totalKredit)}</td>
                        <td class="lg-num ${saldo < 0 ? 'lg-neg' : ''}">${formatAngka(saldo)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            `);
        });
    },
      error: function (xhr) {
          notif.fire({
            icon: 'error',
            text: xhr.responseJSON.message
          });
          if (document.querySelector(`.notiflix-loading`)) {
              Loading.remove();
          }
      },
  });
}

function updateDateRangeSelector(selectedValue) {
  const today = new Date();
  let startDate = '';
  let endDate = '';

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  switch (selectedValue) {
    case 'today':
      startDate = endDate = formatDate(today);
      break;

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = endDate = formatDate(yesterday);
      break;

    case 'tomorrrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      startDate = endDate = formatDate(tomorrow);
      break;

    case 'week':
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startDate = formatDate(startOfWeek);
      endDate = formatDate(today);
      break;

    case 'lastWeek':
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      startDate = formatDate(lastWeekStart);
      endDate = formatDate(lastWeekEnd);
      break;

    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      startDate = formatDate(startOfMonth);
      endDate = formatDate(endOfMonth);
      break;

    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDate(lastMonthStart);
      endDate = formatDate(lastMonthEnd);
      break;

    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      startDate = formatDate(startOfYear);
      endDate = formatDate(endOfYear);
      break;

    case 'lastYear':
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      startDate = formatDate(lastYearStart);
      endDate = formatDate(lastYearEnd);
      break;

    case 'all':
    default:
      startDate = '';
      endDate = '';
      break;
  }

  $('#startDate').val(startDate);
  $('#endDate').val(endDate);
}

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const startDate = $('#startDate').val();
  const endDate = $('#endDate').val();
  const cabang = $('#cabangFilter').val();
  const show = $('#showOptionFilter').val();
  const akun_start = $('#akun_startFilter').val();
  const akun_end = $('#akun_endFilter').val();
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (akun_start) params.append('akun_start', akun_start);
  if (akun_end) params.append('akun_end', akun_end);
  if (show) params.append('show', show);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  loadHeader();
  loadData();
  $('#modalFilter').modal('hide');
});

function lgEsc(v) {
  return $('<div>').text(v ?? '').html();
}

// nol ditampilkan "-" supaya kolom debit / kredit lebih mudah dibaca
function lgMoney(v) {
  return Number(v) ? formatAngka(v) : '<span class="lg-muted">-</span>';
}

// format angka Indonesia (1.234.567,89); dipakai di layar dan semua ekspor
function formatAngka(value) {
  return (Number(value) || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

function buildLedgerSections() {
  const sections = [];

  Object.keys(reportData).forEach(kode => {
    const akun = reportData[kode];

    let saldo = akun.saldo_awal || 0;

    const kepala = parseInt(kode.toString().charAt(0), 10);
    const isDebitNormal = [1, 5, 6, 7, 9].includes(kepala);

    const body = [
      [
        { content: "Saldo Awal", colSpan: 7, styles: { halign: "left", fontStyle: "bold" } },
        { content: formatAngka(saldo), styles: { halign: "right", fontStyle: "bold" } },
      ],
    ];

    let totalDebit = 0, totalKredit = 0;

    (akun.mutasi || []).forEach(m => {
      if (isDebitNormal) {
        saldo += (m.debit - m.kredit);
      } else {
        saldo += (m.kredit - m.debit);
      }

      totalDebit += m.debit;
      totalKredit += m.kredit;

      body.push([
        new Date(m.tanggal).toLocaleDateString(),
        m.prefix || '-',
        m.nomor || '-',
        m.kontak || '-',
        m.deskripsi || '-',
        formatAngka(m.debit),
        formatAngka(m.kredit),
        formatAngka(saldo),
      ]);
    });

    sections.push({
      heading: `${kode}   ${akun.nama_akun} - ${akun.alias_akun}   |   ${akun.nama_master}   |   ${akun.alias_subklas}`,
      body,
      foot: [
        { content: "Total :", colSpan: 5 },
        formatAngka(totalDebit),
        formatAngka(totalKredit),
        formatAngka(saldo),
      ],
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
    });
  });

  return sections;
}

$("#export-pdf").click(function () {
  if (!reportData || Object.keys(reportData).length === 0) {
    notif.fire({
      icon: "error",
      title: "Tidak ada data untuk diekspor",
    });
    return;
  }

  exportLedgerPDF({
    data: reportData,
    filename: `Ledger_${start}_${end}.pdf`,
    nama_pt: namaPT,
    start,
    end,
    cabang: $('#cabang').text() || '',
    fmt: formatAngka,
  });
});

$("#export-excel").click(function () {
  if (!reportData || Object.keys(reportData).length === 0) {
    notif.fire({
      icon: "error",
      title: "Tidak ada data untuk diekspor",
    });
    return;
  }

  exportToExcel({
    sections: buildLedgerSections(),
    headers: ["Date", "Type", "Number", "Contact", "Description", "Debit", "Credit", "Balance"],
    filename: `Ledger_${start}_${end}.xlsx`,
  });
});

$('#print').click(function () {
  printReport('cardData');
});
