#!/bin/bash
echo "🔍 Simple OpenEdTex Production Readiness Check"
echo "=============================================="

PASSED=0
FAILED=0

check() {
    local desc="$1"
    local cmd="$2"
    
    echo -n "Checking: $desc... "
    if eval "$cmd" > /dev/null 2>&1; then
        echo "✅ PASSED"
        ((PASSED++))
    else
        echo "❌ FAILED"
        ((FAILED++))
    fi
}

# Basic checks
check "Environment file exists" "test -f .env"
check "Backend directory exists" "test -d backend"
check "Frontend directory exists" "test -d src"
check "Package.json exists" "test -f package.json"
check "Django manage.py exists" "test -f backend/manage.py"
check "SSL directory exists" "test -d ssl"
check "Logs directory exists" "test -d logs"

echo ""
echo "Summary: $PASSED passed, $FAILED failed"
