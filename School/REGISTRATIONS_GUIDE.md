# OpenEdTex Registrations & Setup Guide

This guide lists all external APIs, services, accounts, and registrations required for the OpenEdTex application to function fully. It includes Auth0, hosting platforms, and third-party integrations based on the codebase and deployment setup.

## 1. Authentication & Identity (Auth0)
- **Auth0 Tenant and Application**: Required for user login/logout and JWT token management.
  - Register: Create a free/paid Auth0 account at [auth0.com](https://auth0.com) and set up a tenant (e.g., `your-tenant.us.auth0.com`).
  - Create an Application: In Auth0 dashboard, create a "Single Page Application" for the React frontend.
  - Configure API: Create an API in Auth0 with an identifier (e.g., `https://openedtex.api`) to match the audience in the code.
  - Settings to update:
    - Allowed Callback URLs: `http://localhost:5173` (dev) and your Netlify domain (prod).
    - Allowed Logout URLs: Same as above.
    - Allowed Web Origins: Same as above.
  - Environment Variables: Set `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, and `VITE_AUTH0_AUDIENCE` in `.env` (local) and Netlify dashboard (prod).
  - Why needed: The app uses `@auth0/auth0-react` for login/logout; without this, users can't authenticate via Auth0 (falls back to local JWT if configured).
  - Status: Partially configured in code (conditional enable/disable); requires your tenant details to activate.

## 2. Hosting & Deployment (Netlify)
- **Netlify Account and Site**: Required for frontend deployment and production hosting.
  - Register: Create a free/paid Netlify account at [netlify.com](https://netlify.com).
  - Connect Repository: Link your GitHub repo (`AI-Academic-Stack`) to Netlify for auto-deploys.
  - Create Site: Deploy the `dist` folder from the build process.
  - Environment Variables: In Netlify dashboard, set:
    - `VITE_API_URL`: URL of your backend API (e.g., `https://your-django-backend.herokuapp.com/api`).
    - `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`: From Auth0 setup above.
    - `NODE_ENV`: `production`.
  - Custom Domain (Optional): Register a domain (e.g., via GoDaddy or Namecheap) and link it to Netlify for `openedtex.edu`.
  - Why needed: The app is optimized for Netlify (see `netlify.toml` for CSP, redirects, and headers); without this, the site won't deploy or handle routing/SPA properly.
  - Status: Configured in code; requires account setup and env vars.

## 3. Backend Hosting & API (Django on Heroku or Similar)
- **Heroku Account and App**: Required for hosting the Django backend and exposing APIs.
  - Register: Create a free/paid Heroku account at [heroku.com](https://heroku.com).
  - Deploy Django App: Push the `backend/` folder to Heroku (use Heroku CLI or GitHub integration).
  - Environment Variables: In Heroku dashboard, set:
    - `DEBUG`: `False` (prod).
    - `SECRET_KEY`: A secure random key.
    - `DATABASE_URL`: For PostgreSQL (Heroku add-on or external).
    - `ALLOWED_HOSTS`: Include your Netlify domain and `localhost` for dev.
    - `CORS_ALLOWED_ORIGINS`: Include Netlify domain.
    - Auth0-related: If validating Auth0 JWTs, add JWKS URL or keys (see `AUTH0_SETUP.md`).
  - Database: Use Heroku Postgres add-on (free tier available) or external PostgreSQL.
  - Why needed: The frontend calls backend APIs (e.g., `/api/auth/login`, `/api/courses/`) via `VITE_API_URL`; without this, API calls will fail.
  - Status: Referenced in `netlify.toml` redirects; requires deployment and env setup.
  - Alternative: If not using Heroku, register with another provider like AWS, DigitalOcean, or Vercel for the backend.

## 4. Database (PostgreSQL or SQLite)
- **PostgreSQL Hosting**: Recommended for production (SQLite is used for dev).
  - Register: Use Heroku Postgres (above) or external providers like ElephantSQL, Supabase, or AWS RDS.
  - Configure: Set `DATABASE_URL` in backend settings; migrate data from dev SQLite if needed.
  - Why needed: Backend models (users, courses, etc.) require a database; without it, the app can't store data.
  - Status: Configured in `backend/config/settings.py`; requires setup for prod.

## 5. Real-Time Communication (WebSocket Server)
- **WebSocket Service**: For features like classrooms or live chat (uses Socket.io-client).
  - Register: If not handled by Django Channels (already in backend), use a service like Pusher, Socket.io server on Heroku, or AWS API Gateway.
  - Configure: Update `connect-src` in `netlify.toml` CSP to include the WebSocket URL (e.g., `wss://api.openedtex.com`).
  - Why needed: Real-time features in classrooms; without it, live interactions won't work.
  - Status: Client-side code exists; server-side may need deployment.

## 6. Analytics & Tracking (Optional)
- **Google Analytics**: For user tracking (mentioned in CSP).
  - Register: Create a Google Analytics account at [analytics.google.com](https://analytics.google.com) and get a tracking ID.
  - Configure: Add GA script to the app or via Netlify headers; update CSP if needed.
  - Why needed: Tracks user engagement; optional but configured in CSP.
  - Status: Not fully implemented; requires account and script addition.

## 7. CDN & External Resources
- **Font Awesome or CDN Services**: For icons (e.g., `fas fa-graduation-cap` in Navbar).
  - Register: Use free CDN links (already in CSP); no account needed unless custom.
  - Why needed: UI icons; without it, icons may not load.
  - Status: Configured in CSP; no registration required.
- **Bootstrap CDN**: For styling.
  - Same as above; free CDN usage.

## 8. Other Potential Integrations
- **Payment Gateway (Optional)**: If adding paid features (not evident in code yet), register with Stripe or PayPal.
- **Email Service**: For notifications (e.g., via Django's email backend); register with SendGrid or Mailgun.
- **File Storage**: For media files (e.g., student IDs); use AWS S3 or Cloudinary if needed.
- **AI Services**: If `aiAPI` calls external models (e.g., OpenAI), register an API key/account.

## Summary & Next Steps
- **Priority Order**: Start with Auth0, Netlify, and Heroku (backend) as they're core to auth and deployment.
- **Total Registrations Needed**: ~4-6 accounts/services (depending on options).
- **Time Estimate**: 1-2 hours per service for setup.
- **Verification**: After registering, update environment variables and test locally (`npm run dev`) and on Netlify.

Last updated: September 20, 2025