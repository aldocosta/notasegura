#!/usr/bin/env sh
set -e
npm run lint
npx tsc --noEmit
npm test
npm run test:e2e
npm run build