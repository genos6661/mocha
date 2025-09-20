let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "kode";
let orderDir = "asc";
let resetOffset = false;
let userPermissions = [];
$(document).ready(function() {
    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: 'Account'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;

            if(permissions.includes('account')) {
                initTable();
                initEvents();
                loadMoreData();
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelKlas tbody').append(`<tr><td class="text-center" colspan="4">Data Not Available</td></tr>`);
            }
            initSubModule();
            initMasterModule();
            initModuleAkun();
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
    table = new DataTable("#tabelKlas", {
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
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                    if(userPermissions.includes('edit_classification')) {
                        return `
                              <a class="btn btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="modal" data-bs-target="#modalEditKlas" data-id="` + data.kode + `"><i class="icon-base ti tabler-edit icon-22px"></i></a>
                        `;
                    } else { return ''; }
                }
            }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["kode", "nama", "alias", ""];
        orderColumn = columnMapping[columnIndex] || "kode";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    let searchInput = document.querySelector(".filterKlas input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(url_api + `/akun/klasifikasi?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
            document.querySelector("#totalKlas").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoading = false;
        });
}

function initEvents() {
    document.querySelector(".filterKlas input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearch) {
            lastSearch = searchValue;
            offset = 0;
            loadMoreData(true);
        }
    });

    document.querySelector("#tabelKlas_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });
}

// modal
const modalEditKlas = document.getElementById('modalEditKlas')
modalEditKlas.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEditKlas').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/akun/klasifikasi/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            $('#idKlas').val(response.kode);
            $('#kodeKlas').val(response.kode);
            $('#namaKlas').val(response.nama);
            $('#aliasKlas').val(response.alias);

            $('#modalEditKlas').modal('show');
        },
        error: function(xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        }
    });
});

$('#sbmEditKlas').click(function (e) {
    e.preventDefault(); 
    const id = $('#idKlas').val();
      
    const formData = {
        nama: $('#namaKlas').val(),
        alias: $('#aliasKlas').val(),
    };

    $.ajax({
        url: url_api + '/akun/klasifikasi/' + id,
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(formData), 
        success: function (response) {
            $('#modalEditKlas .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
            notif.fire({
              icon: 'success',
              text: response.message
            }).then((result) => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
            });
            $('#modalEditKlas').modal('hide'); 
        },
        error: function (xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});