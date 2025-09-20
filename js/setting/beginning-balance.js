let currentFilters = {};
let table;
let offset = 0;
let limit = 50;
let isLoading = false;
let lastSearch = "";
let orderColumn = "kode";
let orderDir = "asc";
let userPermissions = [];
$(document).ready(function() {
    $('#filterCabang').select2({
        ajax: {
          url: url_api + '/cabang/select2',
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
        placeholder: 'All Branchs',
        allowClear: true
    });

    $('#cabang').select2({
        dropdownParent: "#modalTambah",
        ajax: {
          url: url_api + '/cabang/select2',
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
        placeholder: 'Choose Branch'
    });

    $('#cabangEdit').select2({
        dropdownParent: "#modalEdit",
        ajax: {
          url: url_api + '/cabang/select2',
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
        placeholder: 'Choose Branch'
    });

    $('#valas').select2({
        dropdownParent: "#modalTambah",
        ajax: {
          url: url_api + '/forex/select2',
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
        placeholder: 'Choose Forex'
    });

    $('#valasEdit').select2({
        dropdownParent: "#modalEdit",
        ajax: {
          url: url_api + '/forex/select2',
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
        placeholder: 'Choose Forex'
    });

    $('#filterCabang').on('change', function (e) {
        e.preventDefault();
        const valCabang = $(this).val();
        if (valCabang && valCabang !== null) {
            currentFilters.cabang = valCabang;
        } else {
            currentFilters = {};
        }
        loadMoreDataAkun(true);
        setTimeout(function () {
            updateTotalDebitKredit();
        }, 1000);
    });

    initTableAkun();
    initEventsAkun();
    loadMoreDataAkun(true);
    setTimeout(function () {
        updateTotalDebitKredit();
    }, 1000);

    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: 'Beginning Balance'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('add_forex_bb')) {
                $('#btnModalTambah').attr('disabled', true);
            }

            if(permissions.includes('forex_bb')) {
                initTable();
                initEvents();
                loadMoreData(true);
                if (!permissions.includes('edit_forex_bb')) {
                    $('#editBtn').attr('disabled', true);
                }
                if(!permissions.includes('delete_forex_bb')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data forex'
                });
                $('#tabelValas tbody').append(`<tr><td class="text-center" colspan="6">Data Not Available</td></tr>`);
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

});

// FOREX BB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function initTable() {
    table = new DataTable("#tabelValas", {
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
            { data: "kode", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "nama_cabang", orderable: true, className: "nowrap" },
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
                data: "saldo_awal", 
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
                    if(userPermissions.includes('edit_forex_bb') || userPermissions.includes('delete_forex_bb')) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_forex_bb')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.index_details}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_forex_bb')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.index_details}" data-ref="${data.kode}">Delete</a>
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
            { data: "index_details", visible: false }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["kode", "nama", "nama_cabang", "rate", "saldo_awal"];
        orderColumn = columnMapping[columnIndex] || "kode";
        orderDir = direction;

        loadMoreData(true);
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        $('#tabelValas').DataTable().columns.adjust().draw();
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";
    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(`${url_api}/beginning-balance/forex?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
            let arrDisplay = valasDisplayed.split(",").map(Number);
            if (arrDisplay.length == 0 || valasDisplayed == '') {
                $('#displayAllValas').removeAttribute('checked');
            } if (arrDisplay.length >= response.recordsTotal) {
                $('#displayAllValas').prop('checked', true);
                console.log('full');
            } else {
                $('#displayAllValas').prop('indeterminate', true);
            }
        }
        isLoading = false;
        // document.querySelector("#totalValas").textContent = response.recordsTotal;
    })
    .catch(() => {
        isLoading = false;
    });
}

function initEvents() {
    document.querySelector(".filtertabel input").addEventListener("keyup", function () {
        const searchValue = this.value;
        if (searchValue !== lastSearch) {
            lastSearch = searchValue;
            offset = 0;
            loadMoreData(true);
        }
    });

    document.querySelector("#tabelValas_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });
}

$('#tabelValas tbody').on('dblclick', 'tr', function () {
    var rowData = table.row(this).data();
    if (!rowData) return; 

    var id = rowData.index_details;

    $.ajax({
        url: url_api + `/beginning-balance/forex-details/${id}`,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (data) {
            $('.dataDetail').text('');
            $('#kodeDetail').text(data.kode_valas);
            $('#namaDetail').text(data.nama_valas);
            $('#cabangDetail').text(data.nama_cabang);
            $('#rateDetail').text("Rp " + parseFloat(data.rate).toLocaleString("id-ID"));
            $('#stokDetail').text(parseFloat(data.beli).toLocaleString("id-ID"));
            $('#editBtn').attr('data-id', id);
            $('#deleteBtn').attr('data-id', id).attr('data-ref', data.kode_valas);
            $('#modalDetail').modal('show');
        },
        error: function (err) {
            console.error('Gagal mengambil data detail:', err);
            alert('Terjadi kesalahan saat mengambil detail data.');
        }
    });
});

$('#sbmTambahForex').click(function (e) {
      e.preventDefault();

      const formData = {
        cabang: $('#cabang').val(),
        valas: $('#valas').val(),
        stok: $('#stok').val(),
        rate: $('#rate').val(),
      };
      $.ajax({
        url: url_api + '/beginning-balance/forex', 
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
            $('#valas, #cabang').val(null).trigger('change');
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

$('#sbmEditForex').click(function (e) {
      e.preventDefault(); 
      const id = $('#idEdit').val();
      
      const formData = {
        valas: $('#valasEdit').val(),
        cabang: $('#cabangEdit').val(),
        stok: $('#stokEdit').val(),
        rate: $('#rateEdit').val(),
      };

      $.ajax({
        url: url_api + '/beginning-balance/forex/' + id,
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
            $('#valasEdit, #cabangEdit').val(null).trigger('change');
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
        url: url_api + '/beginning-balance/forex/' + id,
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

const modalEditForex = document.getElementById('modalEdit')
modalEditForex.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/beginning-balance/forex-details/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            $('#idEdit').val(id);
            $('#cabangEdit').val(response.cabang);
            $('#valasEdit').val(response.valas);
            $('#stokEdit').val(response.beli);
            $('#rateEdit').val(response.rate);

            if (response.cabang && response.cabang != 0) {
                const option = new Option(response.kode_cabang + ' - ' + response.nama_cabang, response.cabang, true, true);
                $('#cabangEdit').append(option).trigger('change');
            }

            if (response.valas && response.valas != 0) {
                const option = new Option(response.kode_valas + ' - ' + response.nama_valas, response.valas, true, true);
                $('#valasEdit').append(option).trigger('change');
            }

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

// ACCOUNT BB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let tableAkun;
let offsetAkun = 0;
let limitAkun = 50;
let isLoadingAkun = false;
let lastSearchAkun = "";
let orderColumnAkun = "a.kode";
let orderDirAkun = "asc";

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
            { data: "kode", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { 
                data: "debit", 
                orderable: true, 
                className: "nowrap",
                render: function(data, type, row, meta) {
                    return `<input type="number" class="saldo-debit form-control text-end" data-kolom="debit" data-kode="${row.kode}" value="${data}" readonly>`;
                },
            },
            { 
                data: "kredit", 
                orderable: true, 
                className: "nowrap",
                render: function(data, type, row, meta) {
                     return `<input type="number" class="saldo-kredit form-control text-end" data-kolom="kredit" data-kode="${row.kode}" value="${data}" readonly>`;
                },
            },
            { data: "index_jurnal", visible: false }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    // Order event
    tableAkun.on("order.dt", function () {
        let order = tableAkun.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["a.kode", "a.nama", "j.debit", "j.kredit"];
        orderColumnAkun = columnMapping[columnIndex] || "a.kode";
        orderDirAkun = direction;

        loadMoreDataAkun(true);
    });
}

function loadMoreDataAkun(reset = false) {
    if (isLoadingAkun) return;
    isLoadingAkun = true;

    if (reset) {
      orderDirAkun = "asc";
    }

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";

    const params = new URLSearchParams();
    params.append("offset", reset ? 0 : offsetAkun);
    params.append("limit", limitAkun);
    params.append("search", searchValue);
    params.append("order_column", orderColumnAkun);
    params.append("order_dir", orderDirAkun);

    for (const key in currentFilters) {
      params.append(key, currentFilters[key]);
    }

    fetch(`${url_api}/beginning-balance/accounts?${params.toString()}`, {
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
        // document.querySelector("#totalValas").textContent = response.recordsTotal;
    })
    .catch(() => {
        isLoadingAkun = false;
    });

    tableAkun.on('draw', function () {
        if (currentFilters.cabang && userPermissions.includes('account_bb')) {
            $('input.saldo-debit, input.saldo-kredit').removeAttr('readonly');
            $('#sbmAkun').removeAttr('disabled');
        } else {
            $('input.saldo-debit, input.saldo-kredit').attr('readonly', true);
            $('#sbmAkun').attr('disabled', true);
        }
    });
}

// Event listeners
function initEventsAkun() {
    document.querySelector(".filtertabelAkun input").addEventListener("keyup", function () {
        const searchValue = this.value;
        if (searchValue !== lastSearchAkun) {
            lastSearchAkun = searchValue;
            offsetAkun = 0;
            loadMoreDataAkun(true);
        }
    });

    document.querySelector("#tabelAkun_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 60) {
            loadMoreDataAkun();
        }
    });
}

$('#sbmAkun').click(function (e) {
    e.preventDefault();

    const cabang = $('#filterCabang').val();

    if (!cabang) {
        notif.fire({
            icon: 'warning',
            text: 'Pilih cabang terlebih dahulu'
        });
        return;
    }

    const data = [];

    $('#tabelAkun input.saldo-debit').each(function () {
        const kode = $(this).data('kode');
        const debit = parseFloat($(this).val()) || 0;

        const kreditInput = $('#tabelAkun input.saldo-kredit[data-kode="' + kode + '"]');
        const kredit = parseFloat(kreditInput.val()) || 0;

        if (debit !== 0 || kredit !== 0) {
            data.push({ kode, debit, kredit });
        }
    });

    const formData = {
        cabang: cabang,
        data: data
    };

    $.ajax({
        url: url_api + '/beginning-balance/account',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(formData),
        success: function (response) {
            $('#filterCabang').val(null).trigger('change');

            notif.fire({
                icon: 'success',
                text: response.message
            }).then((result) => {
                loadMoreDataAkun(true);
            });
        },
        error: function (xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON?.message || 'Gagal menyimpan saldo awal'
            });
        }
    });
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).on('input', '.saldo-debit, .saldo-kredit', function () {
    updateTotalDebitKredit();
});

function updateTotalDebitKredit() {
    let totalDebit = 0;
    let totalKredit = 0;

    $('.saldo-debit').each(function () {
        totalDebit += parseFloat($(this).val()) || 0;
    });

    $('.saldo-kredit').each(function () {
        totalKredit += parseFloat($(this).val()) || 0;
    });

    if(totalDebit != totalKredit) {
        $('#footerNote').html(`<span class="text-danger fst-italic">Debit & Credit Do Not Balance</span>`);
    } else {
        $('#footerNote').html('');
    }
    $('#totalDebit').val(totalDebit.toFixed(2));
    $('#totalKredit').val(totalKredit.toFixed(2));
}