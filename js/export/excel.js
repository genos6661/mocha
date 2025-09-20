function exportToExcel({ data, headers, keys, filename = "export.xlsx" }) {
  const worksheetData = [
    headers, 
    ...data.map((row) => keys.map((key) => row[key] ?? "")), 
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}
