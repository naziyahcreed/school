#!/usr/bin/env bash
# Vidhya Shakthi — one-time local setup (Ubuntu/Debian)
# Usage: bash scripts/setup-local.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"

echo "==> 1/5 System packages (python venv + pip)..."
if ! dpkg -s python3.12-venv >/dev/null 2>&1 || ! dpkg -s python3-pip >/dev/null 2>&1; then
  echo "    Installing python3.12-venv and python3-pip (sudo required)..."
  sudo apt-get update -qq
  sudo apt-get install -y python3.12-venv python3-pip postgresql-client
else
  echo "    Already installed."
fi

echo "==> 2/5 PostgreSQL database + user..."
if ! pg_isready -h 127.0.0.1 -p 5432 -q; then
  echo "    Starting PostgreSQL (sudo password may be asked)..."
  sudo service postgresql start || sudo systemctl start postgresql
fi
if PGPASSWORD=vidhya psql -h 127.0.0.1 -U vidhya -d vidhya_shakthi -c "SELECT 1" >/dev/null 2>&1; then
  echo "    Database vidhya_shakthi already reachable as user vidhya."
else
  echo "    Creating role/database (sudo password may be asked)..."
  sudo -u postgres psql -f "$ROOT/scripts/init-postgres.sql"
  sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='vidhya_shakthi'" | grep -q 1 \
    || sudo -u postgres psql -c "CREATE DATABASE vidhya_shakthi OWNER vidhya;"
fi
echo "    Applying schema (safe to re-run only on empty DB)..."
if ! PGPASSWORD=vidhya psql -h 127.0.0.1 -U vidhya -d vidhya_shakthi -tc "SELECT 1 FROM information_schema.tables WHERE table_name='schools'" | grep -q 1; then
  PGPASSWORD=vidhya psql -h 127.0.0.1 -U vidhya -d vidhya_shakthi -f "$ROOT/database/schema.sql"
else
  echo "    Tables already exist — skipping schema.sql"
fi

echo "==> 3/5 Python virtual environment..."
cd "$BACKEND"
rm -rf venv
if command -v uv >/dev/null 2>&1; then
  uv venv venv
  uv pip install -r requirements.txt --python venv/bin/python
elif python3 -m venv venv 2>/dev/null; then
  ./venv/bin/pip install --upgrade pip
  ./venv/bin/pip install -r requirements.txt
else
  echo "ERROR: Install uv (curl -LsSf https://astral.sh/uv/install.sh | sh) or: sudo apt install python3.12-venv python3-pip"
  exit 1
fi

echo "==> 4/5 Backend .env..."
if [[ ! -f .env ]]; then
  cp .env.example .env
fi

echo "==> 5/5 Done!"
echo ""
echo "Backend start:"
echo "  cd $BACKEND && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Frontend start (new terminal):"
echo "  cd $ROOT/frontend && npm install && npm run dev"
echo ""
echo "Open: http://localhost:5173  |  API: http://localhost:8000/docs"
