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

  $('#cabangReg').select2({
    // dropdownParent: $('#modalFilter'),
    ajax: {
      url: url_api + '/cabang/select2',
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
    placeholder: 'Choose Branch',
    allowClear: true
  });

  if(!userPermissions.includes('register')) {
    $('#sbmReg').attr('disabled', true);
  }
}

$('#sbmReg').click(function (e) {
  e.preventDefault();

  let jk = 'M';
  isFemale = $('#female');
  if (isFemale.prop('checked')) {
    jk = 'F';
  } else {
    jk = 'M';
  }

  const dataProfil = {
    nama: $('#namaReg').val(),
    email: $('#emailReg').val(),
    id: $('#nomorIDReg').val(),
    telepon: $('#teleponReg').val(),
    negara: $('#negaraReg').val(),
    alamat: $('#alamatReg').val(),
    pekerjaan: $('#pekerjaanReg').val(),
    jk: jk,
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

function submitUser(idProfile) {
  const formData = {
    email: $('#emailReg').val(),
    password: $('#passwordReg').val(),
    nama: $('#usernameReg').val(),
    telepon: $('#teleponReg').val(),
    profile: idProfile,
    role: $('#roleReg').val(),
    request: $('#request').is(':checked') ? 1 : 0,
    cabang: $('#cabangReg').val()
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
          $('#cabangReg').val(null).trigger('change');
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

function submitForce() {
    isFemale = $('#female');
    if (isFemale.prop('checked')) {
      jk = 'F';
    } else {
      jk = 'M';
    }

    const formData = {
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
      jk: jk,
      rekening: '',
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
            notif.fire({
              icon: 'success',
              text: response.message
            });
            const idBaru = response.noindex;
            submitUser(idBaru);
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