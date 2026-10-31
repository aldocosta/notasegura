import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SafetyBadge from "./SafetyBadge";

afterEach(() => {
  cleanup();
});

describe("SafetyBadge", () => {
  it("shows the label", () => {
    for (const safety of ["Seguro", "Não é criptografia", "Inseguro"] as const) {
      const { container, unmount } = render(<SafetyBadge safety={safety} />);
      expect(container.textContent).toBe(safety);
      unmount();
    }
  });

  it("marks unsafe in the error color", () => {
    render(
      <>
        <SafetyBadge safety="Inseguro" />
        <SafetyBadge safety="Seguro" />
      </>,
    );
    expect(screen.getByText("Inseguro")).toHaveClass("text-error");
    expect(screen.getByText("Seguro")).not.toHaveClass("text-error");
  });
});
