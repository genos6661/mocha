let filterMutasi = "";
let table;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "asc";
let isPermit;
$(document).ready(function() {
	$('#cabang').select2({
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
    placeholder: 'All Branch',
    allowClear: true
	});

	$('#valas').select2({
    ajax: {
      url: url_api + '/forex/select2',
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
    placeholder: 'Choose Forex'
	});

	$('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#range').select2();
  $('#range').val('month').trigger('change');

  initTable();

  $.ajax({
    url: url_api + '/role/role-permissions',
    method: 'GET',
    data: {
      kode: 'forex_mutation'
    },
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (permissions) {
        isPermit = permissions;

        if(isPermit && isPermit != '') {
            loadMoreData(true);
        } else {
            notif.fire({
                icon: 'error',
                text: 'Insufficient Permission to load data'
            });
        }
    },
    error: function (xhr) {
        notif.fire({
            icon: 'error',
            text: xhr.responseJSON.message
        });
        console.error('Gagal mengambil permissions:', xhr.responseText);
    }
  });
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

function updateBrowserURL(params) {
  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newURL);
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
      search: params.get("search") || "",
      cabang: params.get("cabang") || "",
      tanggal: params.get("tanggal") || "",
      start_date: params.get("start_date") || "",
      end_date: params.get("end_date") || "",
      valas: params.get("valas") || "",
  };
}

$("#sbmFilter").on("click", function () {
  const start = $("#startDate").val();
  const end = $("#endDate").val();
  const valas = $("#valas").val();
  const cabang = $("#cabang").val();
  const search = $(".filtertabel input").val();

  if (!start || !end || !valas) {
    notif.fire({ icon: 'warning', text: 'Forex and date are required fields' });
    return;
  }

  const params = new URLSearchParams();
  params.append("start_date", start);
  params.append("end_date", end);
  params.append("valas", valas);
  if (cabang) params.append("cabang", cabang);
  if (search) params.append("search", search);

  updateBrowserURL(params);
  if(isPermit && isPermit != '') {
    loadMoreData(true);
  } else {
      notif.fire({
          icon: 'error',
          text: 'Insufficient Permission to load data'
      });
  }
});

function initTable() {
    table = new DataTable("#tabelMutasi", {
        processing: true,
        serverSide: false,
        scrollY: "60vh",
        scrollCollapse: true,
        deferRender: true,
        ordering: false,
        paging: false,
        lengthChange: false,
        info: false,
        autoWidth: false,
        columns: [
            { data: "kode_valas"},
            {
                data: "tanggal",
                render: function (data, type, row) {
                  if (!data) return "";
                  const tanggal = new Date(data);
                  const options = { year: 'numeric', month: 'long', day: 'numeric' };
                  return tanggal.toLocaleDateString('en-ID', options);
                }
            },
            { data: "nomor", orderable: true, className: "nowrap" },
            { data: "nama_cabang", orderable: true, className: "nowrap" },
            { 
                data: "beli", 
                orderable: true, 
                className: "text-end nowrap",
                render: function(data, type, row) {
                    if (row.is_saldo_awal) return "";
                    if (row.is_saldo_akhir) return "<strong>" + parseFloat(data).toLocaleString("id-ID") + "</strong>";
                    if (!data) return "0"; 
                    
                    return parseFloat(data).toLocaleString("id-ID");
                },
            },
            { 
                data: "jual", 
                orderable: true, 
                className: "text-end nowrap",
                render: function(data, type, row) {
                    if (row.is_saldo_awal) return "";
                    if (row.is_saldo_akhir) return "<strong>" + parseFloat(data).toLocaleString("id-ID") + "</strong>";
                    if (!data) return "0"; 
                    
                    return parseFloat(data).toLocaleString("id-ID");
                },
            },
            { 
                data: "rate", 
                orderable: true, 
                className: "text-end nowrap",
                render: function(data, type, row) {
                    if (!data) return ""; 
                    
                    return "Rp " + parseFloat(data).toLocaleString("id-ID");
                },
            },
            { 
              data: null, 
              orderable: false, 
              className: "text-end nowrap",
              render: function(data, type, row) {
                  if (row.is_saldo_awal || row.is_saldo_akhir) {
                      return `<strong>${row.saldo_berjalan.toLocaleString("id-ID")}</strong>`;
                  } else if (typeof row.saldo_berjalan === 'number') {
                      return row.saldo_berjalan.toLocaleString("id-ID");
                  } else {
                      return "";
                  }
              }
            },
            {
                data: null,
                className: "text-end nowrap",
                render: function(data, type, row) {
                    if(row.is_saldo_awal || row.is_saldo_akhir) return "<strong>Rp " + parseFloat(row.nilai).toLocaleString("id-ID") + "</strong>";
                    if (!data) return "Rp 0";
                    return "Rp " + parseFloat(row.mutasi_nilai).toLocaleString("id-ID");
                }
            },
        ],
        // columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });
}

function loadMoreData(reset = false) {
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

    if (isLoading) return;
    isLoading = true;

    const filters = getFiltersFromURL();

    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    const query = new URLSearchParams({
        search: filters.search,
        order_column: orderColumn,
        order_dir: orderDir
    });

    if (filters.cabang) query.append("cabang", filters.cabang);
    if (filters.tanggal) query.append("tanggal", filters.tanggal);
    if (filters.valas) query.append("valas", filters.valas);
    if (filters.start_date) query.append("start_date", filters.start_date);
    if (filters.end_date) query.append("end_date", filters.end_date);

    if (!filters.valas || filters.valas == "") {
      $('#forexHead').text('Choose Forex First');
    } else {
      $('#forexHead').text('');
    }

    fetch(`${url_api}/forex/mutasi?${query.toString()}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        }
    })
    .then(response => response.json())
    .then(response => {
        const data = Array.isArray(response.mutasi) ? response.mutasi : [];
        const total = response.recordsTotal || 0;

        const saldoAwalQty = response.saldo_awal.qty || 0;
        const saldoAwalNilai = response.saldo_awal.nilai || 0;

        const saldoAwal = {
            kode_valas: response.mutasi?.[0]?.kode_valas || '',
            tanggal: null,
            nomor: "Beginning Balance",
            nama_cabang: null,
            beli: null,
            jual: null,
            rate: null,
            nilai: saldoAwalNilai,
            saldo_awal: saldoAwalQty,
            saldo_berjalan: saldoAwalQty,  // ← Ini yang akan ditampilkan
            is_saldo_awal: true
        };

        let runningSaldo = saldoAwalQty;
        let runningNilai = saldoAwalNilai;
        let totalBeli = 0;
        let totalJual = 0;

        const dataWithSaldo = data.map(row => {
            const beli = parseFloat(row.beli) || 0;
            const jual = parseFloat(row.jual) || 0;
            const nilai = parseFloat(row.nilai) || 0;

            totalBeli += beli;
            totalJual += jual;

            runningSaldo += (beli - jual);
            runningNilai += nilai;

            return {
                ...row,
                saldo_berjalan: runningSaldo,
                mutasi_nilai: runningNilai
            };
        });

        const saldoAkhir = {
            kode_valas: response.mutasi?.[0]?.kode_valas || '',
            tanggal: null,
            nomor: "End Balance",
            nama_cabang: null,
            beli: totalBeli,
            jual: totalJual,
            rate: null,
            nilai: response.saldo_akhir.nilai,
            saldo_akhir: response.saldo_akhir.qty,
            saldo_berjalan: response.saldo_akhir.qty,
            is_saldo_akhir: true
        };

        const fullData = [saldoAwal, ...dataWithSaldo, saldoAkhir];
        if (reset) {
          table.clear().draw();
          if (data.length > 0) {
            table.rows.add(fullData).draw();
          }
        } else {
          if (data.length > 0) {
            table.rows.add(fullData).draw(false);
          }
        }

        document.querySelector("#totalRec").textContent = total;
        isLoading = false;
    })
    .catch(() => {
        isLoading = false;
    });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
}
