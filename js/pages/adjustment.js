let table;
let offset = 0;
let limit = 50;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let userPermissions = [];

$(document).ready(function() {
	$('#cabang').select2({
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

  $('#akun').select2({
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
    placeholder: 'Choose Offset Account'
  });

  $('#cabangEdit').select2({
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

  $('#akunEdit').select2({
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
    placeholder: 'Choose Offset Account'
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
          sub_kategori: 'Adjustment'
      },
      traditional: true,
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (permissions) {
          userPermissions = permissions;
          if (!permissions.includes('add_adjustment')) {
              $('#btnModalTambah').attr('disabled', true);
          }

          if(permissions.includes('adjustment')) {
              initTable();
              initEvents();
              loadMoreData();
              if (!permissions.includes('edit_adjustment')) {
                  $('#editBtn').attr('disabled', true);
              }
              if(!permissions.includes('delete_adjustment')) {
                  $('#deleteBtn').attr('disabled', true);
              }
          } else {
              notif.fire({
                  icon: 'error',
                  text: 'Insufficient Permission to load data'
              });
              $('#tabelAdjust tbody').append(`<tr><td class="text-center" colspan="7">Data Not Available</td></tr>`);
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
    table = new DataTable("#tabelAdjust", {
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
            { data: "nama_cabang", orderable: true, className: "nowrap" },
            { data: "deskripsi", orderable: false, className: "nowrap" },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                  if(userPermissions.includes('edit_adjustment') || userPermissions.includes('delete_adjustment')) {
                    let menuHtml = `
                        <div class="dropdown">
                          <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                            <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalJurnal" data-id="${data.noindex}" data-ref="${data.nomor}">Journal Voucher</a>
                    `;

                    if (userPermissions.includes('edit_adjustment')) {
                        menuHtml += `
                            <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                        `;
                    }

                    if (userPermissions.includes('delete_adjustment')) {
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

        let columnMapping = ["", "tanggal", "nomor", "user", "nama_cabang", "", ""];
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

    fetch(`${url_api}/penyesuaian/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
        document.querySelector("#totalAdjust").textContent = response.recordsTotal;
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

    document.querySelector("#tabelAdjust_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelAdjust tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/penyesuaian/id/${id}`,
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
              $('#cabangDetail').text(data.nama_cabang);
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
                      qty = item.jual * -1;
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
    $('#detailEdit tbody').append(baris);

    let $selectForex = baris.find('.forex').first();

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

$('#detailBaru').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
});

$('#detailEdit').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
});

$('#detailBaru').on('input', '.amount, .rate', function () {
  let $row = $(this).closest('tr');
  let amount = parseFloat($row.find('.amount').val()) || 0;
  let rate = parseFloat($row.find('.rate').val()) || 0;
  let subtotal = amount * rate;
  $row.find('.subtotal').val(subtotal.toFixed(2));
  // updateTotal();
});

$('#detailEdit').on('input', '.amount, .rate', function () {
  let $row = $(this).closest('tr');
  let amount = parseFloat($row.find('.amount').val()) || 0;
  let rate = parseFloat($row.find('.rate').val()) || 0;
  let subtotal = amount * rate;
  $row.find('.subtotal').val(subtotal.toFixed(2));
  // updateTotal();
});

const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);
    $('#cabangEdit, #akunEdit').val(null).trigger('change');

    $.ajax({
        url: url_api + `/penyesuaian/id/` + id,
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

            if (details.length === 0) {
              tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
            } else {
              let subtotal = 0;

              details.forEach(function (item) {
                let qty = 0;

                if (item.beli !== 0) {
                  qty = item.beli;
                } else if (item.jual !== 0) {
                  qty = item.jual * -1;
                }

                const safeRate = isNaN(item.rate) ? 0 : Number(item.rate);
                const totalPerItem = qty * safeRate;
                subtotal += totalPerItem;
                const row = $(`
                    <tr>
                      <td class="px-1 pt-2">
                        <select class="form-select forex" data-init-value="${item.valas}" data-init-text="${item.kode} - ${item.nama}">
                          <option value="${item.valas}">${item.kode} - ${item.nama}</option>
                        </select>
                      </td>
                      <td class="px-1 pt-2"><input type="number" class="form-control amount text-end" value="${qty}" /></td>
                      <td class="px-1 pt-2"><input type="number" class="form-control rate text-end" value="${safeRate}" /></td>
                      <td class="px-1 pt-2"><input type="number" class="form-control subtotal text-end" value="${totalPerItem}" readonly /></td>
                      <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
                    </tr>
                `);
                let selectForex = row.find('.valas').first();
                // let $inputRate = row.find('.rate').first();
                // let $inputJumlah = row.find('.jumlah').first();
                // let $inputSubtotal = row.find('.subtotal').first();
                initSelect2Valas(selectForex);
                tbody.append(row);

                // selectForex.on('change', function () {
                //       const idForex = $(this).val();
                //       if (!idForex) return;

                //       updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal);
                // });
              });

            if (response.cabang && response.cabang != 0) {
              const option = new Option(response.kode_cabang + " - " + response.nama_cabang, response.cabang, true, true);
              $('#cabangEdit').append(option).trigger('change');
            }

            if (response.akun && response.akun != 0) {
              const option = new Option(response.akun.kode + " - " + response.akun.nama, response.akun.kode, true, true);
              $('#akunEdit').append(option).trigger('change');
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
            <td colspan="2" class="fw-bold">Total :</td>
            <td class="text-end fw-bold">Rp. ${Number(totalDebit).toLocaleString('id-ID', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="text-end fw-bold">Rp. ${Number(totalKredit).toLocaleString('id-ID', {
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
  $('#detailBaru tbody tr').each(function () {
    const forex = $(this).find('select.forex').val();
    const amount = parseFloat($(this).find('.amount').val());
    const rate = parseFloat($(this).find('.rate').val());
    let beli = 0;
    let jual = 0;
    if (amount > 0) {
      beli = amount;
    } else if (amount < 0) {
      jual = amount * -1;
    }

    if (forex && amount && rate && amount != 0 && rate != 0) {
      details.push({
        forex: forex,
        beli: beli,
        jual: jual,
        rate: rate
      });
    }
  });

  const data = {
    cabang: $('#cabang').val(),
    tanggal: $('#tanggal').val(),
    akun: $('#akun').val(),
    deskripsi: $('#deskripsi').val(),
    details: details
  };

  if (!data.cabang || data.cabang == "" || !data.tanggal || data.tanggal == "" || !data.akun || data.akun === null) {
    notif.fire({
      icon: 'error',
      text: "Branch, Date and account are required"
    });
    $btn.removeAttr('disabled');
    return;
  }

  if (details.length === 0) {
    notif.fire({
      icon: 'error',
      text: "Detail data cannot be blank"
    });
    $btn.removeAttr('disabled');
    return;
  }

  $.ajax({
    url: url_api + '/penyesuaian',
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
    const forex = $(this).find('select.forex').val();
    const amount = parseFloat($(this).find('.amount').val());
    const rate = parseFloat($(this).find('.rate').val());
    let beli = 0;
    let jual = 0;
    if (amount > 0) {
      beli = amount;
    } else if (amount < 0) {
      jual = amount * -1;
    }

    if (forex && amount && rate && amount != 0 && rate != 0) {
      details.push({
        forex: forex,
        beli: beli,
        jual: jual,
        rate: rate
      });
    }
  });

  const data = {
    cabang: $('#cabangEdit').val(),
    tanggal: $('#tanggalEdit').val(),
    akun: $('#akunEdit').val(),
    deskripsi: $('#deskripsiEdit').val(),
    details: details
  };

  if (!data.cabang || data.cabang == "" || !data.tanggal || data.tanggal == "" || !data.akun || data.akun === null) {
    notif.fire({
      icon: 'error',
      text: "Branch, Date and account are required"
    });
    $btn.removeAttr('disabled');
    return;
  }

  if (details.length === 0) {
    notif.fire({
      icon: 'error',
      text: "Detail data cannot be blank"
    });
    $btn.removeAttr('disabled');
    return;
  }

  $.ajax({
    url: url_api + '/penyesuaian/' + id,
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
    url: url_api + '/penyesuaian/' + id,
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