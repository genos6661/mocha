async function exportToPDF({

    data,
    headers,
    keys,

    filename = "export.pdf",
    title,
    nama_pt,
    start,
    end,
    cabang,

    footer = null,

    bodyBuilder = null,
    docStyles = {},
    styles = {},

    autoTableOptions = {},

    columnStyles = {}

} = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    notif.fire({
      icon: "error",
      title: "Tidak ada data untuk diekspor",
    });
    return;
  }

  const marginX = docStyles.marginX || 14;
  const headerY = 20;
  const titleY = 28;
  const lineY = 32;
  const tanggalY = 25;
  const headerHeight = 34; 
  const footerHeight = 14;

  const pdfStyle = {
    orientation: styles.orientation || "landscape",
    format: styles.format || "a4",
    fontSize: styles.fontSize || 10,
    headFillColor: styles.headFillColor || [37,40,58],
    headTextColor: styles.headTextColor || 255,
    bodyFillColor: styles.bodyFillColor || [245,245,245],
    bodyTextColor: styles.bodyTextColor || [50,50,50],
    alternateRowColor: styles.alternateRowColor || [255,255,255],
    tableMarginTop: styles.tableMarginTop || headerHeight,
    theme: styles.theme || "striped",
    headFontStyle: styles.headFontStyle || "bold",
    lineWidth: styles.lineWidth || 0.5,
    lineColor: styles.lineColor || 200
  }

  const doc = new jspdf.jsPDF(
    pdfStyle.orientation,
    "mm",
    pdfStyle.format
  );
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

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
  const tanggalX = pageWidth - marginX - tanggalWidth + 23;
  const filterX = pageWidth - marginX - filterWidth + 25;

  function drawHeader() {
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(nama_pt, marginX, headerY);
    doc.text(filterTgl, filterX, headerY);
    doc.text(tanggalText, tanggalX, tanggalY);

    if(cabang && cabang != '') {
      const cabangWidth = doc.getTextWidth(cabang);
      const cabangX = pageWidth - marginX - cabangWidth;
      doc.text(cabang, cabangX, 29);
      console.log('ada cabang');
    }

    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.setTextColor(8, 0, 128);
    doc.text(title, marginX, titleY, {
      maxWidth: 280,
    });

    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(marginX, lineY, pageWidth - marginX, lineY);
  }

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

  function formatNumber(value) {
    if (typeof value !== "number") return value || "";
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  const tableHeaders =
    Array.isArray(headers[0]) ? headers : [headers];
  let body = [];

  if(typeof bodyBuilder === "function"){

    body = bodyBuilder(data);

  }else{
    if (title === "LKUB") {
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
    } else if (title === "Customer Report") {
      body = data.map((item, index) => [
        index + 1,
        item.nama,
        item.nama_negara,
        item.pekerjaan,
        item.telepon,
        item.alamat,
        formatNumber(item.total_transaksi),
        formatNumber(item.nilai_transaksi)
      ]);
    } else {
      body = data.map((item) =>
        keys.map((key) =>
          item[key] !== null && item[key] !== undefined ? item[key].toString() : ""
        )
      );
    }
  }

  let tableFooter = [];

  if (footer) {
    tableFooter = [
      footer.map(item => {
        if (typeof item === "object") {
          return {
            ...item,
            content:
              typeof item.content === "number"
                ? formatNumber(item.content)
                : item.content
          };
        }

        return typeof item === "number"
          ? formatNumber(item)
          : item;
      })
    ];
  }

  // Default column style
  let defaultColumnStyles =
    title === "LKUB"
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
        }
      : title === "Customer Report"
      ? {
          0: { halign: "center" },
          4: { halign: "center" },
          6: { halign: "right" },
          7: { halign: "right" },
        }
      : {};

  doc.autoTable({
    head: tableHeaders,
    body: body,

    foot: tableFooter,
    showFoot: footer ? "lastPage" : "never",

    margin: {
      top: pdfStyle.tableMarginTop,
      left: marginX,
      right: marginX
    },

    styles: {
      fontSize: pdfStyle.fontSize,
    },

    headStyles: {
      fillColor: pdfStyle.headFillColor,
      textColor: pdfStyle.headTextColor,
      fontStyle: pdfStyle.headFontStyle,
      halign: "center",
    },

    bodyStyles: {
      fillColor: pdfStyle.bodyFillColor,
      textColor: pdfStyle.bodyTextColor,
    },

    alternateRowStyles: {
      fillColor: pdfStyle.alternateRowColor,
    },

    footStyles: styles.footStyles || {
      fillColor: [52, 58, 64],
      textColor: 255,
      fontStyle: "bold",
    },

    columnStyles: {
      ...defaultColumnStyles,
      ...columnStyles,
    },

    didDrawPage() {
      drawHeader();
      drawFooter(
        doc.internal.getNumberOfPages(),
        "{total_pages_count_string}"
      );
    },

    ...autoTableOptions,
  });

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages("{total_pages_count_string}");
  }

  doc.save(filename);
}
