#!/bin/bash

# Script to update Framer site content AND CMS data
# Usage: ./update-content.sh [framer-site-url]

set -e

SITE_URL="${1:-https://mongooseproject.org/}"

echo "🔄 Updating site content from Framer..."
echo ""

# Backup current site
if [ -d "site" ] && [ "$(ls -A site)" ]; then
    echo "📦 Creating backup..."
    BACKUP_DIR="site-backup-$(date +%Y%m%d-%H%M%S)"
    cp -r site "$BACKUP_DIR"
    echo "   Backup created: $BACKUP_DIR"
fi

# Remove old site files (except admin/ and .gitkeep) to force fresh download
echo "🧹 Cleaning old site files (keeping admin/ and .gitkeep)..."
if [ -d "site" ]; then
    find site -mindepth 1 -maxdepth 1 ! -name "admin" ! -name ".gitkeep" ! -name ".nojekyll" -exec rm -rf {} +
fi

# Download fresh content
echo ""
./download-site.sh "$SITE_URL"

# Fix directory structure if needed (wget creates mongooseproject.org subdirectory)
if [ -d "site/mongooseproject.org" ]; then
    echo ""
    echo "📁 Fixing directory structure..."
    rm -f site/index.html 2>/dev/null || true
    mv site/mongooseproject.org/* site/
    rmdir site/mongooseproject.org
fi

# Extract COMPLETE CMS data from Framer binary (gets ALL items, not just visible)
echo ""
echo "📊 Extracting complete CMS data from Framer binary..."
python3 scripts/extract-cms-binary.py

# Update list summaries
echo ""
echo "📋 Updating list summaries..."
npm run list-summary

# Run build to inject CMS data into HTML
echo ""
echo "🏗️  Building site..."
npm run build

echo ""
echo "✅ Sync complete!"
echo ""
echo "📝 Review changes:"
echo "   git diff site/ data/"
echo ""
echo "📤 Commit and push:"
echo "   git add site/ data/"
echo "   git commit -m 'Sync from Framer'"
echo "   git push origin main"
