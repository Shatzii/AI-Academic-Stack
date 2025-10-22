#!/bin/bash
echo "🔧 DEBUGGING CHECKLIST STEP BY STEP"

# Source environment
source .env

# Simple check function
check_env_var() {
    local var=$1
    local description=$2
    echo -n "Checking: $description... "
    if [ -n "${!var}" ]; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
        return 1
    fi
}

echo "1. Environment Configuration"
echo "-------------------------------"

echo -n "Checking: Environment configuration file exists... "
if [ -f ".env" ]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

check_env_var "SECRET_KEY" "Django SECRET_KEY is set"
check_env_var "DEBUG" "DEBUG mode is configured"
check_env_var "DATABASE_URL" "Database URL is configured"

echo ""
echo "Script completed successfully"
