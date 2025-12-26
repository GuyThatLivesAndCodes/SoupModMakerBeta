#!/bin/bash
set -e

echo "🔧 SoupModMaker Build Script"
echo "=============================="

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Fix binary permissions
echo "📝 Fixing binary permissions..."
if [ -f "node_modules/7zip-bin/linux/x64/7za" ]; then
    chmod +x node_modules/7zip-bin/linux/x64/7za
fi
if [ -f "node_modules/app-builder-bin/linux/x64/app-builder" ]; then
    chmod +x node_modules/app-builder-bin/linux/x64/app-builder
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run setup

# Build the application
echo "🔨 Building SoupModMaker..."
cd electron-app
npm run build:linux

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Your AppImage is ready at:"
echo "   $(pwd)/release/SoupModMaker-0.1.0-x86_64.AppImage"
echo ""
echo "To run it:"
echo "   chmod +x electron-app/release/SoupModMaker-0.1.0-x86_64.AppImage"
echo "   ./electron-app/release/SoupModMaker-0.1.0-x86_64.AppImage"
