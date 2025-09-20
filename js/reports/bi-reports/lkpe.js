let start, end, cabang;
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
        url: url_api + `/bi-report/lkpe?${params.toString()}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            const formatID = (value) => Number(value).toLocaleString('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });

            let totalDebitMutasi = 0;
            let totalKreditMutasi = 0;

            const modalAwal = response.saldo_awal['310100'];
            const labaAwal = response.saldo_awal['320100'];
            const saldoAwal = (modalAwal.total_kredit - modalAwal.total_debit) + (labaAwal.total_kredit - labaAwal.total_debit);

            $('#modalPositif').text(formatID(modalAwal.total_kredit));
            $('#modalNegatif').text(formatID(modalAwal.total_debit));
            $('#labaPositif').text(formatID(labaAwal.total_kredit));
            $('#labaNegatif').text(formatID(labaAwal.total_debit));
            $('#totalSaldoAwal').text(formatID(saldoAwal));

            if(response.laba_rugi < 0) {
              $('#labaBerjalanNegatif').text(formatID(Math.abs(response.laba_rugi)));
              $('#labaBerjalanPositif').text('0');
            } else {
              $('#labaBerjalanPositif').text(formatID(Math.abs(response.laba_rugi)));
              $('#labaBerjalanNegatif').text('0');
            }

            $('#labaBerjalan').text(formatID(response.laba_rugi));

            for (const key in response.mutasi) {
              totalDebitMutasi += response.mutasi[key].total_debit;
              totalKreditMutasi += response.mutasi[key].total_kredit;
            }

            const totalMutasi = totalKreditMutasi - totalDebitMutasi;

            $('#mutasiPositif').text(formatID(totalKreditMutasi));
            $('#mutasiNegatif').text(formatID(totalDebitMutasi));
            $('#mutasi').text(formatID(totalMutasi));

            const totalLabaDitahan = (labaAwal.total_kredit - labaAwal.total_debit) + (response.laba_rugi) + totalMutasi - 0;
            const grandTotal = saldoAwal + response.laba_rugi + totalMutasi - 0;

            $('#totalModalDisetor').text(formatID(modalAwal.total_kredit - modalAwal.total_debit));
            $('#totalLabaDitahan').text(formatID(totalLabaDitahan));
            $('#total').text(formatID(grandTotal));

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

$('#exportPDF').click(function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  const namaPT = document.getElementById("namaPT").innerText;
  const range = document.getElementById("range").innerText;
  const cabang = document.getElementById("cabang").innerText;

  // judul laporan
  doc.setFontSize(18);
  doc.text(namaPT, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
  doc.setFontSize(15);
  doc.text("LAPORAN KEUANGAN PERUBAHAN EKUITAS", doc.internal.pageSize.getWidth() / 2, 65, { align: "center" });
  if (range) doc.text(range, doc.internal.pageSize.getWidth() / 2, 90, { align: "center" });
  if (cabang) doc.text(cabang, doc.internal.pageSize.getWidth() / 2, 110, { align: "center" });

  doc.autoTable({
    html: "#cardData table",
    startY: 140,
    theme: "grid",
    styles: {
      fontSize: 9,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [52, 58, 64]
    },
    columnStyles: {
      0: { halign: "left" }, 
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" }
    }
  });

  doc.save(`LKPE_${range}.pdf`);
});

$('#exportExcel').click(function () {
  const table = document.querySelector("#cardData table");
  const wb = XLSX.utils.table_to_book(table, { sheet: "LKPE" });
  
  XLSX.writeFile(wb, `LKPE_${start}_${end}.xlsx`);
});
