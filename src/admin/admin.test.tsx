import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import type { AdminProfile } from "./adminApi";

// In-memory token + mockable admin API.
let token: string | null = null;
const loginMock = vi.fn();

vi.mock("./adminApi", () => ({
  TOKEN_KEY: "avf_admin_token",
  getToken: () => token,
  setToken: (t: string) => {
    token = t;
  },
  clearToken: () => {
    token = null;
  },
  adminApi: {
    login: (...args: unknown[]) => loginMock(...args),
    me: async () => ({ user: currentUser }),
    getDonationStats: async () => ({
      totalRaised: 240000,
      totalDonations: 12,
      monthRaised: 24000,
      monthDonations: 2,
      pendingReceipts: 0,
    }),
    getVolunteers: async () => [],
    getInquiries: async () => [],
    getDonations: async () => [],
    getMetrics: async () => [],
    getPosts: async () => [],
    getAudit: async () => [],
    downloadDonationsCsv: async () => {},
  },
}));

let currentUser: AdminProfile;

function mockLogin(role: AdminProfile["role"]) {
  currentUser = {
    id: "u1",
    email: `${role}@akshayavidya.org`,
    name: "Test Admin",
    role,
  };
  loginMock.mockResolvedValue({ token: "tok", user: currentUser });
}

beforeEach(() => {
  token = null;
  loginMock.mockReset();
});
afterEach(() => {
  token = null;
});

const renderAdmin = () =>
  render(
    <MemoryRouter initialEntries={["/admin/login"]}>
      <App />
    </MemoryRouter>
  );

describe("Admin panel", () => {
  it("shows the login screen at /admin/login", () => {
    renderAdmin();
    expect(
      screen.getByRole("heading", { name: /admin sign in/i })
    ).toBeInTheDocument();
  });

  it("logs a super-admin in and shows the dashboard with full nav", async () => {
    mockLogin("super_admin");
    const user = userEvent.setup();
    renderAdmin();

    await user.type(screen.getByLabelText(/email/i), "admin@akshayavidya.org");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
    // super_admin sees every nav item, including the audit log
    const nav = document.querySelector(".admin__nav") as HTMLElement;
    expect(within(nav).getByText(/audit log/i)).toBeInTheDocument();
    expect(within(nav).getByText(/donations/i)).toBeInTheDocument();
    expect(within(nav).getByText(/impact metrics/i)).toBeInTheDocument();
  });

  it("hides restricted nav items for a donation_viewer (RBAC)", async () => {
    mockLogin("donation_viewer");
    const user = userEvent.setup();
    renderAdmin();

    await user.type(screen.getByLabelText(/email/i), "dv@akshayavidya.org");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await screen.findByRole("heading", { name: /dashboard/i });
    const nav = document.querySelector(".admin__nav") as HTMLElement;
    expect(within(nav).queryByText(/impact metrics/i)).not.toBeInTheDocument();
    expect(within(nav).queryByText(/audit log/i)).not.toBeInTheDocument();
    expect(within(nav).getByText(/donations/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from protected admin pages", () => {
    render(
      <MemoryRouter initialEntries={["/admin/donations"]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: /admin sign in/i })
    ).toBeInTheDocument();
  });
});
