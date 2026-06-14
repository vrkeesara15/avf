import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Storage } from "@google-cloud/storage";
import { config } from "../config";

const LOCAL_DIR = path.join(process.cwd(), "uploads");
let storage: Storage | null = null;

/**
 * Persist an uploaded file. Uses Cloud Storage when GCS_BUCKET is configured
 * (GAL-05), otherwise falls back to local disk for development.
 * Returns a public URL/path to the stored object.
 */
export async function saveUpload(
  buffer: Buffer,
  originalName: string,
  mimetype: string
): Promise<string> {
  const ext = path.extname(originalName) || "";
  const key = `gallery/${randomUUID()}${ext}`;

  if (config.gcp.gcsBucket) {
    if (!storage) storage = new Storage({ projectId: config.gcp.projectId });
    const bucket = storage.bucket(config.gcp.gcsBucket);
    const file = bucket.file(key);
    await file.save(buffer, { contentType: mimetype, resumable: false });
    return `https://storage.googleapis.com/${config.gcp.gcsBucket}/${key}`;
  }

  await fs.mkdir(path.join(LOCAL_DIR, "gallery"), { recursive: true });
  const dest = path.join(LOCAL_DIR, key);
  await fs.writeFile(dest, buffer);
  return `/uploads/${key}`;
}
