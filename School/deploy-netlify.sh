#!/bin/bash

# Netlify Deployment Script for OpenEdTex
# This script handles the complete deployment process for Netlify

set -e

echo "🚀 Starting OpenEdTex Netlify Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi

    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI is not installed. Installing..."
        npm install -g netlify-cli
    fi

    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run linting and type checking
run_quality_checks() {
    print_status "Running quality checks..."

    if npm run lint; then
        print_success "Linting passed"
    else
        print_error "Linting failed"
        exit 1
    fi

    if npm run type-check; then
        print_success "Type checking passed"
    else
        print_warning "Type checking failed, but continuing..."
    fi
}

# Build the application
build_application() {
    print_status "Building application for production..."

    # Clean previous build
    rm -rf dist

    # Build with production optimizations
    if npm run build:netlify; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi

    # Check build size
    if command -v du &> /dev/null; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        print_status "Build size: $BUILD_SIZE"
    fi
}

# Deploy to Netlify
deploy_to_netlify() {
    print_status "Deploying to Netlify..."

    # Check if we're in a Netlify environment
    if [ -n "$NETLIFY" ]; then
        print_status "Running in Netlify CI/CD environment"
        # Netlify will automatically deploy based on netlify.toml
        print_success "Netlify deployment configured"
    else
        # Manual deployment
        if [ -n "$1" ] && [ "$1" = "production" ]; then
            print_status "Deploying to production..."
            netlify deploy --prod --dir=dist
        else
            print_status "Deploying to preview..."
            netlify deploy --dir=dist
        fi
    fi
}

# Run performance tests
run_performance_tests() {
    print_status "Running performance tests..."

    if command -v lighthouse &> /dev/null; then
        print_status "Running Lighthouse audit..."
        npx lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report.json || true
        print_success "Performance test completed"
    else
        print_warning "Lighthouse not available, skipping performance tests"
    fi
}

# Main deployment process
main() {
    local deploy_env=${1:-"preview"}

    echo "🎯 OpenEdTex Netlify Deployment Script"
    echo "====================================="
    echo "Environment: $deploy_env"
    echo ""

    check_dependencies
    install_dependencies
    run_quality_checks
    build_application

    # Start preview server for testing (optional)
    if [ "$deploy_env" = "preview" ]; then
        print_status "Starting preview server..."
        npm run preview &
        PREVIEW_PID=$!

        # Wait a moment for server to start
        sleep 3

        # Run performance tests
        run_performance_tests

        # Kill preview server
        kill $PREVIEW_PID 2>/dev/null || true
    fi

    deploy_to_netlify "$deploy_env"

    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Check your Netlify dashboard for deployment status"
    echo "2. Update your backend API URL in Netlify environment variables"
    echo "3. Configure custom domain if needed"
    echo "4. Set up monitoring and analytics"
}

# Handle command line arguments
case "${1:-}" in
    "production"|"prod")
        main "production"
        ;;
    "preview"|"staging")
        main "preview"
        ;;
    "build-only")
        check_dependencies
        install_dependencies
        run_quality_checks
        build_application
        print_success "Build completed (deployment skipped)"
        ;;
    "help"|"-h"|"--help")
        echo "OpenEdTex Netlify Deployment Script"
        echo ""
        echo "Usage:"
        echo "  ./deploy.sh                 # Deploy to preview"
        echo "  ./deploy.sh production      # Deploy to production"
        echo "  ./deploy.sh preview         # Deploy to preview"
        echo "  ./deploy.sh build-only      # Build only, no deployment"
        echo "  ./deploy.sh help            # Show this help"
        ;;
    *)
        main "preview"
        ;;
esac