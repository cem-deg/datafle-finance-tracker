"use client";

import { FormEvent, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import FormActions from "@/components/ui/FormActions";
import FormField from "@/components/ui/FormField";
import InlineMessage from "@/components/ui/InlineMessage";
import LoadingList from "@/components/ui/LoadingList";
import ModalShell from "@/components/ui/ModalShell";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import RecordRow from "@/components/ui/RecordRow";
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
  currencyCode: string;
}

const initialFormState = (currencyCode: string): IncomeFormState => ({
  amount: "",
  description: "",
  source: "Salary",
  incomeDate: getLocalDateInputValue(),
  currencyCode,
});

export default function IncomePage() {
  const { currency, convertAndFormat } = useCurrency();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<IncomeFormState>(() => initialFormState(currency.code));
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useFlashMessage(pageMessage, setPageMessage);

  const { data, loading, error, refetch } = useIncomes({ page, per_page: 15 });

  function updateForm<K extends keyof IncomeFormState>(field: K, value: IncomeFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(initialFormState(currency.code));
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
    currency_code: string;
  }) {
    setEditingId(income.id);
    setForm({
      amount: String(income.amount),
      description: income.description,
      source: income.source,
      incomeDate: income.income_date,
      currencyCode: income.currency_code,
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
        currency_code: form.currencyCode,
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
            <RecordRow
              key={income.id}
              leading={
                <div className="stat-icon metric-icon-success metric-icon-md">
                  <Plus size={16} />
                </div>
              }
              title={income.description}
              meta={`${income.source} | ${formatDate(income.income_date)}`}
              amount={`+${convertAndFormat(income.amount, income.currency_code)}`}
              amountClassName="amount-positive"
              actions={
                <>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => openEdit(income)}
                    title="Edit"
                    type="button"
                    aria-label={`Edit income ${income.description}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm btn-danger-ghost"
                    onClick={() => void handleDelete(income.id)}
                    title="Delete"
                    type="button"
                    aria-label={`Delete income ${income.description}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              }
            />
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
          {formError ? <InlineMessage message={formError} className="modal-message" id="income-form-error" /> : null}

          <form onSubmit={handleSubmit} className="form-shell">
            <div className="form-row">
              <FormField
                label={`Amount (${form.currencyCode})`}
                htmlFor="income-amount"
                help="Both commas and periods are accepted."
                helpId="income-amount-help"
              >
                <input
                  id="income-amount"
                  type="text"
                  inputMode="decimal"
                  className="form-input"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? "income-amount-help income-form-error" : "income-amount-help"}
                  required
                />
              </FormField>
              <FormField label="Date" htmlFor="income-date">
                <input
                  id="income-date"
                  type="date"
                  className="form-input"
                  value={form.incomeDate}
                  onChange={(event) => updateForm("incomeDate", event.target.value)}
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? "income-form-error" : undefined}
                  required
                />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="income-desc">
              <input
                id="income-desc"
                type="text"
                className="form-input"
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="What was this income for?"
                maxLength={120}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "income-form-error" : undefined}
                required
              />
            </FormField>

            <FormField
              label="Source"
              htmlFor="income-source"
              help="Examples: Salary, Freelance, Bonus, Refund."
              helpId="income-source-help"
            >
              <input
                id="income-source"
                type="text"
                className="form-input"
                value={form.source}
                onChange={(event) => updateForm("source", event.target.value)}
                placeholder="Salary, freelance, refund..."
                maxLength={80}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "income-source-help income-form-error" : "income-source-help"}
                required
              />
            </FormField>

            <FormActions>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update" : "Add Income"}
              </button>
            </FormActions>
          </form>
        </ModalShell>
      ) : null}
    </AppShell>
  );
}
