"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  Search,
  UserCircle,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 shadow-sm backdrop-blur md:px-7">

      <div className="ml-12 md:ml-0">
        <p className="text-xs font-medium text-slate-400">
          Welcome back,
        </p>

        <h2 className="text-lg font-bold text-slate-800">
          HR Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-32 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 md:block" />

        <div className="flex items-center gap-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <UserCircle size={25} />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800">
              {user?.fullName || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role || "User"}
            </p>
          </div>

          <ChevronDown
            size={17}
            className="hidden text-slate-400 md:block"
          />

        </div>
      </div>
    </header>
  );
}