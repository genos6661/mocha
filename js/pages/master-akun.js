let tableAkun;
let offsetAkun = 0;
let limitAkun = 20;
let isLoadingAkun = false;
let lastSearchAkun = "";
let orderColumnAkun = "kode";
let orderDirAkun = "asc";
let resetOffsetAkun = false;

function initModuleAkun() {
    if(!userPermissions.includes('add_account')) {
        $('#btnTambahAkun').attr('disabled', true);
    }

    if(userPermissions.includes('account')) {
        initTableAkun();
        initEventsAkun();
        loadMoreDataAkun();
        if (!userPermissions.includes('edit_account')) {
            $('#activateBtnAkun, #deactivateBtnAkun, #editBtnAkun').attr('disabled', true);
        }
        if(!userPermissions.includes('delete_account')) {
            $('#deleteBtnAkun').attr('disabled', true);
        }
    }

    $('#masterAkun').select2({
        dropdownParent: $('#modalTambahAkun'),
        ajax: {
          url: url_api + '/akun/master/select2',
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
        placeholder: 'Choose Master Account'
    });

    $('#masterAkunEdit').select2({
        dropdownParent: $('#modalEditAkun'),
        ajax: {
          url: url_api + '/akun/master/select2',
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
        placeholder: 'Choose Master Account'
    });
}

$('#bank').on('change', function () {
  if ($(this).is(':checked')) {
    $('#kas').prop('checked', true);
  }
});

$('#kas').on('change', function () {
  if (!$(this).is(':checked')) {
    $('#bank').prop('checked', false);
  }
});

$('#bankEdit').on('change', function () {
  if ($(this).is(':checked')) {
    $('#kasEdit').prop('checked', true);
  }
});

$('#kasEdit').on('change', function () {
  if (!$(this).is(':checked')) {
    $('#bankEdit').prop('checked', false);
  }
});

function initTableAkun() {
    tableAkun = new DataTable("#tabelAkun", {
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
            { data: "kode", orderable: true, className: "nowrap" },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "alias", orderable: true },
            { data: "nama_subklas", orderable: true },
            { data: "master", orderable: true },
            { 
                data: "kas",
                orderable: true,
                className: "text-end",
                render: function(data, type, row) {
                    return data == 1
                        ? '<i class="icon-base ti tabler-check icon-22px"></i>'
                        : '';
                }
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
                    if(userPermissions.includes('edit_account') || userPermissions.includes('delete_account')) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_account')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEditAkun" data-id="${data.kode}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_account')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalHapusAkun" data-id="${data.kode}" data-ref="${data.nama}">Delete</a>
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
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
        createdRow: function (row, data, dataIndex) {
          $(row).addClass('cursor-pointer').attr('title', 'Double Click to show details');
        },
    });

    tableAkun.on("order.dt", function () {
        let order = tableAkun.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["kode", "nama", "alias", "subklas", "master_akun", "kas", "aktif", ];
        orderColumnAkun = columnMapping[columnIndex] || "kode";
        orderDirAkun = direction;

        resetOffsetAkun = true;
        loadMoreDataAkun(true);
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        tableAkun.columns.adjust().draw();
    });
}


function loadMoreDataAkun(reset = false) {
    if (isLoadingAkun) return;
    isLoadingAkun = true;

    let searchInput = document.querySelector(".filterAkun input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumnAkun}&order_dir=${orderDirAkun}`;

    fetch(url_api + `/akun/akun?offset=${reset ? 0 : offsetAkun}&limit=${limitAkun}&search=${searchValue}${orderParam}`, {
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
                offsetAkun = reset ? limitAkun : offsetAkun + limitAkun;
                if (reset) {
                    tableAkun.clear().rows.add(response.data).draw();
                } else {
                    tableAkun.rows.add(response.data).draw(false);
                }
            }
            isLoadingAkun = false;
            document.querySelector("#totalAkun").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoadingAkun = false;
        });
}

function initEventsAkun() {
    document.querySelector(".filterAkun input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearchAkun) {
            lastSearchAkun = searchValue;
            offsetAkun = 0;
            loadMoreDataAkun(true);
        }
    });

    document.querySelector("#tabelAkun_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreDataAkun();
        }
    });

    $('#tabelAkun tbody').on('dblclick', 'tr', function () {
        var rowData = tableAkun.row(this).data();
        if (!rowData) return; 

        var id = rowData.kode;

        $.ajax({
            url: url_api + `/akun/akun/${id}`,
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
                    $('#statusDetailAkun').html('<span class="badge bg-label-success">Active</span>');
                    $('#deactivateBtnAkun').removeClass('d-none');
                    $('#activateBtnAkun').addClass('d-none');
                } else {
                    $('#statusDetailAkun').html('<span class="badge bg-label-danger">Inactive</span>');
                    $('#activateBtnAkun').removeClass('d-none');
                    $('#deactivateBtnAkun').addClass('d-none');
                }
                $('.dataDetailAkun').text('');
                $('#kodeDetailAkun').text(data.kode);
                $('#namaDetailAkun').text(data.nama);
                $('#aliasDetailAkun').text(data.alias);
                $('#masterDetailAkun').text(data.nama_master);
                $('#klasDetailAkun').text(data.nama_klas);
                $('#subklasDetailAkun').text(data.nama_subklas);
                $('#activateBtnAkun').attr('data-id', id);
                $('#deactivateBtnAkun').attr('data-id', id);
                $('#editBtnAkun').attr('data-id', id);
                $('#deleteBtnAkun').attr('data-id', id).attr('data-ref', data.nama);
                $('#modalDetailAkun').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

$('#modalTambahAkun').on('shown.bs.modal', function (e) {
    $('#kodeAkun').trigger('focus');
});

const modalEditAkun = document.getElementById('modalEditAkun')
modalEditAkun.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEditAkun').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/akun/akun/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            $('#idAkunEdit').val(id);
            $('#kodeAkunEdit').val(response.kode);
            $('#namaAkunEdit').val(response.nama);
            $('#aliasAkunEdit').val(response.alias);

            if (response.master_akun) {
                const option = new Option(response.master_akun + ' - ' + response.nama_master, response.master_akun, true, true);
                $('#masterAkunEdit').append(option).trigger('change');
            }
            
            $('#kasEdit').prop('checked', response.kas == 1);
            $('#bankEdit').prop('checked', response.bank == 1);

            $('#modalEditAkun').modal('show');
        },
        error: function(xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        }
    });
});

const modalHapusAkun = document.getElementById('modalHapusAkun')
modalHapusAkun.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idHapusAkun').val(id);
    $('#refHapusAkun').text(ref);
    $('#sbmHapusAkun').trigger('focus');
});


// proses
$('#sbmTambahAkun').click(function (e) {
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
  e.preventDefault();

  const formData = {
    kode: $('#kodeAkun').val(),
    nama: $('#namaAkun').val(),
    alias: $('#aliasAkun').val(),
    master: $('#masterAkun').val(),
    kas: $('#kas').is(':checked') ? 1 : 0,
    bank: $('#bank').is(':checked') ? 1 : 0,
  };
  $.ajax({
    url: url_api + '/akun/akun', 
    type: 'POST',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData), 
    success: function (response) {
        $('#modalTambahAkun .modal-body').find('input, textarea').val('').prop('checked', false);
        $('#modalTambahAkun .modal-body').find('select').val(null).trigger('change');
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offsetAkun = 0;
            tableAkun.clear().draw();
            loadMoreDataAkun();
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
    },
    error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
    },
  });
});

$('#sbmEditAkun').click(function (e) {
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
  e.preventDefault();
  const id = $('#idAkunEdit').val();
  const formData = {
    kode: $('#kodeAkunEdit').val(),
    nama: $('#namaAkunEdit').val(),
    alias: $('#aliasAkunEdit').val(),
    master: $('#masterAkunEdit').val(),
    kas: $('#kasEdit').is(':checked') ? 1 : 0,
    bank: $('#bankEdit').is(':checked') ? 1 : 0,
  };
  $.ajax({
    url: url_api + '/akun/akun/' + id, 
    type: 'PUT',
    contentType: 'application/json',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData), 
    success: function (response) {
        $('#modalEditAkun .modal-body').find('input, textarea').val('').prop('checked', false);
        $('#modalEditAkun .modal-body').find('select').val(null).trigger('change');
        $('#modalEditAkun').modal('hide');
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offsetAkun = 0;
            tableAkun.clear().draw();
            loadMoreDataAkun();
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
    },
    error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
    },
  });
});

$('#sbmHapusAkun').click(function (e) {
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
    e.preventDefault();

    const id = $('#idHapusAkun').val();

    $.ajax({
        url: url_api + '/akun/akun/' + id,
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
                offsetAkun = 0;
                tableAkun.clear().draw();
                loadMoreDataAkun();
            });
            $('#modalHapusAkun').modal('hide'); 
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
        error: function (xhr) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        }
    });
});

$('#activateBtnAkun').click(function (e) {
    e.preventDefault();

    var id = $(this).data('id');

    $.ajax({
        url: url_api + '/akun/set-status',
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
                offsetAkun = 0;
                tableAkun.clear().draw();
                loadMoreDataAkun();
            });
            $('#modalDetailAkun').modal('hide'); 
        },
        error: function (xhr) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});

$('#deactivateBtnAkun').click(function (e) {
    e.preventDefault();

    var id = $(this).data('id');

    $.ajax({
        url: url_api + '/akun/set-status',
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
                offsetAkun = 0;
                tableAkun.clear().draw();
                loadMoreDataAkun();
            });
            $('#modalDetailAkun').modal('hide'); 
        },
        error: function (xhr) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});