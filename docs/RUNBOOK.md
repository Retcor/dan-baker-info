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
| Image | `us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:<commit-sha>` (Artifact Registry, immutable tags). Images before Nov 2026 are in `gcr.io/avian-cable-379805/danbaker-info`. |
| Container | nginx serving the Vite build on port **8080** (`Dockerfile`, `nginx/nginx.conf`); 1 CPU, 128 MiB, unauthenticated |
| Runs as | `danbaker-info-runtime@…` (no roles: nginx needs none) |
| Backend | The chatbot calls `https://api.bakerrang.com/chatbot/*` (`SERVER_PREFIX` in `src/App.jsx`). The API only accepts this site because its `CHATBOT_ORIGIN` is `https://danbaker.info` — change both together if the domain ever moves. |

## Automatic deploys (normal path)

Merging to `main` deploys. `.github/workflows/deploy.yml` (GitHub environment `production`) runs on
every push to `main`, except docs-only changes (`*.md`, `docs/**`). It:

1. builds the image from the `Dockerfile` and pushes it tagged with the commit SHA;
2. records the live revision, then runs `gcloud run deploy` and sends 100% of traffic to the new revision;
3. polls `https://danbaker.info` until it serves this build's hashed bundle (up to 5 minutes),
   plus a deep-link check;
4. **if anything after the deploy fails, routes traffic back to the revision recorded in step 2.**

The run summary lists the image and the before/after revisions. To redeploy without a code change,
run the workflow by hand: Actions → Deploy → Run workflow (main only).

Pull requests run `.github/workflows/ci.yml`, which builds the production image and checks that it
serves the page and deep links. It needs no cloud access.

### How GitHub gets in (keyless)

| Piece | Value |
| --- | --- |
| Workload Identity provider | `projects/307696703523/locations/global/workloadIdentityPools/github/providers/dan-baker-info`, accepting only repo id `670888001` (`Retcor/dan-baker-info`) on `refs/heads/main` |
| Deployer | `danbaker-info-deployer@avian-cable-379805.iam.gserviceaccount.com`: `run.developer` on the `danbaker-info` service only, `artifactregistry.writer` on the `danbaker-info` repository only, `serviceAccountUser` on the runtime account only |
| GitHub variables | environment `production` (deploys from `main` only): `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `GCP_DEPLOYER_SA`, `GCP_RUNTIME_SA`, `AR_REPOSITORY`, `CLOUD_RUN_SERVICE`, `PUBLIC_URL` |

No keys or secrets are stored in GitHub. The pool `github` is shared with BakerRang, which has its own provider.

## Manual deploy (fallback)

Use this only when GitHub Actions is unavailable.

## Prerequisites (once per machine)

```bash
gcloud auth login
gcloud config set project avian-cable-379805
```

For the local-Docker path also run `gcloud auth configure-docker us-west1-docker.pkg.dev` and have Docker running.

### Steps

1. Check the build locally: `npm ci && npm run build` (optionally `npm run preview`).
2. Pick a tag. Use the full commit SHA, like the workflow does. Tags are immutable: if the workflow
   already pushed this SHA, skip step 3 and deploy that existing image in step 4.

   ```bash
   TAG=$(git rev-parse HEAD)
   ```

3. Build and push the image — **either** in Cloud Build (no local Docker needed):

   ```bash
   gcloud builds submit --tag us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:$TAG .
   ```

   **or** locally with Docker:

   ```bash
   docker build -t us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:$TAG .
   docker push us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:$TAG
   ```

   `.gcloudignore` / `.dockerignore` keep `node_modules`, `dist` and other local files out of the upload
   so the image installs its own Linux dependencies.

4. Roll the service onto it and send it all traffic. Settings other than the image and runtime account are kept:

   ```bash
   gcloud run deploy danbaker-info \
     --image us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:$TAG \
     --region us-west1 \
     --service-account danbaker-info-runtime@avian-cable-379805.iam.gserviceaccount.com
   gcloud run services update-traffic danbaker-info --region us-west1 --to-latest
   ```

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

A rollback pins traffic to that revision. The next deploy from `main` unpins it, because the workflow
sends traffic to the latest revision. To unpin by hand:

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
