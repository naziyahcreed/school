#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"
if [[ ! -d venv/bin ]] || [[ ! -x venv/bin/uvicorn ]]; then
  echo "venv missing. Run first: bash scripts/setup-local.sh"
  exit 1
fi
source venv/bin/activate
exec uvicorn main:app --reload --host 0.0.0.0 --port 8000
