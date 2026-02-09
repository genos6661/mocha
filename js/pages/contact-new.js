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