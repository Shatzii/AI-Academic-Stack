# Deploying the Backend to Render.com (Django) — Go4it Sports Academy

This guide walks you through moving the Django backend from Railway to Render.com. The frontend remains on Netlify; only the backend hosting changes.

## Overview

- Backend: Django + DRF on Render.com
- Frontend: Vite + React on Netlify (proxy to new Render backend)
- Database: Render Managed Postgres (or keep existing Postgres if you prefer)
- Monorepo layout: service root is `School/` with Django app under `School/backend/`

## Prerequisites

- GitHub repository connected (this repo)
- Render.com account
- Optional: Existing Postgres data you may want to migrate

## Option A — Native Render Python service (recommended, no Docker)

Render can build and run Django without Docker. Because this is a monorepo, we’ll set the service Root Directory to `School` and run all commands against `backend/`.

1. Create the web service

- On Render: New → Web Service → Connect your GitHub repo
- Root Directory: `School`
- Environment: `Python 3` (Render detects from requirements.txt)
- Region: closest to your users

1. Build and start commands

- Build Command:

  ```bash
  pip install -r requirements.txt
  ```

- Post-deploy Command (runs after each deploy):

  ```bash
  python backend/manage.py migrate --noinput && \
  python backend/manage.py collectstatic --noinput
  ```

- Start Command:

  ```bash
  gunicorn config.wsgi:application --chdir backend --bind 0.0.0.0:$PORT --workers 3
  ```

1. Environment variables (Settings → Environment)

Add the following (copy and adjust values):

- `DEBUG=False`
- `ENVIRONMENT=production`
- `DJANGO_SETTINGS_MODULE=config.settings`
- `SECRET_KEY`=[long random]
- `JWT_SECRET_KEY`=[long random]
- `ALLOWED_HOSTS=<your-service>.onrender.com`
- `FRONTEND_URL=https://go4itacademy.netlify.app`
- `CORS_ALLOWED_ORIGINS=https://go4itacademy.netlify.app`
- `CSRF_TRUSTED_ORIGINS=https://go4itacademy.netlify.app`
- `DATABASE_URL`= (set after creating DB below)
  
Recommended (to avoid credential errors):

- `USE_AWS_SECRETS=false`  ← disables AWS Secrets Manager fetch. Provide secrets directly via env vars.

Optional (only if you intend to use AWS Secrets Manager and have IAM creds configured on Render):

- `USE_AWS_SECRETS=true`
- `AWS_SECRET_NAME=openedtex/production/secrets` (or your secret path)
- `AWS_REGION=us-east-1` (or your region)

1. Database (Render Managed Postgres)

- On Render: New → PostgreSQL → Create Database
- Copy the Internal Connection string (preferred) or External if needed
- In your Web Service → Environment, set `DATABASE_URL` to that connection string

Notes:

- If your Django settings require SSL for Postgres, append `?sslmode=require` as needed. Render’s internal connection usually doesn’t require SSL.
- If migrating data from Railway Postgres, use `pg_dump`/`pg_restore` to move the data.

1. Health check (optional but recommended)

- In Render Web Service → Settings → Health Checks:
  - Path: `/health/`
  - Expect: HTTP 200

1. Deploy and verify

- Trigger a deploy (first deploy runs build/post-deploy)
- Verify:
  - Open: `https://<your-service>.onrender.com/health/` → 200 JSON
  - Open: `https://<your-service>.onrender.com/api/courses/` → 401 JSON (expected unauthorized)

## Option B — Docker on Render (uses the existing Dockerfile)

If you prefer Docker, Render can build from `School/Dockerfile`.

1. Create a new Web Service

- New → Web Service → From GitHub repo
- Environment: `Docker`
- Root Directory: repository root (leave blank)
- Dockerfile Path: `School/Dockerfile`

1. Environment variables

Same as in Option A; ensure `ALLOWED_HOSTS` includes your Render domain and `DATABASE_URL` is set.

1. Health check and deploy

- Add `/health/` as Health Check Path
- Deploy and verify the same endpoints as above

## Update Netlify to point to Render

Your Netlify site proxies `/api/*` to the backend. Update it to use the Render domain.

- In `School/netlify.toml`, update the redirect target from Railway to your Render domain. Example:

  ```toml
  [[redirects]]
  from = "/api/*"
  to = "https://<your-service>.onrender.com/api/:splat"
  status = 200
  force = true
  ```

- Commit and redeploy Netlify, or update via the Netlify UI if you manage redirects there
- Validate: `https://go4itacademy.netlify.app/api/health/` → 200 JSON

## Static files note

- This project collects static files during deploy. For Django to serve static files in production, ensure WhiteNoise is enabled in `MIDDLEWARE` and `STATIC_ROOT` is configured. If not using WhiteNoise, consider serving static assets via a CDN or a separate static host.

## Cutover checklist

- Render Web Service green, `/health/` returns 200
- DB migrations succeeded
- Netlify proxy updated to Render domain and returning 200 for `/api/health`
- No browser CORS/CSRF errors from Netlify domain

## Rollback plan

- If needed, revert Netlify proxy to the previous backend domain and redeploy the frontend
- Keep the previous backend service paused but available until the new one is fully validated

## Troubleshooting

- 404 on `/health/`: Confirm Start Command, `DJANGO_SETTINGS_MODULE`, and `ALLOWED_HOSTS`
- Build fails: Ensure Root Directory is `School` for native build so `requirements.txt` is found
- `manage.py` not found: Use `--chdir backend` in Start Command and reference `backend/manage.py` for migrate/collectstatic
- CORS issues: Verify `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS`
- DB connection errors: Confirm `DATABASE_URL` and whether `sslmode=require` is needed
- `botocore.exceptions.NoCredentialsError`: Set `USE_AWS_SECRETS=false` (recommended) or configure IAM creds on Render and `AWS_SECRET_NAME`/`AWS_REGION`.

## Links

- Render: <https://render.com>
- Netlify: <https://netlify.com>
- This repo monorepo root: `School/` (Django under `School/backend/`)
