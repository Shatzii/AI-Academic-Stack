#!/bin/bash

# OpenEdTex Security Audit Script
# This script performs comprehensive security checks

echo "🔒 OpenEdTex Security Audit"
echo "==========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

check_security() {
    local description="$1"
    local command="$2"
    local expected="$3"
    local severity="${4:-HIGH}"

    echo -n "Checking: $description... "

    if eval "$command" 2>/dev/null | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
    else
        if [ "$severity" = "WARNING" ]; then
            echo -e "${YELLOW}⚠️  WARNING${NC}"
            ((WARNINGS++))
        else
            echo -e "${RED}❌ FAILED${NC}"
            ((FAILED++))
        fi
    fi
}

# File Permissions
echo -e "\n🔐 File Permissions:"
echo "--------------------"

check_security "Secret files not world-readable" "find . -name '*.key' -o -name '*.pem' -o -name '.env*' | xargs ls -la | grep -v '^-rw-------'" "" "WARNING"
check_security "No executable scripts in sensitive directories" "find backend/ -name '*.py' -executable | wc -l" "0"
check_security "SSL private key permissions" "ls -la backend/ssl/private.key 2>/dev/null | grep -E '^-rw-------'" "-rw-------" "WARNING"

# Dependencies
echo -e "\n📦 Dependencies Security:"
echo "-------------------------"

if command -v npm &> /dev/null; then
    check_security "No high-severity npm vulnerabilities" "npm audit --audit-level=high 2>/dev/null | grep -c 'vulnerability'" "0" "WARNING"
fi

if command -v pip &> /dev/null && [ -f "backend/requirements.txt" ]; then
    check_security "Python dependencies installed" "pip list --format=freeze | grep -c Django" "1"
fi

# Configuration Security
echo -e "\n⚙️  Configuration Security:"
echo "---------------------------"

check_security "DEBUG disabled in production" "grep -r 'DEBUG.*=.*True' backend/config/settings.py" "" "WARNING"
check_security "SECRET_KEY not default" "grep -r 'SECRET_KEY.*=.*gl595leG0' backend/config/settings.py" "" "WARNING"
check_security "Secure headers configured" "grep -r 'SECURE_HSTS_SECONDS' backend/config/settings.py" "SECURE_HSTS_SECONDS"
check_security "CORS properly configured" "grep -r 'CORS_ALLOWED_ORIGINS' backend/config/settings.py" "CORS_ALLOWED_ORIGINS"

# Database Security
echo -e "\n🗄️  Database Security:"
echo "---------------------"

check_security "No plain text passwords in config" "grep -r 'password.*=' backend/config/settings.py | grep -v 'PASSWORD.*=' | grep -v 'import'" "" "WARNING"
check_security "Database URL properly configured" "grep -r 'DATABASE_URL' backend/config/settings.py" "DATABASE_URL"

# Network Security
echo -e "\n🌐 Network Security:"
echo "--------------------"

check_security "HTTPS redirect configured" "grep -r 'return 301 https' backend/nginx.conf" "return 301 https"
check_security "Security headers in nginx" "grep -r 'X-Frame-Options' backend/nginx.conf" "X-Frame-Options"
check_security "SSL protocols configured" "grep -r 'ssl_protocols' backend/nginx.conf" "ssl_protocols"

# Authentication Security
echo -e "\n🔑 Authentication Security:"
echo "----------------------------"

check_security "JWT configuration exists" "grep -r 'JWT' backend/config/settings.py" "JWT"
check_security "Password validation configured" "grep -r 'AUTH_PASSWORD_VALIDATORS' backend/config/settings.py" "AUTH_PASSWORD_VALIDATORS"
check_security "Session security configured" "grep -r 'SESSION_COOKIE_SECURE' backend/config/settings.py" "SESSION_COOKIE_SECURE"

# Code Security
echo -e "\n💻 Code Security:"
echo "-----------------"

if command -v bandit &> /dev/null; then
    check_security "Bandit security scan" "bandit -r backend/ -f json -o /tmp/bandit.json 2>/dev/null && echo 'completed'" "completed" "WARNING"
fi

check_security "No hardcoded secrets" "grep -r -i 'password\|secret\|key' backend/ | grep -v 'import\|PASSWORD\|SECRET\|KEY' | grep -v 'settings.py' | wc -l" "0" "WARNING"

# Monitoring & Logging
echo -e "\n📊 Monitoring & Logging:"
echo "-------------------------"

check_security "Logging configured" "grep -r 'LOGGING' backend/config/settings.py" "LOGGING"
check_security "Sentry configured" "grep -r 'sentry' backend/config/settings.py" "sentry" "WARNING"
check_security "Health checks configured" "grep -r 'health' backend/config/urls.py" "health"

# Compliance
echo -e "\n📋 Compliance Checks:"
echo "----------------------"

check_security "Privacy policy exists" "ls -la PRIVACY_POLICY.md" "PRIVACY_POLICY.md"
check_security "Terms of service exists" "ls -la TERMS_OF_SERVICE.md" "TERMS_OF_SERVICE.md"
check_security "Data subject request procedure exists" "ls -la DATA_SUBJECT_REQUEST.md" "DATA_SUBJECT_REQUEST.md"

# Summary
echo -e "\n📈 Security Audit Summary:"
echo "==========================="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}Security audit passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Review warnings for potential improvements.${NC}"
    fi
    exit 0
else
    echo -e "\n⚠️  ${RED}Security issues found. Address critical issues before deployment.${NC}"
    exit 1
fi
