// T-20  Export the payroll table to an .xlsx file (offline reporting).
// The "xlsx" library is loaded only when the button is clicked, so the page stays fast.
export async function exportPayrollExcel(rows, month) {
  const mod = await import("xlsx");
  const XLSX = mod.default ?? mod;

  const data = rows.map((r) => ({
    "Employee ID": r.code || r.employeeId || r.id,
    Name: r.name,
    Department: r.department,
    Gross: r.gross,
    Deductions: r.deductions,
    "LOP Deduction": r.lop,
    "Net Pay": r.net,
    Adjusted: r.adjusted ? "Yes" : "No",
  }));

  // a total row at the end
  const sum = (f) => rows.reduce((t, r) => t + (Number(r[f]) || 0), 0);
  data.push({
    "Employee ID": "",
    Name: "TOTAL",
    Department: "",
    Gross: sum("gross"),
    Deductions: sum("deductions"),
    "LOP Deduction": sum("lop"),
    "Net Pay": sum("net"),
    Adjusted: "",
  });

  const sheet = XLSX.utils.json_to_sheet(data);
  sheet["!cols"] = [{ wch: 14 }, { wch: 26 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 10 }];
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Payroll");
  XLSX.writeFile(book, `payroll-${month || "draft"}.xlsx`);
}
