import type { Request } from "express";
import { getStore } from "../store";
import { nowIso } from "./http";
import type { AuditEntry } from "../types";

/** ADM-07 — record an admin action for the audit trail. */
export async function audit(
  req: Request,
  action: string,
  target?: string
): Promise<void> {
  if (!req.user) return;
  await getStore().create<AuditEntry>("audit", {
    userId: req.user.sub,
    userEmail: req.user.email,
    action,
    target,
    createdAt: nowIso(),
  });
}
