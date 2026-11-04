/**
 * Ekspor PDF Ledger yang meniru tampilan layar (js/reports/accounting-reports/ledger.js + assets/css/ledger.css):
 * satu blok per akun dengan kepala akun (kode, nama, induk, subklas, ringkasan Opening / Debit / Credit / Closing)
 * dan tabel enam kolom (Date, Reference, Contact / Description, Debit, Credit, Balance) dengan baris Opening dan Total.
 * Warna diambil dari tema halaman, jadi mengikuti warna layar. Memakai jsPDF + AutoTable (lihat index.php).
 *
 *   data  : respons /accounting-report/ledger ({ kode: { nama_akun, alias_akun, nama_master, alias_subklas, saldo_awal, mutasi[] } })
 *   fmt   : fungsi format angka yang sama dengan layar
 */
function exportLedgerPDF({ data, nama_pt = '', start, end, cabang = '', filename = 'Ledger.pdf', fmt }) {
  const doc = new jspdf.jsPDF('landscape', 'mm', 'a4');
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 14;
  const usable = W - 2 * M;

  // ---------- warna: dibaca dari halaman supaya sama persis dengan layar ----------
  // layar memakai dua nilai: warna padat (--bs-primary, untuk kode akun / label) dan RGB tinta (--bs-primary-rgb, untuk latar lembut)
  const nums = t => (String(t).match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  const valid = c => c.length === 3 && c.every(v => !Number.isNaN(v));
  const read = (selector, prop, fallback) => {
    const el = document.querySelector(selector);
    const c = el ? nums(getComputedStyle(el)[prop]) : [];
    return valid(c) ? c : fallback;
  };
  const tintRgb = nums(getComputedStyle(document.documentElement).getPropertyValue('--bs-primary-rgb'));
  const tint = valid(tintRgb) ? tintRgb : [115, 103, 240];
  const primary = read('.lg-code', 'backgroundColor', [156, 48, 48]);
  const titleColor = read('.lg-hero-title', 'color', primary);
  const blend = (c, a) => c.map(v => Math.round(255 - (255 - v) * a)); // campuran dengan putih
  const C = {
    primary, titleColor,
    headBand: blend(tint, 0.12), tintRow: blend(tint, 0.07), tintHead: blend(tint, 0.05), pill: blend(tint, 0.16),
    border: [221, 221, 229], text: [45, 45, 62], muted: [118, 118, 135], danger: [220, 53, 69], white: [255, 255, 255]
  };

  // ---------- perhitungan per akun (sama dengan layar) ----------
  const accounts = Object.keys(data).map(kode => {
    const akun = data[kode];
    const debitNormal = [1, 5, 6, 7, 9].includes(parseInt(String(kode).charAt(0), 10));
    let saldo = akun.saldo_awal || 0;
    const saldoAwal = saldo;
    let totalDebit = 0, totalKredit = 0;
    const rows = akun.mutasi.map(m => {
      saldo += debitNormal ? (m.debit - m.kredit) : (m.kredit - m.debit);
      totalDebit += m.debit;
      totalKredit += m.kredit;
      return { m, saldo };
    });
    return { kode, akun, rows, saldoAwal, totalDebit, totalKredit, saldoAkhir: saldo };
  });

  // ---------- kepala halaman pertama / halaman lanjutan ----------
  const longDate = d => new Date(d).toLocaleDateString('en-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const range = start && end ? `${longDate(start)} - ${longDate(end)}` : 'All Time';
  const FIRST_Y = 48; // setelah pita header halaman pertama
  const TOP_NEXT = 24;
  const BOTTOM = 18;

  // ---------- kepala akun ----------
  const HEAD_H = 18, BOX_W = 35, BOX_GAP = 2;
  const statsW = 4 * BOX_W + 3 * BOX_GAP;
  const fit = (text, width) => {
    const lines = doc.splitTextToSize(String(text || ''), width);
    return lines.length > 1 ? lines[0].replace(/.{0,2}$/, '') + '...' : (lines[0] || '');
  };

  function drawAccountHead(a, y) {
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.25);
    doc.setFillColor(...C.headBand);
    doc.roundedRect(M, y, usable, HEAD_H, 2, 2, 'FD');

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    const chipW = doc.getTextWidth(a.kode) + 5;
    doc.setFillColor(...C.primary);
    doc.roundedRect(M + 4, y + 3.5, chipW, 7, 1.2, 1.2, 'F');
    doc.setTextColor(...C.white);
    doc.text(String(a.kode), M + 6.5, y + 8.5);

    const x0 = M + 4 + chipW + 3;
    const nameW = W - M - statsW - 5 - x0;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...C.text);
    const name = fit(a.akun.nama_akun, nameW);
    doc.text(name, x0, y + 8);
    if (a.akun.alias_akun) {
      const used = doc.getTextWidth(name) + 2;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.muted);
      doc.text(fit('- ' + a.akun.alias_akun, Math.max(nameW - used, 10)), x0 + used, y + 8);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    const master = fit(a.akun.nama_master, nameW * 0.7);
    doc.text(master, x0, y + 13.5);
    if (a.akun.alias_subklas) {
      const px = x0 + doc.getTextWidth(master) + 2.5;
      doc.setFontSize(6.8);
      doc.setFont('helvetica', 'bold');
      const label = fit(a.akun.alias_subklas, 40);
      const pw = doc.getTextWidth(label) + 4;
      doc.setFillColor(...C.pill);
      doc.roundedRect(px, y + 10.6, pw, 4.2, 2.1, 2.1, 'F');
      doc.setTextColor(...C.primary);
      doc.text(label, px + 2, y + 13.6);
    }

    const stats = [['OPENING', a.saldoAwal], ['DEBIT', a.totalDebit], ['CREDIT', a.totalKredit], ['CLOSING', a.saldoAkhir]];
    stats.forEach(([label, value], i) => {
      const bx = W - M - statsW + i * (BOX_W + BOX_GAP);
      const closing = i === 3;
      doc.setDrawColor(...(closing ? blend(tint, 0.5) : C.border));
      doc.setFillColor(...(closing ? blend(tint, 0.1) : C.white));
      doc.roundedRect(bx, y + 3, BOX_W, 12, 1.6, 1.6, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...C.muted);
      doc.text(label, bx + BOX_W - 2.2, y + 6.6, { align: 'right' });
      const text = fmt(value);
      doc.setFont('helvetica', 'bold');
      let fs = 9;
      doc.setFontSize(fs);
      while (fs > 6 && doc.getTextWidth(text) > BOX_W - 4.4) { fs -= 0.5; doc.setFontSize(fs); }
      doc.setTextColor(...(closing && value < 0 ? C.danger : C.text));
      doc.text(text, bx + BOX_W - 2.2, y + 12.4, { align: 'right' });
    });
  }

  // ---------- tabel mutasi ----------
  const COL_W = [23, 44, usable - (23 + 44 + 33 + 33 + 36), 33, 33, 36];
  const dateStr = d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const money = v => (Number(v) ? { content: fmt(v), styles: { halign: 'right' } } : { content: '-', styles: { halign: 'right', textColor: C.muted } });
  const cellOf = (text, styles) => ({ content: text, styles });

  function drawTable(a, startY) {
    const meta = [null]; // sejajar dengan body: info sel kaya (baris Opening tidak punya)
    const body = [[
      { content: 'Opening Balance', colSpan: 5, styles: { fontStyle: 'bolditalic', fillColor: C.tintRow } },
      cellOf(fmt(a.saldoAwal), { halign: 'right', fontStyle: 'bold', fillColor: C.tintRow })
    ]];
    a.rows.forEach(({ m, saldo }) => {
      meta.push({ ref: [String(m.nomor || '-'), m.prefix ? String(m.prefix) : ''], who: [String(m.kontak || '-'), m.deskripsi ? String(m.deskripsi) : ''] });
      body.push([
        dateStr(m.tanggal), '', '',
        money(m.debit), money(m.kredit),
        cellOf(fmt(saldo), { halign: 'right', fontStyle: 'bold', textColor: saldo < 0 ? C.danger : C.text })
      ]);
    });
    if (!a.rows.length) {
      meta.push(null);
      body.push([{ content: 'No transactions in this period', colSpan: 6, styles: { halign: 'center', textColor: C.muted } }]);
    }
    meta.push('total');
    const tot = { fillColor: C.tintRow, fontStyle: 'bold', halign: 'right' };
    body.push([
      { content: 'Total', colSpan: 3, styles: { ...tot, halign: 'left' } },
      cellOf(fmt(a.totalDebit), tot), cellOf(fmt(a.totalKredit), tot),
      cellOf(fmt(a.saldoAkhir), { ...tot, textColor: a.saldoAkhir < 0 ? C.danger : C.text })
    ]);

    // sel Reference dan Contact / Description: tinggi dihitung dari baris teks, isinya digambar sendiri
    const richLines = (target, cell, parts, width) => {
      const lines = [];
      parts.forEach(p => {
        if (!p.text) return;
        target.setFont(p.font, p.style);
        target.setFontSize(p.size);
        target.splitTextToSize(p.text, width).forEach(t => lines.push({ ...p, text: t }));
      });
      cell.__lines = lines;
      cell.styles.fontSize = 8;
      cell.text = new Array(Math.max(lines.length, 1)).fill('');
    };

    // menggambar sebagian baris ke `target` (dokumen asli, atau dokumen sementara untuk mengukur); mengembalikan finalY
    const run = (target, y0, rowsBody, rowsMeta, showHead) => {
      target.autoTable({
        startY: y0,
        head: [['DATE', 'REFERENCE', 'CONTACT / DESCRIPTION', 'DEBIT', 'CREDIT', 'BALANCE']],
        body: rowsBody,
        theme: 'plain',
        showHead: showHead ? 'everyPage' : 'never',
        rowPageBreak: 'avoid',
        tableWidth: usable,
        margin: { top: TOP_NEXT, left: M, right: M, bottom: BOTTOM },
        styles: { font: 'helvetica', fontSize: 8.5, textColor: C.text, cellPadding: { top: 2, bottom: 2, left: 2.5, right: 2.5 }, lineWidth: 0, overflow: 'linebreak', valign: 'top' },
        headStyles: { fillColor: C.tintHead, textColor: C.muted, fontStyle: 'bold', fontSize: 6.8, valign: 'middle', cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 } },
        columnStyles: {
          0: { cellWidth: COL_W[0] }, 1: { cellWidth: COL_W[1] }, 2: { cellWidth: COL_W[2] },
          3: { cellWidth: COL_W[3], halign: 'right' }, 4: { cellWidth: COL_W[4], halign: 'right' }, 5: { cellWidth: COL_W[5], halign: 'right' }
        },
        didParseCell(h) {
          const info = h.section === 'body' ? rowsMeta[h.row.index] : null;
          if (!info || info === 'total') return;
          const pad = h.cell.padding('left') + h.cell.padding('right');
          if (h.column.index === 1) {
            richLines(target, h.cell, [
              { text: info.ref[0], font: 'courier', style: 'normal', size: 8, color: C.text },
              { text: info.ref[1], font: 'helvetica', style: 'bold', size: 6.8, color: C.primary }
            ], COL_W[1] - pad);
          } else if (h.column.index === 2) {
            richLines(target, h.cell, [
              { text: info.who[0], font: 'helvetica', style: 'normal', size: 8.5, color: C.text },
              { text: info.who[1], font: 'helvetica', style: 'normal', size: 7.5, color: C.muted }
            ], COL_W[2] - pad);
          }
        },
        didDrawCell(h) {
          if (h.section !== 'body') return;
          const { cell } = h;
          if (cell.__lines) {
            const lh = cell.styles.fontSize / target.internal.scaleFactor * 1.15;
            cell.__lines.forEach((l, i) => {
              target.setFont(l.font, l.style);
              target.setFontSize(l.size);
              target.setTextColor(...l.color);
              target.text(l.text, cell.x + cell.padding('left'), cell.y + cell.padding('top') + lh * (i + 0.8));
            });
          }
          const total = rowsMeta[h.row.index] === 'total';
          target.setDrawColor(...(total ? blend(tint, 0.6) : C.border));
          target.setLineWidth(total ? 0.6 : 0.15);
          const ly = total ? cell.y : cell.y + cell.height;
          target.line(cell.x, ly, cell.x + cell.width, ly);
        }
      });
      return target.lastAutoTable.finalY;
    };

    // baris data terakhir + Total dipisah sebagai "ekor" yang tidak boleh terpisah: Total tidak pernah sendirian di halaman baru
    if (body.length <= 3) return run(doc, startY, body, meta, true);
    const mainY = run(doc, startY, body.slice(0, -2), meta.slice(0, -2), true);
    const tail = body.slice(-2), tailMeta = meta.slice(-2);
    const scratch = new jspdf.jsPDF('landscape', 'mm', 'a4');
    const tailH = run(scratch, TOP_NEXT, tail, tailMeta, false) - TOP_NEXT;
    if (mainY + tailH > H - BOTTOM) {
      doc.addPage();
      return run(doc, TOP_NEXT, tail, tailMeta, true);
    }
    return run(doc, mainY, tail, tailMeta, false);
  }

  // ---------- susun halaman ----------
  let y = FIRST_Y;
  accounts.forEach((a, i) => {
    // kepala akun + tabel perlu ruang minimal supaya kepala tidak tertinggal sendirian di dasar halaman
    if (i > 0 && y + HEAD_H + 28 > H - BOTTOM) {
      doc.addPage();
      y = TOP_NEXT;
    }
    drawAccountHead(a, y);
    y = drawTable(a, y + HEAD_H) + 8;
  });

  // ---------- kepala dan kaki setiap halaman (setelah jumlah halaman pasti) ----------
  const printed = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    if (p === 1) {
      // pita header seperti layar: ikon, nama PT, judul, dan chip periode / cabang / jumlah akun
      const by = 8, bh = 32;
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.25);
      doc.setFillColor(...blend(tint, 0.12));
      doc.roundedRect(M, by, usable, bh, 3, 3, 'FD');

      doc.setFillColor(...C.primary);
      doc.roundedRect(M + 6, by + 8, 16, 16, 3.5, 3.5, 'F');
      doc.setDrawColor(...C.white);
      doc.setLineWidth(0.7);
      doc.roundedRect(M + 10.5, by + 12, 7, 8, 0.8, 0.8, 'S'); // buku
      doc.line(M + 10.5, by + 15, M + 17.5, by + 15);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.muted);
      doc.text(String(nama_pt).toUpperCase(), M + 27, by + 9.5);
      doc.setFont('times', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(...C.titleColor);
      doc.text('Ledger', M + 27, by + 18.5);
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...C.muted);
      doc.text('Laporan Buku Besar', M + 27, by + 25);

      // chip bergaya pil, rata kanan, baris kedua bila perlu
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const chips = [range, cabang, `${accounts.length} account${accounts.length === 1 ? '' : 's'}`].filter(Boolean);
      let cx = W - M - 6, cy = by + (chips.length > 2 ? 9 : 12.5);
      chips.forEach((text, i) => {
        const w = doc.getTextWidth(text) + 8;
        if (i === 2) { cx = W - M - 6; cy += 9; }
        doc.setDrawColor(...C.border);
        doc.setLineWidth(0.25);
        doc.setFillColor(...C.white);
        doc.roundedRect(cx - w, cy, w, 7, 3.5, 3.5, 'FD');
        doc.setFillColor(...C.primary);
        doc.circle(cx - w + 3.6, cy + 3.5, 0.9, 'F');
        doc.setTextColor(...C.text);
        doc.text(text, cx - w + 6, cy + 4.7);
        cx -= w + 2.5;
      });
    } else {
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...C.titleColor);
      doc.text('Ledger', M, 13);
      doc.setFont('times', 'normal');
      doc.setTextColor(...C.text);
      doc.text(nama_pt, M + doc.getTextWidth('Ledger') + 3, 13);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...C.muted);
      doc.text(range, W - M, 13, { align: 'right' });
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.3);
      doc.line(M, 17, W - M, 17);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text(`Dicetak: ${printed}`, M, H - 9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Halaman ${p} / ${pages}`, W - M, H - 9, { align: 'right' });
  }

  doc.save(filename);
}
