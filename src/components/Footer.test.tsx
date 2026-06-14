import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/render";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("shows the current year in the copyright (NAV-07)", () => {
    renderWithRouter(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });

  it("confirms a valid newsletter signup", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Footer />);
    await user.type(screen.getByLabelText(/email address/i), "donor@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));
    expect(screen.getByText(/you're subscribed/i)).toBeInTheDocument();
  });

  it("does not subscribe with an invalid email", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Footer />);
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /join/i }));
    expect(screen.queryByText(/you're subscribed/i)).not.toBeInTheDocument();
  });

  it("renders quick links and contact details", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByRole("link", { name: /our programs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /overseas/i })).toBeInTheDocument();
  });
});
