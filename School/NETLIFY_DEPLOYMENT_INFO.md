# Netlify Deployment Guide for OpenEdTex

This comprehensive guide covers everything you need to deploy the OpenEdTex application on Netlify. Follow these steps to get your educational platform live.

## 📋 Prerequisites

Before deploying, ensure you have:

### Required Accounts
- **GitHub Account**: Your code repository
- **Netlify Account**: [netlify.com](https://netlify.com) - Free tier available
- **Auth0 Account**: [auth0.com](https://auth0.com) - For authentication
- **Backend Hosting**: Heroku/AWS/DigitalOcean for Django API

### Required Information
- Auth0 Domain, Client ID, and Audience
- Backend API URL (e.g., `https://your-django-app.herokuapp.com/api`)
- Custom domain (optional)

---

## 🚀 Step-by-Step Deployment

### Step 1: Connect Repository to Netlify

1. **Sign up/Login to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign up with GitHub (recommended)

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select the `AI-Academic-Stack` repository

3. **Configure Build Settings**
   ```
   Branch to deploy: main
   Build command: npm run build:netlify
   Publish directory: dist
   ```

### Step 2: Set Environment Variables

In your Netlify dashboard, go to **Site Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://your-backend-domain.herokuapp.com/api
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://openedtex.api
NODE_ENV=production
VITE_APP_ENV=production
```

**How to get these values:**
- `VITE_API_URL`: Your Django backend URL + `/api`
- `VITE_AUTH0_DOMAIN`: From Auth0 tenant settings
- `VITE_AUTH0_CLIENT_ID`: From Auth0 application settings
- `VITE_AUTH0_AUDIENCE`: Your Auth0 API identifier

### Step 3: Configure Build Settings (Advanced)

In **Site Settings** → **Build & Deploy**:

- **Repository**: `Shatzii/AI-Academic-Stack`
- **Branch**: `main`
- **Build command**: `npm run build:netlify`
- **Publish directory**: `dist`
- **Node version**: `20` (latest LTS)

### Step 4: Set Up Custom Domain (Optional)

1. **Purchase Domain**
   - Buy from Namecheap, GoDaddy, etc.
   - Or use Netlify's built-in domains

2. **Configure in Netlify**
   - Go to **Site Settings** → **Domain Management**
   - Add custom domain
   - Update DNS records as instructed
   - Wait for SSL certificate (automatic)

3. **Update Auth0 Settings**
   - Add your custom domain to:
     - Allowed Callback URLs
     - Allowed Logout URLs
     - Allowed Web Origins

---

## 🔧 Configuration Files

The following files are already configured in your repository:

### netlify.toml
```toml
[build]
  command = "npm run build:netlify"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NODE_ENV = "production"
  VITE_APP_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "https://your-django-backend.herokuapp.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn.auth0.com data:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.openedtex.com wss://api.openedtex.com https://cdn.jsdelivr.net https://www.google-analytics.com https://your-tenant.us.auth0.com https://cdn.auth0.com https://your-django-backend.herokuapp.com; frame-src 'self' https://your-tenant.us.auth0.com https://cdn.auth0.com;"
```

### public/_redirects
```
# Redirect API calls to backend
/api/* https://your-django-backend.herokuapp.com/api/:splat 200

# Handle client-side routing
/* /index.html 200
```

### public/_headers
```
# Security headers
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Cache static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache other static files
/favicon.ico
  Cache-Control: public, max-age=86400

/manifest.json
  Cache-Control: public, max-age=86400
```

---

## 🔍 Post-Deployment Verification

After deployment, verify everything works:

### 1. Site Loads
- Visit your Netlify URL
- Should load without "cannot get" errors
- No console errors about missing environment variables

### 2. Authentication Works
- Click "Login" → Should redirect to Auth0
- After login → Should return to your site
- User info should display in navbar

### 3. API Calls Work
- Open browser dev tools → Network tab
- Try logging in or loading courses
- Should see successful API calls to your backend

### 4. PWA Features
- Should be installable as PWA
- Service worker should register
- Offline functionality should work

### 5. Mobile Responsive
- Test on mobile devices
- Should adapt to different screen sizes

---

## 🐛 Troubleshooting Common Issues

### Build Fails
**Error**: `Build command failed`
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version is set to 20

**Error**: `Module not found`
- Check import paths in components
- Ensure all files are committed to GitHub

### Environment Variables Not Working
**Error**: `VITE_API_URL is not defined`
- Check variable names (must start with `VITE_`)
- Ensure variables are set in Netlify dashboard
- Redeploy after adding variables

### Authentication Issues
**Error**: `Invalid redirect URI`
- Update Auth0 application settings with your Netlify domain
- Add to: Allowed Callback URLs, Logout URLs, Web Origins

**Error**: `CORS error`
- Ensure backend `CORS_ALLOWED_ORIGINS` includes your Netlify domain
- Check `netlify.toml` CSP allows Auth0 domains

### API Connection Issues
**Error**: `Failed to fetch` or `CORS error`
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible
- Check backend CORS settings

### Routing Issues
**Error**: `404 on refresh`
- Ensure `_redirects` file is in `public/` folder
- Check `netlify.toml` has SPA redirect rules

### Performance Issues
- Enable Netlify's asset optimization
- Check bundle size in build logs
- Consider code splitting improvements

---

## 📊 Monitoring & Analytics

### Netlify Analytics
- View in Netlify dashboard
- Track page views, bandwidth, build times

### Custom Analytics (Optional)
- Add Google Analytics tracking code
- Update CSP in `netlify.toml` to allow GA domains

### Error Tracking
- Check Netlify function logs
- Monitor for 4xx/5xx errors
- Set up alerts for failed builds

---

## 🔄 Updates & Redeployment

### Automatic Deployments
- Push changes to `main` branch → Auto-deploy
- Check deployment status in Netlify dashboard

### Manual Deployments
- Drag & drop `dist` folder to Netlify dashboard
- Or use Netlify CLI: `netlify deploy --prod --dir=dist`

### Rollbacks
- Go to **Deploys** tab in Netlify dashboard
- Click on previous successful deploy
- Choose "Rollback to this deploy"

---

## 💡 Pro Tips

1. **Use Netlify CLI** for local testing:
   ```bash
   npm install -g netlify-cli
   netlify dev  # Test locally with Netlify functions
   ```

2. **Environment-Specific Builds**:
   - Use different branches for staging/production
   - Set branch-specific environment variables

3. **Performance Optimization**:
   - Enable Netlify's asset optimization
   - Use WebP images
   - Implement lazy loading

4. **Security**:
   - Keep dependencies updated
   - Use HTTPS (automatic on Netlify)
   - Regularly rotate Auth0 credentials

5. **Backup Strategy**:
   - Keep database backups separate from Netlify
   - Use Git for code versioning
   - Document all configuration changes

---

## 📞 Support & Resources

### Netlify Resources
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://community.netlify.com)
- [Netlify Status](https://www.netlifystatus.com)

### OpenEdTex Specific
- Check `AUTH0_SETUP.md` for authentication setup
- Review `ENVIRONMENT_VARIABLES.md` for all required vars
- See `REGISTRATIONS_GUIDE.md` for account setup

### Getting Help
- Netlify support: support@netlify.com
- Auth0 support: support@auth0.com
- OpenEdTex issues: GitHub repository

---

**Deployment Checklist:**
- [ ] Netlify account created
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Auth0 configured with Netlify domain
- [ ] Backend deployed and accessible
- [ ] Site loads without errors
- [ ] Authentication works
- [ ] API calls successful
- [ ] Mobile responsive
- [ ] PWA installable

**Last updated**: September 30, 2025</content>
<parameter name="filePath">/workspaces/AI-Academic-Stack/School/NETLIFY_DEPLOYMENT_INFO.md