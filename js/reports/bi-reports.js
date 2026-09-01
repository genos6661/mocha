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

  $('#userInput').select2({
      dropdownParent: '#filter',
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

  $('#showOption').select2({ dropdownParent: $('#filter') });
  $('#showOptionLKUB').select2({ dropdownParent: $('#filter') });

  $('#rangeLKUB').select2({dropdownParent: $('#filter')});
  $('#rangeLKUB').on('change', function () {
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

	$('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#simpleDate').on('change', function () {
    updateDateSelector(this.value);
  });

  $('#range').select2({dropdownParent: $('#filter')});
  $('#simpleDate').select2({dropdownParent: $('#filter')}).val('today').trigger('change');

  const currentYear = new Date().getFullYear();
  let yearOptions = '';
  for (let y = currentYear; y >= currentYear - 5; y--) {
    yearOptions += `<option value="${y}">${y}</option>`;
  }
  $('#tahunFilter').html(yearOptions);

  $('#bulanFilter').select2({dropdownParent: $('#filter')});
  $('#tahunFilter').select2({dropdownParent: $('#filter')});

});

const modalFilter = document.getElementById('filter')
modalFilter.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const nama = button.getAttribute('data-nama')
    const range = button.getAttribute('data-range')
    const url = button.getAttribute('data-url')

    $('#filter input, #filter select').val(null).trigger('change');
    $('#showOption').val("2").trigger('change');

    $('#judulFilter').text(nama);
    $('#urlToGo').val(url);

    if(range) {
    	$('#range').val(range).trigger('change');
      $('#simpleDate').val(range).trigger('change');
    }

    if (nama === "LKUB") {
      $('#boxSimpleRange, #boxRange, #boxSimpleDate, #boxSingleDate').addClass('d-none');
      $('#boxBulanTahun').removeClass('d-none');

      const today = new Date();
      $('#bulanFilter').val(today.getMonth() + 1).trigger('change');
      $('#tahunFilter').val(today.getFullYear()).trigger('change');
      $('#showOptionLKUB').val("2").trigger('change');
    } else if (nama === "Neraca" || nama === "LKPE") {
      $('#boxSimpleRange, #boxRange, #boxBulanTahun').addClass('d-none');
      $('#boxSimpleDate, #boxSingleDate').removeClass('d-none');
    } else {
      $('#boxSimpleRange, #boxRange').removeClass('d-none');
      $('#boxSimpleDate, #boxSingleDate, #boxBulanTahun').addClass('d-none');
    }

    if (nama === "LKUB") {
      $('#boxShowingLKUB').removeClass('d-none');
    } else {
      $('#boxShowingLKUB').addClass('d-none');
    }

    if(nama === "Summary Valas" || nama === "Summary Valas Advance") {
      $('#boxUser').removeClass('d-none');
      $('#boxShowing').removeClass('d-none');
    } else {
      $('#boxUser').addClass('d-none');
      $('#boxShowing').addClass('d-none');
    }

    if(url) {
      $('#sbmFilter').attr('href', url);
    }
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
  const userInput = $('#userInput').val();
  const showOption = $('#boxShowingLKUB').hasClass('d-none')
    ? ($('#showOption').val() || 1)
    : ($('#showOptionLKUB').val() || 1);
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (!$('#boxBulanTahun').hasClass('d-none')) {
    const bulan = $('#bulanFilter').val();
    const tahun = $('#tahunFilter').val();

    if (bulan) params.append('bulan', bulan);
    if (tahun) params.append('tahun', tahun);
  } else {
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
  }
  if (cabang) params.append('cabang', cabang);
  if (userInput) params.append('user', userInput);
  if (showOption) params.append('show', showOption);

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.location.href = finalUrl;
});
