# 🚀 OpenEdTex Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Environment Setup](#environment-setup)
4. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [Configuration](#configuration)
8. [Testing & Validation](#testing--validation)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Performance Optimization](#performance-optimization)

---

## Prerequisites

### Required Accounts
- ✅ **GitHub Account**: For repository hosting
- ✅ **Netlify Account**: For frontend deployment (free tier available)
- ✅ **Backend Hosting**: Choose one:
  - Railway (recommended - free tier)
  - Heroku (popular - free tier)
  - Render (modern - free tier)
  - DigitalOcean (reliable - paid)

### Required Tools
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Install Netlify CLI (optional)
npm install -g netlify-cli

# Install Railway CLI (if using Railway)
npm install -g @railway/cli

# Install Heroku CLI (if using Heroku)
npm install -g heroku
```

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Latest version
- **Git**: Latest version
- **Internet Connection**: Stable connection for deployments

---

## Project Overview

### Architecture
```
OpenEdTex Application
├── Frontend (React + Vite)
│   ├── Netlify Deployment
│   ├── Static Site Generation
│   └── CDN Delivery
├── Backend (Django REST API)
│   ├── Separate Hosting (Railway/Heroku/Render)
│   ├── PostgreSQL Database
│   └── API Endpoints
└── Database (PostgreSQL)
    ├── Production Database
    ├── Connection Pooling
    └── Automated Backups
```

### Tech Stack
- **Frontend**: React 18, Vite, Bootstrap 5, Redux Toolkit
- **Backend**: Django 4.2, Django REST Framework, PostgreSQL
- **Deployment**: Netlify (frontend), Railway/Heroku (backend)
- **Database**: PostgreSQL (production), SQLite (development)

---

## Environment Setup

### 1. Clone Repository
```bash
# Clone the repository
git clone https://github.com/your-username/openedtex.git
cd openedtex

# Verify project structure
ls -la
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables:**
```bash
# Development
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development

# Production (will be set in Netlify)
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_ENV=production
```

### 4. Test Local Development
```bash
# Start development server
npm run dev

# Verify frontend is running
# Open http://localhost:5173 in browser
```

---

## Frontend Deployment (Netlify)

### Method 1: One-Click Deploy (Recommended)

1. **Fork Repository**
   ```bash
   # Fork on GitHub
   # URL: https://github.com/your-username/openedtex
   ```

2. **Deploy to Netlify**
   - Click: [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/openedtex)
   - Connect your GitHub account
   - Select repository
   - Configure build settings (auto-detected)

3. **Configure Build Settings**
   ```
   Branch: main
   Build command: npm run build
   Publish directory: dist
   ```

### Method 2: Manual CLI Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Initialize Netlify Site**
   ```bash
   # Initialize site
   netlify init

   # Or link existing site
   netlify link
   ```

3. **Deploy to Production**
   ```bash
   # Build and deploy
   npm run build:netlify
   netlify deploy --prod --dir=dist
   ```

### Method 3: Automated Script

1. **Use Deployment Script**
   ```bash
   # Make script executable
   chmod +x deploy-netlify.sh

   # Deploy to production
   ./deploy-netlify.sh production
   ```

### Netlify Configuration

**netlify.toml** (already configured):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"

# API redirects
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-domain.com/api/:splat"
  status = 200
  force = true

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Site settings → Environment variables

2. **Add Variables**
   ```
   VITE_API_URL = https://your-backend-domain.com/api
   VITE_APP_ENV = production
   VITE_APP_NAME = OpenEdTex
   VITE_APP_VERSION = 2.1.0
   ```

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend

   # Initialize Railway project
   railway init

   # Set environment variables
   railway variables set DEBUG=False
   railway variables set SECRET_KEY=your-secret-key
   railway variables set DATABASE_URL=postgresql://...

   # Deploy
   railway up
   ```

4. **Get Backend URL**
   ```bash
   railway domain
   # Example: https://openedtex-backend.up.railway.app
   ```

### Option 2: Heroku

1. **Create Heroku Account**
   - Visit: https://heroku.com

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Deploy Backend**
   ```bash
   cd backend

   # Create Heroku app
   heroku create your-openedtex-backend

   # Add PostgreSQL
   heroku addons:create heroku-postgresql:hobby-dev

   # Set environment variables
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DJANGO_SETTINGS_MODULE=config.settings.production

   # Deploy
   git push heroku main
   ```

4. **Run Migrations**
   ```bash
   heroku run python manage.py migrate
   heroku run python manage.py createsuperuser
   ```

### Option 3: Render

1. **Create Render Account**
   - Visit: https://render.com

2. **Connect Repository**
   - New → Web Service
   - Connect GitHub repository
   - Configure build settings

3. **Environment Variables**
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://...
   DJANGO_SETTINGS_MODULE=config.settings.production
   ```

### Backend Configuration Files

**requirements.txt** (Production):
```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
dj-database-url==2.1.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
whitenoise==6.6.0
boto3==1.34.34
django-storages==1.14.2
redis==5.0.1
django-redis==5.4.0
```

**Procfile** (for Heroku):
```
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate
```

---

## Database Setup

### PostgreSQL Setup

#### Railway (Automatic)
```bash
# Railway provides PostgreSQL automatically
railway variables get DATABASE_URL
```

#### Heroku (Automatic)
```bash
# Heroku provides PostgreSQL automatically
heroku config:get DATABASE_URL
```

#### Manual PostgreSQL Setup
```bash
# Install PostgreSQL locally (for development)
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb openedtex_db
sudo -u postgres createuser openedtex_user
sudo -u postgres psql -c "ALTER USER openedtex_user PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE openedtex_db TO openedtex_user;"
```

### Database Migration

1. **Backup Existing Data** (if migrating)
   ```bash
   cd backend
   python manage.py dumpdata > backup.json
   ```

2. **Update Settings**
   ```python
   # backend/config/settings/production.py
   DATABASES = {
       'default': dj_database_url.config(
           default=os.getenv('DATABASE_URL'),
           conn_max_age=600,
           conn_health_checks=True,
       )
   }
   ```

3. **Run Migrations**
   ```bash
   # For Railway/Heroku
   railway run python manage.py migrate
   # OR
   heroku run python manage.py migrate

   # For local
   python manage.py migrate
   ```

4. **Restore Data** (if migrating)
   ```bash
   python manage.py loaddata backup.json
   ```

---

## Configuration

### 1. Update Netlify Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Required
VITE_API_URL=https://your-backend-domain.com/api

# Optional
VITE_APP_ENV=production
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=your_hotjar_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Update Backend CORS Settings

```python
# backend/config/settings/production.py
CORS_ALLOWED_ORIGINS = [
    "https://your-netlify-site.netlify.app",
    "https://staging.your-netlify-site.netlify.app",
]

# For development
if DEBUG:
    CORS_ALLOWED_ORIGINS += [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
```

### 3. SSL/HTTPS Configuration

**Netlify** (Automatic):
- SSL certificates are automatically provisioned
- HTTPS is enforced by default

**Backend** (Railway/Heroku):
- SSL is automatically configured
- HTTPS is enforced

### 4. Domain Configuration

1. **Custom Domain (Netlify)**
   - Site settings → Domain management
   - Add custom domain
   - Configure DNS records

2. **Update Environment Variables**
   ```bash
   # Update VITE_API_URL with custom domain
   VITE_API_URL=https://api.yourdomain.com/api
   ```

---

## Testing & Validation

### 1. Frontend Testing

```bash
# Build test
npm run build:netlify

# Preview build
npm run preview

# Lighthouse audit
npx lighthouse http://localhost:4173
```

### 2. Backend Testing

```bash
# Test API endpoints
curl https://your-backend-domain.com/api/

# Test database connection
python manage.py dbshell --command="SELECT version();"

# Run Django tests
python manage.py test
```

### 3. Integration Testing

```bash
# Test frontend-backend communication
curl https://your-netlify-site.netlify.app/api/health

# Test authentication flow
# Register → Login → Access protected routes
```

### 4. Performance Testing

```bash
# Bundle analyzer
npm run build:analyze

# Web Vitals
# Check in Chrome DevTools → Lighthouse

# API response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-backend-domain.com/api/
```

### 5. Security Testing

```bash
# SSL test
curl -I https://your-netlify-site.netlify.app

# Security headers
curl -I https://your-backend-domain.com/api/

# CORS test
curl -H "Origin: https://your-netlify-site.netlify.app" \
     https://your-backend-domain.com/api/
```

---

## Monitoring & Maintenance

### 1. Netlify Analytics

- **Real-time Metrics**: Page views, bandwidth, build times
- **Performance**: Core Web Vitals, Lighthouse scores
- **Errors**: JavaScript errors, failed requests
- **Forms**: Form submissions and spam detection

### 2. Backend Monitoring

#### Railway
```bash
# View logs
railway logs

# Monitor usage
railway usage
```

#### Heroku
```bash
# View logs
heroku logs --tail

# Monitor performance
heroku ps
```

### 3. Database Monitoring

```bash
# Check connections
python manage.py dbshell --command="SELECT * FROM pg_stat_activity;"

# Monitor slow queries
# Enable query logging in Django settings
```

### 4. Health Checks

**Create health check endpoint:**
```python
# backend/health_check/views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Test database connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        db_status = "healthy"
    except:
        db_status = "unhealthy"

    return JsonResponse({
        "status": "healthy" if db_status == "healthy" else "unhealthy",
        "database": db_status,
        "timestamp": timezone.now().isoformat()
    })
```

### 5. Backup Strategy

```bash
# Database backup
python manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json

# Automated backups (Railway/Heroku provide this)
# Or use pg_dump for PostgreSQL
```

---

## Troubleshooting

### Common Frontend Issues

**Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build:netlify

# Check build logs in Netlify dashboard
```

**404 Errors on Refresh**
```bash
# Check _redirects file in public/
cat public/_redirects

# Should contain: /* /index.html 200
```

**API Connection Issues**
```bash
# Check environment variables
echo $VITE_API_URL

# Test API endpoint
curl https://your-backend-domain.com/api/
```

### Common Backend Issues

**Application Not Starting**
```bash
# Check logs
heroku logs --tail
railway logs

# Check environment variables
heroku config
railway variables
```

**Database Connection Issues**
```bash
# Test database connection
python manage.py dbshell

# Check DATABASE_URL
echo $DATABASE_URL
```

**Static Files Not Loading**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Check static files configuration
python manage.py check --deploy
```

### Performance Issues

**Slow Page Loads**
```bash
# Check bundle size
npm run build:analyze

# Optimize images
# Use WebP format
# Implement lazy loading
```

**Slow API Responses**
```bash
# Add database indexes
# Implement caching
# Use connection pooling
# Optimize queries
```

### Deployment Issues

**Netlify Build Timeout**
```bash
# Reduce bundle size
# Remove unused dependencies
# Optimize build process
```

**Backend Memory Issues**
```bash
# Increase server resources
# Optimize Django settings
# Use connection pooling
# Implement caching
```

---

## Performance Optimization

### 1. Frontend Optimizations

**Bundle Analysis**
```bash
# Analyze bundle size
npm run build:analyze

# Identify large dependencies
# Consider code splitting
# Remove unused code
```

**Image Optimization**
```bash
# Use WebP format
# Implement lazy loading
# Optimize image sizes
# Use CDN for images
```

**Caching Strategy**
```bash
# Service Worker for caching
# HTTP caching headers
# CDN caching
# Browser caching
```

### 2. Backend Optimizations

**Database Optimization**
```python
# Add indexes
class Meta:
    indexes = [
        models.Index(fields=['created_at']),
        models.Index(fields=['user', 'created_at']),
    ]

# Use select_related and prefetch_related
def get_queryset(self):
    return self.queryset.select_related('user').prefetch_related('tags')
```

**Caching**
```python
# Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# API caching
@method_decorator(cache_page(60 * 15), name='dispatch')
class MyView(generics.ListAPIView):
    pass
```

**Async Processing**
```python
# Use Celery for background tasks
# Process heavy operations asynchronously
# Queue email sending
# Process file uploads
```

### 3. CDN and Delivery

**Netlify CDN**
- Automatic CDN distribution
- Global edge network
- Automatic SSL
- DDoS protection

**Static Asset Optimization**
```bash
# Compress assets
# Use WebP images
# Minify CSS/JS
# Enable gzip/brotli
```

---

## Final Checklist

### Pre-Deployment
- [ ] Repository forked/cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Local development tested
- [ ] Build process tested

### Frontend Deployment
- [ ] Netlify account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)

### Backend Deployment
- [ ] Hosting platform selected
- [ ] Account created
- [ ] Repository connected
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Migrations run

### Database Setup
- [ ] PostgreSQL database created
- [ ] Connection string configured
- [ ] Migrations applied
- [ ] Data migrated (if applicable)
- [ ] Backups configured

### Configuration
- [ ] CORS settings updated
- [ ] SSL/HTTPS enabled
- [ ] Security headers configured
- [ ] API endpoints tested
- [ ] Authentication working

### Testing
- [ ] Frontend loading correctly
- [ ] Backend API responding
- [ ] Authentication flow working
- [ ] Database connections stable
- [ ] Performance acceptable

### Monitoring
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Performance monitoring active

---

## 🎉 Deployment Complete!

Your OpenEdTex application is now fully deployed and optimized for production use.

### Access Your Application
- **Frontend**: https://your-netlify-site.netlify.app
- **Backend API**: https://your-backend-domain.com/api
- **Admin Panel**: https://your-backend-domain.com/admin

### Next Steps
1. **Monitor Performance**: Use Netlify Analytics and Lighthouse
2. **Set Up Monitoring**: Configure error tracking and alerts
3. **Optimize Further**: Implement caching and performance improvements
4. **Scale**: Monitor usage and scale resources as needed
5. **Backup**: Ensure regular backups are working

### Support Resources
- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **Django Docs**: https://docs.djangoproject.com

**Happy Deploying! 🚀**