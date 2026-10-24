#!/usr/bin/env sh
# Usage: ./check-approval.sh <change-name>
set -e
CHANGE="$1"
if [ -z "$CHANGE" ]; then
  echo "Usage: $0 <change-name>" >&2
  exit 2
fi
MARKER=".specs/changes/$CHANGE/.approved"
if [ ! -f "$MARKER" ]; then
  echo "BLOCKED: spec not approved ($MARKER missing). Get user approval first." >&2
  exit 1
fi
echo "Approved: $CHANGE"