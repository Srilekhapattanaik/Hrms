"use client";

import EmployeePayslipHistory from "../EmployeePayslipHistory.jsx";
import { useSession } from "../../../../services/features/utils/useSession.js";

// T-18  "My Payslips" (employee self-service)
export default function PayslipsPage() {
  const { employeeId, ready } = useSession();
  if (!ready) return null; // wait until the logged-in user has been read

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-[#111833] p-4 shadow-sm sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-100">My Payslips</h1>
        <p className="mt-1 text-sm text-slate-400">
          Your past payslips. Open one to preview it, or download the PDF.
        </p>
      </div>
      <EmployeePayslipHistory employeeId={employeeId} />
    </div>
  );
}
