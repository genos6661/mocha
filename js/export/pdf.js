async function exportToPDF({
  data,
  headers,
  keys,
  filename = "export.pdf",
  title,
  nama_pt,
  start, end
} = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    notif.fire({
      icon: "error",
      title: "Tidak ada data untuk diekspor",
    });
    return;
  }

  const doc = new jspdf.jsPDF("landscape"); 
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const headerY = 20;
  const titleY = 28;
  const lineY = 32;
  const tanggalY = 25;
  const headerHeight = 34; 
  const footerHeight = 14;

  // ====== Format Tanggal ======
  const date = new Date();
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let tanggal_awal = new Date(start);
  let tanggal_akhir = new Date(end);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  tanggal_awal = tanggal_awal.toLocaleDateString('en-ID', options);
  tanggal_akhir = tanggal_akhir.toLocaleDateString('en-ID', options);

  const tanggalText = `Dicetak : ${formattedDate}`;
  const filterTgl = `${tanggal_awal} - ${tanggal_akhir}`;
  const tanggalWidth = doc.getTextWidth(tanggalText);
  const filterWidth = doc.getTextWidth(filterTgl);
  const tanggalX = pageWidth - marginX - tanggalWidth;
  const filterX = pageWidth - marginX - filterWidth + 11;

  // ====== Header ======
  function drawHeader() {
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(nama_pt, marginX, headerY);
    doc.text(filterTgl, filterX, headerY);
    doc.text(tanggalText, tanggalX, tanggalY);

    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.setTextColor(8, 0, 128);
    doc.text(title, marginX, titleY, {
      maxWidth: 250,
    });

    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(marginX, lineY, pageWidth - marginX, lineY);
  }

  // ====== Footer ======
  function drawFooter(pageNumber, totalPages) {
    const footerText = `Halaman ${pageNumber} / ${totalPages}`;
    const textWidth = doc.getTextWidth(footerText);
    const x = (pageWidth - textWidth);
    const y = pageHeight - footerHeight;

    doc.setFontSize(10);
    doc.setFont("times", "italic");
    doc.setTextColor(120);
    doc.text(footerText, x, y);
  }

  // ====== Format Angka ======
  function formatNumber(value) {
    if (typeof value !== "number") return value || "";
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // ====== Data Table ======
  const tableHeaders = [headers];
  let body = [];

  if (title === "Summary Valas") {
    body = data.map((item) => [
      item.kodeValas,
      item.namaValas,
      formatNumber(item.saldo_awal),
      formatNumber(item.pembelian),
      formatNumber(item.penjualan),
      formatNumber(item.saldo_akhir),
      formatNumber(item.pembelian_rupiah),
      formatNumber(item.penjualan_rupiah),
    ]);
  } else if (title === "LKUB") {
    body = data.map((item, index) => [
      index + 1,
      item.kodeValas,
      "UKA",
      formatNumber(item.saldo_awal),
      formatNumber(item.saldo_awal_rupiah),
      formatNumber(item.saldo_pembelian),
      formatNumber(item.saldo_pembelian_rupiah),
      formatNumber(item.penjualan),
      formatNumber(item.penjualan_rupiah),
      formatNumber(item.saldo_akhir),
      formatNumber(item.kurs_tengah),
      formatNumber(item.saldo_akhir_rupiah)
    ]);
  } else {
    body = data.map((item) =>
      keys.map((key) =>
        item[key] !== null && item[key] !== undefined ? item[key].toString() : ""
      )
    );
  }

  // ====== AutoTable ======
  doc.autoTable({
    head: tableHeaders,
    body: body,
    margin: { top: headerHeight  }, // kasih ruang buat header
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [37, 40, 58],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fillColor: [245, 245, 245],
      textColor: [50, 50, 50],
    },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    columnStyles:
      title === "Summary Valas"
        ? {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
          }
        : title === "LKUB"
        ? {
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
            8: { halign: "right" },
            9: { halign: "right" },
            10: { halign: "right" },
            11: { halign: "right" },
            12: { halign: "right" },
          }
        : {},
    didDrawPage: function (data) {
      drawHeader();
      const pageNumber = doc.internal.getNumberOfPages();
      drawFooter(pageNumber, "{total_pages_count_string}");
    },
  });

  // ====== Hitung total halaman ======
  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages("{total_pages_count_string}");
  }

  // ====== Simpan File ======
  doc.save(filename);
}
