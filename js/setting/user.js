let table;
let offsetUser = 0;
let limitUser = 20;
let isLoadingUser = false;
let lastSearchUser = "";
let orderColumnUser = "nama";
let orderDirUser = "asc";
let resetOffsetUser = false;
let userPermissions = [];

$(document).ready(function() {
    initTableUser();
    initEventsUser();

    $('#roleEditUser').select2({
        dropdownParent: $('#modalEditUser'),
        ajax: {
          url: url_api + '/role/select2',
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
        placeholder: 'Choose Role'
    });

    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: ['Users', 'Roles']
        },
        traditional: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            initRegister();
            initRole();

            if(permissions.includes('user')) {
                loadMoreDataUser();
                if (!permissions.includes('edit_user')) {
                    $('#activateBtn, #deactivateBtn, #editBtn').attr('disabled', true);
                }
                if(!permissions.includes('delete_user')) {
                    $('#deleteBtn').attr('disabled', true);
                }
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

    $('#modalTambah').on('shown.bs.modal', function (e) {
        $('#modalTambah #kode').trigger('focus');
    });
});

$('#btnReloadUsers').click(function (e) {
  e.preventDefault();
  if(userPermissions.includes('user')) {
    loadMoreDataUser(true);
  } else {
    notif.fire({
        icon: 'error',
        text: 'Insufficient Permission to load data'
    });
  }
});


function initTableUser() {
    table = new DataTable("#tabelUser", {
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
            { data: "username", orderable: true, className: "nowrap", render: function (data, type, row) {
                    return `<div class="d-flex flex-column"><a class="text-heading text-truncate"><span class="fw-medium">${data}</span></a><small>${row.email_user}</small></div>`;
                } 
            },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "telepon", orderable: false },
            { data: "nama_role", orderable: true },
            { data: "aktif", orderable: true, className: "text-center", render: function (data, type, row) {
                    if (row.aktif == 1) {
                        return `<span class="badge rounded-pill bg-label-primary">Active</span>`;
                    } else {
                        return `<span class="badge rounded-pill bg-label-danger">Inactive</span>`;
                    }
                } 
            },
            { 
                data: "id_user",
                className: "text-end",
                render: function(data, type, row) {
                    if((userPermissions.includes('edit_user') || userPermissions.includes('delete_user')) && row.level > window.level) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_user')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEditUser" data-id="${data}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_user')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapusUser" data-id="${data.id_user}" data-ref="${data.username}">Delete</a>
                            `;
                        }

                        menuHtml += `
                              </div>
                            </div>
                        `;
                        return menuHtml;
                    } else { return ''; }
                }
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

        let columnMapping = ["", "username", "nama", "","nama_role", "aktif", ""];
        orderColumnUser = columnMapping[columnIndex] || "nama";
        orderDirUser = direction;

        resetOffset = true;
        loadMoreDataUser(true);
    });
}

function loadMoreDataUser(reset = false) {
    if (isLoadingUser) return;
    isLoadingUser = true;

    let searchInput = document.querySelector(".filtertabel input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumnUser}&order_dir=${orderDirUser}`;

    fetch(url_api + `/users/datatable?offset=${reset ? 0 : offsetUser}&limit=${limitUser}&search=${searchValue}${orderParam}`, {
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
                offsetUser = reset ? limitUser : offsetUser + limitUser;
                if (reset) {
                    table.clear().rows.add(response.data).draw();
                } else {
                    table.rows.add(response.data).draw(false);
                }
            }
            isLoadingUser = false;
            document.querySelector("#totalUser").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoadingUser = false;
        });
}

function initEventsUser() {
    document.querySelector(".filtertabel input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearchUser) {
            lastSearchUser = searchValue;
            offsetUser = 0;
            loadMoreDataUser(true);
        }
    });

    document.querySelector("#tabelUser_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreDataUser();
        }
    });

    $('#tabelUser tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.id_user;

        $.ajax({
            url: url_api + `/users/id/${id}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (response) {
                const data = response.data;

                if (window.level < data.level) {
                    $('#editBtn, #deleteBtn').removeClass('d-none');
                    if (data.aktif == 1) {
                        $('#deactivateBtn').removeClass('d-none');
                        $('#activateBtn').addClass('d-none');
                    } else {
                        $('#activateBtn').removeClass('d-none');
                        $('#deactivateBtn').addClass('d-none');
                    }
                } else {
                    $('#editBtn, #deleteBtn, #activateBtn, #deactivateBtn').addClass('d-none');
                }
                
                $('.dataDetail').text('');
                $('#nikDetail').text(data.nik);
                $('#namaDetail').text(data.nama);
                $('#teleponDetail').text(data.telepon);
                $('#alamatDetail').text(data.alamat);
                $('#negaraDetail').text(data.nama_int_negara);
                $('#posisiDetail').text(data.pekerjaan);
                $('#emailDetail').text(data.email);
                $('#roleDetail').text(data.nama_role);
                $('#kodeDetail').text(data.kode);
                $('#usernameDetail').text(data.username);
                $('#activateBtn').attr('data-id', id);
                $('#deactivateBtn').attr('data-id', id);
                $('#editBtn').attr('data-id', id);
                $('#deleteBtn').attr('data-id', id).attr('data-ref', data.username);
                $('#modalDetailUser').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

//modal
const modalEdit = document.getElementById('modalEditUser')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEditUser').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/users/id/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            const data = response.data;
            $('#idEditUser').val(id);
            $('#namaEditUser').val(data.username);
            $('#emailEditUser').val(data.email);
            if (data.role && data.role != 0) {
                const option = new Option(data.kode_role + ' - ' + data.nama_role, data.role, true, true);
                $('#roleEditUser').append(option).trigger('change');
            }
            $('#aktifEdit').prop('checked', data.aktif == 1);
            $('#requestEdit').prop('checked', data.request == 1);

            $('#modalEditUser').modal('show');
        },
        error: function(xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        }
    });
});

const modalHapus = document.getElementById('modalHapusUser')
modalHapus.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idHapusUser').val(id);
    $('#refHapusUser').text(ref);
});

// proses
$('#sbmEditUser').click(function (e) {
  e.preventDefault(); 
  const id = $('#idEditUser').val();
  
  const formData = {
    nama: $('#namaEditUser').val(),
    email: $('#emailEditUser').val(),
    role: $('#roleEditUser').val(),
    password: $('#passwordEditUser').val(),
    request: $('#requestEdit').is(':checked') ? 1 : 0,
    aktif: $('#aktifEdit').is(':checked') ? 1 : 0,
  };

  console.log(formData);

  $.ajax({
    url: url_api + '/users/id/' + id,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData), 
    success: function (response) {
        $('#modalEditUser .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offsetUser = 0;
            table.clear().draw();
            loadMoreDataUser();
        });
        $('#modalEditUser').modal('hide'); 
    },
    error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    },
  });
});

$('#sbmHapusUser').click(function (e) {
  e.preventDefault();

  const id = $('#idHapusUser').val();

  $.ajax({
    url: url_api + '/users/' + id,
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
            offsetUser = 0;
            table.clear().draw();
            loadMoreDataUser();
        });
        $('#modalHapusUser').modal('hide'); 
    },
    error: function (xhr) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    },
  });
});

$('#deactivateBtn').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/users/set-status',
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

function disableIfNoRegister() {
    if (!userPermissions.includes('register')) {
        $('#register-account').find('#smbReg').attr('disabled', true);
    }
}

// Saat halaman pertama kali load
disableIfNoRegister();

// Saat tab register-account dibuka
$(document).on('shown.bs.tab', 'button[data-bs-target="#register-account"]', function () {
    disableIfNoRegister();
});