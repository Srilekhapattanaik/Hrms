"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { poppins } from "./fonts";

export default function MainLayout({ children }) {
  return (
    <div
      className={`${poppins.className} relative min-h-screen overflow-x-hidden bg-[#0b1020] text-slate-200`}
    >
      <style>{`
        @keyframes pageFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .page-fade { animation: pageFade 0.5s ease-out both; }
      `}</style>

      {/* background glow */}
      <div className="pointer-events-none fixed -right-40 top-0 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-3xl" />

      <Sidebar />

      <div className="relative md:ml-64">
        <Header />
        <main className="page-fade p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}