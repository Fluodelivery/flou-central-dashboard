import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  dateRange: string;
}

// ===== CSV =====
export function exportToCSV(data: ExportData) {
  const csvRows = [
    [data.title, "", `Rango: ${data.dateRange}`],
    [],
    data.headers,
    ...data.rows,
  ];
  const csvContent = csvRows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  downloadFile(csvContent, `${data.title}.csv`, "text/csv;charset=utf-8;");
}

// ===== XLSX (Excel) =====
export function exportToExcel(data: ExportData) {
  const ws = XLSX.utils.aoa_to_sheet([
    [data.title, "", `Rango: ${data.dateRange}`],
    [],
    data.headers,
    ...data.rows,
  ]);
  // Auto-width columns
  ws["!cols"] = data.headers.map((h, i) => ({
    wch: Math.max(h.length, ...data.rows.map(r => String(r[i] ?? "").length)) + 2,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Métricas");
  XLSX.writeFile(wb, `${data.title}.xlsx`);
}

// ===== PDF =====
export function exportToPDF(data: ExportData) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16);
  doc.text(data.title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Rango: ${data.dateRange}`, 14, 26);
  doc.text(`Generado: ${new Date().toLocaleDateString("es-MX")}`, 14, 32);

  autoTable(doc, {
    startY: 38,
    head: [data.headers],
    body: data.rows.map(r => r.map(String)),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [34, 60, 140], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  doc.save(`${data.title}.pdf`);
}

// ===== DOC (HTML-based .doc) =====
export function exportToDoc(data: ExportData) {
  const tableRows = data.rows
    .map(r => `<tr>${r.map(c => `<td style="border:1px solid #ddd;padding:6px;font-size:11px;">${c}</td>`).join("")}</tr>`)
    .join("");
  const headerRow = data.headers
    .map(h => `<th style="border:1px solid #999;padding:6px;background:#223c8c;color:white;font-size:11px;">${h}</th>`)
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head><meta charset="utf-8"><title>${data.title}</title></head>
    <body style="font-family:Arial,sans-serif;">
      <h2 style="color:#1a1a2e;">${data.title}</h2>
      <p style="color:#666;font-size:12px;">Rango: ${data.dateRange} | Generado: ${new Date().toLocaleDateString("es-MX")}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>
  `;
  downloadFile(html, `${data.title}.doc`, "application/msword");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
