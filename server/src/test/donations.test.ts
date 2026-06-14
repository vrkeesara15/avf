import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { makeContext } from "./helpers";

let app: Express;
beforeEach(async () => {
  ({ app } = await makeContext());
});

const donor = {
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "9876543210",
  pan: "ABCDE1234F",
  city: "Hyderabad",
};

async function createOrder(amount = 2400) {
  const res = await request(app)
    .post("/api/donations/order")
    .send({ amount, frequency: "one-time" });
  return res;
}

describe("donations API", () => {
  it("creates a payment order in deterministic test mode (DON-01)", async () => {
    const res = await createOrder(2400);
    expect(res.status).toBe(201);
    expect(res.body.testMode).toBe(true);
    expect(res.body.orderId).toMatch(/^test_order_/);
    expect(res.body.testSignature).toBeTruthy();
    expect(res.body.amount).toBe(240000); // paise
  });

  it("rejects an invalid amount", async () => {
    const res = await request(app)
      .post("/api/donations/order")
      .send({ amount: -5 });
    expect(res.status).toBe(400);
  });

  it("completes verification and issues an 80G receipt (DON-06)", async () => {
    const order = await createOrder(2400);
    const res = await request(app)
      .post("/api/donations/verify")
      .send({
        donationId: order.body.donationId,
        razorpay_order_id: order.body.orderId,
        razorpay_payment_id: order.body.testPaymentId,
        razorpay_signature: order.body.testSignature,
        donor,
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("paid");
    expect(res.body.receiptNo).toMatch(/^AVF-\d{4}-/);
  });

  it("rejects a tampered signature", async () => {
    const order = await createOrder();
    const res = await request(app)
      .post("/api/donations/verify")
      .send({
        donationId: order.body.donationId,
        razorpay_order_id: order.body.orderId,
        razorpay_payment_id: order.body.testPaymentId,
        razorpay_signature: "deadbeef",
        donor,
      });
    expect(res.status).toBe(400);
  });

  it("requires a valid PAN for the 80G receipt (DON-05)", async () => {
    const order = await createOrder();
    const res = await request(app)
      .post("/api/donations/verify")
      .send({
        donationId: order.body.donationId,
        razorpay_order_id: order.body.orderId,
        razorpay_payment_id: order.body.testPaymentId,
        razorpay_signature: order.body.testSignature,
        donor: { ...donor, pan: "INVALID" },
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/pan/i);
  });

  it("serves the receipt PDF after payment", async () => {
    const order = await createOrder();
    await request(app)
      .post("/api/donations/verify")
      .send({
        donationId: order.body.donationId,
        razorpay_order_id: order.body.orderId,
        razorpay_payment_id: order.body.testPaymentId,
        razorpay_signature: order.body.testSignature,
        donor,
      });
    const res = await request(app).get(
      `/api/donations/${order.body.donationId}/receipt`
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
    expect(res.body.length ?? res.text.length).toBeGreaterThan(500);
  });

  it("prevents double-completion of a donation", async () => {
    const order = await createOrder();
    const payload = {
      donationId: order.body.donationId,
      razorpay_order_id: order.body.orderId,
      razorpay_payment_id: order.body.testPaymentId,
      razorpay_signature: order.body.testSignature,
      donor,
    };
    await request(app).post("/api/donations/verify").send(payload);
    const second = await request(app)
      .post("/api/donations/verify")
      .send(payload);
    expect(second.status).toBe(409);
  });
});
