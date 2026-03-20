#!/bin/bash
set -e

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Install vsce if not available
if ! command -v vsce &> /dev/null; then
  echo "Installing @vscode/vsce..."
  npm install -g @vscode/vsce
fi

# Delete existing VSIX files
echo "Deleting old .vsix files..."
find . -maxdepth 1 -type f -name "*.vsix" -print -delete

# Compile TypeScript
echo "Compiling..."
npm run compile

# Package the extension
echo "Packaging..."
vsce package

echo "Done."
