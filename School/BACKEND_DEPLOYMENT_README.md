# Django Backend Deployment Guide

## Overview

For Netlify frontend deployment, deploy your Django backend separately using one of these services:

## 🚀 Recommended Deployment Options

### 1. Railway (Recommended - Easiest)
```bash
# Railway provides free tier with PostgreSQL
# https://railway.app

# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 2. Heroku (Popular Choice)
```bash
# Heroku with free tier
# https://heroku.com

# Install Heroku CLI
npm install -g heroku

# Deploy
heroku create your-app-name
git push heroku main
```

### 3. Render (Good Alternative)
```bash
# Render - Modern cloud platform
# https://render.com

# Connect GitHub repo
# Automatic deployments
```

### 4. DigitalOcean App Platform
```bash
# DigitalOcean - Reliable hosting
# https://digitalocean.com

# App specs: 1GB RAM, 1 vCPU free
```

## 📋 Backend Configuration for Production

### 1. Environment Variables

Create a `.env.production` file:

```bash
# Django Core
DEBUG=False
SECRET_KEY=your-production-secret-key-here
DJANGO_SETTINGS_MODULE=config.settings.production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security
ALLOWED_HOSTS=your-backend-domain.com,api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis (optional)
REDIS_URL=redis://your-redis-instance:6379

# File Storage (optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-bucket-name
```

### 2. Production Settings

Create `backend/config/settings/production.py`:

```python
import os
import dj_database_url
from .base import *

# Production settings
DEBUG = False
SECRET_KEY = os.getenv('SECRET_KEY')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Database
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CORS
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (if using cloud storage)
if os.getenv('AWS_ACCESS_KEY_ID'):
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    AWS_DEFAULT_ACL = 'public-read'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'

    STORAGES = {
        "default": {"BACKEND": "storages.backends.s3boto3.S3Boto3Storage"},
        "staticfiles": {"BACKEND": "storages.backends.s3boto3.S3StaticStorage"},
    }
```

### 3. Requirements Files

Create optimized requirements files:

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
python-decouple==3.8
boto3==1.34.34
django-storages==1.14.2
redis==5.0.1
django-redis==5.4.0
```

**requirements.dev.txt** (Development):
```
-r requirements.txt
django-debug-toolbar==4.2.0
silk==5.1.0
```

## 🛠️ Deployment Scripts

### Railway Deployment

1. **railway.json**:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT"
  }
}
```

2. **Deployment script**:
```bash
#!/bin/bash
# deploy-backend.sh

echo "🚀 Deploying Django Backend to Railway..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli
fi

# Login to Railway
railway login

# Initialize project
railway init django-backend

# Set environment variables
railway variables set DEBUG=False
railway variables set SECRET_KEY=$(openssl rand -hex 32)
railway variables set DATABASE_URL=$(railway variables get DATABASE_URL)

# Deploy
railway up

echo "✅ Backend deployed successfully!"
```

### Heroku Deployment

1. **Procfile**:
```
web: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
release: python manage.py migrate
```

2. **runtime.txt**:
```
python-3.12.1
```

3. **Deployment script**:
```bash
#!/bin/bash
# deploy-heroku.sh

echo "🚀 Deploying Django Backend to Heroku..."

# Create Heroku app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=$(openssl rand -hex 32)
heroku config:set DJANGO_SETTINGS_MODULE=config.settings.production

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser (optional)
heroku run python manage.py createsuperuser

echo "✅ Backend deployed to Heroku!"
```

## 🔧 API Optimization

### 1. CORS Configuration

```python
# config/settings/production.py
INSTALLED_APPS += [
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://your-netlify-site.netlify.app",
    "https://staging.yourdomain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

### 2. API Rate Limiting

```python
# config/settings/production.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

### 3. Caching

```python
# config/settings/production.py
# Redis caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# API caching
REST_FRAMEWORK['DEFAULT_CACHE'] = 'default'
```

## 📊 Monitoring & Logging

### 1. Error Tracking

```python
# config/settings/production.py
# Sentry for error tracking (optional)
if os.getenv('SENTRY_DSN'):
    import sentry_sdk
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN'),
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True
    )
```

### 2. Logging

```python
# config/settings/production.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

## 🔒 Security Checklist

- [ ] DEBUG = False
- [ ] SECRET_KEY is strong and unique
- [ ] ALLOWED_HOSTS configured
- [ ] HTTPS enabled (SSL/TLS)
- [ ] CORS properly configured
- [ ] Database credentials secured
- [ ] File permissions correct
- [ ] Dependencies updated
- [ ] Security headers configured

## 🚀 Performance Optimization

### 1. Database Optimization
```python
# Use database indexes
class Meta:
    indexes = [
        models.Index(fields=['created_at']),
        models.Index(fields=['user', 'created_at']),
    ]
```

### 2. Static Files
```python
# WhiteNoise for static files
MIDDLEWARE += [
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### 3. Gunicorn Configuration
```python
# gunicorn.conf.py
workers = 2
threads = 2
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer
- Session storage in Redis
- Database read replicas
- CDN for static files

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use async processing for heavy tasks

## 🔧 Troubleshooting

### Common Issues

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

# Check database URL
echo $DATABASE_URL
```

**Static Files Not Loading**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Check static files configuration
python manage.py check --deploy
```

## 📚 Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Railway Django Guide](https://docs.railway.app/)
- [Heroku Django Guide](https://devcenter.heroku.com/articles/getting-started-with-django)
- [Gunicorn Configuration](https://docs.gunicorn.org/en/stable/configure.html)

---

**Happy Deploying! 🎉**