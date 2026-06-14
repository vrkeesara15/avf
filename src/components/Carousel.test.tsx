import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/render";
import { Carousel } from "./Carousel";

const slides = [
  <p key="1">First slide</p>,
  <p key="2">Second slide</p>,
  <p key="3">Third slide</p>,
];

describe("Carousel", () => {
  it("marks the first slide active by default", () => {
    renderWithRouter(<Carousel slides={slides} label="Test" />);
    const dots = screen.getAllByRole("button", { name: /go to slide/i });
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).toHaveAttribute("aria-current", "false");
  });

  it("advances with the next button", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Carousel slides={slides} label="Test" />);
    await user.click(screen.getByRole("button", { name: /next slide/i }));
    const dots = screen.getAllByRole("button", { name: /go to slide/i });
    expect(dots[1]).toHaveAttribute("aria-current", "true");
  });

  it("wraps from the first slide to the last with previous", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Carousel slides={slides} label="Test" />);
    await user.click(screen.getByRole("button", { name: /previous slide/i }));
    const dots = screen.getAllByRole("button", { name: /go to slide/i });
    expect(dots[2]).toHaveAttribute("aria-current", "true");
  });

  it("jumps to a slide when its dot is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Carousel slides={slides} label="Test" />);
    await user.click(screen.getByRole("button", { name: /go to slide 3/i }));
    const dots = screen.getAllByRole("button", { name: /go to slide/i });
    expect(dots[2]).toHaveAttribute("aria-current", "true");
  });
});
