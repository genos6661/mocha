$(document).ready(function () {
  $('#selectBranch').select2({
    dropdownParent: $('#modalBranch'),
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
    placeholder: 'Choose Branch'
  });

  $('#nationality').select2({
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

  let occupationData = [];

  $.getJSON('/occupation.json', function (data) {
    occupationData = data;

    $('#occupation').select2({
      placeholder: 'Choose Occupation',
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

  let authRequest, SellBlank;
  const urlParams = new URLSearchParams(window.location.search);
  const branchId = urlParams.get('branch');
  const cookieUserID = "userID";
  const cookieUser = "userData";
  const cookieConfirm = "confirm";
  const cookieSetting = "setting";
  const logoKey = "cachedLogo";
  let savedUser = getCookie(cookieUser);
  let savedConfirm = getCookie(cookieConfirm);
  let savedSetting = getCookie(cookieSetting);
  let cachedLogo = sessionStorage.getItem(logoKey);
  let parsedSetting = [];

  if (!branchId) {
    $('#modalBranch').modal('show');
  } else {
    $('#idBranch').val(branchId);
    if(savedUser) {
      getProfile(function(profile) {
        if(savedConfirm) {
          showTransaksi(profile.noindex, profile.nama);
        } else {
          // tampilkan modal Konfirmasi
          $('.dataDetail').text('');
          $('#kodeDetail').text(getCookie(cookieUser));
          $('#namaDetail').text(profile.nama);
          $('#teleponDetail').text(profile.telepon);
          $('#alamatDetail').text(profile.alamat);
          $('#idDetail').text(profile.id);
          $('#emailDetail').text(profile.email);
          $('#negaraDetail').text(profile.nama_int_negara);
          $("#btnYa").click(function () {
            setSessionCookie(cookieConfirm, "true");
            $("#modalKonfirmasi").modal("hide");
            showTransaksi(profile.noindex, profile.nama);
          });

          $("#btnTidak").click(function () {
            eraseCookie(cookieUser);
            eraseCookie(cookieUserID);
            $("#modalKonfirmasi").modal("hide");
            $('#modalPilihan').modal('show');
          });
          $('#modalKonfirmasi').modal('show');
        }
      });
    } else {
      $('#modalPilihan').modal('show');
    }
  }

  getSetting();

  function getProfile(callback) {
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

    const idExist = getCookie(cookieUserID);
    $.ajax({
      url: url_api + `/profile/id/${idExist}`,
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.token}`,
          "X-Client-Domain": myDomain
      },
      success: function (data) {
          if (callback) callback(data);
          if (document.querySelector(`.notiflix-loading`)) {
              Loading.remove();
          }
      },
      error: function (xhr) {
          console.error('Gagal mengambil data detail:', xhr);
          notif.fire({
            icon: 'error',
            text: xhr.responseJSON.message
          });
          eraseCookie(cookieUserID);
          eraseCookie(cookieUser);
          if (document.querySelector(`.notiflix-loading`)) {
              Loading.remove();
          }
      }
    });
  }

  $('#sbmBranch').on('click', function () {
    const selectedBranch = $('#selectBranch').val();
    if (!selectedBranch) {
      notif.fire({
        icon: 'error',
        text: 'Please select any branch'
      });
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    window.location.href = `${currentUrl}?branch=${selectedBranch}`;
  });

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
  }

  function setSessionCookie(name, value) {
    document.cookie = name + "=" + (value || "") + "; path=/";
  }

  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
  }

  function showTransaksi(index, nama) {
    $('#indexExisting').val(index);
    $("#namaProfil").text(nama);
    $("#cardProfile").addClass("d-none");
    $("#cardOrder").removeClass("d-none");
    if (window.token) {
      $('#boxResetProfile').removeClass('d-none');
    }
    $('#tambahBaris').trigger('click');
  }

  $('.btnDaftar').click(function (e) {
    e.preventDefault();
    $('#modalPilihan').modal('hide');
    $('#modalPelanggan').modal('hide');
    $('#cardProfile').removeClass('d-none');
    $('#fullname').trigger('focus');
  });

  $('.btnCari').click(function (e) {
    e.preventDefault();
    $('#modalPilihan').modal('hide');
    $('#modalPelanggan').modal('show');
  });

  $('#modalPelanggan').on('shown.bs.modal', function (e) {
    e.preventDefault();
    $('#inputCari').trigger('focus');
  });

  // ~~~~~~~~~~~~~~~~~ details functions ~~~~~~~~~~~~~~~~~~
  $('#tambahBaris').on('click', function () {
    const isSelling = $('#sell').is(':checked');
    const allowEdit = authRequest || (isSelling && SellBlank === true);
    let baris = $(`
    <div class="row g-2 align-items-center border-top py-md-2 py-3 mb-3 mb-md-0">
      <div class="col-12 col-md-3">
        <select class="form-select forex"></select>
      </div>

      <div class="col-6 col-md-2">
        <input type="number" class="form-control amount text-end" min="0" placeholder="Amount">
      </div>

      <div class="col-6 col-md-3">
        <input type="number" class="form-control rate text-end" ${allowEdit ? '' : 'readonly'} min="0" placeholder="Rate">
      </div>

      <div class="col-6 col-md-3">
        <input type="number" class="form-control subtotal text-end" placeholder="Subtotal" readonly>
      </div>

      <div class="col-6 col-md-1 text-center">
        <button class="btn btn-outline-danger btnHapusBaris" type="button" title="Hapus Baris">
          <i class="icon-base ti tabler-trash"></i>
        </button>
      </div>
    </div>
  `);
    $('#tabelDetail').append(baris);

    let $selectForex = baris.find('.forex').first();
    let $inputRate = baris.find('.rate').first();

    $selectForex.select2({
      ajax: {
        url: url_api + '/forex/select2',
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
      placeholder: 'Choose Forex'
    });

    $selectForex.on('change', function () {
        const idForex = $(this).val();
        if (!idForex) return;

        updateRates(idForex, $inputRate);
        // updateSatuanProduk(idProduk, $selectSatuan);
    });
  });

  $('#tabelDetail').on('click', '.btnHapusBaris', function () {
      $(this).closest('.row').remove();
  });

  function updateRates(idForex, $inputRate) {
    $.ajax({
        url: `${url_api}/forex/id/${idForex}`,
        type: 'GET',
        headers: {
            "X-Client-Domain": myDomain
        },
        success: function(response) {
          $isBuy = $('#buy');
          if($isBuy.prop('checked')) {
            $inputRate.val(response.beli);
          } else {
            $inputRate.val(response.jual);
          }
        },
        error: function(xhr) {
            console.error('Error:', xhr.responseJSON?.message);
            $inputRatee.val(0);
        }
    });
  }

  $(document).on('change', 'input[name="tipeTrans"]', function () {
    $('#tabelDetail').empty();
    $('#tambahBaris').trigger('click');
  });

  $('#tabelDetail').on('input', '.amount, .rate', function () {
    let $row = $(this).closest('.row');
    let amount = parseFloat($row.find('.amount').val()) || 0;
    let rate = parseFloat($row.find('.rate').val()) || 0;
    let subtotal = amount * rate;
    $row.find('.subtotal').val(subtotal.toFixed(2));
    updateTotal();
  });

  function updateTotal() {
    let total = 0;
    $('.subtotal').each(function () {
      let val = parseFloat($(this).val()) || 0;
      total += val;
    });
    $('.total').val(total.toFixed(2));
  }

  function initSelect2() {
    $('#pekerjaan').select2({
      dropdownParent: $('#modalSign'),
      ajax: {
        url: url_api + '/referensi/select2?kategori=pekerjaan',
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
      placeholder: 'Choose Occupation'
    });

    $('#penghasilan').select2({
      dropdownParent: $('#modalSign'),
      ajax: {
        url: url_api + '/referensi/select2?kategori=penghasilan',
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
      placeholder: 'Choose Income'
    });

    $('#bentuk_pt').select2({
      dropdownParent: $('#modalSign'),
      ajax: {
        url: url_api + '/referensi/select2?kategori=jenis_pt',
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
      placeholder: 'Choose Company Form'
    });

    $('#tujuan').select2({
      dropdownParent: $('#modalSign'),
      ajax: {
        url: url_api + '/referensi/select2?kategori=maksud_tujuan',
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
      placeholder: 'Choose Transaction Purpose'
    });

    $('#sumber').select2({
      dropdownParent: $('#modalSign'),
      ajax: {
        url: url_api + '/referensi/select2?kategori=sumber_dana',
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
      placeholder: 'Choose Source of fund'
    });
  }

  function getSetting() {
    if (cachedLogo) {
      $('.logoForm').html(`<img src="${cachedLogo}" alt="Logo" style="height:50px;">`);
      $('.logoForm').addClass('mb-3');
      $('.boxLogo').addClass('d-flex flex-column');
    } else {
      const logoUrl = url_api + '/setting/logo/';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', logoUrl, true);
      xhr.setRequestHeader('X-Client-Domain', myDomain);
      xhr.responseType = 'blob';

      xhr.onload = function () {
        if (xhr.status === 200) {
          const reader = new FileReader();
          reader.onloadend = function () {
            const base64Data = reader.result;
            sessionStorage.setItem(logoKey, base64Data);
            $('.logoForm').html(`<img src="${base64Data}" alt="Logo" style="height:50px;">`);
            $('.logoForm').addClass('mb-3');
            $('.boxLogo').addClass('d-flex flex-column');
          };
          reader.readAsDataURL(xhr.response);
        } else {
          $('#logoForm').removeClass('mb-3');
        }
      };

      xhr.send();
    }

    if(savedSetting) {
      parsedSetting = JSON.parse(savedSetting);
      if(parsedSetting.SellBlank.boolval == 1) {
        SellBlank = true;
      }
      $('.namaPT').text(parsedSetting.NamaPT.strval);
    } else {
      $.ajax({
          url: url_api + '/setting/customer-display',
          type: 'GET',
          contentType: 'application/json',
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${window.token}`,
              "X-Client-Domain": myDomain
          },
          success: function (response) {
              
              setSessionCookie(cookieSetting, JSON.stringify(response));
              if(response.SellBlank.boolval === 1) {
                sellBlank = true;
                $('.rate').prop('readonly', false);
              }
              $('.namaPT').text(response.NamaPT.strval);
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
  }

  $('#modalRequest').on('shown.bs.modal', function () {
    $('#emailReq').trigger('focus');
  });

  $('#resetProfile').click(function () {
    const branch = $('#idBranch').val();
    eraseCookie(cookieUser);
    eraseCookie(cookieUserID);
    window.location.href = '/order-form?branch=' + branch;
  });

  $('#sbmRequest').click(function (e) {
    e.preventDefault();

    const data = {
      email: $('#emailReq').val(),
      password: $('#passwordReq').val()
    };

    $.ajax({
      url: url_api + '/users/request',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
      },
      data: JSON.stringify(data),
      success: function (response) {
        if (response.success) {
          authRequest = true;
          $('#modalRequest input').val('');
          $('#modalRequest').modal('hide');
          $('.rate').prop('readonly', false);
          $('#requestUser').val(response.user.nama);
        } else {
          notif.fire({
            icon: 'error',
            text: response.message
          });
        }
      },
      error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
      }
    });
  });

  // Submit form pengguna
  $("#sbmProfil").click(async function (e) {
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
    const namaFoto = $('#fullname').val();

    if (fotoFile) {
        try {
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

    isMale = $('#male');
    if (isMale.prop('checked')) {
      jk = 'M';
    } else {
      jk = 'F';
    }
    
    const dataProfil = {
      nama: $('#fullname').val().trim(),
      tipe: $('#tipe').val(),
      email: $('#email').val().trim(),
      id: $('#idNumber').val().trim(),
      telepon: $('#waNumber').val().trim(),
      negara: $('#nationality').val(),
      alamat: $('#address').val().trim(),
      pekerjaan: $('#occupation').val(),
      jk: jk,
      id_type: $('#id_type').val(),
      rekening: '',
      pelanggan: 1,
      karyawan: 0,
      vendor: 0,
      other: 0,
      id_foto: idFoto || null 
    };

    $.ajax({
      url: url_api + '/profile',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
      },
      data: JSON.stringify(dataProfil),
      success: function (response) {
        setCookie(cookieUser, response.kode, 30); 
        setCookie(cookieUserID, response.noindex, 30); 
        setSessionCookie(cookieConfirm, "true"); 
        notif.fire({
          icon: 'success',
          text: response.message
        });
        showTransaksi(response.noindex, dataProfil.nama);
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

  $('#goSearch').click(function (e) {
    e.preventDefault();
    goSearch();
  });

  $('#inputCari').on('keypress', function (e) {
      if (e.which === 13) { 
          e.preventDefault(); 
          goSearch();
      }
  });

  function goSearch() {
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

    const cari = $('#inputCari').val();

    if (cari === '') {
      notif.fire({
        icon: 'error',
        text: 'Please Input your identification'
      });
      if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
      }
      return;
    }

    $.ajax({
      url: url_api + '/profile/find/' + cari,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
      },
      success: function (response) {
        $('#findKode').text(response.kode);
        $('#findNama').text(response.nama);
        $('#findID').text(response.ID);
        $('#findEmail').text(response.email);
        $('#findTelepon').text(response.telepon); 
        $('#findAlamat').text(response.alamat);
        $('#findNegara').text(response.nama_int_negara);
        $('.findBox').removeClass('d-none');
        $('.searchBox').addClass('d-none');

        $("#btnFindYa").click(function () {
          setSessionCookie(cookieConfirm, "true");
          setCookie(cookieUser, response.kode, 30);
          setCookie(cookieUserID, response.noindex, 30);
          $("#modalPelanggan").modal("hide");
          showTransaksi(response.noindex, response.nama);
        });

        $("#btnFindTidak").click(function () {
          $('.findBox').addClass('d-none');
          $('.searchBox').removeClass('d-none');
        });
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
      }
    });
  }

  // Proses Order
  $('#btnSubmit').click(async function (e) {
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

    const $btn = $(this);
    if ($btn.prop('disabled')) return;

    $btn.prop('disabled', true);

    let tipeTransaksi = '';

    $isBuy = $('#buy');
    if ($isBuy.prop('checked')) {
      tipeTransaksi = 'buy';
    } else {
      tipeTransaksi = 'sell';
    }

    const details = [];
    $('#tabelDetail .row').each(function () {
      const forex = $(this).find('select.forex').val();
      const amount = parseFloat($(this).find('.amount').val());
      const rate = parseFloat($(this).find('.rate').val());

      if (forex && amount && rate) {
        details.push({
          forex: forex,
          amount: amount,
          rate: rate
        });
      }
    });

    const idExist = $('#indexExisting').val();

    submitOrder(idExist, tipeTransaksi, details);
  });

  function submitSign(idPelanggan, nomor, cabang) {
    const formData = {
      id_pelanggan: idPelanggan,
      npwp: $('#npwp').val(),
      domisili: $('#domisili').val(),
      penghasilan: $('#penghasilan').val(),
      bentuk_pt: $('#bentuk_pt').val(),
      bidang_usaha: $('#bidang_usaha').val(),
      perusahaan: $('#perusahaan').val(),
      pekerjaan: $('#pekerjaan').val(),
      jabatan: $('#jabatan').val(),
      tujuan: $('#tujuan').val(),
      hubungan: $('#hubungan').val(),
      sumber: $('#sumber').val()
    };

    $.ajax({
      url: url_api + '/profile/dokumen',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
      },
      data: JSON.stringify(formData),
      success: function (response) {
        $('#modalSign .modal-body').find('input, select, textarea').val('').prop('checked', false).prop('selected', false);
        $('#modalSign').modal('hide');
        Swal.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            showDenyButton: true,
            confirmButtonText: 'Order Receipt',
            denyButtonText: 'Make another order',
            customClass: {
              denyButton: 'btn btn-secondary',
              confirmButton: 'btn btn-primary'
            },
            reverseButtons: true,
            allowOutsideClick: false, 
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/order-preview?order=' + nomor;
            } else if (result.isDenied) {
              window.location.href = '/order-form?branch=' + cabang;
            }
          });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
      },
      error: function (xhr, status, error) {
        $('#btnSubmit').removeAttr('disabled');
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
      }
    });
  }

  function submitOrder(idPelanggan, tipeTransaksi, details) {
    const cabang = $('#idBranch').val();
    const formData = {
      idPelanggan: idPelanggan,
      tipeTransaksi: tipeTransaksi,
      cabang: cabang,
      tanggal: new Date().toISOString().split('T')[0],
      request: $('#requestUser').val(),
      details: details
    };

    $.ajax({
      url: url_api + '/order',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
      },
      data: JSON.stringify(formData),
      success: function (response) {
        if (response.isExceed) {
          const canvas = document.getElementById('signature-pad');
          const signaturePad = new SignaturePad(canvas);
          $("#btnSignClear").click(function () {
            signaturePad.clear();
          });
          $("#btnSignSubmit").click(function () {
            submitSign(idPelanggan, response.nomor, cabang);
          });
          initSelect2();
          $('#modalSign').modal('show');
          if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
          }
        } else {
          Swal.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            showDenyButton: true,
            confirmButtonText: 'Order Receipt',
            denyButtonText: 'Make another order',
            customClass: {
              denyButton: 'btn btn-secondary',
              confirmButton: 'btn btn-primary'
            },
            reverseButtons: true,
            allowOutsideClick: false, 
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/order-preview?order=' + response.nomor;
            } else if (result.isDenied) {
              window.location.href = '/order-form?branch=' + cabang;
            }
          });
        }
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
      },
      error: function (xhr, status, error) {
        $('#btnSubmit').removeAttr('disabled');
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
      }
    });
  }
});