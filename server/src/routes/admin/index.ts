import { Router } from "express";
import { requireAuth, requireRole } from "../../auth/middleware";
import { asyncHandler } from "../../lib/http";
import { getStore } from "../../store";
import { adminAuthRouter } from "./auth";
import { adminDonationsRouter } from "./donations";
import { adminVolunteersRouter } from "./volunteers";
import { adminInquiriesRouter } from "./inquiries";
import { adminMetricsRouter } from "./metrics";
import { adminGalleryRouter } from "./gallery";
import { adminContentRouter } from "./content";
import type { AuditEntry } from "../../types";

export const adminRouter = Router();

// Public: login + token check.
adminRouter.use("/auth", adminAuthRouter);

// Everything below requires a valid admin token (ADM-01).
adminRouter.use(requireAuth);

adminRouter.use("/donations", adminDonationsRouter);
adminRouter.use("/volunteers", adminVolunteersRouter);
adminRouter.use("/inquiries", adminInquiriesRouter);
adminRouter.use("/metrics", adminMetricsRouter);
adminRouter.use("/gallery", adminGalleryRouter);
adminRouter.use("/content", adminContentRouter);

// ADM-07 — audit trail (super_admin only; empty roles => super_admin passes).
adminRouter.get(
  "/audit",
  requireRole(),
  asyncHandler(async (_req, res) => {
    res.json(
      await getStore().list<AuditEntry>("audit", {
        orderBy: "createdAt",
        direction: "desc",
      })
    );
  })
);
