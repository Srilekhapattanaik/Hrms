"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../Alert.jsx";
import PayrollDraftTable from "../PayrollDraftTable.jsx";
import PayrollAuditModal from "../PayrollAuditModal.jsx";
import {
  AUDIT_LOG_ENABLED,
  adjustPayroll,
  getPayrollDraft,
} from "../../../../services/features/payrollDraftService.js";
import {
  ADJUST_ROLES,
  DRAFT_VIEW_ROLES,
  currentMonth,
  formatPeriod,
  isLocked,
  normalizeDraft,
} from "../../../../services/features/utils/payrollDraftHelpers.js";
import { formatMoney } from "../../../../services/features/utils/salaryHelpers.js";
import { callApi } from "../../../../services/features/utils/callApi.js";
import { getErrorMessage } from "../../../../services/features/utils/getErrorMessage.js";
import { useSession } from "../../../../services/features/utils/useSession.js";
import { exportPayrollExcel } from "../../../../services/features/utils/exportPayrollExcel.js";
import { getBatch, isLockedStatus } from "../../../../services/features/payrollBatchService.js";

export default function PayrollDraftPage() {
  const { role, ready } = useSession();
  const canView = DRAFT_VIEW_ROLES.includes(role);
  const canEdit = ADJUST_ROLES.includes(role);

  const [month, setMonth] = useState(currentMonth());
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [query, setQuery] = useState("");
  const [historyRow, setHistoryRow] = useState(null);
  const [adjustedIds, setAdjustedIds] = useState(new Set()); // rows saved in this session
  const [batchStatus, setBatchStatus] = useState(""); // DRAFT / PROCESSING / APPROVED / LOCKED

  const loadDraft = useCallback(
    async (silent = false) => {
      if (!month) return;
      if (!silent) setLoading(true);
      setError("");
      const result = await callApi(() => getPayrollDraft(month));
      if (result.ok) {
        setDraft(normalizeDraft(result.data, month));
      } else {
        if (!silent) setDraft(null);
        if (result.status === 404) setError(`No payroll has been processed for ${formatPeriod(month)}.`);
        else if (result.status === 401 || result.status === 403)
          setError("Access denied. You are not allowed to view payroll.");
        else setError(getErrorMessage(result));
      }
      if (!silent) setLoading(false);
    },
    [month]
  );

  useEffect(() => {
    if (canView) {
      setAlert({ type: "", message: "" });
      loadDraft();
    }
  }, [canView, loadDraft]);

  // N-19: when the month's batch is LOCKED the backend refuses every change (403),
  // so editing is switched off here
  useEffect(() => {
    if (!canView || !month) return;
    let off = false;
    (async () => {
      const r = await callApi(() => getBatch(month));
      if (!off) setBatchStatus(r.ok ? String(r.data?.status || "").toUpperCase() : "");
    })();
    return () => {
      off = true;
    };
  }, [canView, month, draft]);

  const locked = isLockedStatus(batchStatus) || (draft ? isLocked(draft.status) : false);

  // Called by the table when "Recalculate" is clicked on an edited row
  const handleAdjust = async (row, body) => {
    setAlert({ type: "", message: "" });
    const result = await callApi(() => adjustPayroll(row.id, body));
    if (result.ok) {
      await loadDraft(true);
      setAdjustedIds((s) => new Set(s).add(row.id));
      setAlert({
        type: "success",
        message: `${row.name}: row recalculated and the change was recorded in the audit log.`,
      });
      return { ok: true };
    }
    if (result.status === 403) {
      return { ok: false, error: "You are not allowed to adjust payroll values." };
    }
    if (result.status === 409) {
      return { ok: false, error: "This payroll is locked. Adjustments are no longer allowed." };
    }
    return { ok: false, error: getErrorMessage(result) };
  };

  const rows = useMemo(
    () =>
      (draft?.rows ?? []).map((r) => ({ ...r, adjusted: r.adjusted || adjustedIds.has(r.id) })),
    [draft, adjustedIds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.code, r.name, r.department].join(" ").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (t, r) => ({
          gross: t.gross + r.gross,
          deductions: t.deductions + r.deductions,
          net: t.net + r.net,
        }),
        { gross: 0, deductions: 0, net: 0 }
      ),
    [rows]
  );

  // T-17: "Apply to draft" in the Recalc window saves the server values through the adjust API
  const handleApplyCalc = (row, calc) =>
    handleAdjust(row, {
      grossSalary: calc.gross,
      totalDeductions: calc.deductions,
      reason: "Recalculated with the server salary rules",
    });

  // T-20: Export to Excel (what you see after the search filter)
  const handleExport = async () => {
    setAlert({ type: "", message: "" });
    try {
      await exportPayrollExcel(filtered, month);
    } catch {
      setAlert({ type: "error", message: "Could not create the Excel file. Please try again." });
    }
  };

  if (!ready) return null; // wait until the logged-in role has been read

  if (!canView) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-[#111833] p-10 text-center shadow-sm">
        <p className="text-4xl">🔒</p>
        <p className="mt-2 font-semibold text-slate-300">You do not have access</p>
        <p className="text-sm text-slate-400">Only Finance and HR can view the payroll draft.</p>
      </div>
    );
  }

  const currency = draft?.currency || "INR";

  return (
    <div className="mx-auto max-w-6xl rounded-2xl bg-[#111833] p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Payroll Draft Preview</h1>
          <p className="mt-1 text-sm text-slate-400">
            {formatPeriod(month)}
            {draft && (
              <span
                className={`ml-2 rounded-full px-3 py-0.5 text-xs font-semibold ${
                  locked ? "bg-slate-700 text-slate-300" : "bg-yellow-500/100/15 text-yellow-300"
                }`}
              >
                {locked ? "Locked" : "Draft"}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-white/15 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, department..."
            className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-500 sm:w-64"
          />
          <button
            onClick={() => loadDraft()}
            disabled={loading}
            className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 disabled:opacity-60"
          >
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={loading || rows.length === 0}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <Alert type="error" message={error} />
      <Alert type={alert.type} message={alert.message} />
      {error && (
        <button
          onClick={() => loadDraft()}
          className="mb-4 rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-white/10"
        >
          Try again
        </button>
      )}

      {locked && (
        <div className="mb-4 rounded-lg border border-white/15 bg-[#0f1a2e] px-4 py-3 text-sm text-slate-300">
          🔒 This payroll is locked. Adjustments are disabled.
        </div>
      )}

      {!canEdit && draft && (
        <p className="mb-4 text-xs text-slate-400">
          You can view this draft. Only Finance Admins can adjust values.
        </p>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-sky-500/10 p-4 text-sm lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase text-slate-400">Employees</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{rows.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-400">Total Gross</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">
            {formatMoney(totals.gross, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-400">Total Deductions</p>
          <p className="mt-1 text-lg font-semibold text-slate-100">
            {formatMoney(totals.deductions, currency)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-400">Total Net Pay</p>
          <p className="mt-1 text-lg font-bold text-sky-300">
            {formatMoney(totals.net, currency)}
          </p>
        </div>
      </div>

      <PayrollDraftTable
        rows={filtered}
        currency={currency}
        canEdit={canEdit}
        locked={locked}
        loading={loading}
        resetKey={`${month}|${query}`}
        showHistory={AUDIT_LOG_ENABLED}
        month={month}
        onAdjust={handleAdjust}
        onApplyCalc={handleApplyCalc}
        onHistory={setHistoryRow}
      />

      <PayrollAuditModal
        batchId={null}
        row={historyRow}
        currency={currency}
        onClose={() => setHistoryRow(null)}
      />
    </div>
  );
}