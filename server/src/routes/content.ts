import { Router } from "express";
import { getStore } from "../store";
import { asyncHandler, HttpError } from "../lib/http";
import type { Program, Metric } from "../types";

export const orgInfo = {
  name: "Akshaya Vidya Foundation",
  shortName: "AVF",
  tagline: "Educate · Empower · Uplift",
  founded: 2013,
  city: "Hyderabad",
  email: "info@akshayavidya.org",
  altEmail: "donate@akshayavidya.org",
  phone: "+91 90000 12345",
  address: "Nandanavanam, LB Nagar, Hyderabad, Telangana 500074, India",
  regNumber: "TS/2013/0042178",
  reg80G: "AAATA1234F20214",
  fcra: "010230456",
  cin: "U85300TG2013NPL089123",
};

export const partners = [
  "Hyderabad Police",
  "Govt. of Telangana",
  "Tech Corp CSR",
  "Rotary Hyderabad",
  "Diaspora Donors (USA)",
  "Local Schools Network",
];

export const contentRouter = Router();

contentRouter.get(
  "/org",
  asyncHandler(async (_req, res) => {
    res.json(orgInfo);
  })
);

contentRouter.get(
  "/partners",
  asyncHandler(async (_req, res) => {
    res.json(partners);
  })
);

contentRouter.get(
  "/metrics",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list<Metric>("metrics", { orderBy: "order" }));
  })
);

contentRouter.get(
  "/programs",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list<Program>("programs", { orderBy: "order" }));
  })
);

contentRouter.get(
  "/programs/:slug",
  asyncHandler(async (req, res) => {
    const matches = await getStore().query<Program>(
      "programs",
      "slug",
      "==",
      req.params.slug
    );
    if (!matches.length) throw new HttpError(404, "Programme not found");
    res.json(matches[0]);
  })
);

contentRouter.get(
  "/stories",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list("stories"));
  })
);

contentRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list("testimonials"));
  })
);

contentRouter.get(
  "/posts",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list("posts"));
  })
);

contentRouter.get(
  "/events",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list("events"));
  })
);

contentRouter.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    res.json(await getStore().list("gallery"));
  })
);
