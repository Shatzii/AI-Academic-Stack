# Railway & Netlify Deployment Guide

This guide covers deploying the AI Academic Stack: a Django REST API backend on Railway and a Vite + React frontend on Netlify.

## Overview

- **Backend**: Django + DRF on Railway (Docker service).
- **Frontend**: Vite + React on Netlify (with API proxy to Railway).
- **Database**: Postgres on Railway.
- **Current Status**: Backend deploy in progress; frontend ready.

## Backend Deployment (Railway)

### Prerequisites

- Railway account.
- GitHub repo connected to Railway.

### Steps

1. Create a new service in Railway from your GitHub repo.
2. **Option A: Docker (recommended if working)**
   - Switch builder to "Dockerfile" and set path to `backend/Dockerfile`.
   - No custom commands needed.
3. **Option B: Railpack (if Docker fails)**
   - Keep default Railpack builder.
   - Set Root Directory to `backend`.
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Pre-deploy Command: `python manage.py migrate --noinput`
   - Start Command: `bash start.sh`
4. Add a Postgres plugin and copy the DATABASE_URL.
5. Set environment variables:
   - DEBUG=False
   - ENVIRONMENT=production
   - DJANGO_SETTINGS_MODULE=config.settings
   - SECRET_KEY=long-random-string
   - JWT_SECRET_KEY=long-random-string
   - ALLOWED_HOSTS=aiacademy-production-941d.up.railway.app
   - FRONTEND_URL=<https://go4itacademy.netlify.app>
   - CORS_ALLOWED_ORIGINS=<https://go4itacademy.netlify.app>
   - CSRF_TRUSTED_ORIGINS=<https://go4itacademy.netlify.app>
   - DATABASE_URL=postgres://... (from Postgres plugin)
6. Set Healthcheck Path to `/health/`.
7. Deploy.

### Verification

- Health: `curl https://your-railway-app.railway.app/health/` → 200 OK
- API: `curl https://your-railway-app.railway.app/api/courses/` → 401 (unauthorized)

## Frontend Deployment (Netlify)

### Netlify Prerequisites

- Netlify account.
- Repo connected.

### Netlify Steps

1. Create a new site from GitHub repo.
2. Build settings:
   - Build command: `npm run build:netlify`
   - Publish directory: `dist`
   - Node version: 20
3. Environment variables:
   - VITE_API_URL=/api (for proxy)
   - VITE_APP_ENV=production
4. Deploy.

### Netlify Verification

- Site loads: <https://your-netlify-site.netlify.app>
- API proxy: `curl https://your-netlify-site.netlify.app/api/health/` → 200

## Troubleshooting

- Backend 404: Check Railway logs; ensure Dockerfile path and env vars.
- CORS errors: Verify FRONTEND_URL and CORS_ALLOWED_ORIGINS.
- Frontend build fails: Check Node version and npm install.

## Notes

- Replace placeholders with your actual domains.
- Backend URL: aiacademy-production-941d.up.railway.app
- Frontend URL: go4itacademy.netlify.app
