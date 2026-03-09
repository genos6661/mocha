const urlParams = new URLSearchParams(window.location.search);
const orderNomor = urlParams.get('nomor');
$(document).ready(function() {
    if (!orderNomor) {
        Swal.fire({
	        title: 'Error',
	        text: 'Order Number Not Found',
	        icon: 'error',
	        showDenyButton: false,
	        confirmButtonText: 'Back To Order Page',
	        customClass: {
	          confirmButton: 'btn btn-primary'
	        },
	        reverseButtons: true,
	        allowOutsideClick: false, 
	        allowEscapeKey: false
	    }).then((result) => {
	        if (result.isConfirmed) {
	          window.location.href = '/order';
	        }
	    });
    } else {
        resetOrder();
    }
});

function resetOrder() {
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
              <img src="${imgURL}" alt="Logo" style="height: 35px;">
          `);
      }
  };

  xhr.send();
  
	$.ajax({
        url: url_api + '/order/nomor/' + orderNomor, 
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            $('#judulNota').text(response.judul_nota);
            $('#namaCabang').text(response.nama_cabang);
            $('#alamatCabang').text(response.alamat_cabang);
            $('#teleponCabang').text(response.telepon_cabang);
            $('#nomorOrder').text(response.nomor);
            $('#namaPelanggan').text(response.nama_pelanggan);
            $('#alamatPelanggan').text(response.alamat);
            $('#teleponPelanggan').text(response.telepon);
            $('#emailPelanggan').text(response.email);
            $('#kodePelanggan').text(response.kode_pelanggan);
            $('#idNumber').text(response.idNumber);
            $('#negara').text(response.nationality);
            $('#pekerjaan').text(response.pekerjaan);

           	let jenisTransaksi = "";
           	if(response.tipe == "buy") {
           		jenisTransaksi = "Buying Transaction";
           	} else if (response.tipe == "sell") {
           		jenisTransaksi = "Selling Transaction";
           	}
           	$('#jenisTransaksi').text(jenisTransaksi);
           	$('#tipeTrans').val(response.tipe);
           	$('#idOrder').val(response.noindex);
            $('#idCabang').val(response.cabang);

           	const tanggal = new Date(response.tanggal);
           	const formattedDate = tanggal.toLocaleDateString('en-US', {
						  year: 'numeric',
						  month: 'long',
						  day: 'numeric'
						});
           	$('#tanggalTransaksi').text(formattedDate);
            
            const details = response.details || [];

      			const tbody = $('#tabelDetail tbody');
      			tbody.empty();

      			if (details.length === 0) {
      				tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
      			} else {
      				let subtotal = 0;

      				details.forEach(function (item) {

                const jumlahFormatted = Number(item.jumlah).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                const rateFormatted = Number(item.rate).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                const totalPerItem = item.jumlah * item.rate;

                const subtotalFormatted = Number(totalPerItem).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                const row = $(`
                    <tr>
                      <td class="px-1">
                        <select class="form-select valas" data-init-value="${item.valas}" data-init-text="${item.kode} - ${item.nama}">
                          <option value="${item.valas}">${item.kode} - ${item.nama}</option>
                        </select>
                      </td>

                      <td class="px-1">
                        <input type="text"
                            class="form-control jumlah text-end"
                            value="${jumlahFormatted}" />
                      </td>

                      <td class="px-1">
                        <input type="text"
                            class="form-control rate text-end"
                            value="${rateFormatted}" />
                      </td>

                      <td class="px-1">
                        <input type="text"
                            class="form-control subtotal text-end"
                            value="${subtotalFormatted}" readonly />
                      </td>

                      <td class="px-1">
                        <button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris">
                            <i class="icon-base ti tabler-trash"></i>
                        </button>
                      </td>
                    </tr>
                `);

                let selectForex = row.find('.valas').first();
                let $inputRate = row.find('.rate').first();
                let $inputJumlah = row.find('.jumlah').first();
                let $inputSubtotal = row.find('.subtotal').first();

                initSelect2Valas(selectForex);
                tbody.append(row);

                selectForex.on('change', function () {
                    const idForex = $(this).val();
                    if (!idForex) return;

                    updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal);
                });
              });

      				$('#subtotal, #total').text(Number(subtotal).toLocaleString('id-ID', {
							  minimumFractionDigits: 2,
							  maximumFractionDigits: 2
							}));
      			}
        },
        error: function (xhr, status, error) {
            notif.fire({
              icon: 'error',
              text: xhr.responseJSON.message
            });
        },
    });
}

function initSelect2Valas(select) {
    const initVal = select.data('init-value');
    const initText = select.data('init-text');
    const cabang = $('#idCabang').val();

    // Init select2 dengan AJAX
    select.select2({
      placeholder: "Choose Forex",
      ajax: {
        url: url_api + '/forex/select2',
        dataType: 'json',
        headers: {
          "X-Client-Domain": myDomain
        },
        delay: 250,
        data: function (params) {
          return {
            search: params.term, cabang: cabang
          };
        },
        processResults: function (data) {
          return {
            results: data.results
          };
        }
      }
    });

    // Tambahkan option default jika belum ada
    if (initVal && !select.find(`option[value="${initVal}"]`).length) {
      const option = new Option(initText, initVal, true, true);
      select.append(option).trigger('change');
    }
}

$('#tambahBaris').on('click', function () {
    let baris = $(`
      <tr>
        <td class="px-1">
          <select class="form-select valas"></select>
        </td>
        <td class="px-1">
          <input type="text" class="form-control jumlah text-end">
        </td>
        <td class="px-1">
          <input type="text" class="form-control rate text-end">
        </td>
        <td class="px-1">
          <input type="text" class="form-control subtotal text-end" readonly>
        </td>
        <td class="px-1"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
      </tr>
    `);
    $('#tabelDetail tbody').append(baris);

    let $selectForex = baris.find('.valas').first();
    let $inputRate = baris.find('.rate').first();
    let $inputJumlah = baris.find('.jumlah').first();
    let $inputSubtotal = baris.find('.subtotal').first();

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

        updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal);
    });
});

const formatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

// FOCUS: hilangkan titik & ubah koma → titik
$('#tabelDetail').on('focus', '.jumlah, .rate', function () {
  let val = $(this).val() || "";
  val = val.replace(/\./g, ''); 
  $(this).val(val);
});

// BLUR: format kembali & hitung subtotal
$('#tabelDetail').on('blur', '.jumlah, .rate', function () {
  let $row = $(this).closest('tr');
  
  // --- Format input ---
  let val = $(this).val() || "";

  // buang karakter aneh
  val = val.replace(/[^0-9.,]/g, '');

  // normalisasi jika banyak koma/titik
  const parts = val.split(/[,\.]/);
  if (parts.length > 2) {
    val = parts[0] + '.' + parts.slice(1).join('');
  }

  // convert ke angka JS
  const numericVal = parseFloat(
    val.replace(/\./g, '')  // titik ribuan hilang
       .replace(/,/g, '.')  // koma jadi titik
  );

  // simpan hasil format ke input
  if (!isNaN(numericVal)) {
    $(this).val(formatter.format(numericVal));
  } else {
    $(this).val('');
  }

  // --- Hitung subtotal ---
  let jumlah = parseFloat(
    $row.find('.jumlah').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let rate = parseFloat(
    $row.find('.rate').val().replace(/\./g, '').replace(/,/g, '.')
  ) || 0;

  let subtotal = jumlah * rate;

  // tampilkan subtotal terformat
  $row.find('.subtotal').val(
    !isNaN(subtotal) ? formatter.format(subtotal) : ''
  );

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

function updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal) {
  $.ajax({
    url: `${url_api}/forex/id/${idForex}`,
    type: 'GET',
    headers: {
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      const tipe = $('#tipeTrans').val();

      // ambil rate asli
      let rate = (tipe === 'buy') ? response.beli : response.jual;

      // konversi ke number
      rate = parseFloat(rate) || 0;

      // format Indonesia → "1.234,56"
      const formattedRate = formatter.format(rate);

      // set nilai awal
      $inputRate.val(formattedRate);
      $inputSubtotal.val(formattedRate);
      $inputJumlah.val(1);

      updateTotal();
    },
    error: function (xhr) {
      console.error('Error:', xhr.responseJSON?.message);
      $inputRate.val('0');
      $inputSubtotal.val('0');
    }
  });
}

$('#tabelDetail').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
});

$('#btnSubmit').click(function (e) {
  e.preventDefault();

  const $btn = $(this);
  if ($btn.prop('disabled')) return;
  $btn.prop('disabled', true);

  // --- fungsi normalisasi ---
  function normalizeNumber(str) {
    if (!str) return 0;
    return parseFloat(
      str.toString()
         .replace(/\./g, '')  // hilangkan titik ribuan
         .replace(/,/g, '.')  // ubah koma ke titik
    ) || 0;
  }

  function normalizeString(str) {
    return str ? str.toString().trim() : "";
  }

  // --- proses details ---
  const details = [];
  $('#tabelDetail tbody tr').each(function () {
    const forex = normalizeString($(this).find('select.valas').val());
    const amount = normalizeNumber($(this).find('.jumlah').val());
    const rate   = normalizeNumber($(this).find('.rate').val());

    const isValid = forex && amount !== 0 && rate !== 0;

    if (isValid) {
      details.push({
        forex: forex,
        amount: amount,
        rate: rate
      });
    }
  });

  // validasi dasar
  if (details.length === 0) {
    $btn.prop('disabled', false);
    notif.fire({
      icon: 'warning',
      text: 'Minimal satu detail harus diisi!'
    });
    return;
  }

  // normalisasi id order
  const idOrder = normalizeString($('#idOrder').val());

  if (!idOrder) {
    $btn.prop('disabled', false);
    notif.fire({
      icon: 'warning',
      text: 'Order tidak valid!'
    });
    return;
  }

  // --- AJAX ---
  $.ajax({
    url: url_api + '/order/' + idOrder,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify({ details: details }),
    success: function (response) {
      notif.fire({
        icon: 'success',
        text: response.message
      }).then(() => {
        window.location.href = '/order';
      });
    },
    error: function (xhr) {
      $btn.prop('disabled', false);
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON?.message || 'Terjadi kesalahan'
      });
    }
  });
});
