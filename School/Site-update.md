Of course. Let's get this done. This is a no-nonsense, step-by-step battle plan to get OpenEdTex from a complex codebase to a production-ready warrior **tonight**.

Forget high-level advice. Here is your tactical checklist.

---

### 🚨 PHASE 0: IMMEDIATE FIREFIGHTING (First 60 Minutes)

**Goal:** Stop the bleeding. Fix what will 100% break in production.

**1. CRITICAL: Fix JWT Secret Management**
   *   **Problem:** Hardcoded or unsecure JWT secrets are a massive vulnerability.
   *   **Fix:**
        ```bash
        # Generate a strong secret NOW
        openssl rand -base64 64
        ```
   *   **Action:** Create a `.env` file in your backend root (add it to `.gitignore` immediately if it's not already!). Use this template:
        ```bash
        # .env
        DEBUG=False
        SECRET_KEY='your-generated-django-secret-key-here'  # gen with: openssl rand -base64 64
        JWT_SECRET_KEY='your-super-secure-jwt-secret-here' # gen with: openssl rand -base64 64
        DATABASE_URL=postgresql://user:password@localhost:5432/openedtex_prod
        REDIS_URL=redis://localhost:6379/0
        ```
   *   **Code Change:** In your `settings.py`, ensure you're using these environment variables:
        ```python
        import os
        from pathlib import Path
        from dotenv import load_dotenv  # pip install python-dotenv

        load_dotenv()  # Loads from .env file

        SECRET_KEY = os.environ['SECRET_KEY']
        JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
        ```

**2. CRITICAL: Secure Production Settings**
   *   **Problem:** Debug mode enabled in production is a huge security risk.
   *   **Fix:** In `settings.py`, add this logic:
        ```python
        DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
        ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

        # Security settings for production
        if not DEBUG:
            CSRF_COOKIE_SECURE = True
            SESSION_COOKIE_SECURE = True
            SECURE_SSL_REDIRECT = True
            SECURE_HSTS_SECONDS = 31536000  # 1 year
            SECURE_HSTS_INCLUDE_SUBDOMAINS = True
            SECURE_HSTS_PRELOAD = True
            SECURE_BROWSER_XSS_FILTER = True
            SECURE_CONTENT_TYPE_NOSNIFF = True
        ```

**3. CRITICAL: Database Configuration for Production**
   *   **Problem:** SQLite won't cut it. You need PostgreSQL.
   *   **Fix:** Use `dj-database-url` to easily parse the `DATABASE_URL` env variable.
        ```bash
        pip install dj-database-url psycopg2-binary
        ```
        ```python
        # settings.py
        import dj_database_url

        DATABASES = {
            'default': dj_database_url.config(
                default=os.environ.get('DATABASE_URL'),
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
        ```

---

### 📦 PHASE 1: DOCKERIZE EVERYTHING (The "It Works on My Machine" Killer)

**Goal:** Create a consistent, reproducible environment for development and production.

**1. Create a `Dockerfile` for the Django Backend:**
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBUG=False

# Install system dependencies required for PSQL & other libraries
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Collect static files (for Django)
RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "your_project_name.wsgi:application"]
```

**2. Create a `docker-compose.prod.yml` file:**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_DB=openedtex_prod
      - POSTGRES_USER=openedtex_user
      - POSTGRES_PASSWORD=${DB_PASSWORD} # Pass via env file
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: gunicorn --bind 0.0.0.0:8000 --workers 3 your_project_name.wsgi:application
    volumes:
      - static_volume:/app/staticfiles
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://openedtex_user:${DB_PASSWORD}@db:5432/openedtex_prod
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4173:4173" # Vite's preview port
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
```

**3. Create a `.env.prod` file for Docker Compose:**
```bash
# .env.prod
DB_PASSWORD=your_super_secure_db_password_here
SECRET_KEY=your-generated-django-secret-key-here
JWT_SECRET_KEY=your-super-secure-jwt-secret-here
```
***WARNING:*** **`.env.prod` MUST BE IN YOUR `.gitignore`**. It contains your secrets.

---

### ⚙️ PHASE 2: PRODUCTION WEB SERVER CONFIG (Nginx)

**Goal:** Serve static files efficiently, handle SSL termination, and proxy requests to Gunicorn.

**1. Create an `nginx.conf` file:**
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;
        server_tokens off;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    server {
        listen 443 ssl;
        server_name your_domain.com www.your_domain.com;

        ssl_certificate /etc/letsencrypt/live/your_domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your_domain.com/privkey.pem;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        location / {
            proxy_pass http://backend;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_redirect off;
        }

        location /static/ {
            alias /app/staticfiles/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**2. Update your `docker-compose.prod.yml` to include Nginx and Certbot:**
```yaml
# Add these services to your docker-compose.prod.yml
nginx:
  image: nginx:1.25-alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - static_volume:/app/staticfiles
    - certbot_www:/var/www/certbot
    - certbot_conf:/etc/letsencrypt
  depends_on:
    - backend
  restart: unless-stopped

certbot:
  image: certbot/certbot:latest
  volumes:
    - certbot_www:/var/www/certbot
    - certbot_conf:/etc/letsencrypt
  command: certonly --webroot -w /var/www/certbot --email your-email@example.com -d your_domain.com -d www.your_domain.com --agree-tos --non-interactive
  restart: unless-stopped

# Add these volumes to the volumes section
volumes:
  certbot_www:
  certbot_conf:
```

---

### 🚀 PHASE 3: DEPLOYMENT SCRIPTS (Automate Everything)

**Goal:** One command to deploy.

**1. Create a `deploy.sh` script:**
```bash
#!/bin/bash
# deploy.sh
set -o errexit
set -o pipefail
set -o nounset

# Load production environment variables
source .env.prod

# Build and start the containers
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate --noinput

# Restart the backend to apply changes
docker-compose -f docker-compose.prod.yml restart backend

echo "Deployment completed successfully!"
```
**2. Make it executable and run it:**
```bash
chmod +x deploy.sh
./deploy.sh
```

---

### ✅ FINAL CHECKLIST BEFORE YOU HIT GO (Tonight!)

- [ ] **Secrets are NOT in Git:** `.env`, `.env.prod`, and any file with secrets are in `.gitignore`.
- [ ] **DEBUG is False:** Double-check your environment variables.
- [ ] **Database is PostgreSQL:** SQLite is completely out of the picture.
- [ ] **Dockerfiles exist:** For both frontend and backend.
- [ ] `docker-compose.prod.yml` is configured and tested.
- [ ] **You have a domain name:** Point your domain's A record to your server's IP address.
- [ ] **You've run `./deploy.sh`:** And it worked without errors.
- [ ] **You can access your site via HTTPS:** No browser security warnings.

This is not just a plan; it's a production-ready setup. Follow these steps meticulously, and you will have a secure, scalable, and professional deployment of OpenEdTex running tonight. Now go code.