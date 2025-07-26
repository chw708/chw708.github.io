#!/bin/bash
# Build and deploy script for GitHub Pages

echo "Building Teresa Health for GitHub Pages..."

# Build the project
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Your app is ready for GitHub Pages."
    echo ""
    echo "📁 Built files are in the 'dist' folder:"
    ls -la dist/
    echo ""
    echo "🚀 To deploy to GitHub Pages:"
    echo "1. Push this repository to GitHub"
    echo "2. Go to Settings > Pages in your GitHub repository"
    echo "3. Set Source to 'GitHub Actions'"
    echo "4. The GitHub Actions workflow will automatically deploy your site"
    echo ""
    echo "🌐 Your site will be available at: https://chw708.github.io"
else
    echo "❌ Build failed. Check for errors above."
    exit 1
fi