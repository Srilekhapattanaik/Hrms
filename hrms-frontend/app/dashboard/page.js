"use client";

import MainLayout from "../components/MainLayout";
import { Users, UserCheck, CalendarDays, UserX } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Employees",
      value: 120,
      icon: Users,
      iconStyle: "bg-sky-500/15 text-sky-400",
    },
    {
      label: "Present Today",
      value: 105,
      icon: UserCheck,
      iconStyle: "bg-green-500/15 text-green-400",
    },
    {
      label: "On Leave",
      value: 10,
      icon: CalendarDays,
      iconStyle: "bg-orange-500/15 text-orange-400",
    },
    {
      label: "Absent Today",
      value: 5,
      icon: UserX,
      iconStyle: "bg-red-500/15 text-red-400",
    },
  ];

  const employees = [
    { name: "Rahul Kumar", email: "rahul@company.com", dept: "Engineering", date: "25 Sep 2026" },
    { name: "Priya Singh", email: "priya@company.com", dept: "Human Resources", date: "22 Sep 2026" },
    { name: "Amit Das", email: "amit@company.com", dept: "Finance", date: "20 Sep 2026" },
  ];

  const activity = [
    { text: "Rahul Kumar checked in", time: "09:12 AM", dot: "bg-green-400" },
    { text: "Priya Singh checked in", time: "09:05 AM", dot: "bg-sky-400" },
    { text: "Amit Das submitted a leave request", time: "10:30 AM", dot: "bg-orange-400" },
  ];

  return (
    <MainLayout>
      {/* Page title */}
      <div className="mb-8">
        <h1 className="inline-block border-b-[3px] border-green-500 pb-1 text-2xl font-medium text-slate-100 md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Here is a summary of your workforce activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div>
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-1 text-3xl font-semibold text-slate-100">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconStyle}`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent employees */}
        <div className="rounded-2xl border border-white/10 bg-white/5 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-slate-100">Recent Employees</h2>
            <button className="rounded-full bg-slate-700/40 px-4 py-1.5 text-xs font-medium transition hover:bg-slate-700/70">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.email}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border-2 border-[#2a8fd0] p-0.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-sky-300">
                            {emp.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{emp.dept}</td>
                    <td className="px-5 py-4 text-slate-300">{emp.date}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's activity */}
        <div className="rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-slate-100">Today's Activity</h2>
          </div>

          <ul>
            {activity.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 border-t border-white/10 px-5 py-4 first:border-t-0"
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`}
                />
                <div>
                  <p className="text-sm text-slate-200">{item.text}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}