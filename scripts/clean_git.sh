#!/bin/bash

# 🧹 Git Repository Cleanup Script for Shatzii Media
# Removes large files from Git history and prevents future uploads

set -e

echo "🚀 Starting Git repository cleanup..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a Git repository. Please run from project root."
    exit 1
fi

# Step 1: Install git-filter-repo if not available
echo "🔧 Checking for git-filter-repo..."
if ! command -v git-filter-repo &> /dev/null; then
    echo "📦 Installing git-filter-repo..."
    sudo apt update && sudo apt install git-filter-repo -y
fi

# Step 2: Backup current state
echo "💾 Creating backup..."
BACKUP_NAME="git-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "../$BACKUP_NAME" . --exclude='.git'
echo "✅ Backup created: ../$BACKUP_NAME"

# Step 3: Clean Git history
echo "🧹 Removing large files from Git history..."
git filter-repo --force \
  --path .next/ \
  --path .config/ \
  --path .vscode-server/ \
  --path .vscode/ \
  --path node_modules/ \
  --path logs/ \
  --path .cache/ \
  --path dist/ \
  --path build/ \
  --path .DS_Store \
  --path uploads/ \
  --invert-paths

# Step 4: Create comprehensive .gitignore
echo "🛡️ Creating bulletproof .gitignore..."
cat << 'EOF' > .gitignore
# Build and Cache
.next/
.vscode/
.vscode-server/
.config/
.cache/
dist/
build/
out/

# Node and Logs
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
logs/

# Runtime and Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# System Files
.DS_Store
*.swp
*~
.tmp/
.temp/

# Package manager lock files
package-lock.json
yarn.lock
pnpm-lock.yaml

# IDE and Editor files
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Version Control and Deployment
.git/
.svn/
.hg/

# OS generated files
Thumbs.db
ehthumbs.db
Desktop.ini

# Backup and archive files
*.bak
*.backup
*.old
*.orig
*.rej
*.tar.gz
*.zip

# Uploads and user content
uploads/
tmp/
.tmp/

# Testing and coverage
coverage/
.nyc_output/
.coverage
htmlcov/

# Database
*.sqlite
*.db

# Large binary files
*.pack
*.idx

# PM2 logs
pm2.log
EOF

# Step 5: Re-initialize repository
echo "🔄 Re-initializing clean repository..."
rm -rf .git
git init
git config user.name "Shatzii Media"
git config user.email "dev@shatzii.com"

# Step 6: Add and commit clean files
echo "📝 Committing clean repository..."
git add .
git commit -m "Clean commit: removed large files and added comprehensive gitignore

- Removed .next/, .config/, .vscode-server/, node_modules/, logs/ from history
- Added bulletproof .gitignore to prevent future large file uploads
- Clean, lean repository ready for production deployment
- All build artifacts and cache files permanently excluded"

# Step 7: Push to GitHub (if remote provided)
if [ "$1" ]; then
    echo "🌍 Pushing to GitHub: $1"
    git remote add origin "$1"
    git branch -M main
    git push -u --force origin main
    echo "✅ Successfully pushed to GitHub!"
else
    echo "ℹ️  To push to GitHub, run: git remote add origin <your-repo-url> && git push -u --force origin main"
fi

# Step 8: Show results
echo ""
echo "✅ CLEANUP COMPLETE!"
echo "🔥 All large files purged from Git history"
echo "🚫 .gitignore now blocks future large file uploads"
echo "💾 Backup available: ../$BACKUP_NAME"
echo "🛡️ Repository ready for collaboration, CI/CD, or deployment"
echo ""
echo "📊 Repository Statistics:"
du -sh .git/ 2>/dev/null && echo "Git directory size: $(du -sh .git/ | cut -f1)" || echo "Git directory: Clean"
echo "Files tracked: $(git ls-files | wc -l)"
echo ""
echo "🎉 Happy coding!"
