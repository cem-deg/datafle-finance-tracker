"use client";

import { FormEvent, useMemo, useState } from "react";
import { Edit3, Plus, Target, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import BudgetUsageList from "@/components/ui/BudgetUsageList";
import EmptyState from "@/components/ui/EmptyState";
import FormActions from "@/components/ui/FormActions";
import FormField from "@/components/ui/FormField";
import InlineMessage from "@/components/ui/InlineMessage";
import LoadingList from "@/components/ui/LoadingList";
import ModalShell from "@/components/ui/ModalShell";
import PanelCard from "@/components/ui/PanelCard";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import { SUPPORTED_CURRENCIES, useCurrency } from "@/context/CurrencyContext";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useBudgetOverview, useBudgets, useCategories } from "@/hooks/useData";
import { budgetApi } from "@/services/api";
import { getLocalMonthInputValue } from "@/utils/date";
import { parseLocalizedAmount } from "@/utils/amount";

interface BudgetFormState {
  amount: string;
  currencyCode: string;
  categoryId: string;
  note: string;
}

function currentMonthValue() {
  return getLocalMonthInputValue();
}

function toMonthStart(monthValue: string) {
  return `${monthValue}-01`;
}

const initialFormState = (currencyCode: string): BudgetFormState => ({
  amount: "",
  currencyCode,
  categoryId: "",
  note: "",
});

export default function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue());
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BudgetFormState>(initialFormState("USD"));
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useFlashMessage(pageMessage, setPageMessage);

  const monthStart = toMonthStart(selectedMonth);
  const { budgets, loading, error, refetch } = useBudgets(monthStart);
  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useBudgetOverview(monthStart);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { currency, convertAndFormat } = useCurrency();

  const usedCategoryIds = useMemo(
    () => new Set(budgets.filter((budget) => budget.id !== editingId).map((budget) => budget.category_id)),
    [budgets, editingId]
  );

  function updateForm<K extends keyof BudgetFormState>(field: K, value: BudgetFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialFormState(currency.code));
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

  function openEdit(budget: {
    id: number;
    amount: number;
    currency_code: string;
    category_id: number;
    note?: string | null;
  }) {
    setEditingId(budget.id);
    setForm({
      amount: String(budget.amount),
      currencyCode: budget.currency_code || "USD",
      categoryId: String(budget.category_id),
      note: budget.note || "",
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!form.amount || !form.categoryId || !form.currencyCode) {
      setFormError("Amount, category, and currency are required.");
      return;
    }

    const parsedAmount = parseLocalizedAmount(form.amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Enter a valid monthly limit greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: parsedAmount,
        currency_code: form.currencyCode,
        category_id: Number.parseInt(form.categoryId, 10),
        month_start: monthStart,
        note: form.note.trim() || undefined,
      };

      if (editingId) {
        await budgetApi.update(editingId, payload);
        setPageMessage("Budget updated.");
      } else {
        await budgetApi.create(payload);
        setPageMessage("Budget saved.");
      }

      closeModal();
      await refetch();
    } catch (submitError: unknown) {
      setFormError(submitError instanceof Error ? submitError.message : "Failed to save budget.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this budget?")) return;

    setPageMessage(null);
    try {
      await budgetApi.delete(id);
      setPageMessage("Budget deleted.");
      await refetch();
    } catch (deleteError: unknown) {
      setPageMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete budget.");
    }
  }

  const availableCategories = categories.filter(
    (category) => !usedCategoryIds.has(category.id) || String(category.id) === form.categoryId
  );

  return (
    <AppShell>
      <PageHeader
        title="Budgets"
        description="Set category limits and watch spending against them"
        actions={
          <>
            <input
              type="month"
              className="form-input month-field"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
            <button className="btn btn-primary" onClick={openCreate} type="button">
              <Plus size={18} /> Add Budget
            </button>
          </>
        }
      />

      <PageFeedback
        successMessage={pageMessage}
        onDismissSuccess={() => setPageMessage(null)}
        errorMessages={[error, overviewError, categoriesError]}
      />

      <div className="charts-grid">
        <PanelCard
          className="animate-in animate-in-delay-1"
          title="Budget Limits"
          bodyClassName="expense-list"
        >
            {loading ? (
              <LoadingList count={4} height={52} />
            ) : error ? (
              <EmptyState
                title="Could not load budgets"
                description="Try refreshing the page or selecting another month."
                actionLabel="Retry"
                onAction={() => void refetch()}
                icon="!"
                compact
              />
            ) : budgets.length === 0 ? (
              <EmptyState
                title="No budgets set"
                description="Create a category budget for this month to start tracking spending."
                actionLabel="Add Budget"
                onAction={openCreate}
                icon="="
                compact
              />
            ) : (
              budgets.map((budget) => (
                <div key={budget.id} className="expense-item">
                  <div className="category-dot" style={{ background: budget.category.color }} />
                  <div className="expense-info">
                    <div className="expense-desc">{budget.category.name}</div>
                    <div className="expense-meta">{budget.note || "Monthly category budget"}</div>
                  </div>
                  <div className="expense-amount">
                    {convertAndFormat(budget.amount, budget.currency_code || "USD")}
                  </div>
                  <div className="expense-actions">
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => openEdit(budget)}
                      title="Edit"
                      type="button"
                    >
                      <Edit3 size={15} />
                    </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm btn-danger-ghost"
                    onClick={() => void handleDelete(budget.id)}
                    title="Delete"
                    type="button"
                  >
                    <Trash2 size={15} />
                  </button>
                  </div>
                </div>
              ))
            )}
        </PanelCard>

        <PanelCard className="animate-in animate-in-delay-2" title="Usage Overview">
          {overviewLoading ? (
            <LoadingList count={4} height={58} />
          ) : overviewError ? (
            <EmptyState
              title="Could not load budget usage"
              description="Try refreshing once your budget data is available."
              actionLabel="Retry"
              onAction={() => void refetchOverview()}
              icon="!"
              compact
            />
          ) : overview.length === 0 ? (
            <EmptyState
              title="Nothing to compare yet"
              description="Add budgets to see how much of each limit has been used."
              icon="%"
              compact
            />
          ) : (
            <BudgetUsageList
              items={overview}
              renderIcon={(item) => <Target size={14} style={{ color: item.category_color }} />}
              renderMeta={(item) => (
                <>
                  <span>Spent {convertAndFormat(item.spent, "USD")}</span>
                  <span>
                    {item.is_over_budget ? "Over by" : "Remaining"}{" "}
                    {convertAndFormat(Math.abs(item.remaining ?? 0), "USD")}
                  </span>
                </>
              )}
            />
          )}
        </PanelCard>
      </div>

      {showModal ? (
        <ModalShell title={editingId ? "Edit Budget" : "Add Budget"} onClose={closeModal}>
          {formError ? <InlineMessage message={formError} className="modal-message" id="budget-form-error" /> : null}

          <form onSubmit={handleSubmit} className="form-shell">
            <FormField label="Category" htmlFor="budget-category">
              <select
                id="budget-category"
                className="form-select"
                value={form.categoryId}
                onChange={(event) => updateForm("categoryId", event.target.value)}
                disabled={categoriesLoading || availableCategories.length === 0}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "budget-form-error" : undefined}
                required
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select category"}
                </option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="form-row">
              <FormField
                label="Monthly limit"
                htmlFor="budget-amount"
                help="Set the monthly ceiling you want to stay under."
                helpId="budget-amount-help"
              >
                <input
                  id="budget-amount"
                  type="text"
                  inputMode="decimal"
                  className="form-input"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? "budget-amount-help budget-form-error" : "budget-amount-help"}
                  required
                />
              </FormField>
              <FormField
                label="Currency"
                htmlFor="budget-currency"
                help="This currency is stored with the budget for accurate reporting."
                helpId="budget-currency-help"
              >
                <select
                  id="budget-currency"
                  className="form-select"
                  value={form.currencyCode}
                  onChange={(event) => updateForm("currencyCode", event.target.value)}
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? "budget-currency-help budget-form-error" : "budget-currency-help"}
                >
                  {SUPPORTED_CURRENCIES.map((supportedCurrency) => (
                    <option key={supportedCurrency.code} value={supportedCurrency.code}>
                      {supportedCurrency.code}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Note"
              htmlFor="budget-note"
              help="Add context like fixed bills or savings targets if helpful."
              helpId="budget-note-help"
            >
              <input
                id="budget-note"
                type="text"
                className="form-input"
                value={form.note}
                onChange={(event) => updateForm("note", event.target.value)}
                placeholder="Optional note for this category budget"
                maxLength={120}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "budget-note-help budget-form-error" : "budget-note-help"}
              />
            </FormField>

            <FormActions>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || categoriesLoading || availableCategories.length === 0}
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Save Budget"}
              </button>
            </FormActions>
          </form>
        </ModalShell>
      ) : null}
    </AppShell>
  );
}
