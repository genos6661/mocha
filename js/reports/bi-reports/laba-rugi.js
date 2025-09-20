let start, end, cabang, dataReport, idBI;
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
const modalFilter = document.getElementById('modalFilter')
modalFilter.addEventListener('shown.bs.modal', event => {
    $('#rangeFilter').val('month').trigger('change');
});

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
            idBI = response.IDuserBI.strval;
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

    $.ajax({
        url: url_api + `/bi-report/laba-rugi?${params.toString()}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            dataReport = response;
            const akunData = response.data;


            const formatID = (value) => Number(value).toLocaleString('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });

            const penjualanUKA = akunData['410100'].total_kredit - akunData['410100'].total_debit;
            const pencairanTC = akunData['410200'].total_kredit - akunData['410200'].total_debit;
            const pendapatanOperasional = penjualanUKA + pencairanTC;
            const saldo_awal = response.hpp.saldo_awal;
            const pembelian = response.hpp.pembelian;
            const saldo_akhir = response.hpp.saldo_akhir;
            const hpp = saldo_awal + pembelian - saldo_akhir;
            const lrOperasional = pendapatanOperasional - hpp;
            const pendapatanKirimUang = akunData['420100'].total_kredit - akunData['420100'].total_debit;
            const lrOperasionalKotor = pendapatanOperasional - hpp + pendapatanKirimUang;
            const gaji = akunData['610100'].total_debit - akunData['610100'].total_kredit;
            const sewa = akunData['610200'].total_debit - akunData['610200'].total_kredit;
            const iklan = akunData['610300'].total_debit - akunData['610300'].total_kredit;
            const listrik = akunData['610400'].total_debit - akunData['610400'].total_kredit;
            const transportasi = akunData['610500'].total_debit - akunData['610500'].total_kredit;
            const kendaraan = akunData['610600'].total_debit - akunData['610600'].total_kredit;
            const penyusutan = akunData['610610'].total_debit - akunData['610610'].total_kredit;
            const asuransi = akunData['610800'].total_debit - akunData['610800'].total_kredit;
            const bebanOperasionalLain = akunData['610900'].total_debit - akunData['610900'].total_kredit;
            const totalBeban = gaji + sewa + iklan + listrik + transportasi + kendaraan + penyusutan + asuransi + bebanOperasionalLain;
            const lrOperasionalBersih = lrOperasionalKotor - totalBeban;
            const bungaBank = akunData['420200'].total_kredit - akunData['420200'].total_debit;
            const adminBank = akunData['610700'].total_debit - akunData['610700'].total_kredit;
            const bungaPinjaman = akunData['710100'].total_debit - akunData['710100'].total_kredit;
            const penjualanAset = akunData['420300'].total_kredit - akunData['420300'].total_debit;
            const selisihKurs = akunData['420400'].total_kredit - akunData['420400'].total_debit;
            const pendapatanLain = akunData['420500'].total_kredit - akunData['420500'].total_debit;
            const bebanLain = akunData['520100'].total_kredit - akunData['520100'].total_debit;
            const labaRugiLain = bungaBank - adminBank - bungaPinjaman + penjualanAset + selisihKurs + pendapatanLain - bebanLain;
            const labaRugiSP = lrOperasionalBersih + labaRugiLain;
            const pajakPenghasilan = 0;
            const labaRugi = labaRugiSP - pajakPenghasilan;

            $('#penjualanUKA').text(formatID(penjualanUKA));
            $('#pencairanTC').text(formatID(pencairanTC));
            $('#pendapatanOperasional').text(formatID(pendapatanOperasional));
            $('#saldoAwalUKATC').text(formatID(saldo_awal));
            $('#pembelianUKATC').text(formatID(pembelian));
            $('#saldoAkhirUKATC').text(formatID(saldo_akhir));
            $('#hargaPokok').text(formatID(hpp));
            $('#lrOperasional').text(formatID(lrOperasional));
            $('#pendapatanKirimUang').text(formatID(pendapatanKirimUang));
            $('#lrOperasionalKotor').text(formatID(lrOperasionalKotor));
            $('#gaji').text(formatID(gaji));
            $('#sewa').text(formatID(sewa));
            $('#iklan').text(formatID(iklan));
            $('#listrik').text(formatID(listrik));
            $('#transportasi').text(formatID(transportasi));
            $('#kendaraan').text(formatID(kendaraan));
            $('#penyusutan').text(formatID(penyusutan));
            $('#asuransi').text(formatID(asuransi));
            $('#bebanOperasionalLain').text(formatID(bebanOperasionalLain));
            $('#totalBeban').text(formatID(totalBeban));
            $('#lrOperasionalBersih').text(formatID(lrOperasionalBersih));
            $('#bungaBank').text(formatID(bungaBank));
            $('#adminBank').text(formatID(adminBank));
            $('#bungaPinjaman').text(formatID(bungaPinjaman));
            if (penjualanAset >= 0) {
              $('#labaPenjualanAset').text(formatID(Math.abs(penjualanAset)));
              $('#rugiPenjualanAset').text('0');
            } else {
              $('#labaPenjualanAset').text('0');
              $('#rugiPenjualanAset').text(formatID(Math.abs(penjualanAset)));
            }
            if (selisihKurs >= 0) {
              $('#labaSelisihKurs').text(formatID(Math.abs(selisihKurs)));
              $('#rugiSelisihKurs').text('0');
            } else {
              $('#labaSelisihKurs').text('0');
              $('#rugiSelisihKurs').text(formatID(Math.abs(selisihKurs)));
            }
            $('#pendapatanLain').text(formatID(pendapatanLain));
            $('#bebanLain').text(formatID(bebanLain));
            $('#labaRugiLain').text(formatID(labaRugiLain));
            $('#labaRugiSP').text(formatID(labaRugiSP));
            $('#pajakPenghasilan').text(formatID(pajakPenghasilan));
            $('#labaRugi').text(formatID(labaRugi));

            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
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

const mapping = [
  ["01", "410100"],
  ["02", "410200"],
  ["03", "HPP_SALDO_AWAL"],
  ["04", "HPP_PEMBELIAN"],
  ["05", "HPP_SALDO_AKHIR"],
  ["06", "420100"],
  ["07", "420200"],
  ["08", "420500"],
  ["09", "520100"],
  ["10", "610100"],
  ["11", "610200"],
  ["12", "610300"],
  ["13", "610400"],
  ["14", "610500"],
  ["15", "610600"],
  ["16", "610610"],
  ["17", "610700"],
  ["18", "610800"],
  ["19", "420300_DEBIT"], 
  ["20", "420300_KREDIT"],
  ["21", "420400_DEBIT"], 
  ["22", "420400_KREDIT"],
  ["23", "610900"],
  ["24", "710100"]
];

$('#eksporTXT').click(function (e) {
  e.preventDefault();

  let lines = mapping.map(([kode2, key]) => {
    let value = 0;

    if (key === "HPP_SALDO_AWAL") {
      value = dataReport.hpp.saldo_awal;
    } else if (key === "HPP_PEMBELIAN") {
      value = dataReport.hpp.pembelian;
    } else if (key === "HPP_SALDO_AKHIR") {
      value = dataReport.hpp.saldo_akhir;
    } else if (key === "420300_DEBIT") {
      value = dataReport.data["420300"].total_debit;
    } else if (key === "420300_KREDIT") {
      value = dataReport.data["420300"].total_kredit;
    } else if (key === "420400_DEBIT") {
      value = dataReport.data["420400"].total_debit;
    } else if (key === "420400_KREDIT") {
      value = dataReport.data["420400"].total_kredit;
    } else if (key && dataReport.data[key]) {
      const d = dataReport.data[key].total_debit;
      const k = dataReport.data[key].total_kredit;
      const kepala = key.substring(0,1); 

      if (kepala === "4" || kepala === "8") {
        value = k - d;
      } else {
        value = d - k;
      }
    }
    return kode2 + padNumber(value);
  });

  let tahunHead = end.split("-")[0];
  lines.unshift(idBI + 'A' + tahunHead + 'B0003000000001');

  let content = lines.join("\r\n");
  console.log(content);

  let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `LABA_RUGI_${tahunHead}.txt`;
  link.click();
});

function padNumber(num) {
  const intVal = Math.round(Number(num) || 0);
  return String(intVal).padStart(15, "0");
}

$('#exportPDF').click(function () {
  const { jsPDF } = window.jspdf;

  html2canvas(document.querySelector("#cardData"), {
    scale: 1.5, 
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = canvas.height * imgWidth / canvas.width; 

    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);

    pdf.save(`Laba Rugi_${start}_${end}.pdf`);
  });
});


$('#exportExcel').click(function () {
  const wb = XLSX.utils.book_new();
  const tables = document.querySelectorAll("#cardData table");

  tables.forEach((tbl, i) => {
    const ws = XLSX.utils.table_to_sheet(tbl);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet" + (i + 1));
  });

  XLSX.writeFile(wb, "Laba Rugi.xlsx");
});