import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { News } from "./News";
import { posts, events, reports } from "../data/content";

const setup = () => renderPage("/news", <News />);

describe("News & Events page", () => {
  it("renders the upcoming event calendar (NEWS-02)", () => {
    setup();
    events.forEach((ev) => {
      expect(screen.getByText(ev.title)).toBeInTheDocument();
    });
  });

  it("shows all news posts by default (NEWS-01)", () => {
    setup();
    const grid = screen.getByTestId("news-grid");
    expect(within(grid).getAllByRole("article")).toHaveLength(posts.length);
  });

  it("filters news posts by category", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("tab", { name: "Success Story" }));
    const grid = screen.getByTestId("news-grid");
    const expected = posts.filter((p) => p.category === "Success Story").length;
    expect(within(grid).getAllByRole("article")).toHaveLength(expected);
  });

  it("lists downloadable annual reports (NEWS-04)", () => {
    setup();
    reports.forEach((r) => {
      expect(
        screen.getByText(new RegExp(`${r.label} ${r.year}`))
      ).toBeInTheDocument();
    });
  });
});
