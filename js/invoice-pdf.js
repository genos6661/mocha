/**
 * PEMBUAT PDF INVOICE / ORDER (halaman preview publik)
 * ------------------------------------------------------------------
 * PDF dibuat langsung dengan jsPDF + autoTable (bukan memotret halaman), jadi
 * hasilnya sama di PC maupun smartphone: ada logo, semua baris valas, dan teks
 * bisa dipilih. Butuh jspdf.js dan autotable.js dimuat lebih dulu.
 *
 * Desain mengikuti halaman preview (assets/css/invoice-preview.css): pita header
 * bergradasi warna utama tema, panel penerima & detail pelanggan, tabel valas
 * berwarna, kotak catatan dan total, serta footer berhalaman. Warna utama dibaca
 * dari CSS variable --bs-primary, jadi ikut berubah bila tema diganti.
 *
 *   InvoicePdf.save({
 *     filename, logo,                      // logo = { dataUrl, width, height } (PNG) atau null
 *     fallbackLogoSelector,                // mis. '#boxLogo svg': dirasterisasi bila logo kosong
 *     locale,                              // format angka (default 'id-ID')
 *     company, branchLines: [nama, alamat, telepon],
 *     title, dateText, typeText,           // sisi kanan atas
 *     billToTitle, billTo: [...],          // blok penerima (baris teks)
 *     info: [[label, value], ...],         // detail pelanggan
 *     items: [{ code, name, qty, rate, total }],
 *     note
 *   });
 */
(function (window) {
  const makeFmt = (locale) => (value, max = 4) => Number(value).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: max
  });
  const fmtDefault = makeFmt('id-ID');

  // ---------- warna tema ----------

  function primaryRgb() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--bs-primary').trim().replace('#', '');
    const hex = raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw;
    const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
    return rgb.some(Number.isNaN) ? [115, 103, 240] : rgb;
  }

  // Campur warna dengan target (0..1 = porsi target).
  const mix = (rgb, target, amount) => rgb.map((c, i) => Math.round(c + (target[i] - c) * amount));
  const toWhite = (rgb, amount) => mix(rgb, [255, 255, 255], amount);
  const toBlack = (rgb, amount) => mix(rgb, [0, 0, 0], amount);

  // ---------- logo ----------

  // Logo (blob dari API) -> salinan PNG untuk PDF (jsPDF tidak menerima SVG/WebP).
  function loadLogoPng(objectUrl, onReady) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      onReady({ dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height });
    };
    img.src = objectUrl;
  }

  // Logo bawaan (SVG inline di halaman) -> PNG berwarna utama.
  function rasterizeInlineSvg(selector, rgb) {
    return new Promise(resolve => {
      const svg = document.querySelector(selector);
      if (!svg) return resolve(null);

      const clone = svg.cloneNode(true);
      clone.setAttribute('width', '240');
      clone.setAttribute('height', String(Math.round(240 * svg.viewBox.baseVal.height / svg.viewBox.baseVal.width)));
      clone.setAttribute('fill', `rgb(${rgb.join(',')})`);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height });
      };
      img.onerror = () => resolve(null);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    });
  }

  // ---------- PDF ----------

  async function save(cfg) {
    const fmt = makeFmt(cfg.locale || 'id-ID');   // samakan dengan format angka di layar
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const primary = primaryRgb();
    const dark = toBlack(primary, 0.55);
    const tint = toWhite(primary, 0.92);
    const tintMid = toWhite(primary, 0.84);
    const ink = [37, 40, 58];
    const muted = [112, 112, 124];
    const line = [226, 226, 232];

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;
    const right = pageW - margin;
    const contentW = pageW - margin * 2;

    const logo = cfg.logo || (cfg.fallbackLogoSelector ? await rasterizeInlineSvg(cfg.fallbackLogoSelector, primary) : null);

    // --- pita header bergradasi (irisan vertikal tipis) + lingkaran hias
    const heroH = 50;
    const slices = 60;
    for (let i = 0; i < slices; i++) {
      doc.setFillColor(...mix(primary, dark, i / (slices - 1)));
      doc.rect((pageW / slices) * i, 0, pageW / slices + 0.3, heroH, 'F');
    }
    doc.setFillColor(...toWhite(primary, 0.18));
    doc.circle(pageW - 12, 6, 30, 'F');
    doc.setFillColor(...mix(primary, dark, 0.35));
    doc.circle(pageW - 12, 6, 24, 'F');

    // logo di kotak putih
    const tile = 24;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 13, tile, tile, 4, 4, 'F');
    if (logo) {
      const maxW = tile - 6;
      const maxH = tile - 6;
      const ratio = logo.width / logo.height;
      const w = ratio >= maxW / maxH ? maxW : maxH * ratio;
      const h = w / ratio;
      doc.addImage(logo.dataUrl, 'PNG', margin + (tile - w) / 2, 13 + (tile - h) / 2, w, h);
    } else {
      doc.setTextColor(...primary).setFont('helvetica', 'bold').setFontSize(16);
      doc.text((cfg.company || '?').trim().charAt(0).toUpperCase(), margin + tile / 2, 13 + tile / 2 + 2.2, { align: 'center' });
    }

    // identitas (kiri) dan judul dokumen (kanan)
    const textX = margin + tile + 6;
    doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(15);
    doc.text(doc.splitTextToSize(cfg.company || '', 80)[0] || '', textX, 23);
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...toWhite(primary, 0.85));
    doc.text(cfg.branchLines[0] || '', textX, 30);

    doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(15);
    doc.text(cfg.title, right, 21, { align: 'right' });

    if (cfg.typeText) {
      doc.setFont('helvetica', 'bold').setFontSize(7.5);
      const label = cfg.typeText.toUpperCase();
      const pillW = doc.getTextWidth(label) + 9;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(right - pillW, 25, pillW, 6.5, 3.25, 3.25, 'F');
      doc.setTextColor(...primary);
      doc.text(label, right - pillW / 2, 29.4, { align: 'center' });
    }
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...toWhite(primary, 0.88));
    doc.text('Date Issues: ' + cfg.dateText, right, 38, { align: 'right' });

    // --- strip alamat & telepon cabang
    doc.setFillColor(...tint);
    doc.rect(0, heroH, pageW, 12, 'F');
    doc.setFontSize(8.5).setTextColor(...muted);
    const address = doc.splitTextToSize(cfg.branchLines[1] || '', contentW - 50)[0] || '';
    doc.setFillColor(...primary);
    doc.circle(margin + 1, heroH + 6, 1, 'F');
    doc.text(address, margin + 4, heroH + 7);
    if (cfg.branchLines[2]) {
      const phone = String(cfg.branchLines[2]);
      doc.circle(right - doc.getTextWidth(phone) - 4, heroH + 6, 1, 'F');
      doc.text(phone, right, heroH + 7, { align: 'right' });
    }

    // --- dua panel: penerima & detail pelanggan
    let y = heroH + 12 + 9;
    const gap = 6;
    const panelW = (contentW - gap) / 2;
    const billTo = cfg.billTo.filter(Boolean);

    doc.setFontSize(9.5);
    const billLines = [];
    billTo.slice(1).forEach(text => doc.splitTextToSize(String(text), panelW - 28).forEach(part => billLines.push(part)));
    const panelH = Math.max(34, 16 + Math.max(billLines.length * 4.6 + 8, cfg.info.length * 6));

    [margin, margin + panelW + gap].forEach(x => {
      doc.setDrawColor(...line).setLineWidth(0.3);
      doc.roundedRect(x, y, panelW, panelH, 3.5, 3.5, 'S');
    });

    doc.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(...primary);
    doc.text(String(cfg.billToTitle).toUpperCase(), margin + 5, y + 7);
    doc.text('CUSTOMER DETAILS', margin + panelW + gap + 5, y + 7);

    // avatar berinisial + nama
    const name = billTo[0] || '';
    doc.setFillColor(...primary);
    doc.circle(margin + 11, y + 20, 5, 'F');
    doc.setTextColor(255, 255, 255).setFontSize(10);
    doc.text(name.trim().charAt(0).toUpperCase() || '-', margin + 11, y + 21.5, { align: 'center' });
    doc.setTextColor(...ink).setFontSize(11);
    doc.text(doc.splitTextToSize(name, panelW - 28)[0] || '', margin + 19, y + 19);
    doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...muted);
    billLines.forEach((text, i) => doc.text(text, margin + 19, y + 25 + i * 4.6));

    const infoX = margin + panelW + gap + 5;
    cfg.info.forEach(([label, value], i) => {
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...muted);
      doc.text(label + ' :', infoX, y + 15 + i * 6);
      doc.setFont('helvetica', 'bold').setTextColor(...ink);
      doc.text(String(value || '-'), infoX + 27, y + 15 + i * 6);
    });

    y += panelH + 8;

    // --- tabel valas
    let subtotal = 0;
    const body = cfg.items.map(item => {
      subtotal += item.total;
      return [item.code, item.name, fmt(item.qty, 2), 'Rp. ' + fmt(item.rate), 'Rp. ' + fmt(item.total)];
    });

    doc.autoTable({
      startY: y,
      head: [['CURRENCY', 'NAME', 'AMOUNT', 'RATE', 'SUBTOTAL']],
      body,
      margin: { left: margin, right: margin, bottom: 18 },
      theme: 'plain',
      styles: { fontSize: 9.5, cellPadding: { top: 3.2, bottom: 3.2, left: 4, right: 4 }, textColor: ink, lineColor: line, lineWidth: 0 },
      headStyles: { fillColor: primary, textColor: 255, fontStyle: 'bold', fontSize: 7.5, cellPadding: { top: 3.6, bottom: 3.6, left: 4, right: 4 } },
      alternateRowStyles: { fillColor: tint },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 26 },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'head' && [2, 3, 4].includes(data.column.index)) data.cell.styles.halign = 'right';
      }
    });

    // --- catatan (kiri) + total (kanan)
    y = doc.lastAutoTable.finalY + 10;
    const totalW = 76;
    const noteW = contentW - totalW - 8;
    doc.setFontSize(9);
    const noteLines = cfg.note ? doc.splitTextToSize(cfg.note, noteW - 12) : [];
    const noteH = noteLines.length ? 14 + noteLines.length * 4.4 : 0;
    const totalH = 38;
    const blockH = Math.max(noteH, totalH);

    if (y + blockH > pageH - 22) {
      doc.addPage();
      y = 20;
    }

    if (noteLines.length) {
      doc.setFillColor(...tint);
      doc.roundedRect(margin, y, noteW, noteH, 2.5, 2.5, 'F');
      doc.setFillColor(...primary);
      doc.roundedRect(margin, y, 1.8, noteH, 0.9, 0.9, 'F');
      doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...ink);
      doc.text('Note :', margin + 7, y + 7);
      doc.setFont('helvetica', 'normal').setTextColor(...muted);
      doc.text(noteLines, margin + 7, y + 12.5);
    }

    const tx = right - totalW;
    doc.setFillColor(...tintMid);
    doc.roundedRect(tx, y, totalW, totalH, 3.5, 3.5, 'F');
    doc.setFontSize(9.5);
    [['Subtotal:', 'Rp. ' + fmt(subtotal)], ['Tax:', '0']].forEach(([label, value], i) => {
      doc.setFont('helvetica', 'normal').setTextColor(...muted);
      doc.text(label, tx + 6, y + 9 + i * 7);
      doc.setFont('helvetica', 'bold').setTextColor(...ink);
      doc.text(value, right - 6, y + 9 + i * 7, { align: 'right' });
    });
    doc.setDrawColor(...primary).setLineWidth(0.3).setLineDashPattern([1.2, 1.2], 0);
    doc.line(tx + 6, y + 24, right - 6, y + 24);
    doc.setLineDashPattern([], 0);
    doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...ink);
    doc.text('Total:', tx + 6, y + 32);
    doc.setFontSize(13).setTextColor(...primary);
    doc.text('Rp. ' + fmt(subtotal), right - 6, y + 32, { align: 'right' });

    // --- footer tiap halaman
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(...line).setLineWidth(0.3).line(margin, pageH - 14, right, pageH - 14);
      doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...muted);
      doc.text('Thank you for choosing us.', pageW / 2, pageH - 8.5, { align: 'center' });
      doc.text(cfg.company || '', margin, pageH - 8.5);
      doc.text(`Page ${p} of ${pages}`, right, pageH - 8.5, { align: 'right' });
    }

    doc.save(cfg.filename);
  }

  window.InvoicePdf = { save, loadLogoPng, fmt: fmtDefault, makeFmt };
})(window);
