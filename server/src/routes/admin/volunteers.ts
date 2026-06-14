import { Router } from "express";
import { z } from "zod";
import { getStore } from "../../store";
import { asyncHandler, parseBody, HttpError } from "../../lib/http";
import { audit } from "../../lib/audit";
import type { Volunteer } from "../../types";

export const adminVolunteersRouter = Router();

// ADM-04 — view & manage volunteer registrations.
adminVolunteersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(
      await getStore().list<Volunteer>("volunteers", {
        orderBy: "createdAt",
        direction: "desc",
      })
    );
  })
);

const patchSchema = z.object({
  status: z.enum(["pending", "active", "inactive"]),
});

adminVolunteersRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status } = parseBody(patchSchema, req.body);
    const updated = await getStore().update<Volunteer>(
      "volunteers",
      req.params.id,
      { status }
    );
    if (!updated) throw new HttpError(404, "Volunteer not found");
    await audit(req, "update_volunteer_status", req.params.id);
    res.json(updated);
  })
);
