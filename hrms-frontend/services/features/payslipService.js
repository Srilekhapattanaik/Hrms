import api from "./api";
import { fetchBlobUrl } from "../api";

// T-18 / T-19  Payslips of the logged-in employee.
// ASSUMED endpoints (not in the backend task list yet): confirm with Naresh/Varma, change only here.

// GET http://localhost:8080/api/v1/payslips?employeeId=8
//   -> [{ id, month: "2026-10", grossSalary, totalDeductions, netSalary, generatedAt }]
export const getPayslips = (employeeId) => api.get("/payslips", { params: { employeeId } });

// GET http://localhost:8080/api/v1/payslips/{id}/pdf   (application/pdf)
// <iframe> / react-pdf cannot send the login token, so the file is fetched with the token
// and the browser gets a temporary blob: URL.
export const getPayslipPdfUrl = (id) => fetchBlobUrl(`/api/v1/payslips/${id}/pdf`);

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const normalizePayslips = (d) => {
  const list = Array.isArray(d) ? d : d?.payslips ?? d?.content ?? [];
  return list
    .map((p, i) => {
      const gross = num(p.grossSalary ?? p.gross);
      const deductions = num(p.totalDeductions ?? p.deductions);
      const net = p.netSalary ?? p.net;
      return {
        id: p.id ?? p.payslipId ?? i,
        month: String(p.month || p.period || "").slice(0, 7),
        gross,
        deductions,
        net: net === undefined || net === null ? gross - deductions : num(net),
        generatedAt: p.generatedAt || p.createdAt || "",
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month)); // newest first
};
