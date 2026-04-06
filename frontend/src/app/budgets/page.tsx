"use client";

import { FormEvent, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useBudgetOverview, useBudgets, useCategories } from "@/hooks/useData";
import { budgetApi } from "@/services/api";
import { useCurrency } from "@/context/CurrencyContext";
import { Edit3, Plus, Target, Trash2, X } from "lucide-react";

function currentMonthValue() {
  return new Date().toISOString().slice(0, 7);
}

function toMonthStart(monthValue: string) {
  return `${monthValue}-01`;
}

export default function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue());
  const monthStart = toMonthStart(selectedMonth);
  const { budgets, loading, refetch } = useBudgets(monthStart);
  const { data: overview, loading: overviewLoading } = useBudgetOverview(monthStart);
  const { categories } = useCategories();
  const { currency, convertAndFormat } = useCurrency();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formAmount, setFormAmount] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const usedCategoryIds = useMemo(
    () => new Set(budgets.filter((budget) => budget.id !== editingId).map((budget) => budget.category_id)),
    [budgets, editingId]
  );

  function resetForm() {
    setEditingId(null);
    setFormAmount("");
    setFormCategoryId("");
    setFormNote("");
    setFormError("");
  }

  function openEdit(budget: { id: number; amount: number; category_id: number; note?: string | null }) {
    setEditingId(budget.id);
    setFormAmount(String(budget.amount));
    setFormCategoryId(String(budget.category_id));
    setFormNote(budget.note || "");
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formAmount || !formCategoryId) {
      setFormError("Amount and category are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: parseFloat(formAmount),
        category_id: parseInt(formCategoryId, 10),
        month_start: monthStart,
        note: formNote || undefined,
      };

      if (editingId) {
        await budgetApi.update(editingId, payload);
      } else {
        await budgetApi.create(payload);
      }

      setShowModal(false);
      resetForm();
      refetch();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save budget");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this budget?")) return;
    try {
      await budgetApi.delete(id);
      refetch();
    } catch {
      // silent
    }
  }

  return (
    <AppShell>
      <div className="page-header animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Budgets</h1>
          <p>Set category limits and watch spending against them</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input type="month" className="form-input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ minWidth: 180 }} />
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={18} /> Add Budget
          </button>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card animate-in animate-in-delay-1">
          <div className="card-header">
            <h3 className="card-title">Budget Limits</h3>
          </div>
          <div className="expense-list">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
              ))
            ) : budgets.length === 0 ? (
              <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
                <p>No budgets set for this month.</p>
              </div>
            ) : (
              budgets.map((budget) => (
                <div key={budget.id} className="expense-item">
                  <div className="category-dot" style={{ background: budget.category.color }} />
                  <div className="expense-info">
                    <div className="expense-desc">{budget.category.name}</div>
                    <div className="expense-meta">{budget.note || "Monthly category budget"}</div>
                  </div>
                  <div className="expense-amount">{convertAndFormat(budget.amount, currency.code)}</div>
                  <div className="expense-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(budget)} title="Edit">
                      <Edit3 size={15} />
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(budget.id)} title="Delete" style={{ color: "var(--accent-danger)" }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card animate-in animate-in-delay-2">
          <div className="card-header">
            <h3 className="card-title">Usage Overview</h3>
          </div>
          {overviewLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton" style={{ height: 58, marginBottom: 10 }} />
            ))
          ) : overview.length === 0 ? (
            <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
              <p>Add budgets to see category usage.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {overview.map((item) => (
                <div key={item.budget_id} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-md)", background: "var(--bg-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Target size={14} style={{ color: item.category_color }} />
                      <strong style={{ fontSize: "var(--font-sm)" }}>{item.category_name}</strong>
                    </div>
                    <span style={{ color: item.is_over_budget ? "var(--accent-danger)" : "var(--text-secondary)", fontSize: "var(--font-xs)" }}>
                      {item.usage_percent}%
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 8 }}>
                    <div
                      style={{
                        width: `${Math.min(item.usage_percent, 100)}%`,
                        height: "100%",
                        background: item.is_over_budget ? "var(--accent-danger)" : item.category_color,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
                    <span>Spent {convertAndFormat(item.spent, currency.code)}</span>
                    <span>{item.is_over_budget ? "Over by" : "Remaining"} {convertAndFormat(Math.abs(item.remaining), currency.code)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="modal-title">{editingId ? "Edit Budget" : "Add Budget"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            {formError && <div className="auth-error" style={{ marginBottom: 16 }}>{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="budget-category">Category</label>
                <select id="budget-category" className="form-select" value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories
                    .filter((category) => !usedCategoryIds.has(category.id) || String(category.id) === formCategoryId)
                    .map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budget-amount">Monthly limit</label>
                <input id="budget-amount" type="number" step="0.01" min="0" className="form-input" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budget-note">Note</label>
                <input id="budget-note" type="text" className="form-input" value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Optional note" />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
