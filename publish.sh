#!/bin/bash
set -e

# Install vsce if not available
if ! command -v vsce &> /dev/null; then
  echo "Installing @vscode/vsce..."
  npm install -g @vscode/vsce
fi

vsce publish patch
