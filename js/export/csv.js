/**
 * Export array of objects to CSV file
 *
 * @param {Array<Object>} data - Data to be exported
 * @param {Array<string>} headers - Custom column titles (e.g. ['ID', 'Name', 'Email'])
 * @param {Array<string>} keys - Corresponding keys in the object (e.g. ['id', 'name', 'email'])
 * @param {string} filename - Output filename (e.g. 'report.csv')
 */
function exportToCSV({ data, headers, keys, filename = "export.csv" }) {
  const escapeCsv = (text) => {
    if (typeof text === "undefined" || text === null) return "";
    return `"${String(text).replace(/"/g, '""')}"`;
  };

  let csv = "";

  // Write header row
  csv += headers.map(escapeCsv).join(",") + "\r\n";

  // Write data rows
  data.forEach((row) => {
    const line = keys.map((key) => escapeCsv(row[key]));
    csv += line.join(",") + "\r\n";
  });

  // Trigger download in browser
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
