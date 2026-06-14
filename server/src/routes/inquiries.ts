import { Router } from "express";
import { z } from "zod";
import { getStore } from "../store";
import { asyncHandler, parseBody, nowIso } from "../lib/http";
import type { Inquiry } from "../types";

export const inquiriesRouter = Router();

const PHONE_RE = /^(\+?91[-\s]?|0)?[6-9]\d{9}$/;

const contactSchema = z.object({
  type: z.literal("contact"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const partnerSchema = z.object({
  type: z.literal("partner"),
  orgName: z.string().min(1, "Organisation is required"),
  contact: z.string().min(1, "Contact person is required"),
  designation: z.string().optional(),
  phone: z.string().regex(PHONE_RE, "Valid 10-digit mobile required"),
  email: z.string().email("Valid email required"),
  nature: z.string().min(1, "Nature of partnership is required"),
});

const schema = z.discriminatedUnion("type", [contactSchema, partnerSchema]);

/** CON-01/CON-02/CON-03 — store contact & CSR partner inquiries. */
inquiriesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = parseBody(schema, req.body);
    const inquiry = await getStore().create<Inquiry>("inquiries", {
      ...data,
      status: "new",
      createdAt: nowIso(),
    });
    res.status(201).json({
      id: inquiry.id,
      message: "Thank you — we'll be in touch soon.",
    });
  })
);
