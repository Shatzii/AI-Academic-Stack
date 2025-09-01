#!/bin/bash

# OpenEdTex Complete Project Setup Script
# This script automates the entire setup process for the OpenEdTex platform

set -e  # Exit on any error

echo "🚀 OpenEdTex Complete Setup"
echo "==========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the OpenEdTex project root directory"
    exit 1
fi

print_info "Setting up OpenEdTex platform..."
echo ""

# Step 1: Install Python dependencies
print_info "Step 1: Installing Python dependencies..."
cd backend
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    print_status "Python dependencies installed"
else
    print_warning "requirements.txt not found, installing essential packages..."
    pip install django djangorestframework python-dotenv cryptography psycopg2-binary redis
    print_status "Essential Python packages installed"
fi
cd ..
echo ""

# Step 2: Install Node.js dependencies
print_info "Step 2: Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_status "Node.js dependencies installed"
else
    print_error "package.json not found"
    exit 1
fi
echo ""

# Step 3: Setup secrets
print_info "Step 3: Setting up secrets management..."
if [ -f "setup_secrets.sh" ]; then
    print_info "Running interactive secrets setup..."
    print_warning "Please provide your actual API keys and secrets when prompted"
    bash setup_secrets.sh
else
    print_warning "setup_secrets.sh not found, running basic secrets validation..."
    python backend/secrets_validator.py
fi
echo ""

# Step 4: Database setup
print_info "Step 4: Setting up database..."
cd backend

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    print_info "PostgreSQL found, setting up database..."

    # Get database credentials from secrets or env
    DB_NAME=${DB_NAME:-openedtex_db}
    DB_USER=${DB_USER:-openedtex_user}
    DB_PASSWORD=${DB_PASSWORD:-$(python -c "from secrets_manager import SecretsManager; sm = SecretsManager(); print(sm.decrypt_secret('DB_PASSWORD') or 'postgres')")}

    # Create database if it doesn't exist
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || print_warning "User may already exist"
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || print_warning "Database may already exist"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true

    print_status "Database setup completed"
else
    print_warning "PostgreSQL not found. Please install PostgreSQL and run:"
    print_info "  sudo apt-get install postgresql postgresql-contrib"
    print_info "  Then re-run this script or manually create the database"
fi

# Run Django migrations
print_info "Running Django migrations..."
python manage.py migrate
print_status "Database migrations completed"

# Create superuser (optional)
read -p "Do you want to create a Django superuser? (y/n): " create_superuser
if [[ $create_superuser =~ ^[Yy]$ ]]; then
    print_info "Creating Django superuser..."
    python manage.py createsuperuser
    print_status "Superuser created"
fi

cd ..
echo ""

# Step 5: Build frontend
print_info "Step 5: Building frontend assets..."
npm run build
print_status "Frontend built successfully"
echo ""

# Step 6: Setup Docker (optional)
read -p "Do you want to setup Docker containers? (y/n): " setup_docker
if [[ $setup_docker =~ ^[Yy]$ ]]; then
    print_info "Step 6: Setting up Docker containers..."
    if [ -f "backend/docker-compose.yml" ]; then
        cd backend
        docker-compose up -d
        print_status "Docker containers started"
        cd ..
    else
        print_warning "docker-compose.yml not found in backend directory"
    fi
fi
echo ""

# Step 7: Final validation
print_info "Step 7: Running final validation..."
python backend/secrets_validator.py
echo ""

# Step 8: Display next steps
print_info "🎉 Setup completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Start the backend server:"
print_info "     cd backend && python manage.py runserver"
echo ""
echo "  2. Start the frontend development server:"
print_info "     npm run dev"
echo ""
echo "  3. Open your browser to:"
print_info "     Frontend: http://localhost:5173"
print_info "     Backend API: http://localhost:8000"
echo ""
echo "  4. Access Django admin:"
print_info "     http://localhost:8000/admin/"
echo ""
print_info "For production deployment:"
echo "  - Configure production secrets in the secrets manager"
echo "  - Update ALLOWED_HOSTS in Django settings"
echo "  - Setup nginx reverse proxy"
echo "  - Configure SSL certificates"
echo "  - Setup monitoring and logging"
echo ""
print_status "Happy coding with OpenEdTex! 🚀"
