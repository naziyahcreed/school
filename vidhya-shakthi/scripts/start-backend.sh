#!/bin/bash
set -e

# Start required database services
service postgresql start
service redis-server start

# Fast execution cache in tmpfs
export PYTHONPYCACHEPREFIX=/tmp/pycache

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"

echo "=================================================="
echo " Starting Vidhya Shakthi OS Backend on port 8000 "
echo " API Docs: http://localhost:8000/docs             "
echo "=================================================="

exec /root/backend_venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
