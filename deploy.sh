#!/bin/bash

echo "🚀 WhatRef.ai Deployment Preparation Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check if .env files exist
echo "🔍 Checking environment configuration..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found"
    echo "   Please create backend/.env with your OpenAI API key"
    echo "   Example: OPENAI_API_KEY=sk-proj-your-key-here"
else
    echo "✅ Backend .env file found"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found (optional for local development)"
else
    echo "✅ Frontend .env file found"
fi

# Check if node_modules exist
echo ""
echo "📦 Checking dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
else
    echo "✅ Backend dependencies installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
else
    echo "✅ Frontend dependencies installed"
fi

# Test build
echo ""
echo "🔨 Testing production build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
    rm -rf build  # Clean up test build
else
    echo "❌ Frontend build failed - check for errors"
fi
cd ..

# Check git status
echo ""
echo "📝 Checking git status..."
if git status --porcelain | grep -q .; then
    echo "⚠️  You have uncommitted changes"
    echo "   Commit your changes before deploying"
    git status --short
else
    echo "✅ Git working directory is clean"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Ensure all checks above are ✅"
echo "2. Push your code to GitHub: git push origin main"
echo "3. Follow the DEPLOYMENT.md guide"
echo "4. Deploy backend to Railway: https://railway.app"
echo "5. Deploy frontend to Vercel: https://vercel.com"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🌟 Your WhatRef.ai app will be live soon!" 