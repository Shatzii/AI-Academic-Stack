#!/bin/bash
# Netlify Environment Variables Setup Script
# Run this script to set environment variables for universalone.netlify.app

echo "Setting up environment variables for universalone.netlify.app..."
echo ""
echo "Please update the following values in your Netlify dashboard:"
echo "Site Settings > Environment Variables"
echo ""

# Required variables
echo "=== REQUIRED VARIABLES ==="
echo "VITE_API_URL=https://your-backend-api.com/api"
echo "VITE_APP_ENV=production"
echo ""

# Optional variables
echo "=== OPTIONAL VARIABLES ==="
echo "VITE_APP_NAME=OpenEdTex"
echo "VITE_APP_VERSION=2.1.0"
echo "VITE_GA_TRACKING_ID="
echo "VITE_HOTJAR_ID="
echo "VITE_ENABLE_ANALYTICS=true"
echo "VITE_ENABLE_PWA=true"
echo ""

echo "=== INSTRUCTIONS ==="
echo "1. Go to https://app.netlify.com/sites/universalone/settings/env"
echo "2. Click 'Add variable' for each variable above"
echo "3. Replace 'your-backend-api.com' with your actual backend URL"
echo "4. Leave optional variables empty if not using those features"
echo "5. Click 'Deploy site' to trigger a new build with the new variables"
echo ""

echo "⚠️  IMPORTANT: After setting variables, you MUST trigger a new deployment"
echo "   for the changes to take effect!"