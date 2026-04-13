import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import IncomePage from "./page";

const createIncomeMock = vi.fn();
const updateIncomeMock = vi.fn();
const refetchIncomesMock = vi.fn();
const useIncomesMock = vi.fn();
const currencyMock = { code: "USD" };

vi.mock("@/components/layout/AppShell", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/hooks/useFlashMessage", () => ({
  useFlashMessage: vi.fn(),
}));

vi.mock("@/hooks/useData", () => ({
  useIncomes: (...args: unknown[]) => useIncomesMock(...args),
}));

vi.mock("@/context/CurrencyContext", () => ({
  useCurrency: () => ({
    currency: currencyMock,
    convertAndFormat: (amount: number) => `$${amount.toFixed(2)}`,
  }),
}));

vi.mock("@/services/api", () => ({
  incomeApi: {
    create: (...args: unknown[]) => createIncomeMock(...args),
    update: (...args: unknown[]) => updateIncomeMock(...args),
    delete: vi.fn(),
  },
}));

describe("IncomePage", () => {
  beforeEach(() => {
    createIncomeMock.mockReset();
    updateIncomeMock.mockReset();
    refetchIncomesMock.mockReset();
    useIncomesMock.mockReset();
    currencyMock.code = "USD";

    useIncomesMock.mockReturnValue({
      data: { items: [], total_pages: 0 },
      loading: false,
      error: null,
      refetch: refetchIncomesMock,
    });
  });

  it("submits a new income with the selected currency", async () => {
    createIncomeMock.mockResolvedValue({ id: 10 });
    currencyMock.code = "TRY";

    render(<IncomePage />);

    fireEvent.click(screen.getAllByRole("button", { name: /add income/i })[0]);
    const dialog = screen.getByRole("dialog", { name: /add income/i });
    const modal = within(dialog);

    fireEvent.change(modal.getByLabelText(/amount/i), { target: { value: "1250" } });
    fireEvent.change(modal.getByLabelText(/description/i), { target: { value: "Consulting" } });
    fireEvent.change(modal.getByLabelText(/source/i), { target: { value: "Freelance" } });
    fireEvent.change(modal.getByLabelText(/date/i), { target: { value: "2026-04-08" } });
    fireEvent.click(modal.getByRole("button", { name: /^add income$/i }));

    await waitFor(() => {
      expect(createIncomeMock).toHaveBeenCalledWith({
        amount: 1250,
        description: "Consulting",
        source: "Freelance",
        income_date: "2026-04-08",
        currency_code: "TRY",
      });
    });
  });

  it("preserves the stored currency when editing after the display currency changes", async () => {
    updateIncomeMock.mockResolvedValue({ id: 1 });
    currencyMock.code = "TRY";

    useIncomesMock.mockReturnValue({
      data: {
        items: [
          {
            id: 1,
            amount: 100,
            description: "Salary",
            source: "Work",
            income_date: "2026-04-08",
            currency_code: "USD",
          },
        ],
        total_pages: 1,
      },
      loading: false,
      error: null,
      refetch: refetchIncomesMock,
    });

    render(<IncomePage />);

    fireEvent.click(screen.getByRole("button", { name: /edit income salary/i }));
    const dialog = screen.getByRole("dialog", { name: /edit income/i });
    const modal = within(dialog);

    expect(modal.getByLabelText("Amount (USD)")).toHaveValue("100");

    fireEvent.change(modal.getByLabelText("Description"), { target: { value: "Salary April" } });
    fireEvent.click(modal.getByRole("button", { name: /^update$/i }));

    await waitFor(() => {
      expect(updateIncomeMock).toHaveBeenCalledWith(1, {
        amount: 100,
        description: "Salary April",
        source: "Work",
        income_date: "2026-04-08",
        currency_code: "USD",
      });
    });
  });
});
