import { Router } from "express";
import { z } from "zod";
import { getStore } from "../store";
import { asyncHandler, parseBody, nowIso } from "../lib/http";
import type { Subscriber } from "../types";

export const subscribersRouter = Router();

const schema = z.object({
  email: z.string().email("Valid email required"),
});

/** NEWS-06 — newsletter signup (idempotent on email). */
subscribersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email } = parseBody(schema, req.body);
    const store = getStore();
    const existing = await store.query<Subscriber>(
      "subscribers",
      "email",
      "==",
      email.toLowerCase()
    );
    if (existing.length) {
      res.status(200).json({ message: "You're already subscribed." });
      return;
    }
    await store.create<Subscriber>("subscribers", {
      email: email.toLowerCase(),
      createdAt: nowIso(),
    });
    res.status(201).json({ message: "Subscribed — thank you!" });
  })
);
