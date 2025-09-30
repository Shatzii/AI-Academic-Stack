# OpenEdTex Environment Variables

This file contains all the environment variables needed to run the OpenEdTex application. Copy and paste these into your hosting platforms (Netlify for frontend, Heroku for backend, etc.).

## Frontend Environment Variables (Netlify)

Set these in your **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

```
VITE_API_URL=https://your-backend-domain.herokuapp.com/api
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://openedtex.api
NODE_ENV=production
VITE_APP_ENV=production
```

### Variable Explanations:

- **`VITE_API_URL`**: URL of your Django backend API endpoint
  - Example: `https://your-django-app.herokuapp.com/api`
  - Default (dev): `http://localhost:8000/api`

- **`VITE_AUTH0_DOMAIN`**: Your Auth0 tenant domain
  - Example: `dev-abc123.us.auth0.com`
  - Get this from your Auth0 dashboard

- **`VITE_AUTH0_CLIENT_ID`**: Your Auth0 application client ID
  - Example: `abcdefghijklmnopqrstuvwx123456789`
  - Get this from your Auth0 application settings

- **`VITE_AUTH0_AUDIENCE`**: Your Auth0 API identifier
  - Example: `https://openedtex.api`
  - Must match the API identifier in your Auth0 dashboard

- **`NODE_ENV`**: Set to `production` for production builds

- **`VITE_APP_ENV`**: Set to `production` for production environment

## Backend Environment Variables (Heroku/Django)

Set these in your **Heroku Dashboard** → **Settings** → **Config Vars** (or equivalent for your hosting platform):

```
DEBUG=False
SECRET_KEY=your-super-secret-django-key-here-make-it-long-and-random
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_HOSTS=your-netlify-domain.netlify.app,your-custom-domain.com
CORS_ALLOWED_ORIGINS=https://your-netlify-domain.netlify.app,https://your-custom-domain.com
DJANGO_SETTINGS_MODULE=config.settings
```

### Backend Variable Explanations:

- **`DEBUG`**: Set to `False` in production for security
  - Development: `True`
  - Production: `False`

- **`SECRET_KEY`**: Django's secret key for cryptographic signing
  - Generate a new one for production: `python -c "import secrets; print(secrets.token_urlsafe(50))"`
  - Keep this secret and unique per environment

- **`DATABASE_URL`**: PostgreSQL database connection string
  - Heroku Postgres: Auto-provided
  - External: `postgresql://username:password@hostname:port/database_name`

- **`ALLOWED_HOSTS`**: Comma-separated list of allowed hostnames
  - Include your Netlify domain and any custom domains
  - Example: `your-site.netlify.app,www.your-site.com`

- **`CORS_ALLOWED_ORIGINS`**: Origins allowed to make cross-origin requests
  - Should match your frontend domains
  - Example: `https://your-site.netlify.app,https://www.your-site.com`

- **`DJANGO_SETTINGS_MODULE`**: Points to your Django settings file
  - Usually: `config.settings`

## Auth0 Configuration Steps

1. **Create Auth0 Account**: Go to [auth0.com](https://auth0.com) and sign up
2. **Create Tenant**: Set up your tenant (e.g., `your-tenant.us.auth0.com`)
3. **Create Application**:
   - Type: Single Page Application
   - Allowed Callback URLs: `http://localhost:5173` (dev) + your Netlify domain
   - Allowed Logout URLs: Same as above
   - Allowed Web Origins: Same as above
4. **Create API**:
   - Identifier: `https://openedtex.api`
   - Signing Algorithm: RS256
5. **Get Values**:
   - Domain: From tenant settings
   - Client ID: From application settings
   - Audience: The API identifier

## Quick Setup Checklist

### Frontend (Netlify):
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Set environment variables above
- [ ] Deploy site

### Backend (Heroku):
- [ ] Create Heroku account
- [ ] Create new app
- [ ] Add PostgreSQL add-on
- [ ] Set environment variables above
- [ ] Deploy Django code
- [ ] Run migrations: `python manage.py migrate`

### Auth0:
- [ ] Create Auth0 account and tenant
- [ ] Create SPA application
- [ ] Create API
- [ ] Configure allowed URLs
- [ ] Get domain, client ID, and audience

## Testing Environment Variables

After setting up, test that:

1. **Frontend loads**: No console errors about missing env vars
2. **API calls work**: Check network tab for successful requests
3. **Auth0 login works**: Can authenticate users
4. **Backend responds**: API endpoints return data

## Security Notes

- Never commit `.env` files to version control
- Use different values for development and production
- Rotate SECRET_KEY periodically
- Keep Auth0 credentials secure
- Use HTTPS in production (Netlify provides this automatically)

---

**Last updated**: September 30, 2025</content>
<parameter name="filePath">/workspaces/AI-Academic-Stack/School/ENVIRONMENT_VARIABLES.md