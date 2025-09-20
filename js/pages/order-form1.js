let authRequest = false;
let tablePelanggan;
let offset = 0;
let limit = 20;
let isLoading = false;
let lastSearch = "";
let orderColumn = "nama";
let orderDir = "asc";
let resetOffset = false;
$(document).ready(function() {
  $('#fullname').trigger('focus');
  loadSettings();

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
    // dropdownParent: $('#modalBranch'),
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

  const urlParams = new URLSearchParams(window.location.search);
  const branchId = urlParams.get('branch');

  if (!branchId) {
    // Tampilkan modal jika tidak ada branch
    $('#modalBranch').modal('show');
  } else {
    // Set nilai jika ada branch di URL
    $('#idBranch').val(branchId);
    // $('#textBranch').text("Cabang #" + branchId);
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

});


$('#tambahBaris').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1 pt-2">
          <select class="form-select forex"></select>
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control amount text-end" min="0">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control rate text-end" ${authRequest ? '' : 'readonly'} min="0">
        </td>
        <td class="px-1 pt-2">
          <input type="number" class="form-control subtotal text-end" readonly>
        </td>
        <td class="px-1 pt-2"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#tabelDetail tbody').append(baris);

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
    $(this).closest('tr').remove();
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
  $('#tabelDetail tbody').empty();
});

$('#tabelDetail').on('input', '.amount, .rate', function () {
  let $row = $(this).closest('tr');
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

// modal

function loadMoreData(reset = false) {
    if (isLoading) return;

    // --- tambahkan potongan berikut ---
    const searchInput = document.querySelector(".boxHeader input");
    const searchValue = searchInput ? searchInput.value.trim() : "";
    if (searchValue.length < 5) {
        // jika tabel sudah berisi, kosongkan (opsional)
        if (reset || tablePelanggan?.rows().any()) {
            tablePelanggan.clear().draw(false);
            offset = 0;
        }
        return;
    }

    isLoading = true;

    let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

    fetch(`${url_api}/profile/datatable?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Client-Domain": myDomain
        }
    })
        .then(res => res.json())
        .then(res => {
            if (reset) {
                offset = limit;
                tablePelanggan.clear().rows.add(res.data).draw(false);
            } else {
                offset += limit;
                tablePelanggan.rows.add(res.data).draw(false);
            }
            isLoading = false;
        })
        .catch(() => isLoading = false);
}


$('#modalPelanggan').on('shown.bs.modal', function () {
  $('#filterPelanggan').trigger('focus');
  if (!$.fn.DataTable.isDataTable("#tabelPelanggan")) {
      tablePelanggan = new DataTable("#tabelPelanggan", {
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
              { data: "kode", orderable: true },
              { data: "nama", orderable: true },
              { data: "email", orderable: true },
              { data: "id", orderable: true },
              { data: "telepon", orderable: true },
              { data: "noindex", visible: false },
              { data: "negara", visible: false },
              { data: "pekerjaan", visible: false },
              { data: "alamat", visible: false },
          ],
          dom: 't',
      });

      document.querySelector("#tabelPelanggan_wrapper .dt-scroll-body").addEventListener("scroll", function () {
          if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
              loadMoreData();
          }
      });

      tablePelanggan.on("order.dt", function () {
          let order = tablePelanggan.order();
          let columnIndex = order[0][0];
          let direction = order[0][1];
          let columnMapping = ["kode", "nama", "email", "id", "telepon"];
          orderColumn = columnMapping[columnIndex] || "nama";
          orderDir = direction;
          resetOffset = true;
          loadMoreData(true);
      });

      let typingTimer; // untuk menyimpan timeout
      const doneTypingInterval = 1000;
      document.querySelector(".boxHeader input").addEventListener("keyup", function () {
        const input = this;
        clearTimeout(typingTimer); // batalkan timer sebelumnya

        typingTimer = setTimeout(() => {
            const searchValue = input.value;
            if (searchValue !== lastSearch) {
                lastSearch = searchValue;
                loadMoreData(true); // hanya eksekusi jika sudah selesai mengetik
            }
        }, doneTypingInterval);
      });
  } else {
      tablePelanggan.clear().draw();
  }

  offset = 0;
  lastSearch = "";
  orderColumn = "nama";
  orderDir = "asc";
  // loadMoreData(true);

  $('#tabelPelanggan tbody').on('dblclick', 'tr', function () {
      // alert('sapi');
      let rowData = tablePelanggan.row(this).data();
      if (!rowData) return;
      const countryData = { id: rowData.negara, text: rowData.negara + ' - ' + rowData.nama_int_negara };
      const countryOption = new Option(countryData.text, countryData.id, true, true);

      $('#indexExisting').val(rowData.noindex);
      $('#fullname').val(rowData.nama);
      $('#email').val(rowData.email);
      $('#waNumber').val(rowData.telepon);
      $('#idNumber').val(rowData.id);
      $('#occupation').val(rowData.pekerjaan);
      $('#nationality').append(countryOption).trigger('change');
      $('#address').val(rowData.alamat);
      $('#divPilihPelanggan').addClass('d-none');
      $('#divKodeExisting').removeClass('d-none');
      $('#kodeExisting').val(rowData.kode);

      $('#modalPelanggan').modal('hide');
  });

  $('#filterPelanggan').on('keydown', function(e) {
      if (e.key === 'Enter') {
          e.preventDefault(); 
          const $firstRow = $('#tabelPelanggan tbody tr:visible').first();

          if ($firstRow.length) {
              $firstRow.trigger('dblclick');
          }
      }
  });
});

$('#btnReset').click(function(e) {
  e.preventDefault(); 
  $('#formOrder')[0].reset(); 
  $('#nationality').val('').trigger('change');
  $('#divPilihPelanggan').removeClass('d-none');
  $('#divKodeExisting').addClass('d-none');
  $('#kodeExisting').val();
});

// submit
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
  $('#tabelDetail tbody tr').each(function () {
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
  const kodeExist = $('#kodeExisting').val();
  if (idExist && idExist != '') {
    submitOrder(idExist, kodeExist, tipeTransaksi, details);
  } else {
    let idFoto = null;
    const fotoFile = $('#paspor')[0].files[0]; 
    const namaFoto = $('#fullname').val();

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
    const dataProfil = {
      nama: $('#fullname').val(),
      email: $('#email').val(),
      id: $('#idNumber').val(),
      telepon: $('#waNumber').val(),
      negara: $('#nationality').val(),
      alamat: $('#address').val(),
      pekerjaan: $('#occupation').val(),
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
        const idBaru = response.noindex;
        const kodeBaru = response.kode;
        submitOrder(idBaru, kodeBaru, tipeTransaksi, details);
      },
      error: function (xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON.message
        });
        $btn.removeAttr('disabled');
        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        }
      }
    });
  }
});

function submitOrder(idPelanggan, kodePelanggan, tipeTransaksi, details) {
  const formData = {
    idPelanggan: idPelanggan,
    tipeTransaksi: tipeTransaksi,
    cabang: $('#idBranch').val(),
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
          // Arahkan ke halaman receipt
          window.location.href = '/order-preview?order=' + response.nomor;
        } else if (result.isDenied) {
          $('#tabelDetail tbody').empty();
          $('#btnSubmit').removeAttr('disabled');
          $('#divPilihPelanggan').addClass('d-none');
          $('#divKodeExisting').removeClass('d-none');
          $('#kodeExisting').val(kodePelanggan);
          $('#indexExisting').val(idPelanggan);
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

$('#modalRequest').on('shown.bs.modal', function () {
  $('#emailReq').trigger('focus');
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

function loadSettings() {
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
            // $('#namaUsaha').val(response.NamaPT.strval);
            // $('#idUserBI').val(response.IDuserBI.strval);
            // $('#batasJam').val(response.LimitJam3.boolval);
            // $('#rateJual').val(response.SellBlank.boolval);
            // $('#desain').val(response.InvoiceDesain.strval);
            // $('#subheader').val(response.Subheader.strval);
            // valasDisplayed = response.ValasDisplay.strval;
            $('#namaPT').text(response.NamaPT.strval);
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
            $('#logoForm').html(`
                <img src="${imgURL}" alt="Logo" style="height:50px;">
            `);
            $('#logoForm').addClass('mb-3');
            $('#boxLogo').addClass('d-flex flex-column');
        } else {
          $('#logoForm').removeClass('mb-3');
        }
    };

    // xhr.onerror = function () {
    //     $('#targetLogo').empty();
    // };

    xhr.send();
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