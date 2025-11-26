#!/bin/bash

# Quick GCP Deployment Script - Using Your $300 Credits
# This script deploys AI-Academic-Stack to Google Cloud Run in minutes

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🚀 AI-Academic-Stack - Quick GCP Deployment                ║"
echo "║   Using Your $300 Google Cloud Credits                       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}This script will deploy your app to Cloud Run in 5 minutes!${NC}"
echo ""

# Step 1: Check gcloud installation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/6: Checking gcloud CLI..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v gcloud &> /dev/null; then
    echo ""
    echo -e "${YELLOW}⚠️  gcloud CLI not found. Installing...${NC}"
    echo ""
    
    # Detect OS and provide installation command
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl https://sdk.cloud.google.com | bash
        exec -l $SHELL
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "On macOS, install with:"
        echo "brew install --cask google-cloud-sdk"
        exit 1
    else
        echo "Please install gcloud CLI from:"
        echo "https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
fi

echo -e "${GREEN}✅ gcloud CLI found${NC}"
echo ""

# Step 2: Login and project setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/6: GCP Authentication & Project Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if already logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "Please login to Google Cloud..."
    gcloud auth login
fi

# Get or set project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)

if [ -z "$CURRENT_PROJECT" ]; then
    echo ""
    echo "Available projects:"
    gcloud projects list --format="table(projectId,name)"
    echo ""
    read -p "Enter your GCP Project ID (with $300 credits): " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
else
    echo -e "Current project: ${BLUE}$CURRENT_PROJECT${NC}"
    echo ""
    read -p "Use this project? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        gcloud projects list --format="table(projectId,name)"
        echo ""
        read -p "Enter your GCP Project ID: " PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    else
        PROJECT_ID=$CURRENT_PROJECT
    fi
fi

echo ""
echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"
echo ""

# Step 3: Enable required APIs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/6: Enabling Required APIs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Enabling Cloud Run API..."
gcloud services enable run.googleapis.com --quiet

echo "Enabling Cloud Build API..."
gcloud services enable cloudbuild.googleapis.com --quiet

echo "Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com --quiet

echo ""
echo -e "${GREEN}✅ APIs enabled${NC}"
echo ""

# Step 4: Setup secrets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/6: Setting Up Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
    cp .env.example .env 2>/dev/null || echo ""
fi

# Source .env if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Function to create secret
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
        echo "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID" 2>/dev/null
    else
        gcloud secrets create "$secret_name" --replication-policy="automatic" --project="$PROJECT_ID" --quiet
        echo "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=- --project="$PROJECT_ID"
    fi
}

echo "Setting up required secrets..."
echo ""

# Database URL
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"placeholder"* ]]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "DATABASE_URL Required"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "You need a PostgreSQL database. Free options:"
    echo "  1. Neon: https://neon.tech (Free 0.5GB)"
    echo "  2. Supabase: https://supabase.com (Free 500MB)"
    echo "  3. Cloud SQL: gcloud sql instances create... (~\$7/month)"
    echo ""
    read -p "Enter your PostgreSQL connection string: " DB_URL
    DATABASE_URL=$DB_URL
fi
create_secret "database-url" "$DATABASE_URL"
echo "✅ database-url created"

# Anthropic API Key
if [ -z "$ANTHROPIC_API_KEY" ] || [[ "$ANTHROPIC_API_KEY" == *"placeholder"* ]]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ANTHROPIC_API_KEY Required"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Get your API key from: https://console.anthropic.com"
    echo "(\$5 free credit for new users)"
    echo ""
    read -s -p "Enter your Anthropic API key: " API_KEY
    echo ""
    ANTHROPIC_API_KEY=$API_KEY
fi
create_secret "anthropic-api-key" "$ANTHROPIC_API_KEY"
echo "✅ anthropic-api-key created"

# Session Secret (auto-generate if needed)
if [ -z "$SESSION_SECRET" ] || [[ "$SESSION_SECRET" == *"placeholder"* ]]; then
    SESSION_SECRET=$(openssl rand -hex 32)
fi
create_secret "session-secret" "$SESSION_SECRET"
echo "✅ session-secret created"

# JWT Secret (auto-generate if needed)
if [ -z "$JWT_SECRET" ] || [[ "$JWT_SECRET" == *"placeholder"* ]]; then
    JWT_SECRET=$(openssl rand -hex 32)
fi
create_secret "jwt-secret" "$JWT_SECRET"
echo "✅ jwt-secret created"

echo ""
echo -e "${GREEN}✅ All secrets configured${NC}"
echo ""

# Step 5: Build and Deploy
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/6: Building and Deploying to Cloud Run..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will take 3-5 minutes..."
echo ""

# Deploy to Cloud Run
gcloud run deploy ai-academic-stack \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --min-instances 1 \
    --max-instances 10 \
    --cpu 2 \
    --memory 2Gi \
    --timeout 300 \
    --port 8080 \
    --set-secrets="DATABASE_URL=database-url:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest,SESSION_SECRET=session-secret:latest,JWT_SECRET=jwt-secret:latest" \
    --set-env-vars="NODE_ENV=production,PORT=8080" \
    --quiet

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""

# Step 6: Get service URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6/6: Getting Service Information..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SERVICE_URL=$(gcloud run services describe ai-academic-stack --region us-central1 --format='value(status.url)')

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║             🎉 DEPLOYMENT SUCCESSFUL! 🎉                      ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Your AI-Academic-Stack is now live at:"
echo ""
echo -e "${GREEN}${SERVICE_URL}${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Resource Usage (from your \$300 credits):"
echo ""
echo "  Cloud Run: ~\$20-50/month"
echo "  (You have enough credits for 6-15 months!)"
echo ""
echo "  Estimated credit burn rate: ~\$1.50-2.50/day"
echo "  Your \$300 will last: ~120-200 days"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🛠️  Useful Commands:"
echo ""
echo "  View logs:    npm run gcp:logs"
echo "  Redeploy:     npm run gcp:deploy"
echo "  Open browser: $BROWSER $SERVICE_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo ""
echo "  1. Visit your site: $SERVICE_URL"
echo "  2. Setup custom domain (optional)"
echo "  3. Configure CI/CD (optional)"
echo "  4. Monitor usage in GCP Console"
echo ""
echo "Need help? Read: GCP-DEPLOYMENT.md"
echo ""

# Ask to open browser
read -p "Open site in browser now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v "$BROWSER" &> /dev/null; then
        "$BROWSER" "$SERVICE_URL" &
    else
        xdg-open "$SERVICE_URL" 2>/dev/null || open "$SERVICE_URL" 2>/dev/null || echo "Please open manually: $SERVICE_URL"
    fi
fi

echo ""
echo "Happy teaching! 🎓"
echo ""
