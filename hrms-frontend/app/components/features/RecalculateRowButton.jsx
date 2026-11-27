"use client";

import { useState } from "react";
import {
  calculateSingle,
  normalizeCalculation,
} from "../../../services/features/payrollPreviewService.js";
import { callApi } from "../../../services/features/utils/callApi.js";
import { getErrorMessage } from "../../../services/features/utils/getErrorMessage.js";
import { formatMoney } from "../../../services/features/utils/salaryHelpers.js";

const EMPTY_MANUAL = {
  basic: "",
  hra: "",
  allowances: "",
  lopDays: "",
  totalWorkingDays: "30",
  otherDeductions: "",
  state: "",
};

// T-17  "Recalc" button for ONE row of the payroll table.
//  1. asks the server to calculate this employee (automatic: from the salary structure)
//  2. shows Current next to Server values + the breakdown (PF, ESI, Professional Tax, LOP ...)
//  3. optional: "Try manual values" sends Basic / HRA / Allowances / LOP days ... to the server
//  4. "Apply to draft" saves the server's Gross and Deductions (through onApply = the adjust API)
export default function RecalculateRowButton({ row, month, currency = "INR", canApply, onApply }) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [calc, setCalc] = useState(null);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState(EMPTY_MANUAL);

  const employeeId = row.employeeId;

  const send = async (body) => {
    setError("");
    setCalc(null);
    setBusy(true);
    const result = await callApi(() => calculateSingle(employeeId, body));
    setBusy(false);
    if (result.ok) setCalc(normalizeCalculation(result.data));
    else setError(getErrorMessage(result));
  };

  const run = () => {
    setOpen(true);
    setShowManual(false);
    setManual(EMPTY_MANUAL);
    if (!employeeId) {
      setCalc(null);
      setError("This row has no employee id, so it cannot be recalculated.");
      return;
    }
    send({}); // automatic: the server uses the employee's salary structure
  };

  const runManual = () => {
    const n = (v) => (v === "" ? undefined : Number(v));
    const body = {
      basic: n(manual.basic),
      hra: n(manual.hra),
      allowances: n(manual.allowances),
      lopDays: n(manual.lopDays),
      totalWorkingDays: n(manual.totalWorkingDays),
      otherDeductions: n(manual.otherDeductions),
      state: manual.state.trim() || undefined,
      payrollMonth: month,
    };
    if (body.basic === undefined || !(body.basic >= 0)) {
      setError("Enter the Basic salary (0 or more) to calculate with manual values.");
      return;
    }
    send(body);
  };

  const close = () => {
    if (applying) return;
    setOpen(false);
  };

  const apply = async () => {
    setApplying(true);
    const result = await onApply(row, calc);
    setApplying(false);
    if (result?.ok) setOpen(false);
    else setError(result?.error || "Could not apply the values.");
  };

  const same = calc && calc.gross === row.gross && calc.deductions === row.deductions;
  const money = (v) => formatMoney(v, currency);

  const compare = (label, current, server, strong = false) => (
    <tr className="border-t border-white/10">
      <td className="py-2 pr-4 text-slate-400">{label}</td>
      <td className="py-2 pr-4 text-right text-slate-300">{money(current)}</td>
      <td className={`py-2 text-right ${strong ? "font-semibold text-sky-300" : "text-slate-100"}`}>
        {money(server)}
      </td>
    </tr>
  );

  const detail = (label, value) => (
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200">{money(value)}</span>
    </div>
  );

  const field = (name, label, props = {}) => (
    <div>
      <label className="mb-1 block text-xs text-slate-400">{label}</label>
      <input
        value={manual[name]}
        onChange={(e) => setManual({ ...manual, [name]: e.target.value })}
        className="w-full rounded-lg border border-white/15 bg-slate-900/60 px-2 py-1.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
        {...props}
      />
    </div>
  );

  return (
    <>
      <button
        onClick={run}
        disabled={busy}
        className="mr-2 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-300 hover:bg-green-500/20 disabled:opacity-50"
      >
        {busy && !open ? "Calculating..." : "Recalc"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#111833] p-5 text-left shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-100">Recalculate - {row.name}</h3>
            <p className="mt-1 text-xs text-slate-400">
              The server calculates this employee again. Nothing is saved until you click &quot;Apply to draft&quot;.
            </p>

            {busy && <p className="mt-5 text-sm text-slate-400">Calculating...</p>}
            {error && (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            {calc && (
              <>
                {calc.zeroNetPay && (
                  <p className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-sm text-orange-200">
                    Zero Net Pay: the deductions are more than the earnings, so Net Pay is set to 0.
                  </p>
                )}

                <table className="mt-4 w-full text-sm">
                  <thead className="text-xs uppercase text-slate-500">
                    <tr>
                      <th className="pb-2 text-left font-medium"></th>
                      <th className="pb-2 pr-4 text-right font-medium">Current</th>
                      <th className="pb-2 text-right font-medium">Server</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compare("Gross", row.gross, calc.gross)}
                    {compare("Deductions", row.deductions, calc.deductions)}
                    {compare("Net pay", row.net, calc.net, true)}
                  </tbody>
                </table>

                <div className="mt-4 space-y-1 rounded-lg bg-white/5 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                    Breakdown{calc.source ? ` (${calc.source})` : ""}
                    {calc.state ? ` - ${calc.state}` : ""}
                  </p>
                  {detail("Basic", calc.basic)}
                  {detail("HRA", calc.hra)}
                  {detail("Allowances", calc.allowances)}
                  {detail("PF", calc.pf)}
                  {detail("ESI", calc.esi)}
                  {detail("Professional Tax", calc.professionalTax)}
                  {detail(`LOP deduction (${calc.lopDays} days)`, calc.lopDeduction)}
                  {detail("Other deductions", calc.otherDeductions)}
                </div>

                {same && (
                  <p className="mt-3 text-xs text-slate-400">
                    The server gives the same Gross and Deductions as the table. Nothing to change.
                  </p>
                )}
              </>
            )}

            <button
              onClick={() => setShowManual((v) => !v)}
              className="mt-4 text-xs font-medium text-sky-300 hover:underline"
            >
              {showManual ? "Hide manual values" : "Try manual values"}
            </button>

            {showManual && (
              <div className="mt-3 rounded-lg border border-white/10 p-3">
                <div className="grid grid-cols-2 gap-3">
                  {field("basic", "Basic *", { type: "number", min: "0" })}
                  {field("hra", "HRA", { type: "number", min: "0" })}
                  {field("allowances", "Allowances", { type: "number", min: "0" })}
                  {field("otherDeductions", "Other deductions", { type: "number", min: "0" })}
                  {field("lopDays", "LOP days", { type: "number", min: "0" })}
                  {field("totalWorkingDays", "Working days", { type: "number", min: "1" })}
                  <div className="col-span-2">{field("state", "State (for Professional Tax)", { placeholder: "e.g. Telangana" })}</div>
                </div>
                <button
                  onClick={runManual}
                  disabled={busy}
                  className="mt-3 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  Calculate with these values
                </button>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={close}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
              >
                Close
              </button>
              {calc && canApply && !same && (
                <button
                  onClick={apply}
                  disabled={applying}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {applying ? "Applying..." : "Apply to draft"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
