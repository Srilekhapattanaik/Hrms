import api from "./api";

// T-17  Recalculate ONE employee with the server's salary rules (Naresh, task N-20).
// POST http://localhost:8080/api/v1/payroll/calculate-single/{employeeId}
//   body {}                 -> the server calculates from the employee's assigned SalaryStructure
//   body { basic, hra, allowances, lopDays, totalWorkingDays, otherDeductions, state, payrollMonth }
//                           -> manual values (when Finance edits a row). Nothing is saved by this call.
export const calculateSingle = (employeeId, body = {}) =>
  api.post(`/payroll/calculate-single/${employeeId}`, body);

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const has = (v) => v !== undefined && v !== null && v !== "";

// Field names of Naresh's response. If he renames something, change it in this ONE place.
export const normalizeCalculation = (d) => {
  const gross = num(d?.grossSalary ?? d?.gross);
  const deductions = num(d?.totalDeductions ?? d?.deductions);
  const net = has(d?.netSalary) ? num(d.netSalary) : gross - deductions;
  return {
    gross,
    deductions,
    net,
    basic: num(d?.basic),
    hra: num(d?.hra),
    allowances: num(d?.allowances),
    pf: num(d?.pf),
    esi: num(d?.esi),
    professionalTax: num(d?.professionalTax),
    lopDays: num(d?.lopDays),
    lopDeduction: num(d?.lopDeduction),
    otherDeductions: num(d?.otherDeductions),
    zeroNetPay: Boolean(d?.zeroNetPayTriggered),
    source: d?.calculationSource || "",
    state: d?.state || "",
  };
};
