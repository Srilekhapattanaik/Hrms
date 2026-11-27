"use client";

// Small tab bar shown on top of every payroll page, so the sidebar needs no new items.
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { name: "Processing", href: "/payroll" },
  { name: "Error Log", href: "/payroll/errors" },
  { name: "Statutory Config", href: "/payroll/statutory" },
  { name: "Professional Tax", href: "/payroll/professional-tax" },
  { name: "Draft Preview", href: "/payroll/draft" },
];

export default function PayrollTabs() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-2" aria-label="Payroll sections">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-green-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.name}
          </Link>
        );
      })}
    </nav>
  );
}
