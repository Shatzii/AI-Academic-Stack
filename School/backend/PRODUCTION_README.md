# OpenEdTex Production Deployment Guide

## 🚀 Security & Monitoring Fixes Applied

This deployment includes comprehensive security enhancements and monitoring capabilities:

### ✅ Security Improvements
- **Secure SECRET_KEY**: 50+ character cryptographically secure key
- **Production DEBUG**: Disabled in production environment
- **SSL Security**: HTTPS enforcement with secure headers
- **Secure Cookies**: HTTPOnly, Secure, and SameSite protection
- **Content Security Policy**: XSS protection and resource restrictions
- **Rate Limiting**: API protection against abuse
- **SQL Injection Protection**: Input sanitization middleware
- **Security Headers**: Comprehensive security headers implementation

### ✅ Monitoring & Observability
- **Error Logging**: Structured logging to files and console
- **Health Checks**: Automated health monitoring
- **Sentry Integration**: Error tracking and performance monitoring
- **Database Monitoring**: Connection health checks
- **System Monitoring**: Disk and memory usage alerts

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Nginx (for production serving)
- SSL Certificate
- Domain name

## 🔧 Quick Deployment

### 1. Environment Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your production values
```

### 2. Run Deployment Script
```bash
./deploy.sh
```

### 3. Start Services
```bash
# Using Docker Compose
docker-compose up -d

# Or manually
gunicorn --bind 0.0.0.0:8000 --workers 3 config.wsgi:application
```

## 🔒 Security Configuration

### Environment Variables
```bash
# Critical Security Settings
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=your-secure-50-char-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# SSL & HTTPS
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project_id
```

### SSL Certificate Setup
```bash
# Using Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Or manual certificate installation
sudo cp your-cert.crt /etc/ssl/certs/
sudo cp your-key.key /etc/ssl/private/
```

## 📊 Monitoring Setup

### Health Checks
```bash
# Run health check manually
./health_check.sh

# Set up cron job for automated checks
crontab -e
# Add: */5 * * * * /path/to/health_check.sh
```

### Log Monitoring
```bash
# View application logs
tail -f logs/django_error.log

# View health check logs
tail -f logs/health_check.log
```

### Sentry Configuration
1. Create project at [sentry.io](https://sentry.io)
2. Get DSN and add to `.env`
3. Errors will be automatically tracked

## 🐳 Docker Production Setup

### Production Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    environment:
      - ENVIRONMENT=production
    env_file:
      - .env
    volumes:
      - staticfiles:/app/staticfiles
      - mediafiles:/app/mediafiles
      - logs:/app/logs

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - staticfiles:/app/staticfiles
      - mediafiles:/app/mediafiles
      - ./ssl:/etc/ssl/certs
```

## 🔧 Nginx Configuration

1. Copy `nginx.conf` to `/etc/nginx/sites-available/openedtex`
2. Create symlink: `ln -s /etc/nginx/sites-available/openedtex /etc/nginx/sites-enabled/`
3. Test configuration: `nginx -t`
4. Reload: `nginx -s reload`

## 📈 Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_email ON users_user(email);
CREATE INDEX CONCURRENTLY idx_courses_instructor ON courses_course(instructor_id);
CREATE INDEX CONCURRENTLY idx_enrollments_student ON courses_enrollment(student_id);
```

### Caching Strategy
- Redis for session storage
- Database query caching
- Static file caching with CDN
- API response caching

### Background Tasks
```bash
# Set up Celery for background processing
celery -A config worker -l info
celery -A config beat -l info
```

## 🚨 Alerting & Incident Response

### Log Analysis
```bash
# Search for errors
grep "ERROR" logs/django_error.log

# Monitor failed requests
grep "500" logs/django_error.log

# Check for security incidents
grep "suspicious" logs/django_error.log
```

### Automated Alerts
- Set up monitoring dashboard
- Configure email/Slack alerts for:
  - 5xx errors
  - High memory/disk usage
  - Failed health checks
  - Security incidents

## 🔄 Backup Strategy

### Database Backups
```bash
# Automated daily backups
pg_dump -U username -h hostname database_name > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U username -h hostname database_name < backup_file.sql
```

### File Backups
```bash
# Backup media files
tar -czf media_backup_$(date +%Y%m%d).tar.gz mediafiles/

# Backup logs
tar -czf logs_backup_$(date +%Y%m%d).tar.gz logs/
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Monitor error logs weekly
- [ ] Review security headers monthly
- [ ] Update dependencies quarterly
- [ ] Performance optimization review
- [ ] Backup integrity checks

### Emergency Contacts
- DevOps Team: devops@yourcompany.com
- Security Team: security@yourcompany.com
- Infrastructure: infra@yourcompany.com

## 🎯 Success Metrics

Monitor these KPIs for deployment success:
- Response time < 500ms
- Error rate < 1%
- Uptime > 99.9%
- Security incidents = 0
- User satisfaction > 95%

---

**Deployment completed successfully!** 🎉

Your OpenEdTex application is now production-ready with enterprise-grade security and monitoring capabilities.
