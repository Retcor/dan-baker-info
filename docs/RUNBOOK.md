# danbaker.info runbook

How the portfolio site is hosted, deployed, rolled back and checked. It runs on **Google Cloud Run**;
the old Kubernetes (GKE) setup and its `deploy/*.yaml` files are retired and gone (no cluster or
static IP remains in the project).

## What runs where

| Thing | Value |
| --- | --- |
| GCP project | `avian-cable-379805` (shared with BakerRang) |
| Cloud Run service | `danbaker-info`, region **`us-west1`** |
| Public URL | `https://danbaker.info` (Cloud Run domain mapping → `danbaker-info`) |
| Direct service URL | `https://danbaker-info-a3pxl65a5q-uw.a.run.app` |
| Image | `gcr.io/avian-cable-379805/danbaker-info` |
| Container | nginx serving the Vite build on port **8080** (`Dockerfile`, `nginx/nginx.conf`); 1 CPU, 128 MiB, unauthenticated |
| Backend | The chatbot calls `https://api.bakerrang.com/chatbot/*` (`SERVER_PREFIX` in `src/App.jsx`). The API only accepts this site because its `CHATBOT_ORIGIN` is `https://danbaker.info` — change both together if the domain ever moves. |

There is no CI/CD for this repo; every deploy is the manual procedure below.

## Prerequisites (once per machine)

```bash
gcloud auth login
gcloud config set project avian-cable-379805
```

For the local-Docker path also run `gcloud auth configure-docker gcr.io` and have Docker running.

## Deploy

1. Check the build locally: `npm ci && npm run build` (optionally `npm run preview`).
2. Pick a tag. Use the short commit SHA so every image maps to a commit:

   ```bash
   TAG=$(git rev-parse --short HEAD)
   ```

3. Build and push the image — **either** in Cloud Build (no local Docker needed):

   ```bash
   gcloud builds submit --tag gcr.io/avian-cable-379805/danbaker-info:$TAG .
   ```

   **or** locally with Docker:

   ```bash
   docker build -t gcr.io/avian-cable-379805/danbaker-info:$TAG .
   docker push gcr.io/avian-cable-379805/danbaker-info:$TAG
   ```

   `.gcloudignore` / `.dockerignore` keep `node_modules`, `dist` and other local files out of the upload
   so the image installs its own Linux dependencies.

4. Roll the service onto it. Only the image changes; every other setting is kept:

   ```bash
   gcloud run deploy danbaker-info \
     --image gcr.io/avian-cable-379805/danbaker-info:$TAG \
     --region us-west1
   ```

   New revisions take 100% of traffic once healthy.

5. Run the checks in [Verify](#verify).

## Verify

```bash
curl -sI https://danbaker.info/ | head -1                # HTTP/2 200
curl -s https://danbaker.info/ | grep -o '<title>.*</title>'   # <title>Dan Baker</title>
curl -sI https://danbaker.info/some/deep/link | head -1  # 200 (SPA fallback in nginx.conf)
```

Then in a browser: the page loads, the Playground links open the BakerRang tools, and the chat
bubble answers a question (proves the `api.bakerrang.com` CORS origin still matches).

## Roll back

Every deploy is a new revision; the old ones stay available.

```bash
gcloud run revisions list --service danbaker-info --region us-west1 --limit 5
gcloud run services update-traffic danbaker-info --region us-west1 \
  --to-revisions <previous-revision-name>=100
```

Pinning traffic to a revision stops new deploys from taking traffic automatically. After the fix is
deployed, hand traffic back to the latest revision:

```bash
gcloud run services update-traffic danbaker-info --region us-west1 --to-latest
```

## Inspect and troubleshoot

```bash
gcloud run services describe danbaker-info --region us-west1
gcloud beta run domain-mappings describe --domain danbaker.info --region us-west1
gcloud run services logs read danbaker-info --region us-west1 --limit 50
```

- **Site 404s on a deep link:** `nginx/nginx.conf` must keep `try_files $uri $uri/ /index.html`.
- **Container fails to start:** nginx must listen on 8080 (Cloud Run's port); check the logs above.
- **Chatbot errors with CORS:** the API's `CHATBOT_ORIGIN` must equal the exact origin the site is
  served from (`https://danbaker.info`, no trailing slash).
- **Certificate or domain problems:** the domain mapping above shows certificate status; DNS for
  `danbaker.info` must point at Cloud Run as the mapping's `resourceRecords` list.

## Local development

```bash
npm i
npm run dev        # http://localhost:3001
```

To try the production container locally: `docker build -t danbaker-info . && docker run -p 8080:8080 danbaker-info`,
then open `http://localhost:8080`.
