$(document).ready(function () {
  $('#modalTransaksiBaru').on('shown.bs.modal', function (e) {
    $('#modalTransaksiBaru #kontak').trigger('focus');
    $('#tambahBaris').trigger('click');
  });
});

function initSelect2Valas(select) {
  const initVal = select.data('init-value');
  const initText = select.data('init-text');

  select.select2({
    placeholder: "Choose Forex",
    dropdownParent: $('#modalTransaksiBaru'),
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

$(document).on('change', 'input[name="tipeTrans"]', function () {
  $('#tabelDetail tbody').empty();
  $('#tambahBaris').trigger('click');
});