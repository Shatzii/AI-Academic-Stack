#!/bin/bash

# Complete Application Build Script
# Builds both frontend (Vite) and backend (esbuild) components

echo "================================================"
echo "  Building AI-Academic-Stack Application"
echo "================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   The build will continue, but runtime may fail without proper configuration."
    echo ""
fi

echo "Starting build process..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Building Frontend (Vite)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Build frontend
vite build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "✅ Frontend build complete"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Building Backend (esbuild)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Build backend
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Backend build failed"
    exit 1
fi

echo ""
echo "✅ Backend build complete"
echo ""

echo "================================================"
echo "✅ Build Successful!"
echo "================================================"
echo ""
echo "Output files:"
echo "  • Frontend: dist/public/"
echo "  • Backend: dist/index.js"
echo ""
echo "Build size:"
du -sh dist/ 2>/dev/null || echo "  • Total: ~$(ls -lh dist/index.js | awk '{print $5}')"
echo ""
echo "Next steps:"
echo "  1. Configure .env file (if not done)"
echo "  2. Set up database: npm run setup:database"
echo "  3. Run migrations: npm run db:push"
echo "  4. Start server: npm start"
echo ""
echo "Or for development:"
echo "  npm run dev"
echo ""
