let valasDisplayed;
let userPermissions = [];
$(document).ready(function() {
    $('#kasRPDefault, #bankRPDefault, #kasUKADefault, #bankUKADefault').select2({
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

    $('#desain').select2();

    loadSettings();
    initTable();
    initEvents();
    loadMoreData(true);
    loadMediaGrid();

    $.ajax({
        url: url_api + '/role/role-permissions',
        method: 'GET',
        data: {
            sub_kategori: 'Company Settings'
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (permissions) {
            userPermissions = permissions;
            if (!permissions.includes('general_setting')) {
                $('#sbmGeneral, #removeLogo').attr('disabled', true);
            }
            if (!permissions.includes('customer_display')) {
                $('#sbmCD').attr('disabled', true);
            }

                // notif.fire({
                //     icon: 'error',
                //     text: 'Insufficient Permission to load data'
                // });
                // if (document.querySelector(`.notiflix-loading`)) {
                //     Loading.remove();
                // }
        },
        error: function (xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON.message
            });
            console.error('Gagal mengambil permissions:', xhr.responseText);
        }
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        $('#tabelValas').DataTable().columns.adjust().draw();
    });
});

function loadSettings() {
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
        url: url_api + '/setting',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            $('#namaUsaha').val(response.NamaPT.strval);
            $('#idUserBI').val(response.IDuserBI.strval);
            $('#batasJam').val(response.LimitJam3.boolval);
            $('#rateJual').val(response.SellBlank.boolval);
            $('#subheader').val(response.Subheader.strval);
            valasDisplayed = response.ValasDisplay.strval;
            const kasRP = response.KasRPDefault;
            const bankRP = response.BankRPDefault;
            const kasUKA = response.KasUKADefault;
            const bankUKA = response.BankUKADefault;
            if (kasRP && kasRP.strval && kasRP.nama) {
                const optionKas = new Option(kasRP.strval + ' - ' + kasRP.nama, kasRP.strval, true, true);
                $('#kasRPDefault').append(optionKas).trigger('change');
            }
            if (bankRP && bankRP.strval && bankRP.nama) {
                const optionBank = new Option(bankRP.strval + ' - ' + bankRP.nama, bankRP.strval, true, true);
                $('#bankRPDefault').append(optionBank).trigger('change');
            }
            if (kasUKA && kasUKA.strval && kasUKA.nama) {
                const optionKasUKA = new Option(kasUKA.strval + ' - ' + kasUKA.nama, kasUKA.strval, true, true);
                $('#kasUKADefault').append(optionKasUKA).trigger('change');
            }
            if (bankUKA && bankUKA.strval && bankUKA.nama) {
                const optionBankUKA = new Option(bankUKA.strval + ' - ' + bankUKA.nama, bankUKA.strval, true, true);
                $('#bankUKADefault').append(optionBankUKA).trigger('change');
            }
            if(response.InvoiceDesain.strval) {
                $('#desain').val(response.InvoiceDesain.strval).trigger('change');
            }
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
    const logoUrl = url_api + '/setting/logo/';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', logoUrl, true);
    xhr.setRequestHeader('X-Client-Domain', myDomain);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status === 200) {
            const imgBlob = xhr.response;
            const imgURL = URL.createObjectURL(imgBlob);
            $('#boxLogo').html(`
                <h5>Logo : </h5>
                <img src="${imgURL}" alt="Logo" style="height:80px; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalHapusLogo">
            `);
        } else {
            // Tidak ditemukan atau error lain
            $('#boxLogo').empty(); // atau tampilkan default/fallback
        }
    };

    xhr.onerror = function () {
        $('#targetLogo').empty();
    };

    xhr.send();
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
}

$('#sbmGeneral').click(function(e) {
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

    const generalData = {
        namaUsaha: $('#namaUsaha').val(),
        idUserBI: $('#idUserBI').val(),
        batasJam: $('#batasJam').val(),
        rateJual: $('#rateJual').val(),
        kasRPDefault: $('#kasRPDefault').val(),
        bankRPDefault: $('#bankRPDefault').val(),
        kasUKADefault: $('#kasUKADefault').val(),
        bankUKADefault: $('#bankUKADefault').val(),
        desain: $('#desain').val()
    };

    $.ajax({
        url: url_api + '/setting/general', 
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(generalData), 
        success: function (response) {
            notif.fire({
                icon: 'success',
                text: response.message
            }).then(() => {
                loadSettings();

                const logoFile = $('#logoUsaha')[0].files[0];
                if (logoFile) {
                    const originalName = logoFile.name;
                    const ext = originalName.substring(originalName.lastIndexOf('.'));

                    const newBaseName = 'logo';
                    const newFileName = newBaseName + ext;

                    const renamedFile = new File([logoFile], newFileName, {
                        type: logoFile.type,
                        lastModified: logoFile.lastModified
                    });

                    const logoFormData = new FormData();
                    logoFormData.append('file', renamedFile);
                    logoFormData.append('filename', myDomain);

                    $.ajax({
                        url: url_api + '/setting/logo',
                        type: 'POST',
                        headers: {
                            "Authorization": `Bearer ${window.token}`,
                            "X-Client-Domain": myDomain,
                        },
                        data: logoFormData,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                            notif.fire({
                                icon: 'success',
                                text: res.message
                            });
                            loadSettings();
                        },
                        error: function(xhr) {
                            notif.fire({
                                icon: 'error',
                                text: xhr.responseJSON?.message || 'Upload logo gagal.'
                            });
                        }
                    });
                }
            });
        },
        error: function(xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON?.message || 'Gagal menyimpan pengaturan.'
            });
        }
    });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
});

let table;
let offset = 0;
let limit = 50;
let isLoading = false;
let lastSearch = "";
let orderColumn = "kode";
let orderDir = "asc";

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
            { data: null, orderable: false,
                render: function (data, type, row) {
                    if (valasDisplayed !== '' && valasDisplayed !== null) {
                        let arrDisplay = valasDisplayed.split(",").map(Number);
                        let isDisplayed = arrDisplay.includes(row.noindex);
                        return `<input class="form-check-input row-checkbox" type="checkbox" value="${row.noindex}" onChange="updateHeaderCheckboxState()" id="customCheck${row.noindex}" ${isDisplayed ? 'checked' : ''}>`;
                    } else {
                        return `<input class="form-check-input row-checkbox" type="checkbox" value="${row.noindex}" onChange="updateHeaderCheckboxState()" id="customCheck${row.noindex}">`;
                    }
                }
            },
            { data: "kode", orderable: true },
            { data: "nama", orderable: true, className: "nowrap" },
            { 
                data: "flag",
                className: "text-center" ,
                render: (data, type, row) =>
                row.flag !== null && row.flag !== ''
                    ? `<img src="/assets/img/flags/${data}" style="height: 25px; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalFlag" data-id="${row.noindex}" data-kode="${row.kode}" data-nama="${row.nama}" data-flag="${data}">`
                    : `<button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalUploadFlag" data-id="${row.noindex}" data-kode="${row.kode}" data-nama="${row.nama}">Choose</button>`
            }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    // Order event
    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["", "kode", "nama", "flag"];
        orderColumn = columnMapping[columnIndex] || "kode";
        orderDir = direction;

        loadMoreData(true);
    });
}

function loadMoreData(reset = false) {
    if (isLoading) return;
    isLoading = true;

    const searchInput = document.querySelector(".filtertabel input");
    const searchValue = searchInput ? searchInput.value : "";
    const orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(`${url_api}/forex/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
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

// Event listeners
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

$('#sbmFlag').click(function (e) {
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
    const selected = $('input[name="bendera"]:checked').val();
    if (selected) {
        const formData = {
            id: $('#idValasFlag').val(),
            kode: $('#kodeValasFlag').val(),
            flag: selected
        };

        $.ajax({
            url: url_api + '/forex/flag',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            data: JSON.stringify(formData), 
            success: function (response) {
                $('#modalUploadFlag .modal-body').find('input').prop('checked', false);
                notif.fire({
                  icon: 'success',
                  text: response.message
                }).then((result) => {
                    offset = 0;
                    loadMoreData(true);
                });
                $('#modalUploadFlag').modal('hide'); 
            },
            error: function (xhr, status, error) {
                notif.fire({
                  icon: 'error',
                  text: xhr.responseJSON.message
                });
            },
        });
    } else {
        notif.fire({
          icon: 'error',
          text: 'Choose Flag First'
        });
    }
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
});

$('#removeFlag').click(function (e) {
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
    const id = $('#idRemoveFlag').val();
    const kode = $('#kodeRemoveFlag').val();
    $.ajax({
        url: url_api + '/forex/flag/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        }, 
        data: JSON.stringify({ kode: kode }),
        success: function (response) {
            notif.fire({
              icon: 'success',
              text: response.message
            }).then((result) => {
                offset = 0;
                loadMoreData(true);
            });
            $('#modalFlag #viewFlag').attr('src', '');
            $('#modalFlag').modal('hide'); 
        },
        error: function (xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
});

const modalFLag = document.getElementById('modalUploadFlag')
modalFLag.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const kode = button.getAttribute('data-kode')
    const nama = button.getAttribute('data-nama')
    
    $('#namaValasFlag').text(kode + ' - ' + nama);
    $('#idValasFlag').val(id);
    $('#kodeValasFlag').val(kode);
});

const modalViewFLag = document.getElementById('modalFlag')
modalViewFLag.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    const id = button.getAttribute('data-id')
    const kode = button.getAttribute('data-kode')
    const nama = button.getAttribute('data-nama')
    const flag = button.getAttribute('data-flag')
    
    $('#namaRemoveFlag').text(kode + ' - ' + nama);
    $('#idRemoveFlag').val(id);
    $('#kodeRemoveFlag').val(kode);
    $('#viewFlag').attr('src', '/assets/img/flags/' + flag);
});

const modalViewLogo = document.getElementById('modalHapusLogo')
modalViewLogo.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget
    
    const logoUrl = url_api + '/setting/logo/';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', logoUrl, true);
    xhr.setRequestHeader('X-Client-Domain', myDomain);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status === 200) {
            const imgBlob = xhr.response;
            const imgURL = URL.createObjectURL(imgBlob);
            $('#viewLogo').attr('src', imgURL);
        } else {
            $('#viewLogo').attr('src', '');
        }
    };

    xhr.onerror = function () {
        $('#targetLogo').empty();
    };

    xhr.send();
});

$('#sbmCD').click(function(e) {
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
    const values = $('.row-checkbox:checked').map(function () {
        return this.value;
    }).get().join(',');

    const data = {
        subheader: $('#subheader').val(),
        valas: values
    };

    $.ajax({
        url: url_api + '/setting/customer-display', 
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(data), 
        success: function (response) {
            notif.fire({
                icon: 'success',
                text: response.message
            }).then(() => {
                loadSettings();
                loadMoreData(true);

                const media = $('#media')[0].files[0];
                if (media) {
                    const logoFormData = new FormData();
                    logoFormData.append('file', media);
                    logoFormData.append('filename', myDomain);

                    $.ajax({
                        url: url_api + '/setting/media',
                        type: 'POST',
                        headers: {
                            "Authorization": `Bearer ${window.token}`,
                            "X-Client-Domain": myDomain,
                        },
                        data: logoFormData,
                        processData: false,
                        contentType: false,
                        success: function(res) {
                            notif.fire({
                                icon: 'success',
                                text: res.message
                            });
                            loadMediaGrid();
                        },
                        error: function(xhr) {
                            notif.fire({
                                icon: 'error',
                                text: xhr.responseJSON?.message || 'Upload logo gagal.'
                            });
                        }
                    });
                }
            });
        },
        error: function(xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON?.message || 'Gagal menyimpan pengaturan.'
            });
        }
    });
    if (document.querySelector(`.notiflix-loading`)) {
        Loading.remove();
    }
});

$('#displayAllValas').on('change', function () {
    const checked = this.checked;
    $('.row-checkbox').prop('checked', checked);
    updateHeaderCheckboxState();
});

function updateHeaderCheckboxState() {
    const $all = $('.row-checkbox');
    const $checked = $('.row-checkbox:checked');

    const allCount = $all.length;
    const checkedCount = $checked.length;

    const $header = $('#displayAllValas')[0];

    if (checkedCount === 0) {
      $header.checked = false;
      $header.indeterminate = false;
    } else if (checkedCount === allCount) {
      $header.checked = true;
      $header.indeterminate = false;
    } else {
      $header.checked = false;
      $header.indeterminate = true;
    }
 }

function loadMediaGrid() {
    $('#mediaGrid').empty();
    $.ajax({
        url: url_api + '/setting/media',
        method: 'GET',
        headers: {
          "X-Client-Domain": myDomain
        },
        success: function (fileNames) {
          if (!Array.isArray(fileNames) || fileNames.length === 0) {
            $('#mediaGrid').html('<div class="text-muted">Tidak ada media</div>');
            return;
          }

          $('#mediaGrid').html('<div class="row g-2"></div>');

          fileNames.forEach(fileName => {
            const ext = fileName.split('.').pop().toLowerCase();
            const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(ext);
            const fileUrl = `${url_api}/setting/media/${fileName}`;

            fetch(fileUrl, {
              headers: {
                'X-Client-Domain': myDomain
              }
            })
              .then(res => {
                if (!res.ok) throw new Error('Gagal memuat media');
                return res.blob();
              })
              .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const canDelete = userPermissions.includes('customer_display');

                const $media = $(`
                  <div class="col-auto text-center d-flex flex-column">
                    ${isVideo
                      ? `<video src="${blobUrl}" controls style="max-height: 100px;" class="img-fluid mb-1"></video>`
                      : `<img src="${blobUrl}" style="max-height:100px;" class="img-fluid mb-1">`}
                    ${canDelete ? `<button class="btn btn-sm btn-danger btnDeleteMedia" data-filename="${fileName}">Delete</button>` : ''}
                  </div>
                `);
                $('#mediaGrid .row').append($media);
              })
              .catch(() => {
                console.warn('Gagal memuat', fileName);
              });
          });
        },
        error: function () {
          $('#mediaGrid').html('<div class="text-danger">Gagal memuat daftar media</div>');
        }
    });
}

$(document).on('click', '.btnDeleteMedia', function () {
  const fileName = $(this).data('filename');

  Swal.fire({
    title: 'Are you sure to delete this media?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        url: `${url_api}/setting/media/${fileName}`,
        type: 'DELETE',
        headers: {
          "X-Client-Domain": myDomain,
        },
        success: function (res) {
            notif.fire({
                icon: 'success',
                text: res.message
            });
          loadMediaGrid(); 
        },
        error: function (xhr) {
          Swal.fire('Gagal', xhr.responseJSON?.message || 'Gagal menghapus media', 'error');
        }
      });
    }
  });
});

$('#removeLogo').click(function (e) {

  Swal.fire({
    title: 'Are you sure to delete logo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        url: `${url_api}/setting/logo`,
        type: 'DELETE',
        headers: {
          "X-Client-Domain": myDomain,
        },
        success: function (res) {
            notif.fire({
                icon: 'success',
                text: res.message
            });
            $('#modalHapusLogo').modal('hide');
          loadSettings();
        },
        error: function (xhr) {
          Swal.fire('Gagal', xhr.responseJSON?.message || 'Gagal menghapus logo', 'error');
        }
      });
    }
  });
});