# Netlify Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the AI Academic Stack application to Netlify.

## Prerequisites

- Netlify account
- GitHub repository with the project
- Backend API deployed and accessible
- Environment variables configured

## Step 1: Deploy Backend to Production

### Option A: Railway (Recommended - Free tier available)

1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub repository
4. Railway will auto-detect your Django backend and deploy it
5. Once deployed, copy the production URL from Railway dashboard
6. Update `VITE_API_URL` in Netlify environment variables with this URL

### Option B: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`
5. Get URL: `heroku apps:info`

### Option C: DigitalOcean App Platform

1. Go to [DigitalOcean](https://digitalocean.com)
2. Create App → GitHub integration
3. Select your repository
4. Configure as Django app
5. Deploy and get production URL

## Step 2: Connect Repository to Netlify

## Step 2: Configure Environment Variables

In Netlify dashboard, go to Site settings → Environment variables and add:

```bash
# API Configuration
VITE_API_URL=https://your-backend-api.com/api
VITE_API_BASE_URL=https://your-backend-api.com

# Authentication
VITE_JWT_SECRET=your-jwt-secret-here
VITE_SESSION_TIMEOUT=3600000

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false

# External Services
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn

# Build Configuration
NODE_VERSION=20
NPM_VERSION=10
```

## Step 3: Configure Build Settings

In Netlify dashboard, go to Site settings → Build & deploy:

- **Repository**: Your GitHub repo
- **Branch**: main
- **Build command**: `./netlify-build.sh`
- **Publish directory**: `dist`
- **Node version**: 20.x

## Step 4: Deploy

1. Push your changes to the main branch
2. Netlify will automatically trigger a build
3. Monitor the build process in the Netlify dashboard
4. Once deployed, your site will be available at `https://your-site-name.netlify.app`

## Step 5: Post-Deployment Verification

### Check Core Functionality

- [ ] Frontend loads correctly
- [ ] API calls work (check Network tab)
- [ ] Authentication flows work
- [ ] PWA features work (if enabled)

### Performance Checks

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Bundle size optimized
- [ ] Images properly optimized

### Security Verification

- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] CSP headers working
- [ ] No mixed content warnings

## Troubleshooting

### Build Failures

1. Check build logs in Netlify dashboard
2. Verify environment variables are set
3. Ensure dependencies are properly listed in package.json
4. Check Node.js version compatibility

### Runtime Issues

1. Verify API endpoints are accessible
2. Check CORS configuration on backend
3. Validate environment variables
4. Check browser console for errors

### Performance Issues

1. Run Lighthouse audit
2. Check bundle analyzer output
3. Verify caching headers
4. Optimize images and assets

## Custom Domain Setup (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records as instructed
4. Update environment variables if needed

## Monitoring & Analytics

### Netlify Analytics

- Built-in analytics available in dashboard
- Real-time visitor data
- Performance metrics

### External Monitoring

- Set up Sentry for error tracking
- Configure Google Analytics
- Set up uptime monitoring

## Rollback Strategy

1. In Netlify dashboard, go to Deploys
2. Find the previous working deploy
3. Click "Publish deploy" to rollback
4. Verify functionality after rollback

## Environment Management

### Staging Environment

1. Create separate branch (e.g., `staging`)
2. Set up separate Netlify site for staging
3. Use different environment variables
4. Test thoroughly before merging to main

### Production Environment

1. Use main branch for production
2. Enable branch deploys for feature testing
3. Set up proper CI/CD pipeline

## Security Best Practices

- Keep dependencies updated
- Use environment variables for secrets
- Enable Netlify's built-in security features
- Regularly audit access permissions
- Monitor for security vulnerabilities

## Performance Optimization

### Build Optimization

- Use the provided `netlify-build.sh` script
- Enable build caching
- Optimize bundle splitting
- Compress assets

### Runtime Optimization

- Enable CDN caching
- Use proper cache headers
- Optimize images
- Minimize render-blocking resources

## Backup & Recovery

- Netlify automatically keeps deploy history
- Use Git for source code backup
- Set up database backups separately
- Document recovery procedures

## Support

For issues:

1. Check Netlify status page
2. Review build logs
3. Check GitHub issues
4. Contact Netlify support if needed

## Deployment Checklist

- [ ] Repository connected to Netlify
- [ ] Environment variables configured
- [ ] Build settings correct
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate active
- [ ] Site tested in production
- [ ] Monitoring set up
- [ ] Team access configured
- [ ] Documentation updated
