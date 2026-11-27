"use client";

// S-17  Payroll Processing Dashboard (Finance Admin)
//   "Process Payroll for <month>"  ->  POST /payroll/process/{month}
//   - batch workflow of the month: DRAFT -> PROCESSING -> APPROVED -> LOCKED (Naresh, N-18/N-19)
//     with the Approve / Lock buttons and "approved by / locked by"
//   - progress bar: real percentage when the backend has /process/{month}/status,
//     otherwise a moving bar until the answer arrives
//   - summary cards: Employees, Total Gross, Total Deductions, Total Net, Failed
//   - failed employees are kept for the Error Log tab (S-20)

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "../components/MainLayout";
import PayrollTabs from "../components/PayrollTabs";
import { Play, CheckCircle2, AlertCircle, AlertTriangle, Loader2, Users, Lock, Plus } from "lucide-react";
import {
  PAYROLL_ROLES,
  currentMonth,
  monthLabel,
  formatMoney,
} from "@/services/payrollService";
import { processPayrollFull, getProcessStatus } from "@/services/payrollExtraService";
import {
  BATCH_STEPS,
  BATCH_APPROVE_ROLES,
  getBatch,
  createBatch,
  setBatchStatus,
  approveBatch,
  lockBatch,
} from "@/services/payrollBatchService";

function Card({ label, value, tone = "text-slate-100", icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export default function PayrollProcessingPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [role, setRole] = useState("");

  const [month, setMonth] = useState(currentMonth);
  const [batch, setBatch] = useState(null); // batch of the chosen month, null = none yet
  const [batchError, setBatchError] = useState("");
  const [batchBusy, setBatchBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(null); // { percent, processed, total } or null
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setRole(user.role || "");
      if (PAYROLL_ROLES.includes(user.role)) setAllowed(true);
      else router.replace("/dashboard");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const loadBatch = useCallback(async () => {
    if (!month) return;
    setBatchError("");
    try {
      setBatch(await getBatch(month));
    } catch (err) {
      setBatch(null);
      setBatchError(err.message || "Could not load the batch of this month");
    }
  }, [month]);

  useEffect(() => {
    if (allowed) loadBatch();
  }, [allowed, loadBatch]);

  // run one batch action (create / processing / approve / lock), then reload the batch
  const runBatchAction = async (fn) => {
    setBatchBusy(true);
    setBatchError("");
    try {
      await fn();
      await loadBatch();
    } catch (err) {
      setBatchError(err.message || "The action failed");
    } finally {
      setBatchBusy(false);
    }
  };

  const handleCreateBatch = () => runBatchAction(() => createBatch(month));
  const handleToProcessing = () => runBatchAction(() => setBatchStatus(batch.id, "PROCESSING"));
  const handleApprove = () => {
    if (!window.confirm(`Approve the payroll of ${monthLabel(month)}?`)) return;
    runBatchAction(() => approveBatch(batch.id));
  };
  const handleLock = () => {
    if (!window.confirm(`Lock the payroll of ${monthLabel(month)}? After locking, salary and attendance of this month can no longer be changed.`)) return;
    runBatchAction(() => lockBatch(batch.id));
  };

  // ask the backend how far it is while the POST is still running
  useEffect(() => {
    if (!processing) {
      setProgress(null);
      return;
    }
    let stop = false;
    const tick = async () => {
      try {
        const s = await getProcessStatus(month);
        if (!stop && s.percent !== null) setProgress(s);
      } catch {
        /* no status API -> the bar just keeps moving */
      }
    };
    tick();
    const timer = setInterval(tick, 1500);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [processing, month]);

  const handleProcess = async () => {
    if (!month || processing) return; // no double click
    setProcessing(true);
    setError("");
    setResult(null);
    try {
      const data = await processPayrollFull(month);
      setResult({ month, ...data });
      loadBatch();
      try {
        sessionStorage.setItem(`payroll-errors-${month}`, JSON.stringify(data.errors));
      } catch {
        /* storage blocked: the Error Log tab will ask the backend instead */
      }
    } catch (err) {
      const msg = err.message || "Payroll processing failed";
      setError(
        /permission/i.test(msg)
          ? `${msg} (If this month's payroll is already Locked, it cannot be changed any more.)`
          : msg
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!allowed) return null;

  const label = monthLabel(month);
  const percent = progress?.percent ?? null;

  const status = batch?.status || "";
  const isLockedMonth = status === "LOCKED";
  const canProcess = !processing && !!month && status !== "APPROVED" && status !== "LOCKED";
  const canApprove = BATCH_APPROVE_ROLES.includes(role);

  // cards: the batch summary of the backend, or (before a batch exists) the last run on this page
  const summary =
    batch && batch.totalEmployees > 0
      ? { employees: batch.totalEmployees, gross: batch.totalGross, deductions: batch.totalDeductions, net: batch.totalNet }
      : result
      ? { employees: result.totalProcessed, gross: result.totalGross, deductions: result.totalDeductions, net: result.totalNet }
      : null;

  return (
    <MainLayout>
      <style>{`
        @keyframes payrollSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>

      <div className="mb-6">
        <h1 className="inline-block border-b-[3px] border-green-500 pb-1 text-2xl font-medium text-slate-100 md:text-3xl">
          Payroll Processing
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Choose a month and run the payroll for all employees.
        </p>
      </div>

      <PayrollTabs />

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ---------- batch status of the chosen month ---------- */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-100">Batch status - {label || "[Month]"}</h2>
          {isLockedMonth && (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
              <Lock size={12} /> Locked
            </span>
          )}
        </div>

        {batchError && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-300">
            <AlertCircle size={15} className="shrink-0" /> {batchError}
          </p>
        )}

        {!batch ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-400">There is no payroll batch for this month yet.</p>
            <button
              onClick={handleCreateBatch}
              disabled={batchBusy || !month}
              className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
            >
              {batchBusy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Create batch
            </button>
          </div>
        ) : (
          <>
            <ol className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
              {BATCH_STEPS.map((step, i) => {
                const reached = BATCH_STEPS.indexOf(status) >= i;
                return (
                  <li key={step} className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        status === step
                          ? "bg-green-500 text-white"
                          : reached
                          ? "bg-green-500/20 text-green-300"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {step.charAt(0) + step.slice(1).toLowerCase()}
                    </span>
                    {i < BATCH_STEPS.length - 1 && <span className="text-slate-600">&rarr;</span>}
                  </li>
                );
              })}
            </ol>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-400">
              {batch.approvedBy && <span>Approved by: <b className="text-slate-200">{batch.approvedBy}</b></span>}
              {batch.lockedBy && <span>Locked by: <b className="text-slate-200">{batch.lockedBy}</b></span>}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {status === "DRAFT" && (
                <button
                  onClick={handleToProcessing}
                  disabled={batchBusy}
                  className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
                >
                  Mark as Processing
                </button>
              )}
              {status === "PROCESSING" && canApprove && (
                <button
                  onClick={handleApprove}
                  disabled={batchBusy}
                  className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50"
                >
                  Approve payroll
                </button>
              )}
              {status === "APPROVED" && canApprove && (
                <button
                  onClick={handleLock}
                  disabled={batchBusy}
                  className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50"
                >
                  <Lock size={14} /> Lock payroll
                </button>
              )}
              {(status === "PROCESSING" || status === "APPROVED") && !canApprove && (
                <p className="text-sm text-slate-400">Only a Finance Admin can approve or lock the payroll.</p>
              )}
              {batchBusy && <Loader2 size={16} className="animate-spin text-slate-400" />}
            </div>

            {isLockedMonth && (
              <p className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                This month is locked. Salary and attendance can no longer be changed and payroll cannot be processed again.
              </p>
            )}
          </>
        )}
      </div>

      {/* ---------- trigger ---------- */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="month" className="mb-1.5 block text-xs text-slate-400">
              Payroll month
            </label>
            <input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={processing}
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleProcess}
            disabled={!canProcess}
            className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {processing ? "Processing..." : `Process Payroll for ${label || "[Month]"}`}
          </button>
        </div>

        {processing && (
          <div className="mt-6">
            <p className="mb-2 text-sm text-slate-300">
              Processing payroll for {label}
              {percent !== null && ` - ${progress.processed} of ${progress.total} employees (${percent}%)`}
              . Please keep this page open...
            </p>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
              {percent !== null ? (
                <div
                  className="h-2 rounded-full bg-green-400 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              ) : (
                <div
                  className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-green-400"
                  style={{ animation: "payrollSlide 1.4s ease-in-out infinite" }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------- summary cards (batch totals) ---------- */}
      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Card label="Employees" value={summary.employees} icon={<Users size={14} className="text-sky-400" />} />
          <Card label="Total Gross" value={formatMoney(summary.gross)} />
          <Card label="Total Deductions" value={formatMoney(summary.deductions)} tone="text-red-300" />
          <Card label="Total Net Pay" value={formatMoney(summary.net)} tone="text-green-300" />
          <Card
            label="Failed"
            value={result ? result.errors.length : "-"}
            tone={result?.errors.length ? "text-orange-300" : "text-slate-100"}
            icon={<AlertTriangle size={14} className="text-orange-400" />}
          />
        </div>
      )}

      {/* ---------- result of the last run ---------- */}
      {result && (
        <>
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <p className="font-semibold text-green-200">
                Payroll for {monthLabel(result.month)} is processed
              </p>
              {result.message && <p className="text-sm text-green-300/80">{result.message}</p>}
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
              <span>
                {result.errors.length} employee(s) could not be processed.
              </span>
              <Link href="/payroll/errors" className="font-semibold underline">
                View the error log
              </Link>
            </div>
          )}

          {result.records.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="font-semibold text-slate-100">Processed employees</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Employee</th>
                      <th className="px-5 py-3 text-right font-medium">Gross</th>
                      <th className="px-5 py-3 text-right font-medium">Deductions</th>
                      <th className="px-5 py-3 text-right font-medium">Net pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.records.map((r, i) => (
                      <tr key={r.id ?? i} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-5 py-3 font-medium text-slate-100">{r.employeeName}</td>
                        <td className="px-5 py-3 text-right text-slate-300">{formatMoney(r.gross)}</td>
                        <td className="px-5 py-3 text-right text-red-300">{formatMoney(r.deductions)}</td>
                        <td className="px-5 py-3 text-right font-semibold text-green-300">
                          {formatMoney(r.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
