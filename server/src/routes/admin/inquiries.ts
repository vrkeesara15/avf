import { Router } from "express";
import { z } from "zod";
import { getStore } from "../../store";
import { asyncHandler, parseBody, HttpError } from "../../lib/http";
import { audit } from "../../lib/audit";
import type { Inquiry } from "../../types";

export const adminInquiriesRouter = Router();

// ADM-08 — contact/inquiry log with status.
adminInquiriesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(
      await getStore().list<Inquiry>("inquiries", {
        orderBy: "createdAt",
        direction: "desc",
      })
    );
  })
);

const patchSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});

adminInquiriesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status } = parseBody(patchSchema, req.body);
    const updated = await getStore().update<Inquiry>(
      "inquiries",
      req.params.id,
      { status }
    );
    if (!updated) throw new HttpError(404, "Inquiry not found");
    await audit(req, "update_inquiry_status", req.params.id);
    res.json(updated);
  })
);
