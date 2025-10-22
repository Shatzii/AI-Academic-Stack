# 🚀 OpenEdTex Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **CRITICAL: Security Setup**
- [ ] **Secrets Generated**: Run `openssl rand -base64 64` to generate secure SECRET_KEY and JWT_SECRET_KEY
- [ ] **Environment Variables**: Update `.env.prod` with your actual values
- [ ] **DEBUG=False**: Ensure DEBUG is set to False in production
- [ ] **ALLOWED_HOSTS**: Update with your actual domain name
- [ ] **Database Password**: Set a strong password for PostgreSQL

### ✅ **Domain & DNS**
- [ ] **Domain Purchased**: You have a domain name (e.g., yourdomain.com)
- [ ] **DNS Configured**: A record points to your server's IP address
- [ ] **SSL Ready**: Domain ready for Let's Encrypt certificates

### ✅ **Server Requirements**
- [ ] **Docker & Docker Compose**: Installed on your server
- [ ] **Ports Available**: 80, 443, 8000 available
- [ ] **Memory**: At least 2GB RAM recommended
- [ ] **Storage**: Sufficient space for database and media files

---

## 🏗️ **Quick Deployment**

### 1. **Clone and Setup**
```bash
git clone <your-repo-url>
cd OpenEdTex/backend
```

### 2. **Configure Environment**
```bash
# Copy and edit production environment
cp .env.prod.example .env.prod
nano .env.prod  # Edit with your actual values
```

### 3. **Deploy**
```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### 4. **SSL Setup (After DNS Propagation)**
```bash
# Run certbot to get SSL certificates
docker-compose -f docker-compose.prod.yml run --rm certbot

# Restart nginx to use SSL
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🔧 **Configuration Files**

### **Required Environment Variables (.env.prod)**
```bash
# Database
DB_PASSWORD=your_super_secure_db_password

# Django Secrets (generate with: openssl rand -base64 64)
SECRET_KEY=your-generated-secret-key-here
JWT_SECRET_KEY=your-generated-jwt-secret-key-here

# Domain
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=your-s3-bucket
```

### **Domain Configuration**
Update these files with your actual domain:
- `nginx.conf`: Replace `yourdomain.com` with your domain
- `docker-compose.prod.yml`: Update certbot command with your domain
- `.env.prod`: Update ALLOWED_HOSTS and CORS settings

---

## 📊 **Post-Deployment Verification**

### **Health Checks**
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check backend health
curl http://localhost/health/

# Check frontend
curl http://localhost

# Check SSL
curl -I https://yourdomain.com
```

### **Access Points**
- **Frontend**: https://yourdomain.com
- **API**: https://yourdomain.com/api/
- **Admin**: https://yourdomain.com/admin/
- **API Docs**: https://yourdomain.com/swagger/

### **Database Access**
```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U openedtex_user -d openedtex_prod
```

---

## 🔄 **Maintenance & Updates**

### **Update Deployment**
```bash
# Pull latest changes
git pull origin main

# Rebuild and redeploy
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

### **Backup Database**
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U openedtex_user openedtex_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U openedtex_user -d openedtex_prod < backup_file.sql
```

### **Monitor Logs**
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# View specific service logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs nginx
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Port 80/443 Already in Use**
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

**2. Database Connection Failed**
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs db

# Reset database
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d db
```

**3. SSL Certificate Issues**
```bash
# Renew certificates
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

**4. Static Files Not Loading**
```bash
# Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

---

## 📞 **Support & Monitoring**

### **Monitoring Commands**
```bash
# System resources
docker stats

# Container health
docker ps

# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# Database size
docker-compose -f docker-compose.prod.yml exec db psql -U openedtex_user -d openedtex_prod -c "SELECT pg_size_pretty(pg_database_size('openedtex_prod'));"
```

### **Performance Tuning**
- **Gunicorn Workers**: Adjust based on CPU cores (2-4 workers per core)
- **Database Connections**: Monitor connection pool usage
- **Redis Memory**: Monitor Redis memory usage
- **Static File Caching**: Ensure proper cache headers

---

## 🎯 **Final Checklist**

- [ ] **✅ Deployment successful**: All containers running
- [ ] **✅ SSL working**: HTTPS enabled with valid certificate
- [ ] **✅ Domain configured**: Website accessible via domain
- [ ] **✅ Database connected**: Migrations applied successfully
- [ ] **✅ Static files served**: CSS/JS loading correctly
- [ ] **✅ Admin accessible**: Django admin working
- [ ] **✅ API responding**: Backend API endpoints functional
- [ ] **✅ Frontend loading**: React app displaying correctly
- [ ] **✅ Backups configured**: Database backup script in place
- [ ] **✅ Monitoring active**: Logs and health checks working

---

**🎉 Congratulations! Your OpenEdTex platform is now live and production-ready!**

**Access your application at: https://yourdomain.com**

*Remember to regularly update your deployment, monitor performance, and keep security patches current.*
