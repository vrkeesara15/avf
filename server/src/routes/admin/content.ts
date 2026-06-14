import { Router } from "express";
import { getStore } from "../../store";
import { asyncHandler, HttpError, nowIso } from "../../lib/http";
import { requireRole } from "../../auth/middleware";
import { audit } from "../../lib/audit";
import type { CollectionName } from "../../types";

/**
 * ADM-02 — generic content CRUD for a collection, restricted to content
 * editors. Used for news posts, AVF Stars, events, testimonials, programs.
 */
function crudRouter(collection: CollectionName): Router {
  const router = Router();
  router.use(requireRole("content_editor"));

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json(await getStore().list(collection));
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const created = await getStore().create(collection, {
        ...body,
        createdAt: body.createdAt ?? nowIso(),
      } as never);
      await audit(req, `create_${collection}`, (created as { id: string }).id);
      res.status(201).json(created);
    })
  );

  router.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const updated = await getStore().update(
        collection,
        req.params.id,
        (req.body ?? {}) as never
      );
      if (!updated) throw new HttpError(404, "Not found");
      await audit(req, `update_${collection}`, req.params.id);
      res.json(updated);
    })
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const ok = await getStore().remove(collection, req.params.id);
      if (!ok) throw new HttpError(404, "Not found");
      await audit(req, `delete_${collection}`, req.params.id);
      res.status(204).end();
    })
  );

  return router;
}

export const adminContentRouter = Router();
adminContentRouter.use("/posts", crudRouter("posts"));
adminContentRouter.use("/stories", crudRouter("stories"));
adminContentRouter.use("/events", crudRouter("events"));
adminContentRouter.use("/testimonials", crudRouter("testimonials"));
adminContentRouter.use("/programs", crudRouter("programs"));
