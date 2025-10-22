# OpenEdTex Enterprise Deployment Guide
## 🚀 Quick Start Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm
- Python 3.11+
- Git

### 📦 Archive Contents
This archive contains the complete OpenEdTex Enterprise platform:
- ✅ Django REST API Backend
- ✅ React Frontend Application
- ✅ PostgreSQL Database (production ready)
- ✅ Redis Caching System
- ✅ Nginx Load Balancer
- ✅ SSL/TLS Certificates
- ✅ Enterprise Documentation Suite
- ✅ Security & Monitoring Tools
- ✅ CI/CD Pipeline Configuration

## 🏗️ Deployment Steps

### 1. Extract Archive
```bash
tar -xzf OpenEdTex-Enterprise-v2.0.0.tar.gz
cd School
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Install Dependencies
```bash
# Backend dependencies
cd backend
pip install -r requirements.txt

# Frontend dependencies
cd ..
npm install
```

### 4. Database Setup
```bash
# Run migrations
cd backend
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 5. Build Frontend
```bash
# Build production assets
npm run build
```

### 6. SSL Certificate Setup (Production)
```bash
# For production, replace self-signed certificates
# Place your SSL certificates in backend/ssl/
# certificate.crt and private.key
```

### 7. Start Services
```bash
# Using Docker Compose (Recommended)
cd backend
docker-compose up -d

# Or run manually
python manage.py runserver &
npm run dev &
```

## 🔧 Configuration

### Environment Variables
Edit `.env` file with your settings:
```bash
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@db:5432/openedtex
REDIS_URL=redis://redis:6379/1
ALLOWED_HOSTS=yourdomain.com
```

### SSL Configuration
- Self-signed certificates included for development
- Replace with production certificates for live deployment
- Update `backend/nginx.conf` for your domain

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Run health check
./backend/health_check.sh

# Monitor system
./backend/monitor.sh &
```

### Security Audit
```bash
# Run security audit
./backend/security_audit.sh
```

### Backup System
```bash
# Automated backup
./backend/backup.sh
```

## 🌐 Production Deployment

### Cloud Platforms
- **AWS**: Use ECS/EC2 with RDS and ElastiCache
- **Azure**: Use AKS with Azure Database and Cache
- **GCP**: Use GKE with Cloud SQL and Memorystore

### Domain Configuration
1. Point domain to your server
2. Update ALLOWED_HOSTS in settings
3. Configure SSL certificates
4. Update nginx configuration

### Scaling
- Use Docker Compose scaling for multiple instances
- Configure load balancer for high availability
- Set up database read replicas for performance

## 📚 Documentation

### Included Documentation
- `README.md` - Main platform documentation
- `ENTERPRISE_PLATFORM_OVERVIEW.md` - Executive summary
- `backend/PRODUCTION_DEPLOYMENT_README.md` - Deployment guide
- `SECRETS.md` - Security configuration
- `STUDENT_ID_SYSTEM_README.md` - Student ID system

### Compliance Documentation
- `PRIVACY_POLICY.md` - GDPR compliance
- `TERMS_OF_SERVICE.md` - Legal terms
- `DATA_SUBJECT_REQUEST.md` - Data protection procedures

## 🆘 Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Verify DATABASE_URL in .env
3. **SSL errors**: Check certificate paths and permissions
4. **Permission errors**: Run with appropriate user permissions

### Logs Location
- Application logs: `backend/logs/`
- Nginx logs: `/var/log/nginx/`
- Docker logs: `docker-compose logs`

### Support
- Check documentation in `docs/` directory
- Review `backend/README.md` for API documentation
- Run `./pre_production_checklist.sh` for system validation

## 🎯 Features Overview

### Core Educational Features
- **Student Management**: Registration, profiles, ID cards
- **Course Management**: Creation, enrollment, progress tracking
- **Classroom System**: Virtual classrooms with real-time features
- **AI Assistant**: Educational AI support and recommendations
- **Analytics Dashboard**: Performance metrics and insights

### Enterprise Features
- **Multi-tenancy**: Support for multiple institutions
- **Role-based Access**: Admin, teacher, student permissions
- **Audit Trail**: Complete activity logging
- **Compliance Ready**: GDPR, FERPA, LFPDPPP compliant
- **Scalable Architecture**: Microservices-ready design

### Security Features
- **End-to-end Encryption**: Data protection at rest and in transit
- **Advanced Authentication**: MFA, OAuth, SSO support
- **Security Headers**: OWASP compliant security measures
- **Regular Audits**: Automated security scanning
- **Access Control**: Granular permission system

## 📞 Getting Help

1. **Documentation**: Start with `README.md`
2. **Pre-deployment**: Run `./pre_production_checklist.sh`
3. **Health Check**: Use `./backend/health_check.sh`
4. **Logs**: Check `backend/logs/` for detailed information

---

**OpenEdTex v2.0.0 - Enterprise Ready Online School Platform**
*Ready for immediate deployment and student enrollment!*
