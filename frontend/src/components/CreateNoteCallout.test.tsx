import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import CreateNoteCallout from "./CreateNoteCallout";

afterEach(() => {
  cleanup();
});

describe("CreateNoteCallout", () => {
  it("links to the note form", () => {
    render(<CreateNoteCallout />);
    expect(screen.getByRole("heading", { name: "Precisa enviar um segredo?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Criar uma nota" })).toHaveAttribute("href", "/#criar-nota");
  });
});
