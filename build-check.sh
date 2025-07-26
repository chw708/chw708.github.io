#!/bin/bash

echo "🔨 Building Teresa Health for GitHub Pages..."

# Clean any existing build
rm -rf dist

# Build the application
npm run build:gh-pages

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Files built to dist/ directory"
    echo "🌐 Ready for GitHub Pages deployment"
    
    # List contents of dist directory
    echo ""
    echo "Built files:"
    ls -la dist/
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi