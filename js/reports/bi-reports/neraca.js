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
  let endDate = '';

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  switch (selectedValue) {
    case 'today':
      endDate = formatDate(today);
      break;

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      endDate = formatDate(yesterday);
      break;

    case 'tomorrrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      endDate = formatDate(tomorrow);
      break;

    case 'lastWeek':
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      endDate = formatDate(lastWeekEnd);
      break;

    case 'month':
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate = formatDate(endOfMonth);
      break;

    case 'lastMonth':
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      endDate = formatDate(lastMonthEnd);
      break;

    case 'year':
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      endDate = formatDate(endOfYear);
      break;

    case 'lastYear':
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      endDate = formatDate(lastYearEnd);
      break;

    case 'all':
    default:
      startDate = '';
      endDate = '';
      break;
  }
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
  if (end) params.append("end_date", end);
  if (cabang) params.append("cabang", cabang);

  $.ajax({
      url: url_api + `/bi-report/neraca?${params.toString()}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (response) {
        dataReport = response || [];
          const akunMap = {
              kasRP: ['110100'],
              bankRP: ['120100'],
              KasBankRP: ['110100', '120100'],
              kasUKA: ['130100'],
              bankUKA: ['140100'],
              KasBankUKA: ['130100', '140100'],
              piutangTC: ['150100'],
              piutangLain: ['150200'],
              sewa: ['160100'],
              asuransi: ['160200'],
              aset: ['180100'],
              penyusutan: ['180200'],
              asetLain: ['190100'],
              totalHarta: ['110100', '120100', '130100', '140100', '150100', '150200', '160100', '160200', '180100', '180200', '190100'],
              pinjamanRP: ['210100'],
              pinjamanUKA: ['210200'],
              pinjaman: ['210100', '210200'],
              hutangSewa: ['210300'],
              hutangKirimUang: ['220100'],
              hutangLain: ['240100'],
              totalKewajiban: ['210100', '210200', '210300', '220100', '240100'],
              modal: ['310100'],
              totalKewajibanEkuitas: ['210100', '210200', '210300', '220100', '240100', '310100']
          };
          
          Object.entries(akunMap).forEach(([elementId, kodeArray]) => {
            let total = 0;

            kodeArray.forEach(kodeAkun => {
              const akun = response[kodeAkun] || { total_debit: 0, total_kredit: 0 };
              const isKreditLebihDulu = kodeAkun.startsWith('2') || kodeAkun.startsWith('3');

              const value = isKreditLebihDulu
                ? akun.total_kredit - akun.total_debit
                : akun.total_debit - akun.total_kredit;

              total += value;
            });

            $('#' + elementId).text(
              Number(total).toLocaleString('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              })
            );
          });

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

const mapping = [
  ["101", "110100"],
  ["102", "120100"],
  ["103", "130100"],
  ["104", "140100"],
  ["105", "150100"],
  ["106", "150200"],
  ["107", "160100"],
  ["108", "160200"],
  ["109", "180100"],
  ["110", "180200"],
  ["111", "190100"],
  ["201", "210100"],
  ["202", "210200"],
  ["203", "210300"],
  ["204", "220100"],
  ["205", "240100"],
  ["206", "310100"],
  ["207", "320100"],
  ["290", "320100"] 
];

$('#eksporTXT').click(function (e) {
  e.preventDefault();

  let lines = mapping.map(([kode3, kode6]) => {
    let value = 0;

    if (kode6 && dataReport[kode6]) {
      let d = dataReport[kode6].total_debit;
      let k = dataReport[kode6].total_kredit;

      if (kode3 === "207") {
        // ambil langsung kredit
        value = k;
      } else if (kode3 === "290") {
        // ambil langsung debit
        value = d;
      } else if (parseInt(kode6) >= 110100 && parseInt(kode6) <= 190100) {
        value = d - k; // akun kelompok 1
      } else {
        value = k - d; // akun lainnya
      }
    }

    return kode3 + padNumber(value);
  });

  let tahunHead = end.split("-")[0];
  lines.unshift(idBI + 'A' + tahunHead + 'B0002000000001');

  let content = lines.join("\n");

  let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `NERACA_${tahunHead}.txt`;
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
      orientation: "landscape",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    const y = (pageHeight - imgHeight) / 2; 

    pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);

    pdf.save(`Neraca_${start}_${end}.pdf`);
  });
});


$('#exportExcel').click(function () {
  const wb = XLSX.utils.book_new();
  const tables = document.querySelectorAll("#cardData table");

  tables.forEach((tbl, i) => {
    const ws = XLSX.utils.table_to_sheet(tbl);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet" + (i + 1));
  });

  XLSX.writeFile(wb, "Neraca.xlsx");
});
