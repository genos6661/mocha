let currentFilters = {};
let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "valas";
let orderDir = "asc";
let resetOffset = false;
let isPermit;
$(document).ready(function () {

  $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            kode: 'forex_stock'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
          isPermit = permissions;
          if (isPermit && isPermit != '') {
            initTable();
            initEvents();
            loadMoreData();
          } else {
            notif.fire({
              icon: 'error',
              text: 'Insufficient Permission to load data'
            });
            $('#tabelStok tbody').append(`<tr><td class="text-center" colspan="4">Data Not Available</td></tr>`);
          }
            // if(permissions.includes('branch')) {
            //     initTable();
            //     initEvents();
            //     loadMoreData();
            //     if (!permissions.includes('edit_branch')) {
            //         $('#activateBtn, #deactivateBtn, #editBtn').attr('disabled', true);
            //     }
            //     if(!permissions.includes('delete_branch')) {
            //         $('#deleteBtn').attr('disabled', true);
            //     }
            // } else {
            //     notif.fire({
            //         icon: 'error',
            //         text: 'Insufficient Permission to load data'
            //     });
            //     $('#tabelBranch tbody').append(`<tr><td class="text-center" colspan="6">Data Not Available</td></tr>`);
            //     if (document.querySelector(`.notiflix-loading`)) {
            //         Loading.remove();
            //     }
            // }
        },
        error: function (xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON.message
            });
            console.error('Gagal mengambil permissions:', xhr.responseText);
        }
    });

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
      placeholder: 'Choose Branch'
  });

  $('#range').select2();

  $('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });
});

$("#sbmFilter").on("click", function () {
  const tanggal = $("#date").val();
  const cabang = $("#cabang").val(); 

  currentFilters = {}; 

  if (tanggal) {
    currentFilters.tanggal = tanggal;
  }

  if (cabang && cabang != 'all') {
    currentFilters.cabang = cabang;
  }

  if (isPermit && isPermit != '') {
    offset = 0;
    loadMoreData(true);
  } else {
    notif.fire({
      icon: 'error',
      text: 'Insufficient Permission to load data'
    });
    $('#tabelStok tbody').empty().append(`<tr><td class="text-center" colspan="4">Data Not Available</td></tr>`);
  }
});

function initTable() {
  table = new DataTable("#tabelStok", {
      processing: true,
      serverSide: false,
      scrollY: "60vh",
      scrollCollapse: true,
      deferRender: true,
      ordering: true,
      paging: false,
      lengthChange: false,
      info: false,
      autoWidth: false,
      columns: [
          {
              data: "valas",
              orderable: true,
              className: "nowrap",
              render: function (data, type, row) {
                if (!data) return "";
                return `<div class="d-flex flex-column"><a class="text-heading text-truncate"><span class="fw-medium">${data}</span></a><small>${row.nama_valas}</small></div>`;
              }
          },
          { data: "nama_cabang", orderable: true, className: "nowrap" },
          { 
              data: "stok_akhir", 
              orderable: true, 
              className: "text-end nowrap",
              render: function(data, type, row) {
                  if (!data) return ""; 
                  
                  return parseFloat(data).toLocaleString("id-ID");
              },
          },
          { 
              data: null,
              className: "text-end",
              render: function(data) {
                  return `
                      <div class="dropdown">
                        <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown"><i class="icon-base ti tabler-dots-vertical icon-22px"></i></a>
                      <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item">Valas Mutation</a>
                      </div></div>
                  `;
              }
          }
      ],
      columnDefs: [{ orderable: false, targets: -1 }],
      dom: 'tp',
      // rowCallback: function (row, data, index) {
      //     row.cells[0].innerHTML = index + 1;
      // }
  });

  table.on("order.dt", function () {
      let order = table.order();
      let columnIndex = order[0][0]; 
      let direction = order[0][1];

      let columnMapping = ["valas", "cabang", "stok_akhir", ""];
      orderColumn = columnMapping[columnIndex] || "valas";
      orderDir = direction;

      resetOffset = true;
      loadMoreData(true);
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

  if (reset) {
    orderDir = "asc";
  }

  const searchInput = document.querySelector(".filtertabel input");
  const searchValue = searchInput ? searchInput.value : "";

  const params = new URLSearchParams();
  params.append("offset", reset ? 0 : offset);
  params.append("limit", limit);
  params.append("search", searchValue);
  params.append("order_column", orderColumn);
  params.append("order_dir", orderDir);

  for (const key in currentFilters) {
    params.append(key, currentFilters[key]);
  }

  fetch(`${url_api}/forex/stok-valas?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    }
  })
    .then(response => response.json())
    .then(response => {
      const data = Array.isArray(response.data) ? response.data : [];
      const total = response.recordsTotal || 0;

      if (reset) {
        offset = limit;
        table.clear().draw();
        if (data.length > 0) {
          table.rows.add(data).draw();
        }
      } else {
        if (data.length > 0) {
          table.rows.add(data).draw(false);
          offset += limit;
        }
      }

      // document.querySelector("#totaltrans").textContent = total;
      isLoading = false;
    })
    .catch((err) => {
      console.error("Load data error:", err);
      isLoading = false;
    });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
}

function initEvents() {
  document.querySelector(".filtertabel input").addEventListener("keyup", function () {
      let searchValue = this.value;
      if (searchValue !== lastSearch) {
          lastSearch = searchValue;
          offset = 0;
          loadMoreData(true);
      }
  });

  document.querySelector("#tabelStok_wrapper .dt-scroll-body").addEventListener("scroll", function () {
      if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
          loadMoreData();
      }
  });
}

function updateDateRangeSelector(selectedValue) {
  const today = new Date();
  let startDate = '';
  let endDate = '';
  let date = '';

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
      date = formatDate(yesterday);
      break;

    case 'lastWeek':
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      startDate = formatDate(lastWeekStart);
      date = formatDate(lastWeekEnd);
      break;

    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDate(lastMonthStart);
      date = formatDate(lastMonthEnd);
      break;

    case 'lastYear':
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      startDate = formatDate(lastYearStart);
      date = formatDate(lastYearEnd);
      break;

    case 'all':
    default:
      startDate = '';
      endDate = '';
      break;
  }

  // $('#startDate').val(startDate);
  $('#date').val(date);
}