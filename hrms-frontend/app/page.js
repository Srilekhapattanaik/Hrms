import Link from "next/link";
import {
  Building2,
  ArrowRight,
  Users,
  CalendarCheck,
  Clock3,
  FileText,
  ShieldCheck,
  TrendingUp,
  Check,
} from "lucide-react";
import { poppins } from "./components/fonts";

export default function HomePage() {
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how" },
    { name: "Contact", href: "#contact" },
  ];

  const stats = [
    { value: "120+", label: "Employees managed" },
    { value: "98%", label: "Attendance accuracy" },
    { value: "24/7", label: "Access anywhere" },
    { value: "1 min", label: "To approve a leave" },
  ];

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      text: "Keep every profile, department and joining detail in one organised place.",
    },
    {
      icon: CalendarCheck,
      title: "Attendance Tracking",
      text: "See who is present, absent or on leave today without chasing spreadsheets.",
    },
    {
      icon: Clock3,
      title: "Leave Management",
      text: "Employees apply, managers approve. No emails, no paperwork.",
    },
    {
      icon: FileText,
      title: "HR Reports",
      text: "Clear summaries that help the team make quick, informed decisions.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Login",
      text: "Token-based sign in keeps employee data available only to the right people.",
    },
    {
      icon: TrendingUp,
      title: "Live Dashboard",
      text: "A single screen with the numbers that matter for your workforce today.",
    },
  ];

  const steps = [
    {
      no: "1",
      title: "Sign in",
      text: "Log in with your work email and password.",
    },
    {
      no: "2",
      title: "Open your dashboard",
      text: "Get today's headcount, attendance and activity at a glance.",
    },
    {
      no: "3",
      title: "Manage your team",
      text: "Handle employees, attendance and leave from the sidebar.",
    },
  ];

  return (
    <main
      className={`${poppins.className} min-h-screen bg-[#0b1020] text-slate-300`}
    >
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1020]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white">
              <Building2 size={19} />
            </div>
            <span className="text-lg font-semibold text-white">HRMS</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-slate-400 transition hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <Link
            href="/login"
            className="rounded-lg bg-sky-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* soft background glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-sky-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2">
          {/* Left: text */}
          <div>
            <span className="inline-block rounded-md border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
              Human Resource Management System
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Run your HR work{" "}
              <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                without the chaos
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
              Employees, attendance and leave requests, all managed from one
              clean dashboard. Less paperwork for the HR team, more time for
              people.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-sky-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                Get Started
                <ArrowRight size={17} />
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                See features
              </a>
            </div>

            <ul className="mt-8 space-y-2 text-sm text-slate-400">
              {[
                "Simple, clean dashboard",
                "Works on mobile and desktop",
                "Secure sign in",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: dashboard preview card */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-[#111833] p-5 shadow-2xl shadow-black/40">
              {/* window dots */}
              <div className="mb-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-slate-500">
                  HR Dashboard
                </span>
              </div>

              {/* mini stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Present", value: "105", color: "text-green-400" },
                  { label: "On leave", value: "10", color: "text-orange-400" },
                  { label: "Absent", value: "5", color: "text-red-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-white/5 p-3"
                  >
                    <p className="text-[11px] text-slate-500">{item.label}</p>
                    <p className={`mt-1 text-2xl font-semibold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* mini bar chart */}
              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <p className="mb-3 text-xs text-slate-400">
                  Weekly attendance
                </p>
                <div className="flex h-24 items-end gap-2">
                  {[60, 80, 70, 90, 85, 40, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-sky-600 to-sky-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="flex-1 text-center">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* mini list */}
              <div className="mt-4 space-y-2">
                {[
                  { name: "Rahul Kumar", info: "Checked in · 09:12 AM" },
                  { name: "Priya Singh", info: "Checked in · 09:05 AM" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-300">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        {row.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{row.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-white/10 bg-[#0f1630] px-4 py-3 shadow-xl sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">87.5%</p>
                <p className="text-[11px] text-slate-500">Attendance today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS STRIP ================= */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="text-sm font-medium text-sky-400">Features</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            Everything your HR team needs
          </h2>
          <p className="mt-3 text-slate-400">
            Simple tools for the daily work, all in one place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-sky-500/40 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 transition group-hover:bg-sky-500 group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-medium text-sky-400">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
              Up and running in three steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.no}
                className="relative rounded-2xl border border-white/10 bg-[#0d1428] p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                  {step.no}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-700 px-6 py-14 text-center">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <h2 className="relative text-3xl font-semibold text-white md:text-4xl">
            Ready to simplify your HR work?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sky-100">
            Sign in and see your workforce summary in seconds.
          </p>

          <Link
            href="/login"
            className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Login to HRMS
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500 text-white">
              <Building2 size={15} />
            </div>
            <span className="font-medium text-slate-300">HRMS</span>
          </div>

          <p>© 2026 HRMS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}