# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with React, Vite, and Tailwind CSS. It serves as an interactive resume showcasing Dan Baker's experience, skills, and projects. The site is deployed using Docker, nginx, and Google Cloud Run.

## Development Commands

### Local Development
```bash
npm i                 # Install dependencies
npm run dev           # Start development server (runs on port 3001)
npm run build         # Build production bundle to dist/
npm run preview       # Preview production build locally
```

### Deployment
Google Cloud Run: service `danbaker-info` in **`us-west1`**, project `avian-cable-379805`, image
`us-west1-docker.pkg.dev/avian-cable-379805/danbaker-info/site:<sha>`, domain-mapped to `https://danbaker.info`.
**Merging to `main` deploys automatically** (`.github/workflows/deploy.yml`: keyless GitHub→GCP auth, smoke
check, auto-rollback); PRs run an image build check (`ci.yml`). Procedure, permissions and manual fallback:
`docs/RUNBOOK.md`. Kubernetes/GKE is retired — don't reintroduce `deploy/*.yaml` manifests.

## Architecture

### Build & Deployment Flow
- **Development**: Vite dev server on port 3001
- **Production**: Multi-stage Docker build deployed to Google Cloud Run
  1. Stage 1: Node.js builds the Vite app to `dist/`
  2. Stage 2: nginx serves static files from `dist/`
  3. nginx listens on port 8080 with SPA routing (all routes → index.html)
  4. Image pushed to Artifact Registry `danbaker-info` by the Deploy workflow on merge to `main`
  5. Deployed to the Cloud Run service `danbaker-info` (`us-west1`) with auto-scaling and HTTPS

### Project Structure
```
src/
├── App.jsx              # Main app component, defines page layout and section order
├── main.jsx             # React entry point
├── components/          # React components for each page section
│   ├── Hero.jsx         # Landing section with intro text
│   ├── About.jsx        # About section
│   ├── Experience.jsx   # Work experience timeline
│   ├── Tech.jsx         # Technology stack display
│   ├── Website.jsx      # Website/projects section
│   ├── Navbar.jsx       # Navigation bar
│   └── index.js         # Component exports
├── constants/
│   └── index.js         # Content data (experiences, technologies, nav links)
├── hoc/
│   └── SectionWrapper.jsx  # HOC for section animations with framer-motion
├── styles.js            # Reusable Tailwind style strings
├── utils/
│   └── motion.js        # Framer Motion animation variants
└── assets/              # Images and icons
```

### Key Technologies
- **React 18** with React Router for SPA navigation
- **Vite** for fast builds and HMR
- **Tailwind CSS** with custom theme (see tailwind.config.cjs)
  - Custom colors: primary (#050816), secondary (#aaa6c3), tertiary (#151030)
  - Custom breakpoint: xs (450px)
- **Framer Motion** for scroll animations and transitions
- **React Three Fiber** (THREE.js) for potential 3D components
- **React Vertical Timeline** for experience display

### Component Patterns
- Most page sections are wrapped with `SectionWrapper` HOC from `src/hoc/SectionWrapper.jsx`
- This HOC provides:
  - Framer Motion scroll-triggered animations (staggerContainer)
  - Consistent padding and layout
  - Section ID for navigation anchors
- Content data lives in `src/constants/index.js`, not hardcoded in components
- Components import reusable styles from `src/styles.js`

### Backend
- The chatbot calls the BakerRang API at `SERVER_PREFIX` (`https://api.bakerrang.com`, hard-coded in
  `src/App.jsx`). The API only accepts this site because its `CHATBOT_ORIGIN` is `https://danbaker.info`.

## Styling Conventions
- Uses Tailwind utility classes throughout
- Responsive breakpoints: xs (450px), sm, md, lg, xl (Tailwind defaults)
- Common patterns defined in `src/styles.js` (heroHeadText, heroSubText, sectionHeadText, etc.)
- Color palette defined in tailwind.config.cjs theme.extend.colors

## Deployment Notes
- Production build is served by nginx from `/usr/share/nginx/html`
- nginx config at `nginx/nginx.conf` handles SPA routing with `try_files`
- Docker image exposes port 8080
- Deployed as a Google Cloud Run service (managed, serverless)
- Cloud Run provides:
  - Automatic HTTPS/SSL certificates
  - Auto-scaling (scales to zero when idle)
  - Load balancing
  - Custom domain support via Cloud Run domain mappings
- Procedure: `docs/RUNBOOK.md`
