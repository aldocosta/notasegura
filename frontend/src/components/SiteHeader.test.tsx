import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SiteHeader from "./SiteHeader";

afterEach(() => {
  cleanup();
});

describe("SiteHeader", () => {
  it("links the brand to the home page", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Nota Segura - BR" })).toHaveAttribute("href", "/");
  });

  it("shows the logo in the brand link", () => {
    render(<SiteHeader />);
    const link = screen.getByRole("link", { name: "Nota Segura - BR" });
    expect(link.querySelector("svg")).not.toBeNull();
    expect(link).toHaveTextContent("BR");
  });
});
