#!/bin/bash

# Netlify Build Optimization Script
# This script optimizes the build process for Netlify deployment

echo "🚀 Starting Netlify optimized build..."

# Set production environment
export NODE_ENV=production
export VITE_APP_ENV=production

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies with frozen lockfile for reproducible builds
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Run linting (fail build if there are errors)
echo "🔍 Running lint checks..."
npm run lint || exit 1

# Run type checking
echo "📝 Running type checks..."
npm run type-check || exit 1

# Build the application with optimizations
echo "🏗️ Building application..."
npm run build:netlify

# Clean up any potential leftover files (but don't remove JSX files)
echo "🧹 Cleaning up build artifacts..."
find dist -name "*.map" -type f -delete 2>/dev/null || true

# Verify build output
if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist directory not found"
  exit 1
fi

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed - index.html not found in dist"
  exit 1
fi

# Check bundle size (warn if too large)
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "📊 Bundle size: $BUNDLE_SIZE"

# Generate build report
echo "📋 Build completed successfully!"
echo "📁 Build output in: dist/"
echo "🌐 Ready for Netlify deployment"

# List build artifacts
echo "📂 Build artifacts:"
ls -la dist/

echo "✅ Netlify build optimization complete!"