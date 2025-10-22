# Production Database Setup for OpenEdTex

## Overview

OpenEdTex uses Django with database support. For production deployment on Netlify (frontend), you'll need a separate database service.

## Recommended Database Services

### 1. PostgreSQL on Railway (Recommended)
```bash
# Railway provides free PostgreSQL
# Sign up at: https://railway.app
```

### 2. PostgreSQL on Heroku
```bash
# Heroku Postgres add-on
heroku addons:create heroku-postgresql:hobby-dev
```

### 3. AWS RDS PostgreSQL
```bash
# For larger applications
# Use AWS RDS with PostgreSQL engine
```

### 4. Supabase (Firebase Alternative)
```bash
# Modern PostgreSQL service
# Sign up at: https://supabase.com
```

## Database Configuration

### 1. Update Django Settings

Create a production settings file:

```python
# backend/config/settings/production.py
import os
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Security settings for production
DEBUG = False
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = ['your-backend-domain.com']

# HTTPS settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

### 2. Environment Variables

Set these in your backend deployment service:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Django
SECRET_KEY=your-very-long-secret-key
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings.production

# Optional: Redis for caching
REDIS_URL=redis://your-redis-url:6379
```

## Migration Strategy

### From SQLite to PostgreSQL

1. **Backup current data** (if any):
```bash
cd backend
python manage.py dumpdata > data_backup.json
```

2. **Update settings to use PostgreSQL**:
```python
# Temporarily use both databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'your_db_host',
        'PORT': '5432',
    },
    'sqlite': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

3. **Run migrations**:
```bash
python manage.py migrate
```

4. **Migrate data** (if needed):
```bash
# If you have data to migrate
python manage.py loaddata data_backup.json
```

## Database Optimization

### Connection Pooling
```python
# Use connection pooling for better performance
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

### Indexing Strategy
```python
# Add database indexes for better performance
class Meta:
    indexes = [
        models.Index(fields=['created_at']),
        models.Index(fields=['user', 'created_at']),
    ]
```

### Caching
```python
# Redis caching for frequently accessed data
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## Monitoring & Maintenance

### Database Monitoring
```python
# Django Silk for query profiling
INSTALLED_APPS += ['silk']

# Django Debug Toolbar (development only)
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
```

### Backup Strategy
```bash
# Automated backups
# Use your database provider's backup features
# Or set up custom backup scripts
```

### Performance Optimization
```python
# Database query optimization
class YourModel(models.Model):
    class Meta:
        ordering = ['-created_at']  # Default ordering
        indexes = [
            models.Index(fields=['field_name']),
        ]
```

## Deployment Checklist

- [ ] Database service created and configured
- [ ] Environment variables set
- [ ] SSL certificate configured
- [ ] Database migrations run
- [ ] Data migrated (if applicable)
- [ ] Connection pooling configured
- [ ] Caching set up
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented

## Troubleshooting

### Common Issues

**Connection Refused**
```bash
# Check database URL format
echo $DATABASE_URL

# Test connection
python manage.py dbshell
```

**Migration Errors**
```bash
# Check migration status
python manage.py showmigrations

# Fix conflicts
python manage.py makemigrations --merge
```

**Performance Issues**
```bash
# Enable query logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

## Cost Optimization

### Free Tier Options
- **Railway**: 512MB PostgreSQL free
- **Heroku**: 1GB PostgreSQL free
- **Supabase**: 500MB PostgreSQL free

### Paid Tier Recommendations
- **Railway**: $5/month for 1GB
- **Heroku**: $9/month for 1GB
- **AWS RDS**: Pay-as-you-go

## Security Best Practices

- Use strong, unique passwords
- Enable SSL/TLS connections
- Regularly update database software
- Implement proper access controls
- Use environment variables for credentials
- Enable database auditing (if available)
- Regular security updates and patches