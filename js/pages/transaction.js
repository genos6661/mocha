let currentFilters = "";
let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let hasMoreData = true;
let userPermissions = [];

$(document).ready(function () {
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

  $('#negara').select2({
      dropdownParent: $('#modalKontakBaru'),
      ajax: {
        url: url_api + '/profile/negara/select2',
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
      placeholder: 'Choose Country'
  });

  $.getJSON('/occupation.json', function (data) {
    occupationData = data;

    $('#pekerjaan').select2({
      placeholder: 'Choose Occupation',
      dropdownParent: '#modalKontakBaru',
      data: [], 
      allowClear: true,
      ajax: {
        transport: function (params, success, failure) {
          const term = params.data.term ? params.data.term.toLowerCase() : '';
          const filtered = occupationData.filter(item => {
            return item.text.toLowerCase().includes(term);
          });
          success({ results: filtered });
        },
        delay: 250
      }
    });
  });

  $('#modalKontakBaru').on('shown.bs.modal', function (e) {
      $('#modalKontakBaru #nama').trigger('focus');
  });

  initTable();
  initEvents();

  $.ajax({
    url: url_api + '/role/role-permissions',
    method: 'GET',
    data: {
        sub_kategori: 'Transaction'
    },
    traditional: true,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (permissions) {
        userPermissions = permissions;
        if(permissions.includes('transaction')) {
          const contactValue = getUrlParameter('contact');
          if (contactValue) {
              $('.filtertabel input').val(contactValue);
          }

          loadMoreData(true);
          if(!permissions.includes('edit_transaction')) {
              $('#editBtn').attr('disabled', true).addClass('d-none');
          }
          if(!permissions.includes('delete_transaction')) {
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

  function getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
  }

  $('#cabang').select2({
      dropdownParent: $('#modalFilter'),
      ajax: {
        url: url_api + '/cabang/select2/limit',
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

  $('#kontak').select2({
    dropdownParent: $('#modalTransaksiBaru'),
    placeholder: 'Choose Contact',
    allowClear: true,
    // minimumInputLength: 1,

    ajax: {
      url: url_api + '/profile/select2',
      dataType: 'json',
      delay: 1000,
      headers: {
        "X-Client-Domain": myDomain,
        "Authorization": `Bearer ${window.token}`
      },
      data: function (params) {
        return {
          search: params.term || '',
          page: params.page || 1
        };
      },
      processResults: function (data, params) {
        params.page = params.page || 1;

        return {
          results: data.results,
          pagination: {
            more: data.pagination?.more || false
          }
        };
      }
    },

    templateResult: function (data) {
      if (!data.id) return data.nama;

      return `
        <div style="padding:6px 4px;">
          <div style="font-weight:600;">${data.nama}</div>
          <div style="font-size:12px;color:#666;">
            📧 ${data.email || '-'}<br>
            📱 ${data.telepon || '-'}<br>
            🌍 ${data.nama_negara || '-'}
          </div>
        </div>
      `;
    },

    templateSelection: function (data) {

        if (!data.id) {
            return 'Choose Contact';
        }

        return `${data.nama || data.text || ''} - ${data.nama_negara || ''}`;
    },

    escapeMarkup: function (markup) {
      return markup; 
    }
  });

  $('#cabangTrans').select2({
      dropdownParent: $('#modalTransaksiBaru'),
      ajax: {
        url: url_api + '/cabang/select2/limit',
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

  $('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#range').select2({dropdownParent: $('#modalFilter')});
  $('#range').val('year').trigger('change');

});
// akhir document ready
function updateBrowserURL(params) {
  const newURL = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newURL);
}

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
      cabang: params.get("cabang") || "",
      start_date: params.get("start_date") || "",
      end_date: params.get("end_date") || "",
      buy: params.get("buy") || "",
      sell: params.get("sell") || ""
  };
}

$("#sbmFilter").on("click", function (e) {
  e.preventDefault();
  if (isLoading) {
    return;
  }
  currentFilters = ""; 
  const tanggalAwal = $("#startDate").val();
  const tanggalAkhir = $("#endDate").val();
  const cabangs = $("#cabang").val(); 
  const isBuy = $("#buy").is(":checked") ? 1 : 0;
  const isSell = $('#sell').is(":checked") ? 1 : 0;

  const params = new URLSearchParams();
  params.append("start_date", tanggalAwal);
  params.append("end_date", tanggalAkhir);
  params.append("cabang", cabangs);
  params.append("buy", isBuy);
  params.append("sell", isSell);

  updateBrowserURL(params);
  if(userPermissions.includes('transaction')) {
      bootstrap.Modal.getInstance(document.getElementById("modalFilter")).hide();
      offset = 0;
      loadMoreData(true);
  } else {
      notif.fire({
          icon: 'error',
          text: 'Insufficient Permission to load data'
      });
  }
});

function initTable() {
  table = new DataTable("#tabelTrans", {
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
            render: function (data, type, row) {
              if (!data) return "";
              const tanggal = new Date(data);
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              return tanggal.toLocaleDateString('en-ID', options);
            }
        },
        { data: "nomor", orderable: true },
        {
            data: "tipe",
            orderable: true,
            render: function (data) {
              if (data == 3) {
                return "BUY";
              } else if(data == 4) {
                return "SELL";
              }
            }
        },
        { data: "no_order", orderable: true },
        { data: "nama_cabang", orderable: true },
        { data: "nama_kontak", orderable: true, className: "nowrap" },
        { 
            data: null,
            className: "text-end",
            render: function(data) {
              let menuHtml = `
                  <div class="dropdown">
                    <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                      <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                    <a href="/pages/transaction/invoice.php?transaction=${data.nomor}" class="dropdown-item" target="_blank">Reprint</a>
              `;

              if(userPermissions.includes('edit_transaction') || userPermissions.includes('delete_transaction')) {
                if (userPermissions.includes('edit_transaction')) {
                  menuHtml += `
                      <a href="/transaction/edit?nomor=${data.nomor}" class="dropdown-item">Edit</a>
                  `;
                }
                if (userPermissions.includes('delete_transaction')) {
                  menuHtml += `
                      <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.noindex}" data-ref="${data.nomor}">Delete</a>
                  `;
                }
              }

              menuHtml += `
                    </div>
                  </div>
              `;
              return menuHtml;
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

      let columnMapping = ["", "tanggal", "nomor", "tipe", "no_order", "nama_cabang", "nama_kontak", ""];
      orderColumn = columnMapping[columnIndex] || "nomor";
      orderDir = direction;

      resetOffset = true;
      // loadMoreData(true);
  });
}

function loadMoreData(reset = false) {
    if (reset) {
        offset = 0;
        hasMoreData = true;
        table.clear(); 
    }

    if (isLoading || !hasMoreData) return;
    isLoading = true;

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";
    const filters = getFiltersFromURL();

    const query = new URLSearchParams({
        offset: offset,
        limit: limit,
        search: searchValue,
        order_column: orderColumn,
        order_dir: orderDir
    });

    if (filters.cabang) query.append("cabang", filters.cabang);
    if (filters.start_date) query.append("start_date", filters.start_date);
    if (filters.end_date) query.append("end_date", filters.end_date);
    if (filters.buy == 1) query.append("buy", 1);
    if (filters.sell == 1) query.append("sell", 1);

    fetch(`${url_api}/transaction/datatable?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        }
    })
    .then(r => r.json())
    .then(response => {
        const data = response.data || [];
        const total = response.recordsTotal || 0;

        if (data.length > 0) {
            offset += data.length;
            table.rows.add(data).draw(false);

            // Jika data yang dikembalikan kurang dari limit, berarti tidak ada lagi
            if (data.length < limit) {
                hasMoreData = false;
            }
        } else {
            hasMoreData = false;
        }

        document.querySelector("#totaltrans").textContent = total;
    })
    .catch(console.error)
    .finally(() => {
        isLoading = false;
        const loadingEl = document.querySelector(`.notiflix-loading`);
        if (loadingEl) Loading.remove();
    });
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

  let scrollTimeout;
  document.querySelector("#tabelTrans_wrapper .dt-scroll-body")
    .addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const el = this;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
                loadMoreData(); 
            }
        }, 300);
    });

  $('#tabelTrans tbody').on('dblclick', 'tr', function () {
    var rowData = table.row(this).data();
    if (!rowData) return; 

    var id = rowData.noindex;
    var nomor = rowData.nomor;

    $.ajax({
        url: url_api + `/transaction/nomor/${nomor}`,
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
            if (data.tipe == 3) {
                $('#tipeDetail').html('<span class="badge bg-label-primary">BUY</span>');
            } else if (data.tipe == 4) {
                $('#tipeDetail').html('<span class="badge bg-label-primary">SELL</span>');
            }
            $('.dataDetail').text('');
            $('#nomorDetail').text('#' + data.nomor);
            $('#orderDetail').text(data.no_order);
            $('#cabangDetail').text(data.nama_cabang);
            $('#pelangganDetail').text(data.nama_pelanggan);
            $('#negaraDetail').text(data.nationality);
            $('#tanggalDetail').text(tanggal.toLocaleDateString('en-ID', options));
            const details = data.details || [];

            const tbody = $('#tabelItemDetail tbody');
            tbody.empty();

            if (details.length === 0) {
                tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
            } else {
                let subtotal = 0;

                details.forEach(function (item) {
                    let qty;
                    if(data.tipe == 3) {
                        qty = item.beli;
                    } else if (data.tipe == 4) {
                        qty = item.jual;
                    }
                    const totalPerItem = qty * item.rate;
                        subtotal += totalPerItem;
                    const row = `
                        <tr>
                          <td><div class="d-flex flex-column"><a class="text-heading text-truncate"><span class="fw-medium">${item.kode}</span></a><small>${item.nama}</small></div></td>
                          <td class="text-end">${Number(qty).toLocaleString('id-ID')}</td>
                          <td class="text-end">Rp. ${Number(item.rate).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 4
                            })}</td>
                          <td class="text-end">Rp. ${Number(totalPerItem).toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 4
                            })}</td>
                        </tr>
                    `;
                  tbody.append(row);
                });
                tbody.append(`
                    <tr><td colspan="3" class="text-end fw-bold">Total : </td>
                        <td class="text-end fw-bold">Rp. ${Number(subtotal).toLocaleString('id-ID', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 4
                        })}</td></tr>
                `);
            }
            $('#jurnalBtn').attr('data-id', id).attr('data-ref', data.nomor);
            $('#reprintDetail').attr('href', '/pages/transaction/invoice.php?transaction=' + nomor);
            $('#editBtn').attr('href', '/transaction/edit?nomor=' + data.nomor);
            $('#deleteBtn').attr('data-id', id).attr('data-ref', nomor);
            $('#modalDetail').modal('show');
        },
        error: function (err) {
            console.error('Gagal mengambil data detail:', err);
            alert('Terjadi kesalahan saat mengambil detail data.');
        }
    });
  });
}

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
      startDate = formatDate(startOfMonth);
      endDate = formatDate(today);
      break;

    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDate(lastMonthStart);
      endDate = formatDate(lastMonthEnd);
      break;

    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = formatDate(startOfYear);
      endDate = formatDate(today);
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

const modalJurnal = document.getElementById('modalJurnal')
modalJurnal.addEventListener('shown.bs.modal', e => {
  const button = e.relatedTarget;
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
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4
                })}</td>
              <td class="text-end">${Number(item.kredit).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4
                })}</td>
            </tr>
          `;
          tbody.append(row);
        });
        let footer = `
          <tr class="bg-light">
              <td colspan="2" class="fw-bold">Total :</td>
              <td class="text-end fw-bold">Rp. ${Number(totalDebit).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4
                })}</td>
              <td class="text-end fw-bold">Rp. ${Number(totalKredit).toLocaleString('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4
                })}</td>
            </tr>
          `;
        tbody.append(footer);
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

const modalHapus = document.getElementById('modalHapus')
modalHapus.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const ref = button.getAttribute('data-ref')

    $('#idHapus').val(id);
    $('#refHapus').text(ref);
    $('#sbmHapus').trigger('focus');
});

// ~~~~~~~~~~~~~~~~~~~ process
$('#sbmHapus').click(function (e) {
  e.preventDefault();

  const id = $('#idHapus').val();

  $.ajax({
    url: url_api + '/transaction/' + id,
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
            loadMoreData(true);
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