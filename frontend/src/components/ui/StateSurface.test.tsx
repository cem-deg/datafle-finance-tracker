import { render, screen } from "@testing-library/react";
import StateSurface from "./StateSurface";

describe("StateSurface", () => {
  it("renders a polite busy loading shell", () => {
    render(<StateSurface type="loading" framed lines={2} />);

    const loadingRegion = screen.getByRole("generic", { busy: true });
    expect(loadingRegion).toHaveAttribute("aria-live", "polite");
  });

  it("renders a retryable error state", () => {
    const onAction = vi.fn();

    render(
      <StateSurface
        type="error"
        title="Could not load dashboard"
        description="Try again."
        actionLabel="Retry"
        onAction={onAction}
      />
    );

    expect(screen.getByText("Could not load dashboard")).toBeInTheDocument();
    screen.getByRole("button", { name: /retry/i }).click();
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
