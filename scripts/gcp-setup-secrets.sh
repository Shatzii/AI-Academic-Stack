#!/bin/bash

# GCP Secret Manager Setup Script
# Creates and manages secrets for AI-Academic-Stack

set -e

echo "================================================"
echo "  GCP Secret Manager Setup"
echo "================================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project is set"
    read -p "Enter your GCP Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "Project: $PROJECT_ID"
echo ""

# Enable Secret Manager API
echo "Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com
echo ""

# Function to create or update secret
create_or_update_secret() {
    local secret_name=$1
    local secret_description=$2
    local prompt_message=$3
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$secret_description"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "⚠️  Secret '$secret_name' already exists"
        read -p "Update it? (y/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping $secret_name"
            echo ""
            return
        fi
    else
        echo "Creating new secret: $secret_name"
        gcloud secrets create "$secret_name" \
            --replication-policy="automatic" \
            --project="$PROJECT_ID"
    fi
    
    echo "$prompt_message"
    read -s secret_value
    echo ""
    
    if [ -z "$secret_value" ]; then
        echo "❌ No value provided. Skipping."
        echo ""
        return
    fi
    
    # Add new version
    echo "$secret_value" | gcloud secrets versions add "$secret_name" \
        --data-file=- \
        --project="$PROJECT_ID"
    
    echo "✅ Secret '$secret_name' updated"
    echo ""
}

# Function to auto-generate and store secret
generate_and_store_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$secret_description"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "✅ Secret '$secret_name' already exists"
        echo ""
        return
    fi
    
    echo "Generating secure random value..."
    secret_value=$(openssl rand -hex 32)
    
    gcloud secrets create "$secret_name" \
        --replication-policy="automatic" \
        --project="$PROJECT_ID"
    
    echo "$secret_value" | gcloud secrets versions add "$secret_name" \
        --data-file=- \
        --project="$PROJECT_ID"
    
    echo "✅ Secret '$secret_name' created and stored"
    echo ""
}

echo "Setting up secrets for AI-Academic-Stack..."
echo ""

# 1. Database URL
create_or_update_secret \
    "database-url" \
    "DATABASE_URL - PostgreSQL Connection String" \
    "Enter your PostgreSQL connection string (from Neon, Cloud SQL, etc.):"

# 2. Anthropic API Key
create_or_update_secret \
    "anthropic-api-key" \
    "ANTHROPIC_API_KEY - Claude AI API Key" \
    "Enter your Anthropic API key (from console.anthropic.com):"

# 3. Session Secret (auto-generate)
generate_and_store_secret \
    "session-secret" \
    "SESSION_SECRET - Auto-generated secure random string"

# 4. JWT Secret (auto-generate)
generate_and_store_secret \
    "jwt-secret" \
    "JWT_SECRET - Auto-generated secure random string"

# 5. Optional: OpenAI API Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Optional Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Add OpenAI API key? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    create_or_update_secret \
        "openai-api-key" \
        "OPENAI_API_KEY - OpenAI API Key" \
        "Enter your OpenAI API key:"
fi

read -p "Add SendGrid API key? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    create_or_update_secret \
        "sendgrid-api-key" \
        "SENDGRID_API_KEY - Email Service Key" \
        "Enter your SendGrid API key:"
fi

read -p "Add Stripe API keys? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    create_or_update_secret \
        "stripe-secret-key" \
        "STRIPE_SECRET_KEY - Payment Processing" \
        "Enter your Stripe secret key:"
fi

echo ""
echo "================================================"
echo "  Secrets Setup Complete!"
echo "================================================"
echo ""
echo "Created/updated secrets in project: $PROJECT_ID"
echo ""
echo "To grant access to Cloud Run/App Engine:"
echo ""
echo "  gcloud secrets add-iam-policy-binding database-url \\"
echo "    --member='serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com' \\"
echo "    --role='roles/secretmanager.secretAccessor'"
echo ""
echo "Replace PROJECT_NUMBER with your project number."
echo "Find it with: gcloud projects describe $PROJECT_ID --format='value(projectNumber)'"
echo ""
