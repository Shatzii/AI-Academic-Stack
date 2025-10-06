# Netlify Deployment and Environment Variables

This guide explains how to deploy the Vite + React frontend to Netlify and configure the environment variables so it talks to your Django backend.

## Summary

- Build command: `npm run build:netlify`
- Publish directory: `dist`
- Node version: `20`
- SPA routing: handled via redirects to `/index.html`
- API routing: use VITE_API_URL in the app, or optional Netlify redirect proxy

## Frontend environment variables (Netlify > Site settings > Environment variables)

Set these as per your backend domain. Values below are examples; replace with your real domains.

Required

- VITE_API_URL: <https://aiacademy-production-941d.up.railway.app/api>
- VITE_APP_ENV: production

Optional (turn on only if you will use Auth0)

- VITE_AUTH0_DOMAIN: your-tenant.us.auth0.com
- VITE_AUTH0_CLIENT_ID: abc123...
- VITE_AUTH0_AUDIENCE: <https://aiacademy-production-941d.up.railway.app/> (if using API authorization)

Notes

- VITE_ variables are exposed to the client bundle. Do not put secrets here.
- Keep NODE_ENV=production and NODE_VERSION pinned at the build level.

## Backend configuration (Django)

Make sure your backend allows your Netlify/site origin and exposes the API under `/api`.

Minimum environment variables on backend

- SECRET_KEY: a long random string
- JWT_SECRET_KEY: same or different long random string
- DEBUG: False
- ALLOWED_HOSTS: api.yourdomain.com
- FRONTEND_URL: <https://your-frontend-domain.com>
- CORS_ALLOWED_ORIGINS: <https://your-frontend-domain.com>, <https://go4itacademy.netlify.app>

If using SessionAuth or CSRF-protected endpoints, also set

- CSRF_TRUSTED_ORIGINS: <https://your-frontend-domain.com>, <https://go4itacademy.netlify.app>

## netlify.toml alignment

The repo includes `netlify.toml`. Verify/edit these sections:

Build

```toml
[build]
  command = "npm run build:netlify"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "production"
  VITE_APP_ENV = "production"
```

API Redirect (optional proxy)

- If you prefer to proxy `/api/*` via Netlify to your backend, update the target:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://aiacademy-production-941d.up.railway.app/api/:splat"
  status = 200
  force = true
```
- If you do not use the proxy, set `VITE_API_URL` to your backend URL and remove this redirect.

- If you do use the proxy, you can set `VITE_API_URL` to `/api` so the app calls the Netlify-proxied path.

Content Security Policy

- Update `connect-src` to include your backend origin:

```text
... connect-src 'self' https://aiacademy-production-941d.up.railway.app ...;
```

## Typical deployment steps

1. In Netlify, create a new site from this repository.

1. Under Site settings > Environment variables, add:

- VITE_API_URL=<https://aiacademy-production-941d.up.railway.app/api>
- VITE_APP_ENV=production
- Optionally VITE_AUTH0_* if using Auth0.

1. Under Build & deploy > Build settings, ensure:

   - Build command: npm run build:netlify
   - Publish directory: dist

1. Trigger a deploy.

## Quick smoke test

After deploy:

- Visit the site. Confirm course list loads (GET /api/courses/).
- Register a user, then login (POST /api/auth/register/ and /api/auth/login/ are called by the app).
- Enroll in a course (POST /api/courses/:id/enroll/)
- Confirm dashboard shows your enrolled course (GET /api/courses/enrollments/)

Tip: On Railway, set Healthcheck Path to `/health/` so deploys only go live when Django is ready.

## Troubleshooting

- 401 on API calls: verify `VITE_API_URL` matches your backend and that CORS_ALLOWED_ORIGINS includes your frontend origin. If using the Netlify `/api` proxy, ensure the redirect points to the correct backend and origin.
- CORS preflight failures: confirm Access-Control-Allow-Origin in backend and that HTTPS/TLS is correct.
- TypeScript warnings in Netlify logs: harmless for build; the app uses .jsx components imported by .tsx. The build still completes.

## Example values to copy

Frontend (Netlify):

- VITE_API_URL=<https://api.example.org/api>
- VITE_APP_ENV=production

Backend (Django):

- DEBUG=False
- SECRET_KEY=use-a-long-random-string
- JWT_SECRET_KEY=use-a-long-random-string
- ALLOWED_HOSTS=api.example.org
- FRONTEND_URL=<https://school.example.org>
- CORS_ALLOWED_ORIGINS=<https://school.example.org>,<https://your-site.netlify.app>
- CSRF_TRUSTED_ORIGINS=<https://school.example.org>,<https://your-site.netlify.app>

That’s it—configure envs, update the redirect target if you proxy, deploy, and smoke test the flows.
