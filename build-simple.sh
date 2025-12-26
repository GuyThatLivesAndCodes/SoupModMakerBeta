#!/bin/bash
set -e

echo "🔧 SoupModMaker Simple Build Script (using electron-packager)"
echo "==============================================================="

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Install electron-packager if not present
if ! npm list -g electron-packager >/dev/null 2>&1; then
    echo "📦 Installing electron-packager globally..."
    npm install -g electron-packager
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build core package
echo "🔨 Building core package..."
npm run build:core

# Build electron app (TypeScript + Vite)
echo "🔨 Building electron app..."
cd electron-app
npm install
npm run build:dir 2>/dev/null || {
    echo "Running tsc and vite build separately..."
    npx tsc
    npx vite build
}
cd ..

# Package with electron-packager (simpler, no 7zip issues!)
echo "📦 Packaging with electron-packager..."
electron-packager electron-app SoupModMaker \
    --platform=linux \
    --arch=x64 \
    --out=electron-app/release-simple \
    --overwrite \
    --electron-version=28.0.0

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Your executable is at:"
find electron-app/release-simple -name "SoupModMaker" -type f -executable
echo ""
echo "To run it, navigate to the folder above and run ./SoupModMaker"
