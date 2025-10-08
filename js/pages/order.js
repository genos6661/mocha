let currentFilters = "";
let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let resetOffset = false;
let userPermissions = [];

document.addEventListener("DOMContentLoaded", function () {
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
    $('#cabang').select2({
        dropdownParent: $('#modalFilter'),
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

    $('#range').on('change', function () {
      updateDateRangeSelector(this.value);
    });

    $('#range').select2({ dropdownParent: $('#modalFilter') });
    $('#range').val('year').trigger('change');

    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: ['Order', 'Transaction']
        },
        traditional: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;

            if(permissions.includes('order')) {
                initTable();
                initEvents();
                loadMoreData(true);
                if (!permissions.includes('posting_transaction')) {
                    $('#processBtn').attr('disabled', true);
                }
                if(!permissions.includes('delete_order')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelOrder tbody').append(`<tr><td class="text-center" colspan="8">Data Not Available</td></tr>`);
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

function updateBrowserURL(params) {
  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newURL);
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
      cabang: params.get("cabang") || "",
      start_date: params.get("start_date") || "",
      end_date: params.get("end_date") || "",
      closed: params.get("closed") || "",
  };
}

$("#sbmFilter").on("click", function () {
    const tanggalAwal = $("#startDate").val();
    const tanggalAkhir = $("#endDate").val();
    const cabangs = $("#cabang").val(); 
    const includeClosed = $("#includeClosed").is(":checked");

    currentFilters = ""; 

    const params = new URLSearchParams();
    params.append("start_date", tanggalAwal);
    params.append("end_date", tanggalAkhir);
    params.append("cabang", cabangs);
    params.append("closed", includeClosed);

    updateBrowserURL(params);
    if(userPermissions.includes('order')) {
        bootstrap.Modal.getInstance(document.getElementById("modalFilter")).hide();
        offset = 0;
        loadMoreData(true);
    } else {
        notif.fire({
            icon: 'error',
            text: 'Insufficient Permission to load data'
        });
    }
});

function initTable() {
    table = new DataTable("#tabelOrder", {
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
            { data: null, title: "No", orderable: false },
            {
                data: "tanggal",
                orderable: true,
                className: "nowrap",
                render: function (data, type, row) {
                  if (!data) return "";
                  const tanggal = new Date(data);
                  const options = { year: 'numeric', month: 'long', day: 'numeric' };
                  return tanggal.toLocaleDateString('en-ID', options);
                }
            },
            { data: "nomor", orderable: true },
            {
                data: "tipe",
                orderable: true,
                render: function (data) {
                  return data ? data.toUpperCase() : "";
                }
            },
            { data: "nama_cabang", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "closed", orderable: true, className: "text-center", render: function (data, type, row) {
                    if (data == 1) {
                        return `<span class="badge rounded-pill bg-label-secondary">Closed</span>`;
                    } else {
                        return `<span class="badge rounded-pill bg-label-primary">Open</span>`;
                    }
                } 
            },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                    if((userPermissions.includes('edit_order') || userPermissions.includes('delete_order') || userPermissions.includes('posting_transaction')) && data.closed == 0) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('posting_transaction')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalProses" data-id="${data.noindex}" data-ref="${data.nomor}">Process</a>
                            `;
                        }

                        if (userPermissions.includes('edit_order')) {
                            menuHtml += `
                                <a href="/order/edit?nomor=${data.nomor}" class="dropdown-item">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_order')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.noindex}" data-ref="${data.nomor}">Delete</a>
                            `;
                        }

                        menuHtml += `
                              </div>
                            </div>
                        `;
                        return menuHtml;
                    } else { return ''; }
                }
            },
            { data: "noindex", visible: false }
        ],
        createdRow: function (row, data, dataIndex) {
          $(row).addClass('cursor-pointer').attr('title', 'Double Click to show details');
        },
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
        rowCallback: function (row, data, index) {
            row.cells[0].innerHTML = index + 1;
        }
    });

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "tanggal", "nomor", "tipe", "nama_cabang", "nama", "closed", ""];
        orderColumn = columnMapping[columnIndex] || "nomor";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    if (reset) {
        orderDir = "desc";
    }

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";

    const filters = getFiltersFromURL();

    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    const query = new URLSearchParams({
        offset: offset,
        limit: limit,
        search: searchValue,
        order_column: orderColumn,
        order_dir: orderDir
    });

    if (filters.cabang) query.append("cabang", filters.cabang);
    if (filters.start_date) query.append("start_date", filters.start_date);
    if (filters.end_date) query.append("end_date", filters.end_date);
    if (filters.closed && filters.closed === "true") query.append("closed", 1);

  fetch(`${url_api}/order/datatable?${query.toString()}`, {
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

      document.querySelector("#totalOrder").textContent = total;
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

    document.querySelector("#tabelOrder_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData(false);
        }
    });

    $('#tabelOrder tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;
        var nomor = rowData.nomor;

        $.ajax({
            url: url_api + `/order/nomor/${nomor}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (data) {
                const tanggal = new Date(data.tanggal);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                if (data.closed == 1) {
                    $('#statusDetail').html('<span class="badge bg-label-secondary">Closed</span>');
                    $('#editBtn, #deleteBtn, #processBtn').addClass('d-none');
                    if(!userPermissions.includes('edit_order')) {
                        $('#editBtn').addClass('d-none');
                    }
                } else {
                    $('#statusDetail').html('<span class="badge bg-label-primary">Open</span>');
                    $('#deleteBtn, #processBtn').removeClass('d-none');
                    if(userPermissions.includes('edit_order')) {
                        $('#editBtn').removeClass('d-none');
                    }
                }
                $('.dataDetail').text('');
                $('#nomorDetail').text('#' + data.nomor);
                $('#tipeDetail').text(data.tipe.toUpperCase());
                $('#cabangDetail').text(data.nama_cabang);
                $('#pelangganDetail').text(data.nama_pelanggan);
                $('#negaraDetail').text(data.nationality);
                $('#tanggalDetail').text(tanggal.toLocaleDateString('en-ID', options));
                const details = data.details || [];

                const tbody = $('#tabelItemDetail tbody');
                tbody.empty();

                if (details.length === 0) {
                    tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
                } else {
                    let subtotal = 0;

                    details.forEach(function (item) {
                        const totalPerItem = item.jumlah * item.rate;
                            subtotal += totalPerItem;
                        const row = `
                            <tr>
                              <td><div class="d-flex flex-column"><a class="text-heading text-truncate"><span class="fw-medium">${item.kode}</span></a><small>${item.nama}</small></div></td>
                              <td class="text-end">${Number(item.jumlah).toLocaleString('id-ID')}</td>
                              <td class="text-end">Rp. ${Number(item.rate).toLocaleString('id-ID', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}</td>
                              <td class="text-end">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}</td>
                            </tr>
                        `;
                      tbody.append(row);
                    });
                    tbody.append(`
                        <tr><td colspan="3" class="text-end fw-bold">Total : </td>
                            <td class="text-end fw-bold">Rp. ${Number(subtotal).toLocaleString('id-ID', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}</td></tr>
                    `);
                }
                $('#processBtn').attr('data-id', id).attr('data-ref', nomor);
                $('#editBtn').attr('href', `/order/edit?nomor=${nomor}`);
                $('#deleteBtn').attr('data-id', id).attr('data-ref', nomor);
                $('#modalDetail').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

// modal
const modalProses = document.getElementById('modalProses')
modalProses.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idProses').val(id);
    $('#refProses').text(ref);
    $('#sbmProses').trigger('focus');
});

const modalHapus = document.getElementById('modalHapus')
modalHapus.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idHapus').val(id);
    $('#refHapus').text(ref);
    $('#sbmHapus').trigger('focus');
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

// ~~~~~~~~~~~~~~~~ proses
$('#sbmProses').click(function (e) {
    e.preventDefault();

    const id = $('#idProses').val();

    $.ajax({
        url: url_api + '/transaction/' + id,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify({
            localTime: new Date().toISOString()
        }),
        success: function (response) {
            offset = 0;
            table.clear().draw();
            loadMoreData(true);
            Swal.fire({
                title: 'Success',
                text: response.message,
                icon: 'success',
                showDenyButton: true,
                confirmButtonText: 'Print Invoice',
                denyButtonText: 'Okay',
                customClass: {
                  denyButton: 'btn btn-secondary',
                  confirmButton: 'btn btn-primary'
                },
                reverseButtons: true,
                allowOutsideClick: false, 
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#modalProses').modal('hide');
                    window.open('/pages/transaction/invoice.php?transaction=' + response.nomor, '_blank');
                } else if (result.isDenied) {
                    $('#modalProses').modal('hide');
                }
            });
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

$('#sbmHapus').click(function (e) {
  e.preventDefault();

  const id = $('#idHapus').val();

  $.ajax({
    url: url_api + '/order/' + id,
    type: 'DELETE',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData(true);
        });
        $('#modalHapus').modal('hide'); 
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

$('#btnReload').click(function (e) {
  e.preventDefault();
  offset = 0;
  loadMoreData(true);
});