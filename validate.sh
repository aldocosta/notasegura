#!/usr/bin/env sh
set -e
echo "=== Backend ==="
cd backend && ./validate.sh && cd ..
echo "=== Frontend ==="
cd frontend && ./validate.sh && cd ..
echo "All gates passed."