import { Router } from "express";
import { z } from "zod";
import { getStore } from "../store";
import { asyncHandler, parseBody, nowIso } from "../lib/http";
import { sendVolunteerAck } from "../services/email";
import type { Volunteer } from "../types";

export const volunteersRouter = Router();

const PHONE_RE = /^(\+?91[-\s]?|0)?[6-9]\d{9}$/;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(PHONE_RE, "Valid 10-digit mobile required"),
  city: z.string().min(1, "City is required"),
  profession: z.string().optional(),
  availability: z.string().optional(),
  interest: z.string().min(1, "Area of interest is required"),
  consent: z.boolean().optional(),
});

/** VOL-01/VOL-02 — register a volunteer and send an acknowledgement. */
volunteersRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = parseBody(schema, req.body);
    const volunteer = await getStore().create<Volunteer>("volunteers", {
      ...data,
      consent: data.consent ?? false,
      status: "pending",
      createdAt: nowIso(),
    });

    try {
      await sendVolunteerAck(volunteer.email, volunteer.name);
    } catch (err) {
      console.error("Volunteer ack email failed:", err);
    }

    res.status(201).json({
      id: volunteer.id,
      message: "Registration received — check your email for confirmation.",
    });
  })
);
