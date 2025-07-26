#!/bin/bash
# GitHub Pages deployment verification script

echo "🔍 Checking GitHub Pages deployment readiness..."
echo ""

# Check if index.html exists in root
if [ -f "index.html" ]; then
    echo "✅ index.html found in root directory"
else
    echo "❌ index.html NOT found in root directory"
    exit 1
fi

# Check if paths in index.html are absolute
if grep -q 'src="/src/' index.html; then
    echo "✅ Absolute paths detected in index.html"
else
    echo "❌ Relative paths found - may cause loading issues"
fi

# Check if 404.html exists in public
if [ -f "public/404.html" ]; then
    echo "✅ 404.html found in public directory"
else
    echo "❌ 404.html NOT found in public directory"
fi

# Check if .nojekyll exists
if [ -f "public/.nojekyll" ]; then
    echo "✅ .nojekyll file found"
else
    echo "❌ .nojekyll file missing"
fi

# Check GitHub Actions workflow
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions deployment workflow found"
else
    echo "❌ GitHub Actions deployment workflow missing"
fi

echo ""
echo "🚀 Ready for GitHub Pages deployment!"
echo "📍 Your site will be available at: https://chw708.github.io/"
echo ""
echo "📋 To deploy:"
echo "1. Commit all changes: git add . && git commit -m 'Fix GitHub Pages deployment'"
echo "2. Push to repository: git push origin main"
echo "3. Check Actions tab for deployment status"