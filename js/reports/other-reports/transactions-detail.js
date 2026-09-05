let start, end, cabang, pelanggan, buy, sell, sort_by, sort_dir, parsedSetting;
let offset = 0;
const limit = 50;
let isLoading = false;
let hasMoreData = true;
let searchTimeout = null;
let transCount = 0;
let grandTotalForeign = 0;
let grandTotalRupiah = 0;
let isExporting = false;

$(document).ready(function() {
    if(savedSetting) {
      parsedSetting = JSON.parse(savedSetting);
    }
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

    $('#pelangganFilter').select2({
      dropdownParent: $('#modalFilter'),
      ajax: {
        url: url_api + '/profile/select2',
        dataType: 'json',
        headers: {
          "X-Client-Domain": myDomain,
          "Authorization": `Bearer ${window.token}`
        },
        delay: 1000,
        data: function (params) {
          return {
            search: params.term || '',
            page: params.page || 1
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;

          return {
            results: data.results,
            pagination: {
              more: data.pagination.more
            }
          };
        }
      },
      templateResult: function (data) {
        if (!data.id) return data.nama;

        return `
          <div style="padding:6px 4px;">
            <div style="font-weight:600;">${data.nama}</div>
            <div style="font-size:12px;color:#666;">
              📧 ${data.email || '-'}<br>
              📱 ${data.telepon || '-'}<br>
              🌍 ${data.nama_negara || '-'}
            </div>
          </div>
        `;
      },

      templateSelection: function (data) {
        return `${data.nama} - ${data.nama_negara}` || 'Choose Contact';
      },

      escapeMarkup: function (markup) {
        return markup;
      },
      placeholder: 'Choose Contact',
      minimumInputLength: 0,
      allowClear: true
    });

  $('#rangeFilter').on('change', function () {
      updateDateRangeSelector(this.value);
  });

  $('#rangeFilter').select2({dropdownParent: $('#modalFilter')});

  $('#searchLog').on('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadData(true);
    }, 1000);
  });

  loadHeader();
  loadData(true);
});

// akhir document ready
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        start: params.get("start"),
        end: params.get("end"),
        cabang: params.get("cabang"),
        pelanggan: params.get("pelanggan"),
        buy: params.get("buy"),
        sell: params.get("sell")
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
      callback(response.nama);
    },
    error: function (xhr) {
      callback(null);
    }
  });
}

function loadHeader() {
    const params = getUrlParams();
    start = params.start || '';
    end = params.end || '';
    cabang = params.cabang;
    pelanggan = params.pelanggan;
    buy = params.buy;
    sell = params.sell;

    if ((start || end) && (start != '' || end != '')) {
      const tanggal_awal = new Date(start);
      const tanggal_akhir = new Date(end);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));
    } else {
      $('#range').text('All Time');
    }

    if (cabang && cabang !== '') {
        getCabang(cabang, function (namaCabang) {
            if (namaCabang) {
              $('#cabang').removeClass('d-none').text(namaCabang);
            } else {
              $('#cabang').addClass('d-none').text('');
            }
        });
    } else {
      $('#cabang').addClass('d-none').text('');
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
            $('#namaPT').text(response.NamaPT.strval);
        },
        error: function (xhr) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON?.message || 'Terjadi Kesalahan pada server'
            });
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

// Picks the foreign quantity from a detail item the same way transaction.js
// and transactions-summary.js do: tipe 3 = buy (beli), tipe 4 = sell (jual).
function pickQty(tipe, item) {
  if (tipe == 3) return Number(item.beli) || 0;
  if (tipe == 4) return Number(item.jual) || 0;
  return Number(item.beli || item.jual) || 0;
}

// Renders one transaction's summary row plus its nested Valas/Rate/Amount
// breakdown table (fetched separately since /other-report/transactions
// only returns the aggregate nilai_transaksi, not the per-currency detail).
function renderTransactionBlock(summary, full) {
  transCount++;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const tanggal = new Date(summary.tanggal).toLocaleDateString('id-ID', options);
  const isBuy = (summary.tipe || '').toLowerCase() === 'buy';
  const tipeBadge = isBuy
    ? '<span class="badge bg-label-success">BUY</span>'
    : '<span class="badge bg-label-danger">SELL</span>';

  const summaryRow = `
      <tr>
        <td class="text-center">${transCount}</td>
        <td class="text-center">${tanggal}</td>
        <td>${summary.nomor || ''}</td>
        <td class="text-center">${tipeBadge}</td>
        <td class="text-center">${summary.nama_cabang || ''}</td>
        <td>${summary.nama_pelanggan || ''}</td>
        <td>${summary.id || ''}</td>
        <td class="text-center">${summary.negara || ''}</td>
        <td class="text-end fw-bold">Rp. ${Number(summary.nilai_transaksi || 0).toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}</td>
      </tr>
  `;
  $('#tabelData > tbody').append(summaryRow);

  const detailItems = (full && full.details) || [];
  const tipeKode = full ? full.tipe : null;

  let subtotalForeign = 0;
  let subtotalRupiah = 0;
  let detailRowsHtml = '';

  if (detailItems.length === 0) {
    detailRowsHtml = '<tr><td colspan="4" class="text-center text-muted">Detail Data Not Found</td></tr>';
  } else {
    detailItems.forEach(function (di) {
      const qty = pickQty(tipeKode, di);
      const rate = Number(di.rate) || 0;
      const amountRp = qty * rate;

      subtotalForeign += qty;
      subtotalRupiah += amountRp;

      detailRowsHtml += `
          <tr>
            <td>${di.kode || ''} - ${di.nama || ''}</td>
            <td class="text-end">${rate.toLocaleString('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4
              })}</td>
            <td class="text-end">${qty.toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="text-end">${amountRp.toLocaleString('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}</td>
          </tr>
      `;
    });
  }

  grandTotalForeign += subtotalForeign;
  grandTotalRupiah += subtotalRupiah;

  // Built as separate DOM nodes rather than one combined HTML string: a
  // string containing both the outer <tr><td> and a nested <table> gets
  // mis-parsed by the browser's table foster-parenting rules when handed
  // to jQuery's .append() as raw markup (the following transaction's
  // summary row ends up nested inside this one's breakdown table instead
  // of as its own sibling row). Constructing each piece as a real node
  // first, then composing them, sidesteps that entirely.
  const nestedTableHtml = `
    <table class="table table-sm table-borderless mb-0 nested-detail-table">
      <thead>
        <tr>
          <th class="text-secondary" style="width: 25%;">Valas / Currency</th>
          <th class="text-end text-secondary" style="width: 25%;">Rate</th>
          <th class="text-end text-secondary" style="width: 25%;">Amount (Foreign)</th>
          <th class="text-end text-secondary" style="width: 25%;">Amount (RP)</th>
        </tr>
      </thead>
      <tbody>
        ${detailRowsHtml}
        <tr class="nested-total-row fw-bold">
          <td colspan="2">Total</td>
          <td class="text-end">${subtotalForeign.toLocaleString('id-ID', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</td>
          <td class="text-end">${subtotalRupiah.toLocaleString('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</td>
        </tr>
      </tbody>
    </table>
  `;

  // Leading empty cell keeps this indented under the Date column instead
  // of flush with the outer table's No column.
  const $outerRow = $('<tr><td></td><td colspan="8" class="p-0"></td></tr>');
  $outerRow.find('td').last().append($(nestedTableHtml));
  $('#tabelData > tbody').append($outerRow);
}

function renderGrandTotal() {
  $('#tabelData tfoot').remove();
  const foot = `
      <tfoot>
        <tr class="table-dark">
          <td colspan="7" class="fw-bold">Grand Total (${transCount} Transaksi)</td>
          <td class="text-end fw-bold">${grandTotalForeign.toLocaleString('id-ID', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</td>
          <td class="text-end fw-bold">Rp. ${grandTotalRupiah.toLocaleString('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</td>
        </tr>
      </tfoot>
  `;
  $('#tabelData').append(foot);
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${window.token}`,
    "X-Client-Domain": myDomain
  };
}

function fetchTransactionDetail(nomor) {
  return $.ajax({
    url: url_api + `/transaction/nomor/${nomor}`,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    headers: authHeaders()
  });
}

function loadData(reset = false) {
  if (isLoading || !hasMoreData) return;
  isLoading = true;

  if (reset) {
    offset = 0;
    hasMoreData = true;
    transCount = 0;
    grandTotalForeign = 0;
    grandTotalRupiah = 0;
    $('#tabelData > tbody').empty();
    $('#tabelData tfoot').remove();
  }

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
  if (notiflixBlock) notiflixBlock.innerHTML = customSpinnerHTML;

  const params = new URLSearchParams();
  if (start) params.append("start_date", start);
  if (end) params.append("end_date", end);
  if (cabang) params.append("branch", cabang);
  if (pelanggan) params.append("customer", pelanggan);
  if (buy) params.append("buy", buy);
  if (sell) params.append("sell", sell);
  if ($('#searchLog').val()) params.append("search", $('#searchLog').val());
  params.append("offset", offset);
  params.append("limit", limit);

  $.ajax({
    url: url_api + `/other-report/transactions?${params.toString()}`,
    type: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      const details = response.data || [];
      $('#totalData').text(response.total_count);

      if (details.length === 0) {
        if (offset === 0) {
          $('#tabelData > tbody').append('<tr><td colspan="9" class="text-center">Transactions Data Not Found</td></tr>');
        }
        hasMoreData = false;
        $('.table-responsive').off('scroll');
        renderGrandTotal();
        isLoading = false;
        if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
        }
        return;
      }

      const detailPromises = details.map(function (item) {
        return fetchTransactionDetail(item.nomor).then(
          function (full) { return { summary: item, full: full }; },
          function () { return { summary: item, full: null }; }
        );
      });

      Promise.all(detailPromises).then(function (results) {
        results.forEach(function (r) {
          renderTransactionBlock(r.summary, r.full);
        });

        offset += limit;
        if (offset >= response.total_count) {
          hasMoreData = false;
          $('.table-responsive').off('scroll');
        }

        renderGrandTotal();
        isLoading = false;
        if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
        }
      });
    },
    error: function (xhr) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON?.message || "Error load data"
      });
      isLoading = false;
      if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
      }
    },
  });
}

$('.table-responsive').on('scroll', function () {
  const $this = $(this);
  if ($this.scrollTop() + $this.innerHeight() >= this.scrollHeight - 50) {
    loadData();
  }
});

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const startDate = $('#startDate').val() || null;
  const endDate = $('#endDate').val() || null;
  const cabangFil = $('#cabangFilter').val() || null;
  const pelangganFil = $('#pelangganFilter').val() || null;
  const buyFil = $('#buy').is(':checked') ? 1 : 0;
  const sellFil = $('#sell').is(':checked') ? 1 : 0;
  const baseUrl = $('#urlToGo').val() || 'transactions-detail';

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabangFil) params.append('cabang', cabangFil);
  if (pelangganFil) params.append('pelanggan', pelangganFil);
  if (buyFil) params.append('buy', buyFil);
  if (sellFil) params.append('sell', sellFil);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  hasMoreData = true;
  loadHeader();
  loadData(true);
  $('#modalFilter').modal('hide');
});

// export
function loadAllDataForExport() {
  return new Promise((resolve, reject) => {
    let allBlocks = [];
    let offsetExport = 0;
    const limitExport = limit;
    let total = 0;

    $('#exportProgress').css('width', '0%').text('0%');
    $('#modalProgress').modal('show');

    function fetchNext() {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (cabang) params.append("branch", cabang);
      if (pelanggan) params.append("customer", pelanggan);
      if (buy) params.append("buy", buy);
      if (sell) params.append("sell", sell);
      if ($('#searchLog').val()) params.append("search", $('#searchLog').val());
      params.append("offset", offsetExport);
      params.append("limit", limitExport);

      $.ajax({
        url: url_api + `/other-report/transactions?${params.toString()}`,
        type: 'GET',
        headers: {
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
        },

        success: function (res) {
          if (total === 0) {
            total = res.total_count;

            if (total === 0) {
              $('#modalProgress').modal('hide');
              resolve([]);
              return;
            }
          }

          const batch = res.data || [];
          const detailPromises = batch.map(function (item) {
            return fetchTransactionDetail(item.nomor).then(
              function (full) { return buildExportBlock(item, full); },
              function () { return buildExportBlock(item, null); }
            );
          });

          Promise.all(detailPromises).then(function (blocks) {
            allBlocks.push(...blocks);
            offsetExport += limitExport;

            const percent = Math.min(
              Math.round((allBlocks.length / total) * 100),
              100
            );

            $('#exportProgress')
              .css('width', percent + '%')
              .text(percent + '%');

            if (allBlocks.length < total) {
              fetchNext();
            } else {
              setTimeout(() => {
                resolve(allBlocks);
              }, 200);
              $('#modalProgress').modal('hide');
            }
          });
        },

        error: function(xhr, status, error) {
          $('#modalProgress').modal('hide');
          reject(error || status);
        }
      });
    }

    fetchNext();
  });
}

function buildExportBlock(summary, full) {
  const detailItems = (full && full.details) || [];
  const tipeKode = full ? full.tipe : null;
  let subtotalForeign = 0;
  let subtotalRupiah = 0;

  const rows = detailItems.map(function (di) {
    const qty = pickQty(tipeKode, di);
    const rate = Number(di.rate) || 0;
    const amountRp = qty * rate;
    subtotalForeign += qty;
    subtotalRupiah += amountRp;

    return [`${di.kode || ''} - ${di.nama || ''}`, rate, qty, amountRp];
  });

  return { summary: summary, rows: rows, subtotalForeign: subtotalForeign, subtotalRupiah: subtotalRupiah };
}

// Per-transaction heading/header bars stay a light neutral tint — only the
// final Grand Total block (below) should read as a strong black row.
const lightSectionStyle = { fillColor: [245, 245, 245], textColor: [50, 50, 50] };
const darkSectionStyle = { fillColor: [33, 37, 41], textColor: 255, fontStyle: "bold" };

// Two real tables per transaction — a 9-column summary row followed by the
// narrower currency-breakdown table — mirroring the on-screen layout,
// rather than compressing the summary into a single text heading.
const summaryHeaders = ["No", "Date", "Number", "Type", "Branch", "Name", "ID", "Country", "Amount (Rp)"];
const detailHeaders = ["Currency", "Rate", "Amount (Foreign)", "Amount (RP)"];
// mm — fixed width of the summary row's No column, reused as the detail
// table's left indent so the two line up.
const noColumnWidth = 12;

function buildSections(blocks) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let gForeign = 0;
  let gRupiah = 0;

  const sections = [];

  blocks.forEach(function (block, index) {
    const s = block.summary;
    const tanggal = new Date(s.tanggal).toLocaleDateString('id-ID', options);
    const tipeLabel = (s.tipe || '').toUpperCase();
    gForeign += block.subtotalForeign;
    gRupiah += block.subtotalRupiah;

    sections.push({
      headers: summaryHeaders,
      body: [[
        index + 1,
        tanggal,
        s.nomor || '',
        tipeLabel,
        s.nama_cabang || '-',
        s.nama_pelanggan || '-',
        s.id || '-',
        s.negara || '-',
        Number(s.nilai_transaksi || 0).toLocaleString('id-ID')
      ]],
      headStyles: lightSectionStyle,
      columnStyles: {
        0: { halign: "center", cellWidth: noColumnWidth },
        1: { halign: "center" },
        3: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "right" },
      }
    });

    sections.push({
      headers: detailHeaders,
      body: block.rows,
      foot: ["Total", "", block.subtotalForeign, block.subtotalRupiah],
      // Indented so this table starts under Date instead of flush at the
      // margin/column A — matching the on-screen nested layout. `indent`
      // (mm) is read by the PDF exporter, `colOffset` (column count) by
      // the Excel exporter — same intent, different units per format.
      indent: noColumnWidth,
      colOffset: 1,
      headStyles: lightSectionStyle,
      footStyles: lightSectionStyle,
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      }
    });
  });

  sections.push({
    headers: detailHeaders,
    heading: `Grand Total (${blocks.length} Transaksi)`,
    body: [],
    foot: ["", "", gForeign, gRupiah],
    headStyles: darkSectionStyle,
    footStyles: darkSectionStyle,
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    }
  });

  return sections;
}

$("#export-pdf").click(function () {
  if (isExporting) return;
  isExporting = true;

  loadAllDataForExport()
    .then((blocks) => {
      exportToPDF({
        headers: ["Currency", "Rate", "Amount (Foreign)", "Amount (RP)"],
        sections: buildSections(blocks),
        filename: `Transactions_Detail_${start || 'all'}_${end || 'all'}.pdf`,
        title: 'Transactions Detail Report',
        nama_pt: parsedSetting.NamaPT.strval,
        start,
        end,
      });
    })
    .finally(() => {
      isExporting = false;
    });
});

$("#export-excel").click(function () {
  if (isExporting) return;
  isExporting = true;

  loadAllDataForExport()
    .then((blocks) => {
      exportToExcel({
        headers: ["Currency", "Rate", "Amount (Foreign)", "Amount (RP)"],
        sections: buildSections(blocks),
        filename: `Transactions_Detail_${start || 'all'}_${end || 'all'}.xlsx`,
      });
    })
    .finally(() => {
      isExporting = false;
    });
});

$('#print').click(function () {
  const $cardBody = $('#card-body');
  const prevMaxHeight = $cardBody.css('max-height');
  const prevOverflow = $cardBody.css('overflow-y');

  $cardBody.css({ 'max-height': 'none', 'overflow-y': 'visible' });

  printReport('cardData').finally(() => {
    $cardBody.css({ 'max-height': prevMaxHeight, 'overflow-y': prevOverflow });
  });
});
