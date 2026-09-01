let table;
let offset = 0;
let limit = 50;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let userPermissions = [];

$(document).ready(function() {
	$('#cabangFromFilter, #cabangToFilter').select2({
    dropdownParent: '#modalFilter',
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

	$('#rangeFilter').select2({ dropdownParent: '#modalFilter' });
	$('#rangeFilter').on('change', function () {
		updateDateRangeSelector(this.value);
	});
	$('#rangeFilter').val('year').trigger('change');

	$('#from, #to').select2({
    dropdownParent: '#modalTambah',
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
    placeholder: 'Choose Branch',
    allowClear: true
	});

  $('#fromEdit, #toEdit').select2({
    dropdownParent: '#modalEdit',
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

const formatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4
});

$('#detailBaru').on('focus', '.amount, .rate', function () {
  let val = $(this).val() || "";
  val = val.replace(/\./g, ''); 
  $(this).val(val);
});

$('#detailBaru').on('blur', '.amount, .rate', function () {
  let $row = $(this).closest('tr');
  
  let val = $(this).val() || "";

  val = val.replace(/[^0-9.,]/g, '');

  const parts = val.split(/[,\.]/);
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('');
  }

  const numericVal = parseFloat(
    val.replace(/\./g, '')  // titik ribuan hilang
       .replace(/,/g, '.')  // koma jadi titik
  );

  if (!isNaN(numericVal)) {
    $(this).val(formatter.format(numericVal));
  } else {
    $(this).val('');
  }

  let jumlah = parseFloat(
    $row.find('.amount').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let rate = parseFloat(
    $row.find('.rate').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let subtotal = jumlah * rate;

  $row.find('.subtotal').val(
    !isNaN(subtotal) ? formatter.format(subtotal) : ''
  );

  updateTotal();
});

function updateTotal() {
    let total = 0;
    let amount = 0;

    $('.subtotal').each(function () {
        const num = parseFloat(
            (($(this).val() || '') + '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

        if (!isNaN(num)) {
            total += num;
        }
    });

    $('.amount').each(function () {
        const num = parseFloat(
            (($(this).val() || '') + '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

        if (!isNaN(num)) {
            amount += num;
        }
    });

    $('#totalSub').val(formatter.format(total));
    $('#totalAmount').val(formatter.format(amount));
}

$('#detailEdit').on('focus', '.amountEdit, .rateEdit', function () {
  let val = $(this).val() || "";
  val = val.replace(/\./g, ''); 
  $(this).val(val);
});

$('#detailEdit').on('blur', '.amountEdit, .rateEdit', function () {
  let $row = $(this).closest('tr');
  
  let val = $(this).val() || "";

  val = val.replace(/[^0-9.,]/g, '');

  const parts = val.split(/[,\.]/);
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('');
  }

  const numericVal = parseFloat(
    val.replace(/\./g, '')  // titik ribuan hilang
       .replace(/,/g, '.')  // koma jadi titik
  );

  if (!isNaN(numericVal)) {
    $(this).val(formatter.format(numericVal));
  } else {
    $(this).val('');
  }

  let jumlah = parseFloat(
    $row.find('.amountEdit').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let rate = parseFloat(
    $row.find('.rateEdit').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let subtotal = jumlah * rate;

  $row.find('.subtotalEdit').val(
    !isNaN(subtotal) ? formatter.format(subtotal) : ''
  );

  updateTotalEdit();
});

function updateTotalEdit() {
    let total = 0;
    let amount = 0;

    $('.subtotalEdit').each(function () {
        const num = parseFloat(
            (($(this).val() || '') + '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

        if (!isNaN(num)) {
            total += num;
        }
    });

    $('.amountEdit').each(function () {
        const num = parseFloat(
            (($(this).val() || '') + '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

        if (!isNaN(num)) {
            amount += num;
        }
    });

    $('#totalSubEdit').val(formatter.format(total));
    $('#totalAmountEdit').val(formatter.format(amount));
}

$(document).on('input', '#valRupiah, #valRupiahEdit', function () {
    let val = $(this).val();

    val = val.replace(/[^0-9,-]/g, '');
    val = val.replace(/(?!^)-/g, '');

    const parts = val.split(',');
    if (parts.length > 2) {
        val = parts[0] + ',' + parts.slice(1).join('');
    }

    if (val === '-') {
        $(this).val(val);
        return;
    }

    if (val.endsWith(',')) {
        $(this).val(val);
        return;
    }

    const numericVal = parseFloat(val.replace(',', '.'));

    if (!isNaN(numericVal)) {
        $(this).val(
            new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4
            }).format(numericVal)
        );
    } else {
        $(this).val('');
    }
});

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
                  if((data.tipe == 7 && userPermissions.includes('edit_transfer')) || userPermissions.includes('delete_transfer')) {
                    let menuHtml = `
                        <div class="dropdown">
                          <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                            <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                    `;

                    if (userPermissions.includes('edit_transfer') && data.tipe == 7) {
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

function updateBrowserURL(params) {
  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newURL);
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
      cabang_from: params.get("cabang_from") || "",
      cabang_to: params.get("cabang_to") || "",
      start_date: params.get("start_date") || "",
      end_date: params.get("end_date") || ""
  };
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";
    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    const params = new URLSearchParams();
    params.append("offset", reset ? 0 : offset);
    params.append("limit", limit);
    params.append("search", searchValue);

    const filters = getFiltersFromURL();
    if (filters.start_date) params.append("start_date", filters.start_date);
    if (filters.end_date) params.append("end_date", filters.end_date);
    if (filters.cabang_from) params.append("cabang_from", filters.cabang_from);
    if (filters.cabang_to) params.append("cabang_to", filters.cabang_to);

    fetch(`${url_api}/transfer/datatable?${params.toString()}${orderParam}`, {
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

$('#sbmFilter').click(function (e) {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    if ((startDate && !endDate) || (!startDate && endDate)) {
        notif.fire({
            icon: 'warning',
            text: 'Isi Date From dan Until sekaligus agar filter tanggal aktif'
        });
        return;
    }

    const cabangFrom = $('#cabangFromFilter').val() || '';
    const cabangTo = $('#cabangToFilter').val() || '';

    const params = new URLSearchParams();
    params.append("start_date", startDate);
    params.append("end_date", endDate);
    params.append("cabang_from", cabangFrom);
    params.append("cabang_to", cabangTo);

    updateBrowserURL(params);
    $('#modalFilter').modal('hide');
    offset = 0;
    table.clear().draw();
    loadMoreData(true);
});

$('#resetFilter').click(function (e) {
    e.preventDefault();

    $('#rangeFilter').val('year').trigger('change');
    $('#cabangFromFilter, #cabangToFilter').val(null).trigger('change');

    history.replaceState(null, '', window.location.pathname);

    $('#modalFilter').modal('hide');
    offset = 0;
    table.clear().draw();
    loadMoreData(true);
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
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            startDate = formatDate(startOfMonth);
            endDate = formatDate(endOfMonth);
            break;

        case 'lastMonth':
            const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            startDate = formatDate(lastMonthStart);
            endDate = formatDate(lastMonthEnd);
            break;

        case 'year':
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date(today.getFullYear(), 11, 31);
            startDate = formatDate(startOfYear);
            endDate = formatDate(endOfYear);
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

              if (userPermissions.includes('edit_transfer')) {
                $('#editBtn').attr('data-id', id).removeClass('d-none');
              }

              $('#jurnalBtn').attr('data-id', id).attr('data-ref', data.nomor);
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
          <input type="text" class="form-control amount text-end">
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control rate text-end">
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control subtotal text-end" readonly>
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
          <input type="text" class="form-control amountEdit text-end">
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control rateEdit text-end" min="0">
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control subtotalEdit text-end" readonly>
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
  if ($(this).val() === 'tipeBoth') {
    $('#boxTabelDetail, #boxNewRow').removeClass('d-none');
    $('#boxRupiah').addClass('d-none');
    $('#boxAkunLawan').addClass('d-none');
  } else if ($(this).val() === 'tipeForex') {
    $('#boxTabelDetail, #boxNewRow').removeClass('d-none');
    $('#boxRupiah').addClass('d-none');
    $('#boxAkunLawan').removeClass('d-none');
  } else {
    $('#boxTabelDetail, #boxNewRow').addClass('d-none');
    $('#boxRupiah').removeClass('d-none');
    $('#boxAkunLawan').removeClass('d-none');
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

const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input:not([type="radio"]):not([type="checkbox"]), textarea').val('');
    $('#modalEdit').find('select').val(null).trigger('change');

    $('#detailEdit tbody').empty();
    $('#totalAmountEdit').val('');
    $('#totalSubEdit').val('');

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
                      <td class="px-1 pt-2"><input type="text" class="form-control amountEdit text-end" value="${formatter.format(qty)}" /></td>
                      <td class="px-1 pt-2"><input type="text" class="form-control rateEdit text-end" value="${formatter.format(safeRate)}" /></td>
                      <td class="px-1 pt-2"><input type="text" class="form-control subtotalEdit text-end" value="${formatter.format(totalPerItem)}" readonly /></td>
                      <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBarisEdit" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
                    </tr>
                `);
                let selectForex = row.find('.forexEdit').first();
                // let $inputRate = row.find('.rate').first();
                // let $inputJumlah = row.find('.jumlah').first();
                // let $inputSubtotal = row.find('.subtotal').first();
                initSelect2Valas(selectForex);
                tbody.append(row);
                $('#totalSubEdit').val(formatter.format(subtotal));
                $('#totalAmountEdit').val(formatter.format(totalAmount));

                // selectForex.on('change', function () {
                //       const idForex = $(this).val();
                //       if (!idForex) return;

                //       updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal);
                // });
                $('#valRupiahEdit').val(formatter.format(qty));
              });

            if (foundRp) {
              $('#tipeRupiahEdit').prop('checked', true);
              $('#boxDetailEdit, #boxNewRowEdit').addClass('d-none');
              $('#boxRupiahEdit, #boxAkunLawanEdit').removeClass('d-none');
            } else if (response.is_transfer == 2) {
              $('#tipeBothEdit').prop('checked', true);
              $('#boxDetailEdit, #boxNewRowEdit').removeClass('d-none');
              $('#boxRupiahEdit, #boxAkunLawanEdit').addClass('d-none');
            } else {
              $('#tipeForexEdit').prop('checked', true);
              $('#boxDetailEdit, #boxNewRowEdit, #boxAkunLawanEdit').removeClass('d-none');
              $('#boxRupiahEdit').addClass('d-none');
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

$('#tipeBothEdit, #tipeForexEdit, #tipeRupiahEdit').on('click', function(e){
    e.preventDefault();
});

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
    const amount = parseFloat($(this).find('.amount').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.'));
    const rate = parseFloat($(this).find('.rate').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.'));

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
    rupiah: $('#valRupiah').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.') || 0,
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
    const amount = parseFloat($(this).find('.amountEdit').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.'));
    const rate = parseFloat($(this).find('.rateEdit').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.'));

    if (forex && amount && rate && amount != 0 && rate != 0) {
      details.push({
        forex: forex,
        amount: amount,
        rate: rate
      });
    }
  });

  const tipe = $('#modalEdit input[name="tipeTransEdit"]:checked').val();

  const data = {
    from: $('#fromEdit').val(),
    to: $('#toEdit').val(),
    akun_from: $('#akunFromEdit').val(),
    akun_to: $('#akunToEdit').val(),
    tanggal: $('#tanggalEdit').val(),
    deskripsi: $('#deskripsiEdit').val(),
    tipe: tipe,
    rupiah: $('#valRupiahEdit').val().toString()
      .replace(/\./g, '')  
      .replace(/,/g, '.') || 0,
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
      $('#modalEdit').find('input:not([type="radio"]):not([type="checkbox"]), textarea').val('');
      $('#modalEdit').find('select').val(null).trigger('change');

      $('#detailEdit tbody').empty();
      $('#totalAmountEdit').val('');
      $('#totalSubEdit').val('');
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