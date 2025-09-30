let table;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nama";
let orderDir = "asc";
let resetOffset = false;
let filter;
let userPermissions = [];
let occupationData = [];

document.addEventListener("DOMContentLoaded", function () {
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
            sub_kategori: 'Contact'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('add_contact')) {
                $('#btnModalTambah').attr('disabled', true);
            }

            if(permissions.includes('contact')) {
                initTable();
                initEvents();
                loadMoreData();
                if (!permissions.includes('edit_contact')) {
                    $('#activateBtn, #deactivateBtn, #editBtn').attr('disabled', true);
                }
                if (!permissions.includes('delete_contact')) {
                    $('#deleteBtn').attr('disabled', true);
                }
            } else {
                notif.fire({
                    icon: 'error',
                    text: 'Insufficient Permission to load data'
                });
                $('#tabelContact tbody').append(`<tr><td class="text-center" colspan="8">Data Not Available</td></tr>`);
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

    $('#negara').select2({
        dropdownParent: $('#modalTambah'),
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

    $('#filNegara').select2({
        dropdownParent: $('#modalFilter'),
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
        placeholder: 'All Countries',
        allowClear: true
    });

    $('#negaraEdit').select2({
        dropdownParent: $('#modalEdit'),
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
          dropdownParent: '#modalTambah',
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

        $('#pekerjaanEdit').select2({
          placeholder: 'Choose Occupation',
          dropdownParent: '#modalEdit',
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

    $('#modalTambah').on('shown.bs.modal', function (e) {
        $('#modalTambah #nama').trigger('focus');
    });

});

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        tipe: params.get("tipe"),
        negara: params.get("negara"),
        pelanggan: params.get("pelanggan"),
        vendor: params.get("vendor"),
        karyawan: params.get("karyawan"),
        member: params.get("member")
    };
}

function initTable() {
    table = new DataTable("#tabelContact", {
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
            { data: "kode", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "email", orderable: true },
            { data: "telepon", orderable: false },
            { data: "nama_int_negara", orderable: true },
            { data: null, orderable: false, render: function (data, type, row) {
                    let types = [];
                    if (row.pelanggan == 1) types.push("Pelanggan");
                    if (row.vendor == 1) types.push("Vendor");
                    if (row.karyawan == 1) types.push("Karyawan");
                    if (row.member == 1) types.push("Member");
                    return types.join(", ");
                } 
            },
            { 
                data: null,
                className: "text-end",
                render: function(data) {
                    if(userPermissions.includes('edit_contact') || userPermissions.includes('delete_contact')) {
                        let menuHtml = `
                            <div class="dropdown">
                              <a href="javascript:;" class="btn dropdown-toggle hide-arrow btn-icon btn-text-secondary rounded-pill waves-effect p-0" data-bs-toggle="dropdown">
                                <i class="icon-base ti tabler-dots-vertical icon-22px"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-end">
                        `;

                        if (userPermissions.includes('edit_contact')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalEdit" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${data.noindex}">Edit</a>
                            `;
                        }

                        if (userPermissions.includes('delete_contact')) {
                            menuHtml += `
                                <a class="dropdown-item btnModalHapus" data-bs-toggle="modal" data-bs-target="#modalHapus" data-id="${data.noindex}" data-ref="${data.kode} - ${data.nama}">Hapus</a>
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

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "kode", "nama", "email", "", "negara", "", ""];
        orderColumn = columnMapping[columnIndex] || "nama";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    let searchInput = document.querySelector(".filtertabel input");
    let searchValue = searchInput ? searchInput.value : "";
    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    const extraParams = getUrlParams();
    let urlParams = "";

    Object.keys(extraParams).forEach(key => {
        if (extraParams[key]) { 
            urlParams += `&${key}=${encodeURIComponent(extraParams[key])}`;
        }
    });

    let apiUrl = url_api + `/profile/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${encodeURIComponent(searchValue)}${orderParam}${urlParams}`;

    fetch(apiUrl, {
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
        document.querySelector("#totalContact").textContent = response.recordsFiltered;
        isLoading = false;
    })
    .catch(() => {
        isLoading = false;
    })
    .finally(() => {
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
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

    document.querySelector("#tabelContact_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    $('#tabelContact tbody').on('dblclick', 'tr', function () {
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
        $('.dataDetail').text('');

        var rowData = table.row(this).data();
        if (!rowData) return; 

        var id = rowData.noindex;

        $.ajax({
            url: url_api + `/profile/id/${id}`,
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (data) {
                if (data.id_foto) {
                    $('#pasporDetail').attr('data-url', 'https://drive.google.com/uc?id=' + data.id_foto + '&export=download');
                    $('#pasporDetail').attr('src', 'https://drive.google.com/thumbnail?id=' + data.id_foto).removeClass('d-none');
                } else {
                  $('#pasporDetail').addClass('d-none');
                }
                if (data.dokumen) {
                    $('#boxDokumen').removeClass('d-none');
                    $('#npwpDetail').text(data.dokumen.npwp);
                    $('#domisiliDetail').text(data.dokumen.domisili);
                    $('#penghasilanDetail').text(data.dokumen.penghasilan + ' Juta');
                    $('#pekerjaan2Detail').text(data.dokumen.pekerjaan);
                } else {
                    $('#boxDokumen').addClass('d-none');
                }
                let types = [];
                if (data.pelanggan == 1) types.push("Pelanggan");
                if (data.vendor == 1) types.push("Vendor");
                if (data.karyawan == 1) types.push("Karyawan");
                if (data.member == 1) types.push("member");
                types.join(", ");
                let sumTransaksi = data.total_transaksi || 0;

                let id_type;

                const gender = { M: 'Male', F: 'Female' }[data.jk] || 'Unknown';
                const tipe = { 101: 'Personal', 204: 'Company' }[data.tipe_kontak] || 'Unknown'; 
                const id_tipe = { PSP: 'Passport', KTP: 'KTP', SIM: 'SIM (Driving License)', OTH: 'Other', SIU: 'Surat Izin Usaha', SAP: 'Surat Akta Pendirian', ADR: 'Anggaran Dasar' }[data.jenis_id] || 'Passport';

                $('#kodeDetail').text(data.kode);
                $('#namaDetail').text(data.nama);
                $('#jkDetail').text(gender);
                $('#nttDetail').text(tipe);
                $('#IDTipeDetail').text(id_tipe);
                $('#teleponDetail').text(data.telepon);
                $('#alamatDetail').text(data.alamat);
                $('#idDetail').text(data.id);
                $('#emailDetail').text(data.email);
                $('#pekerjaanDetail').text(data.pekerjaan);
                $('#negaraDetail').text(data.nama_int_negara);
                $('#rekeningDetail').text(data.rekening);
                $('#tipeDetail').text(types);
                $('#transaksiDetail').text("Rp. " + sumTransaksi.toLocaleString('id-ID', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }));
                // $('#activateBtn').attr('data-id', id);
                // $('#deactivateBtn').attr('data-id', id);
                $('#editBtn').attr('data-id', id);
                $('#deleteBtn').attr('data-id', id).attr('data-ref', data.kode + ' - ' + data.nama);
                $('#goTrans').attr('href', '/transaction?contact=' + data.kode);
                $('#modalDetail').modal('show');
                if (document.querySelector(`.notiflix-loading`)) {
                    Loading.remove();
                }
            },
            error: function (err) {
                console.error('Gagal mengambil data detail:', err);
                alert('Terjadi kesalahan saat mengambil detail data.');
            }
        });
    });
}

function uploadFotoPaspor(file, namaFoto) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('namaFile', namaFoto); 

        $.ajax({
            url: url_api + '/profile/paspor',
            type: 'POST',
            headers: {
              "Authorization": `Bearer ${window.token}`,
              "X-Client-Domain": myDomain
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                resolve(res);
            },
            error: function (xhr) {
                reject(xhr.responseJSON || { message: 'Gagal upload file' });
            }
        });
    });
}

$('#pasporDetail, #pasporEditView').on('click', function () {
  const url = $(this).data('url');
  if (url) {
    window.location.href = url; // buka di tab yang sama
    // atau gunakan ini untuk membuka di tab baru:
    // window.open(url, '_blank');
  } else {
    console.warn('Atribut data-url tidak ditemukan.');
  }
});

$('#sbmFilter').click(function (e) {
  e.preventDefault();

  const tipe = $('#filTipe').val();
  const negara = $('#filNegara').val();
  const pelanggan = $('#filPelanggan').is(':checked') ? 1 : 0;
  const vendor = $('#filVendor').is(':checked') ? 1 : 0;
  const karyawan = $('#filKaryawan').is(':checked') ? 1 : 0;
  const member = $('#filMember').is(':checked') ? 1 : 0;

  const params = new URLSearchParams();

  if (tipe) params.append('tipe', tipe);
  if (negara) params.append('negara', negara);
  params.append('pelanggan', pelanggan);
  params.append('vendor', vendor);
  params.append('karyawan', karyawan);
  params.append('member', member);

  const finalUrl = params.toString() ? `?${params.toString()}` : baseUrl;

  window.history.pushState({}, '', finalUrl);

  loadMoreData(true);
  $('#modalFilter').modal('hide');
});

//modal
const modalEdit = document.getElementById('modalEdit')
modalEdit.addEventListener('shown.bs.modal', event => {
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
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    $('#modalEdit').find('input, textarea').val('').prop('checked', false);

    $.ajax({
        url: url_api + `/profile/id/` + id,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function(response) {
            if (response.id_foto) {
                $('#pasporEditView').attr('data-url', 'https://drive.google.com/uc?id=' + response.id_foto + '&export=download');
                $('#pasporEditView').attr('src', 'https://drive.google.com/thumbnail?id=' + response.id_foto).removeClass('d-none');
            } else {
              $('#pasporEditView').addClass('d-none');
            }
            $('#idEdit').val(id);
            $('#kodeEdit').text('#' + response.kode);
            $('#kodeEditVal').val(response.kode);
            $('#tipeEdit').val(response.tipe_kontak);
            $('#id_typeEdit').val(response.jenis_id);
            $('#namaEdit').val(response.nama);
            $('#alamatEdit').val(response.alamat);
            $('#teleponEdit').val(response.telepon);
            $('#emailEdit').val(response.email);
            $('#negaraEdit').val(response.negara);
            $('#idNumberEdit').val(response.id);
            $('#rekeningEdit').val(response.rekening);
            $('#pelangganEdit').prop('checked', response.pelanggan == 1);
            $('#vendorEdit').prop('checked', response.vendor == 1);
            $('#karyawanEdit').prop('checked', response.karyawan == 1);
            $('#memberEdit').prop('checked', response.member == 1);

            if (response.negara && response.negara != '') {
                const option = new Option(response.negara + ' - ' + response.nama_negara, response.negara, true, true);
                $('#negaraEdit').append(option).trigger('change');
            }

            if (response.pekerjaan && response.pekerjaan != '') {
                const option = new Option(response.pekerjaan, response.pekerjaan, true, true);
                $('#pekerjaanEdit').append(option).trigger('change');
            }

            if (response.jk == 'F') {
                $('#femaleEdit').prop('checked', true);
            } else if (response.jk == 'M') {
                $('#maleEdit').prop('checked', true);
            }

            $('#modalEdit').modal('show');
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
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

$('#resetFilter').click(function (e) {
  e.preventDefault();

  $('#filTipe, #filNegara').val('').trigger('change');
  $('#filPelanggan, #filVendor, #filKaryawan, #filMember').prop('checked', true);
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


// ~~~~~~~~~~~~~~~~~~~~ proses
$('#sbmTambah').click(async function (e) {
    e.preventDefault();

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

    let idFoto = null;
    const fotoFile = $('#paspor')[0].files[0]; 
    const namaFoto = $('#nama').val();

    if (fotoFile) {
        try {
            const fotoResponse = await uploadFotoPaspor(fotoFile, namaFoto);
            idFoto = fotoResponse.fileId; // ← pastikan response dari backend mengandung ini
        } catch (err) {
            notif.fire({
                icon: 'error',
                text: err.message || 'Gagal upload paspor'
            });
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
            return;
        }
    }

    isFemale = $('#female');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }

    const formData = {
        kode: $('#kode').val(),
        nama: $('#nama').val(),
        alamat: $('#alamat').val(),
        telepon: $('#telepon').val(),
        email: $('#email').val(),
        negara: $('#negara').val(),
        id: $('#idNumber').val(),
        pekerjaan: $('#pekerjaan').val(),
        tipe: $('#tipe').val(),
        id_type: $('#id_type').val(),
        jk: jk,
        rekening: $('#rekening').val(),
        pelanggan: $('#pelanggan').is(':checked') ? 1 : 0,
        vendor: $('#vendor').is(':checked') ? 1 : 0,
        karyawan: $('#karyawan').is(':checked') ? 1 : 0,
        member: $('#member').is(':checked') ? 1 : 0,
        id_foto: idFoto || null 
    };

    $.ajax({
        url: url_api + '/profile',
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
            $('#negara').val(null).trigger('change');
            notif.fire({
              icon: 'success',
              text: response.message
            }).then(() => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
            });
        },
        error: function (xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON.message
            });
        },
        complete: function () {
            Loading.remove();
        }
    });
});

$('#sbmEdit').click(async function (e) {
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
    const id = $('#idEdit').val();

    let idFoto = null;
    const fotoFile = $('#pasporEdit')[0].files[0]; 
    const namaFoto = $('#namaEdit').val();

    if (fotoFile) {
        try {
            const fotoResponse = await uploadFotoPaspor(fotoFile, namaFoto);
            idFoto = fotoResponse.fileId; // ← pastikan response dari backend mengandung ini
        } catch (err) {
            notif.fire({
                icon: 'error',
                text: err.message || 'Gagal upload paspor'
            });
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
            return;
        }
    }

    isFemale = $('#femaleEdit');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }
  
    const formData = {
        kode: $('#kodeEditVal').val(),
        nama: $('#namaEdit').val(),
        alamat: $('#alamatEdit').val(),
        telepon: $('#teleponEdit').val(),
        email: $('#emailEdit').val(),
        negara: $('#negaraEdit').val(),
        id: $('#idNumberEdit').val(),
        pekerjaan: $('#pekerjaanEdit').val(),
        jk: jk,
        tipe: $('#tipeEdit').val(),
        id_type: $('#id_typeEdit').val(),
        rekening: $('#rekeningEdit').val(),
        pelanggan: $('#pelangganEdit').is(':checked') ? 1 : 0,
        vendor: $('#vendorEdit').is(':checked') ? 1 : 0,
        karyawan: $('#karyawanEdit').is(':checked') ? 1 : 0,
        member: $('#memberEdit').is(':checked') ? 1 : 0,
        id_foto: idFoto || null
    };

  $.ajax({
    url: url_api + '/profile/' + id,
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
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            offset = 0;
            table.clear().draw();
            loadMoreData();
        });
        $('#modalEdit').modal('hide');
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

$('#sbmHapus').click(function (e) {
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

    const id = $('#idHapus').val();

    $.ajax({
        url: url_api + '/profile/' + id,
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
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                notif.fire({
                  icon: 'error',
                  text: xhr.responseJSON.message
                });
                if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
            } else {
                notif.fire({
                  icon: 'error',
                  text: 'Terjadi Kesalahan pada server'
                });
                if (document.querySelector(`.notiflix-loading`)) {
                    Loading.remove();
                }
            }
        },
    });
});