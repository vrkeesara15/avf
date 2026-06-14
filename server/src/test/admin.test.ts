import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import {
  makeContext,
  loginAsAdmin,
  createUserAndLogin,
} from "./helpers";
import type { MemoryStore } from "../store/MemoryStore";

let app: Express;
let store: MemoryStore;
beforeEach(async () => {
  ({ app, store } = await makeContext());
});

describe("admin auth", () => {
  it("logs in the seeded super-admin", async () => {
    const res = await request(app).post("/api/admin/auth/login").send({
      email: "admin@akshayavidya.org",
      password: "ChangeMe!2025",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.role).toBe("super_admin");
  });

  it("rejects a wrong password", async () => {
    const res = await request(app).post("/api/admin/auth/login").send({
      email: "admin@akshayavidya.org",
      password: "wrong",
    });
    expect(res.status).toBe(401);
  });

  it("returns the current user from /me with a token", async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .get("/api/admin/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("admin@akshayavidya.org");
  });
});

describe("admin authorization (RBAC)", () => {
  it("blocks unauthenticated access to admin endpoints", async () => {
    const res = await request(app).get("/api/admin/donations");
    expect(res.status).toBe(401);
  });

  it("lets a donation_viewer read donations", async () => {
    const token = await createUserAndLogin(app, store, "donation_viewer");
    const res = await request(app)
      .get("/api/admin/donations")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("forbids a donation_viewer from editing content", async () => {
    const token = await createUserAndLogin(app, store, "donation_viewer");
    const res = await request(app)
      .post("/api/admin/content/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x" });
    expect(res.status).toBe(403);
  });

  it("lets a content_editor update an impact metric (ADM-06)", async () => {
    const token = await createUserAndLogin(app, store, "content_editor");
    const res = await request(app)
      .patch("/api/admin/metrics/children")
      .set("Authorization", `Bearer ${token}`)
      .send({ value: 9000 });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe(9000);

    // reflected on the public endpoint (IMP-02)
    const pub = await request(app).get("/api/content/metrics");
    const m = pub.body.find((x: { id: string }) => x.id === "children");
    expect(m.value).toBe(9000);
  });
});

describe("admin operations", () => {
  it("exports donations as CSV (ADM-03)", async () => {
    const token = await loginAsAdmin(app);
    const res = await request(app)
      .get("/api/admin/donations/export.csv")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.text).toContain("Receipt No");
  });

  it("updates a volunteer's status (ADM-04)", async () => {
    const token = await loginAsAdmin(app);
    await request(app).post("/api/volunteers").send({
      name: "Ravi",
      email: "ravi@example.com",
      phone: "9876543210",
      city: "Hyderabad",
      interest: "Events",
    });
    const list = await request(app)
      .get("/api/admin/volunteers")
      .set("Authorization", `Bearer ${token}`);
    const id = list.body[0].id;
    const res = await request(app)
      .patch(`/api/admin/volunteers/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "active" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("active");
  });

  it("creates and deletes a news post (ADM-02)", async () => {
    const token = await loginAsAdmin(app);
    const created = await request(app)
      .post("/api/admin/content/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New milestone",
        category: "News",
        date: "14/06/2026",
        excerpt: "Big news",
        icon: "📰",
        color: "#1b4f8a",
      });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const del = await request(app)
      .delete(`/api/admin/content/posts/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  it("records actions in the audit trail (ADM-07)", async () => {
    const token = await loginAsAdmin(app);
    await request(app)
      .patch("/api/admin/metrics/children")
      .set("Authorization", `Bearer ${token}`)
      .send({ value: 8600 });
    const res = await request(app)
      .get("/api/admin/audit")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].action).toBe("update_metric");
  });
});
