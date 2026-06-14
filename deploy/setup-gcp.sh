#!/usr/bin/env bash
# One-time GCP project setup for the AVF web application.
# Creates all infrastructure AND grants the IAM the build/runtime need.
#
# Usage: PROJECT_ID=avf-foundation REGION=asia-south1 ./deploy/setup-gcp.sh
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?set PROJECT_ID}"
REGION="${REGION:-asia-south1}"   # Mumbai — data localisation (§8.4)
REPO="${REPO:-avf}"
BUCKET="${PROJECT_ID}-gallery"

echo "▶ Using project $PROJECT_ID in $REGION"
gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "▶ Enabling required APIs…"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com

echo "▶ Creating Firestore (Native mode) — skip if it already exists…"
gcloud firestore databases create --location="$REGION" 2>/dev/null || true

echo "▶ Creating Artifact Registry repo…"
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker --location="$REGION" 2>/dev/null || true

echo "▶ Creating Cloud Storage bucket for gallery uploads…"
gcloud storage buckets create "gs://$BUCKET" --location="$REGION" 2>/dev/null || true

echo "▶ Granting Cloud Build permission to deploy to Cloud Run…"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$CLOUDBUILD_SA" --role=roles/run.admin --condition=None -q
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$CLOUDBUILD_SA" --role=roles/artifactregistry.writer --condition=None -q
gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --member="serviceAccount:$CLOUDBUILD_SA" --role=roles/iam.serviceAccountUser -q

echo "▶ Granting the Cloud Run runtime SA access to Firestore + Storage…"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$RUNTIME_SA" --role=roles/datastore.user --condition=None -q
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$RUNTIME_SA" --role=roles/storage.objectAdmin -q

echo "▶ Creating secrets (+ initial versions so deploys resolve :latest)…"
# Optional secrets get an empty initial version → the API runs in donation
# test mode with email logging until you supply real values. avf-jwt-secret
# gets a strong random default so auth is secure out of the box.
create_secret () {
  local name="$1" default="${2:-}"
  if ! gcloud secrets describe "$name" >/dev/null 2>&1; then
    gcloud secrets create "$name" --replication-policy=automatic
  fi
  gcloud secrets add-iam-policy-binding "$name" \
    --member="serviceAccount:$RUNTIME_SA" \
    --role=roles/secretmanager.secretAccessor -q >/dev/null
  # Seed an initial version only if the secret has none yet.
  if ! gcloud secrets versions list "$name" --limit=1 --format='value(name)' | grep -q .; then
    printf '%s' "$default" | gcloud secrets versions add "$name" --data-file=- >/dev/null
  fi
}
create_secret avf-jwt-secret "$(openssl rand -hex 32)"
for s in avf-razorpay-key-id avf-razorpay-key-secret \
         avf-smtp-host avf-smtp-user avf-smtp-pass; do
  create_secret "$s" ""
done

echo ""
echo "✓ Infrastructure + IAM ready. Next steps:"
echo "  1. Add secret values (see the 'add a value' lines above)."
echo "     A good JWT secret:  printf '%s' \"\$(openssl rand -hex 32)\" | gcloud secrets versions add avf-jwt-secret --data-file=-"
echo "  2. Deploy the API:   gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION,_REPO=$REPO"
echo "  3. Seed Firestore:   cd server && DATA_STORE=firestore GCP_PROJECT_ID=$PROJECT_ID npm run seed"
echo "  4. Deploy frontend:  firebase login && npm run build && firebase deploy --only hosting,firestore:rules"
