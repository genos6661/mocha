$(document).ready(function () {
	$('#cabang').select2({
	    dropdownParent: '#filter',
	    ajax: {
	      url: url_api + '/cabang/select2/limit',
	      dataType: 'json',
	      headers: {
	        "X-Client-Domain": myDomain,
          "Authorization": `Bearer ${window.token}`
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

  $('#pelanggan').select2({
    dropdownParent: $('#filter'),
    ajax: {
      url: url_api + '/profile/select2',
      dataType: 'json',
      headers: {
        "X-Client-Domain": myDomain,
        "Authorization": `Bearer ${window.token}`
      },
      delay: 1000, // ⏱ delay search 1 detik
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

  $('#negara').select2({
      dropdownParent: $('#filter'),
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

  $('#tipeLog').on('change', function () {
    $('#aktivitasLog').val('').trigger('change');
  });

	$('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#simpleDate').on('change', function () {
    updateDateSelector(this.value);
  });

  $('#range').select2({dropdownParent: $('#filter')});
  $('#simpleDate').select2({dropdownParent: $('#filter')}).val('today').trigger('change');

});

const modalFilter = document.getElementById('filter')
modalFilter.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const nama = button.getAttribute('data-nama')
    const range = button.getAttribute('data-range')
    const url = button.getAttribute('data-url')

    $('#filter input, #filter select').val(null).trigger('change');

    $('#judulFilter').text(nama);
    $('#urlToGo').val(url);

    if(range) {
    	$('#range').val(range).trigger('change');
      $('#simpleDate').val(range).trigger('change');
    }

    if (nama === "DTTOT List") {
      $('#boxSimpleDate, #boxSingleDate, #boxSimpleRange, #boxRange').addClass('d-none');
      $('#boxNegara, #boxTipeKontak, #boxShowDTTOT').removeClass('d-none');
    } else {
      $('#boxSimpleRange, #boxRange').removeClass('d-none');
      $('#boxTipeLog, #boxAktivitasLog, #boxEmailLog').addClass('d-none');
    }

    if(url) {
      $('#sbmFilter').attr('href', url);
    }

    $('#sbmFilter').trigger('focus');
});

$('#sbmUpload').on('click', async function () {
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

  const fileInput = $('#excelDTTOT')[0];

  if (!fileInput.files.length) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Excel File Not Found'
    });
    return;
  }
  const file = fileInput.files[0];
  try {
    const rows = await readXlsxFile(file);
    const firstColumn = rows[0]['data']
      .slice(1)
      .map(row => row[0])
      .filter(value => value);
    // const result = firstColumn.map(name => {
    //   return name
    //     .split(/alias/i)
    //     .map(v => v.trim())
    //     .filter(Boolean);
    // });
    const allAliases = firstColumn.flatMap(name => {
      return name
        .split(/alias/i)
        .map(v => v.trim())
        .filter(Boolean);
    });

    $.ajax({
      url: url_api + '/other-features/dttot/',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain,
        "Authorization": `Bearer ${window.token}`
      },
      data: JSON.stringify({names: allAliases}),
      success: function (response) {
        const tbody = $('#tabelDTTOT tbody');
        tbody.empty();
        let count = 1;

        $('#boxTabelDTTOT').removeClass('d-none');
        $('#boxUploadDTTOT').addClass('d-none');

        if (!response.data || !response.data.length) {
          tbody.append(`
            <tr>
              <td colspan="7" class="text-center">
                No Data Found
              </td>
            </tr>
          `);
          if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
          }
          return;
        }

        response.data.forEach(item => {

          tbody.append(`
            <tr data-noindex="${item.nomor_id}">
              <td class="p-1 text-center">
                ${count}
              </td>
              <td class="p-1 table-primary">
                ${item.input_name}
              </td>
              <td class="p-1">
                ${item.matched_name}
              </td>
              <td class="p-1">
                ${item.profile_id || '-'}
              </td>
              <td class="p-1">
                ${item.alamat || '-'}
              </td>
              <td class="p-1 text-center">
                ${item.negara || '-'}
              </td>
              <td class="p-1 text-center">
                <span class="badge bg-${getBadgeColor(item.match_level)}">
                  ${item.match_level}
                </span>
              </td>
            </tr>
          `);
          count++;
        });
        if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
        }
      },
      error: function (xhr) {
        if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
        }
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON?.message || 'Terjadi kesalahan'
        });
      }
    });
  } catch (err) {
    console.error(err);
    if (document.querySelector(`.notiflix-loading`)) {
      Loading.remove();
    }
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal Membaca Excel'
    });
  }
});

$(document).on('click', '#tabelDTTOT tbody tr', function () {
  $(this).toggleClass('table-light');
  updateSelectedCount();
});

function updateSelectedCount() {
  const selectedNoindex = [];

  $('#tabelDTTOT tbody tr.table-light').each(function () {
    selectedNoindex.push($(this).data('noindex'));
  });

  $('#dttotCountSelect').text(`${selectedNoindex.length} selected`);
}

function getBadgeColor(level) {

  switch (level) {

    case 'HIGH':
      return 'danger';

    case 'MEDIUM':
      return 'warning';

    case 'LOW':
      return 'secondary';

    default:
      return 'dark';

  }

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
  }

  $('#startDate').val(startDate);
  $('#endDate').val(endDate);
}

function updateDateSelector(selectedValue) {
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
  $('#singleDate').val(endDate);
}

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const startDate = $('#startDate').val();
  const endDate = $('#endDate').val();
  const cabang = $('#cabang').val();
  const negara = $('#negara').val();
  const baseUrl = $('#urlToGo').val();
  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (negara) params.append('negara', negara);

  const show = [];

  if ($('#showDTTOT-1').is(':checked')) {
    show.push(-1);
  }
  if ($('#showDTTOT1').is(':checked')) {
    show.push(1);
  }
  if ($('#showDTTOT2').is(':checked')) {
    show.push(2);
  }

  show.forEach(v => {
    params.append('show', v);
  });

  const finalUrl = params.toString()
    ? `${baseUrl}?${params.toString()}`
    : baseUrl;

  window.location.href = finalUrl;
});

$('#addToList').click(function (e) {
  e.preventDefault();

  const selected = [];

  $('#tabelDTTOT tbody tr.table-light').each(function () {
    selected.push($(this).data('noindex'));
  });

  if (selected.length == 0) {
    notif.fire({
      icon: 'error',
      text: 'Please Check at least 1 profile'
    });
    return;
  }

  $.ajax({
    url: url_api + '/other-features/dttot-status',
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify({ id: selected, status: 1 }),
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        });
        const tbody = $('#tabelDTTOT tbody');
        tbody.empty();

        $('#boxTabelDTTOT').addClass('d-none');
        $('#boxUploadDTTOT').removeClass('d-none');
        $('#modalUpload').modal('hide');
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
    },
  });
});