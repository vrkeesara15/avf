import { Router } from "express";
import { z } from "zod";
import { getStore } from "../store";
import { asyncHandler, HttpError, parseBody, nowIso } from "../lib/http";
import { config } from "../config";
import {
  createOrder,
  verifySignature,
  computeSignature,
} from "../services/razorpay";
import { generateReceiptPdf } from "../services/receipt";
import { sendReceiptEmail } from "../services/email";
import type { Donation } from "../types";

export const donationsRouter = Router();

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PHONE_RE = /^(\+?91[-\s]?|0)?[6-9]\d{9}$/;

const orderSchema = z.object({
  amount: z.number().int().positive().max(10_000_000),
  frequency: z.enum(["one-time", "monthly", "annual"]).default("one-time"),
});

const donorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(PHONE_RE, "Valid 10-digit mobile required"),
  pan: z
    .string()
    .transform((s) => s.trim().toUpperCase())
    .refine((s) => PAN_RE.test(s), "Valid PAN required for 80G receipt"),
  city: z.string().min(1, "City is required"),
  organisation: z.string().optional(),
  marketingConsent: z.boolean().optional(),
});

const verifySchema = z.object({
  donationId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  donor: donorSchema,
});

function receiptNumber(): string {
  const year = new Date().getFullYear();
  return `AVF-${year}-${Date.now().toString().slice(-8)}`;
}

/** DON-01/DON-02/DON-03 — create a payment order. */
donationsRouter.post(
  "/order",
  asyncHandler(async (req, res) => {
    const { amount, frequency } = parseBody(orderSchema, req.body);
    const store = getStore();

    const donation = await store.create<Donation>("donations", {
      amount,
      frequency: frequency ?? "one-time",
      status: "created",
      createdAt: nowIso(),
    });

    const order = await createOrder(amount, donation.id);
    await store.update<Donation>("donations", donation.id, {
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      donationId: donation.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.razorpay.keyId || "rzp_test_placeholder",
      testMode: order.testMode,
      // In test mode we return a ready-to-use signature so the public site can
      // complete the flow without a real Razorpay checkout.
      ...(order.testMode
        ? {
            testPaymentId: `pay_test_${donation.id}`,
            testSignature: computeSignature(order.id, `pay_test_${donation.id}`),
          }
        : {}),
    });
  })
);

/** DON-05/DON-06/DON-07 — verify payment, persist donor, issue 80G receipt. */
donationsRouter.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const body = parseBody(verifySchema, req.body);
    const store = getStore();

    const donation = await store.get<Donation>("donations", body.donationId);
    if (!donation) throw new HttpError(404, "Donation not found");
    if (donation.status === "paid") {
      throw new HttpError(409, "Donation already completed");
    }
    if (donation.razorpayOrderId !== body.razorpay_order_id) {
      throw new HttpError(400, "Order mismatch");
    }

    const valid = verifySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    if (!valid) {
      await store.update<Donation>("donations", donation.id, {
        status: "failed",
      });
      throw new HttpError(400, "Payment signature verification failed");
    }

    const receiptNo = receiptNumber();
    const updated = (await store.update<Donation>("donations", donation.id, {
      status: "paid",
      donorName: body.donor.name,
      email: body.donor.email,
      phone: body.donor.phone,
      pan: body.donor.pan,
      city: body.donor.city,
      organisation: body.donor.organisation,
      marketingConsent: body.donor.marketingConsent ?? false,
      razorpayPaymentId: body.razorpay_payment_id,
      receiptNo,
      paidAt: nowIso(),
    }))!;

    // Generate + email the 80G receipt (best-effort; never blocks success).
    try {
      const pdf = await generateReceiptPdf(updated);
      await sendReceiptEmail(
        updated.email!,
        updated.donorName!,
        updated.amount,
        receiptNo,
        pdf
      );
      await store.update<Donation>("donations", donation.id, {
        receiptEmailed: true,
      });
    } catch (err) {
      console.error("Receipt email failed:", err);
    }

    res.json({
      status: "paid",
      receiptNo,
      amount: updated.amount,
      message: "Donation successful — your 80G receipt has been emailed.",
    });
  })
);

/** Download a donation's 80G receipt PDF. */
donationsRouter.get(
  "/:id/receipt",
  asyncHandler(async (req, res) => {
    const donation = await getStore().get<Donation>(
      "donations",
      req.params.id
    );
    if (!donation || donation.status !== "paid") {
      throw new HttpError(404, "Receipt not available");
    }
    const pdf = await generateReceiptPdf(donation);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AVF-Receipt-${donation.receiptNo}.pdf"`
    );
    res.send(pdf);
  })
);
