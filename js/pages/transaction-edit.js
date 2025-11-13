const urlParams = new URLSearchParams(window.location.search);
const nomorTrans = urlParams.get('nomor');
$(document).ready(function() {
    if (!nomorTrans) {
        Swal.fire({
	        title: 'Error',
	        text: 'Transaction Number Not Found',
	        icon: 'error',
	        showDenyButton: false,
	        confirmButtonText: 'Back To Transaction Page',
	        customClass: {
	          confirmButton: 'btn btn-primary'
	        },
	        reverseButtons: true,
	        allowOutsideClick: false, 
	        allowEscapeKey: false
	    }).then((result) => {
	        if (result.isConfirmed) {
	          window.location.href = '/transaction';
	        }
	    });
    } else {
        resetTrans();
    }
});

function resetTrans() {
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
        url: url_api + '/transaction/nomor/' + nomorTrans, 
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
            $('#nomorTransaksi').text(response.nomor);
            $('#namaPelanggan').text(response.nama_pelanggan);
            $('#alamatPelanggan').text(response.alamat);
            $('#teleponPelanggan').text(response.telepon);
            $('#emailPelanggan').text(response.email);
            $('#kodePelanggan').text(response.kode_pelanggan);
            $('#idNumber').text(response.idNumber);
            $('#negara').text(response.nationality);
            $('#pekerjaan').text(response.pekerjaan);

           	let jenisTransaksi = "";
           	if(response.tipe == 3) {
           		jenisTransaksi = "Buying Transaction";
           	} else if (response.tipe == 4) {
           		jenisTransaksi = "Selling Transaction";
           	}
           	$('#jenisTransaksi').text(jenisTransaksi);
           	$('#tipeTrans').val(response.tipe);
           	$('#idTransaksi').val(response.noindex);
            $('#idCabang').val(response.cabang);

           	const tanggal = new Date(response.tanggal);
           	const formattedDate = tanggal.toLocaleDateString('en-US', {
						  year: 'numeric',
						  month: 'long',
						  day: 'numeric'
						});
           	$('#tanggalTransaksi').text(formattedDate);

            function toLocalDateInputValue(dateStr) {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            $('#tanggal').val(toLocalDateInputValue(response.tanggal));
            $('#tanggal_laporan').val(toLocalDateInputValue(response.tanggal_laporan));
            
            const details = response.details || [];

      			const tbody = $('#tabelDetail tbody');
      			tbody.empty();

      			if (details.length === 0) {
      				tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
      			} else {
      				let subtotal = 0;

      				details.forEach(function (item) {
                let qty;
                if(response.tipe == 3) {
                    qty = item.beli;
                } else if (response.tipe == 4) {
                    qty = item.jual;
                }
                const jumlahFormatted = Number(qty).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                const rateFormatted = Number(item.rate).toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });

                const totalPerItem = qty * item.rate;

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
                  updateRates($(this), $inputRate, $inputJumlah, $inputSubtotal);
                });
              });

              updateTotal();
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

  select.select2({
    placeholder: "Choose Forex",
    ajax: {
      url: url_api + '/forex/select2',
      dataType: 'json',
      headers: { "X-Client-Domain": myDomain },
      delay: 250,
      data: function (params) {
        return { search: params.term };
      },
      processResults: function (data) {
        return {
          results: data.results.map(item => ({
            id: item.id,
            text: item.text,
            kode: item.kode,
            nama: item.nama,
            beli: item.beli,
            jual: item.jual
          }))
        };
      }
    },
    templateResult: formatOption,
    templateSelection: formatSelection,
    escapeMarkup: m => m
  });

  if (initVal && !select.find(`option[value="${initVal}"]`).length) {
    const option = new Option(initText, initVal, true, true);
    select.append(option).trigger('change');
  }
}

function formatOption(item) {
  if (!item.id) return item.text;
  const tipe = $('#tipeTrans').val();
  const nilai = tipe == 3 ? item.beli : item.jual;
  const warna = tipe == 3 ? 'text-success' : 'text-danger';

  return `
    <div class="d-flex justify-content-between align-items-center">
      <div class="me-2">
        <div class="d-flex align-items-center">
          <h6 class="mb-0 me-1">${item.kode || '-'}</h6>
        </div>
        <small class="text-body">${item.nama || ''}</small>
      </div>
      <div class="user-progress">
        <p class="fw-medium mb-0 d-flex align-items-center gap-1 ${warna}">
          ${nilai || ''}
        </p>
      </div>
    </div>
  `;
}

// tampilan setelah dipilih → hanya text normal
function formatSelection(item) {
  return item.text || '';
}

$('#tambahBaris').on('click', function () {
  let row = $(`
    <tr>
      <td class="px-1">
        <select class="form-select valas" style="width: 100%"></select>
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
      <td class="px-1">
        <button class="btn btn-outline-danger border-none btnHapusBaris" type="button" title="Hapus Baris">
          <i class="icon-base ti tabler-trash"></i>
        </button>
      </td>
    </tr>
  `);

  const tbody = $('#tabelDetail tbody');
  tbody.append(row);

  let selectForex = row.find('.valas').first();
  let $inputRate = row.find('.rate').first();
  let $inputJumlah = row.find('.jumlah').first();
  let $inputSubtotal = row.find('.subtotal').first();

  // pakai fungsi universal kita
  initSelect2Valas(selectForex);

  // event saat forex dipilih
  selectForex.on('change', function () {
    updateRates($(this), $inputRate, $inputJumlah, $inputSubtotal);
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
    let val = $(this).val().trim();

    if (val) {
      // Hapus semua titik pemisah ribuan dan ubah koma menjadi titik desimal
      val = val.replace(/\./g, '').replace(',', '.');
    }

    let num = parseFloat(val) || 0;
    total += num;
  });

  // Format hasil ke format Indonesia
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(total);

  $('.total').val(formattedTotal);
}

function updateRates($selectForex, $inputRate, $inputJumlah, $inputSubtotal) {
  const data = $selectForex.select2('data')[0];
  if (!data) return;

  const tipe = $('#tipeTrans').val();
  let rate = tipe == 3 ? data.beli : data.jual;
  rate = parseFloat(rate) || 0;

  const formattedRate = formatter.format(rate);

  $inputRate.val(formattedRate);
  $inputJumlah.val(1);

  const subtotal = rate * 1;
  $inputSubtotal.val(formatter.format(subtotal));

  updateTotal();
}

$('#tabelDetail').on('click', '.btnHapusBaris', function () {
    $(this).closest('tr').remove();
});

$('#btnSubmit').click(function (e) {
  e.preventDefault();

  const $btn = $(this);
  if ($btn.prop('disabled')) return;
  $btn.prop('disabled', true);

  const tanggal = $('#tanggal').val();
  const tanggal_laporan = $('#tanggal_laporan').val();

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

  const idTrans = normalizeString($('#idTransaksi').val());

  if (!idTrans) {
    $btn.prop('disabled', false);
    notif.fire({
      icon: 'warning',
      text: 'Transaction is not valid!'
    });
    return;
  }

  $.ajax({
    url: url_api + '/transaction/' + idTrans,
    type: 'PUT',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify({ 
      tanggal: tanggal,
      tanggal_laporan: tanggal_laporan,
      cabang: $('#idCabang').val(),
      tipe: $('#tipeTrans').val(),
      details: details 
    }),
    success: function (response) {
      notif.fire({
        icon: 'success',
        text: response.message
      }).then(() => {
        window.location.href = '/transaction';
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
