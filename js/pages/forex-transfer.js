let table;
let offset = 0;
let limit = 50;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let userPermissions = [];

$(document).ready(function() {
	$('#from, #to').select2({
    dropdownParent: '#modalTambah',
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
    placeholder: 'Choose Branch',
    allowClear: true
	});

  $('#fromEdit, #toEdit').select2({
    dropdownParent: '#modalEdit',
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
    placeholder: 'Choose Branch',
    allowClear: true
  });

  $('#akunFrom, #akunTo').select2({
    dropdownParent: $('#modalTambah'),
    ajax: {
      url: url_api + '/akun/non-kas/select2',
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
    placeholder: 'Choose Account'
  });

  $('#akunFromEdit, #akunToEdit').select2({
    dropdownParent: $('#modalEdit'),
    ajax: {
      url: url_api + '/akun/non-kas/select2',
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
    placeholder: 'Choose Account'
  });

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
          sub_kategori: 'Forex Transfer'
      },
      traditional: true,
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (permissions) {
          userPermissions = permissions;
          if (!permissions.includes('add_transfer')) {
              $('#btnModalTambah').attr('disabled', true);
          }

          if(permissions.includes('transfer')) {
              initTable();
              initEvents();
              loadMoreData();
              if (!permissions.includes('edit_transfer')) {
                  $('#editBtn').attr('disabled', true);
              }
              if(!permissions.includes('delete_transfer')) {
                  $('#deleteBtn').attr('disabled', true);
              }
          } else {
              notif.fire({
                  icon: 'error',
                  text: 'Insufficient Permission to load data'
              });
              $('#tabelTransfer tbody').append(`<tr><td class="text-center" colspan="8">Data Not Available</td></tr>`);
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
// akhir document ready

function initTable() {
    table = new DataTable("#tabelTransfer", {
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
            { data: "nomor", orderable: true, className: "nowrap" },
            { data: "user", orderable: true, className: "nowrap" },
            { data: "nama_from", orderable: true, className: "nowrap" },
            { data: "nama_to", orderable: true, className: "nowrap" },
            { data: "deskripsi", orderable: false, className: "nowrap" },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                  if(userPermissions.includes('edit_transfer') || userPermissions.includes('delete_transfer')) {
                    let menuHtml = `
                        <div class="dropdown">
                          <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                            <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                    `;

                    if (userPermissions.includes('edit_transfer')) {
                        menuHtml += `
                            <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                        `;
                    }

                    if (userPermissions.includes('delete_transfer')) {
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

    // Order event
    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "tanggal", "nomor", "user", "nama_from", "nama_to", "", ""];
        orderColumn = columnMapping[columnIndex] || "nomor";
        orderDir = direction || "desc";

        loadMoreData(true);
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";
    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(`${url_api}/transfer/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
        isLoading = false;
        document.querySelector("#totalTransfer").textContent = response.recordsTotal;
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
        const searchValue = this.value;
        if (searchValue !== lastSearch) {
            lastSearch = searchValue;
            offset = 0;
            loadMoreData(true);
        }
    });

    document.querySelector("#tabelTransfer_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelTransfer tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/transfer/id/${id}`,
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

              $('.dataDetail').text('');
              $('#nomorDetail').text('#' + data.nomor);
              $('#fromDetail').text(data.nama_from);
              $('#toDetail').text(data.nama_to);
              $('#akunFromDetail').text(
                (data.akun_from?.kode ? data.akun_from.kode + ' - ' + data.akun_from.nama : '')
              );

              $('#akunToDetail').text(
                (data.akun_to?.kode ? data.akun_to.kode + ' - ' + data.akun_to.nama : '')
              );
              $('#tanggalDetail').text(tanggal.toLocaleDateString('en-ID', options));
              $('#userDetail').text(data.user);
              $('#deskripsiDetail').text(data.deskripsi);
              const details = data.details || [];

              const tbody = $('#tabelItemDetail tbody');
              tbody.empty();

              if (details.length === 0) {
                  tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
              } else {
                  let subtotal = 0;

                  details.forEach(function (item) {
                    let qty = 0;

                    if (item.beli !== 0) {
                      qty = item.beli;
                    } else if (item.jual !== 0) {
                      qty = item.jual;
                    }

                    const safeRate = isNaN(item.rate) ? 0 : Number(item.rate);
                    const totalPerItem = qty * safeRate;
                    subtotal += totalPerItem;

                    const row = `
                      <tr>
                        <td>
                          <div class="d-flex flex-column">
                            <a class="text-heading text-truncate">
                              <span class="fw-medium">${item.kode}</span>
                            </a>
                            <small>${item.nama}</small>
                          </div>
                        </td>
                        <td class="text-end">${qty.toLocaleString('id-ID')}</td>
                        <td class="text-end">Rp. ${safeRate.toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}</td>
                        <td class="text-end">Rp. ${totalPerItem.toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}</td>
                      </tr>
                    `;

                    tbody.append(row);
                  });

                  tbody.append(`
                    <tr>
                      <td colspan="3" class="text-end fw-bold">Total : </td>
                      <td class="text-end fw-bold">Rp. ${subtotal.toLocaleString('id-ID', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}</td>
                    </tr>
                  `);
              }
              $('#jurnalBtn').attr('data-id', id).attr('data-ref', data.nomor);
              $('#editBtn').attr('data-id', id);
              $('#deleteBtn').attr('data-id', id).attr('data-ref', data.nomor);
              $('#reprintDetail').attr('href', '/pages/transaction/transfer-receipt.php?number=' + data.nomor);
              $('#modalDetail').modal('show');
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

// akhir datatable

$('#tambahBaris').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1 pt-2">
          <select class="form-select forex"></select>
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control amount text-end">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control rate text-end" min="0">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control subtotal text-end" readonly>
        </td>
        <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#detailBaru tbody').append(baris);

    let $selectForex = baris.find('.forex').first();

    $selectForex.select2({
      dropdownParent: '#modalTambah',
      ajax: {
        url: url_api + '/forex/select2',
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
      placeholder: 'Choose Forex'
    });

    // $selectForex.on('change', function () {
    //     const idForex = $(this).val();
    //     if (!idForex) return;

    //     updateRates(idForex, $inputRate);
    // });
});

$('#tambahBarisEdit').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1 pt-2">
          <select class="form-select forexEdit"></select>
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control amountEdit text-end">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control rateEdit text-end" min="0">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control subtotalEdit text-end" readonly>
        </td>
        <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBarisEdit" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#detailEdit tbody').append(baris);

    let $selectForex = baris.find('.forexEdit').first();

    $selectForex.select2({
      dropdownParent: '#modalEdit',
      ajax: {
        url: url_api + '/forex/select2',
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
      placeholder: 'Choose Forex'
    });

    // $selectForex.on('change', function () {
    //     const idForex = $(this).val();
    //     if (!idForex) return;

    //     updateRates(idForex, $inputRate);
    // });
});

$(document).on('change', 'input[name="tipeTrans"]', function () {
  $('#detailBaru tbody').empty();
  if ($(this).val() === 'tipeForex' || $(this).val() === 'tipeBoth') {
    $('#boxTabelDetail, #boxNewRow').removeClass('d-none');
    $('#boxRupiah').addClass('d-none');
  } else {
    $('#boxTabelDetail, #boxNewRow').addClass('d-none');
    $('#boxRupiah').removeClass('d-none');
  }
});

$('#tipeForexEdit, #tipeBothEdit').on('change', function () {
  if (this.checked) {
    $('#boxDetailEdit, #boxNewRowEdit').removeClass('d-none');
    $('#boxRupiahEdit').addClass('d-none');
    $('#checkboxTarget').prop('checked', false); // misalnya uncheck
  }
});

// kalau pilih Rupiah
$('#tipeRupiahEdit').on('change', function () {
  if (this.checked) {
    $('#boxDetailEdit, #boxNewRowEdit').addClass('d-none');
    $('#boxRupiahEdit').removeClass('d-none');
    $('#checkboxTarget').prop('checked', true); // misalnya otomatis centang
  }
});

$('#detailBaru').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
    updateTotal();
});

$('#detailEdit').on('click', '.btnHapusBarisEdit', function () {
    $(this).closest('tr').remove();
    updateTotalEdit();
});

$('#detailBaru').on('input', '.amount, .rate', function () {
  let $row = $(this).closest('tr');
  let amount = parseFloat($row.find('.amount').val()) || 0;
  let rate = parseFloat($row.find('.rate').val()) || 0;
  let subtotal = amount * rate;
  $row.find('.subtotal').val(subtotal.toFixed(2));
  updateTotal();
});

$('#detailEdit').on('input', '.amountEdit, .rateEdit', function () {
  let $row = $(this).closest('tr');
  let amount = parseFloat($row.find('.amountEdit').val()) || 0;
  let rate = parseFloat($row.find('.rateEdit').val()) || 0;
  let subtotal = amount * rate;
  $row.find('.subtotalEdit').val(subtotal.toFixed(2));
  updateTotalEdit();
});

function updateTotal() {
    let totalAmount = 0;
    let totalSub = 0;

    $('.amount').each(function () {
        totalAmount += parseFloat($(this).val()) || 0;
    });

    $('.subtotal').each(function () {
        totalSub += parseFloat($(this).val()) || 0;
    });

    $('#totalAmount').val(totalAmount.toFixed(2));
    $('#totalSub').val(totalSub.toFixed(2));
}

function updateTotalEdit() {
    let totalAmount = 0;
    let totalSub = 0;

    $('.amountEdit').each(function () {
        totalAmount += parseFloat($(this).val()) || 0;
    });

    $('.subtotalEdit').each(function () {
        totalSub += parseFloat($(this).val()) || 0;
    });

    $('#totalAmountEdit').val(totalAmount.toFixed(2));
    $('#totalSubEdit').val(totalSub.toFixed(2));
}

const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);
    $('#cabangEdit, #akunEdit').val(null).trigger('change');

    $.ajax({
        url: url_api + `/transfer/id/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            const dateObj = new Date(response.tanggal);

            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');

            const formattedDate = `${yyyy}-${mm}-${dd}`;
            $('#inputTanggal').val(formattedDate);

            $('#idEdit').val(id);
            $('#tanggalEdit').val(response.tanggal);
            $('#nomorEdit').text("#" + response.nomor);
            $('#tanggalEdit').val(formattedDate);
            $('#deskripsiEdit').val(response.deskripsi);
            
            const details = response.details || [];

            const tbody = $('#detailEdit tbody');
            tbody.empty();

            let foundRp = false;

            if (details.length === 0) {
              tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
            } else {
              let subtotal = 0;
              let totalAmount = 0;

              details.forEach(function (item) {
                let qty = 0;

                if (item.beli !== 0) {
                  qty = item.beli;
                } else if (item.jual !== 0) {
                  qty = item.jual;
                }

                const safeRate = isNaN(item.rate) ? 0 : Number(item.rate);
                const totalPerItem = qty * safeRate;
                subtotal += totalPerItem;
                totalAmount += qty;
                if (item.kode === "Rp") { foundRp = true; }
                const row = $(`
                    <tr>
                      <td class="px-1 pt-2">
                        <select class="form-select forexEdit" data-init-value="${item.valas}" data-init-text="${item.kode} - ${item.nama}">
                          <option value="${item.valas}">${item.kode} - ${item.nama}</option>
                        </select>
                      </td>
                      <td class="px-1 pt-2"><input type="number" class="form-control amountEdit text-end" value="${qty}" /></td>
                      <td class="px-1 pt-2"><input type="number" class="form-control rateEdit text-end" value="${safeRate}" /></td>
                      <td class="px-1 pt-2"><input type="number" class="form-control subtotalEdit text-end" value="${totalPerItem}" readonly /></td>
                      <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBarisEdit" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
                    </tr>
                `);
                let selectForex = row.find('.forexEdit').first();
                // let $inputRate = row.find('.rate').first();
                // let $inputJumlah = row.find('.jumlah').first();
                // let $inputSubtotal = row.find('.subtotal').first();
                initSelect2Valas(selectForex);
                tbody.append(row);
                $('#totalSubEdit').val(subtotal);
                $('#totalAmountEdit').val(totalAmount);

                // selectForex.on('change', function () {
                //       const idForex = $(this).val();
                //       if (!idForex) return;

                //       updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal);
                // });
                $('#valRupiahEdit').val(qty);
              });

            if (foundRp) {
              $('#tipeRupiahEdit').prop('checked', true);
              $('#boxDetailEdit').addClass('d-none');
              $('#boxRupiahEdit').removeClass('d-none');
              $('#boxNewRowEdit').addClass('d-none');
            } else {
              $('#tipeForexEdit').prop('checked', true);
              $('#boxDetailEdit').removeClass('d-none');
              $('#boxRupiahEdit').addClass('d-none');
              $('#boxNewRowEdit').removeClass('d-none');
            }

            if (response.cabang && response.cabang != 0) {
              const option = new Option(response.kode_from + " - " + response.nama_from, response.cabang, true, true);
              $('#fromEdit').append(option).trigger('change');
            }

            if (response.cabang2 && response.cabang2 != 0) {
              const option = new Option(response.kode_to + " - " + response.nama_to, response.cabang2, true, true);
              $('#toEdit').append(option).trigger('change');
            }

            if (response.akun_from) {
              const option = new Option(response.akun_from.kode + " - " + response.akun_from.nama, response.akun_from.kode, true, true);
              $('#akunFromEdit').append(option).trigger('change');
            }

            if (response.akun_to) {
              const option = new Option(response.akun_to.kode + " - " + response.akun_to.nama, response.akun_to.kode, true, true);
              $('#akunToEdit').append(option).trigger('change');
            }

            $('#modalEdit').modal('show');
          }
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

const modalJurnal = document.getElementById('modalJurnal')
modalJurnal.addEventListener('shown.bs.modal', event => {
  const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    const ref = button.getAttribute('data-ref');

    $('#refJurnal').text(ref);

    $.ajax({
        url: url_api + '/kas/jurnal/' + id, 
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            let tbody = $('#tabelJurnal tbody');
      tbody.empty();
      $('#totalDebit, #totalKredit').empty();
      let totalDebit = 0;
      let totalKredit = 0;

      response.forEach((item, index) => {
        totalDebit += item.debit;
        totalKredit += item.kredit;
        let row = `
          <tr>
            <td>${item.kode}</td>
            <td>${item.nama_akun}</td>
            <td class="text-end">${Number(item.debit).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="text-end">${Number(item.kredit).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="text-center">${item.nama_cabang}</td>
          </tr>
        `;
        tbody.append(row);
      });
      let footer = `
        <tr class="bg-light">
            <td colspan="2" class="fw-bold">Total : Rp.</td>
            <td class="text-end fw-bold">${Number(totalDebit).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="text-end fw-bold">${Number(totalKredit).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td></td>
          </tr>
        `;
      tbody.append(footer);
      // $('#totalDebit').text(Number(totalDebit).toLocaleString('id-ID', {
      //          minimumFractionDigits: 2,
      //          maximumFractionDigits: 2
      //        }));
      // $('#totalKredit').text(Number(totalKredit).toLocaleString('id-ID', {
      //          minimumFractionDigits: 2,
      //          maximumFractionDigits: 2
      //        }));
        },
        error: function (xhr, status, error) {
          let tbody = $('#tabelJurnal tbody');
      tbody.empty();
      $('#totalDebit, #totalKredit').empty();
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});

function initSelect2Valas(select) {
  const initVal = select.data('init-value');
  const initText = select.data('init-text');

  select.select2({
    dropdownParent: "#modalEdit",
    placeholder: "Choose Forex",
    ajax: {
      url: url_api + '/forex/select2',
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
    }
  });

  if (initVal && !select.find(`option[value="${initVal}"]`).length) {
    const option = new Option(initText, initVal, true, true);
    select.append(option).trigger('change');
  }
}

// proses
$('#sbmTambah').click(function (e) {
  e.preventDefault();

  const $btn = $(this);
  if ($btn.prop('disabled')) return;

  $btn.prop('disabled', true);

  const details = [];
  const tipe = $('input[name="tipeTrans"]:checked').val();
  $('#detailBaru tbody tr').each(function () {
    const forex = $(this).find('select.forex').val();
    const amount = parseFloat($(this).find('.amount').val());
    const rate = parseFloat($(this).find('.rate').val());

    if (forex && amount && rate && amount != 0 && rate != 0) {
      details.push({
        forex: forex,
        amount: amount,
        rate: rate
      });
    }
  });

  const data = {
    from: $('#from').val(),
    to: $('#to').val(),
    akun_from: $('#akunFrom').val(),
    akun_to: $('#akunTo').val(),
    tanggal: $('#tanggal').val(),
    deskripsi: $('#deskripsi').val(),
    tipe: tipe,
    rupiah: $('#valRupiah').val() || 0,
    details: details
  };

  if (!data.from || data.from == "" || !data.to || data.to == "" || !data.tanggal || data.tanggal == "") {
    notif.fire({
      icon: 'error',
      text: "Branch, Date and account are required"
    });
    $btn.removeAttr('disabled');
    return;
  }

  if (details.length === 0 && tipe != "tipeRupiah") {
    notif.fire({
      icon: 'error',
      text: "Detail data cannot be blank"
    });
    $btn.removeAttr('disabled');
    return;
  }

  $.ajax({
    url: url_api + '/transfer',
    type: 'POST',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify(data),
    success: function (response) {
      $('#modalTambah .modal-body').find('input, textarea').val('').prop('checked', false);
      $('#modalTambah .modal-body').find('select').val(null).trigger('change');
      const today = new Date().toISOString().split('T')[0];
      $('#modalTambah .modal-body #tanggal').val(today);
      $('#modalTambah #detailBaru tbody').empty();
      notif.fire({
        icon: 'success',
        text: response.message
      }).then((result) => {
          offset = 0;
          table.clear().draw();
          orderDir = "desc";
          loadMoreData(true);
          $btn.removeAttr('disabled');
      });
      Swal.fire({
        title: 'Success',
        text: response.message,
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Transfer Receipt',
        denyButtonText: 'Make another transfer',
        customClass: {
          denyButton: 'btn btn-secondary',
          confirmButton: 'btn btn-primary'
        },
        reverseButtons: true,
        allowOutsideClick: false, 
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          window.open('/pages/transaction/transfer-receipt.php?number=' + response.nomor, '_blank');
        }
      });
    },
    error: function (xhr, status, error) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
      $btn.removeAttr('disabled');
    }
  });
});

$('#sbmEdit').click(function (e) {
  e.preventDefault();

  const $btn = $(this);
  if ($btn.prop('disabled')) return;

  $btn.prop('disabled', true);

  const id = $('#idEdit').val();
  const details = [];
  $('#detailEdit tbody tr').each(function () {
    const forex = $(this).find('select.forexEdit').val();
    const amount = parseFloat($(this).find('.amountEdit').val());
    const rate = parseFloat($(this).find('.rateEdit').val());

    if (forex && amount && rate && amount != 0 && rate != 0) {
      details.push({
        forex: forex,
        amount: amount,
        rate: rate
      });
    }
  });

  let tipe;
  isForex = $('#tipeForexEdit');
  if (isForex.prop('checked')) {
    tipe = 'tipeForex';
  } else {
    tipe = 'tipeRupiah';
  }

  const data = {
    from: $('#fromEdit').val(),
    to: $('#toEdit').val(),
    akun_from: $('#akunFromEdit').val(),
    akun_to: $('#akunToEdit').val(),
    tanggal: $('#tanggalEdit').val(),
    deskripsi: $('#deskripsiEdit').val(),
    tipe: tipe,
    rupiah: $('#valRupiahEdit').val() || 0,
    details: details
  };

  if (!data.from || data.from == "" || !data.tanggal || data.tanggal == "" || !data.to || data.to == "") {
    notif.fire({
      icon: 'error',
      text: "Branch, Date and account are required"
    });
    $btn.removeAttr('disabled');
    return;
  }

  if (details.length === 0 && tipe != "tipeRupiah") {
    notif.fire({
      icon: 'error',
      text: "Detail data cannot be blank"
    });
    $btn.removeAttr('disabled');
    return;
  }

  $.ajax({
    url: url_api + '/transfer/' + id,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify(data),
    success: function (response) {
      $('#modalEdit .modal-body').find('input, textarea').val('').prop('checked', false);
      $('#modalEdit .modal-body').find('select').val(null).trigger('change');
      $('#modalEdit #detailEdit tbody').empty();
      notif.fire({
        icon: 'success',
        text: response.message
      }).then((result) => {
          offset = 0;
          table.clear().draw();
          orderDir = "desc";
          loadMoreData(true);
          $btn.removeAttr('disabled');
      });
      $('#modalEdit').modal('hide');
    },
    error: function (xhr, status, error) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
      $btn.removeAttr('disabled');
    }
  });
});

$('#sbmHapus').click(function (e) {
  e.preventDefault();

  const id = $('#idHapus').val();

  $.ajax({
    url: url_api + '/transfer/' + id,
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