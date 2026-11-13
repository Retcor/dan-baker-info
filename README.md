A simple webapp frontend that interfaces with a node backend that acts as a resume in website form

## Local setup

Navigate to root direction where the package.json is located and run `npm i`. Then, run `npm run dev` to start the app using Vite.

## Deploy

The site runs on Google Cloud Run (service `danbaker-info`, `us-west1`, mapped to `https://danbaker.info`).
Merging to `main` deploys automatically through GitHub Actions. The pipeline, rollback and the manual
fallback are in [docs/RUNBOOK.md](docs/RUNBOOK.md).
