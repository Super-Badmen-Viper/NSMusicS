#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

echo "[linux] project root: ${PROJECT_ROOT}"

cd "${PROJECT_ROOT}"

echo "[linux] npm run build"
npm run build
