// Expands a row that may contain plain values or { content, colSpan }
// cells (same shape used by js/export/pdf.js sections) into a full-width
// row array, plus any merge ranges needed for cells with colSpan > 1.
function normalizeExcelRow(row) {
  const cells = [];
  const rowMerges = [];

  let col = 0;
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
    const colCount = headers.length;

    sections.forEach((section, index) => {
      if (index > 0) {
        worksheetData.push([]);
      }

      if (section.heading) {
        const r = worksheetData.length;
        worksheetData.push([section.heading]);
        merges.push({
          s: { r, c: 0 },
          e: { r, c: colCount - 1 },
        });
      }

      worksheetData.push(headers);

      (section.body || []).forEach((row) => {
        const { cells, rowMerges } = normalizeExcelRow(row);
        const r = worksheetData.length;
        worksheetData.push(cells);
        rowMerges.forEach((m) => {
          merges.push({ s: { r, c: m.startCol }, e: { r, c: m.endCol } });
        });
      });

      if (section.foot) {
        const { cells, rowMerges } = normalizeExcelRow(section.foot);
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
