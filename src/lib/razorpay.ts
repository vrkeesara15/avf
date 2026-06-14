import type { OrderResponse, DonorDetails } from "./api";

interface CheckoutResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (e: unknown) => void) => void;
    };
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Open the Razorpay checkout for a real (non-test) order and resolve with the
 * payment handshake. Used only when the backend reports it is NOT in test mode.
 */
export async function openRazorpayCheckout(
  order: OrderResponse,
  donor: DonorDetails
): Promise<CheckoutResult> {
  const ok = await loadScript();
  if (!ok || !window.Razorpay) {
    throw new Error("Could not load the payment gateway. Please try again.");
  }
  return new Promise<CheckoutResult>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: "Akshaya Vidya Foundation",
      description: "Donation",
      order_id: order.orderId,
      prefill: { name: donor.name, email: donor.email, contact: donor.phone },
      theme: { color: "#1b4f8a" },
      handler: (res: unknown) => resolve(res as CheckoutResult),
    });
    rzp.on("payment.failed", () =>
      reject(new Error("Payment failed or was cancelled."))
    );
    rzp.open();
  });
}
