let start, end, cabang, negara, sort_by, sort_dir, parsedSetting;
let offset = 0;
const limit = 50;
let isLoading = false;
let hasMoreData = true;
let searchTimeout = null;
let count = 1;
let exportData = [];
let isExporting = false;

const headers = [
  "No",
  "Name",
  "Country",
  "Occupation",
  "Phone",
  "Address",
  "Total Transaction",
  "Total Amount",
];

const keys = [
  "nama",
  "nama_negara",
  "pekerjaan",
  "telepon",
  "alamat",
  "total_transaksi",
  "nilai_transaksi"
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

    $('#negara').select2({
      dropdownParent: $('#modalFilter'),
      ajax: {
        url: url_api + '/profile/negara/select2',
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
      placeholder: 'Choose Country'
  });

  $('#rangeFilter').on('change', function () {
      updateDateRangeSelector(this.value);
  });

  $('#sort_by').select2({dropdownParent: $('#modalFilter'), placeholder: 'Select Column to Sort', allowClear: true});
  $('#sort_dir').select2({dropdownParent: $('#modalFilter'), placeholder: 'Sort Direction', allowClear: true});
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
        negara: params.get("negara"),
        sort_by: params.get("sort_by"),
        sort_dir: params.get("sort_dir")
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
    negara = params.negara;
    sort_by = params.sort_by;
    sort_dir = params.sort_dir;

    if ((start || end) && (start != '' || end != '')) {
      const tanggal_awal = new Date(start);
      const tanggal_akhir = new Date(end);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      
      $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));
    } else {
      $('#range').text('All Time');
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
  if (cabang) params.append("cabang", cabang);
  if (negara) params.append("negara", negara);
  if (sort_by) params.append("sort_by", sort_by);
  if (sort_dir) params.append("sort_by", sort_dir);
  if ($('#searchLog').val()) params.append("search", $('#searchLog').val());
  params.append("offset", offset);
  params.append("limit", limit);

  $.ajax({
    url: url_api + `/master-report/customer?${params.toString()}`,
    type: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      const details = response.data || [];
      const tbody = $('#tabelData tbody');
      $('#totalCustomer').text(response.total_count);

      if (details.length === 0) {
        if (offset === 0) {
          tbody.append('<tr><td colspan="7" class="text-center">Logs Data Not Found</td></tr>');
        }
        hasMoreData = false;
        $('.table-responsive').off('scroll');
      } else {
        details.forEach(function (item) {
          const row = `
              <tr>
                <td class="text-center">${count}</td>
                <td class="">${item.nama || ''}</td>
                <td class="text-center">${item.nama_int_negara || ''}</td>
                <td class="text-center">${item.pekerjaan || ''}</td>
                <td class="text-center">${item.telepon || ''}</td>
                <td class="">${item.alamat || ''}</td>
                <td class="text-end">${Number(item.total_transaksi).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }) || '0'}</td>
                <td class="text-end">Rp. ${Number(item.nilai_transaksi).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }) || '0'}</td>
              </tr>
          `;
          tbody.append(row);
          count++;
        });
        offset += limit; 

        if (offset >= response.total_count) {
          hasMoreData = false;
          $('.table-responsive').off('scroll');
        }
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

$('.table-responsive').on('scroll', function () {
  const $this = $(this);
  if ($this.scrollTop() + $this.innerHeight() >= this.scrollHeight - 50) {
    loadData(); // load berikutnya
  }
});

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const startDate = $('#startDate').val() || null;
  const endDate = $('#endDate').val() || null;
  const cabangFil = $('#cabangFilter').val() || null;
  const negaraFil = $('#negara').val() || null;
  const sort_byFil = $('#sort_by').val() || null;
  const sort_dirFil = $('#sort_dir').val() || null;
  const baseUrl = $('#urlToGo').val() || 'customer-report';

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabangFil) params.append('cabang', cabangFil);
  if (negaraFil) params.append('negara', negaraFil);
  if (sort_byFil) params.append('sort_by', sort_byFil);
  if (sort_dirFil) params.append('sort_dir', sort_dirFil);

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

    exportData = [];
    let offsetExport = 0;
    const limitExport = limit;
    let total = 0;

    // ===== SHOW MODAL DI SINI =====
    $('#exportProgress').css('width', '0%').text('0%');
    $('#modalProgress').modal('show');

    function fetchNext() {

      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (cabang) params.append("cabang", cabang);
      if (negara) params.append("negara", negara);
      if (sort_by) params.append("sort_by", sort_by);
      if (sort_dir) params.append("sort_dir", sort_dir);
      if ($('#searchLog').val()) params.append("search", $('#searchLog').val());

      params.append("offset", offsetExport);
      params.append("limit", limitExport);

      $.ajax({
        url: url_api + `/master-report/customer?${params.toString()}`,
        type: 'GET',
        headers: {
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
        },

        success: function (res) {

          if (!res.status) {
            reject('Gagal load data');
            return;
          }

          if (total === 0) total = res.total_count;

          exportData.push(...res.data);
          offsetExport += limitExport;

          const percent = Math.min(
            Math.round((exportData.length / total) * 100),
            100
          );

          $('#exportProgress')
            .css('width', percent + '%')
            .text(percent + '%');

          if (exportData.length < total) {
            fetchNext();
          }
          else {
            setTimeout(() => {
              resolve(exportData);
            }, 200);
            $('#modalProgress').modal('hide');
          }
        },

        error: reject
      });
    }

    fetchNext();
  });
}

$("#export-pdf").click(function () {

  if (isExporting) return;
  isExporting = true;

  loadAllDataForExport()
    .then((allData) => {

      exportToPDF({
        data: allData,
        headers,
        keys,
        filename: `Customer Report.pdf`,
        title: 'Customer Report',
        nama_pt: parsedSetting.NamaPT.strval,
        start,
        end
      });

    })
    .finally(() => {
      isExporting = false;
    });

});