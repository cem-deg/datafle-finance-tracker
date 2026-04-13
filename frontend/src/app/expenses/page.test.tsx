import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ExpensesPage from "./page";

const createExpenseMock = vi.fn();
const updateExpenseMock = vi.fn();
const refetchExpensesMock = vi.fn();
const useExpensesMock = vi.fn();
const useCategoriesMock = vi.fn();
const currencyMock = { code: "USD" };

vi.mock("@/components/layout/AppShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/hooks/useFlashMessage", () => ({
  useFlashMessage: vi.fn(),
}));

vi.mock("@/hooks/useData", () => ({
  useExpenses: (...args: unknown[]) => useExpensesMock(...args),
  useCategories: (...args: unknown[]) => useCategoriesMock(...args),
}));

vi.mock("@/context/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: currencyMock,
    convertAndFormat: (amount: number) => `$${amount.toFixed(2)}`,
  }),
}));

vi.mock("@/services/api", () => ({
  expenseApi: {
    create: (...args: unknown[]) => createExpenseMock(...args),
    update: (...args: unknown[]) => updateExpenseMock(...args),
    delete: vi.fn(),
  },
}));

describe("ExpensesPage", () => {
  beforeEach(() => {
    createExpenseMock.mockReset();
    updateExpenseMock.mockReset();
    refetchExpensesMock.mockReset();
    useExpensesMock.mockReset();
    useCategoriesMock.mockReset();
    currencyMock.code = "USD";

    useExpensesMock.mockReturnValue({
      data: { items: [], total_pages: 0 },
      loading: false,
      error: null,
      refetch: refetchExpensesMock,
    });

    useCategoriesMock.mockReturnValue({
      categories: [
        {
          id: 1,
          name: "Groceries",
          color: "#4c6ef5",
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("shows a validation message and blocks submission when required fields are missing", async () => {
    render(<ExpensesPage />);

    fireEvent.click(document.getElementById("add-expense-btn") as HTMLButtonElement);
    const dialog = screen.getByRole("dialog", { name: /add expense/i });
    const modal = within(dialog);

    fireEvent.change(modal.getByLabelText(/amount/i), { target: { value: "0" } });
    fireEvent.change(modal.getByLabelText(/description/i), { target: { value: "Coffee" } });
    fireEvent.change(modal.getByLabelText(/category/i), { target: { value: "1" } });
    fireEvent.click(modal.getByRole("button", { name: /^add expense$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Enter a valid amount greater than 0."
    );
    expect(createExpenseMock).not.toHaveBeenCalled();
  });

  it("submits a new expense with the entered values", async () => {
    createExpenseMock.mockResolvedValue({ id: 10 });

    render(<ExpensesPage />);

    fireEvent.click(document.getElementById("add-expense-btn") as HTMLButtonElement);
    const dialog = screen.getByRole("dialog", { name: /add expense/i });
    const modal = within(dialog);

    fireEvent.change(modal.getByLabelText(/amount/i), { target: { value: "12.50" } });
    fireEvent.change(modal.getByLabelText(/description/i), { target: { value: "Coffee" } });
    fireEvent.change(modal.getByLabelText(/category/i), { target: { value: "1" } });
    fireEvent.change(modal.getByLabelText(/date/i), { target: { value: "2026-04-08" } });
    fireEvent.click(modal.getByRole("button", { name: /^add expense$/i }));

    await waitFor(() => {
      expect(createExpenseMock).toHaveBeenCalledWith({
        amount: 12.5,
        description: "Coffee",
        category_id: 1,
        expense_date: "2026-04-08",
        currency_code: "USD",
      });
    });
    expect(refetchExpensesMock).toHaveBeenCalled();
  });

  it("preserves the stored currency when editing after the display currency changes", async () => {
    updateExpenseMock.mockResolvedValue({ id: 1 });
    currencyMock.code = "TRY";

    useExpensesMock.mockReturnValue({
      data: {
        items: [
          {
            id: 1,
            amount: 100,
            description: "Coffee",
            category_id: 1,
            expense_date: "2026-04-08",
            currency_code: "USD",
          },
        ],
        total_pages: 1,
      },
      loading: false,
      error: null,
      refetch: refetchExpensesMock,
    });

    render(<ExpensesPage />);

    fireEvent.click(screen.getByRole("button", { name: /edit expense coffee/i }));
    const dialog = screen.getByRole("dialog", { name: /edit expense/i });
    const modal = within(dialog);

    expect(modal.getByLabelText("Amount (USD)")).toHaveValue("100");

    fireEvent.change(modal.getByLabelText("Description"), { target: { value: "Coffee beans" } });
    fireEvent.click(modal.getByRole("button", { name: /^update$/i }));

    await waitFor(() => {
      expect(updateExpenseMock).toHaveBeenCalledWith(1, {
        amount: 100,
        description: "Coffee beans",
        category_id: 1,
        expense_date: "2026-04-08",
        currency_code: "USD",
      });
    });
  });
});
