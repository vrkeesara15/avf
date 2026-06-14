import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../test/render";
import { ImpactCounter, formatNumber } from "./ImpactCounter";

describe("formatNumber", () => {
  it("groups numbers using the Indian locale", () => {
    expect(formatNumber(8500)).toBe("8,500");
    expect(formatNumber(100000)).toBe("1,00,000");
    expect(formatNumber(5)).toBe("5");
  });
});

describe("ImpactCounter", () => {
  it("renders the label and animates up to the target value", async () => {
    renderWithRouter(
      <ImpactCounter
        metric={{ id: "children", label: "Children educated", value: 8500, suffix: "+" }}
        duration={10}
      />
    );

    expect(screen.getByText("Children educated")).toBeInTheDocument();

    // IntersectionObserver is mocked to fire immediately; the counter should
    // reach its final formatted value.
    await waitFor(() =>
      expect(screen.getByTestId("counter-children")).toHaveTextContent("8,500+")
    );
  });

  it("supports a prefix", async () => {
    renderWithRouter(
      <ImpactCounter
        metric={{ id: "raised", label: "Raised", value: 1000, prefix: "₹" }}
        duration={10}
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId("counter-raised")).toHaveTextContent("₹1,000")
    );
  });
});
