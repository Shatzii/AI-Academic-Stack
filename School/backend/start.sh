#!/usr/bin/env bash

# Start script for Railway (Railpack) to run the Django backend
# - Installs dependencies if missing
# - Applies migrations and collects static files
# - Starts Gunicorn bound to $PORT (provided by Railway)

set -euo pipefail

# Move to script directory (backend/)
cd "$(dirname "$0")"

echo "[start.sh] Using Python: $(python -V || true)"

# Ensure pip is available and up to date (safe no-op if already installed)
python -m pip install --upgrade pip >/dev/null 2>&1 || true

echo "[start.sh] Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt

echo "[start.sh] Running database migrations..."
python manage.py migrate --noinput

echo "[start.sh] Collecting static files..."
python manage.py collectstatic --noinput

PORT_TO_BIND=${PORT:-8000}
echo "[start.sh] Starting Gunicorn on port ${PORT_TO_BIND}..."
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:${PORT_TO_BIND} \
  --workers 3
