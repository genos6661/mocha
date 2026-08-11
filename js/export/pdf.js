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

    columnStyles = {},

    // Array of { heading, body, foot, columnStyles } to render as separate
    // stacked tables (e.g. one per account in a Ledger report). When
    // provided, `data`/`keys`/`bodyBuilder`/`footer` are ignored.
    sections = null

} = {}) {
  const hasSections = Array.isArray(sections) && sections.length > 0;

  if (!hasSections && (!data || !Array.isArray(data) || data.length === 0)) {
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
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const filterTgl = (start && end)
    ? `${new Date(start).toLocaleDateString('en-ID', options)} - ${new Date(end).toLocaleDateString('en-ID', options)}`
    : 'All Time';

  const tanggalText = `Dicetak : ${formattedDate}`;
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

  if (hasSections) {
    // body/footer/columnStyles are built per-section below
  } else if(typeof bodyBuilder === "function"){

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

  if (hasSections) {

    const colCount = tableHeaders[tableHeaders.length - 1].length;

    sections.forEach((section, index) => {

      const sectionHead = [];

      if (section.heading) {
        sectionHead.push([{
          content: section.heading,
          colSpan: colCount,
          styles: { halign: "left" },
        }]);
      }

      sectionHead.push(...tableHeaders);

      const sectionFoot = section.foot
        ? [section.foot.map(item => {
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
          })]
        : [];

      doc.autoTable({
        head: sectionHead,
        body: section.body || [],

        foot: sectionFoot,
        showFoot: section.foot ? "lastPage" : "never",

        startY: index === 0 ? undefined : doc.lastAutoTable.finalY + 8,

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
          ...(section.columnStyles || columnStyles),
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
    });

  } else {

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

  }

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages("{total_pages_count_string}");
  }

  doc.save(filename);
}
