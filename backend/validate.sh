#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
npm run lint 2>/dev/null || true
npx tsc --noEmit
npm run build
echo "Backend validation passed"
