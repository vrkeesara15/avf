import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { Gallery } from "./Gallery";
import { photos } from "../data/content";

const setup = () => renderPage("/gallery", <Gallery />);

describe("Gallery page", () => {
  it("shows all photos by default (GAL-01)", () => {
    setup();
    const grid = screen.getByTestId("gallery-grid");
    expect(within(grid).getAllByRole("button")).toHaveLength(photos.length);
  });

  it("filters photos by album tab (GAL-03)", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("tab", { name: "Graduation" }));
    const grid = screen.getByTestId("gallery-grid");
    const expected = photos.filter((p) => p.album === "Graduation").length;
    expect(within(grid).getAllByRole("button")).toHaveLength(expected);
  });

  it("opens a lightbox when a photo is clicked (GAL-02)", async () => {
    const user = userEvent.setup();
    setup();
    const grid = screen.getByTestId("gallery-grid");
    await user.click(within(grid).getAllByRole("button")[0]);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(photos[0].caption)).toBeInTheDocument();
  });

  it("closes the lightbox via the close button", async () => {
    const user = userEvent.setup();
    setup();
    const grid = screen.getByTestId("gallery-grid");
    await user.click(within(grid).getAllByRole("button")[0]);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates to the next image inside the lightbox", async () => {
    const user = userEvent.setup();
    setup();
    const grid = screen.getByTestId("gallery-grid");
    await user.click(within(grid).getAllByRole("button")[0]);
    await user.click(screen.getByRole("button", { name: /next image/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(photos[1].caption)).toBeInTheDocument();
  });
});
