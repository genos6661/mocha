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
        // kode: $('#kode').val(),
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
        tempat_lahir: $('#tempat_lahir').val(),
        tanggal_lahir: $('#tanggal_lahir').val(),
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
            $('#modalTambah .modal-body, #modalKontakBaru .modal-body').find('input, textarea').val('').prop('checked', false);
            $('#negara, #pekerjaan').val(null).trigger('change');
            notif.fire({
              icon: 'success',
              text: response.message
            }).then(() => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
            });
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
    let idFoto = $('#paspor')[0].files[0] ? idFoto : null; 
    isFemale = $('#female');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }

    const formData = {
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

        success: function (response) {
            $('#modalTambah .modal-body, #modalKontakBaru .modal-body').find('input, textarea').val('').prop('checked', false);
            $('#negara, #pekerjaan').val(null).trigger('change');
            notif.fire({
              icon: 'success',
              text: response.message
            }).then(() => {
                offset = 0;
                table.clear().draw();
                loadMoreData();
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