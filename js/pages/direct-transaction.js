$(document).ready(function () {
  $('#modalTransaksiBaru').on('shown.bs.modal', function (e) {
    $('#modalTransaksiBaru #kontak').trigger('focus');
  });

  $("#cabangTrans").on("change", function () {
    const cabang = $(this).val();
    $('#tabelDetail tbody').empty();
    updateTotal();

    if (cabang && cabang !== null) {
        $("#tambahBaris").prop("disabled", false);
    } else {
        $("#tambahBaris").prop("disabled", true);
    }
  });

  // $('.jumlah, .rate')
  // .on('focus', function () {
  //     $(this).select();
  // })
  // .on('mouseup', function (e) {
  //     e.preventDefault();
  // });
});

function initSelect2Valas(select) {
  const initVal = select.data('init-value');
  const initText = select.data('init-text');
  const cabang = $('#cabangTrans').val();

  select.select2({
    placeholder: "Choose Forex",
    dropdownParent: $('#modalTransaksiBaru'),
    ajax: {
      url: url_api + '/forex/select2',
      dataType: 'json',
      headers: { "X-Client-Domain": myDomain },
      delay: 250,
      data: function (params) {
        return { search: params.term, cabang: cabang };
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
  const tipe = $('#buyTrans').prop('checked') ? 'buy' : 'sell';
  const nilai = tipe == 'buy' ? item.beli : item.jual;
  const warna = tipe == 'buy' ? 'text-success' : 'text-danger';

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
  const isReadonly = (parsedProfile.request == 0) ? 'readonly' : '';
  let row = $(`
    <tr>
      <td class="px-1">
        <select class="form-select valas" style="width: 100%"></select>
      </td>
      <td class="px-1">
        <input type="text" class="form-control jumlah text-end" onclick="this.select()">
      </td>
      <td class="px-1">
        <input type="text" class="form-control rate text-end" onclick="this.select()" ${isReadonly}>
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
  maximumFractionDigits: 4
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  }).format(total);

  $('.total').val(formattedTotal);
}

function updateRates($selectForex, $inputRate, $inputJumlah, $inputSubtotal) {
  const data = $selectForex.select2('data')[0];
  if (!data) return;

  const tipe = $('#buyTrans').prop('checked') ? 'buy' : 'sell';
  let rate = tipe == 'buy' ? data.beli : data.jual;
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
    updateTotal();
});

$(document).on('change', 'input[name="tipeTrans"]', function () {
  $('#tabelDetail tbody').empty();
  $('#tambahBaris').trigger('click');
});

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function updateReportDate() {
    const selectedDate = document.getElementById('tanggal').value;
    const reportInput = document.getElementById('tanggal_laporan');

    if (!selectedDate) return;

    const now = new Date();
    const hour = now.getHours();

    let baseDate = new Date(selectedDate);

    // Jika jam >= 15, tambah 1 hari
    if (hour >= 15) {
        baseDate.setDate(baseDate.getDate() + 1);
    }

    reportInput.value = formatDate(baseDate);
}

// Trigger saat date berubah
document.getElementById('tanggal').addEventListener('change', updateReportDate);

// Trigger saat pertama kali load
window.addEventListener('load', updateReportDate);

$('#btnSubmit').click(function (e) {
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

  const tanggal = $('#tanggal').val();
  const tanggal_laporan = $('#tanggal_laporan').val();

  function normalizeNumber(str) {
    if (!str) return 0;
    return parseFloat(
      str.toString()
         .replace(/\./g, '')  
         .replace(/,/g, '.')  
    ) || 0;
  }

  function normalizeString(str) {
    return str ? str.toString().trim() : "";
  }

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

  if (details.length === 0) {
    $btn.prop('disabled', false);
    notif.fire({
      icon: 'warning',
      text: 'Minimal satu detail harus diisi!'
    });
    return;
  }

  const tipeTransaksi = $('#buyTrans').prop('checked') ? 'buy' : 'sell';
  const idPelanggan = $('#kontak').val();
  const cabang = $('#cabangTrans').val();

  if (!cabang || cabang == '' || !idPelanggan || idPelanggan == '' || !tanggal || tanggal == '' || !tipeTransaksi) {
    $btn.prop('disabled', false);
    notif.fire({
      icon: 'warning',
      text: 'Missing Required Fields!'
    });
  }

  $.ajax({
    url: url_api + '/transaction/',
    type: 'POST',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain,
      "Authorization": `Bearer ${window.token}`
    },
    data: JSON.stringify({ 
      id_profile: idPelanggan,
      date: tanggal,
      report_date: tanggal_laporan,
      branch: cabang,
      tipe: tipeTransaksi,
      items: details 
    }),
    success: function (response) {
      if (response.isExceed) {
        $btn.prop('disabled', false);
        $("#btnSignSubmit").click(function () {
          submitSign(idPelanggan, response.nomor, cabang);
        });
        initSelect2();
        $('#modalTransaksiBaru').modal('hide');
        $('#modalSign').modal('show');
        if (document.querySelector(`.notiflix-loading`)) {
          Loading.remove();
        }
      } else {
        // $('#modalTransaksiBaru .modal-body').find('input, select, textarea').val('').prop('checked', false);
        $('#kontak').val(null).trigger('change');
        $('#tabelDetail tbody').empty();
        $('#tambahBaris').trigger('click');
        updateTotal();
        offset = 0;
        table.clear();
        loadMoreData(true);
        $btn.prop('disabled', false);
        Swal.fire({
          title: 'Success',
          text: response.message,
          icon: 'success',
          showDenyButton: true,
          confirmButtonText: 'Print Invoice',
          denyButtonText: 'Okay',
          customClass: {
            denyButton: 'btn btn-secondary',
            confirmButton: 'btn btn-primary'
          },
          reverseButtons: true,
          allowOutsideClick: false, 
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
              window.open('/pages/transaction/invoice.php?transaction=' + response.nomor, '_blank');
          }
        });

        if (document.querySelector(`.notiflix-loading`)) {
            Loading.remove();
        } 
      }
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

function submitSign(idPelanggan, nomor, cabang) {
  const formData = {
    id_pelanggan: idPelanggan,
    npwp: $('#npwp').val(),
    domisili: $('#domisili').val(),
    penghasilan: $('#penghasilan').val(),
    bentuk_pt: $('#bentuk_pt').val(),
    bidang_usaha: $('#bidang_usaha').val(),
    perusahaan: $('#perusahaan').val(),
    pekerjaan: $('#pekerjaanSign').val(),
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
      $('#kontak').val(null).trigger('change');
      $('#tabelDetail tbody').empty();
      $('#tambahBaris').trigger('click');
      Swal.fire({
        title: 'Success',
        text: response.message,
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Print Receipt',
        denyButtonText: 'Close',
        customClass: {
          denyButton: 'btn btn-secondary',
          confirmButton: 'btn btn-primary'
        },
        reverseButtons: true,
        allowOutsideClick: false, 
        allowEscapeKey: false
      }).then((result) => {
        offset = 0;
        table.clear();
        loadMoreData(true);
        if (result.isConfirmed) {
          window.location.href = '/order-preview?order=' + nomor;
        } // else if (result.isDenied) {
        //   window.location.href = '/order-form?branch=' + cabang;
        // }
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

function initSelect2() {
  $('#pekerjaanSign').select2({
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