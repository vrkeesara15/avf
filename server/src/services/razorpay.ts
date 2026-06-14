import crypto from "node:crypto";
import Razorpay from "razorpay";
import { config } from "../config";

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  testMode: boolean;
}

let client: Razorpay | null = null;
function getClient(): Razorpay {
  if (!client) {
    client = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return client;
}

/**
 * Create a payment order. In test mode (no Razorpay key configured) we return
 * a deterministic fake order so the flow is fully exercisable without charging.
 */
export async function createOrder(
  amountInr: number,
  receipt: string
): Promise<PaymentOrder> {
  const amount = Math.round(amountInr * 100); // paise
  if (config.razorpay.testMode) {
    return {
      id: `test_order_${receipt}`,
      amount,
      currency: "INR",
      testMode: true,
    };
  }
  const order = await getClient().orders.create({
    amount,
    currency: "INR",
    receipt,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    testMode: false,
  };
}

/**
 * Verify the Razorpay payment signature (HMAC-SHA256 of "orderId|paymentId").
 * The same algorithm is used in test mode against the configured secret.
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  // constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Helper to compute a valid signature — used in test mode and by tests. */
export function computeSignature(orderId: string, paymentId: string): string {
  return crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}
