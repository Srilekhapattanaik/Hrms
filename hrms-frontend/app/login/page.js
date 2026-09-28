"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { loginUser } from "@/services/authService";
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email) {
    setError("Please enter your email.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  setIsLoading(true);

  try {
    const data = await loginUser({
      email,
      password,
    });

    console.log("Login response:", data);

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    router.push("/dashboard");

  } catch (error) {
    console.error("Login error:", error);

    setError(
      error.message || "Invalid email or password."
    );

  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-slate-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Branding Section */}

        <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 p-12 text-white">

          {/* Background decoration */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

          {/* Logo */}

          <div className="relative flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Building2 size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                HRMS
              </h1>

              <p className="text-sm text-blue-100">
                Human Resource Management
              </p>
            </div>

          </div>

          {/* Main text */}

          <div className="relative max-w-xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Welcome Back
            </p>

            <h2 className="mt-4 text-5xl font-extrabold leading-tight">
              Empower your people.

              <span className="block text-blue-200">
                Manage your workforce.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-blue-100/80">
              Access employee information, attendance,
              reports and HR operations from one secure
              centralized platform.
            </p>

            <div className="mt-8 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Secure HR Platform
                </p>

                <p className="text-xs text-blue-100/70">
                  Protected access for authorized users
                </p>
              </div>

            </div>

          </div>

          {/* Footer */}

          <p className="relative text-sm text-blue-100/60">
            © 2026 HRMS
          </p>

        </div>

        {/* Login Section */}

        <div className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Building2 size={23} />
              </div>

              <div>

                <h1 className="text-xl font-bold text-slate-900">
                  HRMS
                </h1>

                <p className="text-xs text-slate-500">
                  Human Resource Management
                </p>

              </div>

            </div>

            {/* Back */}

            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Home
            </Link>

            {/* Heading */}

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access your HRMS dashboard.
              </p>

            </div>

            {/* Login Card */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60">

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Error */}

                {error && (
                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {/* Remember */}

                <div className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600"
                  >
                    Remember me
                  </label>

                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading
                    ? "Signing in..."
                    : "Sign In"}
                </button>

              </form>

              {/* Development information */}

              <div className="mt-6 rounded-xl bg-blue-50 p-4">

                <p className="text-xs font-semibold text-blue-700">
                  Development Mode
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-600">
                  Use your authorized backend credentials
                  to sign in.
                </p>

              </div>

            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Authorized users only • Secure HRMS Portal
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}