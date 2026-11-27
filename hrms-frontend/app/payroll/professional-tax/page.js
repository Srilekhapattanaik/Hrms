"use client";

// S-19  Professional Tax slab manager (state-wise)
//   GET / POST /payroll/professional-tax-slabs   |   PUT / DELETE /payroll/professional-tax-slabs/{id}

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import PayrollTabs from "../../components/PayrollTabs";
import { Plus, Pencil, Trash2, Save, X, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { PAYROLL_ROLES, formatMoney } from "@/services/payrollService";
import {
  getPtSlabs,
  createPtSlab,
  updatePtSlab,
  deletePtSlab,
  isMissingApi,
} from "@/services/payrollExtraService";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500 disabled:opacity-50";

const STATES = [
  "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Andhra Pradesh", "West Bengal",
  "Odisha", "Gujarat", "Kerala", "Madhya Pradesh", "Assam", "Bihar", "Jharkhand",
  "Meghalaya", "Tripura", "Sikkim", "Mizoram", "Manipur", "Chhattisgarh",
];

const EMPTY = { state: "", minSalary: "", maxSalary: "", monthlyTax: "" };

const rangeText = (s) =>
  s.maxSalary === null
    ? `${formatMoney(s.minSalary)} and above`
    : `${formatMoney(s.minSalary)} - ${formatMoney(s.maxSalary)}`;

export default function ProfessionalTaxPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const [slabs, setSlabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMissing, setApiMissing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [stateFilter, setStateFilter] = useState("ALL");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null); // null = adding
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (PAYROLL_ROLES.includes(user.role)) setAllowed(true);
      else router.replace("/dashboard");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setSlabs(await getPtSlabs());
      setApiMissing(false);
    } catch (err) {
      if (isMissingApi(err)) setApiMissing(true);
      else setLoadError(err.message || "Could not load the slabs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowed) load();
  }, [allowed, load]);

  const stateNames = useMemo(
    () => [...new Set([...STATES, ...slabs.map((s) => s.state)])].sort(),
    [slabs]
  );

  const visible = useMemo(
    () =>
      slabs
        .filter((s) => stateFilter === "ALL" || s.state === stateFilter)
        .sort((a, b) => a.state.localeCompare(b.state) || a.minSalary - b.minSalary),
    [slabs, stateFilter]
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY, state: stateFilter === "ALL" ? "" : stateFilter });
    setErrors([]);
    setNotice("");
    setFormOpen(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      state: s.state,
      minSalary: String(s.minSalary),
      maxSalary: s.maxSalary === null ? "" : String(s.maxSalary),
      monthlyTax: String(s.monthlyTax),
    });
    setErrors([]);
    setNotice("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setErrors([]);
  };

  const validate = () => {
    const list = [];
    const min = Number(form.minSalary);
    const max = form.maxSalary === "" ? null : Number(form.maxSalary);
    const tax = Number(form.monthlyTax);
    if (!form.state.trim()) list.push("Enter the state.");
    if (form.minSalary === "" || !(min >= 0)) list.push("'From salary' must be 0 or more.");
    if (max !== null && !(max > min)) list.push("'To salary' must be more than 'From salary' (or leave it empty for no upper limit).");
    if (form.monthlyTax === "" || !(tax >= 0)) list.push("Monthly tax must be 0 or more.");
    if (list.length) return list;

    // the slabs of one state must not overlap
    const clash = slabs.find(
      (s) =>
        s.id !== editingId &&
        s.state.toLowerCase() === form.state.trim().toLowerCase() &&
        min < (s.maxSalary === null ? Infinity : s.maxSalary) &&
        (max === null ? Infinity : max) > s.minSalary
    );
    if (clash) list.push(`This range overlaps an existing ${clash.state} slab (${rangeText(clash)}).`);
    return list;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const list = validate();
    setErrors(list);
    if (list.length) return;
    setSaving(true);
    try {
      if (editingId === null) await createPtSlab(form);
      else await updatePtSlab(editingId, form);
      setNotice(editingId === null ? "Slab added." : "Slab updated.");
      closeForm();
      await load();
    } catch (err) {
      setErrors([err.message || "Could not save the slab"]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete the ${s.state} slab ${rangeText(s)}?`)) return;
    try {
      await deletePtSlab(s.id);
      setNotice("Slab deleted.");
      await load();
    } catch (err) {
      setLoadError(err.message || "Could not delete the slab");
    }
  };

  if (!allowed) return null;

  return (
    <MainLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="inline-block border-b-[3px] border-green-500 pb-1 text-2xl font-medium text-slate-100 md:text-3xl">
            Professional Tax Slabs
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            State-wise monthly Professional Tax by gross salary range.
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={apiMissing}
          className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} /> Add slab
        </button>
      </div>

      <PayrollTabs />

      {apiMissing && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            The backend has not provided <code>/api/v1/payroll/professional-tax-slabs</code> yet. This
            page will work as soon as that API is ready.
          </span>
        </div>
      )}
      {loadError && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          {loadError}
        </div>
      )}
      {notice && (
        <p className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {notice}
        </p>
      )}

      {/* ---------- add / edit form ---------- */}
      {formOpen && (
        <form
          onSubmit={handleSave}
          className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5"
        >
          <h2 className="mb-4 font-semibold text-slate-100">
            {editingId === null ? "Add a slab" : "Edit slab"}
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs text-slate-400">State</label>
              <input list="pt-states" value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Karnataka" className={inputClass} />
              <datalist id="pt-states">
                {stateNames.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">From salary (₹)</label>
              <input type="number" min="0" value={form.minSalary}
                onChange={(e) => setForm({ ...form, minSalary: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">To salary (₹) - empty = no limit</label>
              <input type="number" min="0" value={form.maxSalary}
                onChange={(e) => setForm({ ...form, maxSalary: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Monthly tax (₹)</label>
              <input type="number" min="0" value={form.monthlyTax}
                onChange={(e) => setForm({ ...form, monthlyTax: e.target.value })} className={inputClass} />
            </div>
          </div>

          {errors.length > 0 && (
            <ul className="mt-4 space-y-1 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errors.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving..." : "Save slab"}
            </button>
            <button type="button" onClick={closeForm}
              className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-sm text-slate-300 hover:bg-white/10">
              <X size={15} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* ---------- table ---------- */}
      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h2 className="font-semibold text-slate-100">Slabs ({visible.length})</h2>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="ALL">All states</option>
            {[...new Set(slabs.map((s) => s.state))].sort().map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 px-5 py-8 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Loading slabs...
          </p>
        ) : visible.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            {apiMissing ? "No data - backend API not ready." : "No slabs yet. Click 'Add slab'."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">State</th>
                  <th className="px-5 py-3 font-medium">Gross salary range</th>
                  <th className="px-5 py-3 text-right font-medium">Monthly tax</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => (
                  <tr key={s.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-slate-100">{s.state}</td>
                    <td className="px-5 py-3 text-slate-300">{rangeText(s)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-sky-300">{formatMoney(s.monthlyTax)}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(s)} aria-label="Edit slab"
                        className="mr-2 rounded-lg bg-sky-500/10 p-2 text-sky-300 hover:bg-sky-500/20">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(s)} aria-label="Delete slab"
                        className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
