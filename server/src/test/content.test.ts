import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { makeContext } from "./helpers";

let app: Express;
beforeEach(async () => {
  ({ app } = await makeContext());
});

describe("public content API", () => {
  it("reports health and the active store", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", store: "memory" });
  });

  it("lists seeded programmes ordered by `order`", async () => {
    const res = await request(app).get("/api/content/programs");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(8);
    expect(res.body[0].slug).toBe("avlc");
  });

  it("returns a programme by slug", async () => {
    const res = await request(app).get("/api/content/programs/women-empowerment");
    expect(res.status).toBe(200);
    expect(res.body.name).toMatch(/women/i);
  });

  it("404s for an unknown programme slug", async () => {
    const res = await request(app).get("/api/content/programs/nope");
    expect(res.status).toBe(404);
  });

  it("exposes metrics, stories, posts, events, gallery and org info", async () => {
    const [metrics, stories, posts, events, gallery, org] = await Promise.all([
      request(app).get("/api/content/metrics"),
      request(app).get("/api/content/stories"),
      request(app).get("/api/content/posts"),
      request(app).get("/api/content/events"),
      request(app).get("/api/content/gallery"),
      request(app).get("/api/content/org"),
    ]);
    expect(metrics.body.length).toBe(8);
    expect(stories.body.length).toBeGreaterThan(0);
    expect(posts.body.length).toBeGreaterThan(0);
    expect(events.body.length).toBeGreaterThan(0);
    expect(gallery.body.length).toBeGreaterThan(0);
    expect(org.body.reg80G).toBeTruthy();
  });
});
