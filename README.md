# Akshaya Vidya Foundation — Web Application

A modern, accessible, mobile-first **full-stack** web application for
**Akshaya Vidya Foundation (AVF)**, a Hyderabad-based NGO working since 2013 for
the education of slum children, empowerment of women & youth, and community
relief.

- **Frontend** — React + TypeScript (Vite): public site **and** an admin panel.
- **Backend** — Node + Express + TypeScript on **Cloud Run**, **Firestore** for
  data, **Cloud Storage** for uploads, **Secret Manager** for keys.
- **Hosting** — Firebase Hosting (CDN) for the SPA, rewriting `/api/**` to
  Cloud Run. Region `asia-south1` (Mumbai) for data localisation.

See **[DEPLOY.md](./DEPLOY.md)** for the full GCP deployment guide.

## Features

| Area | Highlights |
| --- | --- |
| **Homepage** | Hero + mission tagline, 3 CTAs, animated impact counters, programme cards, donation tiers, success-story carousel, testimonials, latest news, partner marquee |
| **Navigation** | Sticky compacting header, always-visible Donate button, responsive drawer, breadcrumbs, back-to-top, auto-year footer |
| **Programs** | Category listing + rich detail pages (overview, key facts, AVLC locations, related story/news, CTAs) |
| **Donation** | Razorpay order/verify flow, tiers + custom amount, recurring options, **PAN-validated** donor form, server-generated **80G PDF receipt** emailed on success, overseas/FCRA page |
| **Volunteer / Contact** | Validated registration + contact + CSR partner forms persisted to the backend with acknowledgement emails |
| **Impact / AVF Stars** | Live impact metrics + filterable beneficiary stories + testimonials |
| **Gallery / News** | Album filter + lightbox; event calendar, category-filtered newsroom, annual reports |
| **Admin panel** (`/admin`) | JWT login with **RBAC** (super-admin, content editor, donation viewer, gallery manager); dashboard, donations + CSV export, volunteer & inquiry management, impact-metric editor, news publishing, audit log |
| **Accessibility** | Skip link, semantic headings, ARIA, visible focus, reduced-motion |
| **Compliance** | 80G receipts, FCRA disclosures, DPDP consent, server-side validation, login rate-limiting |

## Repository layout

```
avf/
├── src/                 # React app (public site + /admin panel)
│   ├── components/  pages/  data/  lib/  admin/  styles/  test/
├── server/              # Express + TypeScript API
│   └── src/
│       ├── routes/      # public + /admin endpoints
│       ├── store/       # swappable data layer (Firestore | in-memory)
│       ├── services/    # razorpay, receipt (PDF), email, storage
│       ├── auth/  lib/  seed/  test/
│   └── Dockerfile
├── cloudbuild.yaml      # build → push → deploy API to Cloud Run
├── firebase.json        # Hosting (SPA) + /api rewrite to Cloud Run
├── firestore.rules      # client access denied (all access via Admin SDK)
├── deploy/setup-gcp.sh  # one-time GCP project setup
└── DEPLOY.md
```

## Quick start (local)

```bash
# 1. API — in-memory store, deterministic Razorpay test mode (no GCP needed)
cd server && cp .env.example .env && npm install && npm run dev   # :8080

# 2. Frontend — proxies /api → :8080
cd .. && npm install && npm run dev                               # :5173
```

Open http://localhost:5173. The site seeds itself with content and a
super-admin (`admin@akshayavidya.org` / `ChangeMe!2025`) — sign in at
http://localhost:5173/admin/login.

## Testing

```bash
npm test                  # frontend — 52 tests (Vitest + Testing Library)
npm --prefix server test  # backend  — 29 tests (Vitest + supertest)
```

## Notes

- Without `RAZORPAY_KEY_ID`, the donation flow runs in **test mode** end-to-end
  (no real charges). Set the Razorpay secrets to go live.
- Without `SMTP_HOST`, receipt/ack emails are logged instead of sent.
- The requirements document is intentionally git-ignored.
