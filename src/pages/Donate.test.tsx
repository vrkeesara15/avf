import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { Donate } from "./Donate";

// Mock the API so the donation flow is deterministic and offline.
vi.mock("../lib/api", () => ({
  api: {
    createOrder: vi.fn(async (amount: number) => ({
      donationId: "don_test",
      orderId: "test_order_don_test",
      amount: amount * 100,
      currency: "INR",
      keyId: "rzp_test",
      testMode: true,
      testPaymentId: "pay_test_don_test",
      testSignature: "sig_test",
    })),
    verifyDonation: vi.fn(async () => ({
      status: "paid",
      receiptNo: "AVF-2026-12345678",
      amount: 2400,
      message: "Donation successful",
    })),
    subscribe: vi.fn(async () => ({ message: "ok" })),
  },
}));

const setup = (route = "/donate") => renderPage("/donate", <Donate />, { route });

describe("Donate page", () => {
  it("renders donation tiers with impact messaging (DON-02)", () => {
    setup();
    expect(screen.getByText("₹2,400")).toBeInTheDocument();
    expect(
      screen.getByText(/a full year of learning for 1 child/i)
    ).toBeInTheDocument();
  });

  it("preselects the amount from the query string", () => {
    setup("/donate?amount=10000");
    const submit = screen.getByRole("button", { name: /donate ₹/i });
    expect(submit).toHaveTextContent("₹10,000");
  });

  it("selects a tier when clicked", async () => {
    const user = userEvent.setup();
    setup();
    const tier = screen
      .getByText("₹50,000")
      .closest("button") as HTMLButtonElement;
    await user.click(tier);
    expect(tier).toHaveAttribute("aria-checked", "true");
  });

  it("accepts a custom amount (DON-03)", async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByLabelText(/custom amount/i), "7500");
    expect(
      screen.getByRole("button", { name: /donate ₹/i })
    ).toHaveTextContent("₹7,500");
  });

  it("requires a valid PAN before completing the donation (DON-05)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", { name: /donation form/i });
    await user.type(within(form).getByLabelText(/full name/i), "Asha Rao");
    await user.type(within(form).getByLabelText(/^email/i), "asha@example.com");
    await user.type(within(form).getByLabelText(/^phone/i), "9876543210");
    await user.type(within(form).getByLabelText(/pan number/i), "BAD");
    await user.type(within(form).getByLabelText(/^city/i), "Hyderabad");

    await user.click(within(form).getByRole("button", { name: /donate ₹/i }));

    expect(screen.getByText(/enter a valid pan/i)).toBeInTheDocument();
    expect(screen.queryByText(/donation successful/i)).not.toBeInTheDocument();
  });

  it("completes the flow and shows an 80G receipt confirmation (DON-06)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", { name: /donation form/i });
    await user.type(within(form).getByLabelText(/full name/i), "Asha Rao");
    await user.type(within(form).getByLabelText(/^email/i), "asha@example.com");
    await user.type(within(form).getByLabelText(/^phone/i), "9876543210");
    await user.type(within(form).getByLabelText(/pan number/i), "ABCDE1234F");
    await user.type(within(form).getByLabelText(/^city/i), "Hyderabad");

    await user.click(within(form).getByRole("button", { name: /donate ₹/i }));

    expect(await screen.findByText(/donation successful/i)).toBeInTheDocument();
    const success = screen.getByText(/donation successful/i).closest("div")!;
    expect(within(success).getByText(/80G-compliant tax receipt/i)).toBeInTheDocument();
  });

  it("lets the donor choose a recurring frequency (DON-04)", async () => {
    const user = userEvent.setup();
    setup();
    const monthly = screen.getByRole("radio", { name: /monthly/i });
    await user.click(monthly);
    expect(monthly).toHaveAttribute("aria-checked", "true");
  });
});
