"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="transition-all duration-300 md:ml-64">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="min-h-[calc(100vh-80px)] p-4 md:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}