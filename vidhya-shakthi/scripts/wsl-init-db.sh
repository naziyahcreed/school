#!/bin/bash
set -e

# Start services
service postgresql start
service redis-server start

# Create role vidhya if it doesn't exist
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='vidhya'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE ROLE vidhya WITH LOGIN PASSWORD 'vidhya' SUPERUSER;"

# Create database vidhya_shakthi if it doesn't exist
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='vidhya_shakthi'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE vidhya_shakthi OWNER vidhya;"

# Create extensions
sudo -u postgres psql -d vidhya_shakthi -c 'CREATE EXTENSION IF NOT EXISTS vector;'
sudo -u postgres psql -d vidhya_shakthi -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
sudo -u postgres psql -d vidhya_shakthi -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'

echo "WSL Database initialized successfully!"
