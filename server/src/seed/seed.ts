/* Standalone seed script: `npm run seed`. Seeds the configured data store. */
import { getStore } from "../store";
import { config } from "../config";
import { seedAll } from "./seedContent";

async function main() {
  const store = getStore();
  console.log(`Seeding ${config.dataStore} store…`);
  await seedAll(store);
  console.log(
    `✓ Seeded content + super-admin (${config.seedAdmin.email}). ` +
      `Change the password after first login.`
  );
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
