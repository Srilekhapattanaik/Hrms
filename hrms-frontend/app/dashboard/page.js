"use client";

import MainLayout from "../components/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome to your HRMS dashboard.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Employees
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-800">
              120
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Present Today
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              105
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              On Leave
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              10
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              87%
            </p>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            HR Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage employees, attendance, leave, reports and
            other HR operations from the sidebar.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}