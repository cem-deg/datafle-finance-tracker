"use client";

import { FormEvent, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import InlineMessage from "@/components/ui/InlineMessage";
import LoadingList from "@/components/ui/LoadingList";
import ModalShell from "@/components/ui/ModalShell";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useIncomes } from "@/hooks/useData";
import { incomeApi } from "@/services/api";
import { useCurrency } from "@/context/CurrencyContext";
import { getLocalDateInputValue } from "@/utils/date";
import { formatDate } from "@/utils/formatters";
import { parseLocalizedAmount } from "@/utils/amount";

interface IncomeFormState {
  amount: string;
  description: string;
  source: string;
  incomeDate: string;
}

const initialFormState = (): IncomeFormState => ({
  amount: "",
  description: "",
  source: "Salary",
  incomeDate: getLocalDateInputValue(),
});

export default function IncomePage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<IncomeFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useFlashMessage(pageMessage, setPageMessage);

  const { data, loading, error, refetch } = useIncomes({ page, per_page: 15 });
  const { currency, convertAndFormat } = useCurrency();

  function updateForm<K extends keyof IncomeFormState>(field: K, value: IncomeFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(initialFormState());
    setEditingId(null);
    setFormError("");
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(income: {
    id: number;
    amount: number;
    description: string;
    source: string;
    income_date: string;
  }) {
    setEditingId(income.id);
    setForm({
      amount: String(income.amount),
      description: income.description,
      source: income.source,
      incomeDate: income.income_date,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    const description = form.description.trim();
    const source = form.source.trim();
    if (!form.amount || !description || !source || !form.incomeDate) {
      setFormError("Amount, description, source, and date are required.");
      return;
    }

    const parsedAmount = parseLocalizedAmount(form.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: parsedAmount,
        description,
        source,
        income_date: form.incomeDate,
        currency_code: currency.code,
      };

      if (editingId) {
        await incomeApi.update(editingId, payload);
        setPageMessage("Income updated.");
      } else {
        await incomeApi.create(payload);
        setPageMessage("Income added.");
      }

      closeModal();
      await refetch();
    } catch (submitError: unknown) {
      setFormError(submitError instanceof Error ? submitError.message : "Failed to save income.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this income entry?")) return;

    setPageMessage(null);
    try {
      await incomeApi.delete(id);
      setPageMessage("Income deleted.");
      await refetch();
    } catch (deleteError: unknown) {
      setPageMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete income.");
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Income"
        description="Track salary, freelance payments, and other earnings"
        actions={
          <button className="btn btn-primary" onClick={openCreate} type="button">
            <Plus size={18} /> Add Income
          </button>
        }
      />

      <PageFeedback
        successMessage={pageMessage}
        onDismissSuccess={() => setPageMessage(null)}
        errorMessages={[error]}
      />

      <div className="expense-list animate-in animate-in-delay-1">
        {loading ? (
          <LoadingList count={8} height={60} />
        ) : error ? (
          <EmptyState
            title="Could not load income"
            description="Try refreshing the page or checking the backend connection."
            actionLabel="Retry"
            onAction={() => void refetch()}
            icon="!"
          />
        ) : (data?.items.length ?? 0) === 0 ? (
          <EmptyState
            title="No income recorded"
            description="Add your first income item to start tracking your real balance."
            actionLabel="Add Income"
            onAction={openCreate}
            icon="+"
          />
        ) : (
          data?.items.map((income) => (
            <div key={income.id} className="expense-item">
              <div
                className="stat-icon"
                style={{
                  width: 42,
                  height: 42,
                  minWidth: 42,
                  background: "rgba(0,184,148,0.15)",
                  color: "var(--accent-success)",
                }}
              >
                <Plus size={16} />
              </div>
              <div className="expense-info">
                <div className="expense-desc">{income.description}</div>
                <div className="expense-meta">
                  {income.source} | {formatDate(income.income_date)}
                </div>
              </div>
              <div className="expense-amount" style={{ color: "var(--accent-success)" }}>
                +{convertAndFormat(income.amount, income.currency_code)}
              </div>
              <div className="expense-actions">
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => openEdit(income)}
                  title="Edit"
                  type="button"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => void handleDelete(income.id)}
                  title="Delete"
                  type="button"
                  style={{ color: "var(--accent-danger)" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <PaginationControls
        page={page}
        totalPages={data?.total_pages ?? 0}
        onPageChange={setPage}
      />

      {showModal ? (
        <ModalShell title={editingId ? "Edit Income" : "Add Income"} onClose={closeModal}>
          {formError ? <InlineMessage message={formError} className="modal-message" /> : null}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="income-amount">
                  Amount ({currency.code})
                </label>
                <input
                  id="income-amount"
                  type="text"
                  inputMode="decimal"
                  className="form-input"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  required
                />
                <span className="form-help">Enter the amount received in your selected currency.</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="income-date">
                  Date
                </label>
                <input
                  id="income-date"
                  type="date"
                  className="form-input"
                  value={form.incomeDate}
                  onChange={(event) => updateForm("incomeDate", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="income-desc">
                Description
              </label>
              <input
                id="income-desc"
                type="text"
                className="form-input"
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="What was this income for?"
                maxLength={120}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="income-source">
                Source
              </label>
              <input
                id="income-source"
                type="text"
                className="form-input"
                value={form.source}
                onChange={(event) => updateForm("source", event.target.value)}
                placeholder="Salary, freelance, refund..."
                maxLength={80}
                required
              />
              <span className="form-help">Examples: Salary, Freelance, Bonus, Refund.</span>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update" : "Add Income"}
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}
    </AppShell>
  );
}
