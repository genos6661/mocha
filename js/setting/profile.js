let oldData = [];
$(document).ready(function () {
    $('#negara').select2({
        // dropdownParent: $('#modalTambah'),
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
    loadProfile();
});

function loadProfile() {
    $.ajax({
        url: url_api + '/users/profile',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            oldData = response.data;
            $('#headerInfo').text(response.data.username + ' - ' + response.data.nama_role);
            $('#kode').text('#' + response.data.kode);
            $('#nama').val(response.data.nama);
            $('#telepon').val(response.data.telepon);
            $('#nomorID').val(response.data.nik);
            $('#jabatan').val(response.data.pekerjaan);
            $('#alamat').val(response.data.alamat);
            $('#email').val(response.data.email);
            $('#idUser').val(response.data.id_user);
            $('#idProfile').val(response.data.id_profile);
            $('#username').val(response.data.username);
            $('#kodeOld').val(response.data.kode);
            $('#jkOld').val(response.data.jk);
            $('#jenisIDOld').val(response.data.jenis_id);
            $('#tipeKontakOld').val(response.data.tipe_kontak);
            $('#rekeningOld').val(response.data.rekening);
            $('#isPelangganOld').val(response.data.pelanggan);
            $('#isKaryawanOld').val(response.data.karyawan);
            $('#isVendorOld').val(response.data.vendor);
            $('#isMemberOld').val(response.data.member);
            $('#roleOld').val(response.data.role);

            if (response.data.negara && response.data.negara != '') {
                const option = new Option(response.data.negara + ' - ' + response.data.nama_negara, response.data.negara, true, true);
                $('#negara').append(option).trigger('change');
            }

            loadFotoProfile(response.data.id_profile);
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
}

function loadFotoProfile(idProfile) {

    const xhr = new XMLHttpRequest();

    xhr.open(
        'GET',
        `${url_api}/profile/paspor/${idProfile}`,
        true
    );

    xhr.responseType = 'blob';

    xhr.setRequestHeader('Authorization', `Bearer ${window.token}`);
    xhr.setRequestHeader('X-Client-Domain', myDomain);

    xhr.onload = function () {

        if (xhr.status === 200) {

            const blob = xhr.response;
            const contentType = xhr.getResponseHeader('Content-Type') || '';

            if (contentType.startsWith('image/')) {

                const imgURL = URL.createObjectURL(blob);
                $('#uploadedAvatar').attr('src', imgURL);

            }

        }

    };

    xhr.send();

}

$('#password, #username, #email').keyup(function (e) {
    e.preventDefault();
    let pass = $('#password').val();
    let username = $('#username').val();
    let email = $('#email').val();
    if(pass == '' && email == oldData.email && username == oldData.username) {
        $('#boxOldPassword').addClass('d-none');
    } else {
        $('#boxOldPassword').removeClass('d-none');
    }
});

$('#editBtn').click(function (e) {
    e.preventDefault();

    $(this).hide();
    $('#submitBtn').show();
    $('#cancelBtn').show();

    $('input').removeAttr('readonly');
});

$('#cancelBtn').click(function (e) {
    e.preventDefault();

    $(this).hide();
    $('#submitBtn').hide();
    $('#editBtn').show();
    loadProfile();
    $('input').prop('readonly', true);
});

$('#submitBtn').click(function (e) {
    e.preventDefault(); 
    
    const idUser = $('#idUser').val();
    const idProfile = $('#idProfile').val();
    const username = $('#username').val();
    const role = $('#roleOld').val();
    const password = $('#password').val();
    const oldPassword = $('#oldPassword').val();
    const email = $('#email').val();
    const telepon = $('#telepon').val();

    const formData = {
        nama: $('#nama').val(),
        pekerjaan: $('#jabatan').val(),
        telepon: telepon,
        email: email,
        negara: $('#negara').val(),
        alamat: $('#alamat').val(),
        id: $('#nomorID').val(),
        kode: $('#kodeOld').val(),
        tipe: $('#tipeKontakOld').val(),
        id_type: $('#jenisIDOld').val(),
        jk: $('#jkOld').val(),
        rekening: $('#rekeningOld').val(),
        pelanggan: $('#isPelangganOld').val(),
        karyawan: $('#isKaryawanOld').val(),
        vendor: $('#isVendorOld').val(),
        member: $('#isMemberOld').val(),
    };

    $.ajax({
        url: url_api + '/profile/' + idProfile,
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        data: JSON.stringify(formData), 
        success: function (response) {
            if (email === oldData.email && username === oldData.username && (password.trim() == '' || password === null)) {
                console.log('tidak ganti password');
                notif.fire({
                    icon: 'success',
                    text: response.message
                }).then((result) => {
                    $('#password').val('');
                    $('#boxOldPassword').val('').hide();
                    $('#cancelBtn').hide();
                    $('#submitBtn').hide();
                    $('#editBtn').show();
                    loadProfile();
                    $('input').prop('readonly', true);
                });
            } else {
                console.log(email + oldData.email + password);
                if(oldPassword == '') {
                    notif.fire({
                      icon: 'error',
                      text: 'Input Old Password First'
                    });
                    return false;
                }

                submitUser(idUser, username, email, password, oldPassword);
            }
        },
        error: function (xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
});

function submitUser(idUser, nama, email, password, oldPassword) {
  const formData = {
    nama: nama,
    email: email,
    password: password,
    old_password: oldPassword
  };

  $.ajax({
    url: url_api + '/users/self/' + idUser,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify(formData),
    success: function (response) {
        notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            $('#password').val('');
            $('#boxOldPassword').val('').hide();
            $('#cancelBtn').hide();
            $('#submitBtn').hide();
            $('#editBtn').show();
            loadProfile();
            $('input').prop('readonly', true);
        });
    },
    error: function (xhr, status, error) {
      $('#submitBtn').removeAttr('disabled');
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
    }
  });
}

function uploadFoto(file, namaFoto) {
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
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Foto berhasil diperbarui.'
                });
                loadFotoProfile(namaFoto);
            },

            error: function (xhr) {
                reject(xhr.responseJSON || {
                    message: 'Gagal upload file'
                });
            }

        });

    });
}

$('#upload').on('change', async function () {

    const file = this.files[0];

    if (!file) return;

    try {

        await uploadFoto(
            file,
            oldData.id_profile
        );

    } catch (err) {

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: err.message || 'Terjadi kesalahan.'
        });

    }

    $(this).val('');

});

$('#hapusFoto').on('click', function () {

    Swal.fire({
        title: 'Hapus Foto?',
        text: 'Foto paspor akan dihapus secara permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {

        if (!result.isConfirmed) return;

        $.ajax({
            url: `${url_api}/profile/paspor/${oldData.id_profile}`,
            type: 'DELETE',
            headers: {
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            },
            success: function (res) {

                notif.fire({
                    icon: 'success',
                    text: res.message
                });

                // Kembalikan ke avatar default
                $('#uploadedAvatar').attr(
                    'src',
                    '../../assets/img/avatars/1.png'
                );

            },
            error: function (xhr) {

                notif.fire({
                    icon: 'error',
                    text: xhr.responseJSON?.message || 'Gagal menghapus foto'
                });

            }
        });

    });

});