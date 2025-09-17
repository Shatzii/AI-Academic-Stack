#!/bin/bash

# OpenEdTex v2.0.0 Deployment Script
# This script helps deploy the latest version of OpenEdTex

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
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

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    print_error "Please run this script from the School directory"
    exit 1
fi

print_status "OpenEdTex v2.0.0 Deployment Script"
echo "=================================="

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [[ $NODE_VERSION -lt 16 ]]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version check passed: $(node --version)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run quality checks
print_status "Running code quality checks..."

# ESLint check
print_status "Running ESLint..."
npm run lint
print_success "ESLint passed with zero issues ✅"

# TypeScript check
print_status "Running TypeScript check..."
npm run type-check
print_success "TypeScript check passed ✅"

# Build for production
print_status "Building for production..."
npm run build
print_success "Production build completed ✅"

# Display build statistics
print_status "Build Statistics:"
echo "=================="
if [[ -d "dist" ]]; then
    echo "📦 Build artifacts generated in dist/ folder"
    
    # Count files
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "📄 Total files: $FILE_COUNT"
    
    # Show main files sizes
    if [[ -f "dist/index.html" ]]; then
        INDEX_SIZE=$(du -h dist/index.html | cut -f1)
        echo "📄 index.html: $INDEX_SIZE"
    fi
    
    # Show CSS size
    CSS_FILES=$(find dist -name "*.css" | head -1)
    if [[ -n "$CSS_FILES" ]]; then
        CSS_SIZE=$(du -h "$CSS_FILES" | cut -f1)
        echo "🎨 CSS bundle: $CSS_SIZE"
    fi
    
    # Show JS bundle sizes
    echo "📦 JavaScript bundles:"
    find dist -name "*.js" -exec du -h {} \; | sort -hr | head -5
    
    echo ""
fi

# Preview option
echo ""
print_warning "Deployment Options:"
echo "=================="
echo "1. Preview build locally: npm run preview"
echo "2. Deploy to production server"
echo "3. Upload dist/ folder to your hosting provider"
echo ""

# Check if preview should be started
read -p "Would you like to preview the build locally? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting preview server..."
    print_success "Build will be available at http://localhost:4173"
    print_warning "Press Ctrl+C to stop the preview server"
    npm run preview
fi

print_success "OpenEdTex v2.0.0 deployment script completed!"
echo ""
print_status "Next Steps:"
echo "==========="
echo "1. 📦 Upload the dist/ folder to your web server"
echo "2. 🔧 Configure your web server to serve the files"
echo "3. 🌐 Point your domain to the deployment"
echo "4. ✅ Verify the deployment is working"
echo ""
print_success "Happy deploying! 🚀"