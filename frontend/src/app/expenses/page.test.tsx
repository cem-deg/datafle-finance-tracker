import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ExpensesPage from "./page";

const createExpenseMock = vi.fn();
const refetchExpensesMock = vi.fn();
const useExpensesMock = vi.fn();
const useCategoriesMock = vi.fn();

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
    currency: { code: "USD" },
    convertAndFormat: (amount: number) => `$${amount.toFixed(2)}`,
  }),
}));

vi.mock("@/services/api", () => ({
  expenseApi: {
    create: (...args: unknown[]) => createExpenseMock(...args),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ExpensesPage", () => {
  beforeEach(() => {
    createExpenseMock.mockReset();
    refetchExpensesMock.mockReset();
    useExpensesMock.mockReset();
    useCategoriesMock.mockReset();

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
});
