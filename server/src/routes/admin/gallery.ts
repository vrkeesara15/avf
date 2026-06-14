import { Router } from "express";
import multer from "multer";
import { getStore } from "../../store";
import { asyncHandler, HttpError, nowIso } from "../../lib/http";
import { requireRole } from "../../auth/middleware";
import { saveUpload } from "../../services/storage";
import { audit } from "../../lib/audit";
import type { Photo } from "../../types";

export const adminGalleryRouter = Router();

// GAL-05 / GAL-06 — gallery_manager uploads & manages images.
adminGalleryRouter.use(requireRole("gallery_manager"));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB pre-compression cap
});

adminGalleryRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list<Photo>("gallery"));
  })
);

adminGalleryRouter.post(
  "/",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const body = req.body as Record<string, string>;
    let url: string | undefined;
    if (req.file) {
      url = await saveUpload(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }
    const photo = await getStore().create<Photo>("gallery", {
      album: body.album ?? "Community Programs",
      caption: body.caption ?? "Untitled",
      detail: body.detail ?? "",
      icon: body.icon ?? "📷",
      color: body.color ?? "#1b4f8a",
      url,
      createdAt: nowIso(),
    } as never);
    await audit(req, "upload_gallery_image", photo.id);
    res.status(201).json(photo);
  })
);

adminGalleryRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const ok = await getStore().remove("gallery", req.params.id);
    if (!ok) throw new HttpError(404, "Image not found");
    await audit(req, "delete_gallery_image", req.params.id);
    res.status(204).end();
  })
);
