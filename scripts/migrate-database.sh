#!/bin/bash

# Complete Database Migration Script
# Handles database schema creation and initial data seeding

echo "================================================"
echo "  Database Migration & Schema Setup"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "   Please run: npm run setup:env first"
    exit 1
fi

# Source environment variables
set -a
source .env
set +a

# Check if DATABASE_URL is set and not placeholder
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"placeholder"* ]]; then
    echo "❌ Error: DATABASE_URL is not properly configured"
    echo ""
    echo "   Your database URL contains 'placeholder' or is empty."
    echo "   Please set up a real database first."
    echo ""
    echo "   Run: npm run setup:database"
    echo "   Or visit: https://neon.tech to create a free database"
    echo ""
    exit 1
fi

echo "✅ .env file found"
echo "✅ DATABASE_URL is configured"
echo ""
echo "Running database migrations..."
echo ""

# Run drizzle-kit push
npm run db:push

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ Database schema created successfully!"
    echo "================================================"
    echo ""
    echo "Your database is now ready with the following tables:"
    echo "  • users - User accounts and profiles"
    echo "  • api_keys - API key management"
    echo "  • learning_style_results - Learning assessments"
    echo "  • neurotype_results - Neurodiversity profiles"
    echo "  • learning_profiles - Comprehensive learner data"
    echo "  • parent_child_relationships - Family connections"
    echo "  • generated_content - AI-generated materials"
    echo ""
    echo "Next steps:"
    echo "  1. Run: npm install"
    echo "  2. Run: npm run build"
    echo "  3. Run: npm start"
    echo ""
else
    echo ""
    echo "================================================"
    echo "❌ Database migration failed"
    echo "================================================"
    echo ""
    echo "Common issues:"
    echo ""
    echo "1. Invalid DATABASE_URL"
    echo "   • Check your connection string format"
    echo "   • Verify database exists and is accessible"
    echo ""
    echo "2. Network/Connection issues"
    echo "   • Check internet connection"
    echo "   • Verify database service is running"
    echo ""
    echo "3. Permission issues"
    echo "   • Ensure database user has CREATE TABLE permissions"
    echo ""
    echo "Need help? Check .env.setup-guide.md for instructions"
    echo ""
    exit 1
fi
