#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
npm run lint
npx tsc --noEmit
npm run build
echo "Backend validation passed"
