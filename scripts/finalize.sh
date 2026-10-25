#!/usr/bin/env sh
set -e

echo "=== Backend tests ==="
cd backend && npm test && cd ..

echo "=== Frontend tests ==="
cd frontend && npm test && cd ..

echo "=== Delegating E2E to QA Tester ==="
maestri ask "Tester" "Validar E2E (./validate.sh) e reportar."
