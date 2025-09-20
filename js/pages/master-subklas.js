let tableSub;
let offsetSub = 0;
let limitSub = 20;
let isLoadingSub = false;
let lastSearchSub = "";
let orderColumnSub = "kode";
let orderDirSub = "asc";
let resetOffsetSub = false;

function initSubModule() {
    if(userPermissions.includes('account')) {
        initTableSub();
        initEventsSub();
        loadMoreDataSub();
    }
}

function initTableSub() {
    tableSub = new DataTable("#tabelSubklas", {
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
            { data: "kode", orderable: true, className: "nowrap", title: "code" },
            { data: "nama_klasifikasi", orderable: true, className: "nowrap", title: "classification" },
            { data: "nama", orderable: true, className: "nowrap", title: "name" },
            { data: "alias", orderable: true, title: "alias" },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                    if(userPermissions.includes('edit_subclass')) {
                        return `
                              <a href="javascript:;" class="btn btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="modal" data-bs-target="#modalEditSubklas" data-id="` + data.kode + `"><i class="icon-base ti tabler-edit icon-22px"></i></a>
                        `;
                    } else { return ''; }
                },
                title: ""
            }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    tableSub.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["kode", "klasifikasi", "nama", "alias", ""];
        orderColumnSub = columnMapping[columnIndex] || "kode";
        orderDirSub = direction;

        resetOffsetSub = true;
        loadMoreDataSub(true);
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        tableSub.columns.adjust().draw();
    });
}

function loadMoreDataSub(reset = false) {
    if (isLoadingSub) return;
    isLoadingSub = true;

    let searchInput = document.querySelector(".filterSubklas input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumnSub}&order_dir=${orderDirSub}`;

    fetch(url_api + `/akun/sub-klasifikasi?offset=${reset ? 0 : offsetSub}&limit=${limitSub}&search=${searchValue}${orderParam}`, {
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
                offsetSub = reset ? limitSub : offsetSub + limitSub;
                if (reset) {
                    tableSub.clear().rows.add(response.data).draw();
                } else {
                    tableSub.rows.add(response.data).draw(false);
                }
            }
            isLoadingSub = false;
            document.querySelector("#totalSubklas").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoadingSub = false;
        });
}

function initEventsSub() {
    document.querySelector(".filterSubklas input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearchSub) {
            lastSearchSub = searchValue;
            offsetSub = 0;
            loadMoreDataSub(true);
        }
    });

    document.querySelector("#tabelSubklas_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreDataSub();
        }
    });
}

// modal
const modalEditSubklas = document.getElementById('modalEditSubklas')
modalEditSubklas.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEditSubklas').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/akun/sub-klasifikasi/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            $('#idSubklas').val(id);
            $('#kodeSubklas').val(response.kode);
            $('#klasSubklas').val(response.klasifikasi);
            $('#namaSubklas').val(response.nama);
            $('#aliasSubklas').val(response.alias);

            $('#modalEditSubklas').modal('show');
        },
        error: function(xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        }
    });
});

$('#sbmEditSubklas').click(function (e) {
    e.preventDefault(); 
    const id = $('#idSubklas').val();
      
    const formData = {
        nama: $('#namaSubklas').val(),
        alias: $('#aliasSubklas').val(),
    };

    $.ajax({
        url: url_api + '/akun/sub-klasifikasi/' + id,
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(formData), 
        success: function (response) {
            $('#modalEditSubklas .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
            notif.fire({
              icon: 'success',
              text: response.message
            }).then((result) => {
                offsetSub = 0;
                tableSub.clear().draw();
                loadMoreDataSub();
            });
            $('#modalEditSubklas').modal('hide'); 
        },
        error: function (xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});