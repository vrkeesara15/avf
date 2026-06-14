import dotenv from "dotenv";

dotenv.config();

const bool = (v: string | undefined, def = false) =>
  v === undefined ? def : ["1", "true", "yes", "on"].includes(v.toLowerCase());

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 8080),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  dataStore: (process.env.DATA_STORE ?? "memory") as "memory" | "firestore",

  gcp: {
    projectId: process.env.GCP_PROJECT_ID ?? "avf-foundation",
    firestoreEmulator: process.env.FIRESTORE_EMULATOR_HOST ?? "",
    gcsBucket: process.env.GCS_BUCKET ?? "",
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-insecure-secret",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },

  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@akshayavidya.org",
    password: process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2025",
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? "test_secret",
    // When no real key id is configured we run in deterministic test mode.
    get testMode() {
      return !process.env.RAZORPAY_KEY_ID;
    },
  },

  mail: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from:
      process.env.MAIL_FROM ??
      "Akshaya Vidya Foundation <no-reply@akshayavidya.org>",
    get enabled() {
      return !!process.env.SMTP_HOST;
    },
  },

  isProd: bool(process.env.NODE_ENV === "production" ? "true" : undefined),
};

export type Config = typeof config;
