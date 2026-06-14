import { createApp } from "./app";
import { config } from "./config";
import { getStore } from "./store";
import { seedAll } from "./seed/seedContent";

async function main() {
  // For the in-memory store (local dev without GCP), seed content on startup
  // so the site has data. Firestore is seeded once via `npm run seed`.
  if (config.dataStore === "memory") {
    await seedAll(getStore());
    console.log("Seeded in-memory store with content + super-admin.");
  }

  const app = createApp();
  app.listen(config.port, () => {
    console.log(
      `AVF API listening on :${config.port} ` +
        `(store=${config.dataStore}, env=${config.env})`
    );
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
