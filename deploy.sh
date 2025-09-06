#!/bin/bash

# UniCraft Production Deployment Script
echo "🚀 Starting UniCraft Production Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - UniCraft waitlist with Google OAuth"
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Please set your GitHub remote URL:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/unicraft-waitlist.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update for production deployment"
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Railway: https://railway.app"
echo "2. Deploy frontend to Netlify: https://netlify.com"
echo "3. Update Google Cloud Console with production URLs"
echo "4. Set environment variables in Railway"
echo ""
echo "📖 See PRODUCTION_DEPLOYMENT_PLAN.md for detailed instructions"
