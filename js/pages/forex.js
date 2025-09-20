let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nama";
let orderDir = "asc";
let resetOffset = false;
let userPermissions = [];

document.addEventListener("DOMContentLoaded", function () {
    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: 'Forex'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('add_forex')) {
                $('#btnModalTambah').attr('disabled', true);
            }

            if (!permissions.includes('edit_forex')) {
                $('#btnModalRate, #resetBtn').attr('disabled', true);
            }

            if(permissions.includes('forex')) {
                initTable();
                initEvents();
                loadMoreData(true);

                if (!permissions.includes('edit_forex')) {
                    $('#activateBtn, #deactivateBtn, #editBtn').attr('disabled', true);
                } else {
                    loadRates();
                }

                if(!permissions.includes('delete_forex')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelForex tbody').append(`<tr><td class="text-center" colspan="7">Data Not Available</td></tr>`);
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

function initTable() {
    table = new DataTable("#tabelForex", {
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
            { data: "kode", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { 
                data: "beli", 
                orderable: true, 
                className: "text-end nowrap",
                render: function(data, type, row) {
                    if (!data) return ""; 
                    
                    return "Rp " + parseFloat(data).toLocaleString("id-ID");
                },
            },
            { 
                data: "jual", 
                orderable: true, 
                className: "text-end nowrap" ,
                render: function(data, type, row) {
                    if (!data) return ""; 
                    
                    return "Rp " + parseFloat(data).toLocaleString("id-ID");
                },
            },
            { data: "aktif", orderable: true, className: "text-center", render: function (data, type, row) {
                    if (row.aktif == 1) {
                        return `<span class="badge rounded-pill bg-label-primary">Active</span>`;
                    } else {
                        return `<span class="badge rounded-pill bg-label-danger">Inactive</span>`;
                    }
                } 
            },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                    if(userPermissions.includes('edit_forex') || userPermissions.includes('delete_forex')) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_forex')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_forex')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.noindex}" data-ref="${data.kode} - ${data.nama}">Delete</a>
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

    let columnMapping = ["", "kode", "nama", "jual", "beli", "aktif", ""];
    orderColumn = columnMapping[columnIndex] || "nama";
    orderDir = direction;

    resetOffset = true;
    loadMoreData(true);
});
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    let searchInput = document.querySelector(".filtertabel input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(url_api + `/forex/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.data.length > 0) {
                offset = reset ? limit : offset + limit;
                if (reset) {
                    table.clear().rows.add(response.data).draw();
                } else {
                    table.rows.add(response.data).draw(false);
                }
            }
            isLoading = false;
            document.querySelector("#totalForex").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoading = false;
        });
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

    document.querySelector("#tabelForex_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelForex tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/forex/id/${id}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (data) {
                if (data.aktif == 1) {
                    $('#statusDetail').html('<span class="badge bg-label-success">Active</span>');
                    $('#deactivateBtn').removeClass('d-none');
                    $('#activateBtn').addClass('d-none');
                } else {
                    $('#statusDetail').html('<span class="badge bg-label-danger">Inactive</span>');
                    $('#activateBtn').removeClass('d-none');
                    $('#deactivateBtn').addClass('d-none');
                }
                $('.dataDetail').text('');
                $('#kodeDetail').text(data.kode);
                $('#namaDetail').text(data.nama);
                $('#beliDetail').text("Rp " + parseFloat(data.beli).toLocaleString("id-ID"));
                $('#jualDetail').text("Rp " + parseFloat(data.jual).toLocaleString("id-ID"));
                $('#activateBtn').attr('data-id', id);
                $('#deactivateBtn').attr('data-id', id);
                $('#editBtn').attr('data-id', id);
                $('#deleteBtn').attr('data-id', id).attr('data-ref', data.kode);
                $('#modalDetail').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

$('#sbmTambah').click(function (e) {
  e.preventDefault();

  const formData = {
    kode: $('#kode').val(),
    nama: $('#nama').val(),
    jual: $('#jual').val(),
    beli: $('#beli').val(),
  };
  $.ajax({
    url: url_api + '/forex', 
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData), 
    success: function (response) {
        $('#modalTambah .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData();
        });
    },
    error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    },
  });
});

$('#sbmEdit').click(function (e) {
  e.preventDefault(); 
  const id = $('#idEdit').val();
  
  const formData = {
    kode: $('#kodeEdit').val(),
    nama: $('#namaEdit').val(),
    jual: $('#jualEdit').val(),
    beli: $('#beliEdit').val(),
    aktif: $('#aktif').is(':checked') ? 1 : 0,
  };

  $.ajax({
    url: url_api + '/forex/' + id,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData), 
    success: function (response) {
        $('#modalEdit .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData();
        });
        $('#modalEdit').modal('hide'); 
    },
    error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    },
  });
});

$('#sbmHapus').click(function (e) {
  e.preventDefault();

  const id = $('#idHapus').val();

  $.ajax({
    url: url_api + '/forex/' + id,
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
            loadMoreData();
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

$('#modalTambah').on('shown.bs.modal', function (e) {
    $('#modalTambah #kode').trigger('focus');
});

$('#activateBtn').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/forex/set-status',
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify({ id: id, status: 1 }),
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData();
        });
        $('#modalDetail').modal('hide'); 
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

$('#deactivateBtn').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/forex/set-status',
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify({ id: id, status: 0 }),
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData();
        });
        $('#modalDetail').modal('hide'); 
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

// modal
const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/forex/id/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            $('#idEdit').val(id);
            $('#kodeEdit').val(response.kode);
            $('#namaEdit').val(response.nama);
            $('#jualEdit').val(response.jual);
            $('#beliEdit').val(response.beli);
            $('#aktif').prop('checked', response.aktif == 1);

            $('#modalEdit').modal('show');
        },
        error: function(xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        }
    });
});

const modalHapus = document.getElementById('modalHapus')
modalHapus.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idHapus').val(id);
    $('#refHapus').text(ref);
});

let tableRates;

function loadRates() {
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

    $.ajax({
        url: url_api + `/forex/datatable?offset=0&limit=100`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            const details = response.data || [];

            const tbody = $('#tabelRate tbody');
            tbody.empty();

            if (details.length === 0) {
                tbody.append('<tr><td colspan="3" class="text-center">Data Forexs Not Found</td></tr>');
            } else {
                details.forEach(function (item) {
                    const row = `
                        <tr>
                        <input type="hidden" class="idRate" value="${item.noindex}">
                          <td class="p-1 ps-3">${item.kode} - ${item.nama}</td>
                          <td class="p-1"><input type="number" class="form-control buyRate text-end" value="${item.beli}"></td>
                          <td class="p-1"><input type="number" class="form-control sellRate text-end" value="${item.jual}"></td>
                        </tr>
                    `;
                  tbody.append(row);
                });
            }
            if ($.fn.DataTable.isDataTable('#tabelRate')) {
                tableRates.destroy();
            }

            // Inisialisasi DataTable baru
            tableRates = $('#tabelRate').DataTable({
                paging: false,
                info: false,
                searching: true,
                dom: 't'
            });
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
            } else {
                notif.fire({
                  icon: 'error',
                  text: 'Terjadi Kesalahan pada server'
                });
            }
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
    });
}

$('#resetBtn').on('click', function () {
    loadRates();
});

$('#searchRate').on('keyup', function () {
    tableRates.search(this.value).draw();
});

$('#sbmRate').on('click', function(e) {
    e.preventDefault();

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

    const rates = [];

    $('#tabelRate tbody tr').each(function () {
        const noindex = $(this).find('.idRate').val();
        const buy = $(this).find('.buyRate').val();
        const sell = $(this).find('.sellRate').val();

        if (noindex) {
            rates.push({
                noindex: parseInt(noindex, 10),
                buy: parseFloat(buy) || 0,
                sell: parseFloat(sell) || 0
            });
        }
    });

    if (rates.length === 0) {
        notif.fire({
            icon: 'warning',
            text: 'No Data to Submit'
        });
        return;
    }

    $.ajax({
        url: url_api + '/forex/update-rates', 
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(rates),
        success: function (response) {
            loadRates();
            loadMoreData(true);
            notif.fire({
                icon: 'success',
                text: response.message || 'Rates Updated Successfully'
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
                text: xhr.responseJSON?.message || 'Failed to update rates'
            });
        }
    });
});