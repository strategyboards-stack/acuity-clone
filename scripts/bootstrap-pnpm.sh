#!/usr/bin/env bash
set -euo pipefail

TARGET_VERSION="10.13.1"

if command -v pnpm >/dev/null 2>&1; then
  CURRENT_VERSION="$(pnpm --version || true)"
  if [ "$CURRENT_VERSION" = "$TARGET_VERSION" ]; then
    echo "pnpm $TARGET_VERSION already available"
    exit 0
  fi
fi

if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare "pnpm@${TARGET_VERSION}" --activate
  echo "Activated pnpm via corepack: $(pnpm --version)"
  exit 0
fi

echo "corepack not available and pnpm ${TARGET_VERSION} is not active" >&2
exit 1
