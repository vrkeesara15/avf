# Deploying Akshaya Vidya Foundation to GCP

Architecture:

```
                      ┌─────────────────────────────┐
   Browser  ─────────▶│  Firebase Hosting (CDN)     │  ← React SPA (public + /admin)
                      │   /api/**  ──rewrite──┐      │
                      └───────────────────────┼──────┘
                                              ▼
                                  ┌───────────────────────┐
                                  │  Cloud Run: avf-api    │  ← Node/Express container
                                  │   ├─ Firestore (data)  │
                                  │   ├─ Cloud Storage     │  (gallery uploads)
                                  │   └─ Secret Manager    │  (JWT, Razorpay, SMTP)
                                  └───────────────────────┘
```

- **Region:** `asia-south1` (Mumbai) for data localisation (requirements §8.4).
- **Data:** Firestore (Native mode).
- **Secrets:** Secret Manager — no keys in the repo.

---

## 1. One-time setup

Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install) and
[Firebase CLI](https://firebase.google.com/docs/cli), then:

```bash
gcloud auth login
PROJECT_ID=avf-foundation REGION=asia-south1 ./deploy/setup-gcp.sh
```

This enables APIs and creates Firestore, the Artifact Registry repo, the
gallery bucket, and the secret placeholders. Add secret values:

```bash
printf '%s' "$(openssl rand -hex 32)" | gcloud secrets versions add avf-jwt-secret --data-file=-
printf '%s' "rzp_live_xxx"            | gcloud secrets versions add avf-razorpay-key-id --data-file=-
printf '%s' "your_razorpay_secret"    | gcloud secrets versions add avf-razorpay-key-secret --data-file=-
printf '%s' "smtp.yourhost.com"       | gcloud secrets versions add avf-smtp-host --data-file=-
printf '%s' "smtp-user"               | gcloud secrets versions add avf-smtp-user --data-file=-
printf '%s' "smtp-pass"               | gcloud secrets versions add avf-smtp-pass --data-file=-
```

Grant the Cloud Run runtime service account access to the secrets, Firestore,
and the bucket (the default compute SA usually already has Firestore/Storage):

```bash
SA="$(gcloud iam service-accounts list --filter='displayName:Default compute' --format='value(email)')"
for s in avf-jwt-secret avf-razorpay-key-id avf-razorpay-key-secret avf-smtp-host avf-smtp-user avf-smtp-pass; do
  gcloud secrets add-iam-policy-binding "$s" --member="serviceAccount:$SA" --role=roles/secretmanager.secretAccessor
done
```

## 2. Deploy the API (Cloud Run)

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_REGION=asia-south1,_REPO=avf,_SERVICE=avf-api
```

Then seed Firestore once (content + super-admin). Run locally pointed at the
cloud project (uses your gcloud credentials):

```bash
cd server
DATA_STORE=firestore GCP_PROJECT_ID=avf-foundation \
  SEED_ADMIN_EMAIL=admin@akshayavidya.org SEED_ADMIN_PASSWORD='<strong-pw>' \
  npm run seed
```

## 3. Deploy the frontend (Firebase Hosting)

Edit `.firebaserc` to your Firebase project id, then:

```bash
npm install
npm run build
firebase deploy --only hosting,firestore:rules
```

The `firebase.json` rewrite sends `/api/**` to the `avf-api` Cloud Run service,
so the SPA uses same-origin requests (no CORS in production).

## 4. Verify

```bash
curl https://<your-site>.web.app/api/health
# → {"status":"ok","store":"firestore","env":"production"}
```

Visit `/admin/login` and sign in with the seeded super-admin.

---

## Local development

Two terminals:

```bash
# API (in-memory store, deterministic Razorpay test mode, no GCP needed)
cd server && cp .env.example .env && npm install && npm run dev

# Frontend (proxies /api → http://localhost:8080)
npm install && npm run dev
```

Run against the Firestore emulator instead of in-memory:

```bash
gcloud emulators firestore start --host-port=localhost:8081
# in server/.env:  DATA_STORE=firestore  FIRESTORE_EMULATOR_HOST=localhost:8081
cd server && npm run seed && npm run dev
```

## Tests

```bash
npm test            # client (Vitest + Testing Library)
npm --prefix server test   # backend (Vitest + supertest, in-memory store)
```

## Notes

- **Payments:** with no `RAZORPAY_KEY_ID` the API runs in deterministic test
  mode (no real charges) so the full donate flow works end-to-end. Set the
  Razorpay secrets to go live.
- **Email:** with no `SMTP_HOST` the API logs receipts instead of sending them.
- **80G receipts** are generated server-side with PDFKit and emailed on
  successful payment.
