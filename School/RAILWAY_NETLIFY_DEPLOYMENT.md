# Detailed Railway & Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the AI Academic Stack: Django backend on Railway and React frontend on Netlify.

## Overview

- **Backend**: Django + DRF on Railway (Railpack or Docker).
- **Frontend**: Vite + React on Netlify (with API proxy).
- **Database**: Postgres on Railway.
- **Goal**: Get students enrolling within 24 hours.

## Part 1: Backend Deployment on Railway

### Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app) and sign up/login.
2. Click "New Project" → "Deploy from GitHub repo".
3. Connect your GitHub account and select the `AI-Academic-Stack` repo.
4. If Railway prompts for a subdirectory, choose `School`.

  Note: If you skip this and deploy from the repo root, you'll later need to reference paths with `School/...` (see Step 3A).

### Step 2: Set Up Database

#### Option A: Standard Postgres Plugin (Recommended for simplicity)

1. In your Railway project, click "Add Plugin".
2. Search for "Postgres" and add it.
3. Wait for it to provision (takes 1-2 minutes).
4. Go to the Postgres plugin → "Variables" tab.
5. Copy the `DATABASE_URL` value (looks like `postgresql://user:pass@host:port/db`).

#### Option B: SSL-Enabled Postgres Template (For enhanced security)

1. In your Railway project, click "Add Service" → "From Template".
2. Search for "postgres-ssl" or use the template URL: `ghcr.io/railwayapp-templates/postgres-ssl`
3. Deploy the template.
4. Once deployed, copy the `DATABASE_URL` from the service variables.

### Step 3: Configure Backend Service

1. In your project, select the service (auto-created from GitHub).
2. Go to the service **Settings** tab.

#### Step 3A: Set the correct source directory (monorepo)

In Settings → Source:

- Monorepo subdirectory: If you selected `School` in Step 1, this will already be `School`. If it's blank (repo root), set it to `School` now and redeploy, or keep it blank and use `School/...` paths below.

Keep this in mind for all paths:

- If Source root is `School`: use `backend` and `Dockerfile`.
- If Source root is repo root: use `School/backend` and `School/Dockerfile`.

Can't find the Monorepo subdirectory setting?

- Where it usually is: Service → Settings → Source → "Monorepo" (toggle) → Subdirectory. Enter `School` and Save. If you see a pencil/edit icon next to the Repository name, click it to reveal the Directory field.
- If still not visible: Service → Settings → GitHub (Repository card) → Edit/Manage → set Directory/Path to `School`. Save and Redeploy.
- Last resort (quick and safe): Delete only the broken service (keep your Postgres plugin), then New Service → Deploy from GitHub → select your repo → when prompted, choose the subdirectory `School` before confirming.
- Immediate workaround without changing Source: use Nixpacks with Root Directory `School/backend` (see below). This works even if your Source remains the repo root.

#### For Docker (Recommended)

- Builder: Dockerfile (this repo includes a Dockerfile at `School/Dockerfile`)
- Dockerfile Path:
  - If Source root = `School`: `Dockerfile`
  - If Source root = repo root: `School/Dockerfile`
- Pre-deploy commands: Handled automatically in Dockerfile CMD (migrations and static files run on container startup)
- Healthcheck: Built into Dockerfile
- No additional commands needed in Railway UI.

#### For Railpack (Alternative)

- Builder: Railpack (auto)
- Root Directory:
  - If Source root = `School`: `backend`
  - If Source root = repo root: `School/backend`
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Pre-deploy Command: `python manage.py migrate --noinput`
- Start Command: `bash start.sh`
- Healthcheck Path: `/health/`
- Serverless: Off
- Restart Policy: On Failure, Max retries: 10
- Watch Paths: match the Root Directory above (e.g., `backend/**` or `School/backend/**`)

Note: The Django `manage.py` lives at `School/backend/manage.py`. If Railpack can't find `backend`, you're likely pointing at the repo root; use `School/backend`.

### Step 4: Set Environment Variables

In the service **Variables** tab, add these:

```bash
DEBUG=False
ENVIRONMENT=production
DJANGO_SETTINGS_MODULE=config.settings
SECRET_KEY=your-super-long-random-secret-key-here-at-least-50-chars
JWT_SECRET_KEY=another-super-long-random-key-for-jwt-tokens
ALLOWED_HOSTS=aiacademy-production-941d.up.railway.app
FRONTEND_URL=https://go4itacademy.netlify.app
CORS_ALLOWED_ORIGINS=https://go4itacademy.netlify.app
CSRF_TRUSTED_ORIGINS=https://go4itacademy.netlify.app
DATABASE_URL=postgresql://user:pass@host:port/db (from Postgres plugin)
```

**Important**: Replace `SECRET_KEY` and `JWT_SECRET_KEY` with long random strings. Use a password generator.

### Step 5: Deploy Backend

1. Click "Deploy" in Railway.
2. Watch the logs for any errors.
3. Once deployed, note your Railway URL (e.g., `aiacademy-production-941d.up.railway.app`).

### Step 6: Verify Backend

Run these commands in your terminal:

```bash
# Check health
curl https://aiacademy-production-941d.up.railway.app/health/

# Should return: {"status": "ok"} or similar

# Check API (will be unauthorized without login)
curl https://aiacademy-production-941d.up.railway.app/api/courses/

# Should return: 401 Unauthorized JSON
```

## Part 2: Frontend Deployment on Netlify

### Step 1: Create Netlify Account & Site

1. Go to [netlify.com](https://netlify.com) and sign up/login.
2. Click "Add new site" → "Import an existing project".
3. Connect GitHub and select the `AI-Academic-Stack` repo.

### Step 2: Configure Build Settings

- **Base directory**: (leave empty)
- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist`
- **Node version**: 20

### Step 3: Set Environment Variables

In Site settings → Environment variables, add:

```bash
VITE_API_URL=/api
VITE_APP_ENV=production
```

### Step 4: Deploy Frontend

1. Click "Deploy site".
2. Wait for build to complete.
3. Note your Netlify URL (e.g., `go4itacademy.netlify.app`).

### Step 5: Verify Frontend

1. Visit your Netlify site.
2. Try registering a user (should call `/api/auth/register/`).
3. Login (should call `/api/auth/login/`).
4. Check dashboard for courses.

## Part 3: Connect Frontend to Backend

The Netlify site is already configured to proxy `/api/*` to your Railway backend via `netlify.toml`. No additional setup needed.

## Troubleshooting

### Backend Issues

- **404 on Railway URL**: Check Railway logs. Common issues:
  - Wrong Root Directory (should be `backend` for Railpack, root for Docker).
  - Missing env vars (especially `DATABASE_URL`, `SECRET_KEY`).
  - Migrations failed (check DB connection).
  - **Root Directory not set**: For Railpack, you MUST set Root Directory to `backend` in Railway service settings, otherwise it can't find manage.py.
  - **Dockerfile not found**: Ensure `Dockerfile` is in root directory when using Docker builder.
  - **railway.json conflict**: Remove `railway.json` if present - it forces Railpack and prevents Docker detection. If issues persist, add `railway.json` with `"builder": "dockerfile"` to explicitly force Docker deployment.
- **500 Internal Server Error**: Check Railway logs for Django errors.

#### Specific error: "Could not find root directory: backend"

This happens when the service is pointing at the repository root while the guide assumes your source root is `School`.

- Fix Option A (recommended): In Service → Settings → Source, set Monorepo subdirectory to `School`, then redeploy. After this, Root Directory for Railpack can be `backend` and Dockerfile path can be `Dockerfile`.
- Fix Option B: Keep Source at repo root, but update paths accordingly:
  - Railpack Root Directory: `School/backend`
  - Watch Paths (if used): `School/backend/**`
  - Dockerfile Path: `School/Dockerfile`
  - Healthcheck Path remains `/health/`

### Using a Railway Config File (railway.json)

You can manage builder selection via a config file committed to your repo. This is helpful to avoid Railpack auto-detection picking the wrong runtime in a monorepo.

File location (monorepo):

- If your Railway service Source is set to `School` (recommended), place the file at `School/railway.json`.
- If your service Source is the repo root, place it at the repo root as `railway.json` and adjust paths accordingly.

Minimal config to force Dockerfile (recommended):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile"
  }
}
``;

Notes:

- With Source set to `School`, Railway will pick `School/Dockerfile` automatically when `builder` is `dockerfile`. If Source is repo root, set the Dockerfile Path in the UI to `School/Dockerfile`.
- The config file does not set your Source/Monorepo subdirectory. You must set that in the Railway UI (Settings → Source).

Alternative: use Nixpacks (if Dockerfile builder isn’t available):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  }
}
```

Then in the Railway UI, set Root Directory to `backend` (since manage.py is under `School/backend`) and fill in commands:

- Build: `pip install -r requirements.txt`
- Pre-deploy: `python manage.py migrate --noinput && python manage.py collectstatic --noinput`
- Start: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`

This ensures Nixpacks selects the Python runtime and runs Django correctly.

### Frontend Issues

- **API calls fail**: Ensure `VITE_API_URL=/api` and Netlify proxy is working.
- **CORS errors**: Verify `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` in Railway env vars.
- **Build fails**: Check Node version (20) and npm install.

### Database Issues

- **Connection failed**: Ensure Postgres plugin is attached and `DATABASE_URL` is correct.
- **Migrations fail**: Check Railway logs for DB errors.

## Quick Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Postgres plugin added
- [ ] Backend service configured (Railpack or Docker)
- [ ] Environment variables set
- [ ] Backend deployed and health check passes
- [ ] Netlify site created
- [ ] Frontend deployed
- [ ] Registration/login works
- [ ] Course enrollment works

## Support

If you get stuck, share the error logs from Railway/Netlify and I'll help debug.

**Current Status**: Backend URL ready at `aiacademy-production-941d.up.railway.app`. Frontend at `go4itacademy.netlify.app`.
