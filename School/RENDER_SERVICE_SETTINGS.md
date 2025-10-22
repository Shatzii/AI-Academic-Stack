# Render Web Service — General Settings (AI-Academic-Stack)

This document captures the current “General” settings for the Render Web Service that hosts the Django backend for Go4it Sports Academy.

## Service Identity

- Name: AI-Academic-Stack
- Region: Oregon (US West)
- Instance Type: Starter — 0.5 CPU / 512 MB

## Build & Deploy

- Repository: <https://github.com/Shatzii/AI-Academic-Stack>
- Branch: main
- Git Credentials: <media@shatzii.com> (you) — Use My Credentials
- Root Directory: School
- Build Filters:
  - Included Paths: (none)
  - Ignored Paths: (none)
- Registry Credential: None

### Docker (current)

- Dockerfile Path: School/Dockerfile
- Docker Build Context Directory: School/
- Docker Command: (not set)
- Pre-Deploy Command: (not set)
- Auto-Deploy: On Commit
- Deploy Hook: (generated; redacted in docs)

## Domains

- Render Subdomain: enabled → <https://ai-academic-stack.onrender.com>
- Custom Domains: (none configured)

## Previews & Caching

- Pull Request Previews: Off
- Edge Caching: Disabled (requests bypass the cache)

## Notifications

- Service Notifications: Use workspace default (Only failure notifications)
- Preview Environment Notifications: Use account default (Disabled)

## Health Checks

- Health Check Path: /healthz

## Maintenance

- Maintenance Mode: Disabled
- Custom Maintenance Page: (not set)

---

## Notes

- Health endpoint: This project exposes a health check at `/health/`. If you see failing health checks, set the Health Check Path to `/health/` in Render, or add an alias route for `/healthz` in the Django app.
- Root Directory: With `School/` set as the Root Directory, Render runs build commands from that folder and only code changes under `School/` will trigger auto-deploys.
- Docker vs Native Python: You can alternatively use Render’s native Python service (no Docker). See `RENDER_DEPLOYMENT.md` for the non-Docker Start/Build commands and recommended environment variables (`USE_AWS_SECRETS=false`, etc.).
- Secrets & Env: Environment variables are set outside of the “General” tab. Refer to `RENDER_DEPLOYMENT.md` for the full list of required env vars.
