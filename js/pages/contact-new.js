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

    isFemale = $('#female');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }

    const nama = $('#nama').val();
    const negara = $('#negara').val();

    const formData = {
        // kode: $('#kode').val(),
        nama: nama,
        alamat: $('#alamat').val(),
        telepon: $('#telepon').val(),
        email: $('#email').val(),
        negara: negara,
        id: $('#idNumber').val(),
        pekerjaan: $('#pekerjaan').val(),
        tipe: $('#tipe').val(),
        id_type: $('#id_type').val(),
        jk: jk,
        rekening: $('#rekening').val(),
        tempat_lahir: $('#tempat_lahir').val() || null,
        tanggal_lahir: $('#tanggal_lahir').val() || null,
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
        success: async function (response) {
            if (fotoFile) {
                try {
                    const namaFoto = response.noindex;
                    const fotoResponse = await uploadFotoPaspor(fotoFile, namaFoto);
                    idFoto = fotoResponse.fileId;
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
            $('#modalTambah .modal-body, #modalKontakBaru .modal-body').find('input, textarea').val('').prop('checked', false);
            $('#negara, #pekerjaan').val(null).trigger('change');
            notif.fire({
                icon: 'success',
                text: response.message
            }).then(async () => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
                checkDTTOT(nama);
            });
            if ($('#kontak').length && $('#modalTransaksiBaru').length && response.noindex) {
                $('#modalKontakBaru').modal('hide');
                $('#modalTransaksiBaru').modal('show');
                const data = {
                    id: response.noindex,
                    nama: nama,
                    nama_negara: negara,
                    text: nama + ' - ' + negara
                };

                const option = new Option(data.text, data.id, true, true);

                $('#kontak').append(option).trigger('change');

                $('#kontak').trigger({
                    type: 'select2:select',
                    params: {
                        data: data
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 409 && xhr.responseJSON?.duplicate) {

            if (document.querySelector(`.notiflix-loading`)) {
              Loading.remove();
            }

            const dup = xhr.responseJSON.fields;

            let msg = "Duplicated data found:<br><br>";
            if (dup.id) msg += "- ID Number already exists<br>";
            if (dup.email) msg += "- Email already exists<br>";
            if (dup.telepon) msg += "- Phone number already exists<br>";
            msg += "<br>Do you wish to continue?";

            return Swal.fire({
              title: "Duplication Detected",
              html: msg,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Continue",
              cancelButtonText: "Cancel"
            }).then(result => {
              if (result.isConfirmed) {
                  submitForce();  
              } else {
                  Loading.remove();
              }
            });
            }

            notif.fire({
                icon: 'error',
                text: xhr.responseJSON?.message || "Terjadi kesalahan"
            });

            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },
        complete: function () {
            Loading.remove();
        }
    });
});

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

function submitForce() {
    let idFoto = null;
    const fotoFile = $('#paspor')[0].files[0]; 

    isFemale = $('#female');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }

    const nama = $('#nama').val();

    const formData = {
        nama: nama,
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
        id_foto: idFoto || null,
        force: true
    };

    $.ajax({
        url: url_api + '/profile',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(formData),

        success: async function (response) {
            if (fotoFile) {
                try {
                    const namaFoto = response.noindex;
                    const fotoResponse = await uploadFotoPaspor(fotoFile, namaFoto);
                    idFoto = fotoResponse.fileId;
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
            $('#modalTambah .modal-body, #modalKontakBaru .modal-body').find('input, textarea').val('').prop('checked', false);
            $('#negara, #pekerjaan').val(null).trigger('change');
            notif.fire({
                icon: 'success',
                text: response.message
            }).then(async () => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
                checkDTTOT(nama);
            });
            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        },

        error: function (xhr) {
            notif.fire({
                icon: 'error',
                text: xhr.responseJSON?.message || 'Terjadi kesalahan'
            });

            if (document.querySelector(`.notiflix-loading`)) {
                Loading.remove();
            }
        }
    });

}

async function checkDTTOT(name) {

    try {

        const response = await $.ajax({
            url: "https://apiprovider.thebrotherhoodlaw.com/dttot/check",
            type: "POST",
            contentType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            data: JSON.stringify({
                name: name
            })
        });

        if (!response.matched || response.results.length === 0) {
            return false;
        }

        let html = `
            <div style="max-height:500px;overflow-y:auto;padding-right:8px">
        `;

        response.results.forEach(item => {

            let badge = "secondary";

            switch (item.level) {
                case "VERY_HIGH":
                    badge = "danger";
                    break;

                case "HIGH":
                    badge = "warning";
                    break;

                case "MEDIUM":
                    badge = "info";
                    break;
            }

            html += `
            <div class="card mb-3 shadow-sm border-start border-4 border-${badge}">

                <div class="card-body py-3">

                    <div class="d-flex justify-content-between align-items-center mb-2">

                        <div>

                            <div class="fw-bold fs-6">
                                ${item.dttot.name}
                            </div>

                            <small class="text-muted">
                                Alias cocok : <b>${item.matchedAlias}</b>
                            </small>

                        </div>

                        <div class="text-end">

                            <span class="badge bg-${badge}">
                                ${item.level}
                            </span>

                            <div class="fw-bold mt-1">
                                ${item.score}%
                            </div>

                        </div>

                    </div>

                    <div class="row g-2 small">

                        <div class="col-md-6">
                            <b>Kode Densus</b><br>
                            ${item.dttot.code}
                        </div>

                        <div class="col-md-6">
                            <b>Tipe</b><br>
                            ${item.dttot.suspectType}
                        </div>

                        <div class="col-md-6">
                            <b>Tanggal Lahir</b><br>
                            ${item.dttot.birthDate ?? "-"}
                        </div>

                        <div class="col-md-6">
                            <b>Negara</b><br>
                            ${item.dttot.nationality ?? "-"}
                        </div>

                    </div>

                    <hr class="my-2">

                    <div class="small">

                        <b>Alamat</b>

                        <div class="text-muted mb-2">
                            ${(item.dttot.address || "-").replace(/\n/g,"<br>")}
                        </div>

                        <b>Deskripsi</b>

                        <div class="text-muted">
                            ${(item.dttot.description || "-").replace(/\n/g,"<br>")}
                        </div>

                    </div>

                </div>

            </div>
            `;

        });

        html += "</div>";

        await Swal.fire({

            icon: "warning",

            title: "Potensi Kecocokan DTTOT",

            html,

            width: 850,

            confirmButtonText: "Tutup",

            allowOutsideClick: false,

            allowEscapeKey: false,

            focusConfirm: true

        });

        return true;

    } catch (err) {

        console.error(err);

        return false;

    }

}