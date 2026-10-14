/**
 * PREVIEW INVOICE TRANSAKSI (halaman publik)
 * Dibuka dari link yang dikirim ke pelanggan: /transaction-preview?transaction=<nomor>
 * Tidak butuh login — hanya memakai endpoint publik /transaction/nomor/:nomor.
 * Data sensitif (nomor ID & telepon pelanggan) ditampilkan tersamar.
 */
let transactionNomor;
let invoiceData = null;   // respons transaksi, dipakai membuat PDF
let logoPng = null;       // { dataUrl, width, height } logo dalam PNG, untuk PDF

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

    // Salinan PNG untuk PDF (jsPDF hanya menerima PNG/JPEG, bukan SVG/WebP).
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      logoPng = { dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height };
    };
    img.src = imgURL;
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

      $('#tanggalTransaksi').text(
        new Date(response.tanggal).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );

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

function fmt(value, max = 4) {
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: max
  });
}

function renderDetails(response) {
  const details = response.details || [];
  const tbody = $('#tabelDetail tbody').empty();

  if (details.length === 0) {
    tbody.append('<tr><td colspan="5" class="text-center">Detail Data Not Found</td></tr>');
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
        <td>${item.kode}</td>
        <td>${item.nama}</td>
        <td class="text-end" data-label="Amount">${fmt(qty, 2)}</td>
        <td class="text-end" data-label="Rate">Rp. ${fmt(item.rate)}</td>
        <td class="text-end">Rp. ${fmt(totalPerItem)}</td>
      </tr>
    `);
  });

  $('#subtotal, #total').text(fmt(subtotal));
}

function printDiv(divId) {
  const content = document.getElementById(divId).innerHTML;
  const printWindow = window.open('', '', 'width=800,height=1000');

  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write(`
    <link rel="stylesheet" href="${window.location.origin}/assets/vendor/fonts/iconify-icons.css" />
    <link rel="stylesheet" href="${window.location.origin}/assets/vendor/css/core.css" />
    <link rel="stylesheet" href="${window.location.origin}/assets/css/demo.css" />
    <link rel="stylesheet" href="${window.location.origin}/assets/vendor/css/pages/app-invoice.css" />
  `);
  printWindow.document.write('</head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// PDF dibuat langsung dengan jsPDF (bukan memotret halaman), jadi hasilnya sama
// di desktop maupun smartphone: ada logo, semua baris valas, dan teks bisa dipilih.
function downloadPDF() {
  if (!invoiceData) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const trx = invoiceData;
  const margin = 15;
  const pageW = doc.internal.pageSize.getWidth();
  const right = pageW - margin;
  const dark = [37, 40, 58];
  const muted = [110, 110, 120];

  // --- header: logo + identitas cabang (kiri), nomor & tanggal (kanan)
  let y = margin;
  let textX = margin;

  if (logoPng) {
    const logoH = 16;
    const logoW = Math.min(40, logoH * logoPng.width / logoPng.height);
    doc.addImage(logoPng.dataUrl, 'PNG', margin, y, logoW, logoH);
    y += logoH + 4;
  }

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold').setFontSize(14);
  doc.text(trx.judul_nota || '', textX, y);
  y += 6;

  doc.setFont('helvetica', 'normal').setFontSize(10);
  const branchLines = [trx.nama_cabang, ...doc.splitTextToSize(trx.alamat_cabang || '', 95), trx.telepon_cabang].filter(Boolean);
  branchLines.forEach(line => { doc.text(line, textX, y); y += 5; });

  doc.setFont('helvetica', 'bold').setFontSize(13);
  doc.text('Invoice ' + trx.nomor, right, margin + 5, { align: 'right' });
  doc.setFont('helvetica', 'normal').setFontSize(10);
  doc.text('Date: ' + new Date(trx.tanggal).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), right, margin + 12, { align: 'right' });
  doc.text(trx.tipe == 3 ? 'Buying Transaction' : trx.tipe == 4 ? 'Selling Transaction' : '', right, margin + 18, { align: 'right' });

  // --- pelanggan (ID & telepon tersamar, sama seperti di layar)
  y += 4;
  doc.setDrawColor(210).line(margin, y, right, y);
  y += 7;
  doc.setFont('helvetica', 'bold').text('Invoice To :', margin, y);
  doc.text('Customer Info :', pageW / 2 + 5, y);
  doc.setFont('helvetica', 'normal');

  const left = [trx.nama_pelanggan, maskIdNumber(trx.telepon)];
  const info = [
    ['Cust. Code', trx.kode_pelanggan],
    ['ID Number', maskIdNumber(trx.idNumber)],
    ['Nationality', trx.nationality]
  ];
  left.forEach((line, i) => doc.text(String(line || ''), margin, y + 6 + i * 5));
  info.forEach(([label, value], i) => {
    doc.text(label + ' :', pageW / 2 + 5, y + 6 + i * 5);
    doc.text(String(value || ''), pageW / 2 + 35, y + 6 + i * 5);
  });
  y += 6 + info.length * 5 + 3;

  // --- tabel valas
  let subtotal = 0;
  const body = (trx.details || []).map(item => {
    const qty = trx.tipe == 3 ? item.beli : item.jual;
    const total = qty * item.rate;
    subtotal += total;
    return [item.kode, item.nama, fmt(qty, 2), 'Rp. ' + fmt(item.rate), 'Rp. ' + fmt(total)];
  });

  doc.autoTable({
    startY: y,
    head: [['Currency', 'Name', 'Amount', 'Rate', 'Subtotal']],
    body,
    margin: { left: margin, right: margin },
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 2.5, textColor: dark },
    headStyles: { fillColor: dark, textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });

  // --- total & catatan
  y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(10);
  [['Subtotal:', 'Rp. ' + fmt(subtotal)], ['Tax:', '0'], ['Total:', 'Rp. ' + fmt(subtotal)]].forEach(([label, value], i) => {
    doc.setFont('helvetica', i === 2 ? 'bold' : 'normal');
    doc.text(label, right - 55, y + i * 6);
    doc.text(value, right, y + i * 6, { align: 'right' });
  });
  y += 24;

  const footers = $('#noteInvoice').text().trim();   // sama dengan yang tampil di layar
  if (footers) {
    doc.setFont('helvetica', 'bold').text('Note :', margin, y);
    doc.setFont('helvetica', 'normal').setTextColor(...muted);
    doc.text(doc.splitTextToSize(footers, pageW - margin * 2 - 14), margin + 14, y);
  }

  doc.save(transactionNomor + '.pdf');
}
