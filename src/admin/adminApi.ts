/** Authenticated API client for the admin panel. */
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const url = (path: string) => `${BASE}/api/admin${path}`;

export const TOKEN_KEY = "avf_admin_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export interface AdminProfile {
  id?: string;
  sub?: string;
  email: string;
  name: string;
  role: "super_admin" | "content_editor" | "donation_viewer" | "gallery_manager";
}

class AdminApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(url(path), {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new AdminApiError(
      res.status,
      (data as { error?: string }).error ?? "Request failed"
    );
  }
  return data as T;
}

export const adminApi = {
  async login(email: string, password: string) {
    const res = await fetch(url("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new AdminApiError(
        res.status,
        (data as { error?: string }).error ?? "Login failed"
      );
    }
    return data as { token: string; user: AdminProfile };
  },

  me: () => request<{ user: AdminProfile }>("GET", "/auth/me"),

  // donations
  getDonations: () => request<Donation[]>("GET", "/donations"),
  getDonationStats: () => request<DonationStats>("GET", "/donations/stats"),

  // volunteers
  getVolunteers: () => request<Volunteer[]>("GET", "/volunteers"),
  updateVolunteer: (id: string, status: string) =>
    request<Volunteer>("PATCH", `/volunteers/${id}`, { status }),

  // inquiries
  getInquiries: () => request<Inquiry[]>("GET", "/inquiries"),
  updateInquiry: (id: string, status: string) =>
    request<Inquiry>("PATCH", `/inquiries/${id}`, { status }),

  // metrics
  getMetrics: () => request<Metric[]>("GET", "/metrics"),
  updateMetric: (id: string, value: number) =>
    request<Metric>("PATCH", `/metrics/${id}`, { value }),

  // content (news posts)
  getPosts: () => request<Post[]>("GET", "/content/posts"),
  createPost: (post: Partial<Post>) =>
    request<Post>("POST", "/content/posts", post),
  deletePost: (id: string) => request<void>("DELETE", `/content/posts/${id}`),

  // audit
  getAudit: () => request<AuditEntry[]>("GET", "/audit"),

  /** Download the donations CSV with the auth header (ADM-03). */
  async downloadDonationsCsv() {
    const res = await fetch(url("/donations/export.csv"), {
      headers: authHeaders(),
    });
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "avf-donations.csv";
    a.click();
    URL.revokeObjectURL(href);
  },
};

// ---- types used by the admin UI -----------------------------------------
export interface Donation {
  id: string;
  amount: number;
  frequency: string;
  status: string;
  donorName?: string;
  email?: string;
  pan?: string;
  city?: string;
  receiptNo?: string;
  createdAt: string;
  paidAt?: string;
}
export interface DonationStats {
  totalRaised: number;
  totalDonations: number;
  monthRaised: number;
  monthDonations: number;
  pendingReceipts: number;
}
export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  status: string;
  createdAt: string;
}
export interface Inquiry {
  id: string;
  type: string;
  status: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  orgName?: string;
  contact?: string;
  nature?: string;
  createdAt: string;
}
export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}
export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  icon: string;
  color: string;
}
export interface AuditEntry {
  id: string;
  userEmail: string;
  action: string;
  target?: string;
  createdAt: string;
}

export { AdminApiError };
