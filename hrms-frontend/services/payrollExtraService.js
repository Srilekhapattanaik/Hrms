// S-17 .. S-20  Payroll: processing summary, statutory config, professional tax slabs, error log.
// All URLs live in services/endpoints.js. If Naresh/Varma change a URL, change it THERE only.
import { request } from "./api";
import { ENDPOINTS } from "./endpoints";
import { normalizeRecord } from "./payrollService";

const num = (v) => (v === null || v === undefined || v === "" ? 0 : Number(v));
const list = (d, ...keys) => {
  if (Array.isArray(d)) return d;
  for (const k of keys) if (Array.isArray(d?.[k])) return d[k];
  return [];
};

// true when the backend has not built this API yet (so the page can say so clearly)
export const isMissingApi = (err) =>
  /no static resource|not found|\(404\)|\b404\b/i.test(String(err?.message || ""));

// ---------- S-17 / S-20 : processing ----------

const normalizeError = (e, i) => {
  const id = e.employeeId ?? e.employee?.id ?? e.id ?? i;
  return {
    key: `${id}-${i}`,
    employeeId: id,
    employeeName: e.employeeName || e.employee?.fullName || e.name || `Employee ${id}`,
    reason: e.reason || e.message || e.error || "Unknown error",
  };
};
export const normalizeErrors = (d) =>
  list(d, "errors", "failures", "failedEmployees", "content").map(normalizeError);

// POST /api/v1/payroll/process/{month}
//   -> { message, totalEmployeesProcessed, records:[...], errors:[{employeeId, employeeName, reason}],
//        totalGross?, totalDeductions?, totalNet? }
export const processPayrollFull = async (month) => {
  const data = await request(ENDPOINTS.payrollProcess(month), { method: "POST" });
  const records = list(data, "records").map(normalizeRecord);
  const sum = (f) => records.reduce((t, r) => t + (r[f] || 0), 0);
  return {
    message: data?.message || "",
    totalProcessed: data?.totalEmployeesProcessed ?? records.length,
    totalGross: data?.totalGross ?? data?.totalGrossSalary ?? sum("gross"),
    totalDeductions: data?.totalDeductions ?? sum("deductions"),
    totalNet: data?.totalNet ?? data?.totalNetSalary ?? sum("net"),
    errors: normalizeErrors(data),
    records,
  };
};

// GET /api/v1/payroll/process/{month}/status  -> { status, total, processed, failed }
// OPTIONAL: if the backend has no such API the progress bar just keeps moving.
export const getProcessStatus = async (month) => {
  const d = await request(ENDPOINTS.payrollProcessStatus(month));
  const total = num(d?.total ?? d?.totalEmployees);
  const processed = num(d?.processed ?? d?.processedCount);
  return {
    status: String(d?.status || "").toUpperCase(),
    total,
    processed,
    percent: total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : null,
  };
};

// GET /api/v1/payroll/process/{month}/errors  -> [{ employeeId, employeeName, reason }]
export const getProcessErrors = async (month) =>
  normalizeErrors(await request(ENDPOINTS.payrollProcessErrors(month)));

// ---------- S-18 Statutory configuration ----------

export const DEFAULT_STATUTORY = { pfPercent: 12, esiPercent: 1.75, esiGrossThreshold: 21000 };

const normalizeStatutory = (d) => ({
  pfPercent: num(d?.pfPercent ?? d?.pfRate ?? DEFAULT_STATUTORY.pfPercent),
  esiPercent: num(d?.esiPercent ?? d?.esiRate ?? DEFAULT_STATUTORY.esiPercent),
  esiGrossThreshold: num(
    d?.esiGrossThreshold ?? d?.esiThreshold ?? DEFAULT_STATUTORY.esiGrossThreshold
  ),
});

// GET /api/v1/payroll/statutory-config -> { pfPercent, esiPercent, esiGrossThreshold }
export const getStatutoryConfig = async () =>
  normalizeStatutory(await request(ENDPOINTS.statutoryConfig));

// PUT /api/v1/payroll/statutory-config   body = the same 3 fields
export const saveStatutoryConfig = async (cfg) =>
  normalizeStatutory(
    await request(ENDPOINTS.statutoryConfig, {
      method: "PUT",
      body: JSON.stringify({
        pfPercent: Number(cfg.pfPercent),
        esiPercent: Number(cfg.esiPercent),
        esiGrossThreshold: Number(cfg.esiGrossThreshold),
      }),
    })
  );

// ---------- S-19 Professional Tax slabs ----------

const normalizeSlab = (s) => ({
  id: s.id,
  state: s.state || "",
  minSalary: num(s.minSalary ?? s.fromAmount),
  maxSalary:
    s.maxSalary === null || s.maxSalary === undefined || s.maxSalary === ""
      ? null
      : num(s.maxSalary ?? s.toAmount),
  monthlyTax: num(s.monthlyTax ?? s.taxAmount ?? s.tax),
});

// GET /api/v1/payroll/professional-tax-slabs  (optional ?state=Karnataka)
export const getPtSlabs = async () =>
  list(await request(ENDPOINTS.ptSlabs), "slabs", "content").map(normalizeSlab);

const slabBody = (s) =>
  JSON.stringify({
    state: s.state.trim(),
    minSalary: Number(s.minSalary),
    maxSalary: s.maxSalary === "" || s.maxSalary === null ? null : Number(s.maxSalary),
    monthlyTax: Number(s.monthlyTax),
  });

// POST /api/v1/payroll/professional-tax-slabs
export const createPtSlab = async (s) =>
  normalizeSlab(await request(ENDPOINTS.ptSlabs, { method: "POST", body: slabBody(s) }));

// PUT /api/v1/payroll/professional-tax-slabs/{id}
export const updatePtSlab = async (id, s) =>
  normalizeSlab(await request(ENDPOINTS.ptSlab(id), { method: "PUT", body: slabBody(s) }));

// DELETE /api/v1/payroll/professional-tax-slabs/{id}
export const deletePtSlab = (id) => request(ENDPOINTS.ptSlab(id), { method: "DELETE" });
