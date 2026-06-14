import type { Store } from "../store/Store";
import { hashPassword } from "../auth/jwt";
import { config } from "../config";
import type { AdminUser } from "../types";
import {
  seedMetrics,
  seedPrograms,
  seedStories,
  seedTestimonials,
  seedPosts,
  seedEvents,
  seedGallery,
} from "./data";

/** Populate content collections with known ids (idempotent). */
export async function seedContent(store: Store): Promise<void> {
  const sets: [Parameters<Store["create"]>[0], { id: string }[]][] = [
    ["metrics", seedMetrics],
    ["programs", seedPrograms],
    ["stories", seedStories],
    ["testimonials", seedTestimonials],
    ["posts", seedPosts],
    ["events", seedEvents],
    ["gallery", seedGallery],
  ];
  for (const [collection, items] of sets) {
    for (const item of items) {
      await store.create(collection, item as never);
    }
  }
}

/** Create the seeded super-admin if it does not already exist. */
export async function seedAdmin(store: Store): Promise<AdminUser> {
  const existing = await store.query<AdminUser>(
    "adminUsers",
    "email",
    "==",
    config.seedAdmin.email
  );
  if (existing.length) return existing[0];

  return store.create<AdminUser>("adminUsers", {
    email: config.seedAdmin.email,
    name: "Super Admin",
    role: "super_admin",
    passwordHash: await hashPassword(config.seedAdmin.password),
    createdAt: new Date().toISOString(),
  });
}

export async function seedAll(store: Store): Promise<void> {
  await seedContent(store);
  await seedAdmin(store);
}
