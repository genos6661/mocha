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

  $('#sort_by').select2({dropdownParent: $('#filter'), placeholder: 'Select Column to Sort'});
  $('#sort_dir').select2({dropdownParent: $('#filter'), placeholder: 'Sort Direction'});

  $('#tipeLog').on('change', function () {
    $('#aktivitasLog').val('').trigger('change');
  });

	$('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#range').select2({dropdownParent: $('#filter'), placeholder: 'Select Range (Optional)'});

});

const modalFilter = document.getElementById('filter')
modalFilter.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const nama = button.getAttribute('data-nama')
    const range = button.getAttribute('data-range')
    const url = button.getAttribute('data-url')
    const isLogs = nama === 'Logs Reports';

    $('#filter input, #filter select').val(null).trigger('change');

    $('#judulFilter').text(nama);
    $('#urlToGo').val(url);

    // Logs: "All Time" tersedia & bawaan; Customer/Employee: rentang tanggal opsional (tanpa "All Time")
    $('#range option[value="all"]').prop('disabled', !isLogs);
    $('#range option[value="month"]').text(isLogs ? 'This Month (Default)' : 'This Month');

    if(range) {
    	$('#range').val(range).trigger('change');
    }

    // Logs: tipe / aktivitas / email. Customer & Employee: cabang, negara, urutan (+ threshold khusus Customer)
    $('#boxTipeLog, #boxAktivitasLog, #boxEmailLog').toggleClass('d-none', !isLogs);
    $('#boxCabang, #boxNegara, #boxSort, #boxSortDir').toggleClass('d-none', isLogs);
    $('#boxShowThreshold').toggleClass('d-none', nama !== 'Customer Data');

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

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const startDate = $('#startDate').val();
  const endDate = $('#endDate').val();
  const isLogs = !$('#boxTipeLog').hasClass('d-none');
  const cabang = $('#cabang').val();
  const negara = $('#negara').val();
  const sort_by = $('#sort_by').val();
  const sort_dir = $('#sort_dir').val();
  const threshold = !$('#boxShowThreshold').hasClass('d-none') && $('#thresholdOnly').is(':checked') ? 1 : 0;
  const tipeLog = $('#tipeLog').val();
  const aktivitasLog = $('#aktivitasLog').val();
  const emailLog = $('#emailLog').val();
  const baseUrl = $('#urlToGo').val();

  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);
  if (!isLogs) {
    if (cabang) params.append('cabang', cabang);
    if (negara) params.append('negara', negara);
    if (threshold) params.append('threshold_only', 1);
    if (sort_by) params.append('sort_by', sort_by);
    if (sort_dir) params.append('sort_dir', sort_dir);
  } else {
    if (tipeLog) params.append('tipeLog', tipeLog);
    if (aktivitasLog) params.append('aktivitasLog', aktivitasLog);
    if (emailLog) params.append('emailLog', emailLog);
  }

  const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  window.location.href = finalUrl;
});
