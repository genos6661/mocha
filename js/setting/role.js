let tableRole;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "level";
let orderDir = "asc";
let resetOffset = false;

function initRole() {
    if (userPermissions.includes('add_role') || window.level == 1) {
        $('#btnTambahRole').attr('disabled', false);
    } else {
        $('#btnTambahRole').attr('disabled', true);
    }

    if (userPermissions.includes('role') || window.level == 1) {
        initTable();
        initEvents();
        loadMoreData();
        if (userPermissions.includes('edit_role') || window.level == 1) {
            $('#activateBtnRole, #deactivateBtnRole, #editBtnRole').attr('disabled', false);
        } else {
            $('#activateBtnRole, #deactivateBtnRole, #editBtnRole').attr('disabled', true);
        }
        if(userPermissions.includes('delete_role') || window.level == 1) {
            $('#deleteBtnRole').attr('disabled', false);
        } else {
            $('#deleteBtnRole').attr('disabled', true);
        }
    } else {
        $('#btnShowLevel').attr('disabled', true);
        notif.fire({
            icon: 'error',
            text: 'Insufficient Permission to load role data'
        });
        $('#tabelRole tbody').append(`<tr><td class="text-center" colspan="6">Data Not Available</td></tr>`);
    }

    $('#modalTambahRole').on('shown.bs.modal', function () {
        $('#modalTambahRole #permissionsContainer').empty();
        $('#modalTambahRole #kode').trigger('focus');
        loadPermissionsTree();
    });

    $('#modalHapusRole').on('shown.bs.modal', function (e) {
        e.preventDefault();

        $('#modalHapusRole #sbmHapusRole').trigger('focus');
        const button = e.relatedTarget
        const id = button.getAttribute('data-id')
        const ref = button.getAttribute('data-ref')

        $('#idHapusRole').val(id);
        $('#refHapusRole').text(ref);
    });
}

function initTable() {
    tableRole = new DataTable('#tabelRole', {
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
            { data: "kode_role", orderable: true },
            { data: "nama_role", orderable: true, className: "nowrap" },
            { data: "level", orderable: true, className: "nowrap" },
            { data: "aktif", orderable: true, className: "text-center", render: function (data, type, row) {
                    if (row.aktif == 1) {
                        return `<span class="badge rounded-pill bg-label-primary">Active</span>`;
                    } else {
                        return `<span class="badge rounded-pill bg-label-danger">Inactive</span>`;
                    }
                } 
            },
            { 
                data: "noindex",
                className: "text-end",
                render: function(data, type, row) {
                    if(((userPermissions.includes('edit_role') || userPermissions.includes('delete_role')) && row.level > window.level) || window.level == 1) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_role') || window.level == 1) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEditRole" data-id="${data}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_role') || window.level == 1) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapusRole" data-id="${data}" data-ref="${data.kode_role}">Delete</a>
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
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
        rowCallback: function (row, data, index) {
            row.cells[0].innerHTML = index + 1;
        },
        createdRow: function (row, data, dataIndex) {
          $(row).addClass('cursor-pointer').attr('title', 'Double Click to show details');
        }
    });

    tableRole.on("order.dt", function () {
        let order = tableRole.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "kode_role", "nama_role", "level", "aktif", ""];
        orderColumn = columnMapping[columnIndex] || "nama_role";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        tableRole.columns.adjust().draw();
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    let searchInput = document.querySelector(".filtertabelRole input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(url_api + `/role/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
                    tableRole.clear().rows.add(response.data).draw();
                } else {
                    tableRole.rows.add(response.data).draw(false);
                }
            }
            isLoading = false;
            document.querySelector("#totalRole").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoading = false;
        });
}

function initEvents() {
    document.querySelector(".filtertabelRole input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearch) {
            lastSearch = searchValue;
            offset = 0;
            loadMoreData(true);
        }
    });

    document.querySelector("#tabelRole_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelRole tbody').on('dblclick', 'tr', function () {
        var rowData = tableRole.row(this).data();
        if (!rowData) return; 

        $('.dataDetailRole').text('');

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/role/id/${id}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (data) {
                if (window.level < data.level || window.level == 1) {
                    $('#editBtnRole, #deleteBtnRole').removeClass('d-none');
                    if (data.aktif == 1) {
                        $('#deactivateBtnRole').removeClass('d-none');
                        $('#activateBtnRole').addClass('d-none');
                    } else {
                        $('#activateBtnRole').removeClass('d-none');
                        $('#deactivateBtnRole').addClass('d-none');
                    }
                } else {
                    $('#editBtnRole, #deleteBtnRole, #activateBtnRole, #deactivateBtnRole').addClass('d-none');
                }

                const badgeStatus = (data.aktif === 1) ? '<span class="badge bg-label-success">Active</span>' : '<span class="badge bg-label-danger">Inactive</span>';
                $('#statusDetailRole').html(badgeStatus);
                $('#kodeDetailRole').text(data.code);
                $('#namaDetailRole').text(data.name);
                $('#levelDetailRole').text(data.level);
                $('#activateBtnRole').attr('data-id', id);
                $('#deactivateBtnRole').attr('data-id', id);
                $('#editBtnRole').attr('data-id', id);
                $('#deleteBtnRole').attr('data-id', id).attr('data-ref', data.code + ' - ' + data.name);
                loadTree(id, 'boxTreeDetail');
                $('#modalDetailRole').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

//modal
$('#btnShowLevel').click(function () {
  loadTree();
});

const modalEditRole = document.getElementById('modalEditRole')
modalEditRole.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')

    loadEditRole(id);
});

function loadPermissionsTree(mode = '', selectedPermissions = []) {
    $.ajax({
      url: url_api + '/role/permissions',
      method: 'GET',
      headers: {
        'X-Client-Domain': window.location.hostname,
        'Authorization': `Bearer ${window.token}`
      },
      success: function (data) {
        renderPermissionsCollapse(data, mode, selectedPermissions);
        initPermissionCheckboxLogic(mode);

        setTimeout(() => {
            $(`.subcat-check[data-mode='${mode}']`).each(function () {
              updateSubcategoryCheck($(this).data('sub'), mode);
            });
            $(`.cat-check[data-mode='${mode}']`).each(function () {
              updateCategoryCheck($(this).data('cat'), mode);
            });
        }, 100);
      },
      error: function (xhr) {
        alert('Gagal memuat data permissions');
        console.error(xhr.responseText);
      }
    });
}

function renderPermissionsCollapse(data, mode, selectedPermissions = []) {
    const container = $(`#permissionsContainer${mode}`);
    container.empty();

    let accordionHTML = '';

    for (const category in data) {
      const catId = `cat_${slugify(category)}`;
      accordionHTML += `
        <div class="card mb-1">
          <div class="card-header d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#${catId}">
            <span><strong>${category}</strong></span>
            <input type="checkbox" class="cat-check form-check-input" data-mode="${mode}" data-cat="${catId}">
          </div>
          <div id="${catId}" class="collapse">
            <div class="card-body">
      `;

      for (const sub in data[category]) {
        const subId = `${catId}_sub_${slugify(sub)}`;
        accordionHTML += `
          <div class="mb-2 border p-2">
            <div class="d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#${subId}">
              <span>${sub}</span>
              <input type="checkbox" class="subcat-check form-check-input" data-mode="${mode}" data-sub="${subId}" data-cat="${catId}">
            </div>
            <div class="collapse mt-2 ml-3" id="${subId}">
        `;

        data[category][sub].forEach(perm => {
          const checked = selectedPermissions.includes(perm.id) ? 'checked' : '';
          accordionHTML += `
            <div class="form-check ms-2">
              <input class="form-check-input perm-check" type="checkbox" value="${perm.id}" ${checked} data-mode="${mode}" data-sub="${subId}" data-cat="${catId}" id="${mode}_perm_${perm.id}">
              <label class="form-check-label" for="${mode}_perm_${perm.id}">${perm.name}</label>
            </div>
          `;
        });

        accordionHTML += `</div></div>`;
      }

      accordionHTML += `</div></div></div>`;
    }

    container.append(accordionHTML);
  }

function initPermissionCheckboxLogic(mode = '') {
    $(`.cat-check[data-mode='${mode}']`).off('change').on('change', function () {
      const cat = $(this).data('cat');
      const checked = this.checked;
      $(`#${cat} input[type=checkbox][data-mode='${mode}']`).prop('checked', checked).prop('indeterminate', false);
      updateIndeterminate(cat, mode);
    });

    $(`.subcat-check[data-mode='${mode}']`).off('change').on('change', function () {
      const sub = $(this).data('sub');
      const checked = this.checked;
      $(`#${sub} .perm-check[data-mode='${mode}']`).prop('checked', checked);
      updateIndeterminate($(this).data('cat'), mode);
    });

    $(document).off('change', `.perm-check[data-mode='${mode}']`).on('change', `.perm-check[data-mode='${mode}']`, function () {
      const sub = $(this).data('sub');
      const cat = $(this).data('cat');
      updateSubcategoryCheck(sub, mode);
      updateCategoryCheck(cat, mode);
    });
}

function updateSubcategoryCheck(subId, mode = '') {
    const $perms = $(`#${subId} .perm-check[data-mode='${mode}']`);
    const $subCheck = $(`.subcat-check[data-mode='${mode}'][data-sub='${subId}']`);

    const total = $perms.length;
    const checked = $perms.filter(':checked').length;

    $subCheck.prop('checked', checked === total);
    $subCheck.prop('indeterminate', checked > 0 && checked < total);
}

function updateCategoryCheck(catId, mode = '') {
    const $subs = $(`.subcat-check[data-mode='${mode}'][data-cat='${catId}']`);
    const $catCheck = $(`.cat-check[data-mode='${mode}'][data-cat='${catId}']`);

    const total = $subs.length;
    const checked = $subs.filter(':checked').length;
    const indet = $subs.filter(function () {
      return this.indeterminate;
    }).length;

    $catCheck.prop('checked', checked === total);
    $catCheck.prop('indeterminate', (checked > 0 && checked < total) || indet > 0);
}

function updateIndeterminate(catId, mode = '') {
    $(`.subcat-check[data-mode='${mode}'][data-cat='${catId}']`).each(function () {
        updateSubcategoryCheck($(this).data('sub'), mode);
    });
    updateCategoryCheck(catId, mode);
}

function slugify(text) {
    return text.toString().toLowerCase().replace(/\s+/g, '_').replace(/[^\w\-]+/g, '');
}

function loadEditRole(roleId) {
  $('#idEditRole').val(roleId);
  $.ajax({
    url: url_api + `/role/id/${roleId}`,
    method: 'GET',
    headers: {
      'X-Client-Domain': myDomain,
      'Authorization': `Bearer ${window.token}`
    },
    success: function (data) {

      $('#kodeEdit').val(data.code);
      $('#namaEdit').val(data.name);
      $('#levelEdit').val(data.level);

      // Render ulang pohon permissions dengan checkbox yang sesuai
      loadPermissionsTree('Edit', data.permissions);
    },
    error: function (xhr) {
      alert('Gagal memuat data role');
      console.error(xhr.responseText);
    }
  });
}

function loadTree(index = null, box = 'boxTree') {
  $.ajax({
    url: url_api + '/role/datatable?limit=100',
    type: 'GET',
    headers: {
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    success: function (response) {
        const roles = response.data || [];
        const grouped = {};

        roles.forEach(role => {
          if (!grouped[role.level]) grouped[role.level] = [];
          grouped[role.level].push(role);
        });

        const rolesTree = $(`#${box}`);
        rolesTree.empty();

        const levels = Object.keys(grouped).sort((a, b) => a - b);

        levels.forEach((level, indexLevel) => {
          const levelWrapper = $('<div class="w-100 text-center position-relative"></div>');

          if (indexLevel > 0) {
            const connector = $('<div class="role-connector"></div>').css({
              height: '20px',
              top: '-20px'
            });
            levelWrapper.append(connector);
          }

          const levelContainer = $('<div class="role-level"></div>');
          grouped[level].forEach(role => {
            let badgeClass = 'badge rounded-pill px-4 py-2 ';

            if (index === null) {
              badgeClass += 'bg-primary bg-glow';
            } else {
              badgeClass += (role.noindex === index) ? 'bg-primary bg-glow' : 'badge-outline-primary';
            }

            const badge = $(`<span class="${badgeClass}">${role.nama_role}</span>`);
            levelContainer.append(badge);
          });

          levelWrapper.append(levelContainer);
          rolesTree.append(levelWrapper);
        });

        if (box === 'boxTree') { $('#modalLevel').modal('show'); }
    },
    error: function (xhr) {
      console.error('Gagal memuat roles:', xhr.responseJSON?.message || xhr.statusText);
    }
  });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ proses ~~~~~~~~~~~~~~~~~~~~~~~~~~~
$('#sbmTambahRole').on('click', function (e) {
    e.preventDefault();

    const roleCode = $('#kode').val();
    const roleName = $('#nama').val();
    const roleLevel = $('#level').val();
    const permissions = $('#modalTambahRole .perm-check:checked').map(function () {
      return $(this).val();
    }).get();

    if (!roleName || permissions.length === 0) {
        notif.fire({
          icon: 'error',
          text: 'Input Code, Name, and at least choose one permission'
        });
      return;
    }

    $.ajax({
      url: url_api + '/role',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        kode: roleCode,
        nama: roleName,
        level: roleLevel,
        permissions: permissions
      }),
      headers: {
        'X-Client-Domain': myDomain,
        'Authorization': `Bearer ${window.token}`,
      },
      success: function (response) {
        $('#modalTambahRole .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        $('#modalTambahRole .modal-body').find('#permissionsContainer').empty();
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            tableRole.clear().draw();
            loadMoreData();
            loadPermissionsTree();
        });
      },
      error: function (xhr) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
      }
    });
});

$('#sbmEditRole').on('click', function (e) {
    e.preventDefault();

    const roleID = $('#idEditRole').val();
    const roleCode = $('#kodeEdit').val();
    const roleName = $('#namaEdit').val();
    const roleLevel = $('#levelEdit').val();
    const permissions = $('#modalEditRole .perm-check:checked').map(function () {
      return $(this).val();
    }).get();

    if (!roleName || permissions.length === 0) {
        notif.fire({
          icon: 'error',
          text: 'Input Code, Name, and at least choose one permission'
        });
      return;
    }

    $.ajax({
      url: url_api + '/role/' + roleID,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        kode: roleCode,
        nama: roleName,
        level: roleLevel,
        permissions: permissions
      }),
      headers: {
        'X-Client-Domain': myDomain,
        'Authorization': `Bearer ${window.token}`,
      },
      success: function (response) {
        $('#modalEditRole .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        $('#modalEditRole .modal-body').find('#permissionsContainerEdit').empty();
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            tableRole.clear().draw();
            loadMoreData();
            // loadPermissionsTree();
            loadEditRole(roleID);
        });
      },
      error: function (xhr) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
      }
    });
});

$('#sbmHapusRole').click(function (e) {
  e.preventDefault();

  const id = $('#idHapusRole').val();

  $.ajax({
    url: url_api + '/role/' + id,
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
            tableRole.clear().draw();
            loadMoreData();
        });
        $('#modalHapusRole').modal('hide'); 
    },
    error: function (xhr) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
    },
  });
});

$('#activateBtnRole').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/role/set-status',
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
            tableRole.clear().draw();
            loadMoreData();
        });
        $('#modalDetailRole').modal('hide'); 
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

$('#deactivateBtnRole').click(function (e) {
  e.preventDefault();

  var id = $(this).data('id');

  $.ajax({
    url: url_api + '/role/set-status',
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
            tableRole.clear().draw();
            loadMoreData();
        });
        $('#modalDetailRole').modal('hide'); 
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