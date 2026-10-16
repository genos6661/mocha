/**
 * PREVIEW INVOICE TRANSAKSI (halaman publik)
 * Dibuka dari link yang dikirim ke pelanggan: /transaction-preview?transaction=<nomor>
 * Tidak butuh login — hanya memakai endpoint publik /transaction/nomor/:nomor.
 * Data sensitif (nomor ID & telepon pelanggan) ditampilkan tersamar.
 * Desain: assets/css/invoice-preview.css. PDF: js/invoice-pdf.js.
 */
let transactionNomor;
let invoiceData = null;   // respons transaksi, dipakai membuat PDF
let logoPng = null;       // { dataUrl, width, height } logo dalam PNG, untuk PDF
const fmt = InvoicePdf.fmt;

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  transactionNomor = urlParams.get('transaction');

  if (!transactionNomor) {
    Swal.fire({
      title: 'Error',
      text: 'Transaction Number Not Found',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: { confirmButton: 'btn btn-primary' }
    });
    return;
  }

  loadLogo();
  loadTransaction();
});

function loadLogo() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url_api + '/setting/logo/', true);
  xhr.setRequestHeader('X-Client-Domain', myDomain);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status !== 200) return;

    const imgURL = URL.createObjectURL(xhr.response);
    $('#boxLogo').html(`<img class="invoice-logo" src="${imgURL}" alt="Logo">`);
    InvoicePdf.loadLogoPng(imgURL, png => { logoPng = png; });
  };

  xhr.send();
}

function maskIdNumber(id) {
  if (!id || id.length <= 4) return 'xxxx';

  return id.slice(0, 2) + 'x'.repeat(id.length - 4) + id.slice(-2);
}

function loadTransaction() {
  $.ajax({
    url: url_api + '/transaction/nomor/' + encodeURIComponent(transactionNomor),
    type: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      invoiceData = response;
      document.title = (response.nama_pelanggan || 'Invoice') + '_' + response.nomor;

      $('#judulNota').text(response.judul_nota);
      $('#namaCabang').text(response.nama_cabang);
      $('#alamatCabang').text(response.alamat_cabang);
      $('#teleponCabang').text(response.telepon_cabang);
      $('#nomorTrans').text(response.nomor);
      $('#namaPelanggan').text(response.nama_pelanggan);
      $('#teleponPelanggan').text(maskIdNumber(response.telepon));
      $('#kodePelanggan').text(response.kode_pelanggan);
      $('#idNumber').text(maskIdNumber(response.idNumber));
      $('#negara').text(response.nationality);

      const footers = [response.footer1, response.footer2, response.footer3].filter(Boolean);
      if (footers.length) {
        $('#noteInvoice').text(footers.join(' '));
      }

      $('#jenisTransaksi').text(
        response.tipe == 3 ? 'Buying Transaction' :
        response.tipe == 4 ? 'Selling Transaction' : ''
      );

      $('#tanggalTransaksi').text(formatDate(response.tanggal));

      renderDetails(response);
    },
    error: function (xhr) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON?.message || 'Failed to load invoice'
      });
    }
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderDetails(response) {
  const details = response.details || [];
  const tbody = $('#tabelDetail tbody').empty();

  if (details.length === 0) {
    tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
    return;
  }

  let subtotal = 0;

  details.forEach(function (item) {
    // tipe 3 = beli (kolom beli), tipe 4 = jual (kolom jual)
    const qty = response.tipe == 3 ? item.beli : item.jual;
    const totalPerItem = qty * item.rate;
    subtotal += totalPerItem;

    tbody.append(`
      <tr>
        <td><div class="ip-cur-code">${item.kode}</div><div class="ip-cur-name">${item.nama}</div></td>
        <td class="text-end" data-label="Amount">${fmt(qty, 2)}</td>
        <td class="text-end" data-label="Rate">Rp. ${fmt(item.rate)}</td>
        <td class="text-end">Rp. ${fmt(totalPerItem)}</td>
      </tr>
    `);
  });

  $('#subtotal, #total').text(fmt(subtotal));
}

function copyLink() {
  const done = () => notif.fire({ icon: 'success', text: 'Link copied' });
  const fail = () => notif.fire({ icon: 'error', text: 'Could not copy the link' });

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(window.location.href).then(done, fail);
    return;
  }

  // Cadangan untuk halaman non-HTTPS.
  const input = document.createElement('input');
  input.value = window.location.href;
  document.body.appendChild(input);
  input.select();
  try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
  input.remove();
}

function printDiv(divId) {
  const content = document.getElementById(divId).innerHTML;
  const origin = window.location.origin;
  const printWindow = window.open('', '', 'width=800,height=1000');

  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write(`
    <link rel="stylesheet" href="${origin}/assets/vendor/fonts/iconify-icons.css" />
    <link rel="stylesheet" href="${origin}/assets/vendor/css/core.css" />
    <link rel="stylesheet" href="${origin}/assets/css/demo.css" />
    <link rel="stylesheet" href="${origin}/assets/css/invoice-preview.css" />
  `);
  printWindow.document.write('</head><body class="ip-body"><div class="ip-card">');
  printWindow.document.write(content);
  printWindow.document.write('</div></body></html>');

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

function downloadPDF() {
  if (!invoiceData) return;

  const trx = invoiceData;
  const sell = trx.tipe != 3;

  InvoicePdf.save({
    filename: transactionNomor + '.pdf',
    logo: logoPng,
    fallbackLogoSelector: '#boxLogo svg',
    company: trx.judul_nota || '',
    branchLines: [trx.nama_cabang, trx.alamat_cabang, trx.telepon_cabang],
    title: 'Invoice ' + trx.nomor,
    dateText: formatDate(trx.tanggal),
    typeText: trx.tipe == 3 ? 'Buying Transaction' : trx.tipe == 4 ? 'Selling Transaction' : '',
    billToTitle: 'Invoice To :',
    billTo: [trx.nama_pelanggan, maskIdNumber(trx.telepon)],
    info: [
      ['Cust. Code', trx.kode_pelanggan],
      ['ID Number', maskIdNumber(trx.idNumber)],
      ['Nationality', trx.nationality]
    ],
    items: (trx.details || []).map(item => {
      const qty = sell ? item.jual : item.beli;
      return { code: item.kode, name: item.nama, qty, rate: item.rate, total: qty * item.rate };
    }),
    note: $('#noteInvoice').text().trim()   // sama dengan yang tampil di layar
  });
}
