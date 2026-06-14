import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { Contact } from "./Contact";

const setup = () => renderPage("/contact", <Contact />);

describe("Contact page", () => {
  it("validates the general inquiry form (CON-01)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", { name: /contact inquiry form/i });
    await user.click(within(form).getByRole("button", { name: /send message/i }));
    expect(within(form).getByText(/please enter your name/i)).toBeInTheDocument();
    expect(within(form).getByText(/please add a subject/i)).toBeInTheDocument();
  });

  it("submits the inquiry form successfully (CON-02)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", { name: /contact inquiry form/i });
    await user.type(within(form).getByLabelText(/name/i), "Sita");
    await user.type(within(form).getByLabelText(/email/i), "sita@example.com");
    await user.type(within(form).getByLabelText(/subject/i), "Donation query");
    await user.type(within(form).getByLabelText(/message/i), "Hello team!");
    await user.click(within(form).getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument();
  });

  it("validates the CSR partner form (CON-03)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", { name: /csr partnership form/i });
    await user.click(
      within(form).getByRole("button", { name: /submit partnership inquiry/i })
    );
    expect(
      within(form).getByText(/please enter your organisation/i)
    ).toBeInTheDocument();
    expect(within(form).getByText(/valid 10-digit mobile/i)).toBeInTheDocument();
  });
});
