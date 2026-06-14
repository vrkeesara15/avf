import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "../test/render";
import { GetInvolved } from "./GetInvolved";
import { volunteerRoles } from "../data/content";

const setup = () => renderPage("/get-involved", <GetInvolved />);

describe("Get Involved page", () => {
  it("lists open volunteer roles (VOL-03)", () => {
    setup();
    volunteerRoles.forEach((r) => {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    });
  });

  it("shows validation errors when submitting an empty form (VOL-01)", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(
      screen.getByRole("button", { name: /register as volunteer/i })
    );
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/pick an area of interest/i)).toBeInTheDocument();
  });

  it("submits successfully with valid data and acknowledges (VOL-02)", async () => {
    const user = userEvent.setup();
    setup();
    const form = screen.getByRole("form", {
      name: /volunteer registration form/i,
    });
    await user.type(within(form).getByLabelText(/full name/i), "Ravi Kumar");
    await user.type(within(form).getByLabelText(/^email/i), "ravi@example.com");
    await user.type(within(form).getByLabelText(/^phone/i), "9876543210");
    await user.type(within(form).getByLabelText(/^city/i), "Hyderabad");
    await user.selectOptions(
      within(form).getByLabelText(/area of interest/i),
      "Teaching / Tutoring"
    );
    await user.click(
      within(form).getByRole("button", { name: /register as volunteer/i })
    );
    expect(screen.getByText(/thank you for signing up/i)).toBeInTheDocument();
  });
});
