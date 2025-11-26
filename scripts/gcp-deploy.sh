#!/bin/bash

# Google Cloud Platform Deployment Script for AI-Academic-Stack
# This script helps deploy the application to GCP using various services

set -e

echo "================================================"
echo "  AI-Academic-Stack GCP Deployment"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo ""
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ gcloud CLI found${NC}"
echo ""

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)

if [ -z "$CURRENT_PROJECT" ]; then
    echo -e "${YELLOW}⚠️  No GCP project is currently set${NC}"
    echo ""
    read -p "Enter your GCP Project ID: " PROJECT_ID
    gcloud config set project "$PROJECT_ID"
else
    echo -e "Current project: ${BLUE}$CURRENT_PROJECT${NC}"
    read -p "Use this project? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GCP Project ID: " PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    else
        PROJECT_ID=$CURRENT_PROJECT
    fi
fi

echo ""
echo "================================================"
echo "  Choose Deployment Method"
echo "================================================"
echo ""
echo "1. Google Cloud Run (Recommended)"
echo "   - Fully managed serverless"
echo "   - Auto-scaling"
echo "   - Pay per use"
echo "   - Best for production"
echo ""
echo "2. Google App Engine"
echo "   - Fully managed platform"
echo "   - Auto-scaling"
echo "   - Simpler configuration"
echo ""
echo "3. Google Kubernetes Engine (GKE)"
echo "   - Full container orchestration"
echo "   - Maximum control"
echo "   - Higher cost"
echo ""
echo "4. Compute Engine VM"
echo "   - Traditional VM hosting"
echo "   - Full control"
echo "   - Manual management"
echo ""

read -p "Select deployment method (1-4): " -n 1 -r DEPLOY_METHOD
echo ""
echo ""

case $DEPLOY_METHOD in
    1)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Deploying to Cloud Run${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        # Enable required APIs
        echo "Enabling required APIs..."
        gcloud services enable run.googleapis.com
        gcloud services enable cloudbuild.googleapis.com
        gcloud services enable secretmanager.googleapis.com
        
        echo ""
        echo "Building and deploying to Cloud Run..."
        
        # Build with Cloud Build and deploy to Cloud Run
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
            --port 8080
        
        echo ""
        echo -e "${GREEN}✅ Deployment to Cloud Run complete!${NC}"
        ;;
        
    2)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Deploying to App Engine${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        # Enable App Engine API
        echo "Enabling App Engine API..."
        gcloud services enable appengine.googleapis.com
        
        # Check if App Engine app exists
        if ! gcloud app describe &>/dev/null; then
            echo ""
            echo "Creating App Engine application..."
            read -p "Enter region (e.g., us-central): " REGION
            gcloud app create --region="$REGION"
        fi
        
        echo ""
        echo "Deploying to App Engine..."
        gcloud app deploy app.yaml --quiet
        
        echo ""
        echo -e "${GREEN}✅ Deployment to App Engine complete!${NC}"
        ;;
        
    3)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Deploying to GKE${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        echo "GKE deployment requires a Kubernetes cluster."
        echo "Please refer to GCP-DEPLOYMENT.md for detailed GKE instructions."
        ;;
        
    4)
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}  Deploying to Compute Engine${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        
        echo "Compute Engine deployment requires VM setup."
        echo "Please refer to GCP-DEPLOYMENT.md for detailed VM instructions."
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "  Next Steps"
echo "================================================"
echo ""
echo "1. Set up secrets in Secret Manager:"
echo "   bash scripts/gcp-setup-secrets.sh"
echo ""
echo "2. Configure your database:"
echo "   - Cloud SQL (recommended)"
echo "   - External PostgreSQL (Neon, Supabase)"
echo ""
echo "3. Set environment variables in GCP Console"
echo ""
echo "4. Configure custom domain (optional)"
echo ""
echo "Full documentation: GCP-DEPLOYMENT.md"
echo ""
