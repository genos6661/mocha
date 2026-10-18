/**
 * REGISTRY DESAIN INVOICE
 * ------------------------------------------------------------------
 * Satu-satunya tempat yang perlu diedit untuk menambah / mengubah desain
 * invoice. Dipakai oleh:
 *   - js/pages/invoice.js      -> memilih & merender desain saat cetak
 *   - js/setting/setting.js    -> mengisi dropdown "Invoice Design"
 *
 * Key di INVOICE_DESIGNS = nilai yang disimpan di setting `InvoiceDesain`
 * (jangan diubah untuk desain yang sudah dipakai, nanti setting lama putus).
 *
 * Ada dua tipe desain:
 *   type: 'html'   -> dirender dari template pages/transaction/desain/<template>.html
 *                     lalu dicetak lewat window.print()
 *       template     : nama file template (tanpa .html)
 *       renderRow    : (ctx) => string HTML <tr> untuk 1 baris item
 *       renderFooter : (ctx) => string HTML untuk ditambahkan ke <tbody>, atau
 *                      mengisi elemen di template (lihat footerSpans)
 *   type: 'escpos' -> dikirim ke printer thermal sebagai file ESC/POS
 *       generate     : (data) => string perintah ESC/POS
 *
 * ctx untuk renderRow    : { item, qty, total }
 * ctx untuk renderFooter : { subtotal, $tbody }
 */

(function (window) {

const INVOICE_DEFAULT_DESIGN = 'A4';

// ---------- helper format angka (dipakai bersama oleh renderer) ----------
function invFmt(value, min = 0, max = min) {
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: min,
    maximumFractionDigits: max
  });
}

// ---------- renderer baris item (bisa dipakai ulang oleh banyak desain) ----------
const InvoiceRows = {
  // Tabel lebar (A4): Kode | Qty | Rate | Total, 2 desimal
  standard: ({ item, qty, total }) => `
    <tr>
      <td class="nowrap">${item.kode}</td>
      <td class="text-end nowrap">${invFmt(qty)}</td>
      <td class="text-end nowrap">Rp. ${invFmt(item.rate, 2)}</td>
      <td class="text-end nowrap">Rp. ${invFmt(total, 2)}</td>
    </tr>
  `,

  // Struk kecil 1 baris per item
  compact: ({ item, qty, total }) => `
    <tr>
      <td style="padding: 3px;">${item.kode}</td>
      <td style="text-align: right; padding: 3px;">${invFmt(qty)}</td>
      <td style="text-align: right; padding: 3px;">${invFmt(item.rate, 0, 4)}</td>
      <td colspan="2" style="text-align: right; padding: 3px;">${invFmt(total)}</td>
    </tr>
  `,

  // Struk kecil 2 baris per item
  twoLine: ({ item, qty, total }) => `
    <tr>
      <td colspan="2" style="padding: 3px;">${item.kode}</td>
      <td colspan="2" style="padding: 3px; text-align: center;">${invFmt(qty)}</td>
    </tr>
    <tr>
      <td colspan="2" style="text-align: center; padding: 3px;">${invFmt(item.rate)}</td>
      <td colspan="2" style="text-align: right; padding: 3px;">Rp. ${invFmt(total)}</td>
    </tr>
  `
};

// ---------- renderer footer / total (bisa dipakai ulang oleh banyak desain) ----------
const InvoiceFooters = {
  // Template yang sudah punya <span class="subtotal"> dan <span class="total">
  spans: ({ subtotal }) => {
    $('.subtotal, .total').text(invFmt(subtotal, 2));
    return '';
  },

  // Baris "Total" di akhir tabel untuk struk kecil
  compactTotalRow: ({ subtotal }) => `
    <tr>
      <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700;">Total : </td>
      <td colspan="2" style="border-top: 1px solid; padding: 8px 3px; font-weight: 700; text-align: right;">Rp. ${invFmt(subtotal)}</td>
    </tr>
  `,

  // Baris "Total" di akhir tabel untuk A4 half / double
  a4TotalRow: ({ subtotal }) => `
    <tr>
      <td colspan="3" class="fw-bold">Total : </td>
      <td class="text-end fw-bold">Rp. ${invFmt(subtotal, 2)}</td>
    </tr>
  `
};

// ---------- helper ESC/POS ----------
function esc(...bytes) {
  return String.fromCharCode(...bytes);
}

function line(left, right, width = 32) {
  const space = width - left.length - right.length;
  return left + " ".repeat(Math.max(space, 1)) + right + "\n";
}

function formatNumber(num) {
  return Number(num).toLocaleString('id-ID');
}

// ---------- DAFTAR DESAIN ----------
// Urutan di sini = urutan di dropdown "Invoice Design" pada halaman Settings.
const INVOICE_DESIGNS = {
  'A4': {
    label: 'Regular A4 Invoice',
    type: 'html',
    template: 'regular',
    renderRow: InvoiceRows.standard,
    renderFooter: InvoiceFooters.spans
  },

  'A4-double': {
    label: 'A4 Double Invoice',
    type: 'html',
    template: 'a4-double',
    renderRow: InvoiceRows.standard,
    renderFooter: InvoiceFooters.a4TotalRow
  },

  'small': {
    label: 'Small Paper New',
    type: 'html',
    template: 'small-con',
    renderRow: InvoiceRows.compact,
    renderFooter: InvoiceFooters.compactTotalRow
  },

  'small-2': {
    label: 'Small Continous 2 rows',
    type: 'html',
    template: 'small-con2',
    renderRow: InvoiceRows.twoLine,
    renderFooter: InvoiceFooters.compactTotalRow
  },

  'small-sign': {
    label: 'Small With Signature',
    type: 'html',
    template: 'small-sign',
    renderRow: InvoiceRows.compact,
    renderFooter: InvoiceFooters.compactTotalRow
  },

  'small-escpos': {
    label: 'Small ESC/POS',
    type: 'escpos',
    generate: (data) => {
      let cmd = "";

      cmd += esc(27, 97, 1);
      cmd += `${data.judul_nota}\n${data.alamat_cabang}\n${data.telepon_cabang}\n`;
      cmd += esc(27, 97, 0);

      cmd += "--------------------------------\n";
      cmd += `Number : ${data.nomor}\n`;
      cmd += `Date : ${data.tanggal}\n`;
      cmd += `Name : ${data.customer}\n\n`;
      cmd += `Cashier : ${data.user}\n`;
      cmd += "--------------------------------\n";

      data.items.forEach(i => {
        cmd += i.kode + " - " + i.nama + "\n";
        cmd += line(
          `${i.qty} x ${formatNumber(i.rate)}`,
          formatNumber(i.total)
        );
      });

      cmd += "--------------------------------\n";
      cmd += esc(27, 69, 1);
      cmd += line("TOTAL", formatNumber(data.subtotal));

      cmd += esc(27, 97, 1);
      cmd += `\n${data.footer1}\n${data.footer2}\n${data.footer3}\n`;

      cmd += esc(29, 86, 0);

      return cmd;
    }
  },

  'small-escpos-long': {
    label: 'Small ESC/POS Long',
    type: 'escpos',
    generate: (data) => {
      let cmd = "";

      cmd += esc(27, 97, 1);
      cmd += `${data.judul_nota}\n${data.alamat_cabang}\n${data.telepon_cabang}\n${data.footer1}\n`;
      cmd += esc(27, 97, 0);

      cmd += "--------------------------------\n";
      cmd += esc(27, 97, 2);
      cmd += `No. ${data.nomor}\n`;
      cmd += esc(27, 97, 0);
      cmd += `Date : ${data.tanggal}\n`;
      cmd += `Customer : ${data.customer}\n`;
      cmd += `Passport/ID : ${data.id_number}\n`;
      cmd += `Nationality : ${data.nationality}\n`;
      cmd += `Phone : ${data.telepon_pelanggan}\n`;
      cmd += esc(27, 97, 2);
      cmd += `Cashier : ${data.user}\n`;
      cmd += esc(27, 97, 0);
      cmd += "--------------------------------\n";
      cmd += `Forex    Amount    Rate    Total\n`;
      cmd += "--------------------------------\n";

      data.items.forEach(i => {
        cmd += i.kode + " - " + i.nama + "\n";
        cmd += line(
          `${i.qty} x ${formatNumber(i.rate)}`,
          formatNumber(i.total)
        );
      });

      cmd += "--------------------------------\n";
      cmd += esc(27, 69, 1);
      cmd += line("TOTAL", formatNumber(data.subtotal));

      cmd += esc(27, 97, 1);
      cmd += `\n${data.footer2}\n${data.footer3}\n\n`;

      cmd += esc(27, 97, 2);
      cmd += `${data.customer}\n\n\n`;
      cmd += `.........................`;

      cmd += esc(29, 86, 0);

      return cmd;
    }
  },

  'a4_continous': {
    label: 'Half A4 Continous Paper',
    type: 'html',
    template: 'a4-half',
    renderRow: InvoiceRows.standard,
    renderFooter: InvoiceFooters.a4TotalRow
  }
};

// Ambil desain berdasarkan nilai setting. Nilai kosong / tidak dikenal
// (mis. desain sudah dihapus dari registry) otomatis jatuh ke desain default,
// supaya invoice tetap bisa dicetak.
function getInvoiceDesign(id) {
  return INVOICE_DESIGNS[id] || INVOICE_DESIGNS[INVOICE_DEFAULT_DESIGN];
}

// Isi <select> (jQuery object) dengan daftar desain dari registry.
// Dipakai halaman Settings dan modal Edit Cabang supaya dropdown-nya selalu sama.
//   emptyLabel : kalau diisi, ditambahkan opsi kosong (value "") di paling atas
//   selected   : nilai yang dipilih awal
function fillInvoiceDesignSelect($select, { emptyLabel = null, selected = null } = {}) {
  $select.empty();

  if (emptyLabel !== null) {
    $select.append(new Option(emptyLabel, '', false, selected === ''));
  }

  Object.entries(INVOICE_DESIGNS).forEach(([id, d]) => {
    $select.append(new Option(d.label, id, false, id === selected));
  });
}

// Bangun perintah ESC/POS lengkap: reset printer (ESC @) + isi dari desain.
function buildEscPos(design, data) {
  return esc(27, 64) + design.generate(data);
}

// Hanya ini yang terlihat dari luar file.
window.INVOICE_DEFAULT_DESIGN = INVOICE_DEFAULT_DESIGN;
window.INVOICE_DESIGNS = INVOICE_DESIGNS;
window.getInvoiceDesign = getInvoiceDesign;
window.fillInvoiceDesignSelect = fillInvoiceDesignSelect;
window.buildEscPos = buildEscPos;

})(window);
