import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { Impact } from "./Impact";
import { stories } from "../data/content";

const setup = () => renderPage("/impact", <Impact />);

describe("Impact page", () => {
  it("renders all AVF Stars by default (IMP-03)", () => {
    setup();
    const grid = screen.getByTestId("stories-grid");
    stories.forEach((s) => {
      expect(within(grid).getByText(s.headline)).toBeInTheDocument();
    });
  });

  it("filters AVF Stars by programme vertical (IMP-04)", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      screen.getByRole("tab", { name: "Women Empowerment" })
    );
    const grid = screen.getByTestId("stories-grid");
    const expected = stories.filter((s) => s.program === "Women Empowerment");
    const others = stories.filter((s) => s.program !== "Women Empowerment");
    expected.forEach((s) =>
      expect(within(grid).getByText(s.headline)).toBeInTheDocument()
    );
    others.forEach((s) =>
      expect(within(grid).queryByText(s.headline)).not.toBeInTheDocument()
    );
  });
});
