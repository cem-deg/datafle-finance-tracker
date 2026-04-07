import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "./page";

const pushMock = vi.fn();
const loginMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    pushMock.mockReset();
    loginMock.mockReset();
  });

  it("submits entered credentials and routes to the dashboard on success", async () => {
    loginMock.mockResolvedValue(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("demo@example.com", "secret123");
    });
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("shows an inline error when login fails", async () => {
    loginMock.mockRejectedValue(new Error("Invalid credentials"));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bad-pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(pushMock).not.toHaveBeenCalled();
  });
});
