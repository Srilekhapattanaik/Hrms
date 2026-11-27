"use client";

// S-20  Payroll Error Log: employees that failed processing, with the reason.
//   GET /payroll/process/{month}/errors
//   If the backend has no such API, the list from the last "Process Payroll" run in this browser is shown.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import PayrollTabs from "../../components/PayrollTabs";
import { RefreshCw, AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { PAYROLL_ROLES, currentMonth, monthLabel } from "@/services/payrollService";
import { getProcessErrors, isMissingApi } from "@/services/payrollExtraService";

// plain-language next step for the common reasons
const hintFor = (reason) => {
  const r = String(reason).toLowerCase();
  if (r.includes("bank")) return "Add the bank details in the employee profile, then process again.";
  if (r.includes("salary") || r.includes("structure")) return "Assign a salary structure to this employee.";
  if (r.includes("pan")) return "Add the PAN number in the employee profile.";
  return "";
};

const readSaved = (month) => {
  try {
    return JSON.parse(sessionStorage.getItem(`payroll-errors-${month}`) || "null");
  } catch {
    return null;
  }
};

export default function PayrollErrorLogPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const [month, setMonth] = useState(currentMonth);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(""); // "server" | "browser"
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (PAYROLL_ROLES.includes(user.role)) setAllowed(true);
      else router.replace("/dashboard");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const load = useCallback(async () => {
    if (!month) return;
    setLoading(true);
    setError("");
    try {
      setRows(await getProcessErrors(month));
      setSource("server");
    } catch (err) {
      const saved = readSaved(month);
      if (isMissingApi(err) && saved) {
        setRows(saved);
        setSource("browser");
      } else if (isMissingApi(err)) {
        setRows([]);
        setSource("browser");
      } else {
        setRows([]);
        setError(err.message || "Could not load the error log");
      }
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  if (!allowed) return null;

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="inline-block border-b-[3px] border-green-500 pb-1 text-2xl font-medium text-slate-100 md:text-3xl">
          Payroll Error Log
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Employees that could not be processed, and why.
        </p>
      </div>

      <PayrollTabs />

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="month" className="mb-1.5 block text-xs text-slate-400">Payroll month</label>
          <input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500" />
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}
      {source === "browser" && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            The backend has no error-log API yet (<code>GET /api/v1/payroll/process/{"{month}"}/errors</code>).
            This list comes from the last payroll run in this browser.
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold text-slate-100">
            Failed employees for {monthLabel(month)} ({rows.length})
          </h2>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 px-5 py-8 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Loading...
          </p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <CheckCircle2 size={28} className="mb-2 text-green-400" />
            <p className="font-medium text-slate-200">No processing errors</p>
            <p className="mt-1 text-xs text-slate-500">
              Every employee was processed, or payroll has not been run for this month.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Error</th>
                  <th className="px-5 py-3 font-medium">What to do</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-t border-white/10 align-top hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-slate-100">
                      {r.employeeName}
                      <span className="ml-2 text-xs text-slate-500">#{r.employeeId}</span>
                    </td>
                    <td className="px-5 py-3 text-red-300">{r.reason}</td>
                    <td className="px-5 py-3 text-slate-400">{hintFor(r.reason) || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-400">
        After fixing the problem, go back to{" "}
        <Link href="/payroll" className="text-sky-300 underline">Payroll Processing</Link> and run it again.
      </p>
    </MainLayout>
  );
}
