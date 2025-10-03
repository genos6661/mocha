function initRegister() {
  $('#roleReg').select2({
    // dropdownParent: $('#modalBranch'),
    ajax: {
      url: url_api + '/role/select2',
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
    placeholder: 'Choose Role'
  });

  $('#negaraReg').select2({
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

  $("#namaReg").on("keyup", function () {
    let value = $(this).val();
    $("#usernameReg").val(value);
  });

  if(!userPermissions.includes('register')) {
    $('#sbmReg').attr('disabled', true);
  }
}

$('#sbmReg').click(function (e) {
  e.preventDefault();

  let tipeTransaksi;

  const dataProfil = {
    nama: $('#namaReg').val(),
    email: $('#emailReg').val(),
    id: $('#nomorIDReg').val(),
    telepon: $('#teleponReg').val(),
    negara: $('#negaraReg').val(),
    alamat: $('#alamatReg').val(),
    pekerjaan: $('#pekerjaanReg').val(),
    id_type: 'KTP',
    tipe: 101,
    pelanggan: 0,
    karyawan: 1,
    vendor: 0,
    member: 0,
  };

  $.ajax({
    url: url_api + '/profile',
    type: 'POST',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify(dataProfil),
    success: function (response) {
      notif.fire({
        icon: 'success',
        text: response.message
      });
      const idBaru = response.noindex;
      submitUser(idBaru);
    },
    error: function (xhr, status, error) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
    }
  });
});

function submitUser(idProfile) {
  const formData = {
    email: $('#emailReg').val(),
    password: $('#passwordReg').val(),
    nama: $('#usernameReg').val(),
    telepon: $('#teleponReg').val(),
    profile: idProfile,
    role: $('#roleReg').val(),
    request: $('#request').is(':checked') ? 1 : 0
  };

  $.ajax({
    url: url_api + '/register',
    type: 'POST',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.token}`,
      "X-Client-Domain": myDomain
    },
    data: JSON.stringify(formData),
    success: function (response) {
      notif.fire({
        icon: 'success',
        text: response.message
      }).then((result) => {
          $('#formRegister')[0].reset();
          $('#roleReg').val(null).trigger('change');
      });
    },
    error: function (xhr, status, error) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
    }
  });
}
