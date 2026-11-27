"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Alert from "./Alert.jsx";
import {
  getPayslips,
  getPayslipPdfUrl,
  normalizePayslips,
} from "../../../services/features/payslipService.js";
import { callApi } from "../../../services/features/utils/callApi.js";
import { getErrorMessage } from "../../../services/features/utils/getErrorMessage.js";
import { formatMoney } from "../../../services/features/utils/salaryHelpers.js";
import { formatPeriod } from "../../../services/features/utils/payrollDraftHelpers.js";

// react-pdf only works in the browser, so it is loaded on demand (ssr: false)
const PayslipPDFViewer = dynamic(() => import("./PayslipPDFViewer.jsx"), {
  ssr: false,
  loading: () => null,
});

const isMissing = (message) => /no static resource|not found|404/i.test(String(message));

// T-18  Employee self-service: list of past payslips, newest first.
//   "View" opens the PDF in a modal (T-19), "Download PDF" saves the file.
export default function EmployeePayslipHistory({ employeeId }) {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notReady, setNotReady] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [viewer, setViewer] = useState(null); // { url, title, fileName }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotReady(false);
    const result = await callApi(() => getPayslips(employeeId));
    if (result.ok) {
      setPayslips(normalizePayslips(result.data));
    } else {
      const message = getErrorMessage(result);
      setPayslips([]);
      if (isMissing(message)) setNotReady(true);
      else setError(message);
    }
    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) load();
    else setLoading(false);
  }, [employeeId, load]);

  // free the temporary blob: URL when the modal closes
  const closeViewer = useCallback(() => {
    setViewer((v) => {
      if (v?.url) URL.revokeObjectURL(v.url);
      return null;
    });
  }, []);

  const fileNameOf = (p) => `payslip-${p.month || p.id}.pdf`;

  const openPdf = async (p) => {
    setBusyId(`view-${p.id}`);
    setError("");
    try {
      const url = await getPayslipPdfUrl(p.id);
      setViewer({ url, title: `Payslip - ${formatPeriod(p.month)}`, fileName: fileNameOf(p) });
    } catch (e) {
      setError(e.message || "Could not open the payslip.");
    }
    setBusyId(null);
  };

  const download = async (p) => {
    setBusyId(`dl-${p.id}`);
    setError("");
    try {
      const url = await getPayslipPdfUrl(p.id);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNameOf(p);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      setError(e.message || "Could not download the payslip.");
    }
    setBusyId(null);
  };

  if (!employeeId) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-slate-400">
        Your login is not linked to an employee record, so there are no payslips to show.
      </p>
    );
  }

  return (
    <div>
      <Alert type="error" message={error} />
      {notReady && (
        <Alert
          type="warning"
          message="Payslips are not available yet: the backend payslip API (GET /api/v1/payslips) is not ready."
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0f1a2e] text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3 text-right">Gross</th>
              <th className="px-4 py-3 text-right">Deductions</th>
              <th className="px-4 py-3 text-right">Net Pay</th>
              <th className="px-4 py-3 text-right">Payslip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  Loading payslips...
                </td>
              </tr>
            )}
            {!loading && payslips.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-3xl">🧾</p>
                  <p className="mt-2 font-semibold text-slate-300">No payslips yet</p>
                  <p className="text-sm text-slate-400">Your payslips appear here after payroll is processed.</p>
                </td>
              </tr>
            )}
            {!loading &&
              payslips.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-100">
                    {formatPeriod(p.month) || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-slate-300">{formatMoney(p.gross)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-slate-300">{formatMoney(p.deductions)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-sky-300">{formatMoney(p.net)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      onClick={() => openPdf(p)}
                      disabled={busyId !== null}
                      className="mr-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
                    >
                      {busyId === `view-${p.id}` ? "Opening..." : "View"}
                    </button>
                    <button
                      onClick={() => download(p)}
                      disabled={busyId !== null}
                      className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-50"
                    >
                      {busyId === `dl-${p.id}` ? "Preparing..." : "Download PDF"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {viewer && (
        <PayslipPDFViewer
          url={viewer.url}
          title={viewer.title}
          fileName={viewer.fileName}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
