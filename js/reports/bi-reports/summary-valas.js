let start, end, cabang, user, show, rawData, parsedSetting;

const headers = [
  "Forex Code",
  "Forex Name",
  "Beginning Balance",
  "Mutation Buy",
  "Mutation Sell",
  "Ending Balance",
  "Mutation Buy (IDR)",
  "Mutation Sell (IDR)",
];

const keys = [
  "kodeValas",
  "namaValas",
  "saldo_awal",
  "pembelian",
  "penjualan",
  "saldo_akhir",
  "pembelian_rupiah",
  "penjualan_rupiah",
];

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

    $('#userInputFilter').select2({
      dropdownParent: '#modalFilter',
      ajax: {
        url: url_api + '/users/select2',
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
      placeholder: 'All Users',
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
      callback(response.nama);
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
      callback(null);
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

    // $.ajax({
    //     url: url_api + '/setting',
    //     type: 'GET',
    //     contentType: 'application/json',
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${window.token}`,
    //         "X-Client-Domain": myDomain
    //     },
    //     success: function (response) {
    //         $('#namaPT').text(response.NamaPT.strval);
    //         if (document.querySelector(`.notiflix-loading`)) {
    //             Loading.remove();
    //         }
    //     },
    //     error: function (xhr) {
    //         if (xhr.status === 404) {
    //             notif.fire({
    //               icon: 'error',
    //               text: xhr.responseJSON.message
    //             });
    //             if (document.querySelector(`.notiflix-loading`)) {
    //                 Loading.remove();
    //             }
    //         } else {
    //             notif.fire({
    //               icon: 'error',
    //               text: 'Terjadi Kesalahan pada server'
    //             });
    //             if (document.querySelector(`.notiflix-loading`)) {
    //                 Loading.remove();
    //             }
    //         }
    //     },
    // });
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
    if (user) params.append("user", user);
    if (show) params.append("tampilkan", show);

    $.ajax({
        url: url_api + `/bi-report/summary-valas?${params.toString()}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            const details = response.data || [];

            rawData = details;

            const tbody = $('#tabelData tbody');
            tbody.empty();

            if (details.length === 0) {
                tbody.append('<tr><td colspan="8" class="text-center">Data Reports Not Found</td></tr>');
            } else {
                let total_beli_rupiah = 0;
                let total_jual_rupiah = 0;

                details.forEach(function (item) {
                    // let qty;
                    // if(data.tipe == 3) {
                    //     qty = item.beli;
                    // } else if (data.tipe == 4) {
                    //     qty = item.jual;
                    // }
                    // const totalPerItem = qty * item.rate;
                    total_beli_rupiah += item.pembelian_rupiah;
                    total_jual_rupiah += item.penjualan_rupiah;
                    const row = `
                        <tr>
                          <td>${item.kodeValas}</td>
                          <td>${item.namaValas}</td>
                          <td class="text-end">${Number(item.saldo_awal).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.pembelian).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.penjualan).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">${Number(item.saldo_akhir).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                          <td class="text-end">Rp. ${Number(item.pembelian_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}</td>
                          <td class="text-end">Rp. ${Number(item.penjualan_rupiah).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2
                            })}</td>
                        </tr>
                    `;
                  tbody.append(row);
                });
                tbody.append(`
                    <tr class="table-dark table-borderless">
                        <td colspan="5" class="fw-bold">Total : </td>
                        <td class="fw-bold">Rp. </td>
                        <td class="text-end fw-bold">${Number(total_beli_rupiah).toLocaleString('id-ID', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2
                        })}</td>
                        <td class="text-end fw-bold">${Number(total_jual_rupiah).toLocaleString('id-ID', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2
                        })}</td>
                    </tr>
                `);
            }
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
      startDate = formatDate(startOfMonth);
      endDate = formatDate(today);
      break;

    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDate(lastMonthStart);
      endDate = formatDate(lastMonthEnd);
      break;

    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = formatDate(startOfYear);
      endDate = formatDate(today);
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
  const userInput = $('#userInputFilter').val();
  const show = $('#showOptionFilter').val();
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (userInput) params.append('user', userInput);
  if (show) params.append('show', show);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  loadHeader(); 
  loadData();
  $('#modalFilter').modal('hide');
});

$("#export-csv").click(function () {
  exportToCSV({
    data: rawData,
    headers: headers,
    keys: keys,
    filename: "summary-valas-report.csv",
  });
});

$("#export-excel").click(function () {
  exportToExcel({
    data: rawData,
    headers: headers,
    keys: keys,
    filename: "summary-valas-report.xlsx", 
  });
});

$("#export-pdf").click(function () {
  if (cabang && cabang != '' && cabang != 0) {
    getCabang(cabang, function (nama) {
      const namaCabang = nama || '';
      console.log("Nama cabang:", namaCabang);

      exportToPDF({
        data: rawData,
        headers: headers,
        keys: keys,
        filename: `Summary_Valas_${start}_${end}.pdf`,
        title: 'Summary Valas',
        nama_pt: parsedSetting.NamaPT.strval,
        start: start,
        end: end,
        cabang: namaCabang
      });
    });
  } else {
    exportToPDF({
      data: rawData,
      headers: headers,
      keys: keys,
      filename: `Summary_Valas_${start}_${end}.pdf`,
      title: 'Summary Valas',
      nama_pt: parsedSetting.NamaPT.strval,
      start: start,
      end: end,
      cabang: ''
    });
  }
});
