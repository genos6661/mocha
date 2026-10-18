/**
 * PREVIEW ORDER (halaman publik)
 * Dibuka dari: /order-preview?order=<nomor>
 * Desain: assets/css/invoice-preview.css. PDF: js/invoice-pdf.js.
 */
let orderNomor;
let orderData = null;   // respons order, dipakai membuat PDF
let logoPng = null;     // { dataUrl, width, height } logo dalam PNG, untuk PDF
const orderFmt = InvoicePdf.makeFmt('en-US');

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  orderNomor = urlParams.get('order');

  if (!orderNomor) {
    Swal.fire({
      title: 'Error',
      text: 'Order Number Not Found',
      icon: 'error',
      showDenyButton: false,
      confirmButtonText: 'Place New Order',
      customClass: { confirmButton: 'btn btn-primary' }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/order-form';
      }
    });
    return;
  }

  loadLogo();
  loadOrder();
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

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function orderTypeLabel(tipe) {
  return tipe == 'buy' ? 'Buying Transaction' : tipe == 'sell' ? 'Selling Transaction' : '';
}

function loadOrder() {
  $.ajax({
    url: url_api + '/order/nomor/' + orderNomor,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      "Content-Type": "application/json",
      "X-Client-Domain": myDomain
    },
    success: function (response) {
      orderData = response;

      $('#namaCabang').text(response.nama_cabang);
      $('#alamatCabang').text(response.alamat_cabang);
      $('#teleponCabang').text(response.telepon_cabang);
      $('#nomorOrder').text(response.nomor);
      $('#namaPelanggan').text(response.nama_pelanggan);
      $('#alamatPelanggan').text(response.alamat);
      $('#teleponPelanggan').text(InvoicePdf.maskId(response.telepon));
      $('#emailPelanggan').text(InvoicePdf.maskEmail(response.email));
      $('#kodePelanggan').text(response.kode_pelanggan);
      $('#idNumber').text(InvoicePdf.maskId(response.idNumber));
      $('#negara').text(response.nationality);
      $('#pekerjaan').text(response.pekerjaan);
      $('#namaPT').text(response.settings.NamaPT.strval);
      $('#goToForm').attr('href', '/order-form?branch=' + response.cabang);
      $('#jenisTransaksi').text(orderTypeLabel(response.tipe));
      $('#tanggalTransaksi').text(formatDate(response.tanggal));

      renderDetails(response.details || []);
    },
    error: function (xhr) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON?.message || 'Failed to load order'
      });
    }
  });
}

function renderDetails(details) {
  const tbody = $('#tabelDetail tbody').empty();

  if (details.length === 0) {
    tbody.append('<tr><td colspan="4" class="text-center">Detail Data Not Found</td></tr>');
    return;
  }

  let subtotal = 0;

  details.forEach(function (item) {
    const totalPerItem = item.jumlah * item.rate;
    subtotal += totalPerItem;

    tbody.append(`
      <tr>
        <td><div class="ip-cur-code">${item.kode}</div><div class="ip-cur-name">${item.nama}</div></td>
        <td class="text-end" data-label="Amount">${orderFmt(item.jumlah, 3)}</td>
        <td class="text-end" data-label="Rate">Rp. ${orderFmt(item.rate)}</td>
        <td class="text-end">Rp. ${orderFmt(totalPerItem)}</td>
      </tr>
    `);
  });

  $('#subtotal, #total').text(orderFmt(subtotal));
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
  if (!orderData) return;

  const order = orderData;

  InvoicePdf.save({
    filename: orderNomor + '.pdf',
    locale: 'en-US',
    logo: logoPng,
    fallbackLogoSelector: '#boxLogo svg',
    company: order.settings?.NamaPT?.strval || '',
    branchLines: [order.nama_cabang, order.alamat_cabang, order.telepon_cabang],
    title: 'Order ' + order.nomor,
    dateText: formatDate(order.tanggal),
    typeText: orderTypeLabel(order.tipe),
    billToTitle: 'Order From :',
    billTo: [order.nama_pelanggan, order.alamat, InvoicePdf.maskId(order.telepon), InvoicePdf.maskEmail(order.email)],
    info: [
      ['Cust. Code', order.kode_pelanggan],
      ['ID Number', InvoicePdf.maskId(order.idNumber)],
      ['Nationality', order.nationality],
      ['Occupation', order.pekerjaan]
    ],
    items: (order.details || []).map(item => ({
      code: item.kode, name: item.nama, qty: item.jumlah, rate: item.rate, total: item.jumlah * item.rate
    })),
    note: 'Thank you for your trust and business. It has been a pleasure serving you. We look forward to assisting you again in your future currency exchange needs.'
  });
}

$('#checkInvoice').click(function (e) {
  e.preventDefault();

  $.ajax({
    url: url_api + `/order/check-order/${orderNomor}`,
    type: 'GET',
    dataType: 'json',
    headers: {
        "Content-Type": "application/json",
        "X-Client-Domain": myDomain
    },
    success: function(response) {
    	if(!response.closed || response.closed === 0) {
    		notif.fire({
          icon: 'error',
          text: 'Your order is not processed yet'
        });
    	} else {
    		window.open('/transaction-preview?transaction=' + encodeURIComponent(response.transaksi), '_blank');
    	}
    },
    error: function(xhr, status, error) {
        notif.fire({
          icon: 'error',
          text: xhr.responseJSON?.message || 'Failed to check the order'
        });
    }
  });
});
