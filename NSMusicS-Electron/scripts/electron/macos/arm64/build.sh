#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../../" && pwd)"
NODE_VERSION="${NSMUSICS_MAC_NODE_VERSION:-18}"
TARGET_ARCH_LABEL="arm64"

echo "[mac][arm64] project root: ${PROJECT_ROOT}"
echo "[mac][arm64] target arch: ${TARGET_ARCH_LABEL}"

cd "${PROJECT_ROOT}"
if [[ "$(node -p 'process.arch')" == "${TARGET_ARCH_LABEL}" ]]; then
  echo "[mac][arm64] building on current arch"
  npm run build
  exit 0
fi

echo "[mac][arm64] switching shell to arm64 to activate Node ${NODE_VERSION} and run build"
NODE_VERSION="${NODE_VERSION}" PROJECT_ROOT="${PROJECT_ROOT}" arch -arm64 zsh <<'ZSH'
set -euo pipefail
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "[mac][arm64] missing nvm.sh under $NVM_DIR" >&2
  exit 1
fi
. "$NVM_DIR/nvm.sh"
if [[ -s "$NVM_DIR/bash_completion" ]]; then
  . "$NVM_DIR/bash_completion"
fi
cd "$PROJECT_ROOT"
export NVM_ARCH=arm64
# Activate arm64 Node (assumes it's already installed). Do not auto-install.
if ! nvm use "${NODE_VERSION}" >/dev/null 2>&1; then
  echo "[mac][arm64] ERROR: Node ${NODE_VERSION} (arm64) is not available in nvm. Please install it before running this script: NVM_ARCH=arm64 nvm install ${NODE_VERSION}" >&2
  exit 1
fi
NODE_ARCH=$(node -p "process.arch" 2>/dev/null || echo unknown)
echo "[mac][arm64] node arch inside switched shell: $NODE_ARCH"
if [[ "$NODE_ARCH" != "arm64" ]]; then
  echo "[mac][arm64] ERROR: active Node is '$NODE_ARCH', expected 'arm64'." >&2
  exit 1
fi

# Only run the packaging command; do not modify dependencies here.
npm run build
ZSH
