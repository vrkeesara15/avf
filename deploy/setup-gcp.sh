#!/usr/bin/env bash
# One-time GCP project setup for the AVF web application.
# Usage: PROJECT_ID=avf-foundation REGION=asia-south1 ./deploy/setup-gcp.sh
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?set PROJECT_ID}"
REGION="${REGION:-asia-south1}"   # Mumbai — data localisation (§8.4)
REPO="${REPO:-avf}"
BUCKET="${PROJECT_ID}-gallery"

echo "▶ Using project $PROJECT_ID in $REGION"
gcloud config set project "$PROJECT_ID"

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

echo "▶ Creating secrets (you will be prompted to enter values)…"
create_secret () {
  local name="$1"
  if ! gcloud secrets describe "$name" >/dev/null 2>&1; then
    gcloud secrets create "$name" --replication-policy=automatic
  fi
  echo "   → add a version for $name:  echo -n '<value>' | gcloud secrets versions add $name --data-file=-"
}
for s in avf-jwt-secret avf-razorpay-key-id avf-razorpay-key-secret \
         avf-smtp-host avf-smtp-user avf-smtp-pass; do
  create_secret "$s"
done

echo "✓ Setup complete. Next:"
echo "  1. Add secret values (see the lines above)."
echo "  2. Deploy the API:   gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=$REGION,_REPO=$REPO"
echo "  3. Seed Firestore:   (run once) DATA_STORE=firestore GCP_PROJECT_ID=$PROJECT_ID npm --prefix server run seed"
echo "  4. Deploy frontend:  npm run build && firebase deploy --only hosting"
