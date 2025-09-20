let start, end, cabang, tipeLog, aktivitasLog, emailLog;
let offset = 0;
const limit = 50;
let isLoading = false;
let hasMoreData = true;
let searchTimeout = null;
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

    $('#emailLog').select2({
      dropdownParent: '#modalFilter',
      ajax: {
        url: url_api + '/other-report/email-log',
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
      placeholder: 'All Types',
      allowClear: true
  });

  $('#tipeLog').select2({
      dropdownParent: '#modalFilter',
      ajax: {
        url: url_api + '/other-report/tipe-log',
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
      placeholder: 'All Types',
      allowClear: true
  });

  $('#aktivitasLog').select2({
      dropdownParent: '#modalFilter',
      ajax: {
        url: url_api + '/other-report/aktivitas-log',
        dataType: 'json',
        headers: {
          "X-Client-Domain": myDomain
        },
        delay: 250,
        data: function (params) {
          return {
            tipe: $('#tipeLog').val(),
            search: params.term
          };
        },
        processResults: function (data) {
          return {
            results: data.results
          };
        }
      },
      placeholder: 'All Activity',
      allowClear: true
  });

  $('#tipeLog').on('change', function () {
    $('#aktivitasLog').val('').trigger('change');
  });

  $('#rangeFilter').on('change', function () {
      updateDateRangeSelector(this.value);
  });

  $('#showOptionFilter').select2({ dropdownParent: $('#modalFilter') });
  $('#showOptionFilter').val("1").trigger('change');
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
        tipeLog: params.get("tipeLog"),
        aktivitasLog: params.get("aktivitasLog"),
        emailLog: params.get("emailLog")
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
    start = params.start || '';
    end = params.end || '';
    cabang = params.cabang;
    tipeLog = params.tipeLog;
    aktivitasLog = params.aktivitasLog;
    emailLog = params.emailLog;

    if ((start || end) && (start != '' || end != '')) {
      const tanggal_awal = new Date(start);
      const tanggal_akhir = new Date(end);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      
      $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));
    } else {
      $('#range').text('All Time');
    }

    if ((tipeLog && tipeLog !== '') || (aktivitasLog && aktivitasLog != '')) {
      if (aktivitasLog && aktivitasLog != '') {
        $('#tipe').removeClass('d-none').text(tipeLog + ', ' + aktivitasLog);
      } else {
        $('#tipe').removeClass('d-none').text(tipeLog);
      }
    } else {
      $('#tipe').addClass('d-none').text('');
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

  const startDate = $('#startDate').val() || null;
  const endDate = $('#endDate').val() || null;
  const cabang = $('#cabang').val() || null;
  const tipeLog = $('#tipeLog').val() || null;
  const aktivitasLog = $('#aktivitasLog').val() || null;
  const emailLog = $('#emailLog').val() || null;
  const baseUrl = $('#urlToGo').val() || null;

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (tipeLog) params.append('tipeLog', tipeLog);
  if (aktivitasLog) params.append('aktivitasLog', aktivitasLog);
  if (emailLog) params.append('emailLog', emailLog);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  loadHeader();
  loadData(true);
  $('#modalFilter').modal('hide');
});

function loadData(reset = false) {
  if (isLoading || !hasMoreData) return;
  isLoading = true;

  if (reset) {
    offset = 0;
    hasMoreData = true;
    $('#tabelData tbody').empty();
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
  if (tipeLog) params.append("tipe", tipeLog);
  if (aktivitasLog) params.append("aktivitas", aktivitasLog);
  if (emailLog) params.append("email", emailLog);
  if ($('#searchLog').val()) params.append("search", $('#searchLog').val());
  params.append("offset", offset);
  params.append("limit", limit);

  $.ajax({
    url: url_api + `/other-report/logs?${params.toString()}`,
    type: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      const details = response.data || [];
      const tbody = $('#tabelData tbody');
      $('#totalLogs').text(response.total);

      if (details.length === 0) {
        if (offset === 0) {
          tbody.append('<tr><td colspan="7" class="text-center">Logs Data Not Found</td></tr>');
        }
        hasMoreData = false;
      } else {
        details.forEach(function (item) {
          let dateUTC = new Date(item.tanggal);
          let datePart = dateUTC.toLocaleDateString('en-CA'); 
          let timePart = dateUTC.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' ,
            hour12: false
          });
          const row = `
              <tr>
                <td class="text-center">${datePart || ''}</td>
                <td class="text-center">${timePart || ''}</td>
                <td class="text-center">${item.nama || ''}</td>
                <td class="text-center">${item.email || ''}</td>
                <td class="text-center">${item.tipe || ''}</td>
                <td class="text-center">${item.aktivitas || ''}</td>
                <td class="text-center">${item.nomor || ''}</td>
              </tr>
          `;
          tbody.append(row);
        });
        offset += limit; // naikkan offset
      }

      isLoading = false;
      if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
      }
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

// === Infinite Scroll di .table-responsive ===
$('.table-responsive').on('scroll', function () {
  const $this = $(this);
  if ($this.scrollTop() + $this.innerHeight() >= this.scrollHeight - 50) {
    loadData(); // load berikutnya
  }
});
