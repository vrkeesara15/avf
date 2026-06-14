import type { Express } from "express";
import request from "supertest";
import { createApp } from "../app";
import { MemoryStore } from "../store/MemoryStore";
import { setStore } from "../store";
import { seedAll } from "../seed/seedContent";
import { config } from "../config";
import { hashPassword } from "../auth/jwt";
import type { AdminUser, Role } from "../types";

export interface TestContext {
  app: Express;
  store: MemoryStore;
}

/** Build an app backed by a fresh, seeded in-memory store. */
export async function makeContext(): Promise<TestContext> {
  const store = new MemoryStore();
  setStore(store);
  await seedAll(store);
  return { app: createApp(), store };
}

/** Log in as the seeded super-admin and return a Bearer token. */
export async function loginAsAdmin(app: Express): Promise<string> {
  const res = await request(app).post("/api/admin/auth/login").send({
    email: config.seedAdmin.email,
    password: config.seedAdmin.password,
  });
  return res.body.token as string;
}

/** Create an admin user with a specific role and return a Bearer token. */
export async function createUserAndLogin(
  app: Express,
  store: MemoryStore,
  role: Role,
  email = `${role}@akshayavidya.org`
): Promise<string> {
  const password = "Passw0rd!";
  await store.create<AdminUser>("adminUsers", {
    email,
    name: role,
    role,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  const res = await request(app)
    .post("/api/admin/auth/login")
    .send({ email, password });
  return res.body.token as string;
}
