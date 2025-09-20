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
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: 'Branch'
        },
        traditional: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('add_branch')) {
                $('#btnModalTambah').attr('disabled', true);
            }

            if(permissions.includes('branch')) {
                initTable();
                initEvents();
                loadMoreData();
                if (!permissions.includes('edit_branch')) {
                    $('#activateBtn, #deactivateBtn, #editBtn').attr('disabled', true);
                }
                if(!permissions.includes('delete_branch')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelBranch tbody').append(`<tr><td class="text-center" colspan="6">Data Not Available</td></tr>`);
                if (document.querySelector(`.notiflix-loading`)) {
                    Loading.remove();
                }
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

    $('#modalTambah').on('shown.bs.modal', function (e) {
        $('#modalTambah #kode').trigger('focus');
    });

});

function initTable() {
    table = new DataTable("#tabelBranch", {
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
            { data: "alamat", orderable: true },
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
                    if(userPermissions.includes('edit_branch') || userPermissions.includes('delete_branch')) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_branch')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_branch')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.noindex}" data-ref="${data.kode}">Delete</a>
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
            {
                data: "noindex", visible: false 
            }
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

        let columnMapping = ["", "kode", "nama", "alamat", "aktif", ""];
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

    fetch(url_api + `/cabang/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
            document.querySelector("#totalCabang").textContent = response.recordsTotal;
        })
        .catch(() => {
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

    document.querySelector("#tabelBranch_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelBranch tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/cabang/id/${id}`,
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
                $('#teleponDetail').text(data.telepon);
                $('#alamatDetail').text(data.alamat);
                $('#judulDetail').text(data.judul_nota);
                $('#footer1Detail').text(data.footer1);
                $('#footer2Detail').text(data.footer2);
                $('#footer3Detail').text(data.footer3);
                $('#cdHeadDetail').text(data.cd_header);
                $('#cdFootDetail').text(data.cd_footer);
                $('#activateBtn').attr('data-id', id);
                $('#deactivateBtn').attr('data-id', id);
                $('#editBtn').attr('data-id', id);
                $('#deleteBtn').attr('data-id', id).attr('data-ref', data.kode);
                $('#modalDetail').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                notif.fire({
                  icon: 'error',
                  text: err.responseJSON.message
                });
            }
        });
    });
}

//modal
const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/cabang/id/` + id,
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
            $('#alamatEdit').val(response.alamat);
            $('#teleponEdit').val(response.telepon);
            $('#judulEdit').val(response.judul_nota);
            $('#footer1Edit').val(response.footer1);
            $('#footer2Edit').val(response.footer2);
            $('#footer3Edit').val(response.footer3);
            $('#cdHeadEdit').val(response.cd_header);
            $('#cdFootEdit').val(response.cd_footer);
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
    $('#sbmHapus').trigger('focus');
});

// ~~~~~~~~~~~~~~~~~ proses ~~~~~~~~~~~~~~~~~
$('#sbmTambah').click(function (e) {
  e.preventDefault();

  const formData = {
    kode: $('#kode').val(),
    nama: $('#nama').val(),
    alamat: $('#alamat').val(),
    telepon: $('#telepon').val(),
    judul: $('#judul').val(),
    footer1: $('#footer1').val(),
    footer2: $('#footer2').val(),
    footer3: $('#footer3').val(),
    cd_header: $('#cdHead').val(),
    cd_footer: $('#cdFoot').val(),
  };
  $.ajax({
    url: url_api + '/cabang', 
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
    alamat: $('#alamatEdit').val(),
    telepon: $('#teleponEdit').val(),
    judul: $('#judulEdit').val(),
    footer1: $('#footer1Edit').val(),
    footer2: $('#footer2Edit').val(),
    footer3: $('#footer3Edit').val(),
    cd_header: $('#cdHeadEdit').val(),
    cd_footer: $('#cdFootEdit').val(),
    aktif: $('#aktif').is(':checked') ? 1 : 0,
  };

  $.ajax({
    url: url_api + '/cabang/' + id,
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
    url: url_api + '/cabang/' + id,
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

$('#activateBtn').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/cabang/set-status',
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
    url: url_api + '/cabang/set-status',
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