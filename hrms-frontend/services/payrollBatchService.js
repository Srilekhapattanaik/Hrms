// Payroll batch workflow (Naresh, task N-18 / N-19):  DRAFT -> PROCESSING -> APPROVED -> LOCKED
//   GET  /api/v1/payroll/batches/{month}             batch summary of one month (month = 2026-11)
//   GET  /api/v1/payroll/batches                     all batches
//   POST /api/v1/payroll/batches                     body { payrollMonth: "2026-11" }  creates a DRAFT batch
//   PUT  /api/v1/payroll/batches/{batchId}/status    body { status: "PROCESSING" }
//   PUT  /api/v1/payroll/batches/{batchId}/approve
//   PUT  /api/v1/payroll/batches/{batchId}/lock
// URLs live in services/endpoints.js.
import { request } from "./api";
import { ENDPOINTS } from "./endpoints";

export const BATCH_STEPS = ["DRAFT", "PROCESSING", "APPROVED", "LOCKED"];
export const BATCH_APPROVE_ROLES = ["SUPER_ADMIN", "FINANCE_ADMIN"]; // who may approve / lock

const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v));
// "approvedBy" may be a name, an e-mail or an object
const who = (v) => (v && typeof v === "object" ? v.fullName || v.name || v.email || "" : v || "");

export const normalizeBatch = (b) => ({
  id: b.id ?? b.batchId,
  month: b.payrollMonth || b.month || "",
  status: String(b.status || "DRAFT").toUpperCase(),
  totalEmployees: num(b.totalEmployees),
  totalGross: num(b.totalGross),
  totalDeductions: num(b.totalDeductions),
  totalNet: num(b.totalNet),
  approvedBy: who(b.approvedBy),
  lockedBy: who(b.lockedBy),
});

// null = this month has no batch yet
export const getBatch = async (month) => {
  try {
    return normalizeBatch(await request(ENDPOINTS.payrollBatch(month)));
  } catch (err) {
    if (/no static resource|not found|\b404\b|no batch/i.test(String(err?.message || ""))) return null;
    throw err;
  }
};

export const createBatch = async (month) =>
  normalizeBatch(
    await request(ENDPOINTS.payrollBatches, {
      method: "POST",
      body: JSON.stringify({ payrollMonth: month }),
    })
  );

export const setBatchStatus = (id, status) =>
  request(ENDPOINTS.payrollBatchStatus(id), { method: "PUT", body: JSON.stringify({ status }) });

export const approveBatch = (id) => request(ENDPOINTS.payrollBatchApprove(id), { method: "PUT" });

export const lockBatch = (id) => request(ENDPOINTS.payrollBatchLock(id), { method: "PUT" });
