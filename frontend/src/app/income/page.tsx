"use client";

import { FormEvent, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useIncomes } from "@/hooks/useData";
import { incomeApi } from "@/services/api";
import { formatDate } from "@/utils/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import { Edit3, Plus, Trash2, X } from "lucide-react";

export default function IncomePage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data, loading, refetch } = useIncomes({ page, per_page: 15 });
  const { convertAndFormat } = useCurrency();

  const [formAmount, setFormAmount] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSource, setFormSource] = useState("Salary");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setFormAmount("");
    setFormDesc("");
    setFormSource("Salary");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormError("");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formAmount || !formDesc || !formSource) {
      setFormError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: parseFloat(formAmount),
        description: formDesc,
        source: formSource,
        income_date: formDate,
      };

      if (editingId) {
        await incomeApi.update(editingId, payload);
      } else {
        await incomeApi.create(payload);
      }

      setShowModal(false);
      resetForm();
      refetch();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save income");
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(income: {
    id: number;
    amount: number;
    description: string;
    source: string;
    income_date: string;
  }) {
    setEditingId(income.id);
    setFormAmount(String(income.amount));
    setFormDesc(income.description);
    setFormSource(income.source);
    setFormDate(income.income_date);
    setShowModal(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this income entry?")) return;
    try {
      await incomeApi.delete(id);
      refetch();
    } catch {
      // silent
    }
  }

  return (
    <AppShell>
      <div className="page-header animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Income</h1>
          <p>Track salary, freelance payments, and other earnings</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Add Income
        </button>
      </div>

      <div className="expense-list animate-in animate-in-delay-1">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton" style={{ height: 60, marginBottom: 8 }} />
          ))
        ) : (data?.items.length ?? 0) === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">$</div>
            <h3>No income recorded</h3>
            <p>Add your first income item to start tracking your real balance.</p>
          </div>
        ) : (
          data?.items.map((income) => (
            <div key={income.id} className="expense-item">
              <div className="stat-icon" style={{ width: 42, height: 42, minWidth: 42, background: "rgba(0,184,148,0.15)", color: "var(--accent-success)" }}>
                <Plus size={16} />
              </div>
              <div className="expense-info">
                <div className="expense-desc">{income.description}</div>
                <div className="expense-meta">{income.source} · {formatDate(income.income_date)}</div>
              </div>
              <div className="expense-amount" style={{ color: "var(--accent-success)" }}>
                +{convertAndFormat(income.amount, income.currency_code)}
              </div>
              <div className="expense-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(income)} title="Edit">
                  <Edit3 size={15} />
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(income.id)} title="Delete" style={{ color: "var(--accent-danger)" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {data && data.total_pages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</button>
          {Array.from({ length: Math.min(data.total_pages, 7) }).map((_, index) => {
            const current = index + 1;
            return (
              <button key={current} className={`pagination-btn ${page === current ? "active" : ""}`} onClick={() => setPage(current)}>
                {current}
              </button>
            );
          })}
          <button className="pagination-btn" disabled={page >= data.total_pages} onClick={() => setPage(page + 1)}>→</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="modal-title">{editingId ? "Edit Income" : "Add Income"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            {formError && <div className="auth-error" style={{ marginBottom: 16 }}>{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="income-amount">Amount</label>
                  <input id="income-amount" type="number" step="0.01" min="0" className="form-input" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="income-date">Date</label>
                  <input id="income-date" type="date" className="form-input" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="income-desc">Description</label>
                <input id="income-desc" type="text" className="form-input" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="income-source">Source</label>
                <input id="income-source" type="text" className="form-input" value={formSource} onChange={(e) => setFormSource(e.target.value)} required />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Add Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
