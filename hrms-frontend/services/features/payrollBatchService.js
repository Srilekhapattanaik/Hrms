import api from "./api";

// GET http://localhost:8080/api/v1/payroll/batches/2026-11
//   -> { status: "DRAFT" | "PROCESSING" | "APPROVED" | "LOCKED", totalEmployees, totalGross, ... }
// N-19: once a month is LOCKED, every PUT/POST that changes salary or attendance of that
// month returns 403, so the screens check this first and disable editing.
export const getBatch = (month) => api.get(`/payroll/batches/${month}`);

export const isLockedStatus = (status) => String(status || "").toUpperCase() === "LOCKED";
