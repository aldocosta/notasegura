import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import * as icons from "./icons";

afterEach(() => {
  cleanup();
});

describe("icons", () => {
  it.each(Object.entries(icons))("%s is decorative", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(1);
    expect(svgs[0]).toHaveAttribute("aria-hidden", "true");
    expect(svgs[0]).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
