
"use client";

import Link from "next/link";
import {
  Users,
  CalendarCheck,
  FileText,
  ShieldCheck,
  ArrowRight,
  Building2,
  Clock3,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Manage employee profiles, departments, roles and organizational information.",
    },
    {
      icon: CalendarCheck,
      title: "Attendance Tracking",
      description:
        "Monitor employee attendance, working hours and daily presence.",
    },
    {
      icon: FileText,
      title: "Reports & Analytics",
      description:
        "Generate useful HR reports and get a clear view of workforce data.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      description:
        "Role-based access ensures employees can access only authorized features.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Building2 size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide">
                HRMS
              </h1>

              <p className="text-xs text-slate-400">
                Human Resource Management
              </p>
            </div>
          </div>

          {/* Login */}
          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        
        {/* Background decorations */}
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <CheckCircle2 size={16} />
              Enterprise HR Management Platform
            </div>

            <h2 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Manage your
              <span className="block text-blue-400">
                workforce smarter.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              A centralized Human Resource Management System designed
              to simplify employee management, attendance, reporting
              and everyday HR operations.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Get Started
                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>

            {/* Small Stats */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5">
              <div>
                <p className="text-2xl font-bold">120+</p>
                <p className="text-xs text-slate-500">
                  Employees
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">15+</p>
                <p className="text-xs text-slate-500">
                  Departments
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">99%</p>
                <p className="text-xs text-slate-500">
                  Availability
                </p>
              </div>
            </div>
          </div>

          {/* Right Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
              
              <div className="rounded-2xl bg-white p-6 text-slate-900">
                
                {/* Fake Dashboard Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Dashboard
                    </p>

                    <h3 className="text-2xl font-bold">
                      Good Morning 👋
                    </h3>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-blue-100" />
                </div>

                {/* Cards */}
                <div className="mt-7 grid grid-cols-2 gap-4">
                  
                  <div className="rounded-xl bg-blue-50 p-4">
                    <Users className="text-blue-600" size={23} />
                    <p className="mt-3 text-xs text-slate-500">
                      Total Employees
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      120
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-4">
                    <CalendarCheck className="text-green-600" size={23} />
                    <p className="mt-3 text-xs text-slate-500">
                      Present Today
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      105
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-4">
                    <Clock3 className="text-orange-600" size={23} />
                    <p className="mt-3 text-xs text-slate-500">
                      On Leave
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      10
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4">
                    <BarChart3 className="text-purple-600" size={23} />
                    <p className="mt-3 text-xs text-slate-500">
                      Attendance
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      87%
                    </p>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="mt-5 rounded-xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Weekly Attendance
                    </p>

                    <span className="text-xs text-green-600">
                      +8.4%
                    </span>
                  </div>

                  <div className="mt-6 flex h-24 items-end gap-3">
                    {[45, 65, 55, 80, 70, 90, 75].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex flex-1 items-end"
                        >
                          <div
                            style={{ height: `${height}%` }}
                            className="w-full rounded-t-md bg-blue-500"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-slate-900 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              HRMS Features
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything HR needs in one place
            </h2>

            <p className="mt-4 text-slate-400">
              Manage your organization's workforce through a
              simple and centralized platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>
            © 2026 HRMS. Human Resource Management System.
          </p>

          <p>
            Secure • Simple • Efficient
          </p>
        </div>
      </footer>
    </main>
  );
}