import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/render";
import { Header } from "./Header";
import { mainNav } from "../data/nav";

describe("Header", () => {
  it("renders all primary navigation links", () => {
    renderWithRouter(<Header />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    mainNav.forEach((item) => {
      expect(within(nav).getByText(item.label)).toBeInTheDocument();
    });
  });

  it("always shows a distinctly styled Donate button (NAV-02)", () => {
    renderWithRouter(<Header />);
    const donate = screen.getAllByRole("link", { name: /donate/i })[0];
    expect(donate).toHaveAttribute("href", "/donate");
    expect(donate.className).toContain("btn--donate");
  });

  it("toggles the mobile menu and exposes aria-expanded", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Header />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("displays trust badges (80G / FCRA)", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText(/80G Tax Exemption/i)).toBeInTheDocument();
    expect(screen.getByText(/FCRA Reg/i)).toBeInTheDocument();
  });
});
