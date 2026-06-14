import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

const renderApp = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  it("renders the homepage hero with the primary CTAs (HP-02)", () => {
    renderApp("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /chance to learn/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /donate now/i }).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /^volunteer$/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /learn about our work/i })
    ).toBeInTheDocument();
  });

  it("navigates from the header to the Programs page (NAV-01)", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    await user.click(within(nav).getByRole("link", { name: "Programs" }));
    expect(
      screen.getByRole("heading", { level: 1, name: /our programmes/i })
    ).toBeInTheDocument();
  });

  it("renders a program detail page by slug", () => {
    renderApp("/programs/avlc");
    expect(
      screen.getByRole("heading", { level: 1, name: /av learning centres/i })
    ).toBeInTheDocument();
    // PRG-03 — AVLC page shows the five centres
    expect(screen.getAllByText(/singareni colony/i).length).toBeGreaterThan(0);
  });

  it("shows a 404 page for unknown routes", () => {
    renderApp("/does-not-exist");
    expect(
      screen.getByRole("heading", { level: 1, name: /page not found/i })
    ).toBeInTheDocument();
  });

  it("exposes a skip-to-content link for accessibility (NFR-A04)", () => {
    renderApp("/");
    expect(screen.getByText(/skip to content/i)).toBeInTheDocument();
    expect(document.querySelector("#main")).toBeInTheDocument();
  });
});
