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
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation,
      unit: "pt",
      format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", 20, y, imgWidth, imgHeight);
    pdf.autoPrint();

    const blob = pdf.output("bloburl");
    window.open(blob, "_blank");
  });
}
