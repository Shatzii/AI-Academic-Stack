#!/bin/bash

# OpenEdTex v2.0.0 Health Check Script
# Verifies that the codebase is ready for production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++))
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

echo "🔍 OpenEdTex v2.0.0 Health Check"
echo "================================="
echo ""

# Check if we're in the correct directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run from the School directory"
    exit 1
fi

# Check package.json version
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
if [[ "$VERSION" == "2.0.0" ]]; then
    print_success "Package version is correct: $VERSION"
else
    print_warning "Package version: $VERSION (expected 2.0.0)"
fi

# Check Node.js
NODE_VERSION=$(node --version)
print_status "Checking Node.js version..."
if command -v node &> /dev/null; then
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found"
fi

# Check npm
print_status "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm not found"
fi

# Check dependencies
print_status "Checking dependencies..."
if [[ -d "node_modules" ]]; then
    print_success "node_modules directory exists"
else
    print_warning "node_modules not found. Run 'npm install'"
fi

# Run ESLint check
print_status "Running ESLint check..."
if npm run lint &> /dev/null; then
    print_success "ESLint: 0 errors, 0 warnings ✅"
else
    print_error "ESLint failed"
fi

# Run TypeScript check
print_status "Running TypeScript check..."
if npm run type-check &> /dev/null; then
    print_success "TypeScript: 0 type errors ✅"
else
    print_error "TypeScript check failed"
fi

# Test build
print_status "Testing production build..."
if npm run build &> /dev/null; then
    print_success "Production build successful ✅"
    
    # Check build artifacts
    if [[ -d "dist" ]]; then
        print_success "Build artifacts generated in dist/"
        
        # Check main files
        if [[ -f "dist/index.html" ]]; then
            print_success "index.html generated"
        else
            print_error "index.html not found in build"
        fi
        
        # Check for CSS
        if find dist -name "*.css" | grep -q .; then
            print_success "CSS files generated"
        else
            print_error "No CSS files found in build"
        fi
        
        # Check for JS
        if find dist -name "*.js" | grep -q .; then
            print_success "JavaScript files generated"
        else
            print_error "No JavaScript files found in build"
        fi
        
    else
        print_error "dist/ directory not found"
    fi
else
    print_error "Production build failed"
fi

# Check configuration files
print_status "Checking configuration files..."

if [[ -f "vite.config.js" ]]; then
    print_success "Vite configuration found"
else
    print_error "vite.config.js not found"
fi

if [[ -f ".eslintrc.json" ]]; then
    print_success "ESLint configuration found"
else
    print_error ".eslintrc.json not found"
fi

if [[ -f "tsconfig.json" ]]; then
    print_success "TypeScript configuration found"
else
    print_warning "tsconfig.json not found"
fi

# Summary
echo ""
echo "📊 Health Check Summary"
echo "======================"
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 All critical checks passed! Ready for production deployment.${NC}"
    echo ""
    echo "🚀 Quick deployment commands:"
    echo "   ./deploy.sh          # Run full deployment script"
    echo "   npm run build        # Build for production"
    echo "   npm run preview      # Preview production build"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues before deploying.${NC}"
    exit 1
fi