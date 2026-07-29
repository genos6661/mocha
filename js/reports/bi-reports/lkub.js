let start, end, cabang, user, show, dataReport, idBI, parsedSetting;

const headers = [
  "NO",
  "FOREX",
  "TYPE",
  "BG BALANCE",
  "BG BALANCE (Rp)",
  "BUY",
  "BUY (Rp)",
  "SELL",
  "SELL (Rp)",
  "BALANCE",
  "MIDDLE RATE",
  "BALANCE (Rp)"
];

const keys = [
  "kodeValas",
  "UKA",
  "saldo_awal",
  "saldo_awal_rupiah",
  "pembelian",
  "pembelian_rupiah",
  "penjualan",
  "penjualan_rupiah",
  "saldo_akhir",
  "0",
  "saldo_akhir_rupiah"
];

$(document).ready(function() {
    if(savedSetting) {
      parsedSetting = JSON.parse(savedSetting);
      idBI = parsedSetting.IDuserBI.strval;
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
});

// akhir document ready
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        start: params.get("start"),
        end: params.get("end"),
        cabang: params.get("cabang"),
        user: params.get("user"),
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
    user = params.user;
    show = params.show;

    const tanggal_awal = new Date(start);
    const tanggal_akhir = new Date(end);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));

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

    if (user && user !== '') {
        $('#user').removeClass('d-none').text('Inputed By : ' + user);
    } else {
        $('#user').addClass('d-none').text('');
    }

    $('#namaPT').text(parsedSetting.NamaPT.strval);
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
    if (show) params.append("tampilkan", show);

    $.ajax({
        url: url_api + `/bi-report/lkub?${params.toString()}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            const details = response.data || [];
            dataReport = response.data || [];

            const tbody = $('#tabelData tbody');
            tbody.empty();

            if (details.length === 0) {
                tbody.append('<tr><td colspan="12" class="text-center">Data Reports Not Found</td></tr>');
            } else {
                let counter = 1;
                let total_beli_rupiah = 0;
                let total_jual_rupiah = 0;

                details.forEach(function (item) {
                    total_beli_rupiah += item.pembelian_rupiah;
                    total_jual_rupiah += item.penjualan_rupiah;
                    const row = `
                        <tr>
                          <td>${counter}</td>
                          <td>${item.kodeValas}</td>
                          <td>UKA</td>
                          <td class="text-end">${Number(item.saldo_awal).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.saldo_awal_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.pembelian).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.pembelian_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.penjualan).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                           <td class="text-end">${Number(item.penjualan_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.saldo_akhir).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end px-1" contenteditable="true"></td>
                          <td class="text-end">${Number(item.saldo_akhir_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}</td>
                        </tr>
                    `;
                  tbody.append(row);
                  counter += 1;
                });
                // tbody.append(`
                //     <tr class="table-dark table-borderless"><td colspan="6" class="fw-bold">Total : </td>
                //         <td class="text-end fw-bold">Rp. ${Number(total_beli_rupiah).toLocaleString('id-ID', {
                //           minimumFractionDigits: 0,
                //           maximumFractionDigits: 2
                //         })}</td>
                //         <td class="text-end fw-bold">Rp. ${Number(total_jual_rupiah).toLocaleString('id-ID', {
                //           minimumFractionDigits: 0,
                //           maximumFractionDigits: 2
                //         })}</td>
                //     </tr>
                // `);
            }
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
        error: function (xhr) {
            if (xhr.status === 404 || xhr.status === 403) {
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
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (show) params.append('show', show);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  loadHeader(); 
  loadData();
  $('#modalFilter').modal('hide');
});

function formatNumber(value) {
  if (typeof value !== "number") return value || "";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function padNumber(num) {
  let clean = String(num).replace(/[^\d.-]/g, '');
  let value = Number(clean) || 0;
  value = Math.round(value);
  return String(value).padStart(15, '0');
}

function padKursTengah(value) {
  let clean = String(value).trim().replace(/\./g, "").replace(",", ".");

  let num = parseFloat(clean);
  if (isNaN(num)) num = 0;

  // Kalikan 10000 agar 4 digit desimal menjadi bilangan bulat
  const scaled = Math.round(num * 10000);

  // Total 9 digit
  return String(scaled).padStart(9, "0");
}

$('#eksporTXT').click(function (e) {
  e.preventDefault();

  // Daftar kode valas yang diperbolehkan
  const allowedCurrencies = new Set([ "USD", "THB", "SGD", "SEK", "PHP", "PGK", "NZD", "NOK", "MYR", "KRW", "JPY", "HKD", "GBP", "EUR", "DKK", "CNY", "CHF", "CAD", "BND", "AUD"
  ]);

  let lines = [];

  document.querySelectorAll("#tabelData tbody tr").forEach((tr, idx) => {
    const tds = tr.querySelectorAll("td");
    const kodeValas = tds[1].innerText.trim();

    if (!allowedCurrencies.has(kodeValas)) {
      return;
    }

    const kursTengah = parseFloat(
      (tds[10].innerText || "0").replace(/,/g, "")
    ) || 0;
    const item = dataReport[idx];
    const saldoAkhirRupiah = Number(item.saldo_akhir || 0) * kursTengah;

    const line =
      kodeValas + "1" +
      padNumber(item.saldo_awal) +
      padNumber(item.saldo_awal_rupiah) +
      padNumber(item.pembelian) +
      padNumber(item.pembelian_rupiah) +
      padNumber(item.penjualan) +
      padNumber(item.penjualan_rupiah) +
      padNumber(item.saldo_akhir) +
      padKursTengah(kursTengah) +
      padNumber(saldoAkhirRupiah);

    lines.push(line);
  });

  const tanggalHead = start.replace(/-/g, "");
  const jumlahBaris = String(lines.length).padStart(9, "0");
  lines.unshift(idBI + "M" + tanggalHead + "B0001" + jumlahBaris);

  const content = lines.join("\n");

  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `LKUB_${tanggalHead}.txt`;
  link.click();

  URL.revokeObjectURL(link.href);
});

$("#export-pdf").click(function () {
  let dataFixed = [];

  document.querySelectorAll("#tabelData tbody tr").forEach((tr, idx) => {
    const tds = tr.querySelectorAll("td");
    const kursTengah = tds[10].innerText.trim() || "0";

    let item = { ...dataReport[idx] };

    item.kurs_tengah = parseFloat(kursTengah.replace(/,/g, "")) || 0;

    dataFixed.push(item);
  });

  exportToPDF({
    data: dataFixed,
    headers,
    keys,
    filename: `LKUB_${start}_${end}.pdf`,
    title: "LKUB",
    nama_pt: parsedSetting.NamaPT.strval,
    start,
    end,

    bodyBuilder: (data) => {
      return data.map((item, index) => [
        index + 1,
        item.kodeValas,
        "UKA",
        formatNumber(item.saldo_awal),
        formatNumber(item.saldo_awal_rupiah),
        formatNumber(item.saldo_pembelian),
        formatNumber(item.saldo_pembelian_rupiah),
        formatNumber(item.penjualan),
        formatNumber(item.penjualan_rupiah),
        formatNumber(item.saldo_akhir),
        formatNumber(item.kurs_tengah),
        formatNumber(item.saldo_akhir_rupiah)
      ]);
    },

    columnStyles: {
      0: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right" },
      8: { halign: "right" },
      9: { halign: "right" },
      10: { halign: "right" },
      11: { halign: "right" }
    }
  });
});

$("#export-csv").click(function () {
  exportToCSV({
    data: dataReport,
    headers: headers,
    keys: keys,
    filename: "LKUB.csv",
  });
});

$("#export-excel").click(function () {
  exportToExcel({
    data: dataReport,
    headers: headers,
    keys: keys,
    filename: "LKUB.xlsx", 
  });
});