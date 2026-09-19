-- Run as PostgreSQL superuser (postgres)
-- Creates Vidhya Shakthi database and app user (idempotent where possible)

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vidhya') THEN
    CREATE ROLE vidhya WITH LOGIN PASSWORD 'vidhya';
  END IF;
END
$$;

-- Database: create manually if missing (run from shell):
--   sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='vidhya_shakthi'" | grep -q 1 \
--     || sudo -u postgres psql -c "CREATE DATABASE vidhya_shakthi OWNER vidhya;"
GRANT ALL PRIVILEGES ON DATABASE vidhya_shakthi TO vidhya;
