// Ensure a hermetic test environment before any app module loads config.
process.env.NODE_ENV = "test";
process.env.DATA_STORE = "memory";
process.env.JWT_SECRET = "test-secret";
process.env.RAZORPAY_KEY_SECRET = "test_secret";
process.env.RAZORPAY_KEY_ID = ""; // force deterministic test mode
process.env.SMTP_HOST = ""; // no real email; JSON transport
process.env.SEED_ADMIN_EMAIL = "admin@akshayavidya.org";
process.env.SEED_ADMIN_PASSWORD = "ChangeMe!2025";
