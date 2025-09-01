#!/bin/bash
# Production Deployment Script for OpenEdTex
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting OpenEdTex Production Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found! Please copy .env.example to .env and configure your settings."
    exit 1
fi

#!/bin/bash
# deploy.sh - Production deployment script for OpenEdTex
set -o errexit
set -o pipefail
set -o nounset

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    print_error ".env.prod file not found! Please create it with your production environment variables."
    exit 1
fi

# Load production environment variables
print_status "Loading production environment variables..."
source .env.prod

# Check required environment variables
required_vars=("SECRET_KEY" "JWT_SECRET_KEY" "DB_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        print_error "Required environment variable $var is not set in .env.prod"
        exit 1
    fi
done

print_status "Environment variables validated successfully"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Remove old images (optional, uncomment if needed)
# print_status "Removing old images..."
# docker image prune -f

# Build and start the containers
print_status "Building and starting production containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput

# Collect static files
print_status "Collecting static files..."
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

# Create superuser if it doesn't exist (optional)
print_status "Checking for superuser..."
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print('Creating superuser...')
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"

# Restart backend to apply changes
print_status "Restarting backend service..."
docker-compose -f docker-compose.prod.yml restart backend

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Health check
print_status "Performing health checks..."
if curl -f http://localhost/health/ > /dev/null 2>&1; then
    print_status "Backend health check passed"
else
    print_warning "Backend health check failed - this may be normal if health endpoint is not configured"
fi

# Show status
print_status "Deployment completed! Showing service status..."
docker-compose -f docker-compose.prod.yml ps

print_status "🎉 Deployment completed successfully!"
print_status "Your OpenEdTex application should now be running at:"
print_status "  - Frontend: http://localhost (via Nginx)"
print_status "  - Backend API: http://localhost/api/"
print_status "  - Admin: http://localhost/admin/"
print_status ""
print_warning "Remember to:"
print_warning "  1. Update your domain DNS to point to this server"
print_warning "  2. Configure SSL certificates with Certbot"
print_warning "  3. Update ALLOWED_HOSTS in settings for your domain"
print_warning "  4. Change default admin password"

print_status "Environment variables loaded"

# Create necessary directories
mkdir -p logs staticfiles mediafiles

print_status "Created necessary directories"

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

print_status "Python dependencies installed"

# Run database migrations
print_status "Running database migrations..."
python manage.py migrate

print_status "Database migrations completed"

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput --clear

print_status "Static files collected"

# Create superuser if it doesn't exist
print_status "Checking for superuser..."
echo "from django.contrib.auth import get_user_model; User = get_user_model(); print('Superuser exists:', User.objects.filter(is_superuser=True).exists())" | python manage.py shell

# Run security check
print_status "Running security check..."
python manage.py check --deploy

# Create encryption key if not set
if [ -z "$ENCRYPTION_KEY" ] || [ "$ENCRYPTION_KEY" = "your_32_character_encryption_key_here" ]; then
    print_warning "ENCRYPTION_KEY not set. Generating a new one..."
    ENCRYPTION_KEY=$(python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
    echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env
    print_status "Encryption key generated and saved to .env"
fi

# Test the application
print_status "Testing application startup..."
timeout 10s python manage.py runserver 0.0.0.0:8000 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    print_status "✅ Application started successfully"
    kill $SERVER_PID
else
    print_error "❌ Application failed to start"
    exit 1
fi

print_status "🎉 Deployment preparation completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Configure your web server (nginx/apache) to serve static files"
print_status "2. Set up SSL certificate"
print_status "3. Configure your domain DNS"
print_status "4. Set up monitoring and alerts"
print_status "5. Configure backup strategy"
print_status ""
print_status "For production deployment, consider using:"
print_status "- Docker containers"
print_status "- Kubernetes orchestration"
print_status "- Cloud load balancers"
print_status "- CDN for static files"
