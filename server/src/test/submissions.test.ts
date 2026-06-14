import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { makeContext } from "./helpers";
import type { MemoryStore } from "../store/MemoryStore";
import type { Inquiry, Volunteer } from "../types";

let app: Express;
let store: MemoryStore;
beforeEach(async () => {
  ({ app, store } = await makeContext());
});

describe("volunteer registration", () => {
  it("accepts a valid registration and persists it (VOL-01)", async () => {
    const res = await request(app).post("/api/volunteers").send({
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876543210",
      city: "Hyderabad",
      interest: "Teaching / Tutoring",
      consent: true,
    });
    expect(res.status).toBe(201);
    const all = await store.list<Volunteer>("volunteers");
    expect(all).toHaveLength(1);
    expect(all[0].status).toBe("pending");
  });

  it("rejects an invalid phone number", async () => {
    const res = await request(app).post("/api/volunteers").send({
      name: "Ravi",
      email: "ravi@example.com",
      phone: "123",
      city: "Hyderabad",
      interest: "Events",
    });
    expect(res.status).toBe(400);
  });
});

describe("inquiries", () => {
  it("stores a contact inquiry (CON-01)", async () => {
    const res = await request(app).post("/api/inquiries").send({
      type: "contact",
      name: "Sita",
      email: "sita@example.com",
      subject: "Hello",
      message: "Great work!",
    });
    expect(res.status).toBe(201);
    const all = await store.list<Inquiry>("inquiries");
    expect(all[0].type).toBe("contact");
    expect(all[0].status).toBe("new");
  });

  it("stores a CSR partner inquiry (CON-03)", async () => {
    const res = await request(app).post("/api/inquiries").send({
      type: "partner",
      orgName: "Tech Corp",
      contact: "Meera",
      phone: "9876543210",
      email: "csr@techcorp.com",
      nature: "Fund a centre",
    });
    expect(res.status).toBe(201);
  });

  it("rejects an inquiry with a missing type", async () => {
    const res = await request(app)
      .post("/api/inquiries")
      .send({ name: "x", email: "x@y.com" });
    expect(res.status).toBe(400);
  });
});

describe("newsletter subscribers", () => {
  it("subscribes a new email and dedupes repeats (NEWS-06)", async () => {
    const first = await request(app)
      .post("/api/subscribers")
      .send({ email: "fan@example.com" });
    expect(first.status).toBe(201);
    const second = await request(app)
      .post("/api/subscribers")
      .send({ email: "fan@example.com" });
    expect(second.status).toBe(200);
  });
});
