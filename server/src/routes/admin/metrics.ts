import { Router } from "express";
import { z } from "zod";
import { getStore } from "../../store";
import { asyncHandler, parseBody, HttpError } from "../../lib/http";
import { requireRole } from "../../auth/middleware";
import { audit } from "../../lib/audit";
import type { Metric } from "../../types";

export const adminMetricsRouter = Router();

// ADM-06 / IMP-02 — content editors update impact metric values.
adminMetricsRouter.use(requireRole("content_editor"));

adminMetricsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list<Metric>("metrics", { orderBy: "order" }));
  })
);

const patchSchema = z.object({
  value: z.number().int().nonnegative().optional(),
  label: z.string().min(1).optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

adminMetricsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const patch = parseBody(patchSchema, req.body);
    const updated = await getStore().update<Metric>(
      "metrics",
      req.params.id,
      patch
    );
    if (!updated) throw new HttpError(404, "Metric not found");
    await audit(req, "update_metric", req.params.id);
    res.json(updated);
  })
);
