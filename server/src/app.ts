import path from "node:path";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { HttpError } from "./lib/http";
import { contentRouter } from "./routes/content";
import { donationsRouter } from "./routes/donations";
import { volunteersRouter } from "./routes/volunteers";
import { inquiriesRouter } from "./routes/inquiries";
import { subscribersRouter } from "./routes/subscribers";
import { adminRouter } from "./routes/admin";

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow same-origin / server-to-server (no origin) and configured origins.
        if (!origin || config.corsOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(null, config.corsOrigins.includes("*"));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  // Locally-stored gallery uploads (Cloud Storage is used in production).
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", store: config.dataStore, env: config.env });
  });

  // Public API
  app.use("/api/content", contentRouter);
  app.use("/api/donations", donationsRouter);
  app.use("/api/volunteers", volunteersRouter);
  app.use("/api/inquiries", inquiriesRouter);
  app.use("/api/subscribers", subscribersRouter);

  // Admin API
  app.use("/api/admin", adminRouter);

  // 404 for unknown API routes
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Centralised error handler
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
