// Prints the contents of a single div (by id) as a PDF via html2canvas + jsPDF,
// then opens the print dialog for it. Used by report pages' #print button,
// e.g. #cardData on pages/reports/bi-reports/summary-valas.php.
function printReport(divId, options = {}) {
  const target = document.getElementById(divId);

  if (!target) {
    notif.fire({
      icon: "error",
      title: "Elemen tidak ditemukan untuk dicetak",
    });
    return Promise.resolve();
  }

  const {
    scale = 2,
    orientation = "landscape",
    format = "a4",
  } = options;

  const { jsPDF } = window.jspdf;

  return html2canvas(target, {
    scale,
    useCORS: true,
  }).then((canvas) => {
    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format,
    });

    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - margin * 2;

    // How many source canvas pixels (at the captured scale) fit into one
    // PDF page's printable height, once the canvas is scaled down to imgWidth.
    const canvasPxPerPage = ((pageHeight - margin * 2) * canvas.width) / imgWidth;

    let renderedHeight = 0;

    // Content taller than one page is common for these reports (their
    // scroll container is expanded before capture so the full list is
    // included), so slice the canvas across as many pages as needed
    // instead of clipping everything past the first page.
    while (renderedHeight < canvas.height) {
      const sliceHeight = Math.min(canvasPxPerPage, canvas.height - renderedHeight);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;

      pageCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          0, renderedHeight, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );

      const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;

      if (renderedHeight > 0) {
        pdf.addPage();
      }

      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, imgWidth, sliceImgHeight);

      renderedHeight += sliceHeight;
    }

    pdf.autoPrint();

    const blob = pdf.output("bloburl");
    window.open(blob, "_blank");
  });
}
