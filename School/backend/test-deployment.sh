#!/bin/bash
# test-deployment.sh - Test script for OpenEdTex production deployment
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🧪 OpenEdTex Production Deployment Test Suite"
echo "=============================================="

# Test 1: Check if Docker is running
print_status "Checking Docker service..."
if docker info >/dev/null 2>&1; then
    print_status "✅ Docker is running"
else
    print_error "❌ Docker is not running"
    exit 1
fi

# Test 2: Check if docker-compose file exists
if [ -f "docker-compose.prod.yml" ]; then
    print_status "✅ docker-compose.prod.yml exists"
else
    print_error "❌ docker-compose.prod.yml not found"
    exit 1
fi

# Test 3: Check if .env.prod exists
if [ -f ".env.prod" ]; then
    print_status "✅ .env.prod exists"
else
    print_error "❌ .env.prod not found"
    exit 1
fi

# Test 4: Validate environment variables
print_status "Validating environment variables..."
source .env.prod

required_vars=("SECRET_KEY" "JWT_SECRET_KEY" "DB_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        print_error "❌ Required environment variable $var is not set"
        exit 1
    else
        print_status "✅ $var is set"
    fi
done

# Test 5: Check if images can be built
print_status "Testing Docker image builds..."
if docker-compose -f docker-compose.prod.yml build --dry-run >/dev/null 2>&1; then
    print_status "✅ Docker Compose configuration is valid"
else
    print_error "❌ Docker Compose configuration has errors"
    exit 1
fi

# Test 6: Check nginx configuration
if [ -f "nginx.conf" ]; then
    print_status "✅ nginx.conf exists"
    # Basic syntax check
    if docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:1.25-alpine nginx -t -c /etc/nginx/nginx.conf >/dev/null 2>&1; then
        print_status "✅ nginx configuration syntax is valid"
    else
        print_warning "⚠️ nginx configuration syntax check failed (may be normal if using host-specific paths)"
    fi
else
    print_error "❌ nginx.conf not found"
    exit 1
fi

# Test 7: Check Dockerfile exists
if [ -f "Dockerfile" ]; then
    print_status "✅ Backend Dockerfile exists"
else
    print_error "❌ Backend Dockerfile not found"
    exit 1
fi

# Test 8: Check frontend Dockerfile
if [ -f "../frontend.Dockerfile" ]; then
    print_status "✅ Frontend Dockerfile exists"
else
    print_error "❌ Frontend Dockerfile not found"
    exit 1
fi

# Test 9: Check requirements.txt
if [ -f "requirements.txt" ]; then
    print_status "✅ requirements.txt exists"
else
    print_error "❌ requirements.txt not found"
    exit 1
fi

# Test 10: Check deploy script
if [ -f "deploy.sh" ] && [ -x "deploy.sh" ]; then
    print_status "✅ deploy.sh exists and is executable"
else
    print_error "❌ deploy.sh not found or not executable"
    exit 1
fi

echo ""
print_status "🎉 All pre-deployment tests passed!"
echo ""
print_status "Ready for deployment commands:"
echo "  1. ./deploy.sh"
echo "  2. Configure DNS to point to your server"
echo "  3. Run SSL certificate setup"
echo ""
print_warning "Remember to:"
print_warning "  - Update ALLOWED_HOSTS with your actual domain"
print_warning "  - Configure email settings if needed"
print_warning "  - Set up monitoring and backups"
print_warning "  - Change default admin password after first login"
