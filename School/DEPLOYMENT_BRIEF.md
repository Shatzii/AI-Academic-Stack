# Go4it Sports Academy — Deployment Brief (Railway + Netlify)

A concise, senior-friendly summary of current deploy issues, root causes, and the fastest fixes to get production green.

## Current symptoms

- Railway backend returns 404 “Application not found” at `/health/`.
- Netlify proxy (`/api/*`) shows “No such app” because the backend isn’t reachable.
- Past Railway logs included:
  - `pip: not found` (indicates wrong runtime selected)
  - `Script start.sh not found`
  - `Could not find root directory: backend`

## Root causes (monorepo + wrong builder)

- Monorepo Source root is incorrect or left at repo root. The Django app lives at `School/backend/`, but the service is building from the wrong directory.
- Railway auto-detected the wrong builder/runtime (frontend image via Railpack), so Python wasn’t available (`pip: not found`).
- With Source at repo root, using `backend` as Root Directory fails; it should be `School/backend` unless the Source is set to `School`.

## Repo facts (what’s ready to use)

- Dockerfiles
  - `School/Dockerfile` (preferred): runs migrations and collectstatic on container start; includes HEALTHCHECK; binds Gunicorn to `$PORT`.
  - `School/backend/Dockerfile` (alternative).
- Config-as-code
  - `School/railway.json` set to force Dockerfile builder:

  ```json
  { "$schema": "https://railway.app/railway.schema.json", "build": { "builder": "dockerfile" } }
  ```

- Netlify
  - `netlify.toml` proxies `/api/*` to the Railway backend domain (CSP updated accordingly).

## Fastest path to green (Preferred: Dockerfile builder)

1. Railway → Service → Settings

- Source → Monorepo subdirectory: `School`
- Build & Deploy → Builder: `Dockerfile`
- Dockerfile Path:
  - If Source = `School`: `Dockerfile`
  - If Source = repo root: `School/Dockerfile`

1. Railway → Service → Variables (required)

- `DEBUG=False`
- `ENVIRONMENT=production`
- `DJANGO_SETTINGS_MODULE=config.settings`
- `SECRET_KEY`=[long random]
- `JWT_SECRET_KEY`=[long random]
- `ALLOWED_HOSTS=aiacademy-production-941d.up.railway.app`
- `FRONTEND_URL=https://go4itacademy.netlify.app`
- `CORS_ALLOWED_ORIGINS=https://go4itacademy.netlify.app`
- `CSRF_TRUSTED_ORIGINS=https://go4itacademy.netlify.app`
- `DATABASE_URL`=[from Postgres plugin]

1. Deploy + verify

- <https://aiacademy-production-941d.up.railway.app/health/> → 200 JSON
- <https://aiacademy-production-941d.up.railway.app/api/courses/> → 401 JSON (expected unauthorized)
- <https://go4itacademy.netlify.app/api/health/> → 200 JSON (proxy)

## Fallback path (Nixpacks)

Use only if Dockerfile builder isn’t available.

- Keep Source = `School` (recommended), then:
  - Root Directory: `backend`
  - Build: `pip install -r requirements.txt`
  - Pre-deploy: `python manage.py migrate --noinput && python manage.py collectstatic --noinput`
  - Start: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`

If Source must remain repo root, use:

- Root Directory: `School/backend`

## Validation checklist

- Healthcheck: 200 at `/health/` on Railway URL.
- API: 401 JSON at `/api/courses/` on Railway URL (no auth yet).
- Netlify proxy: `/api/health` returns 200.
- No browser CORS/CSRF warnings from Netlify domain.
- DB migrations succeeded (Railway logs clean).

## Common pitfalls to avoid

- Forgetting to set Source (Monorepo subdirectory) to `School` before choosing `Dockerfile` path.
- Wrong builder forced by config; ensure `railway.json` uses `{ "builder": "dockerfile" }`.
- Missing `ALLOWED_HOSTS` → Django 400s despite a healthy container.
- Incorrect `DATABASE_URL` or missing Postgres plugin.

## Important links

- Frontend (Netlify): <https://go4itacademy.netlify.app>
- Backend (Railway): <https://aiacademy-production-941d.up.railway.app>
- Backend healthcheck: <https://aiacademy-production-941d.up.railway.app/health/>

## Ownership / next steps

- A senior engineer should:
  1) Set Source = `School`, Builder = `Dockerfile`, Dockerfile Path = `Dockerfile`.
  2) Confirm env vars (above), especially `DATABASE_URL` and secrets.
  3) Redeploy, watch logs through Gunicorn start, then validate endpoints.
  4) If Dockerfile is blocked, use Nixpacks with `backend` Root Directory and the commands above.

This brief, combined with `RAILWAY_NETLIFY_DEPLOYMENT.md`, contains everything needed to get production green quickly.
