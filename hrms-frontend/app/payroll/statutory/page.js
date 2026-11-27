"use client";

// S-18  Statutory configuration (PF % and ESI thresholds)
//   GET /payroll/statutory-config   -> load the current values
//   PUT /payroll/statutory-config   -> save

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import PayrollTabs from "../../components/PayrollTabs";
import { Save, AlertCircle, AlertTriangle, Check, Loader2 } from "lucide-react";
import { PAYROLL_ROLES } from "@/services/payrollService";
import {
  DEFAULT_STATUTORY,
  getStatutoryConfig,
  saveStatutoryConfig,
  isMissingApi,
} from "@/services/payrollExtraService";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-50";

export default function StatutoryConfigPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const [form, setForm] = useState({
    pfPercent: String(DEFAULT_STATUTORY.pfPercent),
    esiPercent: String(DEFAULT_STATUTORY.esiPercent),
    esiGrossThreshold: String(DEFAULT_STATUTORY.esiGrossThreshold),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [apiMissing, setApiMissing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (PAYROLL_ROLES.includes(user.role)) setAllowed(true);
      else router.replace("/dashboard");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!allowed) return;
    (async () => {
      try {
        const c = await getStatutoryConfig();
        setForm({
          pfPercent: String(c.pfPercent),
          esiPercent: String(c.esiPercent),
          esiGrossThreshold: String(c.esiGrossThreshold),
        });
      } catch (err) {
        if (isMissingApi(err)) setApiMissing(true);
        else setLoadError(err.message || "Could not load the configuration");
      } finally {
        setLoading(false);
      }
    })();
  }, [allowed]);

  const change = (name) => (e) => {
    setSaved("");
    setForm((f) => ({ ...f, [name]: e.target.value }));
  };

  const validate = () => {
    const list = [];
    const pf = Number(form.pfPercent);
    const esi = Number(form.esiPercent);
    const th = Number(form.esiGrossThreshold);
    if (form.pfPercent === "" || !(pf >= 0 && pf <= 100)) list.push("PF % must be a number from 0 to 100.");
    if (form.esiPercent === "" || !(esi >= 0 && esi <= 100)) list.push("ESI % must be a number from 0 to 100.");
    if (form.esiGrossThreshold === "" || !(th > 0)) list.push("ESI gross-salary threshold must be more than 0.");
    return list;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const list = validate();
    setErrors(list);
    setSaved("");
    if (list.length) return;
    setSaving(true);
    try {
      await saveStatutoryConfig(form);
      setSaved("Statutory configuration saved. It is used the next time payroll is processed.");
    } catch (err) {
      setErrors([
        isMissingApi(err)
          ? "The backend does not have this API yet (PUT /api/v1/payroll/statutory-config)."
          : err.message || "Could not save",
      ]);
    } finally {
      setSaving(false);
    }
  };

  if (!allowed) return null;

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="inline-block border-b-[3px] border-green-500 pb-1 text-2xl font-medium text-slate-100 md:text-3xl">
          Statutory Configuration
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          Provident Fund and ESI rules used by the payroll calculation.
        </p>
      </div>

      <PayrollTabs />

      {apiMissing && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            The backend has not provided <code>GET /api/v1/payroll/statutory-config</code> yet, so the
            standard values are shown. Saving will work as soon as the API is ready.
          </span>
        </div>
      )}
      {loadError && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          {loadError}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6"
      >
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Loading...
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="pf" className="mb-1.5 block text-sm font-medium text-slate-300">
                PF percentage (of Basic)
              </label>
              <input id="pf" type="number" min="0" max="100" step="0.01" value={form.pfPercent}
                onChange={change("pfPercent")} className={inputClass} />
              <p className="mt-1.5 text-xs text-slate-500">Standard rule: 12</p>
            </div>

            <div>
              <label htmlFor="esi" className="mb-1.5 block text-sm font-medium text-slate-300">
                ESI percentage
              </label>
              <input id="esi" type="number" min="0" max="100" step="0.01" value={form.esiPercent}
                onChange={change("esiPercent")} className={inputClass} />
              <p className="mt-1.5 text-xs text-slate-500">Standard rule: 1.75</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="th" className="mb-1.5 block text-sm font-medium text-slate-300">
                ESI applies when Gross salary is below (₹)
              </label>
              <input id="th" type="number" min="0" step="1" value={form.esiGrossThreshold}
                onChange={change("esiGrossThreshold")} className={inputClass} />
              <p className="mt-1.5 text-xs text-slate-500">Standard rule: 21000</p>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <ul className="mt-5 space-y-1 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errors.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
        {saved && (
          <p className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <Check size={16} /> {saved}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save configuration"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSaved("");
              setErrors([]);
              setForm({
                pfPercent: String(DEFAULT_STATUTORY.pfPercent),
                esiPercent: String(DEFAULT_STATUTORY.esiPercent),
                esiGrossThreshold: String(DEFAULT_STATUTORY.esiGrossThreshold),
              });
            }}
            className="rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10"
          >
            Reset to standard values
          </button>
        </div>
      </form>
    </MainLayout>
  );
}
