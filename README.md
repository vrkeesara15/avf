# Akshaya Vidya Foundation — Web Application

A modern, accessible, mobile-first website for **Akshaya Vidya Foundation (AVF)**,
a Hyderabad-based NGO working since 2013 for the education of slum children,
empowerment of women & youth, and community relief.

Built with **React + TypeScript + Vite**, with a full **Vitest + Testing Library**
test suite. The UI implements the brand's blue/orange palette on a warm cream
canvas, with a sticky header, an always-visible Donate CTA, and a structured,
programme-wise information architecture.

## Features

The implementation covers the core functional requirements from the AVF
Web Application Requirements Document (v1.0):

| Area | Highlights |
| --- | --- |
| **Homepage** | Hero with mission tagline + 3 primary CTAs, animated impact counters, programme cards, donation tiers, success-story carousel, testimonials, latest news, partner marquee |
| **Navigation** | Sticky header that compacts on scroll, distinctly-coloured Donate button, responsive hamburger menu, breadcrumbs, back-to-top, auto-updating footer year |
| **Programs** | Listing grouped by category + rich detail pages (overview, key facts, AVLC centre locations, related story & news, Get-Involved CTA) |
| **Donation** | Donation tiers with per-rupee impact, custom amount, recurring options, donor form with **PAN validation**, simulated 80G receipt confirmation, overseas/FCRA page |
| **Volunteer** | Open roles + validated registration form with DPDP-compliant consent |
| **Impact / AVF Stars** | Impact metrics + filterable beneficiary stories + testimonials |
| **Gallery** | Album filter tabs, responsive grid, keyboard-navigable lightbox |
| **News & Events** | Event calendar, category-filtered newsroom, annual reports |
| **Contact** | Inquiry form + CSR "Partner With Us" form, both validated |
| **Accessibility** | Skip link, semantic headings, ARIA labels, visible focus, reduced-motion support |

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/   Reusable UI (Header, Footer, Carousel, ImpactCounter, Field, …)
  pages/        One file per route (Home, Donate, Programs, Gallery, …)
  data/         Content + navigation config (CMS-ready shape)
  lib/          Form hook + validation helpers
  styles/       Design system (global.css) + component styles (components.css)
  test/         Test setup + render helpers
```

## Testing

48 tests across 12 files cover validation logic, the impact counter,
navigation, the donation flow (including PAN validation and the 80G receipt),
volunteer and contact form validation, gallery filtering/lightbox, story and
news filtering, and routing (including the 404 page).

```bash
npm test
```

## Notes

- Payment, email and CMS integrations are represented at the UI layer; in
  production these connect to Razorpay, an SMTP/PDF service, and a headless CMS.
- Content is sourced from a single `src/data/content.ts` module to mirror how a
  CMS would feed the site.
