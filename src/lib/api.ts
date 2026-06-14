/**
 * Thin API client for the AVF backend.
 * Base URL comes from VITE_API_URL; when empty, requests go to the same
 * origin (e.g. behind a reverse proxy / Firebase rewrite to Cloud Run).
 */
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const url = (path: string) => `${BASE}/api${path}`;

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(url(path));
  if (!res.ok) throw new ApiError(res.status, await safeError(res));
  return (await res.json()) as T;
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string }).error ?? "Request failed");
  }
  return data as T;
}

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return (data as { error?: string }).error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// ---- Donations ----------------------------------------------------------
export interface OrderResponse {
  donationId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  testMode: boolean;
  testPaymentId?: string;
  testSignature?: string;
}

export interface DonorDetails {
  name: string;
  email: string;
  phone: string;
  pan: string;
  city: string;
  organisation?: string;
  marketingConsent?: boolean;
}

export interface VerifyResponse {
  status: string;
  receiptNo: string;
  amount: number;
  message: string;
}

export const api = {
  // content
  getMetrics: () => getJSON("/content/metrics"),
  getPrograms: () => getJSON("/content/programs"),
  getProgram: (slug: string) => getJSON(`/content/programs/${slug}`),
  getStories: () => getJSON("/content/stories"),
  getTestimonials: () => getJSON("/content/testimonials"),
  getPosts: () => getJSON("/content/posts"),
  getEvents: () => getJSON("/content/events"),
  getGallery: () => getJSON("/content/gallery"),

  // donations
  createOrder: (amount: number, frequency: string) =>
    postJSON<OrderResponse>("/donations/order", { amount, frequency }),
  verifyDonation: (payload: {
    donationId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    donor: DonorDetails;
  }) => postJSON<VerifyResponse>("/donations/verify", payload),

  // submissions
  registerVolunteer: (data: Record<string, unknown>) =>
    postJSON<{ id: string; message: string }>("/volunteers", data),
  submitInquiry: (data: Record<string, unknown>) =>
    postJSON<{ id: string; message: string }>("/inquiries", data),
  subscribe: (email: string) =>
    postJSON<{ message: string }>("/subscribers", { email }),
};

export { getJSON, postJSON };
