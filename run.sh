#!/usr/bin/env bash
# MARS 360 - Quick Start Script
set -e

# Detect local node or system node
if [ -d "$PWD/.tools/node/bin" ]; then
  export PATH="$PWD/.tools/node/bin:$PATH"
fi

echo "=========================================================="
echo "  MARS 360 | 2026 NASA Space Apps Challenge Prototype    "
echo "  Scientific Mars Exploration & Marswalk Planning         "
echo "=========================================================="
echo ""
echo "Node version: $(node -v)"
echo "NPM version:  $(npm -v)"
echo ""
echo "Starting Vite development server at http://localhost:3000..."
echo ""

npm run dev -- --host
