
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserCheck,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { logoutUser } from "../../services/authService";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      href: "/employees",
      icon: Users,
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: CalendarCheck,
    }, 
    {
      name: "Leave Management",
      href: "/leave",
      icon: UserCheck,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-blue-600 p-2 text-white md:hidden"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen
          bg-slate-900 text-white
          transition-all duration-300
          ${isOpen ? "w-64" : "w-20"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          {isOpen && (
            <h1 className="text-xl font-bold">
              HRMS
            </h1>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden rounded-md p-2 hover:bg-slate-800 md:block"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-5 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition hover:bg-blue-600 hover:text-white"
              >
                <Icon size={21} />

                {isOpen && (
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-slate-300 hover:bg-red-600 hover:text-white"
          >
            <LogOut size={21} />

            {isOpen && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
