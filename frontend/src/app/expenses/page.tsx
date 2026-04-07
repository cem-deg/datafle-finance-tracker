"use client";

import { FormEvent, useMemo, useState } from "react";
import { Edit3, Filter, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import InlineMessage from "@/components/ui/InlineMessage";
import LoadingList from "@/components/ui/LoadingList";
import ModalShell from "@/components/ui/ModalShell";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import { useCategories, useExpenses } from "@/hooks/useData";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useCurrency } from "@/context/CurrencyContext";
import { expenseApi } from "@/services/api";
import { getLocalDateInputValue } from "@/utils/date";
import { formatDate } from "@/utils/formatters";
import { parseLocalizedAmount } from "@/utils/amount";

interface ExpenseFormState {
  amount: string;
  description: string;
  categoryId: string;
  expenseDate: string;
}

const initialFormState = (): ExpenseFormState => ({
  amount: "",
  description: "",
  categoryId: "",
  expenseDate: getLocalDateInputValue(),
});

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExpenseFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useFlashMessage(pageMessage, setPageMessage);

  const params: Record<string, string | number> = { page, per_page: 15 };
  if (categoryFilter) params.category_id = categoryFilter;

  const { data, loading, error, refetch } = useExpenses(params);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { currency, convertAndFormat } = useCurrency();

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const filteredItems = useMemo(
    () =>
      data?.items.filter((expense) =>
        !searchTerm || expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) ?? [],
    [data?.items, searchTerm]
  );

  function updateForm<K extends keyof ExpenseFormState>(field: K, value: ExpenseFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(initialFormState());
    setFormError("");
    setEditingId(null);
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(expense: {
    id: number;
    amount: number;
    description: string;
    category_id: number;
    expense_date: string;
  }) {
    setEditingId(expense.id);
    setForm({
      amount: String(expense.amount),
      description: expense.description,
      categoryId: String(expense.category_id),
      expenseDate: expense.expense_date,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    const description = form.description.trim();
    if (!form.amount || !description || !form.categoryId || !form.expenseDate) {
      setFormError("Amount, description, category, and date are required.");
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
        category_id: Number.parseInt(form.categoryId, 10),
        expense_date: form.expenseDate,
        currency_code: currency.code,
      };

      if (editingId) {
        await expenseApi.update(editingId, payload);
        setPageMessage("Expense updated.");
      } else {
        await expenseApi.create(payload);
        setPageMessage("Expense added.");
      }

      closeModal();
      await refetch();
    } catch (submitError: unknown) {
      setFormError(submitError instanceof Error ? submitError.message : "Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this expense?")) return;

    setPageMessage(null);
    try {
      await expenseApi.delete(id);
      setPageMessage("Expense deleted.");
      await refetch();
    } catch (deleteError: unknown) {
      setPageMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete expense.");
    }
  }

  const hasFilters = Boolean(searchTerm || categoryFilter);

  return (
    <AppShell>
      <PageHeader
        title="Expenses"
        description="Track and manage your spending"
        actions={
          <button className="btn btn-primary" onClick={openCreate} id="add-expense-btn">
            <Plus size={18} /> Add Expense
          </button>
        }
      />

      <PageFeedback
        successMessage={pageMessage}
        onDismissSuccess={() => setPageMessage(null)}
        errorMessages={[error, categoriesError]}
      />

      <div className="filter-bar animate-in animate-in-delay-1">
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-tertiary)",
            }}
          />
          <input
            className="form-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search expenses on this page..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            id="search-expenses"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={16} style={{ color: "var(--text-tertiary)" }} />
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            id="category-filter"
            style={{ minWidth: 160 }}
            disabled={categoriesLoading}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="expense-list animate-in animate-in-delay-2">
        {loading ? (
          <LoadingList count={8} height={60} />
        ) : error ? (
          <EmptyState
            title="Could not load expenses"
            description="Try refreshing the page or checking the backend connection."
            actionLabel="Retry"
            onAction={() => void refetch()}
            icon="!"
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No matching expenses" : "No expenses found"}
            description={
              hasFilters
                ? "Try another search term or category."
                : "Start tracking your spending by adding your first expense."
            }
            actionLabel={hasFilters ? undefined : "Add Expense"}
            onAction={hasFilters ? undefined : openCreate}
            icon="$"
          />
        ) : (
          filteredItems.map((expense) => {
            const category = categoryMap.get(expense.category_id);
            return (
              <div key={expense.id} className="expense-item">
                <div
                  className="category-dot"
                  style={{ background: category?.color || "#636e72" }}
                />
                <div className="expense-info">
                  <div className="expense-desc">{expense.description}</div>
                  <div className="expense-meta">
                    {category?.name || "Other"} | {formatDate(expense.expense_date)}
                  </div>
                </div>
                <div className="expense-amount">
                  -{convertAndFormat(expense.amount, expense.currency_code || currency.code)}
                </div>
                <div className="expense-actions">
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => openEdit(expense)}
                    title="Edit"
                    type="button"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => void handleDelete(expense.id)}
                    title="Delete"
                    type="button"
                    style={{ color: "var(--accent-danger)" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationControls
        page={page}
        totalPages={data?.total_pages ?? 0}
        onPageChange={setPage}
      />

      {showModal ? (
        <ModalShell title={editingId ? "Edit Expense" : "Add Expense"} onClose={closeModal}>
          {formError ? <InlineMessage message={formError} className="modal-message" /> : null}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="exp-amount">
                  Amount ({currency.code})
                </label>
                <input
                  id="exp-amount"
                  type="text"
                  inputMode="decimal"
                  className="form-input"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  required
                />
                <span className="form-help">Use your selected currency. Both commas and periods are accepted.</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="exp-date">
                  Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  className="form-input"
                  value={form.expenseDate}
                  onChange={(event) => updateForm("expenseDate", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exp-desc">
                Description
              </label>
              <input
                id="exp-desc"
                type="text"
                className="form-input"
                placeholder="What did you spend on?"
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                maxLength={120}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exp-category">
                Category
              </label>
              <select
                id="exp-category"
                className="form-select"
                value={form.categoryId}
                onChange={(event) => updateForm("categoryId", event.target.value)}
                disabled={categoriesLoading || categories.length === 0}
                required
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select category"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="form-help">Choose the category that best matches this purchase.</span>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || categoriesLoading || categories.length === 0}
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Add Expense"}
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}
    </AppShell>
  );
}
