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
	$.ajax({
        url: url_api + '/order/nomor/' + orderNomor, 
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "X-Client-Domain": myDomain
        },
        success: function (response) {
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
      					const totalPerItem = item.jumlah * item.rate;
      						subtotal += totalPerItem;
      					const row = $(`
      					    <tr>
      					      <td class="px-1">
      					        <select class="form-select valas" data-init-value="${item.valas}" data-init-text="${item.kode} - ${item.nama}">
      					          <option value="${item.valas}">${item.kode} - ${item.nama}</option>
      					        </select>
      					      </td>
      					      <td class="px-1"><input type="number" class="form-control jumlah text-end" value="${item.jumlah}" /></td>
      					      <td class="px-1"><input type="number" class="form-control rate text-end" value="${item.rate}" /></td>
      					      <td class="px-1"><input type="number" class="form-control subtotal text-end" value="${totalPerItem}" readonly /></td>
      					      <td class="px-1"><button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris"><i class="icon-base ti tabler-trash"></i></button></td>
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
      				        // updateSatuanProduk(idProduk, $selectSatuan);
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
            search: params.term
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
          <input type="number" class="form-control jumlah text-end" min="0">
        </td>
        <td class="px-1">
          <input type="number" class="form-control rate text-end" min="0">
        </td>
        <td class="px-1">
          <input type="number" class="form-control subtotal text-end" readonly>
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
        // updateSatuanProduk(idProduk, $selectSatuan);
    });
});

function updateRates(idForex, $inputRate, $inputJumlah, $inputSubtotal) {
  $.ajax({
      url: `${url_api}/forex/id/${idForex}`,
      type: 'GET',
      headers: {
          "X-Client-Domain": myDomain
      },
      success: function(response) {
        tipe = $('#tipeTrans').val();
        if(tipe == 'buy') {
          $inputRate.val(response.beli);
          $inputSubtotal.val(response.beli);
        } else {
          $inputRate.val(response.jual);
          $inputSubtotal.val(response.jual);
        }
        $inputJumlah.val(1);
        updateTotal();
      },
      error: function(xhr) {
          console.error('Error:', xhr.responseJSON?.message);
          $inputRate.val(0);
      }
  });
}

$('#tabelDetail').on('change', '.jumlah, .rate', function () {
  let $row = $(this).closest('tr');
  let jumlah = parseFloat($row.find('.jumlah').val()) || 0;
  let rate = parseFloat($row.find('.rate').val()) || 0;
  let subtotal = jumlah * rate;
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

$('#tabelDetail').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
});

$('#btnSubmit').click(function (e) {
  e.preventDefault();

  const $btn = $(this);
  if ($btn.prop('disabled')) return;

  $btn.prop('disabled', true);

  const details = [];
  $('#tabelDetail tbody tr').each(function () {
    const forex = $(this).find('select.valas').val();
    const amount = parseFloat($(this).find('.jumlah').val());
    const rate = parseFloat($(this).find('.rate').val());

    if (forex && amount && rate) {
      details.push({
        forex: forex,
        amount: amount,
        rate: rate
      });
    }
  });
  const idOrder = $('#idOrder').val();

  $.ajax({
    url: url_api + '/order/' + idOrder,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify({details: details}),
    success: function (response) {
    	notif.fire({
          icon: 'success',
          text: response.message
        }).then((result) => {
            window.location.href = '/order';
        });
    },
    error: function (xhr, status, error) {
      $('#btnSubmit').removeAttr('disabled');
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
    }
  });
});