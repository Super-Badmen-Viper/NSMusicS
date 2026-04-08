#!/usr/bin/env bash
set -euo pipefail

echo "Env setup (mac arm64) — running in native arm64 shell"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

echo "Ensure Node arm64 ${NODE_VERSION:-18} is available"
export NVM_ARCH=arm64
NVM_ARCH=arm64 nvm install 18 --no-progress || true
nvm use 18 || true

echo "Removing existing node_modules and package-lock.json in project"
rm -rf "$PROJECT_ROOT/node_modules" "$PROJECT_ROOT/package-lock.json" || true

echo "Installing dependencies with cnpm (npmmirror)"
npm i -g cnpm --registry=https://registry.npmmirror.com --no-fund --no-audit || true
cd "$PROJECT_ROOT"
cnpm install --registry=https://registry.npmmirror.com || true

echo "Rebuilding native modules and running build"
cnpm rebuild --update-binary || true
cnpm run build || npm run build

echo "Env setup (mac arm64) completed"
