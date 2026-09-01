let bulan, tahun, cabang, user, show, dataReport, idBI, parsedSetting;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Currencies BI requires a Middle Rate for on the LKUB report — used both
// for the "Only Show Forexs with Rate Tengah" filter and the TXT export.
const allowedCurrencies = new Set([
  "USD", "THB", "SGD", "SEK", "PHP", "PGK", "NZD", "NOK", "MYR", "KRW",
  "JPY", "HKD", "GBP", "EUR", "DKK", "CNY", "CHF", "CAD", "BND", "AUD"
]);

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

    $('#showOptionFilter').select2({ dropdownParent: $('#modalFilter') });
    $('#showOptionFilter').val("1").trigger('change');

    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let y = currentYear; y >= currentYear - 5; y--) {
      yearOptions += `<option value="${y}">${y}</option>`;
    }
    $('#tahunFilter').html(yearOptions);

    $('#bulanFilter').select2({dropdownParent: $('#modalFilter')});
    $('#tahunFilter').select2({dropdownParent: $('#modalFilter')});

    $('#rangeFilter').select2({dropdownParent: $('#modalFilter')});
    $('#rangeFilter').on('change', function () {
      const today = new Date();
      let targetBulan = today.getMonth() + 1;
      let targetTahun = today.getFullYear();

      if (this.value === 'lastMonth') {
        targetBulan -= 1;
        if (targetBulan < 1) {
          targetBulan = 12;
          targetTahun -= 1;
        }
      } else if (this.value !== 'thisMonth') {
        return;
      }

      $('#bulanFilter').val(targetBulan).trigger('change');
      $('#tahunFilter').val(targetTahun).trigger('change');
    });

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
        bulan: params.get("bulan"),
        tahun: params.get("tahun"),
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
    const today = new Date();
    bulan = parseInt(params.bulan) || (today.getMonth() + 1);
    tahun = parseInt(params.tahun) || today.getFullYear();
    cabang = params.cabang;
    user = params.user;
    show = params.show;

    $('#range').text(monthNames[bulan - 1] + ' ' + tahun);
    $('#bulanFilter').val(bulan).trigger('change');
    $('#tahunFilter').val(tahun).trigger('change');

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
    if (bulan) params.append("bulan", bulan);
    if (tahun) params.append("tahun", tahun);
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
            let details = response.data || [];

            // "Only Show Forexs with Rate Tengah" keeps only the currencies
            // BI actually requires a Middle Rate for on this report — this
            // is a fixed list, not "rate_tengah > 0 this month", so it's
            // filtered client-side against allowedCurrencies regardless of
            // what the backend did with the tampilkan param.
            if (show == '2') {
                details = details.filter(item => allowedCurrencies.has(item.kodeValas));
            }

            // Buy/Sell/Ending balance rupiah are derived on the frontend from
            // this period's rate_tengah: qty * rate_tengah when a rate has
            // been saved for this period, otherwise 0.
            //
            // saldo_awal_rupiah is different: the backend computes it from
            // *last* month's saved rate_tengah, which isn't a value this
            // period's response exposes separately — so it's displayed
            // exactly as the backend returns it, never recomputed here.
            details.forEach(function (item) {
                const rate = Number(item.rate_tengah) || 0;
                item.rate_tengah = rate;
                item.saldo_awal_rupiah = Number(item.saldo_awal_rupiah) || 0;
                item.pembelian_rupiah = rate > 0 ? Number(item.pembelian || 0) * rate : 0;
                item.penjualan_rupiah = rate > 0 ? Number(item.penjualan || 0) * rate : 0;
                item.saldo_akhir_rupiah = rate > 0 ? Number(item.saldo_akhir || 0) * rate : 0;
            });

            dataReport = details;

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

                    const rateNotSaved = item.saldo_awal_rupiah === 0 && Number(item.saldo_awal) !== 0;
                    const rateNotSavedIcon = rateNotSaved
                      ? ` <i class="icon-base ti tabler-alert-triangle text-warning" style="cursor:help;" title="Rate tengah bulan sebelumnya belum tersimpan"></i>`
                      : '';

                    const row = `
                        <tr data-kode="${item.kodeValas}">
                          <td>${counter}</td>
                          <td>${item.kodeValas}</td>
                          <td>UKA</td>
                          <td class="text-end">${Number(item.saldo_awal).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end saldoAwalRupiah">${Number(item.saldo_awal_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}${rateNotSavedIcon}</td>
                          <td class="text-end">${Number(item.pembelian).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end pembelianRupiah">${Number(item.pembelian_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.penjualan).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                           <td class="text-end penjualanRupiah">${Number(item.penjualan_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.saldo_akhir).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end px-1 rateTengah" contenteditable="true">${item.rate_tengah ? formatNumber(item.rate_tengah) : ''}</td>
                          <td class="text-end saldoAkhirRupiah">${Number(item.saldo_akhir_rupiah).toLocaleString('id-ID', {
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

// Recompute a row's Buy/Sell/Ending balance rupiah columns live as the
// user edits its Middle Rate cell, using the same rate>0 ? qty*rate : 0
// formula used on load. Bg. Balance (Rp) is intentionally left alone here:
// it reflects *last* month's saved rate, not the one being typed now.
$('#tabelData tbody').on('input blur', '.rateTengah', function () {
  const $row = $(this).closest('tr');
  const item = dataReport.find(d => d.kodeValas === $row.data('kode'));
  if (!item) return;

  const rate = parseFloat(
    ($(this).text() || '0').replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  item.rate_tengah = rate;
  item.pembelian_rupiah = rate > 0 ? Number(item.pembelian || 0) * rate : 0;
  item.penjualan_rupiah = rate > 0 ? Number(item.penjualan || 0) * rate : 0;
  item.saldo_akhir_rupiah = rate > 0 ? Number(item.saldo_akhir || 0) * rate : 0;

  $row.find('.pembelianRupiah').text(formatNumber(item.pembelian_rupiah));
  $row.find('.penjualanRupiah').text(formatNumber(item.penjualan_rupiah));
  $row.find('.saldoAkhirRupiah').text(formatNumber(item.saldo_akhir_rupiah));
});

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const bulanFilter = $('#bulanFilter').val();
  const tahunFilter = $('#tahunFilter').val();
  const cabang = $('#cabangFilter').val();
  const show = $('#showOptionFilter').val();
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (bulanFilter) params.append('bulan', bulanFilter);
  if (tahunFilter) params.append('tahun', tahunFilter);
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

// First/last day of the selected bulan/tahun as YYYY-MM-DD, used where
// export code still wants a date range (PDF header text) or a YYYYMMDD
// stamp (TXT file header/name).
function getPeriodDates() {
  const pad = (n) => String(n).padStart(2, '0');
  const lastDay = new Date(tahun, bulan, 0).getDate();

  return {
    start: `${tahun}-${pad(bulan)}-01`,
    end: `${tahun}-${pad(bulan)}-${pad(lastDay)}`,
  };
}

function padKursTengah(value) {
  // let clean = String(value).trim().replace(/\./g, "").replace(",", ".");

  let num = parseFloat(value);
  if (isNaN(num)) num = 0;

  // Kalikan 10000 agar 4 digit desimal menjadi bilangan bulat
  const scaled = Math.round(num * 10000);

  // Total 9 digit
  return String(scaled).padStart(9, "0");
}

$('#eksporTXT').click(function (e) {
  e.preventDefault();

  let lines = [];

  document.querySelectorAll("#tabelData tbody tr").forEach((tr, idx) => {
    const tds = tr.querySelectorAll("td");
    const kodeValas = tds[1].innerText.trim();

    if (!allowedCurrencies.has(kodeValas)) {
      return;
    }

    const kursTengah = parseFloat(
      (tds[10].innerText || "0").toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.')) || 0;

    const item = dataReport[idx];
    const saldoAkhirRupiah = Number(item.saldo_akhir || 0) * kursTengah;
    console.log(kodeValas + ' - ' + kursTengah + ' - ' + saldoAkhirRupiah);

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

  const tanggalHead = getPeriodDates().start.replace(/-/g, "");
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

  const period = getPeriodDates();

  exportToPDF({
    data: dataFixed,
    headers,
    keys,
    filename: `LKUB_${tahun}${String(bulan).padStart(2, '0')}.pdf`,
    title: "LKUB",
    nama_pt: parsedSetting.NamaPT.strval,
    start: period.start,
    end: period.end,

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

$('#print').click(function () {
  printReport('cardData');
});

$('#sbmSave').click(function (e) {
  e.preventDefault();

  const valas = [];

  document.querySelectorAll("#tabelData tbody tr").forEach((tr, idx) => {
    const item = dataReport[idx];
    if (!item) return;

    const tds = tr.querySelectorAll("td");
    const rateTengah = parseFloat(
      (tds[10].innerText || "0").toString().replace(/\./g, '').replace(/,/g, '.')
    ) || 0;

    valas.push({
      kode_valas: item.kodeValas,
      stok_awal: Number(item.saldo_awal) || 0,
      buy: Number(item.pembelian) || 0,
      sell: Number(item.penjualan) || 0,
      stok_akhir: Number(item.saldo_akhir) || 0,
      rate_tengah: rateTengah,
    });
  });

  if (valas.length === 0) {
    notif.fire({
      icon: 'error',
      title: 'Tidak ada data untuk disimpan'
    });
    return;
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
  notiflixBlock.innerHTML = customSpinnerHTML;

  $.ajax({
    url: url_api + '/bi-report/lkub',
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify({ bulan, tahun, valas }),
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        }).then(() => {
            loadData();
        });
    },
    error: function (xhr) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON?.message || 'Terjadi kesalahan'
        });
    },
    complete: function () {
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
    }
  });
});