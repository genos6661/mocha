let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nomor";
let orderDir = "desc";
let resetOffset = false;
let userPermissions = [];

$(document).ready(function() {
	$('#akunKas').select2({
	    dropdownParent: $('#modalTambah'),
	    ajax: {
	      url: url_api + '/akun/kas/select2',
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
	    placeholder: 'Choose Cash/Bank Account'
	});

	$('#cabang').select2({
	    dropdownParent: $('#modalTambah'),
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

	$('#kontak').select2({
	    dropdownParent: $('#modalTambah'),
	    ajax: {
	      url: url_api + '/profile/select2',
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
	    placeholder: 'Choose Contact'
	});

	$('#akunKasEdit').select2({
	    dropdownParent: $('#modalEdit'),
	    ajax: {
	      url: url_api + '/akun/kas/select2',
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
	    placeholder: 'Choose Cash/Bank Account'
	});

	$('#cabangEdit').select2({
	    dropdownParent: $('#modalEdit'),
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

	$('#kontakEdit').select2({
	    dropdownParent: $('#modalEdit'),
	    ajax: {
	      url: url_api + '/profile/select2',
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
	    placeholder: 'Choose Contact'
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
            sub_kategori: 'Cash Transaction'
        },
        traditional: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('add_cash')) {
                $('#btnModalTambah').attr('disabled', true);
            }

            if(permissions.includes('cash')) {
                initTable();
                initEvents();
                loadMoreData();
                if (!permissions.includes('edit_cash')) {
                    $('#editBtn').attr('disabled', true);
                }
                if(!permissions.includes('delete_cash')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelCash tbody').append(`<tr><td class="text-center" colspan="7">Data Not Available</td></tr>`);
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
	table = new DataTable("#tabelCash", {
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
            { data: "nomor", orderable: true, className: "nowrap" },
            { data: "nama_kontak", orderable: false },
            { data: "nama_cabang", orderable: true },
            { data: "deskripsi", orderable: false },
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
                          <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalJurnal" data-id="${data.noindex}" data-ref="${data.nomor}">Journal Voucher</a>
                    `;
                    if(userPermissions.includes('edit_cash') || userPermissions.includes('delete_cash')) {
                        if (userPermissions.includes('edit_cash')) {
                            menuHtml += `
                                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_cash')) {
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

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "tanggal", "nomor", "", "cabang", "", ""];
        orderColumn = columnMapping[columnIndex] || "nomor";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
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

    document.querySelector("#tabelCash_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelCash tbody').on('dblclick', 'tr', function () {
        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/kas/id/${id}`,
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
              $('#kontakDetail').text(data.nama_kontak);
              $('#tanggalDetail').text(tanggal.toLocaleDateString('en-ID', options));
              $('#userDetail').text(data.user);
              $('#deskripsiDetail').text(data.deskripsi);

              const details = data.details || [];
              $('#kasDetail').text(details[0].nama_kas);

              const tbody = $('#itemDetail tbody');
              tbody.empty();

              if (details.length === 0) {
                  tbody.append('<tr><td colspan="4" class="text-center">Journal Data Not Found</td></tr>');
              } else {
                  let total = 0;

                  if ((data.details || []).some(d => d.dividen == 1)) {
                      $('#dividenDet').html('<span class="badge bg-label-secondary">Dividen</span>');
                  } else {
                      $('#dividenDet').html('');
                  }

                  details.forEach(function (item) {
                    const safeAmount = isNaN(item.jumlah) ? 0 : Number(item.jumlah);
                    total += safeAmount;

                    const row = `
                      <tr>
                        <td>CASH-${item.tipe}</td>
                        <td>
                          <div class="d-flex flex-column nowrap">
                            <a class="text-heading text-truncate">
                              <span class="fw-medium">${item.akun_lawan}</span>
                            </a>
                            <small>${item.nama}</small>
                          </div>
                        </td>
                        <td>${item.alias}</td>
                        <td>${item.catatan}</td>
                        <td class="text-end">${safeAmount.toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}</td>
                      </tr>
                    `;

                    tbody.append(row);
                  });
                  tbody.append(`
                  		<tr>
                  			<td colspan="2"><strong>Total: </strong></td>
                  			<td colspan="3" class="text-end"><strong>Rp. ${total.toLocaleString('id-ID', {
	                          minimumFractionDigits: 2,
	                          maximumFractionDigits: 2
	                        })}</strong></td>
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

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    let searchInput = document.querySelector(".filtertabel input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(url_api + `/kas/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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
            document.querySelector("#totalCash").textContent = response.recordsTotal;
        })
        .catch(() => {
            isLoading = false;
        });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
}

$('#tambahBaris').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1 pt-2">
          <select class="form-select akun"></select>
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control catatan">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control jumlah text-end" min="0">
        </td>
        <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#detailBaru tbody').append(baris);

    let $selectAkun = baris.find('.akun').first();

    $selectAkun.select2({
      dropdownParent: '#modalTambah',
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
});

$('#detailBaru').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
    updateTotal();
});

$(document).on('input', '#detailBaru .jumlah', function () {
    updateTotal();
});

$('#tambahBarisEdit').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1 pt-2">
          <select class="form-select akun"></select>
        </td>
        <td class="px-1 pt-2">
          <input type="text" class="form-control catatan">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control jumlah text-end" min="0">
        </td>
        <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#detailEdit tbody').append(baris);

    let $selectAkun = baris.find('.akun').first();

    $selectAkun.select2({
      dropdownParent: '#modalEdit',
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
});

$('#detailEdit').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
    updateTotalEdit();
});

$(document).on('input', '#detailEdit .jumlah', function () {
    updateTotalEdit();
});

function updateTotal() {
    let total = 0;

    $('#detailBaru .jumlah').each(function () {
        total += parseFloat($(this).val()) || 0;
    });

    $('#totalBaru').val(total.toFixed(2));
}

function updateTotalEdit() {
    let total = 0;

    $('#detailEdit .jumlah').each(function () {
        total += parseFloat($(this).val()) || 0;
    });

    $('#totalEdit').val(total.toFixed(2));
}

// ~~~~~~~~~~~~~~~~~~~ modal
const modalTambah = document.getElementById('modalTambah')
modalTambah.addEventListener('shown.bs.modal', event => {
	event.preventDefault();
 	$('#kontak').trigger('focus');
});

const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
	const button = event.relatedTarget
    const id = button.getAttribute('data-id')

	$('#modalEdit').find('input, textarea').val('').prop('checked', false);
    $('#cabangEdit, #akunKasEdit, #kontakEdit').val(null).trigger('change');

    $.ajax({
        url: url_api + `/kas/id/` + id,
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

            $('#idEdit').val(id);
            $('#nomorEdit').text("#" + response.nomor);
            $('#tanggalEdit').val(formattedDate);
            $('#deskripsiEdit').val(response.deskripsi);
            
            const details = response.details || [];

            const tbody = $('#detailEdit tbody');
            tbody.empty();

            if (details.length === 0) {
              tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
            } else {
              let total = 0;

              if ((details || []).some(d => d.dividen == 1)) {
                    $('#dividenEdit').prop('checked', true);
              } else {
                    $('#dividenEdit').removeAttr('checked');
              }

              details.forEach(function (item) {
                const safeJumlah = isNaN(item.jumlah) ? 0 : Number(item.jumlah);
                total += safeJumlah;
                const row = $(`
                    <tr>
                      <td class="px-1 pt-2">
                        <select class="form-select akun" data-init-value="${item.akun_lawan}" data-init-text="${item.akun_lawan} - ${item.nama}">
                          <option value="${item.akun_lawan}">${item.akun_lawan} - ${item.nama}</option>
                        </select>
                      </td>
                      <td class="px-1 pt-2"><input type="text" class="form-control catatan" value="${item.catatan}" /></td>
                      <td class="px-1 pt-2"><input type="number" class="form-control jumlah text-end" value="${item.jumlah}" /></td>
                      <td class="px-1 pt-2 text-end"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
                    </tr>
                `);
                tbody.append(row);
              });

            if (response.cabang && response.cabang != 0) {
              const option = new Option(response.kode_cabang + " - " + response.nama_cabang, response.cabang, true, true);
              $('#cabangEdit').append(option).trigger('change');
            }

            if (response.kontak && response.kontak != 0) {
              const option = new Option(response.kode_kontak + " - " + response.nama_kontak, response.kontak, true, true);
              $('#kontakEdit').append(option).trigger('change');
            }

            if (details[0].akun_kas && details[0].akun_kas != 0) {
              const option = new Option(details[0].akun_kas + " - " + details[0].nama_kas, details[0].akun_kas, true, true);
              $('#akunKasEdit').append(option).trigger('change');
            }
            $('#totalEdit').val(total);

            if (details[0].tipe === "IN") {
			  $('#inEdit').prop('checked', true);
			  $('#outEdit').removeAttr('checked');
			} else if (details[0].tipe === "OUT") {
			  $('#outEdit').prop('checked', true);
			  $('#inEdit').removeAttr('checked');
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
				  </tr>
				`;
			tbody.append(footer);
			// $('#totalDebit').text(Number(totalDebit).toLocaleString('id-ID', {
			// 				  minimumFractionDigits: 2,
			// 				  maximumFractionDigits: 2
			// 				}));
			// $('#totalKredit').text(Number(totalKredit).toLocaleString('id-ID', {
			// 				  minimumFractionDigits: 2,
			// 				  maximumFractionDigits: 2
			// 				}));
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

// ~~~~~~~~~~~~~~~~~~~~ proses
$('#sbmTambah').click(function (e) {
	e.preventDefault();

	const $btn = $(this);
	if ($btn.prop('disabled')) return;

	$btn.prop('disabled', true);

	const details = [];
	$('#detailBaru tbody tr').each(function () {
	    const akun = $(this).find('select.akun').val();
	    const catatan = $(this).find('.catatan').val();
	    const jumlah = parseFloat($(this).find('.jumlah').val());

	    if (akun && jumlah && jumlah !== 0) {
	      details.push({
	        akun: akun,
	        catatan: catatan,
	        jumlah: jumlah
	      });
	    }
	});

	const formData = {
	    tipe: $('#out').is(':checked') ? "OUT" : "IN",
        dividen: $('#dividen').is(':checked') ? 1 : 0,
	    tanggal: $('#tanggal').val(),
	    kontak: $('#kontak').val(),
	    cabang: $('#cabang').val(),
	    deskripsi: $('#deskripsi').val(),
	    akunKas: $('#akunKas').val(),
	    details: details
	};

	if (!formData.cabang || !formData.tanggal || formData.tanggal == "" || !formData.akunKas || !formData.kontak || !formData.tipe) {
	    notif.fire({
	      icon: 'error',
	      text: "Missing Required Fields"
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
	    url: url_api + '/kas', 
	    type: 'POST',
	    contentType: 'application/json',
	    headers: {
	        "Content-Type": "application/json",
	        "Authorization": `Bearer ${window.token}`,
	        "X-Client-Domain": myDomain
	    },
	    data: JSON.stringify(formData), 
	    success: function (response) {
	    	const today = new Date().toISOString().split('T')[0];
	        $('#modalTambah .modal-body').find('input, textarea').val('').prop('checked', false);
	        $('#modalTambah .modal-body').find('select').val(null).trigger('change');
	        $('#modalTambah .modal-body #tanggal').val(today);
			$('#modalTambah #detailBaru tbody').empty();
			$btn.removeAttr('disabled');
	        notif.fire({
	          icon: 'success',
	          text: response.message
	        }).then((result) => {
	            offset = 0;
	            table.clear().draw();
	            loadMoreData(true);
	        });
	    },
	    error: function (xhr, status, error) {
	        notif.fire({
	          icon: 'error',
	          text: xhr.responseJSON.message
	        });
	        $btn.removeAttr('disabled');
			return;
	    },
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
	    const akun = $(this).find('select.akun').val();
	    const catatan = $(this).find('.catatan').val();
	    const jumlah = parseFloat($(this).find('.jumlah').val());

	    if (akun && jumlah && jumlah !== 0) {
	      details.push({
	        akun: akun,
	        catatan: catatan,
	        jumlah: jumlah
	      });
	    }
	});

	const formData = {
	    tipe: $('#outEdit').is(':checked') ? "OUT" : "IN",
        dividen: $('#dividenEdit').is(':checked') ? 1 : 0,
	    tanggal: $('#tanggalEdit').val(),
	    kontak: $('#kontakEdit').val(),
	    cabang: $('#cabangEdit').val(),
	    deskripsi: $('#deskripsiEdit').val(),
	    akunKas: $('#akunKasEdit').val(),
	    details: details
	};

	if (!formData.cabang || !formData.tanggal || formData.tanggal == "" || !formData.akunKas || !formData.kontak || !formData.tipe) {
	    notif.fire({
	      icon: 'error',
	      text: "Missing Required Fields"
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
	    url: url_api + '/kas/' + id,
	    type: 'PUT',
	    contentType: 'application/json',
	    headers: {
	      "Content-Type": "application/json",
	      "X-Client-Domain": myDomain,
	      "Authorization": `Bearer ${window.token}`
	    },
	    data: JSON.stringify(formData),
	    success: function (response) {
	      $('#modalEdit .modal-body').find('input, textarea').val('').prop('checked', false);
	      $('#modalEdit .modal-body').find('select').val(null).trigger('change');
	      $('#modalEdit #detailEdit tbody').empty();
	      $btn.removeAttr('disabled');
	      notif.fire({
	        icon: 'success',
	        text: response.message
	      }).then((result) => {
	          offset = 0;
	          table.clear().draw();
	          orderDir = "desc";
	          loadMoreData(true);
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
    url: url_api + '/kas/' + id,
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