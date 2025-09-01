#!/bin/bash

# OpenEdTex Security Audit Script
# This script performs comprehensive security checks

echo "🔒 OpenEdTex Security Audit"
echo "==========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print status
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

echo "🔍 Performing Security Audit..."
echo ""

# 1. Check for security vulnerabilities in npm packages
print_info "1. Checking npm package vulnerabilities..."
npm audit --audit-level moderate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "No critical npm vulnerabilities found"
else
    print_warning "NPM vulnerabilities detected. Run 'npm audit fix' to address them"
fi

# 2. Check for outdated packages
print_info "2. Checking for outdated packages..."
OUTDATED=$(npm outdated 2>/dev/null | wc -l)
if [ "$OUTDATED" -gt 1 ]; then
    print_warning "$((OUTDATED-1)) packages are outdated. Consider updating them"
else
    print_status "All packages are up to date"
fi

# 3. Check Python dependencies
print_info "3. Checking Python dependencies..."
cd backend
OUTDATED_PY=$(pip list --outdated 2>/dev/null | wc -l)
if [ "$OUTDATED_PY" -gt 2 ]; then
    print_warning "Python packages are outdated. Consider updating them"
else
    print_status "Python dependencies are current"
fi
cd ..

# 4. Check for sensitive files that shouldn't be committed
print_info "4. Checking for sensitive files..."
SENSITIVE_FILES=$(find . -name "*.key" -o -name "*.pem" -o -name "*secret*" -o -name ".env" | grep -v node_modules | grep -v .git)
if [ -n "$SENSITIVE_FILES" ]; then
    print_warning "Sensitive files found:"
    echo "$SENSITIVE_FILES"
    print_info "Ensure these files are in .gitignore and never committed"
else
    print_status "No sensitive files found in working directory"
fi

# 5. Check .gitignore
print_info "5. Checking .gitignore configuration..."
if [ -f ".gitignore" ]; then
    REQUIRED_IGNORES=(".env" "*.key" "*.pem" "__pycache__/" "*.pyc" "node_modules/" ".secrets.*")
    MISSING_IGNORES=()

    for ignore in "${REQUIRED_IGNORES[@]}"; do
        if ! grep -q "$ignore" .gitignore; then
            MISSING_IGNORES+=("$ignore")
        fi
    done

    if [ ${#MISSING_IGNORES[@]} -eq 0 ]; then
        print_status ".gitignore is properly configured"
    else
        print_warning "Missing important entries in .gitignore:"
        printf '  %s\n' "${MISSING_IGNORES[@]}"
    fi
else
    print_error ".gitignore file not found"
fi

# 6. Check Django security settings
print_info "6. Checking Django security settings..."
cd backend

# Check if DEBUG is enabled
DEBUG_CHECK=$(python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); import django; django.setup(); from django.conf import settings; print(settings.DEBUG)" 2>/dev/null)
if [ "$DEBUG_CHECK" = "True" ]; then
    print_warning "DEBUG is enabled. Disable for production"
else
    print_status "DEBUG is properly disabled"
fi

# Check SECRET_KEY
SECRET_KEY=$(python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); import django; django.setup(); from django.conf import settings; print(settings.SECRET_KEY)" 2>/dev/null)
if [[ "$SECRET_KEY" == *"insecure"* ]] || [[ "$SECRET_KEY" == *"change"* ]]; then
    print_warning "SECRET_KEY contains default insecure values"
else
    print_status "SECRET_KEY appears to be properly configured"
fi

cd ..

# 7. Check file permissions
print_info "7. Checking file permissions..."
if [ -f ".env" ]; then
    ENV_PERMS=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
    if [ "$ENV_PERMS" != "600" ]; then
        print_warning ".env file permissions are $ENV_PERMS. Should be 600"
    else
        print_status ".env file has correct permissions"
    fi
fi

# 8. Check for hardcoded secrets
print_info "8. Checking for hardcoded secrets..."
HARD_CODED=$(grep -r "password\|secret\|key\|token" --include="*.py" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "import\|from\|#" | head -5)
if [ -n "$HARD_CODED" ]; then
    print_warning "Potential hardcoded secrets found:"
    echo "$HARD_CODED"
    print_info "Review these and move to environment variables or secrets manager"
else
    print_status "No obvious hardcoded secrets found"
fi

echo ""
print_info "Security Audit Complete!"
echo ""
print_info "Recommendations:"
echo "  • Keep dependencies updated regularly"
echo "  • Use strong, unique passwords for all services"
echo "  • Enable HTTPS in production"
echo "  • Regularly rotate API keys and secrets"
echo "  • Monitor for security vulnerabilities"
echo "  • Use environment variables for sensitive data"
echo "  • Implement proper logging and monitoring"
echo ""
print_status "Security is an ongoing process - review regularly!"
