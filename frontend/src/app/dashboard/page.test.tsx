import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

const useSummaryMock = vi.fn();
const useRecentExpensesMock = vi.fn();
const useRecentIncomesMock = vi.fn();
const useMonthlyTotalsMock = vi.fn();
const useCategoriesMock = vi.fn();
const useBudgetOverviewMock = vi.fn();

vi.mock("@/components/layout/AppShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/charts/MonthlyBarChart", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/hooks/useData", () => ({
  useSummary: (...args: unknown[]) => useSummaryMock(...args),
  useRecentExpenses: (...args: unknown[]) => useRecentExpensesMock(...args),
  useRecentIncomes: (...args: unknown[]) => useRecentIncomesMock(...args),
  useMonthlyTotals: (...args: unknown[]) => useMonthlyTotalsMock(...args),
  useCategories: (...args: unknown[]) => useCategoriesMock(...args),
  useBudgetOverview: (...args: unknown[]) => useBudgetOverviewMock(...args),
}));

vi.mock("@/context/CurrencyContext", () => ({
  useCurrency: () => ({
    convertAndFormat: (amount: number) => `$${amount.toFixed(2)}`,
  }),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    useSummaryMock.mockReturnValue({
      summary: {
        base_currency: "USD",
        total_income_this_month: 4200,
        net_balance_this_month: 1800,
        total_this_month: 2400,
        month_change_percent: -12.4,
        budget_remaining: 600,
        budget_usage_percent: 55,
        top_category_id: 1,
        over_budget_categories_count: 1,
      },
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    useRecentExpensesMock.mockReturnValue({
      expenses: [
        {
          id: 1,
          description: "Groceries",
          category_id: 1,
          expense_date: "2026-04-08",
          amount: 84.5,
          currency_code: "USD",
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    useRecentIncomesMock.mockReturnValue({
      incomes: [
        {
          id: 2,
          description: "Salary",
          source: "Work",
          income_date: "2026-04-01",
          amount: 4200,
          currency_code: "USD",
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    useMonthlyTotalsMock.mockReturnValue({
      data: [{ month: "2026-04", total: 2400, base_currency: "USD" }],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    useCategoriesMock.mockReturnValue({
      categories: [
        {
          id: 1,
          name: "Groceries",
          color: "#4c6ef5",
        },
      ],
      error: null,
    });
    useBudgetOverviewMock.mockReturnValue({
      data: [
        {
          budget_id: 1,
          category_id: 1,
          category_name: "Groceries",
          category_color: "#4c6ef5",
          amount: 500,
          spent: 420,
          remaining: 80,
          base_currency: "USD",
          usage_percent: 84,
          is_over_budget: false,
          month_start: "2026-04-01",
        },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it("renders the main dashboard overview and activity path", () => {
    render(<DashboardPage />);

    expect(screen.getByText("This month at a glance")).toBeInTheDocument();
    expect(screen.getByText("Income this month")).toBeInTheDocument();
    expect(screen.getAllByText("Groceries").length).toBeGreaterThan(0);
    expect(screen.getByText("Recent Expenses")).toBeInTheDocument();
    expect(screen.getByText("Spending trend")).toBeInTheDocument();
  });
});
