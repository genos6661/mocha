let start, end, cabang, user, show;
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
      url: url_api + `/accounting-report/ledger?${params.toString()}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (response) {
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }

        // Kosongkan container dulu
        $('#card-body').empty();

        // Loop setiap akun
        Object.keys(response).forEach(kode => {
            const akun = response[kode];

            // Tentukan saldo awal
            let saldo = akun.saldo_awal || 0;

            // Tentukan aturan perhitungan berdasarkan kepala akun
            const kepala = parseInt(kode.toString().charAt(0), 10);
            const isDebitNormal = [1, 5, 6, 7, 9].includes(kepala);

            // Template box akun
            let boxHtml = `
              <div class="boxAkun mb-4">
                <div class="row">
                  <div class="col-md-2 py-0 text-primary kode_akun">${kode}</div>
                  <div class="col-md-4 py-0 text-primary nama_akun">${akun.nama_akun} - ${akun.alias_akun}</div>
                  <div class="col-md-4 py-0 text-primary nama_master">${akun.nama_master}</div>
                  <div class="col-md-2 py-0 text-primary text-end subklas">${akun.alias_subklas}</div>
                </div>
                <div class="boxTabel table-responsive">
                  <table class="table table-bordered tabelAkun">
                    <thead class="table-dark">
                      <tr>
                        <th class="text-center align-middle p-2" style="width: 8%; border: 1px solid;">Date</th>
                        <th class="text-center align-middle p-2" style="width: 7%; border: 1px solid;">Type</th>
                        <th class="text-center align-middle p-2" style="width: 10%; border: 1px solid;">Number</th>
                        <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Contact</th>
                        <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Description</th>
                        <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Debit</th>
                        <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Credit</th>
                        <th class="text-center align-middle p-2" style="width: 15%; border: 1px solid;">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="7" class="text-start fw-bold p-1">Saldo Awal</td>
                        <td class="text-end fw-bold p-1">${saldo.toLocaleString()}</td>
                      </tr>
                    </tbody>
                    <tfoot class="table-dark">
                      <tr>
                        <th class="p-2 align-middle" colspan="5">Total :</th>
                        <th class="p-2 align-middle text-end total-debit"></th>
                        <th class="p-2 align-middle text-end total-kredit"></th>
                        <th class="p-2 align-middle text-end total-balance"></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            `;

            // Append box akun ke container
            $('#card-body').append(boxHtml);

            // Cari tbody tabel yang baru dibuat
            const $tbody = $('#card-body .boxAkun:last tbody');
            let totalDebit = 0, totalKredit = 0;

            akun.mutasi.forEach(m => {
                // Hitung saldo sesuai aturan
                if (isDebitNormal) {
                    saldo += (m.debit - m.kredit);
                } else {
                    saldo += (m.kredit - m.debit);
                }

                totalDebit += m.debit;
                totalKredit += m.kredit;

                $tbody.append(`
                  <tr>
                    <td class="p-1">${new Date(m.tanggal).toLocaleDateString()}</td>
                    <td class="text-center p-1">${m.prefix || '-'}</td>
                    <td class="text-center p-1">${m.nomor || '-'}</td>
                    <td class="p-1">${m.kontak || '-'}</td>
                    <td class="p-1">${m.keterangan || '-'}</td>
                    <td class="text-end p-1">${m.debit.toLocaleString()}</td>
                    <td class="text-end p-1">${m.kredit.toLocaleString()}</td>
                    <td class="text-end p-1">${saldo.toLocaleString()}</td>
                  </tr>
                `);
            });

            // Isi total di footer
            const $tfoot = $('#card-body .boxAkun:last tfoot tr');
            $tfoot.find('.total-debit').text(totalDebit.toLocaleString());
            $tfoot.find('.total-kredit').text(totalKredit.toLocaleString());
            $tfoot.find('.total-balance').text(saldo.toLocaleString());
        });
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
