#!/bin/bash

# OpenEdTex Secrets Setup Script
# This script helps configure all required secrets for the OpenEdTex platform

echo "🔐 OpenEdTex Secrets Configuration"
echo "=================================="
echo ""

# Function to prompt for secret input
prompt_secret() {
    local secret_name=$1
    local description=$2
    local is_required=$3

    if [ "$is_required" = "true" ]; then
        echo "📝 $secret_name (Required): $description"
    else
        echo "📝 $secret_name (Optional): $description"
    fi

    read -p "Enter $secret_name (or press Enter to skip): " secret_value

    if [ -n "$secret_value" ]; then
        python backend/secrets_manager.py store --name "$secret_name" --value "$secret_value"
        echo "✅ $secret_name stored securely"
    else
        if [ "$is_required" = "true" ]; then
            echo "⚠️  Warning: $secret_name is required but was skipped"
        else
            echo "ℹ️  $secret_name skipped"
        fi
    fi
    echo ""
}

# Required secrets
echo "🔑 Configuring Required Secrets:"
echo "---------------------------------"

prompt_secret "SECRET_KEY" "Django secret key for cryptographic signing" "true"
prompt_secret "DB_PASSWORD" "Database password for PostgreSQL" "true"
prompt_secret "EMAIL_HOST_PASSWORD" "Email service password (Gmail/SMTP)" "true"
prompt_secret "AWS_SECRET_ACCESS_KEY" "AWS secret access key for S3 storage" "true"
prompt_secret "JWT_SECRET_KEY" "JWT signing key for authentication" "true"
prompt_secret "ENCRYPTION_KEY" "Encryption key for sensitive data" "true"

# Optional secrets
echo "🔧 Configuring Optional Secrets:"
echo "---------------------------------"

prompt_secret "SENTRY_DSN" "Sentry DSN for error tracking" "false"
prompt_secret "REDIS_PASSWORD" "Redis password for caching" "false"
prompt_secret "SLACK_WEBHOOK_URL" "Slack webhook URL for notifications" "false"

echo ""
echo "🔍 Validating Configuration..."
echo "------------------------------"

python backend/secrets_validator.py

echo ""
echo "✅ Secrets setup complete!"
echo "📋 Next steps:"
echo "   1. Update your .env file with any additional environment variables"
echo "   2. Run database migrations: python backend/manage.py migrate"
echo "   3. Create a superuser: python backend/manage.py createsuperuser"
echo "   4. Start the development server: python backend/manage.py runserver"
echo ""
echo "🚀 Ready for deployment!"
