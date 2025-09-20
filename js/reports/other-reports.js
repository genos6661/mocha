$(document).ready(function () {
	$('#cabang').select2({
	    dropdownParent: '#filter',
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
      dropdownParent: '#filter',
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
      dropdownParent: '#filter',
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
      dropdownParent: '#filter',
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

    if (nama === "Logs Reports") {
      $('#boxSimpleDate, #boxSingleDate, #boxCabang').addClass('d-none');
      $('#boxTipeLog, #boxAktivitasLog, #boxEmailLog, #boxSimpleRange, #boxRange').removeClass('d-none');
    } else {
      $('#boxSimpleRange, #boxRange').removeClass('d-none');
      $('#boxTipeLog, #boxAktivitasLog, #boxEmailLog').addClass('d-none');
    }

    if(url) {
      $('#sbmFilter').attr('href', url);
    }

    $('#sbmFilter').trigger('focus');
});

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
  const tipeLog = $('#tipeLog').val();
  const aktivitasLog = $('#aktivitasLog').val();
  const emailLog = $('#emailLog').val();
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (cabang) params.append('cabang', cabang);
  if (tipeLog) params.append('tipeLog', tipeLog);
  if (aktivitasLog) params.append('aktivitasLog', aktivitasLog);
  if (emailLog) params.append('emailLog', emailLog);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.location.href = finalUrl;
});
