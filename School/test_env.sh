#!/bin/bash
echo "🧪 SIMPLE ENVIRONMENT TEST"

# Source environment
source .env

echo "Environment variables loaded:"
echo "SECRET_KEY: ${SECRET_KEY:0:20}..."
echo "DEBUG: $DEBUG"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."

echo ""
echo "Testing check_env_var function:"

check_env_var() {
    local var=$1
    local description=$2
    echo -n "Checking $description: "
    if [ -n "${!var}" ]; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
    fi
}

check_env_var "SECRET_KEY" "SECRET_KEY"
check_env_var "DEBUG" "DEBUG"
check_env_var "DATABASE_URL" "DATABASE_URL"
