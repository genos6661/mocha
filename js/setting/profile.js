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
            $('#isPelangganOld').val(response.data.pelanggan);
            $('#isKaryawanOld').val(response.data.karyawan);
            $('#isVendorOld').val(response.data.vendor);
            $('#isOtherOld').val(response.data.other);
            $('#roleOld').val(response.data.role);

            if (response.data.negara && response.data.negara != '') {
                const option = new Option(response.data.negara + ' - ' + response.data.nama_negara, response.data.negara, true, true);
                $('#negara').append(option).trigger('change');
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
    // const logoUrl = url_api + '/setting/logo/';

    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', logoUrl, true);
    // xhr.setRequestHeader('X-Client-Domain', myDomain);
    // xhr.responseType = 'blob';

    // xhr.onload = function () {
    //     if (xhr.status === 200) {
    //         const imgBlob = xhr.response;
    //         const imgURL = URL.createObjectURL(imgBlob);
    //         $('#boxLogo').html(`
    //             <h5>Logo : </h5>
    //             <img src="${imgURL}" alt="Logo" style="height:80px; cursor: pointer;" data-bs-toggle="modal" data-bs-target="#modalHapusLogo">
    //         `);
    //     } else {
    //         // Tidak ditemukan atau error lain
    //         $('#boxLogo').empty(); // atau tampilkan default/fallback
    //     }
    // };

    // xhr.onerror = function () {
    //     $('#targetLogo').empty();
    // };

    // xhr.send();
}

$('#password').keyup(function (e) {
    e.preventDefault();
    let pass = $(this).val();
    if(pass != '') {
        $('#boxOldPassword').removeClass('d-none');
    } else {
        $('#boxOldPassword').addClass('d-none');
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
        pelanggan: $('#isPelangganOld').val(),
        karyawan: $('#isKaryawanOld').val(),
        vendor: $('#isVendorOld').val(),
        other: $('#isOtherOld').val(),
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
            if(email !== oldData.email || password !== '' || password !== null) {
                console.log('ganti password');
                if(oldPassword == '') {
                    notif.fire({
                      icon: 'error',
                      text: 'Input Old Password First'
                    });
                    return false;
                }

                submitUser(idUser, username, email, password, oldPassword);
            } else {
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