// Expands a row that may contain plain values or { content, colSpan }
// cells (same shape used by js/export/pdf.js sections) into a full-width
// row array, plus any merge ranges needed for cells with colSpan > 1.
// `offset` prepends that many blank columns (see section.colOffset below).
function normalizeExcelRow(row, offset = 0) {
  const cells = new Array(offset).fill("");
  const rowMerges = [];

  let col = offset;
  row.forEach((cell) => {
    if (cell && typeof cell === "object") {
      const span = cell.colSpan || 1;
      cells[col] = cell.content ?? "";
      if (span > 1) {
        rowMerges.push({ startCol: col, endCol: col + span - 1 });
      }
      col += span;
    } else {
      cells[col] = cell;
      col += 1;
    }
  });

  return { cells, rowMerges };
}

function exportToExcel({
  data,
  headers,
  keys,
  filename = "export.xlsx",

  // Array of { heading, body, foot } to render as stacked tables in the
  // same sheet (e.g. one per account in a Ledger report). When provided,
  // `data`/`keys` are ignored.
  sections = null,
} = {}) {
  const hasSections = Array.isArray(sections) && sections.length > 0;

  const worksheetData = [];
  const merges = [];

  if (hasSections) {
    sections.forEach((section, index) => {
      if (index > 0) {
        worksheetData.push([]);
      }

      // Per-section header override — mirrors js/export/pdf.js, so a
      // section can use a different column layout than the shared
      // `headers` passed to exportToExcel (e.g. a wide transaction-summary
      // row followed by a narrower currency-breakdown table).
      const sectionHeaders = section.headers || headers;
      // Number of blank leading columns — lets a narrower section (e.g. a
      // currency breakdown table) start under a later column of a wider
      // section above it (e.g. under "Date" instead of under "No"),
      // mirroring the indent used in the PDF/on-screen versions.
      const offset = section.colOffset || 0;
      const colCount = sectionHeaders.length + offset;

      if (section.heading) {
        const r = worksheetData.length;
        const headingRow = new Array(offset).fill("");
        headingRow[offset] = section.heading;
        worksheetData.push(headingRow);
        merges.push({
          s: { r, c: offset },
          e: { r, c: colCount - 1 },
        });
      }

      worksheetData.push(new Array(offset).fill("").concat(sectionHeaders));

      (section.body || []).forEach((row) => {
        const { cells, rowMerges } = normalizeExcelRow(row, offset);
        const r = worksheetData.length;
        worksheetData.push(cells);
        rowMerges.forEach((m) => {
          merges.push({ s: { r, c: m.startCol }, e: { r, c: m.endCol } });
        });
      });

      if (section.foot) {
        const { cells, rowMerges } = normalizeExcelRow(section.foot, offset);
        const r = worksheetData.length;
        worksheetData.push(cells);
        rowMerges.forEach((m) => {
          merges.push({ s: { r, c: m.startCol }, e: { r, c: m.endCol } });
        });
      }
    });
  } else {
    worksheetData.push(headers);
    data.forEach((row) => {
      worksheetData.push(keys.map((key) => row[key] ?? ""));
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  if (merges.length) {
    worksheet["!merges"] = merges;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}
