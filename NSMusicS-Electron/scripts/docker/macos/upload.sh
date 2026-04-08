#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
IMAGE_REPO="${NSMUSICS_DOCKER_IMAGE:-xiangch007/nsmusics}"
HOST_ARCH="$(uname -m)"

if [[ "${HOST_ARCH}" != "arm64" && "${HOST_ARCH}" != "aarch64" ]]; then
  echo "[docker-mac-upload] arm64 host required, current host: ${HOST_ARCH}" >&2
  exit 1
fi

cd "${PROJECT_ROOT}"

echo "[docker-mac-upload] project root: ${PROJECT_ROOT}"
echo "[docker-mac-upload] push: ${IMAGE_REPO}:arm64-pure"
docker push "${IMAGE_REPO}:arm64-pure"

echo "[docker-mac-upload] done: pushed ${IMAGE_REPO}:arm64-pure"
