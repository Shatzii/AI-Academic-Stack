#!/bin/bash

# Database Setup Script for AI-Academic-Stack
# This script helps set up a free Neon PostgreSQL database

echo "================================================"
echo "  AI-Academic-Stack Database Setup Helper"
echo "================================================"
echo ""
echo "This app requires a PostgreSQL database."
echo ""
echo "RECOMMENDED: Neon Database (Free Tier)"
echo "   - 0.5 GB storage"
echo "   - 100 hours compute/month"
echo "   - Perfect for development and testing"
echo ""
echo "Setup Instructions:"
echo ""
echo "1. Open your browser and visit: https://neon.tech"
echo ""
echo "2. Click 'Sign Up' (free, no credit card required)"
echo ""
echo "3. Create a new project:"
echo "   - Project name: ai-academic-stack"
echo "   - Region: Choose closest to you"
echo "   - PostgreSQL version: Latest (16)"
echo ""
echo "4. Once created, click 'Connection String'"
echo ""
echo "5. Copy the connection string that looks like:"
echo "   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
echo ""
echo "6. Update your .env file:"
echo "   Replace the DATABASE_URL value with your connection string"
echo ""
echo "7. Save the .env file and run:"
echo "   npm run db:push"
echo ""
echo "================================================"
echo ""
echo "Alternative Free Database Providers:"
echo ""
echo "• Supabase: https://supabase.com"
echo "  - 500 MB database"
echo "  - Built-in auth and storage"
echo ""
echo "• Railway: https://railway.app"
echo "  - $5 free credit"
echo "  - Easy deployment"
echo ""
echo "• ElephantSQL: https://elephantsql.com"
echo "  - 20 MB free tier"
echo "  - Good for small projects"
echo ""
echo "================================================"
echo ""

# Check if user wants to open Neon in browser
read -p "Open Neon.tech in your browser now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v "$BROWSER" &> /dev/null; then
        "$BROWSER" "https://neon.tech" &
        echo "✅ Opening Neon.tech in your browser..."
    else
        echo "⚠️  Please manually open: https://neon.tech"
    fi
fi

echo ""
echo "After setting up your database, run:"
echo "  npm run db:push"
echo ""
