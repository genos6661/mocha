let start, end, negara, pelanggan, parsedSetting;
let offset = 0;
const limit = 20;
let isLoading = false;
let hasMoreData = true;
let searchTimeout = null;
let count = 1;
let isExporting = false;

const headers = [
  "No",
  "Date",
  "Trans. No",
  "Type",
  "Branch",
  "Name",
  "ID",
  "Country",
  "Amount (Rp)",
  "Transaction Purpose",
  "Source of Funds"
];

const keys = [
  "no",
  "tanggal",
  "nomor_transaksi",
  "tipe_text",
  "nama_cabang",
  "nama_pelanggan",
  "nomor_id",
  "nama_negara",
  "nilai_transaksi",
  "label_tujuan",
  "label_sumber_dana"
];

$(document).ready(function () {
  if (savedSetting) {
    parsedSetting = JSON.parse(savedSetting);
  }

  $('#negaraFilter').select2({
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
    placeholder: 'All Countries',
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
    placeholder: 'All Contacts',
    minimumInputLength: 0,
    allowClear: true
  });

  $('#rangeFilter').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#rangeFilter').select2({ dropdownParent: $('#modalFilter') });

  $('#searchLog').on('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadData(true);
    }, 1000);
  });

  loadHeader();
  loadData(true);
});

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    start: params.get("start"),
    end: params.get("end"),
    negara: params.get("negara"),
    contact: params.get("contact")
  };
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
  if (notiflixBlock) notiflixBlock.innerHTML = customSpinnerHTML;

  const params = getUrlParams();
  start = params.start || '';
  end = params.end || '';
  negara = params.negara || '';
  pelanggan = params.contact || '';

  if ((start || end) && (start != '' || end != '')) {
    const tanggal_awal = new Date(start);
    const tanggal_akhir = new Date(end);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    $('#range').text(tanggal_awal.toLocaleDateString('en-ID', options) + ' - ' + tanggal_akhir.toLocaleDateString('en-ID', options));
  } else {
    $('#range').text('All Time');
  }

  $('#negaraHead').addClass('d-none').text('');
  $('#pelanggan').addClass('d-none').text('');

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
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON?.message || 'Terjadi Kesalahan pada server'
      });
      if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
      }
    }
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
    count = 1;
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
  if (negara) params.append("negara", negara);
  if (pelanggan) params.append("contact", pelanggan);
  params.append("offset", offset);
  params.append("limit", limit);

  $.ajax({
    url: url_api + `/other-features/threshold-report?${params.toString()}`,
    type: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      const rows = response.data || [];
      const tbody = $('#tabelData tbody');
      $('#totalData').text(response.total_count);

      if (rows.length === 0) {
        if (offset === 0) {
          tbody.append('<tr><td colspan="11" class="text-center">Threshold Transaction Data Not Found</td></tr>');
        }
        hasMoreData = false;
        $('.table-responsive').off('scroll');
      } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        rows.forEach(function (item) {
          const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID', options);
          const row = `
              <tr>
                <td class="text-center">${count}</td>
                <td>${tanggal}</td>
                <td>${item.nomor_transaksi || ''}</td>
                <td class="text-center">${(item.tipe_text || '').toUpperCase()}</td>
                <td class="text-center">${item.nama_cabang || ''}</td>
                <td>${item.nama_pelanggan || ''}</td>
                <td>${item.nomor_id || ''}</td>
                <td class="text-center">${item.nama_negara || ''}</td>
                <td class="text-end">Rp. ${Number(item.nilai_transaksi || 0).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })}</td>
                <td>${item.label_tujuan || item.tujuan || '-'}</td>
                <td>${item.label_sumber_dana || item.sumber_dana || '-'}</td>
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
    }
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
  const negaraFil = $('#negaraFilter').val() || null;
  const pelangganFil = $('#pelangganFilter').val() || null;
  const baseUrl = $('#urlToGo').val() || 'threshold-report';

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (negaraFil) params.append('negara', negaraFil);
  if (pelangganFil) params.append('contact', pelangganFil);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  hasMoreData = true;
  loadHeader();
  loadData(true);
  $('#modalFilter').modal('hide');
});

$('#resetFilter').click(function () {
  $('#rangeFilter').val('all').trigger('change');
  $('#negaraFilter').val(null).trigger('change');
  $('#pelangganFilter').val(null).trigger('change');
});

// export
function loadAllDataForExport() {
  return new Promise((resolve, reject) => {
    let allData = [];
    let offsetExport = 0;
    const limitExport = limit;
    let total = 0;

    $('#exportProgress').css('width', '0%').text('0%');
    $('#modalProgress').modal('show');

    function fetchNext() {
      const params = new URLSearchParams();
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      if (negara) params.append("negara", negara);
      if (pelanggan) params.append("contact", pelanggan);
      params.append("offset", offsetExport);
      params.append("limit", limitExport);

      $.ajax({
        url: url_api + `/other-features/threshold-report?${params.toString()}`,
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

          allData.push(...(res.data || []));
          offsetExport += limitExport;

          const percent = Math.min(Math.round((allData.length / total) * 100), 100);
          $('#exportProgress').css('width', percent + '%').text(percent + '%');

          if (allData.length < total) {
            fetchNext();
          } else {
            setTimeout(() => {
              resolve(allData);
            }, 200);
            $('#modalProgress').modal('hide');
          }
        },
        error: function (xhr, status, error) {
          $('#modalProgress').modal('hide');
          reject(error || status);
        }
      });
    }

    fetchNext();
  });
}

function buildExportRows(allData) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  return allData.map((item, index) => ({
    no: index + 1,
    tanggal: new Date(item.tanggal).toLocaleDateString('id-ID', options),
    nomor_transaksi: item.nomor_transaksi || '-',
    tipe_text: (item.tipe_text || '').toUpperCase(),
    nama_cabang: item.nama_cabang || '-',
    nama_pelanggan: item.nama_pelanggan || '-',
    nomor_id: item.nomor_id || '-',
    nama_negara: item.nama_negara || '-',
    nilai_transaksi: Number(item.nilai_transaksi || 0).toLocaleString('id-ID'),
    label_tujuan: item.label_tujuan || item.tujuan || '-',
    label_sumber_dana: item.label_sumber_dana || item.sumber_dana || '-'
  }));
}

$("#export-pdf").click(function () {
  if (isExporting) return;
  isExporting = true;

  loadAllDataForExport()
    .then((allData) => {
      exportToPDF({
        data: buildExportRows(allData),
        headers,
        keys,
        filename: `Threshold_Transaction_Report_${start || 'all'}_${end || 'all'}.pdf`,
        title: 'Threshold Transaction Report',
        nama_pt: parsedSetting.NamaPT.strval,
        start,
        end,
        columnStyles: {
          0: { halign: "center" },
          3: { halign: "center" },
          8: { halign: "right" }
        }
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
    .then((allData) => {
      exportToExcel({
        data: buildExportRows(allData),
        headers,
        keys,
        filename: `Threshold_Transaction_Report_${start || 'all'}_${end || 'all'}.xlsx`
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
